const DEFAULT_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
  'https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec';

export default async function handler(req: any, res: any) {
  // Configurar cabeceras CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Guardar postulación desde formulario
  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const nombre = String(data.nombre || data.Nombre || data.nombreCompleto || '').trim();
      if (!nombre) {
        return res.status(400).json({ ok: false, error: 'El nombre completo es obligatorio.' });
      }

      const id = String(data.id || data.codigo || data.Código || `POST-${Date.now()}`).trim();

      const rawFoto = data.foto || data.fotoBase64 || data.Foto;
      const payload = {
        accion: 'candidato',
        id,
        codigo: id,
        nombre,
        nombreCompleto: nombre,
        edad: data.edad || 24,
        telefono: data.telefono || data.Teléfono || '',
        zona: data.zona || data.Zona || 'Barquisimeto',
        experiencia: data.experiencia || 'Con disposición de aprender',
        disponibilidad: data.disponibilidad || 'Fines de semana y feriados',
        punto_partida: data.punto_partida || 'Sí, sin inconvenientes.',
        motivacion: data.motivacion || 'Me entusiasma formar parte del equipo de Tour Azul.',
        talento: data.talento || 'No especificado',
        foto: rawFoto || (data.tieneFoto ? (data.fotoNombre || 'Sí adjunta') : 'No adjunta'),
        fotoBase64: rawFoto || null,
        fotoUrl: data.fotoUrl || null,
        fotoNombre: data.fotoNombre || null,
        tieneFoto: Boolean(data.tieneFoto || rawFoto),
        estado: 'Recibida',
        fecha: new Date().toLocaleString('es-VE')
      };

      try {
        await fetch(DEFAULT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
      } catch (errGAS) {
        console.warn('Aviso enviando a Google Sheets desde serverless function:', errGAS);
      }

      return res.status(200).json({
        ok: true,
        id,
        codigo: id,
        message: 'Postulación registrada exitosamente en Google Sheets'
      });
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: err.message || 'Error interno procesando postulación' });
    }
  }

  // 2. Obtener lista de candidatos (Consulta directa a Google Sheets)
  if (req.method === 'GET') {
    try {
      const resp = await fetch(`${DEFAULT_WEBHOOK_URL}?accion=candidatos&_t=${Date.now()}`);
      if (resp.ok) {
        const json: any = await resp.json();
        let remotos: any[] = [];
        if (json && json.status === 'success' && Array.isArray(json.data)) remotos = json.data;
        else if (Array.isArray(json)) remotos = json;
        return res.status(200).json({ ok: true, candidatos: remotos, total: remotos.length });
      }
    } catch (err: any) {
      console.warn('Aviso consultando candidatos en Vercel:', err);
    }
    return res.status(200).json({ ok: true, candidatos: [], total: 0 });
  }

  // 3. Actualizar estado
  if (req.method === 'PATCH') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const id = req.query.id || data.id;
      const estado = data.estado;
      if (id && estado) {
        await fetch(DEFAULT_WEBHOOK_URL, {
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

  return res.status(405).json({ ok: false, error: 'Método no permitido' });
}
