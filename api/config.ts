// In-memory fallback for serverless execution
let memoryConfig: { webhookUrl?: string; sheetName?: string; spreadsheetName?: string } = {};

const DEFAULT_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
  'https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const webhookUrl = (data.webhookUrl !== undefined ? String(data.webhookUrl).trim() : (memoryConfig.webhookUrl || DEFAULT_WEBHOOK_URL));
      const sheetName = (data.sheetName !== undefined && String(data.sheetName).trim().length > 0 ? String(data.sheetName).trim() : 'Postulaciones');
      const spreadsheetName = (data.spreadsheetName !== undefined && String(data.spreadsheetName).trim().length > 0 ? String(data.spreadsheetName).trim() : 'Postulaciones Tour Azul');

      memoryConfig = { webhookUrl, sheetName, spreadsheetName };

      return res.status(200).json({
        ok: true,
        config: {
          webhookUrl,
          sheetName,
          spreadsheetName
        },
        message: 'Configuración actualizada exitosamente'
      });
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: err.message || 'Error guardando configuración' });
    }
  }

  // GET
  const activeWebhook = memoryConfig.webhookUrl || DEFAULT_WEBHOOK_URL;
  const activeSheet = memoryConfig.sheetName || 'Postulaciones';
  const activeSpreadsheet = memoryConfig.spreadsheetName || 'Postulaciones Tour Azul';

  return res.status(200).json({
    ok: true,
    config: {
      webhookUrl: activeWebhook,
      sheetName: activeSheet,
      spreadsheetName: activeSpreadsheet
    },
    isConfigured: Boolean(activeWebhook && activeWebhook.startsWith('http'))
  });
}
