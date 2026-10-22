import React, { useState, useEffect, useMemo } from 'react';

export interface Candidato {
  Foto?: string;
  foto?: string;
  Nombre?: string;
  nombre?: string;
  Código?: string;
  codigo?: string;
  id?: string;
  Edad?: number | string;
  edad?: number | string;
  Zona?: string;
  zona?: string;
  Teléfono?: string;
  telefono?: string;
  Disponibilidad?: string;
  disponibilidad?: string;
  "Punto de partida"?: string;
  punto_partida?: string;
  puntoPartida?: string;
  Experiencia?: string;
  experiencia?: string;
  Motivación?: string;
  motivacion?: string;
  Talento?: string;
  talento?: string;
  Estado?: string;
  estado?: string;
  Fecha?: string;
  fecha?: string;
  createdAt?: string;
  syncedToSheets?: boolean;
  _origen?: 'server' | 'sheets' | 'local';
  _isLocalOnly?: boolean;
  [key: string]: any;
}

interface AdminCandidatosProps {
  onBack?: () => void;
  onLogout?: () => void;
}

const STORAGE_KEY_WEBHOOK = "tour_azul_webhook_postulaciones_url";
const STORAGE_KEY_POSTULACIONES = "tour_azul_postulaciones";
const DEFAULT_URL = "https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec";

