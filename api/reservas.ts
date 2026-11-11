import fs from 'fs';
import path from 'path';

const DEFAULT_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
  'https://script.google.com/macros/s/AKfycbzmgPJwdV2MfahHi_OQ_dJaMgb25585VLgpTtCXeG0iekM5zBm4H2BFCdteyVrdcB8-/exec';

function resolveWebhookUrl(req: any): string {
  const queryUrl = req.query && typeof req.query.webhookUrl === 'string' ? req.query.webhookUrl.trim() : '';
  if (queryUrl && queryUrl.startsWith('http')) return queryUrl;

  const headerUrl = req.headers && typeof req.headers['x-webhook-url'] === 'string' ? req.headers['x-webhook-url'].trim() : '';
  if (headerUrl && headerUrl.startsWith('http')) return headerUrl;

  // Try reading from data/config.json if running with filesystem access
  try {
    const configPath = path.join(process.cwd(), 'data', 'config.json');
    if (fs.existsSync(configPath)) {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (cfg && cfg.webhookUrl && cfg.webhookUrl.startsWith('http')) {
        return cfg.webhookUrl;
      }
    }
  } catch (_) {}

  return DEFAULT_WEBHOOK_URL;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token, x-webhook-url');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const webhookUrl = resolveWebhookUrl(req);

  // 1. POST: Guardar nueva reserva
  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const titularNombre = String(data.titular?.nombre || data.nombre || data.nombreTitular || '').trim();
      if (!titularNombre || titularNombre.length < 2) {
        return res.status(400).json({ ok: false, error: 'El nombre completo del titular es obligatorio.' });
      }

      const titularCedula = String(data.titular?.cedula || data.cedula || '').trim();
      const titularTelefono = String(data.titular?.telefono || data.telefono || '').trim();
      const destino = String(data.destino || '').trim();
      const fechaViaje = String(data.fechaViaje || '').trim();

      const idReserva = String(data.idReserva || data.id || `TA-${Date.now()}`).trim();
      const acompanantesRaw = Array.isArray(data.acompanantes) ? data.acompanantes : [];
      const totalPersonas = Number(data.totalPersonas) || (1 + acompanantesRaw.length);
      const abonoEur = Number(data.abonoEur !== undefined ? data.abonoEur : data.abono) || 0;
      const saldoPendienteEur = Number(data.saldoPendienteEur !== undefined ? data.saldoPendienteEur : data.pendiente) || 0;

      const payload = {
        accion: 'reservar',
        idReserva,
        id: idReserva,
        destino,
        destinoHoja: data.destinoHoja || destino,
        fechaViaje,
        bus: data.bus || 'Bus 1',
        asientos: Array.isArray(data.asientos) ? data.asientos : [],
        titular: {
          nombre: titularNombre,
          cedula: titularCedula,
          telefono: titularTelefono,
          edad: data.titular?.edad || data.edad || '',
          recogida: data.titular?.puntoPartida || data.puntoPartida || data.recogida || ''
        },
        acompanantes: acompanantesRaw,
        totalPersonas,
        tipoPago: data.tipoPago || 'Pago Móvil',
        abono: abonoEur,
        montoAbonadoEur: abonoEur,
        pendiente: saldoPendienteEur,
        saldoPendienteEur,
        referenciaPagoMovil: data.referenciaPagoMovil || data.referencia || '',
        tasaBCV: Number(data.tasaBCV) || 0,
        montoPagadoBs: Number(data.montoPagadoBs) || 0,
        montoPagadoUsd: Number(data.montoPagadoUsd) || 0,
        estadoPago: saldoPendienteEur === 0 ? 'Pagado' : 'Abonado'
      };

      let sheetsOk = false;
      let sheetsErr = null;

      if (webhookUrl && webhookUrl.startsWith('http')) {
        try {
          const respGas = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
          });
          sheetsOk = respGas.ok;
        } catch (errGas: any) {
          sheetsErr = errGas.message || String(errGas);
        }
      }

      return res.status(200).json({
        ok: true,
        idReserva,
        syncedToSheets: sheetsOk,
        sheetsErr,
        message: sheetsOk ? 'Reserva guardada y sincronizada con Google Sheets' : 'Reserva recibida'
      });
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: err.message || 'Error procesando reserva' });
    }
  }

  // 2. GET: Consultar reservas desde Google Sheets
  if (req.method === 'GET') {
    try {
      if (webhookUrl && webhookUrl.startsWith('http')) {
        const sep = webhookUrl.includes('?') ? '&' : '?';
        const targetQuery = `${webhookUrl}${sep}accion=reservas&_t=${Date.now()}`;
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
          } else if (json && Array.isArray(json.reservas)) {
            remotos = json.reservas;
          }

          return res.status(200).json({
            ok: true,
            reservas: remotos,
            total: remotos.length,
            source: 'google-sheets',
            webhookUrl
          });
        }
      }
    } catch (err: any) {
      console.warn('Aviso consultando reservas en serverless:', err.message || err);
    }

    return res.status(200).json({
      ok: true,
      reservas: [],
      total: 0,
      source: 'empty-fallback',
      webhookUrl
    });
  }

  return res.status(405).json({ ok: false, error: 'Método no permitido' });
}
