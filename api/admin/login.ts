const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '010203';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const { password } = data;

  if (password && String(password).trim() === ADMIN_PASSWORD) {
    return res.status(200).json({
      ok: true,
      token: 'admin-token-' + Date.now(),
      message: 'Autenticación administrativa exitosa'
    });
  }

  return res.status(401).json({
    ok: false,
    error: 'Clave de administrador incorrecta. Acceso denegado.'
  });
}
