// CONSTANTES DE CONFIGURACIÓN
const WEBHOOK_URL = "";
const WHATSAPP_NUMERO = "584126571155"; // formato internacional sin + (0412-657-1155)
const MINUTOS_BLOQUEO_ASIENTO = 10;
const ABONO_MINIMO = 5; // euros por persona, igual para todos los viajes
const DATOS_PAGO_MOVIL = { banco: "0102 - Banco de Venezuela", cedulaRif: "V-24162410", telefono: "04126571155" };
const INSTRUCCIONES_EFECTIVO = "Entrega el monto exacto en dólares en efectivo el día del viaje al abordar la unidad. Recuerda que 1 € equivale a 1 $ en efectivo.";
const TASA_MANUAL = 0; // Si es mayor que 0, tiene prioridad sobre todo
const TASA_DEMO = 45.80; // tasa de prueba para el modo demo (solo si fallan las APIs)
const CACHE_KEY_TASA = "tour_azul_tasa_bcv_v2";

// Formato venezolano: punto para miles, coma para decimales (2 decimales)
function formatVzla(val) {
  if (val === null || val === undefined || isNaN(val)) return "0,00";
  const num = Number(val);
  const parts = num.toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(",");
}

function formatDateDisplay(dInput) {
  if (!dInput) return "Hoy";
  try {
    const d = new Date(dInput);
    if (isNaN(d.getTime())) return String(dInput);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return String(dInput);
  }
}

function checkIsOlderThan3Days(dInput) {
  if (!dInput) return false;
  try {
    const d = new Date(dInput);
    if (isNaN(d.getTime())) return false;
    const diffMs = Date.now() - d.getTime();
    return diffMs > (3 * 24 * 60 * 60 * 1000);
  } catch (e) {
    return false;
  }
}
