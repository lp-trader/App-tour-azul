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
  [key: string]: any;
}

interface AdminCandidatosProps {
  onBack?: () => void;
}

export const AdminCandidatos: React.FC<AdminCandidatosProps> = ({ onBack }) => {
  // Autenticación forzada en true para entrar sin contraseña por ahora
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<Candidato | null>(null);
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<string>('todos');

  // URL de Google Apps Script configurada por el usuario
  const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbzKQPZdUVabTJUTZ4S3WcdIQp8rNDAbE8yhye45C7nqXhsiFEeQUoBbBmNOOm5C8m8YrQ/exec";

  const cargarCandidatos = async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch(URL_APPS_SCRIPT);
      const resultado = await respuesta.json();
      
      if (resultado.status === "success" && Array.isArray(resultado.data)) {
        setCandidatos(resultado.data);
      } else if (resultado.status === "success" && !resultado.data) {
        setCandidatos([]);
      } else {
        setError(resultado.message || "No se pudieron cargar los registros desde Google Apps Script.");
      }
    } catch (err) {
      console.error("Error al conectar con Apps Script:", err);
      setError("Error de conexión al intentar obtener los candidatos desde Google Sheets.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      cargarCandidatos();
    }
  }, [isAuthenticated]);

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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-6 md:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Barra superior de navegación rápida */}
        <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={handleVolver}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-blue-700 font-bold text-xs transition cursor-pointer active:scale-95"
              title="Volver a la portada de Tour Azul"
            >
              <span>← Volver a Tour Azul</span>
            </button>
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Conexión en vivo con Google Sheets
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden md:inline">
              Total registrados: <strong>{candidatos.length}</strong>
            </span>
          </div>
        </div>

        {/* Cabecera del Panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              <span>🛡️ Módulo de Selección de Personal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Panel de Administración</h1>
            <p className="text-sm text-slate-500">Postulaciones y candidatos recibidos para Tour Azul</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
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
        {!cargando && !error && candidatos.length > 0 && (
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
                <option value="completa">Disponibilidad completa</option>
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
            <p className="text-slate-700 font-bold text-base">Cargando candidatos desde Google Sheets...</p>
            <p className="text-xs text-slate-400">Sincronizando información en tiempo real con Google Apps Script</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <span>⚠️</span>
              <span>Ocurrió un error al consultar Google Apps Script</span>
            </div>
            <p className="text-red-600 text-xs leading-relaxed">{error}</p>
            <div className="pt-2">
              <button 
                type="button"
                onClick={cargarCandidatos}
                className="px-3.5 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold transition cursor-pointer"
              >
                Reintentar conexión
              </button>
            </div>
          </div>
        )}

        {/* Tabla de Candidatos */}
        {!cargando && !error && (
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
            {candidatos.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl shadow-inner border border-blue-100">
                  📋
                </div>
                <h3 className="text-base font-bold text-slate-800">No hay postulaciones registradas todavía</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Tan pronto como los aspirantes envíen sus datos a través de la convocatoria o se agreguen filas en la hoja de cálculo de Google Sheets, aparecerán reflejados en esta tabla.
                </p>
                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={cargarCandidatos}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    🔄 Comprobar de nuevo
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
                      const waLink = getWhatsAppLink(telefono, nombre);

                      return (
                        <tr key={index} className="hover:bg-blue-50/40 transition-colors">
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            {foto ? (
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
                            <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {disp}
                            </span>
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
                {getFoto(candidatoSeleccionado) ? (
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

                {candidatoSeleccionado.talento && (
                  <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 space-y-1">
                    <strong className="block text-amber-900 font-bold text-xs uppercase tracking-wide">🤭 Talento curioso:</strong>
                    <p className="text-slate-700 text-xs leading-relaxed">{candidatoSeleccionado.talento}</p>
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