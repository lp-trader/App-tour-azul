import React, { useState, useEffect } from 'react';
import AdminCandidatos from './AdminCandidatos';

export default function App() {
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    const hash = window.location.hash.toLowerCase();
    return hash.includes('admin') || hash.includes('candidatos');
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const shouldBeAdmin = hash.includes('admin') || hash.includes('candidatos');
      setIsAdminView(shouldBeAdmin);
    };

    const handleCustomOpen = () => {
      setIsAdminView(true);
      if (!window.location.hash.includes('admin')) {
        window.history.pushState(null, '', '#/admin-candidatos');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('open-admin-candidatos', handleCustomOpen);

    // Exponer globalmente para botones en HTML vanilla
    (window as any).openAdminCandidatos = () => {
      handleCustomOpen();
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

    if (isAdminView) {
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
  }, [isAdminView]);

  const handleCloseAdmin = () => {
    setIsAdminView(false);
    if (window.location.hash.includes('admin')) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  if (isAdminView) {
    return <AdminCandidatos onBack={handleCloseAdmin} />;
  }

  // Cuando está en la portada, renderizar acceso directo discreto al panel admin
  return (
    <div className="fixed bottom-5 left-5 z-40">
      <button
        type="button"
        onClick={() => {
          if (typeof (window as any).openAdminPostulacionesModal === 'function') {
            (window as any).openAdminPostulacionesModal();
          } else {
            setIsAdminView(true);
            window.location.hash = '#/admin-candidatos';
          }
        }}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 hover:text-blue-700 font-bold text-xs shadow-lg hover:shadow-xl border border-slate-200/90 backdrop-blur-md transition-all active:scale-95 cursor-pointer group"
        title="Ver panel de administración de postulaciones (Google Sheets)"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform"></span>
        <span className="hidden sm:inline">Panel Candidatos (Admin)</span>
        <span className="sm:hidden">Admin</span>
      </button>
    </div>
  );
}