export const AdminCandidatos: React.FC<AdminCandidatosProps> = ({ onBack, onLogout }) => {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alertaInfo, setAlertaInfo] = useState<string | null>(null);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<Candidato | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<string>('todos');

  // Configuración de Webhook de Google Apps Script
  const [scriptUrl, setScriptUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_WEBHOOK) || DEFAULT_URL;
  });
  const [sheetName, setSheetName] = useState<string>("Tour Azul Postulaciones");
  const [spreadsheetName, setSpreadsheetName] = useState<string>("Registro Tour Azul");
  const [mostrarConfigUrl, setMostrarConfigUrl] = useState<boolean>(false);
  const [mostrarGuiaCodeGs, setMostrarGuiaCodeGs] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>(scriptUrl);
  const [probandoConexion, setProbandoConexion] = useState<boolean>(false);
  const [resultadoTest, setResultadoTest] = useState<{ ok: boolean; msg: string } | null>(null);
  const [sincronizando, setSincronizando] = useState<boolean>(false);
  const [copiadoCodeGs, setCopiadoCodeGs] = useState<boolean>(false);
  const [fotoAmpliada, setFotoAmpliada] = useState<{ url: string; nombre: string; codigo: string } | null>(null);

  // Helper para validar si hay una URL o dataURL de foto real
  const isFotoValida = (foto?: string) => {
    if (!foto) return false;
    const f = String(foto).trim();
    if (!f || f === 'No adjunta' || f === 'No' || f === '-' || f === 'Sin foto' || f === 'No especificado') return false;
    return f.startsWith('http') || f.startsWith('data:image') || f.startsWith('/uploads') || f.startsWith('/') || f.includes('.jpg') || f.includes('.png') || f.includes('.webp');
  };

  // Normalizadores de campos
  const getNombre = (c: Candidato) => c.Nombre || c.nombre || "Sin nombre";
  const getCodigo = (c: Candidato) => c.Código || c.codigo || c.id || "S/C";
  const getFoto = (c: Candidato) => c.Foto || c.foto || c.fotoUrl || "";
  const getEdad = (c: Candidato) => c.Edad !== undefined ? c.Edad : (c.edad !== undefined ? c.edad : "--");
  const getZona = (c: Candidato) => c.Zona || c.zona || "No especificada";
  const getTelefono = (c: Candidato) => c.Teléfono || c.telefono || "--";
  const getDisponibilidad = (c: Candidato) => c.Disponibilidad || c.disponibilidad || "No indicada";
  const getPuntoPartida = (c: Candidato) => c["Punto de partida"] || c.punto_partida || c.puntoPartida || "No especificado";
  const getExperiencia = (c: Candidato) => c.Experiencia || c.experiencia || "No especificada";
  const getMotivacion = (c: Candidato) => c.Motivación || c.motivacion || "No especificada";
  const getTalento = (c: Candidato) => c.Talento || c.talento || "";
  const getEstado = (c: Candidato) => c.Estado || c.estado || "Recibida";
  const getFecha = (c: Candidato) => c.Fecha || c.fecha || c.createdAt || "";

  // 1. Cargar configuración del servidor central
  const cargarConfiguracionServidor = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        if (data && data.config) {
          if (data.config.webhookUrl) {
            setScriptUrl(data.config.webhookUrl);
            setInputUrl(data.config.webhookUrl);
            localStorage.setItem(STORAGE_KEY_WEBHOOK, data.config.webhookUrl);
          }
          if (data.config.sheetName) setSheetName(data.config.sheetName);
          if (data.config.spreadsheetName) setSpreadsheetName(data.config.spreadsheetName);
        }
      }
    } catch (err) {
      console.warn("Aviso al obtener /api/config:", err);
    }
  };

  // 2. Cargar candidatos desde el servidor central (reúne registros de TODOS los dispositivos)
  const cargarCandidatos = async () => {
    setCargando(true);
    setError(null);
    setAlertaInfo(null);

    try {
      // 2.1 Enviar al servidor cualquier postulación previa guardada en el localStorage de este navegador
      try {
        const rawLocal = localStorage.getItem(STORAGE_KEY_POSTULACIONES);
        if (rawLocal) {
          const listLocal = JSON.parse(rawLocal);
          if (Array.isArray(listLocal) && listLocal.length > 0) {
            for (const item of listLocal) {
              await fetch('/api/candidatos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
              });
            }
          }
        }
      } catch (errLocalSync) {
        console.warn("Aviso al migrar locales al servidor:", errLocalSync);
      }

      // 2.2 Consultar lista unificada del servidor central con sincronización activa
      const resp = await fetch(`/api/candidatos?sync=true&_t=${Date.now()}`);
      if (!resp.ok) {
        throw new Error(`Error en servidor: HTTP ${resp.status}`);
      }

      const resJson = await resp.json();
      const listado: Candidato[] = Array.isArray(resJson.candidatos) ? resJson.candidatos : [];

      setCandidatos(listado);

      const sinSync = listado.filter(c => !c.syncedToSheets).length;
      if (sinSync > 0) {
        setAlertaInfo(`Hay ${sinSync} postulación(es) guardadas en el sistema pendientes de escribir en la hoja "${sheetName}" de tu Google Sheet "${spreadsheetName}". Puedes sincronizarlas con el botón abajo.`);
      }
    } catch (err: any) {
      console.warn("Error cargando desde /api/candidatos:", err);
      // Fallback a localStorage si el servidor está temporalmente inaccesible
      try {
        const raw = localStorage.getItem(STORAGE_KEY_POSTULACIONES);
        if (raw) {
          const locales = JSON.parse(raw);
          setCandidatos(locales);
          setAlertaInfo("Mostrando registros locales almacenados en este dispositivo.");
        } else {
          setError(`No se pudieron cargar candidatos: ${err.message || err}`);
        }
      } catch (_) {
        setError(`No se pudieron cargar candidatos: ${err.message || err}`);
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarConfiguracionServidor();
    cargarCandidatos();
  }, []);

  // Probar conexión en vivo con Google Apps Script
  const handleProbarConexion = async () => {
    setProbandoConexion(true);
    setResultadoTest(null);

    const limpia = inputUrl.trim();
    if (!limpia.startsWith('http')) {
      setResultadoTest({
        ok: false,
        msg: "Por favor introduce una URL válida (debe empezar con https://script.google.com/macros/s/.../exec)"
      });
      setProbandoConexion(false);
      return;
    }

    try {
      const res = await fetch('/api/test-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: limpia })
      });
      const data = await res.json();
      setResultadoTest({
        ok: data.ok,
        msg: data.message || (data.ok ? "Conexión exitosa" : "Error de conexión")
      });
    } catch (e: any) {
      setResultadoTest({
        ok: false,
        msg: `Error de red: ${e.message || e}. Verifica que el Webhook esté implementado con acceso 'Cualquier usuario' (Anyone).`
      });
    } finally {
      setProbandoConexion(false);
    }
  };

  // Guardar URL en el servidor para que aplique a TODOS los dispositivos
  const handleGuardarUrl = async () => {
    const limpia = inputUrl.trim();
    if (!limpia.startsWith('http')) {
      alert("Por favor ingresa una URL válida de Google Apps Script.");
      return;
    }

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: limpia,
          sheetName: "Tour Azul Postulaciones",
          spreadsheetName: "Registro Tour Azul"
        })
      });
      if (res.ok) {
        setScriptUrl(limpia);
        localStorage.setItem(STORAGE_KEY_WEBHOOK, limpia);
        alert(`¡URL guardada exitosamente en el servidor! Ahora todos los dispositivos enviarán las postulaciones a tu hoja "Tour Azul Postulaciones" en Google Sheets.`);
        setMostrarConfigUrl(false);
        await cargarCandidatos();
      } else {
        alert("No se pudo guardar la configuración en el servidor.");
      }
    } catch (e: any) {
      alert(`Error al guardar: ${e.message || e}`);
    }
  };

  // Sincronizar todos los candidatos pendientes hacia Google Sheets
  const handleSincronizarHaciaSheets = async () => {
    setSincronizando(true);
    try {
      const res = await fetch('/api/sync-sheets', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        alert(data.message || `Sincronización completada.`);
        await cargarCandidatos();
      } else {
        alert(`Aviso: ${data.message || "Error al sincronizar con Google Sheets"}`);
      }
    } catch (err: any) {
      alert(`Error al conectar: ${err.message || err}`);
    } finally {
      setSincronizando(false);
    }
  };

  // Enviar postulación de prueba para verificar que la hoja en Google Drive se llene
  const handleEnviarPostulacionPrueba = async () => {
    const confirmar = confirm(`¿Deseas enviar un aspirante de prueba para comprobar que se añade la fila en la hoja "${sheetName}" de tu archivo "${spreadsheetName}" en Google Drive?`);
    if (!confirmar) return;

    setCargando(true);
    try {
      const testId = `PRUEBA-${Date.now().toString().slice(-4)}`;
      const payload = {
        id: testId,
        codigo: testId,
        nombre: "Aspirante de Verificación Tour Azul",
        edad: 26,
        telefono: "0412-0000000",
        zona: "Barquisimeto",
        experiencia: "Tengo experiencia en turismo y recreación.",
        disponibilidad: "Sí, tengo disponibilidad.",
        punto_partida: "Sí, sin inconvenientes.",
        motivacion: "Verificación en vivo: Si ves este registro, significa que la hoja Tour Azul Postulaciones está recibiendo datos con total éxito.",
        talento: "Prueba técnica completada",
        foto: "No adjunta",
        tieneFoto: false,
        estado: "Recibida"
      };

      const res = await fetch('/api/candidatos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.ok) {
        if (data.syncedToSheets) {
          alert(`¡Éxito total! 🎉 La postulación de prueba ${testId} fue registrada en el servidor y escrita inmediatamente en tu hoja "${sheetName}" de "${spreadsheetName}" en Google Drive.`);
        } else {
          alert(`La postulación de prueba se guardó en el servidor compartido, pero el Webhook de Google Sheets respondió: "${data.sheetsResult?.statusText || 'Pendiente'}". Revisa la configuración del Webhook.`);
        }
        await cargarCandidatos();
      }
    } catch (e: any) {
      alert(`Error al enviar prueba: ${e.message || e}`);
    } finally {
      setCargando(false);
    }
  };

  // Copiar código de Code.gs al portapapeles
  const handleCopiarCodeGs = async () => {
    try {
      const res = await fetch('/Code.gs');
      const text = await res.text();
      navigator.clipboard?.writeText(text);
      setCopiadoCodeGs(true);
      setTimeout(() => setCopiadoCodeGs(false), 3000);
      alert("¡Código completo de Code.gs copiado al portapapeles! Ahora pégalo en el editor de Apps Script de tu archivo 'Registro Tour Azul'.");
    } catch (e) {
      alert("Para copiar Code.gs, abre el archivo Code.gs de tu proyecto y copia todo su contenido.");
    }
  };

  // Filtrado en tiempo real
  const candidatosFiltrados = useMemo(() => {
    return candidatos.filter((c) => {
      const nom = getNombre(c).toLowerCase();
      const zon = getZona(c).toLowerCase();
      const cod = getCodigo(c).toLowerCase();
      const tel = getTelefono(c).toLowerCase();
      const q = busqueda.toLowerCase().trim();

      const coincideTexto = !q || nom.includes(q) || zon.includes(q) || cod.includes(q) || tel.includes(q);
      if (!coincideTexto) return false;

      if (filtroDisponibilidad !== 'todos') {
        const disp = getDisponibilidad(c).toLowerCase();
        if (!disp.includes(filtroDisponibilidad.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [candidatos, busqueda, filtroDisponibilidad]);

  // Generador de enlace WhatsApp
  const getWhatsAppLink = (telefonoRaw: string, nombre: string) => {
    const clean = String(telefonoRaw || '').replace(/[^0-9]/g, '');
    if (!clean) return null;
    const phoneWithCountry = clean.startsWith('58') ? clean : '58' + clean.replace(/^0/, '');
    const mensaje = `¡Hola ${nombre}! Te contactamos desde el equipo de coordinación de Tour Azul en relación a tu postulación de trabajo.`;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(mensaje)}`;
  };

  const countSheets = candidatos.filter(c => c.syncedToSheets).length;
  const countPendientes = candidatos.filter(c => !c.syncedToSheets).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-6 md:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Barra superior de navegación rápida */}
        <div className="flex flex-wrap items-center justify-between bg-white px-5 py-3.5 rounded-2xl shadow-xs border border-slate-200/80 gap-3">
          <div className="flex items-center gap-2.5">
            <button 
              type="button"
              onClick={onBack ? onBack : () => { window.location.hash = ''; }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-blue-700 font-bold text-xs transition cursor-pointer active:scale-95"
              title="Volver a la portada de Tour Azul"
            >
              <span>← Volver a Tour Azul</span>
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition cursor-pointer active:scale-95"
                title="Cerrar sesión de administrador"
              >
                <span>🔒 Cerrar sesión</span>
              </button>
            )}

            <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Archivo: <strong>{spreadsheetName}</strong> &gt; Hoja: <strong>{sheetName}</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Multi-dispositivo activo</span>
            </span>
            <button
              type="button"
              onClick={() => setMostrarConfigUrl(!mostrarConfigUrl)}
              className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <span>⚙️ Conexión Google Sheets</span>
            </button>
          </div>
        </div>

        {/* Panel de Configuración y Solución para "Registro Tour Azul" */}
        {mostrarConfigUrl && (
          <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-lg border-2 border-blue-200 space-y-5 animate-fadeIn">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span>📊 Conexión con tu Google Drive</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>Conexión de la hoja "{sheetName}" en "{spreadsheetName}"</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Para que las postulaciones enviadas desde cualquier dispositivo se escriban automáticamente en tu hoja de cálculo <strong>"{spreadsheetName}"</strong> en Google Drive, debes implementar el código de <strong>Code.gs</strong> como aplicación web dentro de ese archivo.
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setMostrarConfigUrl(false)} 
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Paso a paso claro para el usuario */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs text-slate-700">
              <strong className="block text-slate-900 font-bold text-xs uppercase tracking-wide">
                🧭 ¿Cómo activar la escritura en tu archivo de Google Sheets?
              </strong>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-blue-700 block">Paso 1</span>
                  <p className="text-[11px] text-slate-600">Abre tu archivo <strong>Registro Tour Azul</strong> en Google Sheets desde tu Google Drive.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-blue-700 block">Paso 2</span>
                  <p className="text-[11px] text-slate-600">En el menú superior haz clic en <strong>Extensiones &gt; Apps Script</strong>.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-blue-700 block">Paso 3</span>
                  <p className="text-[11px] text-slate-600">Borra el código que haya y pega todo el contenido de <strong>Code.gs</strong> (usa el botón de abajo para copiarlo).</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-blue-700 block">Paso 4</span>
                  <p className="text-[11px] text-slate-600">Haz clic en <strong>Implementar &gt; Nueva implementación</strong>, tipo <em>Aplicación web</em>, acceso <em>Cualquier usuario</em> (Anyone) y pega la URL aquí.</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopiarCodeGs}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <span>📋 {copiadoCodeGs ? "¡Copiado!" : "Copiar todo el código de Code.gs"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarGuiaCodeGs(!mostrarGuiaCodeGs)}
                  className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  {mostrarGuiaCodeGs ? "Ocultar detalles de Code.gs" : "Ver detalles de Code.gs"}
                </button>
              </div>

              {mostrarGuiaCodeGs && (
                <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200 text-[11px] font-mono text-slate-600 space-y-1">
                  <p>✓ El archivo Code.gs incluido en este proyecto ya tiene la función <code>guardarPostulacionEnHoja</code> y <code>obtenerCandidatosPostulaciones</code>.</p>
                  <p>✓ Si tu archivo ya tiene la hoja <strong>"{sheetName}"</strong>, se insertarán automáticamente las filas allí respetando tus columnas.</p>
                  <p>✓ Si aún no existe la hoja, se creará automáticamente con encabezados estilizados de Tour Azul.</p>
                  <p>✓ Clave de administrador configurada por defecto: <strong>010203</strong>.</p>
                </div>
              )}
            </div>

            {/* Campo para la URL del Webhook */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">URL de la Aplicación Web de Google Apps Script (/exec):</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  value={inputUrl} 
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
                />
                <button
                  type="button"
                  onClick={handleProbarConexion}
                  disabled={probandoConexion}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {probandoConexion ? "Probando..." : "🔌 Probar Conexión"}
                </button>
                <button
                  type="button"
                  onClick={handleGuardarUrl}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Guardar para todos los dispositivos
                </button>
              </div>
            </div>

            {resultadoTest && (
              <div className={`p-3.5 rounded-2xl text-xs font-medium border ${resultadoTest.ok ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                {resultadoTest.msg}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleEnviarPostulacionPrueba}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition cursor-pointer"
                >
                  ✉️ Enviar postulación de prueba a Sheets
                </button>
                <button
                  type="button"
                  onClick={handleSincronizarHaciaSheets}
                  disabled={sincronizando}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200 transition cursor-pointer"
                >
                  {sincronizando ? "Sincronizando..." : "📤 Sincronizar candidatos pendientes"}
                </button>
              </div>

              <span className="text-[11px] text-slate-400">
                Clave de administrador configurada: <strong>010203</strong>
              </span>
            </div>
          </div>
        )}

        {/* Alerta de Postulaciones Pendientes de Sincronización a Sheets */}
        {countPendientes > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <span>⚠️</span>
                <span>{countPendientes} postulación(es) resguardadas en el servidor pendientes de escribir en Google Sheets</span>
              </div>
              <p className="text-amber-800 text-xs leading-relaxed">
                Estas postulaciones están seguras y visibles para todos los dispositivos. Una vez conectado tu Webhook de <strong>{spreadsheetName}</strong>, puedes enviarlas todas a la hoja <strong>"{sheetName}"</strong> con un solo clic.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSincronizarHaciaSheets}
              disabled={sincronizando}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
            >
              {sincronizando ? "Sincronizando..." : "📤 Sincronizar con Google Sheets ahora"}
            </button>
          </div>
        )}

        {/* Cabecera del Panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-xs border border-slate-200/80 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              <span>🛡️ Módulo de Selección de Personal · Clave Admin Activa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Panel de Postulaciones</h1>
            <p className="text-sm text-slate-500">
              Registros multi-dispositivo conectados con la hoja <span className="font-bold text-blue-700">{sheetName}</span> del archivo <span className="font-semibold text-slate-700">{spreadsheetName}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="text-xs text-right pr-2 hidden sm:block">
              <div className="text-slate-500">Total aspirantes: <strong className="text-slate-900">{candidatos.length}</strong></div>
              <div className="text-[11px] text-slate-400">En Sheets: <strong className="text-emerald-700">{countSheets}</strong> · Pendientes: <strong className="text-amber-700">{countPendientes}</strong></div>
            </div>

            <button 
              type="button" 
              onClick={cargarCandidatos}
              disabled={cargando}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <span className={cargando ? "animate-spin" : ""}>🔄</span>
              <span>{cargando ? "Actualizando..." : "Actualizar Lista"}</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        {!cargando && candidatos.length > 0 && (
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-72 md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                🔍
              </span>
              <input 
                type="text" 
                value={busqueda} 
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, zona, teléfono o código..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs bg-slate-50 focus:bg-white transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-slate-500 text-xs font-medium">Disponibilidad:</span>
              <select
                value={filtroDisponibilidad}
                onChange={(e) => setFiltroDisponibilidad(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="todos">Todas</option>
                <option value="completa">Disponibilidad completa / Sí</option>
                <option value="parcial">Parcial</option>
                <option value="Sí">Sí</option>
              </select>
            </div>
          </div>
        )}

        {/* Estados de Carga y Error */}
        {cargando && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-xs border border-slate-200/80 space-y-3">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-700 font-bold text-base">Sincronizando postulaciones en tiempo real...</p>
            <p className="text-xs text-slate-400">Consultando registros del servidor compartido y Google Sheets ("{sheetName}")</p>
          </div>
        )}

        {error && !cargando && (
          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <span>⚠️</span>
              <span>Atención al cargar postulaciones</span>
            </div>
            <p className="text-red-600 text-xs leading-relaxed">{error}</p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button 
                type="button"
                onClick={cargarCandidatos}
                className="px-3.5 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold transition cursor-pointer"
              >
                Reintentar
              </button>
              <button
                type="button"
                onClick={() => setMostrarConfigUrl(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition cursor-pointer"
              >
                Configurar Webhook de Google Sheets
              </button>
            </div>
          </div>
        )}

        {/* Tabla de Candidatos */}
        {!cargando && (
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
            {candidatos.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl shadow-inner border border-blue-100">
                  📋
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                  <h3 className="text-base font-bold text-slate-800">No hay postulaciones registradas todavía</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Tan pronto como cualquier aspirante complete el formulario desde cualquier teléfono o computadora, aparecerá automáticamente aquí en tiempo real y se enviará a la hoja <strong>{sheetName}</strong> de tu archivo <strong>{spreadsheetName}</strong>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={cargarCandidatos}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    🔄 Comprobar de nuevo
                  </button>
                  <button 
                    type="button"
                    onClick={handleEnviarPostulacionPrueba}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
                  >
                    ✉️ Enviar postulación de prueba para comprobar
                  </button>
                </div>
              </div>
            ) : candidatosFiltrados.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <p className="text-sm font-semibold text-slate-700">No se encontraron candidatos con el filtro actual.</p>
                <button 
                  type="button"
                  onClick={() => { setBusqueda(''); setFiltroDisponibilidad('todos'); }}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Foto</th>
                      <th className="px-5 py-3.5">Nombre & Código</th>
                      <th className="px-5 py-3.5">Edad / Zona</th>
                      <th className="px-5 py-3.5">Teléfono</th>
                      <th className="px-5 py-3.5">Disponibilidad</th>
                      <th className="px-5 py-3.5">Estado en Sheets</th>
                      <th className="px-5 py-3.5 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200/80">
                    {candidatosFiltrados.map((candidato, index) => {
                      const foto = getFoto(candidato);
                      const nombre = getNombre(candidato);
                      const codigo = getCodigo(candidato);
                      const edad = getEdad(candidato);
                      const zona = getZona(candidato);
                      const telefono = getTelefono(candidato);
                      const disp = getDisponibilidad(candidato);
                      const estado = getEstado(candidato);
                      const isSynced = candidato.syncedToSheets;
                      const waLink = getWhatsAppLink(telefono, nombre);

                      return (
                        <tr key={index} className="hover:bg-blue-50/40 transition-colors">
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            {isFotoValida(foto) ? (
                              <div 
                                className="relative group cursor-pointer inline-block"
                                onClick={() => setFotoAmpliada({ url: foto, nombre, codigo })}
                                title="Clic para ver fotografía ampliada"
                              >
                                <img 
                                  src={foto} 
                                  alt={nombre} 
                                  className="h-12 w-12 rounded-2xl object-cover shadow-sm border-2 border-white group-hover:border-blue-500 group-hover:scale-105 transition-all" 
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold pointer-events-none">
                                  <span>🔍</span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-500 flex flex-col items-center justify-center border border-slate-200">
                                <span className="font-bold text-xs">{nombre ? nombre.charAt(0).toUpperCase() : "?"}</span>
                                <span className="text-[9px] text-slate-400 font-medium">Sin foto</span>
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="text-sm font-bold text-slate-900">{nombre}</div>
                            <div className="text-[11px] font-mono text-slate-400">Código: {codigo}</div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="text-sm text-slate-900 font-medium">{edad} {edad !== '--' ? 'años' : ''}</div>
                            <div className="text-xs text-slate-500">{zona}</div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-600">
                            <div className="font-semibold text-slate-800">{telefono}</div>
                            {waLink && (
                              <a 
                                href={waLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 font-bold hover:underline mt-0.5"
                                title="Abrir chat en WhatsApp"
                              >
                                <span>💬 WhatsApp</span>
                              </a>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-xs">
                            <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                              {disp}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-xs">
                            <div className="flex flex-col gap-1 items-start">
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700 uppercase">
                                {estado}
                              </span>
                              {isSynced ? (
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                                  <span>🟢 En Google Sheets</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                                  <span>🟡 Pendiente en Sheets</span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-center space-x-1.5">
                            <button 
                              type="button"
                              onClick={() => setCandidatoSeleccionado(candidato)}
                              className="bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
                            >
                              Ver detalles
                            </button>
                            {waLink && (
                              <a 
                                href={waLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors inline-block border border-emerald-200"
                                title="Contactar por WhatsApp"
                              >
                                WhatsApp
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal de Detalle Completo de Postulación */}
        {candidatoSeleccionado && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-slate-200">
              <button 
                type="button"
                onClick={() => setCandidatoSeleccionado(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-sm font-bold transition cursor-pointer"
                title="Cerrar modal"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                {isFotoValida(getFoto(candidatoSeleccionado)) ? (
                  <div 
                    className="relative group cursor-pointer inline-block shrink-0"
                    onClick={() => setFotoAmpliada({ 
                      url: getFoto(candidatoSeleccionado), 
                      nombre: getNombre(candidatoSeleccionado), 
                      codigo: getCodigo(candidatoSeleccionado) 
                    })}
                    title="Clic para ver fotografía ampliada"
                  >
                    <img 
                      src={getFoto(candidatoSeleccionado)} 
                      alt={getNombre(candidatoSeleccionado)} 
                      className="h-16 w-16 rounded-2xl object-cover shadow border border-slate-200 group-hover:border-blue-500 transition-all" 
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold pointer-events-none">
                      <span>🔍</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-2xl border border-blue-200 shrink-0">
                    {getNombre(candidatoSeleccionado)?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="pr-6">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{getNombre(candidatoSeleccionado)}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">Código: {getCodigo(candidatoSeleccionado)}</p>
                  <div className="mt-1">
                    {candidatoSeleccionado.syncedToSheets ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Guardado en Google Sheets ({sheetName})
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Guardado en Servidor · Pendiente de sincronizar a Google Sheets
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                {/* Visualizador de Foto del Candidato */}
                {isFotoValida(getFoto(candidatoSeleccionado)) ? (
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide block text-left">
                      📷 Fotografía del aspirante
                    </span>
                    <div 
                      className="relative group cursor-pointer inline-block overflow-hidden rounded-2xl border-2 border-white shadow-md max-w-xs mx-auto"
                      onClick={() => setFotoAmpliada({ 
                        url: getFoto(candidatoSeleccionado), 
                        nombre: getNombre(candidatoSeleccionado), 
                        codigo: getCodigo(candidatoSeleccionado) 
                      })}
                      title="Haz clic para ver en pantalla completa"
                    >
                      <img 
                        src={getFoto(candidatoSeleccionado)} 
                        alt={getNombre(candidatoSeleccionado)} 
                        className="max-h-60 w-auto object-contain mx-auto rounded-xl group-hover:scale-105 transition-all duration-200"
                      />
                      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                        <span>🔍 Ampliar fotografía</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setFotoAmpliada({ 
                          url: getFoto(candidatoSeleccionado), 
                          nombre: getNombre(candidatoSeleccionado), 
                          codigo: getCodigo(candidatoSeleccionado) 
                        })}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                      >
                        🔍 Ver en pantalla completa
                      </button>
                      <a
                        href={getFoto(candidatoSeleccionado)}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={`foto_${getCodigo(candidatoSeleccionado)}.jpg`}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                      >
                        ⬇️ Abrir / Descargar
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-400 flex items-center gap-2">
                    <span className="text-base">📷</span>
                    <span>El aspirante no adjuntó fotografía en su formulario (campo opcional).</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Edad</span>
                    <strong className="text-slate-800 text-xs sm:text-sm">{getEdad(candidatoSeleccionado)} años</strong>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Zona</span>
                    <strong className="text-slate-800 text-xs sm:text-sm">{getZona(candidatoSeleccionado)}</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Teléfono / WhatsApp</span>
                      <strong className="text-slate-800 text-xs sm:text-sm">{getTelefono(candidatoSeleccionado)}</strong>
                    </div>
                    {getWhatsAppLink(getTelefono(candidatoSeleccionado), getNombre(candidatoSeleccionado)) && (
                      <a 
                        href={getWhatsAppLink(getTelefono(candidatoSeleccionado), getNombre(candidatoSeleccionado))!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <span>💬 Abrir WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-0.5">Punto de partida preferido</span>
                  <p className="text-slate-800 font-semibold">{getPuntoPartida(candidatoSeleccionado)}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-0.5">Disponibilidad horaria</span>
                  <p className="text-slate-800 font-semibold">{getDisponibilidad(candidatoSeleccionado)}</p>
                </div>

                <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 space-y-1">
                  <strong className="block text-blue-900 font-bold text-xs uppercase tracking-wide">Experiencia previa:</strong>
                  <p className="text-slate-700 text-xs leading-relaxed">{getExperiencia(candidatoSeleccionado)}</p>
                </div>

                <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 space-y-1">
                  <strong className="block text-blue-900 font-bold text-xs uppercase tracking-wide">Motivación y Aporte:</strong>
                  <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">{getMotivacion(candidatoSeleccionado)}</p>
                </div>

                {getTalento(candidatoSeleccionado) && (
                  <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 space-y-1">
                    <strong className="block text-amber-900 font-bold text-xs uppercase tracking-wide">🤭 Talento curioso:</strong>
                    <p className="text-slate-700 text-xs leading-relaxed">{getTalento(candidatoSeleccionado)}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                {getWhatsAppLink(getTelefono(candidatoSeleccionado), getNombre(candidatoSeleccionado)) ? (
                  <a 
                    href={getWhatsAppLink(getTelefono(candidatoSeleccionado), getNombre(candidatoSeleccionado))!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition text-center shadow-md active:scale-95"
                  >
                    Contactar por WhatsApp
                  </a>
                ) : (
                  <div></div>
                )}
                <button 
                  type="button"
                  onClick={() => setCandidatoSeleccionado(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Fotografía en Pantalla Completa (Lightbox) */}
        {fotoAmpliada && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 z-[70] animate-fadeIn"
            onClick={() => setFotoAmpliada(null)}
          >
            <div 
              className="relative max-w-4xl w-full max-h-[95vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex items-center justify-between text-white pb-3 px-2">
                <div>
                  <h4 className="font-bold text-base text-white">{fotoAmpliada.nombre}</h4>
                  <p className="text-xs text-white/70 font-mono">Código: {fotoAmpliada.codigo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={fotoAmpliada.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`foto_${fotoAmpliada.codigo}.jpg`}
                    className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 backdrop-blur-xs"
                  >
                    ⬇️ Descargar
                  </a>
                  <button
                    type="button"
                    onClick={() => setFotoAmpliada(null)}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-base transition cursor-pointer backdrop-blur-xs"
                    title="Cerrar fotografía"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="relative max-h-[80vh] flex items-center justify-center p-2">
                <img 
                  src={fotoAmpliada.url} 
                  alt={fotoAmpliada.nombre} 
                  className="max-h-[78vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/20"
                />
              </div>

              <p className="text-xs text-white/60 pt-2 text-center">
                Haz clic en la '✕' o fuera de la imagen para cerrar
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminCandidatos;