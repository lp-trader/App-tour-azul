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
      webhookUrl: "https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec",
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
      webhookUrl: "https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec",
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
    if (!Array.isArray(parsed)) return [];
    return parsed.map((c: any, idx: number) => {
      const nom = String(c.nombre || c.Nombre || '').trim();
      const cod = String(c.id || c.codigo || c.Código || `POST-${idx}`).trim();
      return {
        ...c,
        id: cod,
        codigo: cod,
        Código: cod,
        nombre: nom,
        Nombre: nom,
        telefono: c.telefono || c.Teléfono || '',
        Teléfono: c.Teléfono || c.telefono || '',
        zona: c.zona || c.Zona || '',
        Zona: c.Zona || c.zona || '',
        estado: c.estado || c.Estado || 'Recibida',
        Estado: c.Estado || c.estado || 'Recibida',
        fecha: c.fecha || c.Fecha || c.createdAt || '',
        Fecha: c.Fecha || c.fecha || c.createdAt || ''
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
  app.use('/uploads', express.static(path.resolve('public/uploads')));

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
    const shouldSync = req.query.sync !== 'false'; // Sincronizar por defecto con Google Sheets

    // Si se solicita sincronización y hay webhook configurado
    if (shouldSync && cfg.webhookUrl && cfg.webhookUrl.startsWith('http')) {
      try {
        const sep = cfg.webhookUrl.includes('?') ? '&' : '?';
        const remoteUrl = `${cfg.webhookUrl}${sep}accion=candidatos&_t=${Date.now()}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout para permitir respuesta de Apps Script

        const resp = await fetch(remoteUrl, { 
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (resp.ok) {
          const json: any = await resp.json();
          let remotos: any[] = [];
          if (json && json.status === 'success' && Array.isArray(json.data)) remotos = json.data;
          else if (Array.isArray(json)) remotos = json;
          else if (json && Array.isArray(json.postulaciones)) remotos = json.postulaciones;
          else if (json && Array.isArray(json.candidatos)) remotos = json.candidatos;

          // Merge inteligente: actualizar estados y añadir faltantes
          const localMap = new Map<string, number>();
          localList.forEach((c: any, idx: number) => {
            const key = String(c.id || c.codigo || c.Código || '').toLowerCase().trim();
            if (key) localMap.set(key, idx);
          });

          let huboCambios = false;
          for (const r of remotos) {
            // Descartar filas vacías o fantasma sin nombre ni teléfono
            const nom = String(r.nombre || r.Nombre || r.nombreCompleto || r['Nombre Completo'] || '').trim();
            const tel = String(r.telefono || r.Teléfono || r.whatsapp || '').trim();
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

          // Limpiar de localList registros que no tengan ni nombre ni código válido
          const prevLen = localList.length;
          localList = localList.filter((c: any) => {
            const n = String(c.nombre || c.Nombre || '').trim();
            const cod = String(c.id || c.codigo || c.Código || '').trim();
            return n.length > 0 || cod.length > 0;
          });
          if (localList.length !== prevLen) {
            huboCambios = true;
          }

          if (huboCambios) {
            saveCandidatosList(localList);
          }
        }
      } catch (err) {
        console.warn('Aviso al consultar Google Sheets en GET /api/candidatos (continuando con lista local):', err);
      }
    }

    res.json({
      ok: true,
      candidatos: localList,
      total: localList.length,
      webhookUrl: cfg.webhookUrl,
      lastSync: new Date().toISOString()
    });
  });

  // 6. Registrar Candidato (Desde cualquier dispositivo: móvil, tablet, PC)
  app.post('/api/candidatos', async (req, res) => {
    try {
      const data = req.body;
      if (!data || (!data.nombre && !data.Nombre)) {
        return res.status(400).json({ ok: false, error: 'Datos de postulación incompletos' });
      }

      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const randomTag = Math.floor(1000 + Math.random() * 9000);
      const id = String(data.id || data.codigo || data.Código || `POST-${dateStr}-${randomTag}`).trim();

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
          console.warn('Aviso guardando imagen en disco:', errFoto);
          fotoUrl = rawPhoto;
        }
      } else if (rawPhoto && typeof rawPhoto === 'string' && (rawPhoto.startsWith('http') || rawPhoto.startsWith('/uploads'))) {
        fotoUrl = rawPhoto;
      }

      const candidato: any = {
        ...data,
        id,
        codigo: id,
        foto: fotoUrl || (data.tieneFoto ? (data.fotoNombre || 'Sí adjunta') : 'No adjunta'),
        fotoUrl: fotoUrl,
        tieneFoto: Boolean(fotoUrl || data.tieneFoto),
        createdAt: data.createdAt || now.toISOString(),
        fecha: data.fecha || now.toLocaleString('es-VE'),
        estado: data.estado || data.Estado || 'Recibida',
        syncedToSheets: false,
        _origen: 'server'
      };

      // Limpiar propiedades redundantes que sobrecarguen el archivo JSON
      delete candidato.fotoBase64;

      // Guardar en la base de datos persistente del servidor
      const list = getCandidatosList();
      const existingIdx = list.findIndex(c => String(c.id) === String(id) || String(c.codigo) === String(id));
      if (existingIdx !== -1) {
        list[existingIdx] = { ...list[existingIdx], ...candidato };
      } else {
        list.unshift(candidato);
      }
      saveCandidatosList(list);

      // Intentar reenvío inmediato a Google Sheets si hay webhook
      const cfg = getConfig();
      let forwardResult = { ok: false, statusText: 'No intentado' };
      if (cfg.webhookUrl && cfg.webhookUrl.startsWith('http')) {
        forwardResult = await forwardToGoogleSheets(candidato, cfg.webhookUrl);
        if (forwardResult.ok) {
          candidato.syncedToSheets = true;
          const updatedIdx = list.findIndex(c => String(c.id) === String(id));
          if (updatedIdx !== -1) {
            list[updatedIdx].syncedToSheets = true;
            saveCandidatosList(list);
          }
        }
      }

      console.log(`[Postulación recibida] Aspirante: "${candidato.nombre || candidato.Nombre}" (${id}). Sincronizado a Sheets: ${candidato.syncedToSheets}`);

      res.json({
        ok: true,
        id,
        candidato,
        syncedToSheets: candidato.syncedToSheets,
        sheetsResult: forwardResult
      });
    } catch (errPost: any) {
      console.error('Error procesando POST /api/candidatos:', errPost);
      res.status(500).json({ ok: false, error: errPost.message || String(errPost) });
    }
  });

  // 7. Actualizar Estado de un Candidato (Visible inmediatamente en todos los dispositivos)
  app.patch('/api/candidatos/:id', async (req, res) => {
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

      // Notificar cambio de estado a Google Sheets si el webhook está configurado
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
              estado: list[idx].estado
            })
          }).catch(errW => console.warn('Aviso notificando cambio de estado a Google Sheets:', errW));
        } catch (_) {}
      }

      res.json({ ok: true, candidato: list[idx], message: 'Estado actualizado en todos los dispositivos' });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || String(err) });
    }
  });

  // 8. Eliminar Candidato (Para descartar registros de prueba)
  app.delete('/api/candidatos/:id', (req, res) => {
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
      res.json({ ok: true, message: 'Candidato eliminado de la lista central' });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err.message || String(err) });
    }
  });

  // 9. Exportar Candidatos a CSV (Compatible con Microsoft Excel con caracteres en español)
  app.get('/api/candidatos/export.csv', (_req, res) => {
    try {
      const list = getCandidatosList();
      const headers = [
        'Código',
        'Fecha',
        'Nombre Completo',
        'Edad',
        'Teléfono',
        'Zona',
        'Experiencia',
        'Disponibilidad',
        'Punto de partida',
        'Motivación',
        'Talento Curioso',
        'Foto',
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

      // BOM UTF-8 para apertura correcta en Excel
      const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="candidatos_tour_azul.csv"');
      res.send(csvContent);
    } catch (err: any) {
      res.status(500).send(`Error generando CSV: ${err.message}`);
    }
  });

  // 10. Sincronizar todos los candidatos pendientes hacia Google Sheets
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

  // Manejador global de errores para Express para evitar caídas de servidor
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
