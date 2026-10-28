export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const candidatos = Array.isArray(data.candidatos) ? data.candidatos : [];
  const webhookUrl = data.webhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    'https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec';

  let exitosas = 0;
  let fallidas = 0;

  for (const c of candidatos) {
    try {
      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          accion: 'candidato',
          ...c
        })
      });
      if (resp.ok) exitosas++;
      else fallidas++;
    } catch (_) {
      fallidas++;
    }
  }

  return res.status(200).json({
    ok: true,
    total: candidatos.length,
    exitosas,
    fallidas,
    message: `Sincronización completada. Exitosas: ${exitosas}, Fallidas: ${fallidas}.`
  });
}
