export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ ok: false, message: 'Método no permitido. Use POST o GET.' });
  }

  try {
    let rawUrl = '';
    if (req.method === 'POST') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      rawUrl = String(data.url || '').trim();
    } else {
      rawUrl = String(req.query.url || '').trim();
    }

    if (!rawUrl || !rawUrl.startsWith('http')) {
      return res.status(400).json({
        ok: false,
        message: 'Debes proporcionar una URL válida de Google Apps Script (debe comenzar con https:// y terminar en /exec).'
      });
    }

    const sep = rawUrl.includes('?') ? '&' : '?';
    const testUrl = `${rawUrl}${sep}accion=test&_t=${Date.now()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const resp = await fetch(testUrl, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json, text/plain, */*' }
    });
    clearTimeout(timeoutId);

    const text = await resp.text();
    let parsed: any = null;
    try {
      parsed = JSON.parse(text);
    } catch (_) {}

    if (parsed && (parsed.ok === true || parsed.status === 'success')) {
      const count = parsed.totalPostulaciones !== undefined
        ? parsed.totalPostulaciones
        : (Array.isArray(parsed.data) ? parsed.data.length : 0);
      const pestana = parsed.pestana || 'Postulaciones';
      const doc = parsed.documento || 'Google Sheet';

      return res.status(200).json({
        ok: true,
        message: `¡Conexión exitosa con "${doc}"! Pestaña activa: "${pestana}". Postulaciones registradas: ${count}.`,
        details: parsed
      });
    }

    // Si respondió pero fue una página de error de Google
    if (text.includes('Script function not found: doGet')) {
      return res.status(200).json({
        ok: false,
        message: 'Error en Apps Script: La función doGet no fue encontrada. Asegúrate de copiar TODO el archivo Postulaciones_GoogleSheet.gs en el editor de Apps Script.'
      });
    }

    if (text.includes('unable to open the file') || text.includes('Page Not Found') || text.includes('drive.google.com')) {
      return res.status(200).json({
        ok: false,
        message: 'No se pudo acceder a la hoja. Verifica que en "Implementar > Nueva implementación" hayas seleccionado: "Quién tiene acceso: Cualquier usuario" (Anyone).'
      });
    }

    // Si es un array de datos directo
    if (Array.isArray(parsed)) {
      return res.status(200).json({
        ok: true,
        message: `¡Conexión exitosa! Se recibieron ${parsed.length} registros desde Google Sheets.`,
        details: { dataCount: parsed.length }
      });
    }

    return res.status(200).json({
      ok: false,
      message: `El script respondió pero con formato no reconocido: ${text.slice(0, 160)}`
    });

  } catch (err: any) {
    return res.status(200).json({
      ok: false,
      message: `Error al conectar con la URL: ${err.message || err}. Verifica la conexión a internet y que el script esté publicado con acceso para 'Cualquier usuario'.`
    });
  }
}
