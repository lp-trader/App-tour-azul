import React, { useState, useEffect, useMemo, useCallback } from 'react';

export interface Candidato {
  Foto?: string;
  foto?: string;
  fotoUrl?: string;
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
  updatedAt?: string;
  syncedToSheets?: boolean;
  _origen?: 'server' | 'sheets' | 'local';
  [key: string]: any;
}

interface AdminCandidatosProps {
  onBack?: () => void;
  onLogout?: () => void;
}

const STORAGE_KEY_WEBHOOK = "tour_azul_webhook_postulaciones_url";
const STORAGE_KEY_POSTULACIONES = "tour_azul_postulaciones";
const DEFAULT_URL = "https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec";

const ESTADOS_DISPONIBLES = [
  { id: 'Recibida', label: 'Recibida', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'Contactada', label: 'Contactada', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'Entrevistada', label: 'Entrevistada', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'Seleccionada', label: 'Seleccionada', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'Descartada', label: 'Descartada', color: 'bg-rose-50 text-rose-700 border-rose-200' }
];

export const AdminCandidatos: React.FC<AdminCandidatosProps> = ({ onBack, onLogout }) => {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [actualizandoSilencioso, setActualizandoSilencioso] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [alertaInfo, setAlertaInfo] = useState<string | null>(null);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<Candidato | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<string>('todos');
  const [autoActualizar, setAutoActualizar] = useState<boolean>(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>('');
  const [guardandoEstadoId, setGuardandoEstadoId] = useState<string | null>(null);

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

  // Helper para validar si hay una foto real
  const isFotoValida = (foto?: string) => {
    if (!foto) return false;
    const f = String(foto).trim();
    if (!f || f === 'No adjunta' || f === 'No' || f === '-' || f === 'Sin foto' || f === 'No especificado') return false;
    return f.startsWith('http') || f.startsWith('data:image') || f.startsWith('/uploads') || f.startsWith('/') || f.includes('.jpg') || f.includes('.png') || f.includes('.webp');
  };

  // Normalizadores de campos
  const getNombre = (c: Candidato) => c.Nombre || c.nombre || "Sin nombre";
  const getCodigo = (c: Candidato) => c.Código || c.codigo || c.id || "S/C";
  const getFoto = (c: Candidato) => c.fotoUrl || c.Foto || c.foto || "";
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

  // 2. Cargar candidatos desde el servidor central y Google Sheets
  const cargarCandidatos = useCallback(async (silencioso: boolean = false) => {
    if (!silencioso) {
      setCargando(true);
    } else {
      setActualizandoSilencioso(true);
    }
    setError(null);

    let listado: Candidato[] = [];
    let origenExitoso = '';

    // Intento 1: Servidor central unificado (/api/candidatos?sync=true)
    try {
      const resp = await fetch(`/api/candidatos?sync=true&_t=${Date.now()}`);
      if (resp.ok) {
        const resJson = await resp.json();
        if (Array.isArray(resJson.candidatos) && resJson.candidatos.length > 0) {
          listado = resJson.candidatos;
          origenExitoso = 'servidor';
        }
      }
    } catch (errServer: any) {
      console.warn("Aviso al consultar /api/candidatos:", errServer);
    }

    // Intento 2: Si el servidor no trajo registros o no está disponible, consultar directo a Google Apps Script
    if (listado.length === 0 && scriptUrl && scriptUrl.startsWith('http')) {
      try {
        const sep = scriptUrl.includes('?') ? '&' : '?';
        const directResp = await fetch(`${scriptUrl}${sep}accion=candidatos&_t=${Date.now()}`);
        if (directResp.ok) {
          const directJson = await directResp.json();
          let remotos: any[] = [];
          if (directJson && directJson.status === 'success' && Array.isArray(directJson.data)) remotos = directJson.data;
          else if (Array.isArray(directJson)) remotos = directJson;
          else if (directJson && Array.isArray(directJson.postulaciones)) remotos = directJson.postulaciones;
          else if (directJson && Array.isArray(directJson.candidatos)) remotos = directJson.candidatos;

          if (remotos.length > 0) {
            listado = remotos.map((r: any, idx: number) => ({
              ...r,
              id: r.id || r.codigo || r.Código || `POST-${idx}`,
              nombre: r.nombre || r.Nombre || 'Aspirante sin nombre',
              Nombre: r.Nombre || r.nombre || 'Aspirante sin nombre',
              telefono: r.telefono || r.Teléfono || '--',
              Teléfono: r.Teléfono || r.telefono || '--',
              zona: r.zona || r.Zona || 'No indicada',
              Zona: r.Zona || r.zona || 'No indicada',
              edad: r.edad !== undefined && r.edad !== '' ? r.edad : (r.Edad !== undefined ? r.Edad : '--'),
              estado: r.estado || r.Estado || 'Recibida',
              Estado: r.Estado || r.estado || 'Recibida',
              _origen: 'sheets',
              syncedToSheets: true
            }));
            origenExitoso = 'sheets_directo';
          }
        }
      } catch (errDirect) {
        console.warn("Aviso en consulta directa a Google Apps Script:", errDirect);
      }
    }

    // Filtrar candidatos para descartar filas vacías
    const candidatosValidos = listado.filter((c: Candidato) => {
      const nom = String(c.nombre || c.Nombre || '').trim();
      const tel = String(c.telefono || c.Teléfono || '').trim();
      return (nom.length > 0 && nom !== 'Sin nombre' && nom !== 'Aspirante sin nombre') || tel.length > 0;
    });

    if (candidatosValidos.length > 0) {
      setCandidatos(candidatosValidos);
      setUltimaActualizacion(new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      const sinSync = candidatosValidos.filter(c => !c.syncedToSheets).length;
      if (sinSync > 0) {
        setAlertaInfo(`Hay ${sinSync} postulación(es) guardadas en el sistema pendientes de escribir en la hoja "${sheetName}" de tu Google Sheet. Están seguras y visibles en todos tus dispositivos.`);
      } else {
        setAlertaInfo(null);
      }
    } else {
      // Intento 3: Si ambos fallaron y no hay internet, verificar respaldo local de este dispositivo
      try {
        const raw = localStorage.getItem(STORAGE_KEY_POSTULACIONES);
        if (raw) {
          const locales = JSON.parse(raw);
          const validosLocales = Array.isArray(locales) ? locales.filter(c => (c.nombre || c.Nombre || '').trim().length > 0) : [];
          if (validosLocales.length > 0) {
            setCandidatos(validosLocales);
            setAlertaInfo("⚠️ Sin conexión con Google Sheets: Mostrando únicamente postulaciones registradas localmente en este dispositivo.");
          } else {
            setCandidatos([]);
          }
        } else {
          setCandidatos([]);
        }
      } catch (_) {
        setError(`No se pudieron sincronizar las postulaciones desde Google Sheets.`);
      }
    }

    if (!silencioso) setCargando(false);
    setActualizandoSilencioso(false);
  }, [scriptUrl, sheetName]);

  // Carga inicial y configuración
  useEffect(() => {
    cargarConfiguracionServidor();
    cargarCandidatos(false);
  }, [cargarCandidatos]);

  // Auto-actualización periódica (cada 20s) para ver postulaciones que lleguen desde teléfonos móviles
  useEffect(() => {
    if (!autoActualizar) return;
    const interval = setInterval(() => {
      cargarCandidatos(true);
    }, 20000);
    return () => clearInterval(interval);
  }, [autoActualizar, cargarCandidatos]);

  // 3. Cambiar estado de un candidato (Guarda inmediatamente en el servidor para todos los dispositivos)
  const handleCambiarEstado = async (id: string, nuevoEstado: string) => {
    setGuardandoEstadoId(id);
    // Actualización optimista inmediata
    setCandidatos(prev => prev.map(c => {
      if (String(c.id || c.codigo) === String(id)) {
        return { ...c, estado: nuevoEstado, Estado: nuevoEstado };
      }
      return c;
    }));

    if (candidatoSeleccionado && String(candidatoSeleccionado.id || candidatoSeleccionado.codigo) === String(id)) {
      setCandidatoSeleccionado(prev => prev ? { ...prev, estado: nuevoEstado, Estado: nuevoEstado } : null);
    }

    try {
      const res = await fetch(`/api/candidatos/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      console.error("Error al actualizar estado en servidor:", err);
      alert("Aviso: No se pudo guardar el cambio en el servidor central. Se sincronizará en la próxima actualización.");
    } finally {
      setGuardandoEstadoId(null);
    }
  };

  // 4. Eliminar candidato (para pruebas)
  const handleEliminarCandidato = async (id: string, nombre: string) => {
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar la postulación de "${nombre}" (${id})? Esta acción se reflejará en todos los dispositivos.`);
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/candidatos/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCandidatos(prev => prev.filter(c => String(c.id || c.codigo) !== String(id)));
        if (candidatoSeleccionado && String(candidatoSeleccionado.id || candidatoSeleccionado.codigo) === String(id)) {
          setCandidatoSeleccionado(null);
        }
      } else {
        alert("No se pudo eliminar el candidato del servidor.");
      }
    } catch (e: any) {
      alert(`Error al eliminar: ${e.message || e}`);
    }
  };

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
        await cargarCandidatos(false);
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
        await cargarCandidatos(true);
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
    const confirmar = confirm(`¿Deseas enviar un aspirante de prueba para comprobar que se añade la fila en la hoja "${sheetName}" y que aparece en todos los dispositivos?`);
    if (!confirmar) return;

    setCargando(true);
    try {
      const testId = `PRUEBA-${Date.now().toString().slice(-4)}`;
      const payload = {
        id: testId,
        codigo: testId,
        nombre: "Aspirante de Verificación Multi-dispositivo",
        edad: 26,
        telefono: "0412-0000000",
        zona: "Barquisimeto",
        experiencia: "Tengo experiencia en turismo y recreación.",
        disponibilidad: "Sí, tengo disponibilidad.",
        punto_partida: "Sí, sin inconvenientes.",
        motivacion: "Verificación en vivo: Este registro confirma que los formularios se sincronizan inmediatamente en cualquier teléfono o computadora del administrador.",
        talento: "Coordinación y entusiasmo",
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
        alert(`¡Registro creado! 🎉 Se guardó en el servidor central y se sincronizó con Google Sheets. Ya está visible en cualquier dispositivo que abra el admin.`);
        await cargarCandidatos(false);
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

  // Conteo por estados
  const conteos = useMemo(() => {
    const counts: Record<string, number> = {
      todos: candidatos.length,
      Recibida: 0,
      Contactada: 0,
      Entrevistada: 0,
      Seleccionada: 0,
      Descartada: 0
    };
    candidatos.forEach(c => {
      const est = getEstado(c);
      if (counts[est] !== undefined) {
        counts[est]++;
      } else {
        counts.Recibida++;
      }
    });
    return counts;
  }, [candidatos]);

  // Filtrado en tiempo real
  const candidatosFiltrados = useMemo(() => {
    return candidatos.filter((c) => {
      const nom = getNombre(c).toLowerCase();
      const zon = getZona(c).toLowerCase();
      const cod = getCodigo(c).toLowerCase();
      const tel = getTelefono(c).toLowerCase();
      const est = getEstado(c);
      const q = busqueda.toLowerCase().trim();

      const coincideTexto = !q || nom.includes(q) || zon.includes(q) || cod.includes(q) || tel.includes(q);
      if (!coincideTexto) return false;

      if (filtroEstado !== 'todos' && est !== filtroEstado) {
        return false;
      }

      if (filtroDisponibilidad !== 'todos') {
        const disp = getDisponibilidad(c).toLowerCase();
        if (!disp.includes(filtroDisponibilidad.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [candidatos, busqueda, filtroEstado, filtroDisponibilidad]);

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
    <div className="min-h-screen bg-slate-100 text-slate-800 p-3 sm:p-5 md:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Barra superior de navegación rápida */}
        <div className="flex flex-wrap items-center justify-between bg-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-xs border border-slate-200/80 gap-3">
          <div className="flex items-center gap-2">
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
                <span>🔒 Salir</span>
              </button>
            )}

            <span className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Archivo: <strong>{spreadsheetName}</strong> &gt; Hoja: <strong>{sheetName}</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Indicador de servidor multi-dispositivo */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]" title="Los datos se guardan en el servidor central y se sincronizan en cualquier teléfono, tablet o PC">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Multi-dispositivo en vivo</span>
            </span>

            <button
              type="button"
              onClick={() => setMostrarConfigUrl(!mostrarConfigUrl)}
              className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <span>⚙️ Conexión Sheets</span>
            </button>
          </div>
        </div>

        {/* Tarjeta explicativa: Multi-dispositivo para el administrador */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-sky-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌐</span>
              <h2 className="font-title font-black text-sm sm:text-base uppercase tracking-tight text-tour-yellow">
                Panel Centralizado Multi-Dispositivo
              </h2>
            </div>
            <p className="text-xs text-sky-100/90 max-w-3xl leading-relaxed">
              Cualquier formulario que llenen los aspirantes desde sus teléfonos celulares o computadoras se almacena de inmediato en el servidor central de Tour Azul y se envía a Google Sheets. Como administrador, puedes ingresar a este panel desde <strong>cualquier dispositivo</strong> (tu teléfono, laptop u oficina) con la clave <strong>010203</strong> y verás siempre la lista completa actualizada.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <a
              href="/api/candidatos/export.csv"
              download="candidatos_tour_azul.csv"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition active:scale-95 flex items-center gap-1.5"
              title="Descargar lista completa en Excel (CSV)"
            >
              <span>📊 Descargar Excel</span>
            </a>
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
                Clave de administrador: <strong>010203</strong>
              </span>
            </div>
          </div>
        )}

        {/* Alerta informativa de sincronización */}
        {alertaInfo && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <span>⚠️</span>
                <span>{countPendientes} postulación(es) resguardadas en el servidor</span>
              </div>
              <p className="text-amber-800 text-xs leading-relaxed">{alertaInfo}</p>
            </div>
            <button
              type="button"
              onClick={handleSincronizarHaciaSheets}
              disabled={sincronizando}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
            >
              {sincronizando ? "Sincronizando..." : "📤 Sincronizar con Sheets ahora"}
            </button>
          </div>
        )}

        {/* Cabecera del Panel de Control */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 sm:p-6 rounded-3xl shadow-xs border border-slate-200/80 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider">
                🛡️ Control de Candidatos · Tour Azul
              </span>
              {ultimaActualizacion && (
                <span className="text-[11px] text-slate-400 font-mono">
                  Sincronizado: {ultimaActualizacion}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Panel de Aspirantes</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Registros consolidados de todos los formularios enviados desde cualquier dispositivo
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Toggle de Auto-actualización */}
            <button
              type="button"
              onClick={() => setAutoActualizar(!autoActualizar)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                autoActualizar 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title="Actualiza la lista automáticamente cada 20 segundos"
            >
              <span className={`w-2 h-2 rounded-full ${autoActualizar ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>{autoActualizar ? 'Auto-refresco: Activo' : 'Auto-refresco: Pausado'}</span>
            </button>

            {/* Botón manual de refresco */}
            <button 
              type="button" 
              onClick={() => cargarCandidatos(false)}
              disabled={cargando}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <span className={cargando || actualizandoSilencioso ? "animate-spin" : ""}>🔄</span>
              <span>{cargando ? "Actualizando..." : "Actualizar ahora"}</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Filtro por Estado */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setFiltroEstado('todos')}
            className={`px-4 py-2 rounded-2xl font-bold whitespace-nowrap transition cursor-pointer ${
              filtroEstado === 'todos'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Todos ({conteos.todos})
          </button>
          {ESTADOS_DISPONIBLES.map(est => (
            <button
              key={est.id}
              type="button"
              onClick={() => setFiltroEstado(est.id)}
              className={`px-3.5 py-2 rounded-2xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                filtroEstado === est.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>{est.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono">
                {conteos[est.id] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Barra de Búsqueda y Disponibilidad */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              🔍
            </span>
            <input 
              type="text" 
              value={busqueda} 
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, zona, teléfono o código..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs bg-slate-50 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Disponibilidad:</span>
              <select
                value={filtroDisponibilidad}
                onChange={(e) => setFiltroDisponibilidad(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="todos">Todas</option>
                <option value="completa">Completa / Sí</option>
                <option value="parcial">Parcial</option>
                <option value="Sí">Sí</option>
              </select>
            </div>

            <a
              href="/api/candidatos/export.csv"
              download="candidatos_tour_azul.csv"
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1"
              title="Descargar tabla en formato CSV compatible con Excel"
            >
              <span>📥 Exportar CSV</span>
            </a>
          </div>
        </div>

        {/* Estados de Carga Inicial */}
        {cargando && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-xs border border-slate-200/80 space-y-3">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-700 font-bold text-base">Sincronizando postulaciones de todos los dispositivos...</p>
            <p className="text-xs text-slate-400">Reuniendo registros del servidor central y Google Sheets</p>
          </div>
        )}

        {/* Error */}
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
                onClick={() => cargarCandidatos(false)}
                className="px-3.5 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold transition cursor-pointer"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Lista / Tabla de Candidatos */}
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
                    Tan pronto como cualquier aspirante complete el formulario desde su teléfono o computadora, aparecerá automáticamente aquí en tiempo real y se enviará a la hoja <strong>{sheetName}</strong> de tu archivo <strong>{spreadsheetName}</strong>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => cargarCandidatos(false)}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    🔄 Comprobar de nuevo
                  </button>
                  <button 
                    type="button"
                    onClick={handleEnviarPostulacionPrueba}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
                  >
                    ✉️ Enviar postulación de prueba
                  </button>
                </div>
              </div>
            ) : candidatosFiltrados.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <p className="text-sm font-semibold text-slate-700">No se encontraron candidatos con los filtros actuales.</p>
                <button 
                  type="button"
                  onClick={() => { setBusqueda(''); setFiltroEstado('todos'); setFiltroDisponibilidad('todos'); }}
                  className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
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
                      <th className="px-5 py-3.5">Teléfono / WhatsApp</th>
                      <th className="px-5 py-3.5">Disponibilidad</th>
                      <th className="px-5 py-3.5">Estado</th>
                      <th className="px-5 py-3.5 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200/80">
                    {candidatosFiltrados.map((candidato, index) => {
                      const idCandidato = String(candidato.id || candidato.codigo || `POST-${index}`);
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
                        <tr key={idCandidato} className="hover:bg-blue-50/40 transition-colors">
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
                              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center border border-blue-100">
                                <span className="font-bold text-xs">{nombre ? nombre.charAt(0).toUpperCase() : "?"}</span>
                                <span className="text-[9px] text-blue-400 font-medium">Sin foto</span>
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="text-sm font-bold text-slate-900">{nombre}</div>
                            <div className="text-[11px] font-mono text-slate-400">Código: {codigo}</div>
                            <div className="text-[10px] text-slate-400">{getFecha(candidato)}</div>
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
                              {/* Selector desplegable de estado guardado en servidor */}
                              <select
                                value={estado}
                                disabled={guardandoEstadoId === idCandidato}
                                onChange={(e) => handleCambiarEstado(idCandidato, e.target.value)}
                                className={`px-2 py-1 text-[11px] font-bold rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer transition ${
                                  estado === 'Recibida' ? 'bg-sky-50 text-sky-800 border-sky-300' :
                                  estado === 'Contactada' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                                  estado === 'Entrevistada' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                                  estado === 'Seleccionada' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                                  'bg-rose-50 text-rose-800 border-rose-300'
                                }`}
                                title="Cambiar estado del aspirante (se guarda inmediatamente para todos los dispositivos)"
                              >
                                {ESTADOS_DISPONIBLES.map(est => (
                                  <option key={est.id} value={est.id}>{est.label}</option>
                                ))}
                              </select>

                              {isSynced ? (
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                                  <span>🟢 En Google Sheets</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                                  <span>🟡 Resguardo local</span>
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
                            <button
                              type="button"
                              onClick={() => handleEliminarCandidato(idCandidato, nombre)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              title="Eliminar registro"
                            >
                              🗑️
                            </button>
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
                  
                  {/* Selector de estado en modal */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Estado:</span>
                    <select
                      value={getEstado(candidatoSeleccionado)}
                      onChange={(e) => handleCambiarEstado(String(candidatoSeleccionado.id || candidatoSeleccionado.codigo), e.target.value)}
                      className="px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                    >
                      {ESTADOS_DISPONIBLES.map(est => (
                        <option key={est.id} value={est.id}>{est.label}</option>
                      ))}
                    </select>
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
                    className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition"
                  >
                    ⬇️ Descargar
                  </a>
                  <button
                    type="button"
                    onClick={() => setFotoAmpliada(null)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <img 
                src={fotoAmpliada.url} 
                alt={fotoAmpliada.nombre} 
                className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/20"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminCandidatos;