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
  authToken?: string | null;
}

const ESTADOS_DISPONIBLES = [
  { id: 'Recibida', label: 'Recibida', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'Contactada', label: 'Contactada', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'Entrevistada', label: 'Entrevistada', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'Seleccionada', label: 'Seleccionada', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'Descartada', label: 'Descartada', color: 'bg-rose-50 text-rose-700 border-rose-200' }
];

export const AdminCandidatos: React.FC<AdminCandidatosProps> = ({ onBack, onLogout, authToken }) => {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [actualizandoSilencioso, setActualizandoSilencioso] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<Candidato | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<string>('todos');
  const [autoActualizar, setAutoActualizar] = useState<boolean>(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>('');
  const [guardandoEstadoId, setGuardandoEstadoId] = useState<string | null>(null);

  // Configuración de la nueva conexión con Google Sheets
  const [scriptUrl, setScriptUrl] = useState<string>('');
  const [sheetName, setSheetName] = useState<string>('Postulaciones');
  const [spreadsheetName, setSpreadsheetName] = useState<string>('Postulaciones Tour Azul');
  const [mostrarConfigUrl, setMostrarConfigUrl] = useState<boolean>(false);
  const [tabConfig, setTabConfig] = useState<'url' | 'codigo'>('url');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [inputSheetName, setInputSheetName] = useState<string>('Postulaciones');
  const [probandoConexion, setProbandoConexion] = useState<boolean>(false);
  const [resultadoTest, setResultadoTest] = useState<{ ok: boolean; msg: string } | null>(null);
  const [sincronizando, setSincronizando] = useState<boolean>(false);
  const [copiadoCodeGs, setCopiadoCodeGs] = useState<boolean>(false);
  const [fotoAmpliada, setFotoAmpliada] = useState<{ url: string; nombre: string; codigo: string } | null>(null);

  // Helper para obtener token de autenticación
  const getToken = useCallback((): string | null => {
    return authToken ||
           sessionStorage.getItem('tour_azul_admin_token') ||
           localStorage.getItem('tour_azul_admin_token') ||
           null;
  }, [authToken]);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const token = getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }, [getToken]);

  // Helper para validar si hay una foto real (evita falsos positivos como strings de 'Sí adjunta')
  const isFotoValida = (foto?: string): boolean => {
    if (!foto) return false;
    const f = String(foto).trim();
    if (!f || f === 'No adjunta' || f === 'No' || f === '-' || f === 'Sin foto' || f === 'No especificado' || f === 'null' || f === 'undefined') return false;
    if (f.startsWith('Sí adjunta') || f.startsWith('Si adjunta')) return false;
    if (f.includes('drive.google.com') || f.includes('googleusercontent.com')) return true;
    return f.startsWith('http://') || f.startsWith('https://') || f.startsWith('data:image/') || f.startsWith('/uploads/') || f.startsWith('/api/candidatos/') || f.includes('.jpg') || f.includes('.png') || f.includes('.webp');
  };

  // Normaliza y formatea la URL de la fotografía para que cargue como imagen directa en cualquier navegador y dispositivo
  const formatPhotoUrl = (rawFoto?: string, candidateId?: string): string => {
    if (!rawFoto) return '';
    let f = String(rawFoto).trim();
    if (!isFotoValida(f)) return '';

    // Convertir enlaces de Google Drive estándar (view / open) a enlace directo de imagen thumbnail
    if (f.includes('drive.google.com')) {
      const match = f.match(/\/d\/([a-zA-Z0-9_-]+)/) || f.match(/id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
      }
    }

    return f;
  };

  // Normalizadores de campos (siempre devuelven string seguro para evitar errores con .toLowerCase())
  const getNombre = (c: Candidato): string => String(c.Nombre || c.nombre || "Sin nombre").trim();
  const getCodigo = (c: Candidato): string => String(c.Código || c.codigo || c.id || "S/C").trim();
  const getFoto = (c: Candidato): string => {
    const id = getCodigo(c);
    const raw = String(c.fotoUrl || c.Foto || c.foto || c.fotoBase64 || '').trim();
    const formatted = formatPhotoUrl(raw, id);
    if (formatted) return formatted;
    // Si el candidato tenía foto registrada pero no vino URL directa en la hoja, consultar endpoint del servidor
    if ((c.tieneFoto || raw.includes('adjunta')) && id && id !== 'S/C') {
      return `/api/candidatos/${encodeURIComponent(id)}/foto`;
    }
    return '';
  };
  const getEdad = (c: Candidato): string | number => c.Edad !== undefined && c.Edad !== '' ? c.Edad : (c.edad !== undefined && c.edad !== '' ? c.edad : "--");
  const getZona = (c: Candidato): string => String(c.Zona || c.zona || "No especificada").trim();
  const getTelefono = (c: Candidato): string => String(c.Teléfono ?? c.telefono ?? "--").trim();
  const getDisponibilidad = (c: Candidato): string => String(c.Disponibilidad || c.disponibilidad || "No indicada").trim();
  const getPuntoPartida = (c: Candidato): string => String(c["Punto de partida"] || c.punto_partida || c.puntoPartida || "No especificado").trim();
  const getExperiencia = (c: Candidato): string => String(c.Experiencia || c.experiencia || "No especificada").trim();
  const getMotivacion = (c: Candidato): string => String(c.Motivación || c.motivacion || "No especificada").trim();
  const getTalento = (c: Candidato): string => String(c.Talento || c.talento || "").trim();
  const getEstado = (c: Candidato): string => String(c.Estado || c.estado || "Recibida").trim();
  const getFecha = (c: Candidato): string => String(c.Fecha || c.fecha || c.createdAt || "").trim();

  // 1. Cargar configuración del servidor central (con soporte para almacenamiento local y fallback)
  const cargarConfiguracionServidor = async () => {
    const cachedUrl = localStorage.getItem('tour_azul_sheets_webhook_url');
    const defaultUrl = 'https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec';
    if (cachedUrl) {
      setScriptUrl(cachedUrl);
      setInputUrl(cachedUrl);
    } else {
      setScriptUrl(defaultUrl);
      setInputUrl(defaultUrl);
    }

    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        if (data && data.config) {
          const urlGuardada = data.config.webhookUrl ? String(data.config.webhookUrl).trim() : '';
          if (urlGuardada) {
            setScriptUrl(urlGuardada);
            setInputUrl(urlGuardada);
            localStorage.setItem('tour_azul_sheets_webhook_url', urlGuardada);
          }
          if (data.config.sheetName) {
            setSheetName(data.config.sheetName);
            setInputSheetName(data.config.sheetName);
          }
          if (data.config.spreadsheetName) {
            setSpreadsheetName(data.config.spreadsheetName);
          }
        }
      }
    } catch (err) {
      console.warn("Aviso al obtener /api/config:", err);
    }
  };

  // 2. Cargar candidatos desde el servidor central y nuevo Google Sheet con fallback resiliente
  const cargarCandidatos = useCallback(async (silencioso: boolean = false) => {
    if (!silencioso) {
      setCargando(true);
    } else {
      setActualizandoSilencioso(true);
    }
    setError(null);

    const getLocalCache = (): Candidato[] => {
      try {
        const raw = localStorage.getItem('tour_azul_candidatos_local');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    };

    let listadoFinal: Candidato[] = [];
    let consultadoConExito = false;

    // Intentar primero con el endpoint backend /api/candidatos
    try {
      const resp = await fetch(`/api/candidatos?sync=true&_t=${Date.now()}`);
      if (resp.ok) {
        const resJson = await resp.json();
        if (Array.isArray(resJson.candidatos)) {
          listadoFinal = resJson.candidatos;
          consultadoConExito = true;
        }
      }
    } catch (_) {}

    // Si el servidor /api/candidatos falló o devolvió 404 (ej. en Vercel estático):
    // Consultar DIRECTAMENTE la API Webhook de Google Apps Script
    if (!consultadoConExito) {
      const targetUrl = scriptUrl || localStorage.getItem('tour_azul_sheets_webhook_url') || 'https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec';
      try {
        const sep = targetUrl.includes('?') ? '&' : '?';
        const remoteUrl = `${targetUrl}${sep}accion=candidatos&_t=${Date.now()}`;
        const respSheets = await fetch(remoteUrl);
        if (respSheets.ok) {
          const json = await respSheets.json();
          let remotos: any[] = [];
          if (json && json.status === 'success' && Array.isArray(json.data)) remotos = json.data;
          else if (Array.isArray(json)) remotos = json;

          listadoFinal = remotos.map(r => ({ ...r, _origen: 'sheets', syncedToSheets: true }));
          consultadoConExito = true;
        }
      } catch (errSheets) {
        console.warn("Aviso consultando Google Sheets directamente:", errSheets);
      }
    }

    // Combinar con las postulaciones guardadas en caché local del navegador
    const locales = getLocalCache();
    const map = new Map<string, Candidato>();

    listadoFinal.forEach((c: Candidato) => {
      const key = String(c.id || c.codigo || c.Código || '').toLowerCase().trim();
      if (key) map.set(key, c);
    });

    locales.forEach((l: Candidato) => {
      const key = String(l.id || l.codigo || l.Código || '').toLowerCase().trim();
      if (key && !map.has(key)) {
        map.set(key, l);
      }
    });

    const combinados = Array.from(map.values());
    const candidatosValidos = combinados.filter((c: Candidato) => {
      const nom = String(c.nombre || c.Nombre || '').trim();
      const tel = String(c.telefono || c.Teléfono || '').trim();
      return (nom.length > 0 && nom !== 'Sin nombre' && nom !== 'Aspirante sin nombre') || tel.length > 0;
    });

    setCandidatos(candidatosValidos);
    setUltimaActualizacion(new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    if (!consultadoConExito && candidatosValidos.length === 0) {
      setError('Mostrando postulaciones sin conexión. Verifica tu conexión a internet o la URL del Webhook.');
    }

    if (!silencioso) setCargando(false);
    setActualizandoSilencioso(false);
  }, [scriptUrl]);

  // Carga inicial y configuración
  useEffect(() => {
    cargarConfiguracionServidor();
    cargarCandidatos(false);
  }, [cargarCandidatos]);

  // Auto-actualización periódica (cada 20s)
  useEffect(() => {
    if (!autoActualizar) return;
    const interval = setInterval(() => {
      cargarCandidatos(true);
    }, 20000);
    return () => clearInterval(interval);
  }, [autoActualizar, cargarCandidatos]);

  // 3. Cambiar estado de un candidato (Guarda inmediatamente en el servidor y sincroniza con Sheets)
  const handleCambiarEstado = async (id: string, nuevoEstado: string) => {
    setGuardandoEstadoId(id);
    
    // Actualización optimista
    setCandidatos(prev => prev.map(c => {
      if (String(c.id || c.codigo) === String(id)) {
        return { ...c, estado: nuevoEstado, Estado: nuevoEstado };
      }
      return c;
    }));

    // Actualizar también en caché local
    try {
      const raw = localStorage.getItem('tour_azul_candidatos_local');
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.map((c: any) => {
          if (String(c.id || c.codigo) === String(id)) {
            return { ...c, estado: nuevoEstado, Estado: nuevoEstado };
          }
          return c;
        });
        localStorage.setItem('tour_azul_candidatos_local', JSON.stringify(updated));
      }
    } catch (_) {}

    try {
      const res = await fetch(`/api/candidatos/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (!res.ok) {
        // Enviar directamente a Google Apps Script si el endpoint backend devolvió 404
        const targetUrl = scriptUrl || localStorage.getItem('tour_azul_sheets_webhook_url') || 'https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec';
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ accion: 'actualizar_estado', id, estado: nuevoEstado })
        });
      }
    } catch (err) {
      // Reintentar directamente con Google Sheets
      try {
        const targetUrl = scriptUrl || localStorage.getItem('tour_azul_sheets_webhook_url') || 'https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec';
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ accion: 'actualizar_estado', id, estado: nuevoEstado })
        });
      } catch (_) {}
    } finally {
      setGuardandoEstadoId(null);
    }
  };

  // 4. Eliminar candidato (descarta registros de prueba)
  const handleEliminarCandidato = async (id: string, nombre: string) => {
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar permanentemente la postulación de "${nombre}" (${id})?`);
    if (!confirmar) return;

    // Eliminar de memoria
    setCandidatos(prev => prev.filter(c => String(c.id || c.codigo) !== String(id)));
    if (candidatoSeleccionado && String(candidatoSeleccionado.id || candidatoSeleccionado.codigo) === String(id)) {
      setCandidatoSeleccionado(null);
    }

    // Eliminar de caché local
    try {
      const raw = localStorage.getItem('tour_azul_candidatos_local');
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.filter((c: any) => String(c.id || c.codigo) !== String(id));
        localStorage.setItem('tour_azul_candidatos_local', JSON.stringify(updated));
      }
    } catch (_) {}

    try {
      await fetch(`/api/candidatos/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (_) {}
  };

  // 5. Probar Conexión con el Nuevo Google Sheet
  const handleProbarConexion = async () => {
    const urlAProbar = inputUrl.trim();
    if (!urlAProbar.startsWith('http')) {
      setResultadoTest({
        ok: false,
        msg: "Por favor ingresa la URL de la aplicación web de Google Apps Script (debe comenzar con https:// y terminar en /exec)."
      });
      return;
    }

    setProbandoConexion(true);
    setResultadoTest(null);

    try {
      const res = await fetch('/api/test-sheets', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ url: urlAProbar })
      });
      const data = await res.json();
      setResultadoTest({
        ok: data.ok,
        msg: data.message || (data.ok ? "Conexión exitosa" : "Error en la conexión")
      });
    } catch (e: any) {
      setResultadoTest({
        ok: false,
        msg: `Error de conexión: ${e.message || e}. Verifica que el Webhook esté implementado con acceso 'Cualquier usuario' (Anyone).`
      });
    } finally {
      setProbandoConexion(false);
    }
  };

  // 6. Guardar la nueva URL en el servidor
  const handleGuardarConfig = async () => {
    const limpiaUrl = inputUrl.trim();
    const limpiaSheet = inputSheetName.trim() || 'Postulaciones';

    if (limpiaUrl && !limpiaUrl.startsWith('http')) {
      alert("Por favor ingresa una URL válida (o déjala vacía si aún no la has publicado).");
      return;
    }

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          webhookUrl: limpiaUrl,
          sheetName: limpiaSheet,
          spreadsheetName: spreadsheetName || 'Postulaciones Tour Azul'
        })
      });

      if (res.ok) {
        setScriptUrl(limpiaUrl);
        setSheetName(limpiaSheet);
        alert(`¡Configuración guardada exitosamente! ${limpiaUrl ? `Conexión activa con la pestaña "${limpiaSheet}".` : 'Conexión en espera de la nueva URL.'}`);
        setMostrarConfigUrl(false);
        await cargarCandidatos(false);
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(`No se pudo guardar la configuración: ${errJson.error || 'Error del servidor'}`);
      }
    } catch (e: any) {
      alert(`Error al guardar: ${e.message || e}`);
    }
  };

  // 7. Sincronizar todos los candidatos pendientes hacia el nuevo Google Sheet
  const handleSincronizarHaciaSheets = async () => {
    if (!scriptUrl) {
      alert("Debes configurar primero la URL del nuevo Apps Script antes de sincronizar.");
      setMostrarConfigUrl(true);
      return;
    }

    setSincronizando(true);
    try {
      const res = await fetch('/api/sync-sheets', {
        method: 'POST',
        headers: getAuthHeaders()
      });
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

  // 8. Enviar postulación de prueba para verificar la nueva hoja
  const handleEnviarPostulacionPrueba = async () => {
    const confirmar = confirm(`¿Deseas enviar un aspirante de prueba para verificar que se escribe correctamente en tu nueva pestaña "${sheetName}"?`);
    if (!confirmar) return;

    setCargando(true);
    try {
      const testId = `TEST-${Date.now().toString().slice(-4)}`;
      const payload = {
        id: testId,
        codigo: testId,
        nombre: "Aspirante de Verificación Nuevo Sheet",
        edad: 26,
        telefono: "0412-0000000",
        zona: "Barquisimeto",
        experiencia: "Experiencia verificada en coordinación turística",
        disponibilidad: "Fines de semana y feriados",
        punto_partida: "Punto de salida Barquisimeto sin inconvenientes",
        motivacion: "Postulación de prueba para comprobar la nueva conexión con Google Sheets en una única pestaña.",
        talento: "Prueba técnica de conexión",
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
          alert(`¡Prueba exitosa! 🎉 Se registró en el servidor y se escribió en la pestaña "${sheetName}" de tu nuevo Google Sheet.`);
        } else {
          alert(`Registro guardado en el servidor. ${data.sheetsPending ? 'Pendiente de escribir en Google Sheets (falta configurar la URL de Apps Script).' : `Aviso de Google Sheets: ${data.sheetsResult?.statusText || 'No se pudo conectar'}`}`);
        }
        await cargarCandidatos(false);
      } else {
        alert(`Error al registrar prueba: ${data.error || 'Error desconocido'}`);
      }
    } catch (e: any) {
      alert(`Error al enviar prueba: ${e.message || e}`);
    } finally {
      setCargando(false);
    }
  };

  // 9. Copiar código de Postulaciones_GoogleSheet.gs al portapapeles
  const handleCopiarCodeGs = async () => {
    try {
      let text = '';
      try {
        const res = await fetch('/Postulaciones_GoogleSheet.gs');
        if (res.ok) text = await res.text();
      } catch (_) {}
      if (!text) {
        try {
          const res2 = await fetch('/api/admin/code-gs');
          if (res2.ok) text = await res2.text();
        } catch (_) {}
      }
      if (text) {
        await navigator.clipboard.writeText(text);
        setCopiadoCodeGs(true);
        setTimeout(() => setCopiadoCodeGs(false), 4000);
        alert("¡Código completo copiado al portapapeles! 📋\n\nPégalo en Extensiones > Apps Script de tu Google Sheet, guarda y despliega como Aplicación web.");
      } else {
        alert("No se pudo obtener el archivo automáticamente. Puedes copiar el archivo Postulaciones_GoogleSheet.gs directamente.");
      }
    } catch (e) {
      alert("No se pudo copiar automáticamente. Puedes copiar el archivo Postulaciones_GoogleSheet.gs directamente.");
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
      const nom = String(getNombre(c) || '').toLowerCase();
      const zon = String(getZona(c) || '').toLowerCase();
      const cod = String(getCodigo(c) || '').toLowerCase();
      const tel = String(getTelefono(c) || '').toLowerCase();
      const est = String(getEstado(c) || 'Recibida');
      const q = String(busqueda || '').toLowerCase().trim();

      const coincideTexto = !q || nom.includes(q) || zon.includes(q) || cod.includes(q) || tel.includes(q);
      if (!coincideTexto) return false;

      if (filtroEstado !== 'todos' && est !== filtroEstado) {
        return false;
      }

      if (filtroDisponibilidad !== 'todos') {
        const disp = String(getDisponibilidad(c) || '').toLowerCase();
        if (!disp.includes(String(filtroDisponibilidad).toLowerCase())) {
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

  const countPendientes = candidatos.filter(c => !c.syncedToSheets).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-3 sm:p-5 md:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Barra superior de navegación */}
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
              <span className={`w-2 h-2 rounded-full ${scriptUrl ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span>Pestaña destino: <strong>{sheetName}</strong> {scriptUrl ? '(Conectada)' : '(Pendiente URL)'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setMostrarConfigUrl(!mostrarConfigUrl)}
              className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                scriptUrl 
                  ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800' 
                  : 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 animate-pulse'
              }`}
            >
              <span>⚙️ {scriptUrl ? 'Conexión Google Sheets' : 'Conectar Nuevo Google Sheet'}</span>
            </button>
          </div>
        </div>

        {/* Banner Informativo de Conexión: Indica el estado de la integración */}
        {!scriptUrl ? (
          <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-3xl shadow-md text-amber-950 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">⚠️</span>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-amber-900">
                  Integración anterior desconectada · Listo para conectar nuevo Google Sheet
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed max-w-3xl">
                  Se ha desconectado la hoja de cálculo antigua y se dejaron de escribir datos en ella. Todas las postulaciones se resguardan de forma segura en el servidor. Para activar la escritura automática en tu nuevo Google Sheet en una única pestaña (<strong>"{sheetName}"</strong>), pega la URL de tu nuevo Apps Script.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setMostrarConfigUrl(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer shadow-sm active:scale-95"
              >
                Conectar nuevo Google Sheet ahora
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-sky-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌐</span>
                <h2 className="font-title font-black text-sm sm:text-base uppercase tracking-tight text-tour-yellow">
                  Conexión Activa con Google Sheets
                </h2>
              </div>
              <p className="text-xs text-sky-100/90 max-w-3xl leading-relaxed">
                Todas las postulaciones se registran en el servidor y se guardan como filas individuales en la pestaña única <strong>"{sheetName}"</strong> de tu nuevo documento de Google Sheets.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <a
                href="/api/candidatos/export.csv"
                download="postulaciones_tour_azul.csv"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition active:scale-95 flex items-center gap-1.5"
                title="Descargar lista completa en Excel (CSV)"
              >
                <span>📊 Descargar Excel</span>
              </a>
            </div>
          </div>
        )}

        {/* Modal / Panel de Configuración de la Nueva Conexión */}
        {mostrarConfigUrl && (
          <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-lg border-2 border-blue-200 space-y-5 animate-fadeIn">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span>📊 Configuración de Conexión</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Conexión con tu nuevo Google Sheet
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Configura la URL de Apps Script del nuevo documento para guardar cada envío en una única pestaña (<strong>"{sheetName}"</strong>), sin crear pestañas adicionales por postulación.
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

            {/* Pestañas de configuración */}
            <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setTabConfig('url')}
                className={`pb-2 border-b-2 cursor-pointer transition ${tabConfig === 'url' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                1. Configuración de Conexión
              </button>
              <button
                type="button"
                onClick={() => setTabConfig('codigo')}
                className={`pb-2 border-b-2 cursor-pointer transition ${tabConfig === 'codigo' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                2. Código Apps Script (Postulaciones_GoogleSheet.gs)
              </button>
            </div>

            {tabConfig === 'url' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      URL de Apps Script Webhook (/exec):
                    </label>
                    <input 
                      type="text" 
                      value={inputUrl} 
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
                    />
                    <span className="text-[11px] text-slate-400">
                      Obtén esta URL en Extensiones &gt; Apps Script &gt; Implementar &gt; Aplicación web
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Nombre de la Pestaña Única:
                    </label>
                    <input 
                      type="text" 
                      value={inputSheetName} 
                      onChange={(e) => setInputSheetName(e.target.value)}
                      placeholder="Postulaciones"
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
                    />
                    <span className="text-[11px] text-slate-400">
                      Todas las postulaciones se escribirán como filas en esta pestaña
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleProbarConexion}
                    disabled={probandoConexion}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  >
                    {probandoConexion ? "Probando conexión..." : "🔌 Probar Conexión en Vivo"}
                  </button>
                  <button
                    type="button"
                    onClick={handleGuardarConfig}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    Guardar Configuración
                  </button>
                </div>

                {resultadoTest && (
                  <div className={`p-3.5 rounded-2xl text-xs font-medium border ${resultadoTest.ok ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                    {resultadoTest.msg}
                  </div>
                )}
              </div>
            )}

            {tabConfig === 'codigo' && (
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs text-slate-700">
                  <strong className="block text-slate-900 font-bold text-xs uppercase tracking-wide">
                    🧭 Pasos para actualizar tu Apps Script y activar las fotos:
                  </strong>
                  <ol className="list-decimal list-inside space-y-2 text-slate-600">
                    <li>Abre tu hoja de cálculo en Google Sheets y ve a <strong>Extensiones &gt; Apps Script</strong>.</li>
                    <li>Selecciona todo el código existente (Ctrl + A / Cmd + A), bórralo y pega el código actualizado usando el botón azul inferior.</li>
                    <li>
                      <span className="font-semibold text-slate-800">Para crear la carpeta en Google Drive:</span> en la barra superior de Apps Script (al lado de "Depurar"), selecciona la función <strong>autorizarPermisosDrive</strong> y haz clic en <strong>Ejecutar</strong>. Google te pedirá aceptar permisos y creará de inmediato la carpeta <em>"Fotos Postulaciones Tour Azul"</em>.
                      <p className="text-[11px] text-slate-500 mt-0.5 ml-4">
                        (Nota: Si prefieres no usar Google Drive, las fotos se guardarán directamente en la celda de la hoja y en el servidor, funcionando igual en todos los dispositivos).
                      </p>
                    </li>
                    <li>Guarda con el icono de disco y haz clic en <strong>Implementar &gt; Administrar implementaciones</strong> (o Nueva implementación).</li>
                    <li>Edita la implementación activa, cambia la versión a <strong>"Nueva versión"</strong> y presiona <strong>Implementar</strong>.</li>
                    <li>Copia la URL <strong>/exec</strong> y pégala en la pestaña 1 de este panel.</li>
                  </ol>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCopiarCodeGs}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      <span>📋 {copiadoCodeGs ? "¡Código Copiado!" : "Copiar código completo de Postulaciones_GoogleSheet.gs"}</span>
                    </button>
                    <a
                      href="/Postulaciones_GoogleSheet.gs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition"
                    >
                      📄 Ver archivo en navegador
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleEnviarPostulacionPrueba}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition cursor-pointer"
                >
                  ✉️ Enviar postulación de prueba a la nueva hoja
                </button>
                {scriptUrl && countPendientes > 0 && (
                  <button
                    type="button"
                    onClick={handleSincronizarHaciaSheets}
                    disabled={sincronizando}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200 transition cursor-pointer"
                  >
                    {sincronizando ? "Sincronizando..." : `📤 Sincronizar ${countPendientes} pendientes`}
                  </button>
                )}
              </div>
            </div>
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
                  Actualizado: {ultimaActualizacion}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Panel de Aspirantes</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Registros consolidados de postulaciones recibidas
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
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
              download="postulaciones_tour_azul.csv"
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
            <p className="text-slate-700 font-bold text-base">Cargando postulaciones...</p>
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
                  <h3 className="font-bold text-base text-slate-800">No hay postulaciones registradas</h3>
                  <p className="text-xs text-slate-500">
                    Los envíos de aspirantes recibidos a través del formulario de convocatoria aparecerán aquí y se sincronizarán con tu Google Sheet.
                  </p>
                </div>
              </div>
            ) : candidatosFiltrados.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <p className="font-bold text-sm text-slate-700">No se encontraron candidatos con el filtro actual</p>
                <button
                  type="button"
                  onClick={() => { setBusqueda(''); setFiltroEstado('todos'); setFiltroDisponibilidad('todos'); }}
                  className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Foto</th>
                      <th className="py-3.5 px-4">Código / Fecha</th>
                      <th className="py-3.5 px-4">Aspirante</th>
                      <th className="py-3.5 px-4">Edad / Zona</th>
                      <th className="py-3.5 px-4">Teléfono</th>
                      <th className="py-3.5 px-4">Disponibilidad</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4">Sheets</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {candidatosFiltrados.map((c, index) => {
                      const id = getCodigo(c);
                      const nom = getNombre(c);
                      const foto = getFoto(c);
                      const tieneFotoReal = isFotoValida(foto);
                      const estado = getEstado(c);
                      const tel = getTelefono(c);
                      const waLink = getWhatsAppLink(tel, nom);
                      const isGuardandoEste = guardandoEstadoId === id;

                      return (
                        <tr 
                          key={id || index}
                          onClick={() => setCandidatoSeleccionado(c)}
                          className="hover:bg-blue-50/50 transition cursor-pointer group"
                        >
                          {/* Miniatura de Foto */}
                          <td className="py-3 px-4">
                            {tieneFotoReal ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFotoAmpliada({ url: foto, nombre: nom, codigo: id });
                                }}
                                className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 shadow-xs transition hover:scale-105 active:scale-95 cursor-zoom-in block bg-slate-100"
                                title="Ver fotografía ampliada"
                              >
                                <img 
                                  src={foto} 
                                  alt={nom} 
                                  className="w-full h-full object-cover" 
                                  loading="lazy"
                                  onError={(e) => {
                                    const img = e.currentTarget;
                                    if (!img.dataset.tried && id && id !== 'S/C') {
                                      img.dataset.tried = 'true';
                                      img.src = `/api/candidatos/${encodeURIComponent(id)}/foto`;
                                    } else {
                                      img.style.display = 'none';
                                      if (img.parentElement) {
                                        img.parentElement.innerHTML = '👤';
                                      }
                                    }
                                  }}
                                />
                              </button>
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs" title="Sin fotografía">
                                👤
                              </div>
                            )}
                          </td>

                          {/* Código y Fecha */}
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-slate-900 block text-[11px]">{id}</span>
                            <span className="text-[10px] text-slate-400 block">{getFecha(c) || '--'}</span>
                          </td>

                          {/* Nombre Completo */}
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 group-hover:text-blue-700 transition block text-sm">
                              {nom}
                            </span>
                            <span className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                              {getMotivacion(c)}
                            </span>
                          </td>

                          {/* Edad y Zona */}
                          <td className="py-3 px-4">
                            <span className="text-slate-800 font-semibold block">{getEdad(c)} años</span>
                            <span className="text-[11px] text-slate-500 block truncate max-w-[120px]">{getZona(c)}</span>
                          </td>

                          {/* Teléfono */}
                          <td className="py-3 px-4">
                            <span className="font-mono text-slate-700 block">{tel}</span>
                            {waLink && (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 mt-0.5 hover:underline"
                              >
                                <span>💬 WhatsApp</span>
                              </a>
                            )}
                          </td>

                          {/* Disponibilidad */}
                          <td className="py-3 px-4">
                            <span className="text-slate-700 text-[11px] font-medium block truncate max-w-[140px]">
                              {getDisponibilidad(c)}
                            </span>
                          </td>

                          {/* Estado Editable */}
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <div className="relative inline-block">
                              <select
                                value={estado}
                                disabled={isGuardandoEste}
                                onChange={(e) => handleCambiarEstado(id, e.target.value)}
                                className={`text-xs font-bold rounded-xl px-2.5 py-1 border transition cursor-pointer appearance-none pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  estado === 'Recibida' ? 'bg-sky-50 text-sky-800 border-sky-300' :
                                  estado === 'Contactada' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                                  estado === 'Entrevistada' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                                  estado === 'Seleccionada' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                                  'bg-rose-50 text-rose-800 border-rose-300'
                                }`}
                              >
                                {ESTADOS_DISPONIBLES.map(est => (
                                  <option key={est.id} value={est.id}>{est.label}</option>
                                ))}
                              </select>
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[9px] text-slate-500">
                                ▼
                              </span>
                            </div>
                          </td>

                          {/* Estado de Sincronización con Sheets */}
                          <td className="py-3 px-4">
                            {c.syncedToSheets ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200" title={`Guardado en la pestaña "${sheetName}"`}>
                                <span>✓</span>
                                <span>Guardado</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200" title="Pendiente de enviar al nuevo Google Sheet">
                                <span>⏳</span>
                                <span>Pendiente</span>
                              </span>
                            )}
                          </td>

                          {/* Acciones */}
                          <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setCandidatoSeleccionado(c)}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                                title="Ver detalle completo"
                              >
                                👁️
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEliminarCandidato(id, nom)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                title="Eliminar del registro"
                              >
                                🗑️
                              </button>
                            </div>
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

        {/* Modal Detalle de Candidato */}
        {candidatoSeleccionado && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={() => setCandidatoSeleccionado(null)}
          >
            <div 
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                    Código: {getCodigo(candidatoSeleccionado)} · {getFecha(candidatoSeleccionado)}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5">
                    {getNombre(candidatoSeleccionado)}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCandidatoSeleccionado(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                {/* Foto si está disponible */}
                {isFotoValida(getFoto(candidatoSeleccionado)) && (
                  <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <img 
                      src={getFoto(candidatoSeleccionado)} 
                      alt={getNombre(candidatoSeleccionado)} 
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 cursor-zoom-in shadow-xs hover:scale-105 transition"
                      onClick={() => setFotoAmpliada({
                        url: getFoto(candidatoSeleccionado),
                        nombre: getNombre(candidatoSeleccionado),
                        codigo: getCodigo(candidatoSeleccionado)
                      })}
                      onError={(e) => {
                        const img = e.currentTarget;
                        const id = getCodigo(candidatoSeleccionado);
                        if (!img.dataset.tried && id && id !== 'S/C') {
                          img.dataset.tried = 'true';
                          img.src = `/api/candidatos/${encodeURIComponent(id)}/foto`;
                        }
                      }}
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Fotografía del aspirante</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFotoAmpliada({
                            url: getFoto(candidatoSeleccionado),
                            nombre: getNombre(candidatoSeleccionado),
                            codigo: getCodigo(candidatoSeleccionado)
                          })}
                          className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>🔍 Ver en pantalla completa</span>
                        </button>
                        {getFoto(candidatoSeleccionado).startsWith('http') && (
                          <a
                            href={getFoto(candidatoSeleccionado)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline"
                          >
                            ↗️ Abrir enlace
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block mb-0.5">Edad</span>
                    <strong className="text-slate-800 text-sm">{getEdad(candidatoSeleccionado)} años</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block mb-0.5">Zona de residencia</span>
                    <strong className="text-slate-800 text-sm">{getZona(candidatoSeleccionado)}</strong>
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
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-0.5">Punto de partida</span>
                  <p className="text-slate-800 font-semibold">{getPuntoPartida(candidatoSeleccionado)}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-0.5">Disponibilidad</span>
                  <p className="text-slate-800 font-semibold">{getDisponibilidad(candidatoSeleccionado)}</p>
                </div>

                <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 space-y-1">
                  <strong className="block text-blue-900 font-bold text-xs uppercase tracking-wide">Experiencia:</strong>
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

        {/* Modal de Fotografía en Pantalla Completa */}
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