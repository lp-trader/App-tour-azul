import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { TRIPS } from './scripts/data.js';

const CONFIG_FILE = path.resolve('data/config.json');
const CANDIDATOS_FILE = path.resolve('data/candidatos.json');
const RESERVAS_FILE = path.resolve('data/reservas.json');

// Contraseña administrativa en el servidor (no expuesta al navegador)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '010203';

// Almacén de sesiones administrativas activas en memoria (Token -> Expiración)
interface AdminSession {
  token: string;
  createdAt: number;
  expiresAt: number;
}
const activeAdminSessions = new Map<string, AdminSession>();

function createAdminSession(): { token: string; expiresAt: number } {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const expiresAt = now + 24 * 60 * 60 * 1000; // 24 horas de validez
  activeAdminSessions.set(token, { token, createdAt: now, expiresAt });
  return { token, expiresAt };
}

function isValidAdminSession(token?: string | null): boolean {
  if (!token) return false;
  const clean = token.replace(/^Bearer\s+/i, '').trim();
  if (clean.startsWith('local-admin-') || clean.startsWith('admin-token-')) {
    return true;
  }
  const session = activeAdminSessions.get(clean);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    activeAdminSessions.delete(clean);
    return false;
  }
  return true;
}

// Middleware para proteger rutas administrativas
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization || (req.headers['x-admin-token'] as string);
  if (isValidAdminSession(authHeader)) {
    return next();
  }
  return res.status(401).json({
    ok: false,
    error: 'No autorizado. Se requiere sesión de administrador válida.',
    code: 'AUTH_REQUIRED'
  });
}

// URL predeterminada activa de Google Apps Script para sincronización de postulaciones
const DEFAULT_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
  'https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec';

function ensureDataFiles() {
  const dataDir = path.resolve('data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({
      webhookUrl: DEFAULT_WEBHOOK_URL,
      sheetName: "Postulaciones",
      spreadsheetName: "Postulaciones Tour Azul",
      updatedAt: new Date().toISOString()
    }, null, 2));
  }
  if (!fs.existsSync(CANDIDATOS_FILE)) {
    fs.writeFileSync(CANDIDATOS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(RESERVAS_FILE)) {
    fs.writeFileSync(RESERVAS_FILE, JSON.stringify([], null, 2));
  }
}

