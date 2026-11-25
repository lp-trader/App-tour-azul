import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TRIPS } from '../scripts/data.js';

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

export interface ReservaCompleta {
  id: string;
  idReserva: string;
  codigo?: string;
  fechaRegistro?: string;
  createdAt?: string;
  destino: string;
  destinoHoja?: string;
  fechaViaje: string;
  precioRef?: number;
  totalPersonas: number;
  bus?: string;
  asientos?: number[] | string[];
  titular: {
    nombre: string;
    cedula: string;
    telefono: string;
    edad?: string | number;
    puntoPartida?: string;
    recogida?: string;
  };
  acompanantes?: Array<{ nombre: string; cedula?: string; edad?: string | number; puntoPartida?: string }>;
  tipoPago?: string;
  abonoEur?: number;
  saldoPendienteEur?: number;
  totalViajeEur?: number;
  referenciaPagoMovil?: string;
  referencia?: string;
  tasaBCV?: number;
  montoPagadoBs?: number;
  montoPagadoUsd?: number;
  estadoPago: string;
  syncedToSheets?: boolean;
  _origen?: string;
  [key: string]: any;
}

interface AdminPanelProps {
  onBack?: () => void;
  onLogout?: () => void;
  authToken?: string | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, onLogout, authToken }) => {
  const [activeTab, setActiveTab] = useState<'reservas' | 'viajes' | 'clientes' | 'candidatos' | 'config'>('reservas');

  // Datos de todas las reservas registradas por clientes
  const [reservas, setReservas] = useState<ReservaCompleta[]>([]);
  const [cargandoReservas, setCargandoReservas] = useState<boolean>(true);
  const [busquedaReserva, setBusquedaReserva] = useState<string>('');
  const [filtroEstadoPago, setFiltroEstadoPago] = useState<string>('todos');
  const [filtroDestinoReserva, setFiltroDestinoReserva] = useState<string>('todos');
  const [reservaModalDetalle, setReservaModalDetalle] = useState<ReservaCompleta | null>(null);

  // Datos de viajes y listado por mes
  const [resumenViajes, setResumenViajes] = useState<ResumenViaje[]>([]);
  const [cargandoViajes, setCargandoViajes] = useState<boolean>(true);
  const [viajeSeleccionadoId, setViajeSeleccionadoId] = useState<string | null>(null);
  const [filtroEstadoViaje, setFiltroEstadoViaje] = useState<'todos' | 'con_registros' | 'pendientes' | 'culminados'>('todos');
  const [filtroMesViaje, setFiltroMesViaje] = useState<string>('2026-11');
  const [busquedaViaje, setBusquedaViaje] = useState<string>('');
  const [viajesColapsados, setViajesColapsados] = useState<Record<string, boolean>>({});

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

  // Cargar Todas las Reservas (sincronizando en vivo con Google Sheets)
  const cargarReservas = useCallback(async () => {
    setCargandoReservas(true);
    try {
      const res = await fetch('/api/reservas');
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.reservas)) {
          const norm: ReservaCompleta[] = data.reservas.map((r: any) => {
            const tit = r.titular || {
              nombre: r.nombre || r.nombreTitular || '',
              cedula: r.cedula || '',
              telefono: r.telefono || '',
              edad: r.edad || '',
              puntoPartida: r.puntoPartida || r.recogida || ''
            };
            let acomp: any[] = [];
            if (Array.isArray(r.acompanantes)) {
              acomp = r.acompanantes.map((a: any) => typeof a === 'string' ? { nombre: a } : a);
            } else if (typeof r.acompanantes === 'string' && r.acompanantes.trim()) {
              acomp = r.acompanantes.split(/[,;\n]+/).map((s: string) => ({ nombre: s.trim() })).filter((x: any) => x.nombre);
            }
            return {
              ...r,
              id: r.id || r.idReserva || r.codigo,
              idReserva: r.idReserva || r.id || r.codigo,
              titular: tit,
              acompanantes: acomp,
              totalPersonas: Number(r.totalPersonas) || (1 + acomp.length),
              abonoEur: Number(r.abonoEur !== undefined ? r.abonoEur : (r.abono || 0)),
              saldoPendienteEur: Number(r.saldoPendienteEur !== undefined ? r.saldoPendienteEur : (r.pendiente || 0)),
              estadoPago: r.estadoPago || 'Abonado',
              fechaRegistro: r.fechaRegistro || r.createdAt || r.fecha || 'Reciente'
            };
          });
          setReservas(norm);
        }
      }
    } catch (e) {
      console.warn('Error cargando reservas desde Google Sheets:', e);
    } finally {
      setCargandoReservas(false);
    }
  }, []);

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
    cargarReservas();
    cargarViajes();
    cargarClientes();
    cargarCandidatos();
    cargarConfig();
  }, [cargarReservas, cargarViajes, cargarClientes, cargarCandidatos, cargarConfig]);

  // Recargar datos en vivo cada vez que el usuario cambia de pestaña
  useEffect(() => {
    if (activeTab === 'viajes') {
      cargarViajes();
    } else if (activeTab === 'reservas') {
      cargarReservas();
    } else if (activeTab === 'clientes') {
      cargarClientes();
    } else if (activeTab === 'candidatos') {
      cargarCandidatos();
    }
  }, [activeTab, cargarViajes, cargarReservas, cargarClientes, cargarCandidatos]);

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
        await cargarReservas();
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

  // Actualizar estado de pago de una reserva (en vivo en server y Google Sheets)
  const handleCambiarEstadoPago = async (idReserva: string, nuevoEstado: string) => {
    // Actualización optimista en interfaz
    setReservas(prev => prev.map(r => {
      if (r.idReserva === idReserva || r.id === idReserva) {
        return { ...r, estadoPago: nuevoEstado };
      }
      return r;
    }));

    try {
      const res = await fetch(`/api/reservas/${encodeURIComponent(idReserva)}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ estadoPago: nuevoEstado })
      });
      if (res.ok) {
        await cargarReservas();
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

  // Métricas consolidadas de todas las reservas registradas
  const metricasReservas = useMemo(() => {
    let totalPasajeros = 0;
    let totalAbonado = 0;
    let totalPendiente = 0;
    let totalPagadas = 0;
    let totalAbonadas = 0;
    let totalPendientesPago = 0;

    reservas.forEach(r => {
      const cant = Number(r.totalPersonas) || 1;
      totalPasajeros += cant;
      totalAbonado += Number(r.abonoEur) || 0;
      totalPendiente += Number(r.saldoPendienteEur) || 0;

      const st = (r.estadoPago || '').toLowerCase();
      if (st.includes('pagad')) totalPagadas++;
      else if (st.includes('abon')) totalAbonadas++;
      else totalPendientesPago++;
    });

    return {
      totalReservas: reservas.length,
      totalPasajeros,
      totalAbonado,
      totalPendiente,
      totalPagadas,
      totalAbonadas,
      totalPendientesPago
    };
  }, [reservas]);

  // Lista única de destinos para el filtro
  const destinosUnicos = useMemo(() => {
    const setDest = new Set<string>();
    reservas.forEach(r => {
      if (r.destino) setDest.add(r.destino);
    });
    return Array.from(setDest).sort();
  }, [reservas]);

  // Reservas filtradas por buscador, estado de pago y destino
  const reservasFiltradas = useMemo(() => {
    let list = [...reservas];

    if (filtroEstadoPago !== 'todos') {
      list = list.filter(r => {
        const st = (r.estadoPago || '').toLowerCase();
        if (filtroEstadoPago === 'pagado') return st.includes('pagad');
        if (filtroEstadoPago === 'abonado') return st.includes('abon');
        if (filtroEstadoPago === 'pendiente') return !st.includes('pagad') && !st.includes('abon');
        return true;
      });
    }

    if (filtroDestinoReserva !== 'todos') {
      list = list.filter(r => r.destino === filtroDestinoReserva);
    }

    if (busquedaReserva.trim()) {
      const q = busquedaReserva.toLowerCase().trim();
      list = list.filter(r => {
        const nom = (r.titular?.nombre || '').toLowerCase();
        const ced = (r.titular?.cedula || '').toLowerCase();
        const tel = (r.titular?.telefono || '').toLowerCase();
        const des = (r.destino || '').toLowerCase();
        const cod = (r.idReserva || r.id || '').toLowerCase();
        const ref = (r.referenciaPagoMovil || r.referencia || '').toLowerCase();
        const acomp = (r.acompanantes || []).some((a: any) =>
          (a.nombre || '').toLowerCase().includes(q) ||
          (a.cedula || '').toLowerCase().includes(q)
        );
        return nom.includes(q) || ced.includes(q) || tel.includes(q) || des.includes(q) || cod.includes(q) || ref.includes(q) || acomp;
      });
    }

    return list;
  }, [reservas, filtroEstadoPago, filtroDestinoReserva, busquedaReserva]);

  // Helper para obtener clave YYYY-MM y etiqueta legible del mes
  const extractMesInfo = useCallback((fechaStr?: string) => {
    const mesesNombres = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    if (fechaStr && typeof fechaStr === 'string') {
      const mIso = fechaStr.match(/(\d{4})-(\d{2})/);
      if (mIso) {
        const year = mIso[1];
        const monthIdx = parseInt(mIso[2], 10) - 1;
        const mesNombre = mesesNombres[monthIdx] || 'Mes';
        return { key: `${year}-${mIso[2]}`, label: `${mesNombre} ${year}` };
      }
    }
    return { key: '2026-11', label: 'Noviembre 2026' };
  }, []);

  // Agrupación en vivo de TODOS los viajes con sus registros correspondientes
  const viajesAgrupados = useMemo(() => {
    const normalizeStr = (s: string) =>
      String(s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');

    const matchTripForReserva = (r: ReservaCompleta) => {
      const dest = normalizeStr(r.destino || '');
      const fecha = String(r.fechaViaje || '').trim();

      if (dest.includes('choroni')) {
        if (
          dest.includes('estadia') ||
          dest.includes('posada') ||
          dest.includes('findesemana') ||
          fecha.includes('2026-11-28') ||
          fecha.includes('2026-11-29')
        ) {
          return TRIPS.find((t: any) => t.id === 'choroni-estadia-28-29-nov') || TRIPS.find((t: any) => t.id.includes('choroni'));
        }
        return TRIPS.find((t: any) => t.id === 'choroni-fd-14-nov') || TRIPS.find((t: any) => t.id.includes('choroni'));
      }
      if (dest.includes('chinita')) return TRIPS.find((t: any) => t.id === 'preferia-chinita-15-nov');
      if (dest.includes('bocaseca')) return TRIPS.find((t: any) => t.id === 'cayo-boca-seca-15-nov');
      if (dest.includes('muerto')) return TRIPS.find((t: any) => t.id === 'cayo-muerto-14-nov');
      if (dest.includes('sal')) return TRIPS.find((t: any) => t.id === 'cayo-sal-28-nov');
      if (dest.includes('azul')) return TRIPS.find((t: any) => t.id === 'cayo-azul-29-nov');
      if (dest.includes('santateresa') || dest.includes('teresa')) return TRIPS.find((t: any) => t.id === 'hacienda-santa-teresa-21-nov');
      if (dest.includes('belleza')) return TRIPS.find((t: any) => t.id === 'viaje-belleza-21-22-nov');
      if (dest.includes('tovar')) return TRIPS.find((t: any) => t.id === 'colonia-tovar-22-nov');
      if (dest.includes('adicora') || dest.includes('medanos')) return TRIPS.find((t: any) => t.id === 'adicora-medanos-28-nov');
      if (dest.includes('merida')) return TRIPS.find((t: any) => t.id === 'tour-merida-28-29-nov');
      if (dest.includes('islalarga') || dest.includes('larga')) return TRIPS.find((t: any) => t.id === 'isla-larga-29-nov');

      for (const t of TRIPS) {
        const tNorm = normalizeStr(t.destino);
        if (dest && tNorm && (dest.includes(tNorm) || tNorm.includes(dest))) {
          return t;
        }
      }
      return null;
    };

    type ViajeConRegistros = {
      id: string;
      destino: string;
      precioRef: number;
      tipo: string;
      imagenUrl: string;
      fechaPrincipal: string;
      fechaTexto: string;
      mesKey: string;
      mesLabel: string;
      esPendiente: boolean;
      registros: ReservaCompleta[];
      totalReservas: number;
      totalPasajeros: number;
      totalAbonadoEur: number;
      totalPendienteEur: number;
      totalPagadoBs: number;
    };

    const map = new Map<string, ViajeConRegistros>();

    TRIPS.forEach((trip: any) => {
      const salida0 = trip.salidas && trip.salidas[0] ? trip.salidas[0] : { fecha: '2026-11-30', fechaTexto: 'Noviembre 2026' };
      const mesInfo = extractMesInfo(salida0.fecha);
      map.set(trip.id, {
        id: trip.id,
        destino: trip.destino,
        precioRef: Number(trip.precio) || 0,
        tipo: trip.tipo || 'FULL DAY',
        imagenUrl: trip.imagenUrl || '/varadero.jpg',
        fechaPrincipal: salida0.fecha || '2026-11-30',
        fechaTexto: salida0.fechaTexto || mesInfo.label,
        mesKey: mesInfo.key,
        mesLabel: mesInfo.label,
        esPendiente: (salida0.fecha || '') >= hoyIso,
        registros: [],
        totalReservas: 0,
        totalPasajeros: 0,
        totalAbonadoEur: 0,
        totalPendienteEur: 0,
        totalPagadoBs: 0
      });
    });

    reservas.forEach((r) => {
      const matched = matchTripForReserva(r);
      let target: ViajeConRegistros | undefined;

      if (matched && map.has(matched.id)) {
        target = map.get(matched.id);
      } else {
        const destName = String(r.destino || 'Destino Adicional').trim();
        const mesInfo = extractMesInfo(r.fechaViaje);
        const customId = `custom-${normalizeStr(destName)}-${mesInfo.key}`;
        if (!map.has(customId)) {
          map.set(customId, {
            id: customId,
            destino: destName,
            precioRef: Number(r.precioRef) || 0,
            tipo: 'DESTINO ADICIONAL',
            imagenUrl: '/varadero.jpg',
            fechaPrincipal: String(r.fechaViaje || `${mesInfo.key}-30`),
            fechaTexto: String(r.fechaViaje || mesInfo.label),
            mesKey: mesInfo.key,
            mesLabel: mesInfo.label,
            esPendiente: String(r.fechaViaje || '') >= hoyIso,
            registros: [],
            totalReservas: 0,
            totalPasajeros: 0,
            totalAbonadoEur: 0,
            totalPendienteEur: 0,
            totalPagadoBs: 0
          });
        }
        target = map.get(customId);
      }

      if (target) {
        target.registros.push(r);
        target.totalReservas += 1;
        target.totalPasajeros += Number(r.totalPersonas) || 1;
        target.totalAbonadoEur += Number(r.abonoEur) || 0;
        target.totalPendienteEur += Number(r.saldoPendienteEur) || 0;
        target.totalPagadoBs += Number(r.montoPagadoBs) || 0;
      }
    });

    return Array.from(map.values()).sort((a, b) => a.fechaPrincipal.localeCompare(b.fechaPrincipal));
  }, [reservas, hoyIso, extractMesInfo]);

  // Meses disponibles en el listado
  const mesesDisponibles = useMemo(() => {
    const mapMes = new Map<string, string>();
    viajesAgrupados.forEach(v => {
      mapMes.set(v.mesKey, v.mesLabel);
    });
    return Array.from(mapMes.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, label]) => ({ key, label }));
  }, [viajesAgrupados]);

  // Viajes del mes seleccionado
  const viajesDelMes = useMemo(() => {
    if (filtroMesViaje === 'todos') return viajesAgrupados;
    return viajesAgrupados.filter(v => v.mesKey === filtroMesViaje);
  }, [viajesAgrupados, filtroMesViaje]);

  // Métricas totales del mes seleccionado
  const metricasNoviembre = useMemo(() => {
    let totalReservas = 0;
    let totalPasajeros = 0;
    let totalAbonado = 0;
    let totalPendiente = 0;
    let totalPendientes = 0;
    let totalCulminados = 0;
    let totalConRegistros = 0;

    viajesDelMes.forEach(v => {
      totalReservas += v.totalReservas;
      totalPasajeros += v.totalPasajeros;
      totalAbonado += v.totalAbonadoEur;
      totalPendiente += v.totalPendienteEur;
      if (v.totalReservas > 0) totalConRegistros++;
      if (v.esPendiente) {
        totalPendientes++;
      } else {
        totalCulminados++;
      }
    });

    return {
      totalReservas,
      totalPasajeros,
      totalAbonado,
      totalPendiente,
      totalViajes: viajesDelMes.length,
      totalConRegistros,
      totalPendientes,
      totalCulminados
    };
  }, [viajesDelMes]);

  // Viajes filtrados por estado y búsqueda en Listado por Mes
  const viajesFiltrados = useMemo(() => {
    const q = busquedaViaje.toLowerCase().trim();
    return viajesDelMes
      .filter(v => {
        if (filtroEstadoViaje === 'con_registros' && v.totalReservas === 0) return false;
        if (filtroEstadoViaje === 'pendientes' && !v.esPendiente) return false;
        if (filtroEstadoViaje === 'culminados' && v.esPendiente) return false;
        if (!q) return true;

        const matchTrip =
          v.destino.toLowerCase().includes(q) ||
          v.fechaTexto.toLowerCase().includes(q) ||
          v.fechaPrincipal.toLowerCase().includes(q);
        if (matchTrip) return true;

        return v.registros.some(r => {
          const nom = (r.titular?.nombre || '').toLowerCase();
          const ced = (r.titular?.cedula || '').toLowerCase();
          const tel = (r.titular?.telefono || '').toLowerCase();
          const cod = (r.idReserva || r.id || '').toLowerCase();
          const ref = (r.referenciaPagoMovil || r.referencia || '').toLowerCase();
          const acomp = (r.acompanantes || []).some((a: any) =>
            (a.nombre || '').toLowerCase().includes(q) ||
            (a.cedula || '').toLowerCase().includes(q)
          );
          return nom.includes(q) || ced.includes(q) || tel.includes(q) || cod.includes(q) || ref.includes(q) || acomp;
        });
      })
      .map(v => {
        if (!q) return v;
        const matchTripOnly =
          v.destino.toLowerCase().includes(q) ||
          v.fechaTexto.toLowerCase().includes(q) ||
          v.fechaPrincipal.toLowerCase().includes(q);
        if (matchTripOnly) return v;
        return {
          ...v,
          registros: v.registros.filter(r => {
            const nom = (r.titular?.nombre || '').toLowerCase();
            const ced = (r.titular?.cedula || '').toLowerCase();
            const tel = (r.titular?.telefono || '').toLowerCase();
            const cod = (r.idReserva || r.id || '').toLowerCase();
            const ref = (r.referenciaPagoMovil || r.referencia || '').toLowerCase();
            const acomp = (r.acompanantes || []).some((a: any) =>
              (a.nombre || '').toLowerCase().includes(q) ||
              (a.cedula || '').toLowerCase().includes(q)
            );
            return nom.includes(q) || ced.includes(q) || tel.includes(q) || cod.includes(q) || ref.includes(q) || acomp;
          })
        };
      });
  }, [viajesDelMes, filtroEstadoViaje, busquedaViaje]);

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
              onClick={() => setActiveTab('reservas')}
              className={`py-3 px-4 font-title text-xs md:text-sm font-bold tracking-wide uppercase transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'reservas'
                  ? 'border-tour-yellow text-tour-yellow bg-white/5'
                  : 'border-transparent text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>📋</span>
              <span>Todas las Reservas (En Vivo)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px]">
                {reservas.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('viajes')}
              className={`py-3 px-4 font-title text-xs md:text-sm font-bold tracking-wide uppercase transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'viajes'
                  ? 'border-tour-yellow text-tour-yellow bg-white/5'
                  : 'border-transparent text-sky-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🗓️</span>
              <span>Listado por Mes</span>
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
        {/* PESTAÑA PRINCIPAL: TODAS LAS RESERVAS REGISTRADAS (EN VIVO)   */}
        {/* ============================================================== */}
        {activeTab === 'reservas' && (
          <div className="space-y-6">
            
            {/* Tarjetas de Métricas de Reservas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total de Reservas
                </span>
                <div className="text-2xl font-black text-tour-blue font-title mt-1 flex items-baseline gap-2">
                  <span>{metricasReservas.totalReservas}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    En Google Sheets
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {metricasReservas.totalPagadas} pagadas · {metricasReservas.totalAbonadas} abonadas · {metricasReservas.totalPendientesPago} pendientes
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pasajeros Totales
                </span>
                <div className="text-2xl font-black text-tour-navy font-title mt-1">
                  {metricasReservas.totalPasajeros} cupos
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Titulares + acompañantes inscritos
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Recaudado (Abonos)
                </span>
                <div className="text-2xl font-black text-emerald-600 font-title mt-1">
                  {metricasReservas.totalAbonado} REF
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Ingresos confirmados por reservas
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Saldo Pendiente
                  </span>
                  <div className="text-2xl font-black text-amber-600 font-title mt-1">
                    {metricasReservas.totalPendiente} REF
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Por liquidar al abordar / antes del viaje
                  </span>
                </div>
              </div>
            </div>

            {/* Barra de Filtros, Búsqueda y Exportación */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-title font-black text-lg uppercase text-slate-900 flex items-center gap-2">
                    <span>Todas las Reservas de Clientes</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-sans">
                      {reservasFiltradas.length} de {reservas.length}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Datos consolidados directamente desde Google Sheets. Accesible desde cualquier dispositivo.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={cargarReservas}
                    disabled={cargandoReservas}
                    className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    title="Actualizar datos desde Google Sheets"
                  >
                    <span className={cargandoReservas ? 'animate-spin' : ''}>🔄</span>
                    <span>{cargandoReservas ? 'Consultando...' : 'Actualizar'}</span>
                  </button>

                  <a
                    href="/api/reservas/export.csv"
                    download="reservas_tour_azul.csv"
                    className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>📥</span>
                    <span>Descargar CSV</span>
                  </a>
                </div>
              </div>

              {/* Controles de Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Buscador */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={busquedaReserva}
                    onChange={(e) => setBusquedaReserva(e.target.value)}
                    placeholder="Buscar por pasajero, cédula, teléfono, ID, ref..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-tour-blue focus:bg-white transition"
                  />
                  {busquedaReserva && (
                    <button
                      type="button"
                      onClick={() => setBusquedaReserva('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filtro por Estado de Pago */}
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase shrink-0">
                    Estado:
                  </label>
                  <select
                    value={filtroEstadoPago}
                    onChange={(e) => setFiltroEstadoPago(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-tour-blue cursor-pointer"
                  >
                    <option value="todos">Todos los Estados</option>
                    <option value="abonado">Solo Abonados</option>
                    <option value="pagado">Solo Pagados Completos</option>
                    <option value="pendiente">Solo Pendientes de Pago</option>
                  </select>
                </div>

                {/* Filtro por Destino */}
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase shrink-0">
                    Destino:
                  </label>
                  <select
                    value={filtroDestinoReserva}
                    onChange={(e) => setFiltroDestinoReserva(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-tour-blue cursor-pointer"
                  >
                    <option value="todos">Todos los Destinos ({destinosUnicos.length})</option>
                    {destinosUnicos.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tabla Maestra de Reservas */}
              {cargandoReservas ? (
                <div className="py-16 text-center text-slate-400">
                  <div className="w-9 h-9 border-3 border-tour-blue border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-xs font-bold text-slate-600">Sincronizando reservas con Google Sheets...</p>
                  <p className="text-[11px] text-slate-400 mt-1">Conectando con tu archivo de hoja de cálculo</p>
                </div>
              ) : reservasFiltradas.length === 0 ? (
                <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
                  <span className="text-4xl mb-2 block">📋</span>
                  <p className="text-sm font-bold text-slate-700">No se encontraron reservas registradas</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {reservas.length === 0
                      ? 'Las reservas que hagan los clientes en la web se guardarán aquí y en Google Sheets automáticamente.'
                      : 'No hay reservas que coincidan con los filtros aplicados.'}
                  </p>
                  {reservas.length > 0 && (
                    <button
                      type="button"
                      onClick={() => { setBusquedaReserva(''); setFiltroEstadoPago('todos'); setFiltroDestinoReserva('todos'); }}
                      className="mt-3 px-4 py-1.5 rounded-xl bg-tour-blue text-white text-xs font-bold cursor-pointer"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3">Código / ID</th>
                        <th className="py-3 px-3">Destino & Fecha</th>
                        <th className="py-3 px-3">Pasajero Titular</th>
                        <th className="py-3 px-3">Teléfono / WhatsApp</th>
                        <th className="py-3 px-3 text-center">Cupos</th>
                        <th className="py-3 px-3">Acompañantes</th>
                        <th className="py-3 px-3">Abono</th>
                        <th className="py-3 px-3">Pendiente</th>
                        <th className="py-3 px-3">Pago / Ref.</th>
                        <th className="py-3 px-3 text-center">Estado de Pago</th>
                        <th className="py-3 px-3 text-center">En Sheets</th>
                        <th className="py-3 px-3 text-center">Ficha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {reservasFiltradas.map((r, idx) => {
                        const tel = r.titular?.telefono || '';
                        const waUrl = tel ? `https://wa.me/${tel.replace(/[^0-9]/g, '')}` : '#';
                        const acompCount = (r.acompanantes || []).length;

                        return (
                          <tr key={r.id || idx} className="hover:bg-sky-50/50 transition">
                            {/* Código / ID */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{r.idReserva || r.id}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {r.fechaRegistro || 'Reciente'}
                              </span>
                            </td>

                            {/* Destino & Fecha */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className="font-bold text-tour-navy block">
                                {r.destino || 'Destino no especificado'}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                📅 {r.fechaViaje || 'Sin fecha'}
                              </span>
                            </td>

                            {/* Titular */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="font-bold text-slate-900">
                                {r.titular?.nombre || 'Sin nombre'}
                              </div>
                              <div className="text-[11px] font-mono text-slate-500">
                                CI: {r.titular?.cedula || 'Sin cédula'}
                              </div>
                              {r.titular?.puntoPartida && (
                                <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                  📍 {r.titular.puntoPartida}
                                </div>
                              )}
                            </td>

                            {/* WhatsApp */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              {tel ? (
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 transition"
                                  title="Contactar al cliente por WhatsApp"
                                >
                                  <span>💬</span>
                                  <span>{tel}</span>
                                </a>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">Sin teléfono</span>
                              )}
                            </td>

                            {/* Total Cupos */}
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-black text-[11px]">
                                {r.totalPersonas} {r.totalPersonas === 1 ? 'cupo' : 'cupos'}
                              </span>
                            </td>

                            {/* Acompañantes */}
                            <td className="py-3 px-3 text-[11px] text-slate-600 max-w-[180px]">
                              {acompCount > 0 ? (
                                <div className="space-y-0.5">
                                  {r.acompanantes!.map((a, aIdx) => (
                                    <div key={aIdx} className="truncate" title={`${a.nombre} ${a.cedula ? `(${a.cedula})` : ''}`}>
                                      • {a.nombre} {a.cedula ? `(${a.cedula})` : ''}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">Viaja solo/a</span>
                              )}
                            </td>

                            {/* Abono */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className="font-bold text-emerald-700 block">
                                {r.abonoEur} REF
                              </span>
                              {r.montoPagadoBs ? (
                                <span className="text-[10px] text-slate-500 font-mono">
                                  Bs. {Number(r.montoPagadoBs).toLocaleString('es-VE')}
                                </span>
                              ) : null}
                            </td>

                            {/* Saldo Pendiente */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className={`font-bold ${r.saldoPendienteEur === 0 ? 'text-slate-400' : 'text-amber-700'}`}>
                                {r.saldoPendienteEur} REF
                              </span>
                            </td>

                            {/* Método y Ref */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className="font-semibold text-slate-800 block text-[11px]">
                                {r.tipoPago || 'Pago Móvil'}
                              </span>
                              {r.referenciaPagoMovil || r.referencia ? (
                                <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[120px]">
                                  Ref: {r.referenciaPagoMovil || r.referencia}
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Sin ref</span>
                              )}
                            </td>

                            {/* Selector Estado de Pago */}
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <select
                                value={r.estadoPago || 'Abonado'}
                                onChange={(e) => handleCambiarEstadoPago(r.idReserva || r.id, e.target.value)}
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer transition ${
                                  (r.estadoPago || '').toLowerCase().includes('pagad')
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : (r.estadoPago || '').toLowerCase().includes('abon')
                                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                                      : 'bg-rose-100 text-rose-800 border-rose-300'
                                }`}
                              >
                                <option value="Abonado">Abonado</option>
                                <option value="Pagado">Pagado Completo</option>
                                <option value="Pendiente de pago">Pendiente de Pago</option>
                              </select>
                            </td>

                            {/* En Sheets */}
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <span>🟢</span>
                                <span>En Hoja</span>
                              </span>
                            </td>

                            {/* Botón Ver Ficha */}
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setReservaModalDetalle(r)}
                                className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 active:scale-95 text-sky-800 font-bold text-[11px] transition cursor-pointer"
                                title="Ver comprobante y ficha completa de esta reserva"
                              >
                                👁️ Ficha
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
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA 2: LISTADO POR MES (CADA VIAJE CON SUS REGISTROS)      */}
        {/* ============================================================== */}
        {activeTab === 'viajes' && (
          <div className="space-y-6">
            
            {/* Tarjetas de Resumen General del Mes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Viajes del Mes
                </span>
                <div className="text-2xl font-black text-tour-navy font-title mt-1 flex items-baseline gap-2">
                  <span>{metricasNoviembre.totalViajes} Viajes</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {metricasNoviembre.totalConRegistros} con registros · {metricasNoviembre.totalPendientes} pendientes
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Registros y Cupos
                </span>
                <div className="text-2xl font-black text-tour-blue font-title mt-1">
                  {metricasNoviembre.totalPasajeros} personas
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {metricasNoviembre.totalReservas} reservas registradas
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Recaudado (Abonos)
                </span>
                <div className="text-2xl font-black text-emerald-600 font-title mt-1">
                  {metricasNoviembre.totalAbonado} REF
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Pendiente por cobrar: {metricasNoviembre.totalPendiente} REF
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Exportar Listado
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <a
                    href="/api/reservas/export.csv"
                    download="reservas_tour_azul_mes.csv"
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>📥</span>
                    <span>Descargar CSV</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Cabecera, Selector de Mes y Filtros */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-title font-black text-lg uppercase text-slate-900 flex items-center gap-2">
                    <span>Listado por Mes</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-tour-blue text-xs font-bold font-sans">
                      {filtroMesViaje === 'todos'
                        ? 'Todos los meses'
                        : (mesesDisponibles.find(m => m.key === filtroMesViaje)?.label || 'Noviembre 2026')}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Cada viaje del mes con su listado completo de registros y pasajeros correspondientes.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Selector de Mes */}
                  <select
                    value={filtroMesViaje}
                    onChange={(e) => setFiltroMesViaje(e.target.value)}
                    className="py-1.5 px-3 rounded-xl bg-sky-50 border border-sky-200 text-xs font-bold text-tour-navy focus:outline-none focus:ring-2 focus:ring-tour-blue cursor-pointer"
                  >
                    {mesesDisponibles.map(m => (
                      <option key={m.key} value={m.key}>{m.label}</option>
                    ))}
                    <option value="todos">Todos los meses</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => { cargarReservas(); cargarViajes(); }}
                    disabled={cargandoReservas}
                    className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <span className={cargandoReservas ? 'animate-spin' : ''}>🔄</span>
                    <span>{cargandoReservas ? 'Actualizando...' : 'Actualizar'}</span>
                  </button>
                </div>
              </div>

              {/* Barra de Filtros de Estado y Buscador */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="inline-flex flex-wrap p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold gap-1">
                  <button
                    type="button"
                    onClick={() => setFiltroEstadoViaje('todos')}
                    className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                      filtroEstadoViaje === 'todos'
                        ? 'bg-tour-blue text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Todos los viajes ({metricasNoviembre.totalViajes})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltroEstadoViaje('con_registros')}
                    className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                      filtroEstadoViaje === 'con_registros'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Con registros ({metricasNoviembre.totalConRegistros})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltroEstadoViaje('pendientes')}
                    className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                      filtroEstadoViaje === 'pendientes'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Pendientes ({metricasNoviembre.totalPendientes})</span>
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

                {/* Buscador dentro de viajes y registros */}
                <div className="relative flex-1 max-w-md">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={busquedaViaje}
                    onChange={(e) => setBusquedaViaje(e.target.value)}
                    placeholder="Buscar viaje, pasajero, cédula, teléfono o ID..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-tour-blue focus:bg-white transition"
                  />
                  {busquedaViaje && (
                    <button
                      type="button"
                      onClick={() => setBusquedaViaje('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* LISTADO DE CADA VIAJE CON SUS REGISTROS CORRESPONDIENTES */}
            {cargandoReservas && reservas.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 py-16 text-center text-slate-400">
                <div className="w-8 h-8 border-3 border-tour-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs font-semibold">Cargando viajes y registros del mes...</p>
              </div>
            ) : viajesFiltrados.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 py-12 text-center text-slate-400 p-6">
                <span className="text-3xl mb-2 block">🗓️</span>
                <p className="text-sm font-bold text-slate-700">No se encontraron viajes con este filtro</p>
                <button
                  type="button"
                  onClick={() => { setFiltroEstadoViaje('todos'); setBusquedaViaje(''); }}
                  className="mt-3 px-4 py-2 rounded-xl bg-tour-blue text-white text-xs font-bold cursor-pointer"
                >
                  Ver todos los viajes del mes
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {viajesFiltrados.map((viaje) => {
                  const tieneRegistros = viaje.registros.length > 0;
                  const isCollapsed = viajesColapsados[viaje.id] ?? false;
                  const ocupacionPct = Math.min(100, Math.round((viaje.totalPasajeros / 31) * 100));

                  return (
                    <div
                      key={viaje.id}
                      className={`bg-white rounded-3xl border shadow-xs overflow-hidden transition ${
                        tieneRegistros ? 'border-emerald-300/90 shadow-sm' : 'border-slate-200'
                      }`}
                    >
                      {/* Cabecera del Viaje */}
                      <div
                        onClick={() =>
                          setViajesColapsados(prev => ({ ...prev, [viaje.id]: !isCollapsed }))
                        }
                        className={`p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer transition ${
                          tieneRegistros ? 'bg-gradient-to-r from-emerald-50/70 via-white to-sky-50/40 hover:bg-emerald-50/90' : 'bg-slate-50/60 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={viaje.imagenUrl}
                            alt={viaje.destino}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shrink-0 shadow-xs border border-slate-200"
                          />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <span className="text-[11px] font-bold uppercase text-tour-blue tracking-wide">
                                📅 {viaje.fechaTexto}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[10px] font-bold uppercase">
                                {viaje.tipo}
                              </span>
                              {viaje.esPendiente ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black uppercase">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                                  Próximo
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold uppercase">
                                  Culminado
                                </span>
                              )}
                            </div>

                            <h3 className="font-title font-black text-base sm:text-lg text-tour-navy truncate">
                              {viaje.destino}
                            </h3>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
                              <span>Tarifa: <strong className="text-slate-900">REF {viaje.precioRef}</strong></span>
                              <span className="text-slate-300">·</span>
                              <span>
                                Cupos: <strong className={tieneRegistros ? 'text-emerald-700' : 'text-slate-500'}>{viaje.totalPasajeros} / 31</strong>
                              </span>
                              {tieneRegistros && (
                                <>
                                  <span className="text-slate-300">·</span>
                                  <span>Abonado: <strong className="text-emerald-700">{viaje.totalAbonadoEur} REF</strong></span>
                                  <span className="text-slate-300">·</span>
                                  <span>Pendiente: <strong className="text-amber-700">{viaje.totalPendienteEur} REF</strong></span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Contadores y botón expandir/colapsar */}
                        <div className="flex items-center gap-3 ml-auto">
                          <div className="hidden sm:block w-28">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                              <span>Ocupación</span>
                              <span>{ocupacionPct}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  tieneRegistros ? 'bg-emerald-500' : 'bg-slate-300'
                                }`}
                                style={{ width: `${ocupacionPct}%` }}
                              ></div>
                            </div>
                          </div>

                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap border ${
                              tieneRegistros
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}
                          >
                            {viaje.registros.length} {viaje.registros.length === 1 ? 'registro' : 'registros'}
                          </span>

                          <span className="text-xs font-bold text-tour-blue px-2 py-1 rounded-lg hover:bg-sky-100 transition">
                            {isCollapsed ? '▼ Mostrar' : '▲ Ocultar'}
                          </span>
                        </div>
                      </div>

                      {/* Tabla de Registros Correspondientes a este Viaje */}
                      {!isCollapsed && (
                        <div className="border-t border-slate-100">
                          {!tieneRegistros ? (
                            <div className="py-4 px-5 text-xs text-slate-400 italic flex items-center justify-between bg-white">
                              <span>Sin registros de reservas para este viaje todavía.</span>
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-100/90 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                                  <tr>
                                    <th className="py-2.5 px-3">Código / Fecha</th>
                                    <th className="py-2.5 px-3">Pasajero Titular</th>
                                    <th className="py-2.5 px-3">Teléfono / WhatsApp</th>
                                    <th className="py-2.5 px-3">Salida / Punto</th>
                                    <th className="py-2.5 px-3 text-center">Cupos</th>
                                    <th className="py-2.5 px-3">Acompañantes</th>
                                    <th className="py-2.5 px-3">Abono</th>
                                    <th className="py-2.5 px-3">Pendiente</th>
                                    <th className="py-2.5 px-3">Pago / Ref.</th>
                                    <th className="py-2.5 px-3 text-center">Estado de Pago</th>
                                    <th className="py-2.5 px-3 text-center">Ficha</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                  {viaje.registros.map((r, rIdx) => {
                                    const tel = r.titular?.telefono || '';
                                    const waUrl = tel ? `https://wa.me/${tel.replace(/[^0-9]/g, '')}` : '#';
                                    const acompCount = (r.acompanantes || []).length;

                                    return (
                                      <tr key={r.idReserva || r.id || rIdx} className="hover:bg-sky-50/50 transition">
                                        <td className="py-3 px-3 whitespace-nowrap">
                                          <span className="font-mono font-bold text-slate-900 block">
                                            {r.idReserva || r.id}
                                          </span>
                                          <span className="text-[10px] text-slate-400 block">
                                            {r.fechaRegistro || 'Reciente'}
                                          </span>
                                        </td>

                                        <td className="py-3 px-3 whitespace-nowrap">
                                          <span className="font-bold text-slate-900 block">
                                            {r.titular?.nombre || 'Sin nombre'}
                                          </span>
                                          <span className="text-[11px] font-mono text-slate-500">
                                            CI: {r.titular?.cedula || 'Sin cédula'}
                                          </span>
                                        </td>

                                        <td className="py-3 px-3 whitespace-nowrap">
                                          {tel ? (
                                            <a
                                              href={waUrl}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 transition"
                                            >
                                              <span>💬</span>
                                              <span>{tel}</span>
                                            </a>
                                          ) : (
                                            <span className="text-slate-400 italic text-[11px]">Sin teléfono</span>
                                          )}
                                        </td>

                                        <td className="py-3 px-3 whitespace-nowrap">
                                          <span className="text-[11px] font-semibold text-tour-navy block">
                                            📅 {r.fechaViaje || viaje.fechaPrincipal}
                                          </span>
                                          <span className="text-[10px] text-slate-500 truncate max-w-[160px] block">
                                            📍 {r.titular?.puntoPartida || r.puntoPartida || 'Barquisimeto'}
                                          </span>
                                        </td>

                                        <td className="py-3 px-3 text-center whitespace-nowrap">
                                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-black text-[11px]">
                                            {r.totalPersonas} {r.totalPersonas === 1 ? 'cupo' : 'cupos'}
                                          </span>
                                        </td>

                                        <td className="py-3 px-3 text-[11px] text-slate-600 max-w-[170px]">
                                          {acompCount > 0 ? (
                                            <div className="space-y-0.5">
                                              {r.acompanantes!.map((a, aIdx) => (
                                                <div key={aIdx} className="truncate">
                                                  • {a.nombre} {a.cedula ? `(${a.cedula})` : ''}
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <span className="text-slate-400 italic">Viaja solo/a</span>
                                          )}
                                        </td>

                                        <td className="py-3 px-3 whitespace-nowrap">
                                          <span className="font-bold text-emerald-700 block">
                                            {r.abonoEur} REF
                                          </span>
                                          {r.montoPagadoBs ? (
                                            <span className="text-[10px] text-slate-500 font-mono">
                                              Bs. {Number(r.montoPagadoBs).toLocaleString('es-VE')}
                                            </span>
                                          ) : null}
                                        </td>

                                        <td className="py-3 px-3 whitespace-nowrap">
                                          <span className={`font-bold ${r.saldoPendienteEur === 0 ? 'text-slate-400' : 'text-amber-700'}`}>
                                            {r.saldoPendienteEur} REF
                                          </span>
                                        </td>

                                        <td className="py-3 px-3 whitespace-nowrap">
                                          <span className="font-semibold text-slate-800 block text-[11px]">
                                            {r.tipoPago || 'Pago Móvil'}
                                          </span>
                                          {r.referenciaPagoMovil || r.referencia ? (
                                            <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[110px]">
                                              Ref: {r.referenciaPagoMovil || r.referencia}
                                            </span>
                                          ) : (
                                            <span className="text-[10px] text-slate-400 italic">Sin ref</span>
                                          )}
                                        </td>

                                        <td className="py-3 px-3 text-center whitespace-nowrap">
                                          <select
                                            value={r.estadoPago || 'Abonado'}
                                            onChange={(e) => handleCambiarEstadoPago(r.idReserva || r.id, e.target.value)}
                                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer transition ${
                                              (r.estadoPago || '').toLowerCase().includes('pagad')
                                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                : (r.estadoPago || '').toLowerCase().includes('abon')
                                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                                  : 'bg-rose-100 text-rose-800 border-rose-300'
                                            }`}
                                          >
                                            <option value="Abonado">Abonado</option>
                                            <option value="Pagado">Pagado Completo</option>
                                            <option value="Pendiente de pago">Pendiente de Pago</option>
                                          </select>
                                        </td>

                                        <td className="py-3 px-3 text-center whitespace-nowrap">
                                          <button
                                            type="button"
                                            onClick={() => setReservaModalDetalle(r)}
                                            className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 active:scale-95 text-sky-800 font-bold text-[11px] transition cursor-pointer"
                                            title="Ver ficha completa de esta reserva"
                                          >
                                            👁️ Ficha
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
                    </div>
                  );
                })}
              </div>
            )}

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

        {/* Modal Ficha Completa de Reserva / Comprobante de Pasajeros */}
        {reservaModalDetalle && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-sky-100 space-y-5 my-8 animate-fadeIn">
              
              {/* Encabezado del Comprobante */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎫</span>
                    <h3 className="font-title font-black text-xl text-slate-900">
                      Ficha de Reserva: {reservaModalDetalle.idReserva || reservaModalDetalle.id}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Registrada el: <strong>{reservaModalDetalle.fechaRegistro || 'Reciente'}</strong> · Sincronizada en Google Sheet
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReservaModalDetalle(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Destino y Fecha Destacados */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
                    Destino Reservado
                  </span>
                  <span className="text-base font-black text-tour-navy font-title block">
                    {reservaModalDetalle.destino}
                  </span>
                  <span className="text-xs font-semibold text-sky-800">
                    📅 Fecha del Viaje: {reservaModalDetalle.fechaViaje}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cupos Totales
                  </span>
                  <span className="text-lg font-black text-tour-blue font-title">
                    {reservaModalDetalle.totalPersonas} {reservaModalDetalle.totalPersonas === 1 ? 'persona' : 'personas'}
                  </span>
                  {reservaModalDetalle.bus && (
                    <span className="text-[11px] text-slate-500 block">
                      🚌 {reservaModalDetalle.bus}
                    </span>
                  )}
                </div>
              </div>

              {/* Información del Pasajero Titular */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pasajero Titular (Contacto)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Nombre Completo:</span>
                    <strong className="text-slate-900 text-sm">{reservaModalDetalle.titular?.nombre || 'Sin nombre'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Cédula de Identidad:</span>
                    <strong className="text-slate-800 font-mono">{reservaModalDetalle.titular?.cedula || 'Sin cédula'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Teléfono / WhatsApp:</span>
                    {reservaModalDetalle.titular?.telefono ? (
                      <a
                        href={`https://wa.me/${reservaModalDetalle.titular.telefono.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-100/70 px-2.5 py-0.5 rounded-lg border border-emerald-300 hover:bg-emerald-200 transition"
                      >
                        <span>💬</span>
                        <span>{reservaModalDetalle.titular.telefono}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">No especificado</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Punto de Partida / Recogida:</span>
                    <strong className="text-slate-800">
                      📍 {reservaModalDetalle.titular?.puntoPartida || reservaModalDetalle.puntoPartida || 'Barquisimeto'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Lista de Acompañantes */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Acompañantes Registrados ({reservaModalDetalle.acompanantes ? reservaModalDetalle.acompanantes.length : 0})
                </span>
                {reservaModalDetalle.acompanantes && reservaModalDetalle.acompanantes.length > 0 ? (
                  <div className="space-y-1.5">
                    {reservaModalDetalle.acompanantes.map((acomp, aIdx) => (
                      <div key={aIdx} className="p-2 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between gap-2">
                        <div className="font-semibold text-slate-800 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-sky-100 text-tour-blue font-bold flex items-center justify-center text-[10px]">
                            {aIdx + 1}
                          </span>
                          <span>{acomp.nombre}</span>
                        </div>
                        <div className="text-slate-500 font-mono text-[11px]">
                          {acomp.cedula ? `CI: ${acomp.cedula}` : 'Sin cédula'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Esta reserva no incluye acompañantes (el titular viaja solo/a).</p>
                )}
              </div>

              {/* Desglose Financiero y de Pago */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                  Desglose Financiero & Pago
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                    <span className="text-slate-400 text-[10px] block">Monto Abonado</span>
                    <strong className="text-emerald-700 text-sm font-black">{reservaModalDetalle.abonoEur} REF</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                    <span className="text-slate-400 text-[10px] block">Saldo Pendiente</span>
                    <strong className="text-amber-800 text-sm font-black">{reservaModalDetalle.saldoPendienteEur} REF</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                    <span className="text-slate-400 text-[10px] block">Método de Pago</span>
                    <strong className="text-slate-800 text-xs">{reservaModalDetalle.tipoPago || 'Pago Móvil'}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                    <span className="text-slate-400 text-[10px] block">Referencia</span>
                    <strong className="text-slate-800 font-mono text-xs truncate block" title={reservaModalDetalle.referenciaPagoMovil || reservaModalDetalle.referencia || 'N/A'}>
                      {reservaModalDetalle.referenciaPagoMovil || reservaModalDetalle.referencia || 'N/A'}
                    </strong>
                  </div>
                </div>

                {reservaModalDetalle.montoPagadoBs ? (
                  <div className="text-[11px] text-slate-600 bg-white/70 p-2 rounded-xl flex items-center justify-between">
                    <span>Monto equivalente en Bolívares pagado:</span>
                    <strong className="font-mono text-slate-900">
                      Bs. {Number(reservaModalDetalle.montoPagadoBs).toLocaleString('es-VE')} {reservaModalDetalle.tasaBCV ? `(Tasa BCV: ${reservaModalDetalle.tasaBCV} Bs/REF)` : ''}
                    </strong>
                  </div>
                ) : null}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-slate-700">Estado de Pago:</span>
                  <select
                    value={reservaModalDetalle.estadoPago || 'Abonado'}
                    onChange={(e) => {
                      const nuevo = e.target.value;
                      handleCambiarEstadoPago(reservaModalDetalle.idReserva || reservaModalDetalle.id, nuevo);
                      setReservaModalDetalle({ ...reservaModalDetalle, estadoPago: nuevo });
                    }}
                    className="text-xs font-bold px-3 py-1 rounded-xl border border-slate-300 bg-white cursor-pointer"
                  >
                    <option value="Abonado">Abonado</option>
                    <option value="Pagado">Pagado Completo</option>
                    <option value="Pendiente de pago">Pendiente de Pago</option>
                  </select>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                {reservaModalDetalle.titular?.telefono && (
                  <a
                    href={`https://wa.me/${reservaModalDetalle.titular.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `¡Hola ${reservaModalDetalle.titular.nombre}! Te escribimos de Tour Azul para confirmar tu reserva con código *${reservaModalDetalle.idReserva || reservaModalDetalle.id}* para el viaje a *${reservaModalDetalle.destino}* (${reservaModalDetalle.fechaViaje}). Tienes ${reservaModalDetalle.totalPersonas} cupo(s) reservados. Abono registrado: ${reservaModalDetalle.abonoEur} REF. Saldo pendiente: ${reservaModalDetalle.saldoPendienteEur} REF. Punto de partida: ${reservaModalDetalle.titular.puntoPartida || 'Barquisimeto'}. ¡Nos vemos pronto!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                  >
                    <span>💬</span>
                    <span>Confirmar por WhatsApp</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const texto = `RESERVA TOUR AZUL\nCódigo: ${reservaModalDetalle.idReserva || reservaModalDetalle.id}\nDestino: ${reservaModalDetalle.destino} (${reservaModalDetalle.fechaViaje})\nTitular: ${reservaModalDetalle.titular?.nombre} (CI: ${reservaModalDetalle.titular?.cedula}, Tel: ${reservaModalDetalle.titular?.telefono})\nCupos: ${reservaModalDetalle.totalPersonas}\nAbono: ${reservaModalDetalle.abonoEur} REF\nPendiente: ${reservaModalDetalle.saldoPendienteEur} REF\nRef: ${reservaModalDetalle.referenciaPagoMovil || reservaModalDetalle.referencia || 'N/A'}`;
                    navigator.clipboard.writeText(texto).then(() => alert('Datos de la reserva copiados al portapapeles'));
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  📋 Copiar Datos
                </button>

                <button
                  type="button"
                  onClick={() => setReservaModalDetalle(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;
