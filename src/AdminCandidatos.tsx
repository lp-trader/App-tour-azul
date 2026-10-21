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
  _origen?: 'sheets' | 'local';
  _isLocalOnly?: boolean;
  [key: string]: any;
}

interface AdminCandidatosProps {
  onBack?: () => void;
}

const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbylCyLwuyD_HJ90eYYw8Fle1kAOi-b9mQGmTjrORJKv6-WJv0o1wg1N1sKhkXDpbMHEVw/exec";
const STORAGE_KEY_WEBHOOK = "tour_azul_webhook_postulaciones_url";
const STORAGE_KEY_POSTULACIONES = "tour_azul_postulaciones";

export const AdminCandidatos: React.FC<AdminCandidatosProps> = ({ onBack }) => {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alertaInfo, setAlertaInfo] = useState<string | null>(null);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<Candidato | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<string>('todos');

  // Configuración de URL de Google Apps Script
  const [scriptUrl, setScriptUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_WEBHOOK) || DEFAULT_APPS_SCRIPT_URL;
  });
  const [mostrarConfigUrl, setMostrarConfigUrl] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>(scriptUrl);
  const [probandoConexion, setProbandoConexion] = useState<boolean>(false);
  const [resultadoTest, setResultadoTest] = useState<{ ok: boolean; msg: string } | null>(null);
  const [sincronizandoLocales, setSincronizandoLocales] = useState<boolean>(false);

  // Normalizadores de campos para soportar variaciones de claves
  const getNombre = (c: Candidato) => c.Nombre || c.nombre || "Sin nombre";
  const getCodigo = (c: Candidato) => c.Código || c.codigo || c.id || "S/C";
  const getFoto = (c: Candidato) => c.Foto || c.foto || "";
  const getEdad = (c: Candidato) => c.Edad || c.edad || "--";
  const getZona = (c: Candidato) => c.Zona || c.zona || "No especificada";
  const getTelefono = (c: Candidato) => c.Teléfono || c.telefono || "--";
  const getDisponibilidad = (c: Candidato) => c.Disponibilidad || c.disponibilidad || "No indicada";
  const getPuntoPartida = (c: Candidato) => c["Punto de partida"] || c.punto_partida || c.puntoPartida || "No especificado";
  const getExperiencia = (c: Candidato) => c.Experiencia || c.experiencia || "No especificada";
  const getMotivacion = (c: Candidato) => c.Motivación || c.motivacion || "No especificada";
  const getTalento = (c: Candidato) => c.Talento || c.talento || "";
  const getEstado = (c: Candidato) => c.Estado || c.estado || "Recibida";
  const getFecha = (c: Candidato) => c.Fecha || c.fecha || c.createdAt || "";

  // Lee postulaciones que hayan sido llenadas localmente en este navegador
  const obtenerPostulacionesLocales = (): Candidato[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_POSTULACIONES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any, idx: number) => ({
            ...item,
            id: item.id || item.codigo || `LOCAL-${idx + 1}`,
            codigo: item.codigo || item.id || `LOCAL-${idx + 1}`,
            _origen: 'local',
            _isLocalOnly: true
          }));
        }
      }
    } catch (e) {
      console.warn("Aviso al leer postulaciones locales:", e);
    }
    return [];
  };

  const cargarCandidatos = async () => {
    setCargando(true);
    setError(null);
    setAlertaInfo(null);

    const locales = obtenerPostulacionesLocales();

    try {
      const urlAUsar = (localStorage.getItem(STORAGE_KEY_WEBHOOK) || scriptUrl).trim();
      const separador = urlAUsar.includes('?') ? '&' : '?';
      const fetchUrl = `${urlAUsar}${separador}accion=candidatos&_t=${Date.now()}`;

      const respuesta = await fetch(fetchUrl, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });

      if (!respuesta.ok) {
        throw new Error(`Respuesta HTTP ${respuesta.status}: ${respuesta.statusText}`);
      }

      const resultado = await respuesta.json();
      let remotos: Candidato[] = [];

      if (resultado && resultado.status === "success" && Array.isArray(resultado.data)) {
        remotos = resultado.data;
      } else if (Array.isArray(resultado)) {
        remotos = resultado;
      } else if (resultado && Array.isArray(resultado.postulaciones)) {
        remotos = resultado.postulaciones;
      } else if (resultado && Array.isArray(resultado.candidatos)) {
        remotos = resultado.candidatos;
      } else if (resultado && resultado.status === "success" && !resultado.data) {
        remotos = [];
      } else {
        // Podría ser respuesta de otra acción si no está soportada aún en el script
        console.warn("Estructura devuelta por Apps Script:", resultado);
      }

      // Marcar remotos con origen sheets
      const remotosMarcados: Candidato[] = remotos.map(r => ({
        ...r,
        _origen: 'sheets',
        _isLocalOnly: false
      }));

      // Identificar cuáles locales aún NO están en Google Sheets (comparar por ID / código o nombre+teléfono)
      const idsRemotos = new Set(
        remotosMarcados.map(r => String(getCodigo(r) || '').toLowerCase().trim())
      );
      const nombresTelRemotos = new Set(
        remotosMarcados.map(r => `${getNombre(r).toLowerCase().trim()}_${getTelefono(r).replace(/[^0-9]/g, '')}`)
      );

      const localesNoSincronizados = locales.filter(l => {
        const idLocal = String(getCodigo(l) || '').toLowerCase().trim();
        const keyNomTel = `${getNombre(l).toLowerCase().trim()}_${getTelefono(l).replace(/[^0-9]/g, '')}`;
        return !idsRemotos.has(idLocal) && !nombresTelRemotos.has(keyNomTel);
      });

      // Lista combinada: primero los no sincronizados, luego los remotos
      const combinados = [...localesNoSincronizados, ...remotosMarcados];
      setCandidatos(combinados);

      if (localesNoSincronizados.length > 0) {
        setAlertaInfo(`Tienes ${localesNoSincronizados.length} postulación(es) registradas en este navegador pendientes de sincronizar con Google Sheets.`);
      }
    } catch (err: any) {
      console.warn("No se pudo conectar directamente con Google Sheets:", err);
      // Fallback: mostrar las postulaciones locales para que nunca se pierda nada
      if (locales.length > 0) {
        setCandidatos(locales);
        setAlertaInfo(`Mostrando ${locales.length} formulario(s) guardados en este navegador. (Nota: No se pudo conectar en vivo con Google Sheets: ${err.message || err})`);
      } else {
        setError(`No se pudieron obtener postulaciones desde Google Sheets (${err.message || err}). Verifica la URL del Webhook o despliega el código actualizado de Code.gs en tu hoja.`);
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCandidatos();
  }, [scriptUrl]);

  // Probar conexión directa con Google Apps Script
  const handleProbarConexion = async () => {
    setProbandoConexion(true);
    setResultadoTest(null);
    try {
      const separador = inputUrl.includes('?') ? '&' : '?';
      const testUrl = `${inputUrl.trim()}${separador}accion=candidatos&_t=${Date.now()}`;
      const res = await fetch(testUrl);
      const data = await res.json();

      if (data && (data.status === "success" || data.ok || Array.isArray(data))) {
        const total = Array.isArray(data.data) ? data.data.length : (Array.isArray(data) ? data.length : 0);
        setResultadoTest({
          ok: true,
          msg: `¡Conexión exitosa! Google Sheets respondió correctamente. Total de candidatos en la hoja: ${total}.`
        });
      } else {
        setResultadoTest({
          ok: false,
          msg: `El script respondió pero con formato no esperado: ${JSON.stringify(data).slice(0, 150)}`
        });
      }
    } catch (e: any) {
      setResultadoTest({
        ok: false,
        msg: `Error de conexión: ${e.message || e}. Verifica que el Webhook esté implementado como 'Cualquier usuario' (Anyone).`
      });
    } finally {
      setProbandoConexion(false);
    }
  };

  // Guardar la URL configurada por el usuario
  const handleGuardarUrl = () => {
    const limpia = inputUrl.trim();
    if (!limpia.startsWith('http')) {
      alert("Por favor ingresa una URL válida de Google Apps Script (debe comenzar con https://script.google.com/...)");
      return;
    }
    localStorage.setItem(STORAGE_KEY_WEBHOOK, limpia);
    setScriptUrl(limpia);
    setMostrarConfigUrl(false);
    setResultadoTest(null);
  };

  const handleRestablecerUrl = () => {
    localStorage.removeItem(STORAGE_KEY_WEBHOOK);
    setScriptUrl(DEFAULT_APPS_SCRIPT_URL);
    setInputUrl(DEFAULT_APPS_SCRIPT_URL);
    setResultadoTest(null);
  };

  // Sincronizar postulaciones pendientes con Google Sheets
  const handleSincronizarPendientes = async () => {
    const pendientes = candidatos.filter(c => c._isLocalOnly);
    if (pendientes.length === 0) {
      alert("No hay postulaciones pendientes de sincronizar.");
      return;
    }

    setSincronizandoLocales(true);
    let enviadas = 0;

    for (const c of pendientes) {
      try {
        const payload = {
          accion: "postulacion",
          id: getCodigo(c),
          codigo: getCodigo(c),
          nombre: getNombre(c),
          nombreCompleto: getNombre(c),
          edad: getEdad(c),
          telefono: getTelefono(c),
          zona: getZona(c),
          experiencia: getExperiencia(c),
          disponibilidad: getDisponibilidad(c),
          punto_partida: getPuntoPartida(c),
          motivacion: getMotivacion(c),
          talento: getTalento(c),
          foto: getFoto(c) || "No adjunta",
          estado: getEstado(c) || "Recibida",
          fecha: getFecha(c) || new Date().toLocaleString("es-VE")
        };

        await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
          redirect: "follow"
        });
        enviadas++;
      } catch (err) {
        console.warn("Aviso al sincronizar candidato:", c, err);
      }
    }

    setSincronizandoLocales(false);
    alert(`Se procesaron ${enviadas} de ${pendientes.length} postulaciones hacia Google Sheets.`);
    cargarCandidatos();
  };

  // Enviar una postulación de prueba para verificar que la hoja se cree y guarde
  const handleEnviarPostulacionPrueba = async () => {
    const confirmar = confirm("¿Deseas enviar una postulación de prueba para comprobar que se escribe en la hoja 'Tour Azul Postulaciones' de tu Google Sheets?");
    if (!confirmar) return;

    setCargando(true);
    try {
      const now = new Date();
      const testId = `TEST-${Date.now().toString().slice(-5)}`;
      const payload = {
        accion: "postulacion",
        id: testId,
        codigo: testId,
        nombre: "Postulante de Prueba Tour Azul",
        edad: 25,
        telefono: "0412-1234567",
        zona: "Barquisimeto Centro",
        experiencia: "Tengo algo de experiencia.",
        disponibilidad: "Sí, tengo disponibilidad.",
        punto_partida: "Sí, sin inconvenientes.",
        motivacion: "Postulación de prueba para verificar conexión en vivo con Google Sheets.",
        talento: "Prueba técnica",
        foto: "Sin foto",
        estado: "Recibida",
        fecha: now.toLocaleString("es-VE")
      };

      await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        redirect: "follow"
      });

      alert(`¡Postulación de prueba ${testId} enviada con éxito! Ahora revisa tu Google Sheet o actualiza la lista.`);
      await cargarCandidatos();
    } catch (e: any) {
      alert(`Error al enviar prueba: ${e.message || e}`);
    } finally {
      setCargando(false);
    }
  };

  // Filtrado de candidatos en tiempo real
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

  const handleVolver = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.hash = '';
    }
  };

  const copiarTexto = (txt: string) => {
    navigator.clipboard?.writeText(txt);
    alert(`Copiado: "${txt}"`);
  };

  const countLocales = candidatos.filter(c => c._isLocalOnly).length;
  const countSheets = candidatos.filter(c => !c._isLocalOnly).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-6 md:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Barra superior de navegación rápida */}
        <div className="flex flex-wrap items-center justify-between bg-white px-5 py-3 rounded-2xl shadow-xs border border-slate-200/80 gap-3">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={handleVolver}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-blue-700 font-bold text-xs transition cursor-pointer active:scale-95"
              title="Volver a la portada de Tour Azul"
            >
              <span>← Volver a Tour Azul</span>
            </button>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Hoja destino: <strong>Tour Azul Postulaciones</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">
              En Sheets: <strong className="text-emerald-700">{countSheets}</strong> · Locales: <strong className="text-amber-700">{countLocales}</strong>
            </span>
            <button
              type="button"
              onClick={() => setMostrarConfigUrl(!mostrarConfigUrl)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <span>⚙️ Configurar Webhook</span>
            </button>
          </div>
        </div>

        {/* Panel de Configuración de Webhook (Desplegable) */}
        {mostrarConfigUrl && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border-2 border-blue-200 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>⚙️ Configuración del Webhook de Google Sheets</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Verifica o actualiza la URL de la aplicación web de Google Apps Script donde se guardan y leen las postulaciones.
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

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">URL del Webhook de Google Apps Script (/exec):</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  value={inputUrl} 
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
                />
                <button
                  type="button"
                  onClick={handleProbarConexion}
                  disabled={probandoConexion}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {probandoConexion ? "Probando..." : "🔌 Probar Conexión"}
                </button>
                <button
                  type="button"
                  onClick={handleGuardarUrl}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Guardar URL
                </button>
              </div>
            </div>

            {resultadoTest && (
              <div className={`p-3 rounded-xl text-xs font-medium border ${resultadoTest.ok ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                {resultadoTest.msg}
              </div>
            )}

            <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200 text-xs text-sky-900 space-y-1.5 leading-relaxed">
              <strong className="block text-blue-900 font-bold">📋 Instrucciones clave para Google Sheets:</strong>
              <p>1. El archivo <strong>Code.gs</strong> incluido en este proyecto ya tiene soporte para la hoja <code className="bg-white px-1.5 py-0.5 rounded border font-bold text-blue-700">Tour Azul Postulaciones</code>.</p>
              <p>2. Copia y pega el contenido completo de <strong>Code.gs</strong> en tu editor de Google Apps Script (menú <em>Extensiones &gt; Apps Script</em>).</p>
              <p>3. Haz clic en <strong>Implementar &gt; Nueva implementación</strong>, selecciona tipo <em>Aplicación web</em>, asigna acceso a <em>Cualquier usuario</em> (Anyone) y copia la URL resultante terminada en <code>/exec</code>.</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEnviarPostulacionPrueba}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition cursor-pointer"
                >
                  ✉️ Enviar postulación de prueba a Sheets
                </button>
                <button
                  type="button"
                  onClick={() => copiarTexto("Tour Azul Postulaciones")}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
                >
                  Copiar nombre de hoja: "Tour Azul Postulaciones"
                </button>
              </div>

              <button
                type="button"
                onClick={handleRestablecerUrl}
                className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
              >
                Restablecer URL por defecto
              </button>
            </div>
          </div>
        )}

        {/* Alerta de Postulaciones Locales Pendientes de Sincronización */}
        {countLocales > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <span>⚠️</span>
                <span>{countLocales} formulario(s) guardados en este navegador</span>
              </div>
              <p className="text-amber-800 text-xs leading-relaxed">
                Estas postulaciones fueron llenadas desde la web y están resguardadas localmente. Puedes enviarlas a la hoja de Google Sheets con un solo clic.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSincronizarPendientes}
              disabled={sincronizandoLocales}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
            >
              {sincronizandoLocales ? "Sincronizando..." : "📤 Sincronizar con Google Sheets ahora"}
            </button>
          </div>
        )}

        {/* Cabecera del Panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              <span>🛡️ Módulo de Selección de Personal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Panel de Postulaciones</h1>
            <p className="text-sm text-slate-500">Candidatos recibidos y conectados con la hoja <span className="font-semibold text-blue-700">Tour Azul Postulaciones</span></p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button 
              type="button" 
              onClick={cargarCandidatos}
              disabled={cargando}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <span className={cargando ? "animate-spin" : ""}>🔄</span>
              <span>{cargando ? "Sincronizando..." : "Actualizar Lista"}</span>
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
          <div className="text-center py-16 bg-white rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-700 font-bold text-base">Consultando Google Sheets en tiempo real...</p>
            <p className="text-xs text-slate-400">Leyendo registros de la hoja "Tour Azul Postulaciones"</p>
          </div>
        )}

        {error && !cargando && (
          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <span>⚠️</span>
              <span>Atención al conectar con Google Sheets</span>
            </div>
            <p className="text-red-600 text-xs leading-relaxed">{error}</p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button 
                type="button"
                onClick={cargarCandidatos}
                className="px-3.5 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold transition cursor-pointer"
              >
                Reintentar conexión
              </button>
              <button
                type="button"
                onClick={() => setMostrarConfigUrl(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition cursor-pointer"
              >
                Revisar URL del Webhook
              </button>
            </div>
          </div>
        )}

        {/* Tabla de Candidatos */}
        {!cargando && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
            {candidatos.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl shadow-inner border border-blue-100">
                  📋
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                  <h3 className="text-base font-bold text-slate-800">No hay postulaciones registradas todavía</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Tan pronto como los aspirantes envíen sus datos a través de la sección «Únete al equipo» o se registren filas en la hoja <strong>Tour Azul Postulaciones</strong>, aparecerán aquí en vivo.
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
                      <th className="px-5 py-3.5">Estado / Origen</th>
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
                      const isLocalOnly = candidato._isLocalOnly;
                      const waLink = getWhatsAppLink(telefono, nombre);

                      return (
                        <tr key={index} className="hover:bg-blue-50/40 transition-colors">
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            {foto && (foto.startsWith('http') || foto.startsWith('data:image')) ? (
                              <img 
                                src={foto} 
                                alt={nombre} 
                                className="h-11 w-11 rounded-full object-cover shadow-xs border border-slate-200" 
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="h-11 w-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm border border-blue-200">
                                {nombre ? nombre.charAt(0).toUpperCase() : "?"}
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
                              {isLocalOnly ? (
                                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                  🟡 Pendiente sync
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  🟢 En Google Sheets
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

        {/* Modal de Detalle Completo */}
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
                {getFoto(candidatoSeleccionado) && (getFoto(candidatoSeleccionado).startsWith('http') || getFoto(candidatoSeleccionado).startsWith('data:image')) ? (
                  <img 
                    src={getFoto(candidatoSeleccionado)} 
                    alt={getNombre(candidatoSeleccionado)} 
                    className="h-16 w-16 rounded-2xl object-cover shadow border border-slate-200 shrink-0" 
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-2xl border border-blue-200 shrink-0">
                    {getNombre(candidatoSeleccionado)?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="pr-6">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{getNombre(candidatoSeleccionado)}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">Código: {getCodigo(candidatoSeleccionado)}</p>
                  <div className="mt-1">
                    {candidatoSeleccionado._isLocalOnly ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Pendiente de sincronizar a Google Sheets
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Guardado en Google Sheets (Hoja: Tour Azul Postulaciones)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
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

      </div>
    </div>
  );
};

export default AdminCandidatos;