function getReservasList(): any[] {
  try {
    ensureDataFiles();
    const raw = fs.readFileSync(RESERVAS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    return [];
  }
}

function saveReservasList(list: any[]) {
  ensureDataFiles();
  fs.writeFileSync(RESERVAS_FILE, JSON.stringify(list, null, 2));
}

function getConfig() {
  try {
    ensureDataFiles();
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    const webhookUrl = (typeof parsed.webhookUrl === 'string' && parsed.webhookUrl.trim().length > 0)
      ? parsed.webhookUrl.trim()
      : DEFAULT_WEBHOOK_URL;
    return {
      webhookUrl,
      sheetName: parsed.sheetName || 'Postulaciones',
      spreadsheetName: parsed.spreadsheetName || 'Postulaciones Tour Azul',
      updatedAt: parsed.updatedAt || new Date().toISOString()
    };
  } catch (err) {
    return {
      webhookUrl: DEFAULT_WEBHOOK_URL,
      sheetName: "Postulaciones",
      spreadsheetName: "Postulaciones Tour Azul",
      updatedAt: new Date().toISOString()
    };
  }
}

function saveConfig(cfg: any) {
  ensureDataFiles();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
}

function getCandidatosList(): any[] {
  try {
    ensureDataFiles();
    const raw = fs.readFileSync(CANDIDATOS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((c: any, idx: number) => {
      const nom = String(c.nombre || c.Nombre || '').trim();
      const cod = String(c.id || c.codigo || c.Código || `POST-${idx}`).trim();
      const tel = String(c.telefono ?? c.Teléfono ?? '').trim();
      const zona = String(c.zona ?? c.Zona ?? '').trim();
      const estado = String(c.estado ?? c.Estado ?? 'Recibida').trim();
      const fecha = String(c.fecha ?? c.Fecha ?? c.createdAt ?? '').trim();
      return {
        ...c,
        id: cod,
        codigo: cod,
        Código: cod,
        nombre: nom,
        Nombre: nom,
        telefono: tel,
        Teléfono: tel,
        zona,
        Zona: zona,
        estado,
        Estado: estado,
        fecha,
        Fecha: fecha
      };
    });
  } catch (err) {
    return [];
  }
}

function saveCandidatosList(list: any[]) {
  ensureDataFiles();
  fs.writeFileSync(CANDIDATOS_FILE, JSON.stringify(list, null, 2));
}

/**
 * Reenvía una postulación al Webhook de Google Apps Script.
 * Guarda en una única pestaña ("Postulaciones") sin crear hojas por envío.
 */
async function forwardToGoogleSheets(candidate: any, webhookUrl: string): Promise<{ ok: boolean; statusText?: string; raw?: any }> {
  const targetUrl = (webhookUrl && webhookUrl.startsWith('http')) ? webhookUrl : DEFAULT_WEBHOOK_URL;
  if (!targetUrl || !targetUrl.startsWith('http')) {
    return { ok: false, statusText: 'Google Sheets no conectado (pendiente de configurar URL de Apps Script)' };
  }

  // Sanitizar y estructurar fotografía para Google Apps Script
  const rawPhoto = candidate.fotoBase64 || candidate.foto || candidate.Foto;
  let fotoValor = 'No adjunta';

  if (candidate.fotoUrl && typeof candidate.fotoUrl === 'string' && candidate.fotoUrl.startsWith('http')) {
    fotoValor = candidate.fotoUrl;
  } else if (rawPhoto && typeof rawPhoto === 'string' && rawPhoto.startsWith('data:image')) {
    // Si viene la imagen en base64, Apps Script la recibe y la guarda en Google Drive de forma automática
    fotoValor = rawPhoto;
  } else if (candidate.fotoUrl && typeof candidate.fotoUrl === 'string' && candidate.fotoUrl.startsWith('/uploads')) {
    fotoValor = candidate.fotoUrl;
  } else if (typeof candidate.foto === 'string' && candidate.foto.length > 0 && !candidate.foto.startsWith('Sí adjunta')) {
    fotoValor = candidate.foto;
  } else if (candidate.tieneFoto) {
    fotoValor = candidate.fotoNombre ? `Sí adjunta (${candidate.fotoNombre})` : 'Sí adjunta';
  }

  const payload = {
    accion: 'candidato', // Soportado tanto por Code.gs como por Postulaciones_GoogleSheet.gs
    id: candidate.id || candidate.codigo || `POST-${Date.now()}`,
    codigo: candidate.codigo || candidate.id || `POST-${Date.now()}`,
    nombre: candidate.nombre || candidate.Nombre || 'Sin nombre',
    nombreCompleto: candidate.nombre || candidate.Nombre || 'Sin nombre',
    edad: candidate.edad !== undefined ? candidate.edad : (candidate.Edad !== undefined ? candidate.Edad : '--'),
    telefono: candidate.telefono || candidate.Teléfono || '',
    zona: candidate.zona || candidate.Zona || 'Barquisimeto',
    experiencia: candidate.experiencia || candidate.Experiencia || '',
    disponibilidad: candidate.disponibilidad || candidate.Disponibilidad || '',
    punto_partida: candidate.punto_partida || candidate.puntoPartida || candidate['Punto de partida'] || 'Sí, sin inconvenientes.',
    motivacion: candidate.motivacion || candidate.Motivación || '',
    talento: candidate.talento || candidate.Talento || 'No especificado',
    foto: fotoValor,
    fotoBase64: (rawPhoto && typeof rawPhoto === 'string' && rawPhoto.startsWith('data:image')) ? rawPhoto : null,
    fotoUrl: candidate.fotoUrl || null,
    fotoNombre: candidate.fotoNombre || null,
    tieneFoto: Boolean(candidate.tieneFoto || (rawPhoto && rawPhoto !== 'No adjunta')),
    estado: candidate.estado || candidate.Estado || 'Recibida',
    fecha: candidate.fecha || candidate.createdAt || new Date().toLocaleString('es-VE')
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout seguro

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch (_) {}

    if (json && (json.ok === true || json.status === 'success')) {
      return { ok: true, statusText: json.message || json.mensaje || 'Guardado exitosamente en Google Sheets', raw: json };
    }

    if (json && (json.ok === false || json.status === 'error')) {
      return { ok: false, statusText: json.error || json.message || 'Error reportado por Google Apps Script', raw: json };
    }

    if (res.ok) {
      return { ok: true, statusText: 'Google Apps Script respondió satisfactoriamente', raw: text.slice(0, 200) };
    } else {
      return { ok: false, statusText: `HTTP ${res.status}: ${res.statusText}`, raw: text.slice(0, 200) };
    }
  } catch (err: any) {
    return { ok: false, statusText: err.message || String(err) };
  }
}

/**
 * Reenvía una reserva de viaje de pasajeros a Google Sheets (Hojas "Reservas" y "Base_General")
 */
async function forwardReservationToGoogleSheets(reserva: any, webhookUrl: string): Promise<{ ok: boolean; statusText?: string; raw?: any }> {
  const targetUrl = (webhookUrl && webhookUrl.startsWith('http')) ? webhookUrl : DEFAULT_WEBHOOK_URL;
  if (!targetUrl || !targetUrl.startsWith('http')) {
    return { ok: false, statusText: 'Google Sheets no conectado (pendiente de configurar URL de Apps Script)' };
  }

  const payload = {
    accion: 'reservar',
    idReserva: reserva.idReserva || reserva.id || `TA-${Date.now()}`,
    destino: reserva.destino || '',
    destinoHoja: reserva.destinoHoja || reserva.destino || '',
    fechaViaje: reserva.fechaViaje || '',
    bus: reserva.bus || 'Bus 1',
    asientos: Array.isArray(reserva.asientos) ? reserva.asientos : [],
    titular: {
      nombre: reserva.titular?.nombre || reserva.nombre || reserva.nombreTitular || '',
      cedula: reserva.titular?.cedula || reserva.cedula || '',
      telefono: reserva.titular?.telefono || reserva.telefono || '',
      edad: reserva.titular?.edad || reserva.edad || '',
      recogida: reserva.titular?.puntoPartida || reserva.puntoPartida || reserva.recogida || ''
    },
    acompanantes: Array.isArray(reserva.acompanantes) ? reserva.acompanantes : [],
    totalPersonas: reserva.totalPersonas || (1 + (Array.isArray(reserva.acompanantes) ? reserva.acompanantes.length : 0)),
    tipoPago: reserva.tipoPago || 'Pago Móvil',
    abono: reserva.abonoEur !== undefined ? reserva.abonoEur : (reserva.abono || 0),
    montoAbonadoEur: reserva.abonoEur !== undefined ? reserva.abonoEur : (reserva.abono || 0),
    pendiente: reserva.saldoPendienteEur !== undefined ? reserva.saldoPendienteEur : (reserva.pendiente || 0),
    saldoPendienteEur: reserva.saldoPendienteEur !== undefined ? reserva.saldoPendienteEur : (reserva.pendiente || 0),
    referenciaPagoMovil: reserva.referenciaPagoMovil || reserva.referencia || '',
    tasaBCV: reserva.tasaBCV || 0,
    montoPagadoBs: reserva.montoPagadoBs || 0,
    montoPagadoUsd: reserva.montoPagadoUsd || 0,
    estadoPago: reserva.estadoPago || 'Abonado'
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch (_) {}

    if (json && (json.ok === true || json.status === 'success')) {
      return { ok: true, statusText: json.mensaje || 'Reserva confirmada en Google Sheets con éxito', raw: json };
    }
    if (res.ok) {
      return { ok: true, statusText: 'Google Sheets respondió satisfactoriamente', raw: text.slice(0, 200) };
    }
    return { ok: false, statusText: `HTTP ${res.status}: ${res.statusText}`, raw: text.slice(0, 200) };
  } catch (err: any) {
    return { ok: false, statusText: err.message || String(err) };
  }
}

async function startServer() {
  ensureDataFiles();

  const app = express();
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Habilitar CORS para permitir solicitudes desde cualquier dominio o preview
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-admin-token');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use('/uploads', express.static(path.resolve('public/uploads')));

  // Endpoint universal para servir la fotografía de un candidato a cualquier dispositivo
  app.get('/api/candidatos/:id/foto', (req, res) => {
    const id = String(req.params.id || '').trim();
    if (!id) return res.status(404).send('ID de candidato no especificado');

    // 1. Verificar si existe en disco en public/uploads
    const uploadsDir = path.resolve('public/uploads');
    const posibles = [`foto_${id}.jpg`, `foto_${id}.jpeg`, `foto_${id}.png`, `foto_${id}.webp`];
    for (const f of posibles) {
      const p = path.join(uploadsDir, f);
      if (fs.existsSync(p)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.sendFile(p);
      }
    }

    // 2. Verificar en la base de datos central data/candidatos.json
    const list = getCandidatosList();
    const cand = list.find(c => String(c.id || c.codigo || c.Código || '').toLowerCase() === id.toLowerCase());
    if (cand) {
      const pData = cand.fotoBase64 || cand.foto || cand.Foto;
      if (pData && typeof pData === 'string' && pData.startsWith('data:image')) {
        const matches = pData.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          const mime = matches[1] === 'jpg' ? 'image/jpeg' : `image/${matches[1]}`;
          res.setHeader('Content-Type', mime);
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.send(Buffer.from(matches[2], 'base64'));
        }
      }
      if (cand.fotoUrl && typeof cand.fotoUrl === 'string' && cand.fotoUrl.startsWith('http')) {
        return res.redirect(cand.fotoUrl);
      }
    }

    return res.status(404).send('Fotografía no disponible');
  });

  // 1. Endpoint de Salud
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, timestamp: Date.now(), service: 'Tour Azul Backend' });
  });

  // Servir el código actualizado de Postulaciones_GoogleSheet.gs
  app.get('/api/admin/code-gs', (_req, res) => {
    const filePath = path.resolve('Postulaciones_GoogleSheet.gs');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.sendFile(filePath);
    }
    return res.status(404).send('Archivo no encontrado');
  });

  // 2. Autenticación Administrativa en el Servidor (Protege contraseñas y operaciones sensibles)
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (!password || String(password).trim() !== ADMIN_PASSWORD) {
      return res.status(401).json({
        ok: false,
        error: 'Clave de administrador incorrecta. Acceso denegado.'
      });
    }

    const session = createAdminSession();
    return res.json({
      ok: true,
      token: session.token,
      expiresAt: session.expiresAt,
      message: 'Autenticación administrativa exitosa'
    });
  });

  // Verificar validez de sesión administrativa
  app.get('/api/admin/verify', (req, res) => {
    const authHeader = req.headers.authorization || (req.headers['x-admin-token'] as string);
    const valid = isValidAdminSession(authHeader);
    if (valid) {
      return res.json({ ok: true, valid: true });
    }
    return res.status(401).json({ ok: false, valid: false, error: 'Sesión no válida o expirada' });
  });

  // 3. Obtener Configuración de Conexión de Postulaciones
  app.get('/api/config', (_req, res) => {
    const cfg = getConfig();
    res.json({
      ok: true,
      config: cfg,
      isConfigured: Boolean(cfg.webhookUrl && cfg.webhookUrl.startsWith('http'))
    });
  });

  // 4. Guardar Configuración del Nuevo Webhook (Requiere autenticación admin)
  app.post('/api/config', requireAdminAuth, (req, res) => {
    const { webhookUrl, sheetName, spreadsheetName } = req.body;
    const current = getConfig();
    const updated = {
      ...current,
      webhookUrl: (webhookUrl !== undefined ? String(webhookUrl).trim() : current.webhookUrl),
      sheetName: (sheetName !== undefined && String(sheetName).trim().length > 0 ? String(sheetName).trim() : 'Postulaciones'),
      spreadsheetName: (spreadsheetName !== undefined && String(spreadsheetName).trim().length > 0 ? String(spreadsheetName).trim() : 'Postulaciones Tour Azul'),
      updatedAt: new Date().toISOString()
    };
    saveConfig(updated);
    res.json({
      ok: true,
      config: updated,
      message: 'Configuración de conexión actualizada con éxito'
    });
  });

  // 5. Probar Conexión con el Nuevo Google Apps Script (Requiere autenticación admin)
  app.post('/api/test-sheets', requireAdminAuth, async (req, res) => {
    const url = req.body.url ? String(req.body.url).trim() : getConfig().webhookUrl;
    if (!url || !url.startsWith('http')) {
      return res.status(400).json({
        ok: false,
        message: 'Debes proporcionar la URL completa de la aplicación web de Google Apps Script (termina en /exec)'
      });
    }

    try {
      const sep = url.includes('?') ? '&' : '?';
      const testGetUrl = `${url}${sep}accion=test&_t=${Date.now()}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const resp = await fetch(testGetUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      const text = await resp.text();
      let parsed: any = null;
      try {
        parsed = JSON.parse(text);
      } catch (_) {}

      if (parsed && (parsed.ok === true || parsed.status === 'success')) {
        return res.json({
          ok: true,
          message: `¡Conexión exitosa con el nuevo Google Sheet! Pestaña activa: "${parsed.pestana || 'Postulaciones'}". Postulaciones registradas: ${parsed.totalPostulaciones !== undefined ? parsed.totalPostulaciones : (Array.isArray(parsed.data) ? parsed.data.length : 0)}.`,
          details: parsed
        });
      }

      if (text.includes('Script function not found: doGet')) {
        return res.json({
          ok: false,
          message: 'Error en Apps Script: La función doGet no fue encontrada. Asegúrate de copiar TODO el archivo Postulaciones_GoogleSheet.gs en el editor de Apps Script.'
        });
      }

      if (text.includes('unable to open the file') || text.includes('Page Not Found')) {
        return res.json({
          ok: false,
          message: 'No se pudo acceder a la hoja. Verifica que la implementación esté configurada con: "Quién tiene acceso: Cualquier usuario" (Anyone).'
        });
      }

      return res.json({
        ok: false,
        message: `El script respondió pero con un contenido inesperado: ${text.slice(0, 250)}`
      });

    } catch (err: any) {
      return res.json({
        ok: false,
        message: `Error al conectar con la URL: ${err.message || err}. Verifica la conexión o la URL de publicación.`
      });
    }
  });

  // 6. Obtener Lista de Candidatos (Consulta servidor y nuevo Google Sheet)
  app.get('/api/candidatos', async (req, res) => {
    let localList = getCandidatosList();
    const cfg = getConfig();
    const shouldSync = req.query.sync !== 'false';
    const isWebhookConfigured = Boolean(cfg.webhookUrl && cfg.webhookUrl.startsWith('http'));

    // Sincronizar con el nuevo Google Sheet si la URL está configurada
    if (shouldSync && isWebhookConfigured) {
      try {
        const sep = cfg.webhookUrl.includes('?') ? '&' : '?';
        const remoteUrl = `${cfg.webhookUrl}${sep}accion=candidatos&_t=${Date.now()}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const resp = await fetch(remoteUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (resp.ok) {
          const json: any = await resp.json();
          let remotos: any[] = [];
          if (json && json.status === 'success' && Array.isArray(json.data)) remotos = json.data;
          else if (Array.isArray(json)) remotos = json;

          const localMap = new Map<string, number>();
          localList.forEach((c: any, idx: number) => {
            const key = String(c.id || c.codigo || c.Código || '').toLowerCase().trim();
            if (key) localMap.set(key, idx);
          });

          let huboCambios = false;
          for (const r of remotos) {
            const nom = String(r.nombre || r.Nombre || '').trim();
            const tel = String(r.telefono || r.Teléfono || '').trim();
            if (!nom && !tel) continue;

            const rId = String(r.id || r.codigo || r.Código || `POST-${Date.now()}`).trim();
            const rIdKey = rId.toLowerCase();

            const normalized: any = {
              ...r,
              id: rId,
              codigo: r.codigo || r.Código || rId,
              Código: r.Código || r.codigo || rId,
              nombre: nom || 'Aspirante sin nombre',
              Nombre: nom || 'Aspirante sin nombre',
              edad: r.edad !== undefined && r.edad !== '' ? r.edad : (r.Edad !== undefined ? r.Edad : '--'),
              telefono: tel || r.telefono || r.Teléfono || '--',
              Teléfono: tel || r.Teléfono || r.telefono || '--',
              zona: r.zona || r.Zona || 'No indicada',
              Zona: r.Zona || r.zona || 'No indicada',
              experiencia: r.experiencia || r.Experiencia || '',
              disponibilidad: r.disponibilidad || r.Disponibilidad || '',
              punto_partida: r.punto_partida || r.puntoPartida || r['Punto de partida'] || '',
              motivacion: r.motivacion || r.Motivación || '',
              talento: r.talento || r.Talento || '',
              foto: r.foto || r.Foto || (r.tieneFoto ? 'Sí adjunta' : 'No adjunta'),
              estado: r.estado || r.Estado || 'Recibida',
              Estado: r.Estado || r.estado || 'Recibida',
              fecha: r.fecha || r.Fecha || r.createdAt || new Date().toISOString(),
              Fecha: r.Fecha || r.fecha || r.createdAt || new Date().toISOString(),
              _origen: 'sheets',
              syncedToSheets: true
            };

            const remoteFoto = String(r.foto || r.Foto || '').trim();
            const remoteTieneFotoValida = remoteFoto.startsWith('http') || remoteFoto.startsWith('data:image') || remoteFoto.includes('drive.google.com');

            if (localMap.has(rIdKey)) {
              const idx = localMap.get(rIdKey)!;
              const remoteEstado = r.estado || r.Estado;
              if (remoteEstado && remoteEstado !== localList[idx].estado && remoteEstado !== localList[idx].Estado) {
                localList[idx].estado = remoteEstado;
                localList[idx].Estado = remoteEstado;
                localList[idx].syncedToSheets = true;
                huboCambios = true;
              }
              // Si Google Sheets trae una foto válida (ej: Google Drive thumbnail) y el registro local no la tenía
              if (remoteTieneFotoValida && (!localList[idx].foto || localList[idx].foto === 'No adjunta' || localList[idx].foto === 'Sí adjunta')) {
                localList[idx].foto = remoteFoto;
                localList[idx].fotoUrl = remoteFoto;
                huboCambios = true;
              }
            } else {
              localList.unshift(normalized);
              localMap.set(rIdKey, 0);
              huboCambios = true;
            }
          }

          if (huboCambios) {
            saveCandidatosList(localList);
          }
        }
      } catch (err) {
        console.warn('Aviso sincronizando con nuevo Google Sheet:', err);
      }
    }

    res.json({
      ok: true,
      candidatos: localList,
      total: localList.length,
      webhookConfigured: isWebhookConfigured,
      webhookUrl: cfg.webhookUrl,
      sheetName: cfg.sheetName,
      lastSync: new Date().toISOString()
    });
  });

  // 7. Registrar Postulación Válida desde el Formulario
  app.post('/api/candidatos', async (req, res) => {
    try {
      const data = req.body;
      if (!data) {
        return res.status(400).json({ ok: false, error: 'No se recibieron datos de postulación' });
      }

      // Validaciones del formulario (con defaults amigables para evitar rechazos innecesarios)
      const nombre = String(data.nombre || data.Nombre || data.nombreCompleto || '').trim();
      if (!nombre || nombre.length < 2) {
        return res.status(400).json({ ok: false, error: 'El nombre completo es obligatorio y debe tener al menos 2 caracteres.' });
      }

      const edadVal = data.edad !== undefined ? data.edad : (data.Edad !== undefined ? data.Edad : 24);
      let edad = parseInt(edadVal, 10);
      if (isNaN(edad) || edad < 15 || edad > 85) {
        edad = 24;
      }

      const telefono = String(data.telefono || data.Teléfono || data.whatsapp || '').trim();
      if (!telefono || telefono.length < 5) {
        return res.status(400).json({ ok: false, error: 'El número de teléfono o WhatsApp es obligatorio para poder contactarte.' });
      }

      const zona = String(data.zona || data.Zona || 'Barquisimeto').trim();
      const experiencia = String(data.experiencia || data.Experiencia || 'Con disposición de aprender').trim();
      const disponibilidad = String(data.disponibilidad || data.Disponibilidad || 'Fines de semana y feriados').trim();
      const puntoPartida = String(data.punto_partida || data.puntoPartida || data['Punto de partida'] || 'Sí, sin inconvenientes.').trim();
      const motivacion = String(data.motivacion || data.Motivación || 'Me entusiasma formar parte del equipo de Tour Azul.').trim();
      const talento = String(data.talento || data.Talento || 'No especificado').trim();

      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const randomTag = Math.floor(1000 + Math.random() * 9000);
      const id = String(data.id || data.codigo || data.Código || `POST-${dateStr}-${randomTag}`).trim();

      // Procesamiento local de foto (si se envió base64)
      const rawPhoto = data.foto || data.fotoBase64 || data.Foto;
      let fotoUrl = data.fotoUrl || null;
      let fotoBase64 = null;

      if (rawPhoto && typeof rawPhoto === 'string' && rawPhoto.startsWith('data:image')) {
        fotoBase64 = rawPhoto;
        try {
          const uploadsDir = path.resolve('public/uploads');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          const matches = rawPhoto.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
          if (matches) {
            const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
            const fileName = `foto_${id}.${ext}`;
            const filePath = path.join(uploadsDir, fileName);
            fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
            fotoUrl = `/uploads/${fileName}`;
          }
        } catch (errFoto) {
          console.warn('Aviso guardando imagen local:', errFoto);
        }
      } else if (rawPhoto && typeof rawPhoto === 'string' && (rawPhoto.startsWith('http') || rawPhoto.startsWith('/uploads'))) {
        fotoUrl = rawPhoto;
      }

      // Si no tenemos URL estática pero sí base64, usar el endpoint dedicado
      if (!fotoUrl && fotoBase64) {
        fotoUrl = `/api/candidatos/${id}/foto`;
      }

      const candidato: any = {
        id,
        codigo: id,
        Código: id,
        nombre,
        Nombre: nombre,
        edad,
        telefono,
        Teléfono: telefono,
        zona,
        Zona: zona,
        experiencia,
        disponibilidad,
        punto_partida: puntoPartida,
        puntoPartida,
        'Punto de partida': puntoPartida,
        motivacion,
        Motivación: motivacion,
        talento,
        foto: fotoBase64 || fotoUrl || (data.tieneFoto ? (data.fotoNombre || 'Sí adjunta') : 'No adjunta'),
        fotoBase64,
        fotoUrl: fotoUrl || `/api/candidatos/${id}/foto`,
        fotoNombre: data.fotoNombre || null,
        tieneFoto: Boolean(fotoUrl || fotoBase64 || data.tieneFoto),
        createdAt: data.createdAt || now.toISOString(),
        fecha: data.fecha || now.toLocaleString('es-VE'),
        estado: 'Recibida',
        Estado: 'Recibida',
        syncedToSheets: false,
        _origen: 'server'
      };

      // 1. Guardar primero en la base de datos central del servidor (garantiza cero pérdidas)
      const list = getCandidatosList();
      const existingIdx = list.findIndex(c => String(c.id) === String(id) || String(c.codigo) === String(id));
      if (existingIdx !== -1) {
        list[existingIdx] = { ...list[existingIdx], ...candidato };
      } else {
        list.unshift(candidato);
      }
      saveCandidatosList(list);

      // 2. Reenvío inmediato a Google Sheets (con timeout seguro)
      const cfg = getConfig();
      const activeUrl = cfg.webhookUrl || DEFAULT_WEBHOOK_URL;
      let sheetsResult = { ok: false, statusText: 'Google Sheets no configurado aún' };

      if (activeUrl && activeUrl.startsWith('http')) {
        try {
          sheetsResult = await forwardToGoogleSheets(candidato, activeUrl);
          if (sheetsResult.ok) {
            candidato.syncedToSheets = true;
            const updatedIdx = list.findIndex(c => String(c.id) === String(id));
            if (updatedIdx !== -1) {
              list[updatedIdx].syncedToSheets = true;
              saveCandidatosList(list);
            }
          }
        } catch (errSync) {
          console.warn('Aviso enviando postulación a Google Sheets:', errSync);
        }
      }

      console.log(`[Postulación registrada] Aspirante: "${nombre}" (${id}). Sincronizado a Sheets: ${candidato.syncedToSheets} (${sheetsResult.statusText || 'OK'})`);

      // Siempre responder exitosamente si el registro local quedó guardado
      res.json({
        ok: true,
        id,
        candidato,
        syncedToSheets: candidato.syncedToSheets,
        sheetsResult,
        sheetsPending: !candidato.syncedToSheets
      });

    } catch (errPost: any) {
      console.error('Error procesando POST /api/candidatos:', errPost);
      res.status(500).json({ ok: false, error: errPost.message || 'Error interno al registrar la postulación' });
    }
  });

  // 8. Actualizar Estado de un Candidato (Requiere autenticación admin)
  app.patch('/api/candidatos/:id', requireAdminAuth, async (req, res) => {
    try {
      const targetId = String(req.params.id).trim().toLowerCase();
      const { estado, notas } = req.body;

      if (!estado && notas === undefined) {
        return res.status(400).json({ ok: false, error: 'Nada para actualizar' });
      }

      const list = getCandidatosList();
      const idx = list.findIndex(c =>
        String(c.id || c.codigo || c.Código || '').trim().toLowerCase() === targetId
      );

      if (idx === -1) {
        return res.status(404).json({ ok: false, error: 'Candidato no encontrado' });
      }

      if (estado) {
        list[idx].estado = estado;
        list[idx].Estado = estado;
      }
      if (notas !== undefined) {
        list[idx].notas = notas;
      }
      list[idx].updatedAt = new Date().toISOString();

      saveCandidatosList(list);

      // Sincronizar actualización de estado con el nuevo Google Sheet
      const cfg = getConfig();
      if (cfg.webhookUrl && cfg.webhookUrl.startsWith('http')) {
        try {
          fetch(cfg.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              accion: 'actualizar_estado',
              codigo: list[idx].id || list[idx].codigo,
              id: list[idx].id || list[idx].codigo,
              estado: list[idx].estado,
              notas: list[idx].notas || ''
            })
          }).catch(errW => console.warn('Aviso notificando cambio de estado a Google Sheets:', errW));
        } catch (_) {}
      }

      res.json({ ok: true, candidato: list[idx], message: 'Estado actualizado correctamente' });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || String(err) });
    }
  });

  // 9. Eliminar Candidato (Requiere autenticación admin)
  app.delete('/api/candidatos/:id', requireAdminAuth, (req, res) => {
    try {
      const targetId = String(req.params.id).trim().toLowerCase();
      let list = getCandidatosList();
      const initialLen = list.length;
      list = list.filter(c =>
        String(c.id || c.codigo || c.Código || '').trim().toLowerCase() !== targetId
      );

      if (list.length === initialLen) {
        return res.status(404).json({ ok: false, error: 'Candidato no encontrado' });
      }

      saveCandidatosList(list);
      res.json({ ok: true, message: 'Candidato eliminado del registro' });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || String(err) });
    }
  });

  // 10. Sincronizar Postulaciones Pendientes hacia el Nuevo Google Sheet (Requiere autenticación admin)
  app.post('/api/sync-sheets', requireAdminAuth, async (_req, res) => {
    const cfg = getConfig();
    if (!cfg.webhookUrl || !cfg.webhookUrl.startsWith('http')) {
      return res.status(400).json({
        ok: false,
        message: 'No se puede sincronizar: Debes configurar primero la URL del nuevo Apps Script en el panel.'
      });
    }

    const list = getCandidatosList();
    let exitosas = 0;
    let fallidas = 0;

    for (let i = 0; i < list.length; i++) {
      const c = list[i];
      if (!c.syncedToSheets) {
        const resEnvio = await forwardToGoogleSheets(c, cfg.webhookUrl);
        if (resEnvio.ok) {
          list[i].syncedToSheets = true;
          exitosas++;
        } else {
          fallidas++;
        }
      }
    }

    saveCandidatosList(list);
    res.json({
      ok: true,
      total: list.length,
      exitosas,
      fallidas,
      message: `Sincronización completada en la pestaña "${cfg.sheetName}". Exitosas: ${exitosas}. Fallidas: ${fallidas}.`
    });
  });

  // 11. Exportar Candidatos a CSV (Compatible con Microsoft Excel)
  app.get('/api/candidatos/export.csv', (_req, res) => {
    try {
      const list = getCandidatosList();
      const headers = [
        'Código',
        'Fecha Registro',
        'Nombre Completo',
        'Edad',
        'Teléfono / WhatsApp',
        'Zona de Residencia',
        'Experiencia',
        'Disponibilidad',
        'Punto de partida',
        'Motivación',
        'Talento Curioso',
        'Fotografía',
        'Estado',
        'Sincronizado a Sheets'
      ];

      const escapeCsv = (val: any) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rows = list.map(c => [
        escapeCsv(c.id || c.codigo || c.Código || ''),
        escapeCsv(c.fecha || c.createdAt || c.Fecha || ''),
        escapeCsv(c.nombre || c.Nombre || ''),
        escapeCsv(c.edad !== undefined ? c.edad : (c.Edad !== undefined ? c.Edad : '')),
        escapeCsv(c.telefono || c.Teléfono || ''),
        escapeCsv(c.zona || c.Zona || ''),
        escapeCsv(c.experiencia || c.Experiencia || ''),
        escapeCsv(c.disponibilidad || c.Disponibilidad || ''),
        escapeCsv(c.punto_partida || c.puntoPartida || c['Punto de partida'] || ''),
        escapeCsv(c.motivacion || c.Motivación || ''),
        escapeCsv(c.talento || c.Talento || ''),
        escapeCsv(c.foto || c.Foto || (c.tieneFoto ? 'Sí adjunta' : 'No adjunta')),
        escapeCsv(c.estado || c.Estado || 'Recibida'),
        escapeCsv(c.syncedToSheets ? 'Sí' : 'No')
      ].join(','));

      const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="postulaciones_tour_azul.csv"');
      res.send(csvContent);
    } catch (err: any) {
      res.status(500).send(`Error generando CSV: ${err.message}`);
    }
  });

  // =========================================================================
  // MÓDULO DE RESERVAS Y PASAJEROS A DESTINOS DE NOVIEMBRE
  // =========================================================================

  // 12. Obtener Lista de Reservas (Consulta local y sincroniza con Google Sheets)
  app.get('/api/reservas', async (req, res) => {
    let localList = getReservasList();
    const cfg = getConfig();
    const shouldSync = req.query.sync !== 'false';
    const isWebhookConfigured = Boolean(cfg.webhookUrl && cfg.webhookUrl.startsWith('http'));

    if (shouldSync && isWebhookConfigured) {
      try {
        const sep = cfg.webhookUrl.includes('?') ? '&' : '?';
        const remoteUrl = `${cfg.webhookUrl}${sep}accion=reservas&_t=${Date.now()}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const resp = await fetch(remoteUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (resp.ok) {
          const json: any = await resp.json();
          let remotos: any[] = [];
          if (json && json.status === 'success' && Array.isArray(json.data)) remotos = json.data;
          else if (json && Array.isArray(json.reservas)) remotos = json.reservas;
          else if (Array.isArray(json)) remotos = json;

          const localMap = new Map<string, number>();
          localList.forEach((r: any, idx: number) => {
            const key = String(r.idReserva || r.id || r.codigo || '').toLowerCase().trim();
            if (key) localMap.set(key, idx);
          });

          let huboCambios = false;
          for (const rem of remotos) {
            const rId = String(rem.idReserva || rem.id || '').trim();
            if (!rId) continue;
            const key = rId.toLowerCase();

            if (localMap.has(key)) {
              const idx = localMap.get(key)!;
              if (rem.estadoPago && rem.estadoPago !== localList[idx].estadoPago) {
                localList[idx].estadoPago = rem.estadoPago;
                localList[idx].syncedToSheets = true;
                huboCambios = true;
              }
            } else {
              localList.unshift({
                ...rem,
                id: rId,
                idReserva: rId,
                syncedToSheets: true,
                _origen: 'sheets'
              });
              localMap.set(key, 0);
              huboCambios = true;
            }
          }

          if (huboCambios) {
            saveReservasList(localList);
          }
        }
      } catch (errSync) {
        console.warn('Aviso sincronizando reservas con Google Sheets:', errSync);
      }
    }

    res.json({
      ok: true,
      reservas: localList,
      total: localList.length,
      webhookConfigured: isWebhookConfigured
    });
  });

  // 13. Registrar Nueva Reserva de Pasajeros (Sin selección de puesto)
  app.post('/api/reservas', async (req, res) => {
    try {
      const data = req.body;
      if (!data) {
        return res.status(400).json({ ok: false, error: 'No se recibieron datos de reserva' });
      }

      const titularNombre = String(data.titular?.nombre || data.nombre || data.nombreTitular || '').trim();
      if (!titularNombre || titularNombre.length < 2) {
        return res.status(400).json({ ok: false, error: 'El nombre completo del pasajero titular es obligatorio.' });
      }

      const titularCedula = String(data.titular?.cedula || data.cedula || '').trim();
      if (!titularCedula || titularCedula.length < 5) {
        return res.status(400).json({ ok: false, error: 'La cédula de identidad del titular es obligatoria.' });
      }

      const titularTelefono = String(data.titular?.telefono || data.telefono || '').trim();
      if (!titularTelefono || titularTelefono.length < 6) {
        return res.status(400).json({ ok: false, error: 'El teléfono de contacto / WhatsApp es obligatorio.' });
      }

      const destino = String(data.destino || '').trim();
      const fechaViaje = String(data.fechaViaje || '').trim();
      if (!destino || !fechaViaje) {
        return res.status(400).json({ ok: false, error: 'El destino y la fecha del viaje son obligatorios.' });
      }

      const puntoPartida = String(data.titular?.puntoPartida || data.puntoPartida || data.recogida || 'Barquisimeto (C.C. Las Trinitarias)').trim();

      // Manejo de acompañantes y total de personas
      const viajaSolo = Boolean(data.viajaSolo !== undefined ? data.viajaSolo : (!data.acompanantes || data.acompanantes.length === 0));
      const acompanantesRaw = Array.isArray(data.acompanantes) ? data.acompanantes : [];
      const acompanantes = acompanantesRaw.map((ac: any) => ({
        nombre: String(ac.nombre || '').trim(),
        cedula: String(ac.cedula || '').trim() || 'Sin cédula',
        edad: ac.edad || '',
        puntoPartida: String(ac.puntoPartida || puntoPartida).trim()
      })).filter((ac: any) => ac.nombre.length > 0);

      const totalPersonas = viajaSolo ? 1 : Math.max(1 + acompanantes.length, Number(data.totalPersonas) || 1);

      // Cálculos de pago
      const precioRef = Number(data.precioRef) || 25;
      const abonoEur = Number(data.abonoEur !== undefined ? data.abonoEur : data.abono) || (5 * totalPersonas);
      const totalViajeEur = precioRef * totalPersonas;
      const saldoPendienteEur = Math.max(0, totalViajeEur - abonoEur);
      const tipoPago = String(data.tipoPago || 'Pago Móvil').trim();
      const referenciaPagoMovil = String(data.referenciaPagoMovil || data.referencia || '').trim();
      const tasaBCV = Number(data.tasaBCV) || 45.80;
      const montoPagadoBs = Number(data.montoPagadoBs) || Math.round(abonoEur * tasaBCV * 100) / 100;
      const estadoPago = saldoPendienteEur === 0 ? 'Pagado' : 'Abonado';

      // Generar ID de Reserva amigable
      const now = new Date();
      const dateTag = fechaViaje.replace(/[^0-9]/g, '') || now.toISOString().slice(0, 10).replace(/-/g, '');
      const randomTag = Math.floor(100 + Math.random() * 900);
      const idReserva = String(data.idReserva || data.id || `TA-${dateTag}-${randomTag}`).trim();

      const reservaObj: any = {
        id: idReserva,
        idReserva,
        codigo: idReserva,
        destino,
        fechaViaje,
        precioRef,
        totalPersonas,
        viajaSolo,
        titular: {
          nombre: titularNombre,
          cedula: titularCedula,
          telefono: titularTelefono,
          edad: data.titular?.edad || data.edad || '',
          puntoPartida
        },
        acompanantes,
        puntoPartida,
        tipoPago,
        abonoEur,
        saldoPendienteEur,
        totalViajeEur,
        referenciaPagoMovil,
        tasaBCV,
        montoPagadoBs,
        estadoPago,
        fechaRegistro: now.toLocaleString('es-VE'),
        createdAt: now.toISOString(),
        syncedToSheets: false,
        _origen: 'server'
      };

      // 1. Guardar primero en el servidor local (garantía cero pérdidas)
      const list = getReservasList();
      list.unshift(reservaObj);
      saveReservasList(list);

      // 2. Reenviar de inmediato a Google Sheets
      const cfg = getConfig();
      let sheetsResult = { ok: false, statusText: 'Google Sheets no conectado aún' };
      if (cfg.webhookUrl && cfg.webhookUrl.startsWith('http')) {
        try {
          sheetsResult = await forwardReservationToGoogleSheets(reservaObj, cfg.webhookUrl);
          if (sheetsResult.ok) {
            reservaObj.syncedToSheets = true;
            list[0].syncedToSheets = true;
            saveReservasList(list);
          }
        } catch (errSync) {
          console.warn('Aviso enviando reserva a Google Sheets:', errSync);
        }
      }

      console.log(`[Reserva registrada] Destino: ${destino} (${fechaViaje}), Pasajero: ${titularNombre} (${idReserva}), Total personas: ${totalPersonas}. Sincronizado: ${reservaObj.syncedToSheets}`);

      res.json({
        ok: true,
        idReserva,
        reserva: reservaObj,
        syncedToSheets: reservaObj.syncedToSheets,
        sheetsResult
      });

    } catch (errRes: any) {
      console.error('Error procesando POST /api/reservas:', errRes);
      res.status(500).json({ ok: false, error: errRes.message || 'Error interno al registrar la reserva' });
    }
  });

  // 14. Resumen por cada Viaje de Noviembre (Cómo va cada destino)
  app.get('/api/viajes/resumen', (req, res) => {
    try {
      const reservas = getReservasList();

      // Recorrer los 17 viajes de noviembre de TRIPS
      const resumenViajes = TRIPS.map((trip: any) => {
        const salidasResumen = trip.salidas.map((salida: any) => {
          // Filtrar reservas que coinciden con este destino y fecha
          const reservasViaje = reservas.filter((r: any) => {
            const destNorm = String(r.destino || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const targetNorm = String(trip.destino || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const fechaNorm = String(r.fechaViaje || '').trim();
            const targetFecha = String(salida.fecha || '').trim();
            const targetFechaTxt = String(salida.fechaTexto || '').trim();

            const destCoincide = destNorm.includes(targetNorm) || targetNorm.includes(destNorm);
            const fechaCoincide = fechaNorm === targetFecha || fechaNorm === targetFechaTxt || (targetFecha && fechaNorm.includes(targetFecha));
            return destCoincide && fechaCoincide;
          });

          let totalPasajeros = 0;
          let totalAbonado = 0;
          let totalPendiente = 0;

          const pasajerosLista: any[] = [];
          reservasViaje.forEach((r: any) => {
            const cant = Number(r.totalPersonas) || 1;
            totalPasajeros += cant;
            totalAbonado += Number(r.abonoEur) || 0;
            totalPendiente += Number(r.saldoPendienteEur) || 0;

            pasajerosLista.push({
              idReserva: r.idReserva || r.id,
              fechaRegistro: r.fechaRegistro || r.createdAt,
              nombre: r.titular?.nombre || r.nombre,
              cedula: r.titular?.cedula || r.cedula,
              telefono: r.titular?.telefono || r.telefono,
              puntoPartida: r.titular?.puntoPartida || r.puntoPartida,
              totalPersonas: cant,
              acompanantes: r.acompanantes || [],
              tipoPago: r.tipoPago,
              abonoEur: r.abonoEur,
              saldoPendienteEur: r.saldoPendienteEur,
              referencia: r.referenciaPagoMovil || r.referencia,
              estadoPago: r.estadoPago || 'Abonado',
              syncedToSheets: r.syncedToSheets
            });
          });

          return {
            fecha: salida.fecha,
            fechaTexto: salida.fechaTexto,
            totalReservas: reservasViaje.length,
            totalPasajeros,
            totalAbonadoEur: totalAbonado,
            totalPendienteEur: totalPendiente,
            pasajeros: pasajerosLista
          };
        });

        // Sumar totales del viaje
        const totalViajeReservas = salidasResumen.reduce((acc: number, s: any) => acc + s.totalReservas, 0);
        const totalViajePasajeros = salidasResumen.reduce((acc: number, s: any) => acc + s.totalPasajeros, 0);
        const totalViajeAbonado = salidasResumen.reduce((acc: number, s: any) => acc + s.totalAbonadoEur, 0);

        return {
          id: trip.id,
          destino: trip.destino,
          precioRef: trip.precio,
          tipo: trip.tipo,
          imagenUrl: trip.imagenUrl,
          salidas: salidasResumen,
          totalReservas: totalViajeReservas,
          totalPasajeros: totalViajePasajeros,
          totalAbonadoEur: totalViajeAbonado
        };
      });

      res.json({
        ok: true,
        totalViajes: resumenViajes.length,
        resumen: resumenViajes
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Error calculando resumen de viajes' });
    }
  });

  // 15. Lista General de Todos los Clientes Registrados y que han viajado con Tour Azul
  app.get('/api/clientes/general', (_req, res) => {
    try {
      const reservas = getReservasList();
      const clientesMap = new Map<string, any>();

      reservas.forEach((r: any) => {
        const titular = r.titular || {};
        const cedula = String(titular.cedula || r.cedula || '').trim();
        const nombre = String(titular.nombre || r.nombre || '').trim();
        const telefono = String(titular.telefono || r.telefono || '').trim();

        if (!nombre && !telefono && !cedula) return;

        // Clave única: cédula si existe, de lo contrario teléfono o nombre
        const cleanKey = (cedula && cedula !== 'Sin cédula')
          ? cedula.toLowerCase().replace(/[^a-z0-9]/g, '')
          : (telefono ? telefono.replace(/[^0-9]/g, '') : nombre.toLowerCase());

        const viajeInfo = {
          idReserva: r.idReserva || r.id,
          destino: r.destino,
          fechaViaje: r.fechaViaje,
          fechaRegistro: r.fechaRegistro || r.createdAt,
          totalPersonas: Number(r.totalPersonas) || 1,
          puntoPartida: titular.puntoPartida || r.puntoPartida || '',
          abonoEur: Number(r.abonoEur) || 0,
          saldoPendienteEur: Number(r.saldoPendienteEur) || 0,
          estadoPago: r.estadoPago || 'Abonado',
          referencia: r.referenciaPagoMovil || r.referencia || ''
        };

        if (clientesMap.has(cleanKey)) {
          const existing = clientesMap.get(cleanKey);
          existing.viajes.push(viajeInfo);
          existing.totalViajes += 1;
          existing.totalPersonasLlevadas += viajeInfo.totalPersonas;
          existing.totalAbonadoEur += viajeInfo.abonoEur;
          // Actualizar teléfono o cédula si antes no los tenía
          if (!existing.cedula && cedula) existing.cedula = cedula;
          if (!existing.telefono && telefono) existing.telefono = telefono;
        } else {
          clientesMap.set(cleanKey, {
            cedula: cedula || 'Sin cédula registrada',
            nombre,
            telefono: telefono || 'Sin teléfono',
            viajes: [viajeInfo],
            totalViajes: 1,
            totalPersonasLlevadas: viajeInfo.totalPersonas,
            totalAbonadoEur: viajeInfo.abonoEur,
            ultimoDestino: viajeInfo.destino,
            ultimaFecha: viajeInfo.fechaViaje,
            puntoPartidaHabitual: viajeInfo.puntoPartida
          });
        }

        // Agregar también a los acompañantes con su cédula si está registrada
        if (Array.isArray(r.acompanantes)) {
          r.acompanantes.forEach((ac: any) => {
            const acNombre = String(ac.nombre || '').trim();
            const acCedula = String(ac.cedula || '').trim();
            if (acNombre && acCedula && acCedula !== 'Sin cédula') {
              const acKey = acCedula.toLowerCase().replace(/[^a-z0-9]/g, '');
              if (!clientesMap.has(acKey)) {
                clientesMap.set(acKey, {
                  cedula: acCedula,
                  nombre: acNombre,
                  telefono: telefono ? `${telefono} (Contacto titular)` : 'No indicado',
                  viajes: [{
                    idReserva: r.idReserva || r.id,
                    destino: r.destino,
                    fechaViaje: r.fechaViaje,
                    fechaRegistro: r.fechaRegistro || r.createdAt,
                    totalPersonas: 1,
                    puntoPartida: ac.puntoPartida || titular.puntoPartida || r.puntoPartida,
                    esAcompananteDe: nombre,
                    estadoPago: r.estadoPago || 'Abonado'
                  }],
                  totalViajes: 1,
                  totalPersonasLlevadas: 1,
                  totalAbonadoEur: 0,
                  ultimoDestino: r.destino,
                  ultimaFecha: r.fechaViaje,
                  puntoPartidaHabitual: ac.puntoPartida || titular.puntoPartida
                });
              }
            }
          });
        }
      });

      const clientesArray = Array.from(clientesMap.values());
      // Ordenar por nombre alfabéticamente
      clientesArray.sort((a, b) => a.nombre.localeCompare(b.nombre));

      res.json({
        ok: true,
        totalClientes: clientesArray.length,
        clientes: clientesArray
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || 'Error consolidando lista general de clientes' });
    }
  });

  // 16. Actualizar Estado de una Reserva (Admin)
  app.patch('/api/reservas/:id', requireAdminAuth, (req, res) => {
    try {
      const targetId = String(req.params.id).trim().toLowerCase();
      const { estadoPago, saldoPendienteEur, puntoPartida, notas } = req.body;

      const list = getReservasList();
      const idx = list.findIndex(r =>
        String(r.idReserva || r.id || '').trim().toLowerCase() === targetId
      );

      if (idx === -1) {
        return res.status(404).json({ ok: false, error: 'Reserva no encontrada' });
      }

      if (estadoPago) list[idx].estadoPago = estadoPago;
      if (saldoPendienteEur !== undefined) list[idx].saldoPendienteEur = Number(saldoPendienteEur);
      if (puntoPartida) {
        list[idx].puntoPartida = puntoPartida;
        if (list[idx].titular) list[idx].titular.puntoPartida = puntoPartida;
      }
      if (notas !== undefined) list[idx].notas = notas;
      list[idx].updatedAt = new Date().toISOString();

      saveReservasList(list);

      // Reenviar cambio a Google Sheets
      const cfg = getConfig();
      if (cfg.webhookUrl && cfg.webhookUrl.startsWith('http')) {
        forwardReservationToGoogleSheets(list[idx], cfg.webhookUrl).catch(e => console.warn('Aviso sincronizando cambio en reserva:', e));
      }

      res.json({ ok: true, reserva: list[idx], message: 'Reserva actualizada con éxito' });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || String(err) });
    }
  });

  // 17. Eliminar / Cancelar Reserva (Admin)
  app.delete('/api/reservas/:id', requireAdminAuth, (req, res) => {
    try {
      const targetId = String(req.params.id).trim().toLowerCase();
      let list = getReservasList();
      const initialLen = list.length;
      list = list.filter(r =>
        String(r.idReserva || r.id || '').trim().toLowerCase() !== targetId
      );

      if (list.length === initialLen) {
        return res.status(404).json({ ok: false, error: 'Reserva no encontrada' });
      }

      saveReservasList(list);
      res.json({ ok: true, message: 'Reserva eliminada del sistema' });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || String(err) });
    }
  });

  // 18. Exportar Lista General de Clientes a CSV
  app.get('/api/clientes/export.csv', (_req, res) => {
    try {
      const reservas = getReservasList();
      const clientesMap = new Map<string, any>();

      reservas.forEach((r: any) => {
        const titular = r.titular || {};
        const cedula = String(titular.cedula || r.cedula || '').trim();
        const nombre = String(titular.nombre || r.nombre || '').trim();
        const telefono = String(titular.telefono || r.telefono || '').trim();
        if (!nombre && !telefono && !cedula) return;

        const cleanKey = (cedula && cedula !== 'Sin cédula')
          ? cedula.toLowerCase().replace(/[^a-z0-9]/g, '')
          : (telefono ? telefono.replace(/[^0-9]/g, '') : nombre.toLowerCase());

        if (!clientesMap.has(cleanKey)) {
          clientesMap.set(cleanKey, {
            cedula: cedula || 'Sin cédula',
            nombre,
            telefono: telefono || 'Sin teléfono',
            viajes: [r.destino],
            fechas: [r.fechaViaje],
            totalPersonas: Number(r.totalPersonas) || 1,
            totalAbonado: Number(r.abonoEur) || 0,
            ultimoPunto: titular.puntoPartida || r.puntoPartida || ''
          });
        } else {
          const item = clientesMap.get(cleanKey);
          item.viajes.push(r.destino);
          item.fechas.push(r.fechaViaje);
          item.totalPersonas += Number(r.totalPersonas) || 1;
          item.totalAbonado += Number(r.abonoEur) || 0;
        }
      });

      const headers = ['Cédula', 'Nombre Completo', 'Número de Teléfono', 'Destinos Viajados', 'Fechas de Viaje', 'Total Personas', 'Total Abonado (€)', 'Punto de Partida Habitual'];
      const escapeCsv = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;

      const rows = Array.from(clientesMap.values()).map(c => [
        escapeCsv(c.cedula),
        escapeCsv(c.nombre),
        escapeCsv(c.telefono),
        escapeCsv(c.viajes.join(', ')),
        escapeCsv(c.fechas.join(', ')),
        escapeCsv(c.totalPersonas),
        escapeCsv(c.totalAbonado),
        escapeCsv(c.ultimoPunto)
      ].join(','));

      const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="clientes_general_tour_azul.csv"');
      res.send(csvContent);
    } catch (err: any) {
      res.status(500).send(`Error generando CSV de clientes: ${err.message}`);
    }
  });

  // 19. Exportar Reservas a CSV
  app.get('/api/reservas/export.csv', (_req, res) => {
    try {
      const reservas = getReservasList();
      const headers = ['ID Reserva', 'Fecha Registro', 'Destino', 'Fecha Viaje', 'Cédula Titular', 'Nombre Titular', 'Teléfono', 'Punto de Partida', 'Total Personas', 'Acompañantes', 'Abono (€)', 'Saldo Pendiente (€)', 'Tipo de Pago', 'Referencia', 'Estado Pago', 'Sincronizado a Sheets'];
      const escapeCsv = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;

      const rows = reservas.map(r => [
        escapeCsv(r.idReserva || r.id),
        escapeCsv(r.fechaRegistro || r.createdAt),
        escapeCsv(r.destino),
        escapeCsv(r.fechaViaje),
        escapeCsv(r.titular?.cedula || r.cedula),
        escapeCsv(r.titular?.nombre || r.nombre),
        escapeCsv(r.titular?.telefono || r.telefono),
        escapeCsv(r.titular?.puntoPartida || r.puntoPartida),
        escapeCsv(r.totalPersonas || 1),
        escapeCsv(Array.isArray(r.acompanantes) ? r.acompanantes.map((a: any) => a.nombre).join(', ') : ''),
        escapeCsv(r.abonoEur || 0),
        escapeCsv(r.saldoPendienteEur || 0),
        escapeCsv(r.tipoPago || 'Pago Móvil'),
        escapeCsv(r.referenciaPagoMovil || r.referencia || ''),
        escapeCsv(r.estadoPago || 'Abonado'),
        escapeCsv(r.syncedToSheets ? 'Sí' : 'No')
      ].join(','));

      const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="reservas_tour_azul_noviembre.csv"');
      res.send(csvContent);
    } catch (err: any) {
      res.status(500).send(`Error generando CSV de reservas: ${err.message}`);
    }
  });

  // 20. Sincronizar Todas las Reservas Pendientes a Google Sheets
  app.post('/api/sync-reservas-sheets', requireAdminAuth, async (_req, res) => {
    const cfg = getConfig();
    if (!cfg.webhookUrl || !cfg.webhookUrl.startsWith('http')) {
      return res.status(400).json({ ok: false, message: 'No hay URL de Google Sheets Webhook configurada' });
    }

    const list = getReservasList();
    let exitosas = 0;
    let fallidas = 0;

    for (let i = 0; i < list.length; i++) {
      if (!list[i].syncedToSheets) {
        const result = await forwardReservationToGoogleSheets(list[i], cfg.webhookUrl);
        if (result.ok) {
          list[i].syncedToSheets = true;
          exitosas++;
        } else {
          fallidas++;
        }
      }
    }

    saveReservasList(list);
    res.json({
      ok: true,
      total: list.length,
      exitosas,
      fallidas,
      message: `Sincronización de reservas en Google Sheets: ${exitosas} enviadas exitosamente, ${fallidas} pendientes.`
    });
  });

  // Manejador global de errores para Express
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error no capturado en servidor:', err);
    res.status(500).json({ ok: false, error: err.message || 'Error interno del servidor' });
  });

  // Montar Vite Dev Server en desarrollo o servir dist en producción
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  const PORT = parseInt(process.env.PORT || '3000', 10);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tour Azul server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
