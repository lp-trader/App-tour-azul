export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization || req.headers['x-admin-token'];
  if (authHeader) {
    return res.status(200).json({ ok: true, valid: true });
  }

  return res.status(401).json({ ok: false, valid: false, error: 'Sesión no válida o expirada' });
}
