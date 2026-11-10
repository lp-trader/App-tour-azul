import React, { useState, useEffect, useMemo, useCallback } from 'react';

export interface PasajeroViaje {
  idReserva: string;
  fechaRegistro: string;
  nombre: string;
  cedula: string;
  telefono: string;
  puntoPartida: string;
  totalPersonas: number;
  acompanantes?: Array<{ nombre: string; cedula?: string; edad?: string | number }>;
  tipoPago: string;
  abonoEur: number;
  saldoPendienteEur: number;
  referencia?: string;
  estadoPago: string;
  syncedToSheets?: boolean;
}

export interface ResumenViaje {
  id: string;
  destino: string;
  precioRef: number;
  tipo: string;
  imagenUrl: string;
  salidas: Array<{
    fecha: string;
    fechaTexto: string;
    totalReservas: number;
    totalPasajeros: number;
    totalAbonadoEur: number;
    totalPendienteEur: number;
    pasajeros: PasajeroViaje[];
  }>;
  totalReservas: number;
  totalPasajeros: number;
  totalAbonadoEur: number;
}

export interface ClienteGeneral {
  cedula: string;
  nombre: string;
  telefono: string;
  viajes: Array<{
    idReserva: string;
    destino: string;
    fechaViaje: string;
    fechaRegistro?: string;
    totalPersonas: number;
    puntoPartida?: string;
    abonoEur?: number;
    saldoPendienteEur?: number;
    estadoPago?: string;
    referencia?: string;
    esAcompananteDe?: string;
  }>;
  totalViajes: number;
  totalPersonasLlevadas: number;
  totalAbonadoEur: number;
  ultimoDestino?: string;
  ultimaFecha?: string;
  puntoPartidaHabitual?: string;
}

export interface Candidato {
  id?: string;
  codigo?: string;
  nombre?: string;
  Nombre?: string;
  cedula?: string;
  edad?: number | string;
  telefono?: string;
  Teléfono?: string;
  zona?: string;
  experiencia?: string;
  disponibilidad?: string;
  punto_partida?: string;
  motivacion?: string;
  talento?: string;
  foto?: string;
  fotoUrl?: string;
  estado?: string;
  Estado?: string;
  fecha?: string;
  syncedToSheets?: boolean;
  [key: string]: any;
}

