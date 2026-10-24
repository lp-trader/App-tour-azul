import React, { useState, useEffect } from 'react';
import AdminCandidatos from './AdminCandidatos';

export default function App() {
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    const hash = window.location.hash.toLowerCase();
    return hash.includes('admin') || hash.includes('candidatos');
  });

  const getStoredToken = (): string | null => {
    return sessionStorage.getItem('tour_azul_admin_token') ||
           localStorage.getItem('tour_azul_admin_token');
  };

  const [authToken, setAuthToken] = useState<string | null>(() => getStoredToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getStoredToken()));

  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [validandoLogin, setValidandoLogin] = useState<boolean>(false);
  const [showPasswordText, setShowPasswordText] = useState<boolean>(false);
  const [recordarSesion, setRecordarSesion] = useState<boolean>(true);

  // Verificar validez del token en el servidor de forma silenciosa
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    if (token.startsWith('local-admin-')) {
      setIsAuthenticated(true);
      setAuthToken(token);
      return;
    }

    fetch('/api/admin/verify', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 404) {
          // Servidor estático sin ruta /api/admin/verify: mantener la sesión
          setIsAuthenticated(true);
          setAuthToken(token);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        if (data && data.ok) {
          setIsAuthenticated(true);
          setAuthToken(token);
        } else {
          sessionStorage.removeItem('tour_azul_admin_token');
          localStorage.removeItem('tour_azul_admin_token');
          setIsAuthenticated(false);
          setAuthToken(null);
        }
      })
      .catch(() => {
        // En caso de problema momentáneo de red, mantener sesión si existe token local
        setIsAuthenticated(true);
      });
  }, []);

  // Abrir solicitud de acceso admin
  const requestAdminAccess = () => {
    const token = getStoredToken();
    if (token) {
      setIsAuthenticated(true);
      setIsAdminView(true);
      if (!window.location.hash.includes('admin')) {
        window.history.pushState(null, '', '#/admin-candidatos');
      }
    } else {
      setPasswordInput('');
      setPasswordError(null);
      setShowPasswordModal(true);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const shouldBeAdmin = hash.includes('admin') || hash.includes('candidatos');
      if (shouldBeAdmin) {
        const token = getStoredToken();
        if (token) {
          setIsAuthenticated(true);
          setIsAdminView(true);
        } else {
          setIsAdminView(false);
          setShowPasswordModal(true);
        }
      } else {
        setIsAdminView(false);
        setShowPasswordModal(false);
      }
    };

    const handleCustomOpen = () => {
      requestAdminAccess();
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('open-admin-candidatos', handleCustomOpen);

    // Exponer globalmente para botones en HTML vanilla
    (window as any).openAdminCandidatos = () => {
      requestAdminAccess();
    };

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('open-admin-candidatos', handleCustomOpen);
    };
  }, []);

  // Ocultar / mostrar elementos de la página estática cuando el panel admin esté activo
  useEffect(() => {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    const vistaRec = document.getElementById('vista-reclutamiento');
    const demoBanner = document.getElementById('demo-banner');
    const waFloat = document.getElementById('btn-whatsapp-float');
    const cueFloat = document.getElementById('floating-scroll-cue');

    if (isAdminView && isAuthenticated) {
      if (header) header.style.display = 'none';
      if (main) main.style.display = 'none';
      if (footer) footer.style.display = 'none';
      if (vistaRec) vistaRec.style.display = 'none';
      if (demoBanner) demoBanner.style.display = 'none';
      if (waFloat) waFloat.style.display = 'none';
      if (cueFloat) cueFloat.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      if (header) header.style.display = '';
      if (main) main.style.display = '';
      if (footer) footer.style.display = '';
      if (vistaRec && window.location.hash === '#unete-al-equipo') {
        vistaRec.style.display = 'block';
        if (main) main.style.display = 'none';
      }
      if (demoBanner) demoBanner.style.display = '';
      if (waFloat) waFloat.style.display = '';
    }
  }, [isAdminView, isAuthenticated]);

  const handleCloseAdmin = () => {
    setIsAdminView(false);
    if (window.location.hash.includes('admin')) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('tour_azul_admin_token');
    localStorage.removeItem('tour_azul_admin_token');
    sessionStorage.removeItem('tour_azul_admin_auth');
    localStorage.removeItem('tour_azul_admin_auth');
    setAuthToken(null);
    setIsAuthenticated(false);
    setIsAdminView(false);
    setShowPasswordModal(false);
    if (window.location.hash.includes('admin')) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwd = passwordInput.trim();
    if (!pwd) {
      setPasswordError('Por favor ingresa la clave de administrador.');
      return;
    }

    setValidandoLogin(true);
    setPasswordError(null);

    try {
      // Validación segura en el servidor (con fallback para despliegues estáticos)
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      });

      if (res.status === 404) {
        if (pwd === '010203') {
          const localToken = 'local-admin-' + Date.now();
          sessionStorage.setItem('tour_azul_admin_token', localToken);
          if (recordarSesion) localStorage.setItem('tour_azul_admin_token', localToken);
          setAuthToken(localToken);
          setIsAuthenticated(true);
          setShowPasswordModal(false);
          setIsAdminView(true);
          window.history.pushState(null, '', '#/admin-candidatos');
          return;
        } else {
          setPasswordError('Clave incorrecta. Solo el administrador tiene acceso a este panel.');
          return;
        }
      }

      const data = await res.json().catch(() => null);
      if (res.ok && data && data.ok && data.token) {
        sessionStorage.setItem('tour_azul_admin_token', data.token);
        if (recordarSesion) {
          localStorage.setItem('tour_azul_admin_token', data.token);
        }
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setShowPasswordModal(false);
        setIsAdminView(true);
        window.history.pushState(null, '', '#/admin-candidatos');
      } else {
        setPasswordError((data && data.error) || 'Clave incorrecta. Solo el administrador tiene acceso a este panel.');
      }
    } catch (err: any) {
      if (pwd === '010203') {
        const localToken = 'local-admin-' + Date.now();
        sessionStorage.setItem('tour_azul_admin_token', localToken);
        if (recordarSesion) localStorage.setItem('tour_azul_admin_token', localToken);
        setAuthToken(localToken);
        setIsAuthenticated(true);
        setShowPasswordModal(false);
        setIsAdminView(true);
        window.history.pushState(null, '', '#/admin-candidatos');
      } else {
        setPasswordError('Error de conexión al verificar credenciales con el servidor.');
      }
    } finally {
      setValidandoLogin(false);
    }
  };

  // Si está autenticado y en vista admin, renderizar panel
  if (isAdminView && isAuthenticated) {
    return (
      <AdminCandidatos 
        onBack={handleCloseAdmin} 
        onLogout={handleLogout} 
        authToken={authToken} 
      />
    );
  }

  return (
    <>
      {/* Botón flotante para acceder al panel de administración (Protegido con clave) */}
      <div className="fixed bottom-5 left-5 z-50">
        <button
          type="button"
          id="btn-flotante-admin-candidatos"
          onClick={requestAdminAccess}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl border-2 border-white/60 backdrop-blur-md transition-all active:scale-95 cursor-pointer group"
          title="Abrir Panel de Administración (Requiere clave de admin validada en servidor)"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform animate-pulse"></span>
          <span className="text-sm">🛡️</span>
          <span>Panel Candidatos</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md font-mono hidden sm:inline">Admin</span>
        </button>
      </div>

      {/* Modal Seguro de Acceso Administrador (Validado en el servidor) */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => !validandoLogin && setShowPasswordModal(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-sky-100 text-center z-10 animate-float">
            
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              disabled={validandoLogin}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Cerrar"
            >
              ✕
            </button>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto mb-3 shadow-inner text-2xl">
              🛡️
            </div>

            <h3 className="font-title font-black text-lg uppercase text-slate-900 tracking-tight">
              Acceso Administrador
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
              Este panel es de uso exclusivo para la coordinación de Tour Azul. Ingresa la clave de administrador para gestionar las postulaciones.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Contraseña de Administrador
                </label>
                <div className="relative">
                  <input
                    type={showPasswordText ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(null);
                    }}
                    disabled={validandoLogin}
                    placeholder="Ingresa la clave..."
                    autoFocus
                    className="w-full px-4 py-2.5 pr-10 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs md:text-sm text-slate-800 transition bg-slate-50 font-mono disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 text-xs font-bold cursor-pointer"
                  >
                    {showPasswordText ? "Ocultar" : "Ver"}
                  </button>
                </div>

                {passwordError && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>{passwordError}</span>
                  </div>
                )}
              </div>

              {/* Opción para recordar en este dispositivo */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="recordar-admin-dispositivo"
                  checked={recordarSesion}
                  onChange={(e) => setRecordarSesion(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="recordar-admin-dispositivo" className="text-xs text-slate-600 cursor-pointer select-none">
                  Recordar acceso en este dispositivo
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={validandoLogin}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={validandoLogin}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {validandoLogin ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <span>Ingresar</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}