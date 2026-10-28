import fs from 'fs';
import path from 'path';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const filePath = path.join(process.cwd(), 'Postulaciones_GoogleSheet.gs');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(content);
    }
  } catch (_) {}

  return res.status(200).send('// Postulaciones_GoogleSheet.gs está disponible en la raíz del proyecto');
}
