import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CONFIG_FILE = path.resolve('data/config.json');
const CANDIDATOS_FILE = path.resolve('data/candidatos.json');

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

  // Sanitizar foto: NUNCA enviar cadenas base64 gigantes que saturen Apps Script o causen 413 / timeouts.
  let fotoValor = 'No adjunta';
  if (candidate.fotoUrl && typeof candidate.fotoUrl === 'string' && (candidate.fotoUrl.startsWith('http') || candidate.fotoUrl.startsWith('/uploads'))) {
    fotoValor = candidate.fotoUrl;
  } else if (candidate.fotoNombre) {
    fotoValor = `Sí adjunta (${candidate.fotoNombre})`;
  } else if (candidate.tieneFoto) {
    fotoValor = 'Sí adjunta';
  } else if (typeof candidate.foto === 'string' && candidate.foto.length > 0 && candidate.foto.length < 300 && !candidate.foto.startsWith('data:image')) {
    fotoValor = candidate.foto;
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
    fotoUrl: candidate.fotoUrl || null,
    fotoNombre: candidate.fotoNombre || null,
    tieneFoto: Boolean(candidate.tieneFoto),
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

  // 1. Endpoint de Salud
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, timestamp: Date.now(), service: 'Tour Azul Backend' });
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

            if (localMap.has(rIdKey)) {
              const idx = localMap.get(rIdKey)!;
              const remoteEstado = r.estado || r.Estado;
              if (remoteEstado && remoteEstado !== localList[idx].estado && remoteEstado !== localList[idx].Estado) {
                localList[idx].estado = remoteEstado;
                localList[idx].Estado = remoteEstado;
                localList[idx].syncedToSheets = true;
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

      if (rawPhoto && typeof rawPhoto === 'string' && rawPhoto.startsWith('data:image')) {
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
          fotoUrl = null;
        }
      } else if (rawPhoto && typeof rawPhoto === 'string' && (rawPhoto.startsWith('http') || rawPhoto.startsWith('/uploads'))) {
        fotoUrl = rawPhoto;
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
        foto: fotoUrl || (data.tieneFoto ? (data.fotoNombre || 'Sí adjunta') : 'No adjunta'),
        fotoUrl,
        fotoNombre: data.fotoNombre || null,
        tieneFoto: Boolean(fotoUrl || data.tieneFoto || rawPhoto),
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
