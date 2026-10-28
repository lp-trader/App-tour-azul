const DEFAULT_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
  'https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec';

function resolveWebhookUrl(req: any): string {
  const queryUrl = req.query && typeof req.query.webhookUrl === 'string' ? req.query.webhookUrl.trim() : '';
  if (queryUrl && queryUrl.startsWith('http')) return queryUrl;

  const headerUrl = req.headers && typeof req.headers['x-webhook-url'] === 'string' ? req.headers['x-webhook-url'].trim() : '';
  if (headerUrl && headerUrl.startsWith('http')) return headerUrl;

  return DEFAULT_WEBHOOK_URL;
}

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token, x-webhook-url');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const webhookUrl = resolveWebhookUrl(req);

  // 1. Guardar postulación desde formulario o prueba administrativa
  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const nombre = String(data.nombre || data.Nombre || data.nombreCompleto || '').trim();
      if (!nombre) {
        return res.status(400).json({ ok: false, error: 'El nombre completo es obligatorio.' });
      }

      const id = String(data.id || data.codigo || data.Código || `POST-${Date.now()}`).trim();
      const rawFoto = data.foto || data.fotoBase64 || data.Foto;
      const tieneFotoBool = Boolean(data.tieneFoto || (rawFoto && String(rawFoto).length > 20));

      const payload = {
        accion: 'candidato',
        id,
        codigo: id,
        Código: id,
        nombre,
        nombreCompleto: nombre,
        Nombre: nombre,
        edad: data.edad !== undefined ? data.edad : (data.Edad !== undefined ? data.Edad : 24),
        telefono: String(data.telefono || data.Teléfono || ''),
        Teléfono: String(data.telefono || data.Teléfono || ''),
        zona: String(data.zona || data.Zona || 'Barquisimeto'),
        Zona: String(data.zona || data.Zona || 'Barquisimeto'),
        experiencia: String(data.experiencia || data.Experiencia || 'Con disposición de aprender'),
        disponibilidad: String(data.disponibilidad || data.Disponibilidad || 'Fines de semana y feriados'),
        punto_partida: String(data.punto_partida || data['Punto de partida'] || 'Sí, sin inconvenientes.'),
        motivacion: String(data.motivacion || data.Motivación || 'Me entusiasma formar parte del equipo de Tour Azul.'),
        talento: String(data.talento || data.Talento || 'No especificado'),
        foto: rawFoto || (tieneFotoBool ? (data.fotoNombre || 'Sí adjunta') : 'No adjunta'),
        Foto: rawFoto || (tieneFotoBool ? (data.fotoNombre || 'Sí adjunta') : 'No adjunta'),
        fotoBase64: rawFoto || null,
        fotoUrl: data.fotoUrl || null,
        fotoNombre: data.fotoNombre || null,
        tieneFoto: tieneFotoBool,
        estado: String(data.estado || data.Estado || 'Recibida'),
        fecha: String(data.fecha || data.Fecha || new Date().toLocaleString('es-VE'))
      };

      let sheetsOk = false;
      let sheetsErr = null;

      try {
        const respGas = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        sheetsOk = respGas.ok;
      } catch (errGAS: any) {
        sheetsErr = errGAS.message || String(errGAS);
        console.warn('Aviso enviando a Google Sheets en serverless:', sheetsErr);
      }

      return res.status(200).json({
        ok: true,
        id,
        codigo: id,
        syncedToSheets: sheetsOk,
        candidato: payload,
        message: sheetsOk ? 'Postulación registrada exitosamente en Google Sheets' : 'Postulación recibida en servidor'
      });
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: err.message || 'Error interno procesando postulación' });
    }
  }

  // 2. Obtener lista de candidatos (Consulta directa y estructurada a Google Sheets)
  if (req.method === 'GET') {
    try {
      const sep = webhookUrl.includes('?') ? '&' : '?';
      const targetQuery = `${webhookUrl}${sep}accion=candidatos&_t=${Date.now()}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const resp = await fetch(targetQuery, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json, text/plain, */*' }
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const json: any = await resp.json();
        let remotos: any[] = [];
        if (json && json.status === 'success' && Array.isArray(json.data)) {
          remotos = json.data;
        } else if (Array.isArray(json)) {
          remotos = json;
        } else if (json && Array.isArray(json.candidatos)) {
          remotos = json.candidatos;
        }

        // Normalizar cada registro para compatibilidad total con el frontend
        const normalizados = remotos.map((r: any, idx: number) => {
          const cod = String(r.Código || r.codigo || r.id || `POST-${idx}`).trim();
          const nom = String(r.Nombre || r.nombre || '').trim();
          const tel = String(r.Teléfono ?? r.telefono ?? '').trim();
          const fotoVal = r.Foto || r.foto || r.fotoBase64 || r.fotoUrl || '';
          const tieneFoto = Boolean(r.tieneFoto || (fotoVal && String(fotoVal).length > 10 && fotoVal !== 'No adjunta'));

          return {
            ...r,
            id: cod,
            codigo: cod,
            Código: cod,
            nombre: nom || 'Aspirante sin nombre',
            Nombre: nom || 'Aspirante sin nombre',
            edad: r.Edad !== undefined && r.Edad !== '' ? r.Edad : (r.edad !== undefined && r.edad !== '' ? r.edad : '--'),
            telefono: tel || '--',
            Teléfono: tel || '--',
            zona: r.Zona || r.zona || 'No indicada',
            Zona: r.Zona || r.zona || 'No indicada',
            experiencia: r.Experiencia || r.experiencia || '',
            disponibilidad: r.Disponibilidad || r.disponibilidad || '',
            punto_partida: r['Punto de partida'] || r.punto_partida || r.puntoPartida || '',
            motivacion: r.Motivación || r.motivacion || '',
            talento: r.Talento || r.talento || '',
            foto: fotoVal,
            Foto: fotoVal,
            fotoBase64: r.fotoBase64 || (String(fotoVal).startsWith('data:image/') ? fotoVal : null),
            fotoUrl: r.fotoUrl || (String(fotoVal).startsWith('http') ? fotoVal : null),
            tieneFoto,
            estado: r.Estado || r.estado || 'Recibida',
            Estado: r.Estado || r.estado || 'Recibida',
            fecha: r.Fecha || r.fecha || '',
            Fecha: r.Fecha || r.fecha || '',
            syncedToSheets: true,
            _origen: 'sheets'
          };
        }).filter((c: any) => {
          // Filtrar filas vacías de la hoja
          const nom = String(c.nombre).trim();
          const tel = String(c.telefono).trim();
          return (nom && nom !== 'Sin nombre' && nom !== 'Aspirante sin nombre') || (tel && tel !== '--');
        });

        return res.status(200).json({
          ok: true,
          candidatos: normalizados,
          total: normalizados.length,
          source: 'google-sheets',
          webhookUrl
        });
      }
    } catch (err: any) {
      console.warn('Aviso consultando candidatos en Vercel:', err.message || err);
    }

    return res.status(200).json({
      ok: true,
      candidatos: [],
      total: 0,
      source: 'empty-fallback',
      webhookUrl
    });
  }

  // 3. Actualizar estado
  if (req.method === 'PATCH') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const id = req.query.id || data.id;
      const estado = data.estado;
      if (id && estado) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ accion: 'actualizar_estado', id, estado })
        });
      }
      return res.status(200).json({ ok: true, message: 'Estado actualizado' });
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // 4. Eliminar postulación
  if (req.method === 'DELETE') {
    try {
      const id = req.query.id;
      if (id) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ accion: 'eliminar_candidato', id })
        });
      }
      return res.status(200).json({ ok: true, message: 'Candidato eliminado' });
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  return res.status(405).json({ ok: false, error: 'Método no permitido' });
}
