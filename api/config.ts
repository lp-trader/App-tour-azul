export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    'https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec';

  return res.status(200).json({
    ok: true,
    config: {
      webhookUrl,
      sheetName: 'Postulaciones',
      spreadsheetName: 'Postulaciones Tour Azul'
    },
    isConfigured: true
  });
}
