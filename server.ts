import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.resolve('data/config.json');
const CANDIDATOS_FILE = path.resolve('data/candidatos.json');

function ensureDataFiles() {
  const dataDir = path.resolve('data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({
      webhookUrl: "https://script.google.com/macros/s/AKfycbylCyLwuyD_HJ90eYYw8Fle1kAOi-b9mQGmTjrORJKv6-WJv0o1wg1N1sKhkXDpbMHEVw/exec",
      sheetName: "Tour Azul Postulaciones",
      spreadsheetName: "Registro Tour Azul"
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
    return JSON.parse(raw);
  } catch (err) {
    return {
      webhookUrl: "https://script.google.com/macros/s/AKfycbylCyLwuyD_HJ90eYYw8Fle1kAOi-b9mQGmTjrORJKv6-WJv0o1wg1N1sKhkXDpbMHEVw/exec",
      sheetName: "Tour Azul Postulaciones",
      spreadsheetName: "Registro Tour Azul"
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
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function saveCandidatosList(list: any[]) {
  ensureDataFiles();
  fs.writeFileSync(CANDIDATOS_FILE, JSON.stringify(list, null, 2));
}

/**
 * Reenvía una postulación al Webhook de Google Apps Script (hoja "Tour Azul Postulaciones" en "Registro Tour Azul")
 */
async function forwardToGoogleSheets(candidate: any, webhookUrl: string): Promise<{ ok: boolean; statusText?: string }> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { ok: false, statusText: 'URL de webhook inválida' };
  }

  // Sanitizar foto: Google Sheets permite máximo 50.000 caracteres por celda.
  // No enviar cadenas base64 gigantes que rompen el appendRow de Apps Script.
  let fotoSanitizada = candidate.foto || candidate.Foto || (candidate.tieneFoto ? 'Sí adjunta' : 'No adjunta');
  if (typeof fotoSanitizada === 'string' && fotoSanitizada.length > 500) {
    fotoSanitizada = candidate.fotoNombre ? `Sí adjunta (${candidate.fotoNombre})` : 'Sí adjunta (imagen seleccionada)';
  }

  const payload = {
    accion: 'postulacion',
    id: candidate.id || candidate.codigo || `POST-${Date.now()}`,
    codigo: candidate.codigo || candidate.id || `POST-${Date.now()}`,
    nombre: candidate.nombre || candidate.Nombre || 'Sin nombre',
    nombreCompleto: candidate.nombre || candidate.Nombre || 'Sin nombre',
    edad: candidate.edad !== undefined ? candidate.edad : candidate.Edad,
    telefono: candidate.telefono || candidate.Teléfono || '',
    zona: candidate.zona || candidate.Zona || '',
    experiencia: candidate.experiencia || candidate.Experiencia || '',
    disponibilidad: candidate.disponibilidad || candidate.Disponibilidad || '',
    punto_partida: candidate.punto_partida || candidate.puntoPartida || candidate['Punto de partida'] || '',
    motivacion: candidate.motivacion || candidate.Motivación || '',
    talento: candidate.talento || candidate.Talento || 'No especificado',
    foto: fotoSanitizada,
    fotoNombre: candidate.fotoNombre || null,
    tieneFoto: Boolean(candidate.tieneFoto),
    estado: candidate.estado || candidate.Estado || 'Recibida',
    fecha: candidate.fecha || candidate.createdAt || new Date().toLocaleString('es-VE')
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return { ok: true, statusText: 'Guardado exitosamente en Google Sheets' };
    } else {
      return { ok: false, statusText: `HTTP ${res.status}: ${res.statusText}` };
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

  // 1. Endpoint de Salud
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, timestamp: Date.now(), service: 'Tour Azul Backend' });
  });

  // 2. Obtener Configuración (URL Webhook y nombres de hoja)
  app.get('/api/config', (_req, res) => {
    const cfg = getConfig();
    res.json({ ok: true, config: cfg });
  });

  // 3. Guardar Configuración del Webhook
  app.post('/api/config', (req, res) => {
    const { webhookUrl, sheetName, spreadsheetName } = req.body;
    const current = getConfig();
    const updated = {
      ...current,
      webhookUrl: (webhookUrl !== undefined ? String(webhookUrl).trim() : current.webhookUrl),
      sheetName: (sheetName !== undefined ? String(sheetName).trim() : (current.sheetName || 'Tour Azul Postulaciones')),
      spreadsheetName: (spreadsheetName !== undefined ? String(spreadsheetName).trim() : (current.spreadsheetName || 'Registro Tour Azul')),
      updatedAt: new Date().toISOString()
    };
    saveConfig(updated);
    res.json({ ok: true, config: updated, message: 'Configuración actualizada en el servidor para todos los dispositivos' });
  });

  // 4. Probar Conexión con Google Sheets
  app.post('/api/test-sheets', async (req, res) => {
    const url = req.body.url ? String(req.body.url).trim() : getConfig().webhookUrl;
    if (!url || !url.startsWith('http')) {
      return res.status(400).json({ ok: false, message: 'Debes proporcionar una URL válida de Google Apps Script' });
    }

    try {
      const sep = url.includes('?') ? '&' : '?';
      const testGetUrl = `${url}${sep}accion=candidatos&_t=${Date.now()}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const resp = await fetch(testGetUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      const text = await resp.text();
      let parsed: any = null;
      try {
        parsed = JSON.parse(text);
      } catch (_) {}

      if (parsed && (parsed.status === 'success' || parsed.ok || Array.isArray(parsed) || parsed.servicio)) {
        const count = Array.isArray(parsed.data) ? parsed.data.length : (Array.isArray(parsed) ? parsed.length : 0);
        return res.json({
          ok: true,
          message: `¡Conexión exitosa con Google Apps Script! La hoja respondió correctamente. Candidatos encontrados en Google Sheets: ${count}.`,
          details: parsed
        });
      }

      // Si devolvió HTML de error de Google
      if (text.includes('Script function not found: doGet')) {
        return res.json({
          ok: false,
          message: 'Error en Apps Script: La función doGet no existe. Asegúrate de copiar TODO el archivo Code.gs en el editor de Apps Script.',
          raw: text.slice(0, 300)
        });
      }

      if (text.includes('unable to open the file at this time') || text.includes('Page Not Found')) {
        return res.json({
          ok: false,
          message: 'No se pudo abrir el archivo de Google Sheets. Verifica que la implementación esté en modo "Cualquier usuario" (Anyone) y ejecutada como "Yo".',
          raw: text.slice(0, 300)
        });
      }

      return res.json({
        ok: false,
        message: `El script respondió pero con un contenido no esperado: ${text.slice(0, 200)}`
      });

    } catch (err: any) {
      return res.json({
        ok: false,
        message: `Error al conectar con la URL: ${err.message || err}. Verifica la conexión a internet o los permisos de la implementación.`
      });
    }
  });

  // 5. Obtener Todos los Candidatos (Compartido entre todos los dispositivos)
  app.get('/api/candidatos', async (req, res) => {
    let localList = getCandidatosList();
    const cfg = getConfig();
    const shouldSync = req.query.sync === 'true';

    // Si se solicita sincronización o la lista local está vacía pero hay webhook configurado
    if (shouldSync && cfg.webhookUrl && cfg.webhookUrl.startsWith('http')) {
      try {
        const sep = cfg.webhookUrl.includes('?') ? '&' : '?';
        const remoteUrl = `${cfg.webhookUrl}${sep}accion=candidatos&_t=${Date.now()}`;
        const resp = await fetch(remoteUrl, { headers: { 'Accept': 'application/json' } });
        if (resp.ok) {
          const json = await resp.json();
          let remotos: any[] = [];
          if (json && json.status === 'success' && Array.isArray(json.data)) remotos = json.data;
          else if (Array.isArray(json)) remotos = json;
          else if (json && Array.isArray(json.postulaciones)) remotos = json.postulaciones;

          // Merge: agregar los remotos que no estén en localList
          const idsLocales = new Set(localList.map((c: any) => String(c.id || c.codigo || '').toLowerCase().trim()));
          const nuevosDeSheets = remotos.filter((r: any) => {
            const rId = String(r.id || r.codigo || r.Código || '').toLowerCase().trim();
            return rId && !idsLocales.has(rId);
          }).map(r => ({ ...r, _origen: 'sheets', syncedToSheets: true }));

          if (nuevosDeSheets.length > 0) {
            localList = [...localList, ...nuevosDeSheets];
            saveCandidatosList(localList);
          }
        }
      } catch (err) {
        console.warn('Aviso al consultar Google Sheets en GET /api/candidatos:', err);
      }
    }

    res.json({
      ok: true,
      candidatos: localList,
      total: localList.length,
      webhookUrl: cfg.webhookUrl
    });
  });

  // 6. Registrar Candidato (Desde cualquier dispositivo)
  app.post('/api/candidatos', async (req, res) => {
    const data = req.body;
    if (!data || (!data.nombre && !data.Nombre)) {
      return res.status(400).json({ ok: false, error: 'Datos de postulación incompletos' });
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomTag = Math.floor(1000 + Math.random() * 9000);
    const id = data.id || data.codigo || `POST-${dateStr}-${randomTag}`;

    const candidato = {
      ...data,
      id,
      codigo: id,
      createdAt: data.createdAt || now.toISOString(),
      fecha: data.fecha || now.toLocaleString('es-VE'),
      syncedToSheets: false,
      _origen: 'server'
    };

    // Guardar en la base de datos persistente del servidor
    const list = getCandidatosList();
    // Evitar duplicados por id
    const existingIdx = list.findIndex(c => String(c.id) === String(id));
    if (existingIdx !== -1) {
      list[existingIdx] = { ...list[existingIdx], ...candidato };
    } else {
      list.unshift(candidato);
    }
    saveCandidatosList(list);

    // Intentar reenvío inmediato a Google Sheets
    const cfg = getConfig();
    let forwardResult = { ok: false, statusText: 'No intentado' };
    if (cfg.webhookUrl && cfg.webhookUrl.startsWith('http')) {
      forwardResult = await forwardToGoogleSheets(candidato, cfg.webhookUrl);
      if (forwardResult.ok) {
        candidato.syncedToSheets = true;
        // Actualizar estado en list
        const updatedIdx = list.findIndex(c => String(c.id) === String(id));
        if (updatedIdx !== -1) {
          list[updatedIdx].syncedToSheets = true;
          saveCandidatosList(list);
        }
      }
    }

    res.json({
      ok: true,
      id,
      candidato,
      syncedToSheets: candidato.syncedToSheets,
      sheetsResult: forwardResult
    });
  });

  // 7. Sincronizar todos los candidatos pendientes hacia Google Sheets
  app.post('/api/sync-sheets', async (_req, res) => {
    const cfg = getConfig();
    if (!cfg.webhookUrl || !cfg.webhookUrl.startsWith('http')) {
      return res.status(400).json({ ok: false, message: 'URL de Webhook no configurada' });
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
      message: `Se sincronizaron ${exitosas} postulaciones con la hoja "${cfg.sheetName}". Fallidas: ${fallidas}.`
    });
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