interface AdminPanelProps {
  onBack?: () => void;
  onLogout?: () => void;
  authToken?: string | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, onLogout, authToken }) => {
  const [activeTab, setActiveTab] = useState<'viajes' | 'clientes' | 'candidatos' | 'config'>('viajes');

  // Datos de viajes
  const [resumenViajes, setResumenViajes] = useState<ResumenViaje[]>([]);
  const [cargandoViajes, setCargandoViajes] = useState<boolean>(true);
  const [viajeSeleccionadoId, setViajeSeleccionadoId] = useState<string | null>(null);
  const [filtroEstadoViaje, setFiltroEstadoViaje] = useState<'pendientes' | 'todos' | 'culminados'>('pendientes');

  // Datos de clientes generales
  const [clientes, setClientes] = useState<ClienteGeneral[]>([]);
  const [cargandoClientes, setCargandoClientes] = useState<boolean>(true);
  const [busquedaCliente, setBusquedaCliente] = useState<string>('');
  const [clienteDetalle, setClienteDetalle] = useState<ClienteGeneral | null>(null);
  const [copiadoTelefonos, setCopiadoTelefonos] = useState<boolean>(false);

  // Datos de candidatos (segundo plano)
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [cargandoCandidatos, setCargandoCandidatos] = useState<boolean>(true);
  const [busquedaCandidato, setBusquedaCandidato] = useState<string>('');
  const [filtroEstadoCandidato, setFiltroEstadoCandidato] = useState<string>('todos');
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<Candidato | null>(null);

  // Configuración Google Sheets
  const [configSheets, setConfigSheets] = useState<{ webhookUrl: string; sheetName: string; spreadsheetName: string } | null>(null);
  const [probandoConexion, setProbandoConexion] = useState<boolean>(false);
  const [resultadoTest, setResultadoTest] = useState<{ ok: boolean; msg: string } | null>(null);
  const [sincronizandoReservas, setSincronizandoReservas] = useState<boolean>(false);
  const [msgSincronizacion, setMsgSincronizacion] = useState<string | null>(null);
  const [editandoUrl, setEditandoUrl] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>('');

  const getToken = useCallback((): string | null => {
    return authToken ||
      sessionStorage.getItem('tour_azul_admin_token') ||
      localStorage.getItem('tour_azul_admin_token') ||
      null;
  }, [authToken]);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const token = getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, [getToken]);

  // Cargar Viajes
  const cargarViajes = useCallback(async () => {
    setCargandoViajes(true);
    try {
      const res = await fetch('/api/viajes/resumen');
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.resumen)) {
          setResumenViajes(data.resumen);
        }
      }
    } catch (e) {
      console.warn('Error cargando resumen de viajes:', e);
    } finally {
      setCargandoViajes(false);
    }
  }, []);

  // Cargar Clientes
  const cargarClientes = useCallback(async () => {
    setCargandoClientes(true);
    try {
      const res = await fetch('/api/clientes/general');
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.clientes)) {
          setClientes(data.clientes);
        }
      }
    } catch (e) {
      console.warn('Error cargando lista general de clientes:', e);
    } finally {
      setCargandoClientes(false);
    }
  }, []);

  // Cargar Candidatos
  const cargarCandidatos = useCallback(async () => {
    setCargandoCandidatos(true);
    try {
      const res = await fetch('/api/candidatos?sync=false');
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.candidatos)) {
          setCandidatos(data.candidatos);
        }
      }
    } catch (e) {
      console.warn('Error cargando candidatos:', e);
    } finally {
      setCargandoCandidatos(false);
    }
  }, []);

  // Cargar Configuración de Google Sheets
  const cargarConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.config) {
          setConfigSheets(data.config);
          setInputUrl(data.config.webhookUrl || '');
        }
      }
    } catch (e) {
      console.warn('Error cargando config:', e);
    }
  }, []);

  useEffect(() => {
    cargarViajes();
    cargarClientes();
    cargarCandidatos();
    cargarConfig();
  }, [cargarViajes, cargarClientes, cargarCandidatos, cargarConfig]);

  // Forzar sincronización de reservas a Google Sheets
  const handleSincronizarReservas = async () => {
    setSincronizandoReservas(true);
    setMsgSincronizacion(null);
    try {
      const res = await fetch('/api/sync-reservas-sheets', {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.ok) {
        setMsgSincronizacion(`✅ ${data.message}`);
        await cargarViajes();
        await cargarClientes();
      } else {
        setMsgSincronizacion(`⚠️ ${data.message || 'Error sincronizando con Google Sheets'}`);
      }
    } catch (err: any) {
      setMsgSincronizacion(`❌ Error: ${err.message || 'Fallo de conexión'}`);
    } finally {
      setSincronizandoReservas(false);
      setTimeout(() => setMsgSincronizacion(null), 6000);
    }
  };

  // Testear conexión Google Sheets
  const handleTestSheets = async () => {
    setProbandoConexion(true);
    setResultadoTest(null);
    try {
      const res = await fetch('/api/test-sheets', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ url: inputUrl })
      });
      const data = await res.json();
      setResultadoTest({
        ok: Boolean(data.ok),
        msg: data.message || (data.ok ? 'Conexión exitosa con Google Sheets' : 'Error conectando')
      });
    } catch (err: any) {
      setResultadoTest({ ok: false, msg: err.message || 'Error de red' });
    } finally {
      setProbandoConexion(false);
    }
  };

  const [copiandoScript, setCopiandoScript] = useState<boolean>(false);

  // Desconectar Google Sheets
  const handleDesconectarSheets = async () => {
    if (!window.confirm('¿Deseas desconectar el Google Sheet actual? El sistema quedará limpio y listo para que agregues tu nueva hoja y script.')) return;
    try {
      const res = await fetch('/api/admin/disconnect-sheets', {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.ok) {
        setConfigSheets(data.config);
        setInputUrl('');
        setResultadoTest(null);
        try { localStorage.removeItem('tour_azul_sheets_webhook_url'); } catch (_) {}
        alert('Google Sheets desconectado con éxito. Ahora puedes conectar tu nueva hoja.');
      }
    } catch (e: any) {
      alert(`Error al desconectar: ${e.message}`);
    }
  };

  // Limpiar todos los registros locales (empezar en cero)
  const handleResetData = async () => {
    if (!window.confirm('¿Estás seguro de que deseas vaciar todos los registros de reservas y postulaciones locales? La base de datos quedará limpia en cero.')) return;
    try {
      const res = await fetch('/api/admin/reset-data', {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.ok) {
        await cargarViajes();
        await cargarClientes();
        await cargarCandidatos();
        alert('✅ Base de datos limpiada. Registros en cero listos para nuevas reservas.');
      }
    } catch (e: any) {
      alert(`Error limpiando registros: ${e.message}`);
    }
  };

  // Copiar código Code.gs para la nueva hoja
  const handleCopiarCodeGs = async () => {
    setCopiandoScript(true);
    try {
      const res = await fetch('/api/admin/code-gs');
      if (res.ok) {
        const text = await res.text();
        if (navigator.clipboard && text) {
          await navigator.clipboard.writeText(text);
          alert('¡Código de Code.gs copiado al portapapeles! Abre tu Google Spreadsheet > Extensiones > Apps Script y pégalo allí.');
        } else {
          alert('Copia el contenido del archivo Code.gs de la raíz del proyecto.');
        }
      } else {
        alert('Error al descargar el script Code.gs');
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setCopiandoScript(false);
    }
  };

  // Guardar nueva URL de Webhook
  const handleGuardarUrl = async () => {
    const clean = inputUrl.trim();
    if (!clean.startsWith('http')) {
      alert('Por favor ingresa una URL válida de Google Apps Script que termine en /exec');
      return;
    }
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ webhookUrl: clean })
      });
      const data = await res.json();
      if (data.ok) {
        setConfigSheets(data.config);
        setEditandoUrl(false);
        try { localStorage.setItem('tour_azul_sheets_webhook_url', clean); } catch (_) {}
        alert('URL de Google Sheets guardada con éxito.');
      }
    } catch (e: any) {
      alert(`Error guardando configuración: ${e.message}`);
    }
  };

  // Actualizar estado de pago de una reserva
  const handleCambiarEstadoPago = async (idReserva: string, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/reservas/${encodeURIComponent(idReserva)}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ estadoPago: nuevoEstado })
      });
      if (res.ok) {
        await cargarViajes();
        await cargarClientes();
      }
    } catch (e) {
      console.warn('Error actualizando estado de pago:', e);
    }
  };

  const hoyIso = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Caracas' }).format(new Date());
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }, []);

  // Métricas totales de noviembre
  const metricasNoviembre = useMemo(() => {
    let totalReservas = 0;
    let totalPasajeros = 0;
    let totalAbonado = 0;
    let totalPendientes = 0;
    let totalCulminados = 0;
    resumenViajes.forEach(v => {
      totalReservas += v.totalReservas;
      totalPasajeros += v.totalPasajeros;
      totalAbonado += v.totalAbonadoEur;
      const fechaSalida = v.salidas[0]?.fecha || '';
      if (fechaSalida >= hoyIso) {
        totalPendientes++;
      } else {
        totalCulminados++;
      }
    });
    return {
      totalReservas,
      totalPasajeros,
      totalAbonado,
      totalViajes: resumenViajes.length,
      totalPendientes,
      totalCulminados
    };
  }, [resumenViajes, hoyIso]);

  // Viajes filtrados por estado (Pendientes / Todos / Culminados)
  const viajesFiltrados = useMemo(() => {
    return resumenViajes.filter(v => {
      const fechaSalida = v.salidas[0]?.fecha || '';
      const esPendiente = fechaSalida >= hoyIso;
      if (filtroEstadoViaje === 'pendientes') return esPendiente;
      if (filtroEstadoViaje === 'culminados') return !esPendiente;
      return true;
    });
  }, [resumenViajes, filtroEstadoViaje, hoyIso]);

  // Clientes filtrados por búsqueda
  const clientesFiltrados = useMemo(() => {
    if (!busquedaCliente.trim()) return clientes;
    const q = busquedaCliente.toLowerCase().trim();
    return clientes.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.cedula.toLowerCase().includes(q) ||
      c.telefono.toLowerCase().includes(q) ||
      (c.ultimoDestino && c.ultimoDestino.toLowerCase().includes(q))
    );
  }, [clientes, busquedaCliente]);

  // Copiar teléfonos de clientes
  const handleCopiarTelefonos = () => {
    const tels = clientesFiltrados
      .map(c => c.telefono.replace(/[^0-9+]/g, ''))
      .filter(t => t.length >= 7);
    const unique = Array.from(new Set(tels)).join('\n');
    navigator.clipboard.writeText(unique).then(() => {
      setCopiadoTelefonos(true);
      setTimeout(() => setCopiadoTelefonos(false), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased selection:bg-tour-caribe selection:text-tour-navy">
      
      {/* BARRA SUPERIOR DEL PANEL ADMINISTRATIVO */}
      <header className="sticky top-0 z-40 bg-[#0B2A6B] text-white shadow-lg border-b border-sky-900">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo y Título */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-title font-black text-tour-yellow text-xl shadow-inner">
              TA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-title font-black text-lg md:text-xl tracking-wide uppercase text-white leading-none">
                  PANEL ADMINISTRADOR
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-900 text-[10px] font-black uppercase tracking-wider">
                  EN VIVO
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                Tour Azul · Gestión de Pasajeros, Salidas de Noviembre y Base de Clientes
              </p>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSincronizarReservas}
              disabled={sincronizandoReservas}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
              title="Sincronizar reservas hacia Google Sheets"
            >
              <span>{sincronizandoReservas ? '⏳' : '📊'}</span>
              <span>{sincronizandoReservas ? 'Sincronizando...' : 'Sync Google Sheets'}</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold transition border border-white/20 cursor-pointer"
              title="Volver a la portada pública"
            >
              <span>🌐</span>
              <span className="hidden sm:inline">Ver Portada</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 active:scale-95 text-white text-xs font-bold transition cursor-pointer"
              title="Cerrar sesión administrativa"
            >
              <span>🚪</span>
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

        {/* Notificación de sincronización */}
        {msgSincronizacion && (
          <div className="bg-sky-900 text-sky-100 text-xs py-1.5 px-4 text-center border-t border-sky-800 animate-fadeIn">
            {msgSincronizacion}
          </div>
        )}

        {/* PESTAÑAS DE NAVEGACIÓN */}
        <div className="bg-[#071F52] border-t border-sky-900/60">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto no-scrollbar">
            
            <button
              type="button"
              onClick={() => setActiveTab('viajes')}
              className={`py-3 px-4 font-title text-xs md:text-sm font-bold tracking-wide uppercase transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'viajes'
                  ? 'border-tour-yellow text-tour-yellow bg-white/5'
                  : 'border-transparent text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🚌</span>
              <span>Viajes de Noviembre</span>
              <span className="px-1.5 py-0.2 rounded-full bg-tour-yellow/20 text-tour-yellow text-[10px]">
                {metricasNoviembre.totalViajes}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('clientes')}
              className={`py-3 px-4 font-title text-xs md:text-sm font-bold tracking-wide uppercase transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'clientes'
                  ? 'border-tour-yellow text-tour-yellow bg-white/5'
                  : 'border-transparent text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>👥</span>
              <span>Lista General de Clientes</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px]">
                {clientes.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('candidatos')}
              className={`py-3 px-4 font-title text-xs md:text-sm font-bold tracking-wide uppercase transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'candidatos'
                  ? 'border-tour-yellow text-tour-yellow bg-white/5'
                  : 'border-transparent text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>💼</span>
              <span>Postulaciones (Guías)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-purple-400/20 text-purple-300 text-[10px]">
                {candidatos.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('config')}
              className={`py-3 px-4 font-title text-xs md:text-sm font-bold tracking-wide uppercase transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'config'
                  ? 'border-tour-yellow text-tour-yellow bg-white/5'
                  : 'border-transparent text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>⚙️</span>
              <span>Google Sheets & Code.gs</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL POR PESTAÑA */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">

        {/* ============================================================== */}
        {/* PESTAÑA 1: VIAJES DE NOVIEMBRE (MONITOREO DE CADA VIAJE)       */}
        {/* ============================================================== */}
        {activeTab === 'viajes' && (
          <div className="space-y-6">
            
            {/* Tarjetas de Resumen General */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Viajes de Noviembre
                </span>
                <div className="text-2xl font-black text-emerald-600 font-title mt-1 flex items-baseline gap-2">
                  <span>{metricasNoviembre.totalPendientes} Pendientes</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {metricasNoviembre.totalViajes} programados ({metricasNoviembre.totalCulminados} culminados)
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pasajeros Registrados
                </span>
                <div className="text-2xl font-black text-tour-blue font-title mt-1">
                  {metricasNoviembre.totalPasajeros} personas
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {metricasNoviembre.totalReservas} reservas confirmadas
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Recaudado (Abonos)
                </span>
                <div className="text-2xl font-black text-emerald-600 font-title mt-1">
                  {metricasNoviembre.totalAbonado} REF
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Pagos recibidos</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Exportar a Excel
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <a
                    href="/api/reservas/export.csv"
                    download="reservas_tour_azul_noviembre.csv"
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>📥</span>
                    <span>Descargar CSV</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Selector de Viaje o Lista de Destinos */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-title font-black text-lg uppercase text-slate-900">
                    Monitoreo de Salidas de Noviembre
                  </h2>
                  <p className="text-xs text-slate-500">
                    Visualiza los viajes pendientes del mes y su lista de pasajeros registrados.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Filtro: Pendientes / Todos / Culminados */}
                  <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setFiltroEstadoViaje('pendientes')}
                      className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                        filtroEstadoViaje === 'pendientes'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Pendientes ({metricasNoviembre.totalPendientes})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFiltroEstadoViaje('todos')}
                      className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                        filtroEstadoViaje === 'todos'
                          ? 'bg-tour-blue text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>Todos ({metricasNoviembre.totalViajes})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFiltroEstadoViaje('culminados')}
                      className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                        filtroEstadoViaje === 'culminados'
                          ? 'bg-slate-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>Culminados ({metricasNoviembre.totalCulminados})</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={cargarViajes}
                    className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>🔄</span>
                    <span>Actualizar</span>
                  </button>
                </div>
              </div>

              {/* Grid de Salidas */}
              {cargandoViajes ? (
                <div className="py-12 text-center text-slate-400">
                  <div className="w-8 h-8 border-3 border-tour-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs font-semibold">Cargando salidas de noviembre...</p>
                </div>
              ) : viajesFiltrados.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <span className="text-3xl mb-2 block">🗓️</span>
                  <p className="text-sm font-bold text-slate-700">No hay viajes en esta vista</p>
                  <button
                    type="button"
                    onClick={() => setFiltroEstadoViaje('todos')}
                    className="mt-3 px-4 py-2 rounded-xl bg-tour-blue text-white text-xs font-bold"
                  >
                    Ver todas las salidas
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {viajesFiltrados.map((viaje) => {
                    const salidaPrincipal = viaje.salidas[0];
                    const isSelected = viajeSeleccionadoId === viaje.id;
                    const totalPasajeros = viaje.totalPasajeros;
                    const fechaSalida = salidaPrincipal?.fecha || '';
                    const esPendiente = fechaSalida >= hoyIso;

                    return (
                      <div
                        key={viaje.id}
                        onClick={() => setViajeSeleccionadoId(isSelected ? null : viaje.id)}
                        className={`rounded-2xl border transition-all cursor-pointer p-4 relative overflow-hidden ${
                          isSelected
                            ? 'bg-sky-50/90 border-tour-blue shadow-md ring-2 ring-tour-blue/20'
                            : esPendiente
                              ? 'bg-white hover:border-emerald-400 border-slate-200 shadow-2xs'
                              : 'bg-slate-50/70 border-slate-200/80 opacity-75'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={viaje.imagenUrl}
                            alt={viaje.destino}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-xs border border-slate-200"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-[10px] font-bold uppercase text-tour-blue tracking-wider block truncate">
                                {salidaPrincipal?.fechaTexto || 'Noviembre 2026'}
                              </span>
                              {esPendiente ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wider shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                  Pendiente
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-wider shrink-0">
                                  Culminado
                                </span>
                              )}
                            </div>
                            <h3 className="font-title font-black text-sm text-slate-900 truncate">
                              {viaje.destino}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-bold text-slate-700">
                                REF {viaje.precioRef}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                {totalPasajeros} {totalPasajeros === 1 ? 'pasajero' : 'pasajeros'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Barra de progreso de ocupación */}
                        <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">
                            Abonado: <strong className="text-slate-800">{viaje.totalAbonadoEur} REF</strong>
                          </span>
                          <span className="font-bold text-tour-blue flex items-center gap-1">
                            <span>{isSelected ? 'Ocultar pasajeros ▲' : 'Ver pasajeros ▼'}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Detalle del viaje seleccionado */}
            {viajeSeleccionadoId && (() => {
              const viaje = resumenViajes.find(v => v.id === viajeSeleccionadoId);
              if (!viaje) return null;

              const pasajeros = viaje.salidas.flatMap(s => s.pasajeros);

              return (
                <div className="bg-white rounded-3xl p-5 md:p-6 border-2 border-tour-blue/40 shadow-lg space-y-4 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-tour-blue text-white text-xs font-black uppercase">
                          Salida Seleccionada
                        </span>
                        <h3 className="font-title font-black text-xl text-slate-900">
                          {viaje.destino} · {viaje.salidas[0]?.fechaTexto}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Tarifa: <strong>REF {viaje.precioRef} p/p</strong> · Total de personas inscritas: <strong className="text-emerald-700">{viaje.totalPasajeros} pasajeros</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViajeSeleccionadoId(null)}
                        className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                      >
                        Cerrar detalle ✕
                      </button>
                    </div>
                  </div>

                  {pasajeros.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-sm font-bold text-slate-600">Aún no hay pasajeros registrados para este viaje</p>
                      <p className="text-xs text-slate-400 mt-1">Los registros que hagan los clientes en la web aparecerán aquí automáticamente.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-3">Cédula</th>
                            <th className="py-3 px-3">Pasajero Titular</th>
                            <th className="py-3 px-3">Teléfono / WhatsApp</th>
                            <th className="py-3 px-3">Punto de Partida</th>
                            <th className="py-3 px-3 text-center">Personas</th>
                            <th className="py-3 px-3">Acompañantes</th>
                            <th className="py-3 px-3">Abono</th>
                            <th className="py-3 px-3">Pendiente</th>
                            <th className="py-3 px-3">Referencia</th>
                            <th className="py-3 px-3 text-center">Estado de Pago</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {pasajeros.map((p, idx) => {
                            const waUrl = p.telefono ? `https://wa.me/${p.telefono.replace(/[^0-9]/g, '')}` : '#';
                            return (
                              <tr key={idx} className="hover:bg-sky-50/50 transition">
                                <td className="py-3 px-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                                  {p.cedula || 'Sin cédula'}
                                </td>
                                <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                                  {p.nombre}
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap">
                                  <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
                                  >
                                    <span>💬</span>
                                    <span>{p.telefono}</span>
                                  </a>
                                </td>
                                <td className="py-3 px-3 text-slate-700">
                                  {p.puntoPartida || 'Barquisimeto'}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-black text-[11px]">
                                    {p.totalPersonas}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-slate-500 text-[11px]">
                                  {p.acompanantes && p.acompanantes.length > 0
                                    ? p.acompanantes.map(a => `${a.nombre} (${a.cedula || 'Sin CI'})`).join(', ')
                                    : <span className="italic text-slate-400">Viaja solo/a</span>
                                  }
                                </td>
                                <td className="py-3 px-3 font-bold text-emerald-700 whitespace-nowrap">
                                  {p.abonoEur} REF
                                </td>
                                <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                                  {p.saldoPendienteEur} REF
                                </td>
                                <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                                  {p.referencia || 'Efectivo'}
                                </td>
                                <td className="py-3 px-3 text-center whitespace-nowrap">
                                  <select
                                    value={p.estadoPago || 'Abonado'}
                                    onChange={(e) => handleCambiarEstadoPago(p.idReserva, e.target.value)}
                                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer ${
                                      p.estadoPago === 'Pagado'
                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                        : 'bg-amber-100 text-amber-900 border-amber-300'
                                    }`}
                                  >
                                    <option value="Abonado">Abonado</option>
                                    <option value="Pagado">Pagado Completo</option>
                                    <option value="Pendiente de pago">Pendiente de Pago</option>
                                  </select>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })()}

          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 2: LISTA GENERAL DE TODOS LOS CLIENTES                 */}
        {/* ============================================================== */}
        {activeTab === 'clientes' && (
          <div className="space-y-4">
            
            {/* Cabecera y Buscador de Clientes */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-title font-black text-lg md:text-xl uppercase text-slate-900">
                    Lista General de Clientes Tour Azul
                  </h2>
                  <p className="text-xs text-slate-500">
                    Base de datos consolidada con Cédula, Nombre, Teléfono y Destinos registrados o viajados.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopiarTelefonos}
                    className="py-2 px-3 rounded-xl bg-sky-100 hover:bg-sky-200 text-tour-blue font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                    title="Copiar lista de números telefónicos para WhatsApp"
                  >
                    <span>📋</span>
                    <span>{copiadoTelefonos ? '¡Copiados al portapapeles!' : 'Copiar Teléfonos'}</span>
                  </button>

                  <a
                    href="/api/clientes/export.csv"
                    download="clientes_general_tour_azul.csv"
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>📥</span>
                    <span>Exportar CSV</span>
                  </a>

                  <button
                    type="button"
                    onClick={cargarClientes}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    🔄 Refrescar
                  </button>
                </div>
              </div>

              {/* Barra de Búsqueda */}
              <div className="relative">
                <input
                  type="text"
                  value={busquedaCliente}
                  onChange={(e) => setBusquedaCliente(e.target.value)}
                  placeholder="Buscar por cédula, nombre, teléfono o destino viajado..."
                  className="w-full px-4 py-2.5 pl-10 rounded-2xl border border-slate-200 bg-slate-50 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-tour-blue"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                {busquedaCliente && (
                  <button
                    type="button"
                    onClick={() => setBusquedaCliente('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    Limpiar ✕
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Total de clientes encontrados: <strong>{clientesFiltrados.length}</strong></span>
                <span>Tour Azul Venezuela</span>
              </div>
            </div>

            {/* Tabla de Clientes */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              {cargandoClientes ? (
                <div className="py-16 text-center text-slate-400">
                  <div className="w-8 h-8 border-3 border-tour-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs font-semibold">Cargando base general de clientes...</p>
                </div>
              ) : clientesFiltrados.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <p className="text-base font-bold text-slate-600">No se encontraron clientes registrados</p>
                  <p className="text-xs text-slate-400 mt-1">Los clientes que se registren en la web aparecerán aquí con su cédula, nombre y teléfono.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">#</th>
                        <th className="py-3.5 px-4">Cédula</th>
                        <th className="py-3.5 px-4">Nombre Completo</th>
                        <th className="py-3.5 px-4">Teléfono / WhatsApp</th>
                        <th className="py-3.5 px-4">Destinos Viajados</th>
                        <th className="py-3.5 px-4 text-center">Viajes</th>
                        <th className="py-3.5 px-4 text-center">Personas Movilizadas</th>
                        <th className="py-3.5 px-4">Punto Habitual</th>
                        <th className="py-3.5 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {clientesFiltrados.map((cliente, idx) => {
                        const waUrl = cliente.telefono
                          ? `https://wa.me/${cliente.telefono.replace(/[^0-9]/g, '')}`
                          : '#';

                        return (
                          <tr key={idx} className="hover:bg-sky-50/50 transition">
                            <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                              {cliente.cedula || 'Sin cédula'}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                              {cliente.nombre}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-xs"
                              >
                                <span>💬</span>
                                <span>{cliente.telefono}</span>
                              </a>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {cliente.viajes.map((v, vIdx) => (
                                  <span
                                    key={vIdx}
                                    className="px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-800 text-[10px] font-bold"
                                  >
                                    {v.destino} ({v.fechaViaje || 'Nov'})
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                                {cliente.totalViajes}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-black text-xs">
                                {cliente.totalPersonasLlevadas}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 text-[11px] truncate max-w-[140px]">
                              {cliente.puntoPartidaHabitual || 'Barquisimeto'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => setClienteDetalle(cliente)}
                                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition cursor-pointer"
                              >
                                Ver Detalle
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

            {/* Modal Detalle de Cliente */}
            {clienteDetalle && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-100 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-title font-black text-lg text-slate-900">{clienteDetalle.nombre}</h3>
                      <p className="text-xs text-slate-500 font-mono">CI: {clienteDetalle.cedula} · Tel: {clienteDetalle.telefono}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setClienteDetalle(null)}
                      className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wider block text-[10px]">Historial de Viajes</span>
                    <div className="space-y-1.5 max-h-60 overflow-y-auto">
                      {clienteDetalle.viajes.map((v, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-800">{v.destino}</span>
                            <span className="text-slate-400 block text-[11px]">{v.fechaViaje} · ID: {v.idReserva}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {v.estadoPago || 'Abonado'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setClienteDetalle(null)}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 3: POSTULACIONES DE GUÍAS (EN SEGUNDO PLANO)           */}
        {/* ============================================================== */}
        {activeTab === 'candidatos' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-title font-black text-lg md:text-xl uppercase text-slate-900">
                    Convocatoria y Postulaciones de Personal
                  </h2>
                  <p className="text-xs text-slate-500">
                    Aspirantes que completaron el formulario «Únete al equipo».
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/api/candidatos/export.csv"
                    download="postulaciones_tour_azul.csv"
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                  >
                    📥 Exportar CSV
                  </a>
                  <button
                    type="button"
                    onClick={cargarCandidatos}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                  >
                    🔄 Refrescar
                  </button>
                </div>
              </div>

              {/* Búsqueda y Filtro de Estado */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={busquedaCandidato}
                  onChange={(e) => setBusquedaCandidato(e.target.value)}
                  placeholder="Buscar aspirante por nombre, teléfono o zona..."
                  className="flex-1 min-w-[200px] px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                />
                <select
                  value={filtroEstadoCandidato}
                  onChange={(e) => setFiltroEstadoCandidato(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="Recibida">Recibida</option>
                  <option value="Contactada">Contactada</option>
                  <option value="Entrevistada">Entrevistada</option>
                  <option value="Seleccionada">Seleccionada</option>
                  <option value="Descartada">Descartada</option>
                </select>
              </div>
            </div>

            {/* Lista de Aspirantes */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              {cargandoCandidatos ? (
                <div className="py-16 text-center text-slate-400">
                  <div className="w-8 h-8 border-3 border-tour-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs font-semibold">Cargando postulaciones...</p>
                </div>
              ) : candidatos.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <p className="text-base font-bold text-slate-600">No hay postulaciones registradas aún</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3">Código</th>
                        <th className="py-3 px-3">Nombre</th>
                        <th className="py-3 px-3">Edad</th>
                        <th className="py-3 px-3">Teléfono</th>
                        <th className="py-3 px-3">Zona</th>
                        <th className="py-3 px-3">Disponibilidad</th>
                        <th className="py-3 px-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {candidatos.map((c, idx) => (
                        <tr key={idx} className="hover:bg-sky-50/50 transition">
                          <td className="py-3 px-3 font-mono font-bold text-slate-500">{c.id || c.codigo}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{c.nombre || c.Nombre}</td>
                          <td className="py-3 px-3">{c.edad || c.Edad || '--'}</td>
                          <td className="py-3 px-3">
                            <a
                              href={`https://wa.me/${String(c.telefono || c.Teléfono || '').replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 font-bold hover:underline"
                            >
                              {c.telefono || c.Teléfono}
                            </a>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{c.zona || c.Zona || 'Lara'}</td>
                          <td className="py-3 px-3 text-slate-600">{c.disponibilidad || 'Fines de semana'}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px]">
                              {c.estado || c.Estado || 'Recibida'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 4: CONFIGURACIÓN GOOGLE SHEETS & CODE.GS               */}
        {/* ============================================================== */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-title font-black text-lg uppercase text-slate-900">
                    Conexión con Google Sheets
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configuración del Webhook para registro automático de reservas, pasajeros y candidatos en tu Google Spreadsheet.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {configSheets?.webhookUrl ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Conectado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Desconectado (Listo para nuevo script)
                    </span>
                  )}
                </div>
              </div>

              {/* Caja de Conexión y URL */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-tour-navy uppercase tracking-wider">
                    URL de la Aplicación Web (Google Apps Script)
                  </span>
                  {configSheets?.webhookUrl && (
                    <button
                      type="button"
                      onClick={handleDesconectarSheets}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Desconectar esta hoja
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:ring-2 focus:ring-tour-blue focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleGuardarUrl}
                    className="px-5 py-2.5 rounded-xl bg-tour-blue hover:bg-tour-blue/90 text-white font-bold text-xs transition cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    Guardar y Conectar
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={handleTestSheets}
                    disabled={probandoConexion}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <span>{probandoConexion ? '⏳' : '⚡'}</span>
                    <span>{probandoConexion ? 'Verificando...' : 'Probar Conexión'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSincronizarReservas}
                    disabled={sincronizandoReservas || !configSheets?.webhookUrl}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    <span>📊 Sincronizar Reservas Pendientes</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetData}
                    className="py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition cursor-pointer ml-auto"
                    title="Vacía los registros locales para empezar totalmente en blanco"
                  >
                    <span>🗑️ Limpiar Registros Locales (Empezar en Cero)</span>
                  </button>
                </div>

                {resultadoTest && (
                  <div className={`p-3.5 rounded-xl text-xs font-semibold mt-2 ${
                    resultadoTest.ok ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}>
                    {resultadoTest.msg}
                  </div>
                )}
              </div>

              {/* Guía Paso a Paso para el Nuevo Google Sheet */}
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-tour-navy space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-title font-bold text-sm flex items-center gap-1.5">
                    <span>📋</span>
                    <span>Cómo Conectar tu Nuevo Google Sheet en 1 Minuto</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopiarCodeGs}
                    disabled={copiandoScript}
                    className="px-3.5 py-1.5 rounded-xl bg-tour-blue hover:bg-tour-blue/90 text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <span>{copiandoScript ? '⏳' : '📋'}</span>
                    <span>Copiar Código Code.gs</span>
                  </button>
                </div>

                <ol className="list-decimal list-inside text-xs space-y-1.5 text-slate-700 leading-relaxed font-medium">
                  <li>Crea una nueva hoja de cálculo en blanco en tu <strong>Google Drive</strong> (ej: <em>Tour Azul - Reservas y Pasajeros</em>).</li>
                  <li>En el menú superior de la hoja, haz clic en: <strong>Extensiones &gt; Apps Script</strong>.</li>
                  <li>Borra cualquier código que aparezca y pega el contenido completo de <strong>Code.gs</strong> (usa el botón superior para copiarlo).</li>
                  <li>Haz clic en el botón azul superior <strong>Implementar &gt; Nueva implementación</strong>.</li>
                  <li>Selecciona tipo <strong>Aplicación web</strong> y configura:
                    <ul className="list-disc list-inside ml-4 mt-1 text-slate-600 space-y-0.5">
                      <li><strong>Ejecutar como:</strong> Yo (tu cuenta de Google).</li>
                      <li><strong>Quién tiene acceso:</strong> Cualquier usuario (Anyone).</li>
                    </ul>
                  </li>
                  <li>Haz clic en <strong>Implementar</strong>, autoriza los permisos y copia la <strong>URL de la aplicación web</strong> (termina en <code>/exec</code>).</li>
                  <li>Pega esa URL en el campo de arriba y haz clic en <strong>Guardar y Conectar</strong>. ¡El script creará automáticamente las pestañas <strong>Reservas</strong>, <strong>Base_General</strong> y <strong>Postulaciones</strong>!</li>
                </ol>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;
