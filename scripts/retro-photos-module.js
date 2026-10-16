/**
 * Módulo de Fotos Retro de Guías para Tour Azul
 * Renderiza marcos de cámara retro / polaroid para Guias1.jpg y Guias2.jpg
 * Ubicadas en las esquinas frontales del hero con ángulo inclinado y soporte responsive.
 */

export const retroPhotosCss = `
  /* Filtro y Estilos de Cámara Retro Instantánea */
  .retro-polaroid-card {
    background-color: #FAF8F5;
    background-image: radial-gradient(circle at 50% 0%, #FFFFFF 0%, #FAF6EE 100%);
    box-shadow: 
      0 10px 25px -5px rgba(2, 23, 62, 0.35),
      0 20px 40px -10px rgba(0, 0, 0, 0.4),
      0 0 1px 1px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(226, 220, 208, 0.9);
    border-bottom: 2px solid rgba(198, 190, 175, 0.7);
    transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, box-shadow;
  }

  .retro-polaroid-card:hover {
    box-shadow: 
      0 25px 50px -12px rgba(2, 23, 62, 0.5),
      0 35px 70px -15px rgba(0, 0, 0, 0.45),
      0 0 1px 1px rgba(255, 255, 255, 0.4);
  }

  /* Filtro de película retro analógica */
  .retro-film-filter {
    filter: sepia(0.12) contrast(1.08) brightness(1.02) saturate(1.14);
    transition: filter 0.5s ease, transform 0.6s ease;
  }

  .retro-polaroid-card:hover .retro-film-filter {
    filter: sepia(0.04) contrast(1.05) brightness(1.04) saturate(1.18);
  }

  /* Cinta adhesiva vintage / washi tape */
  .washi-tape {
    background: linear-gradient(180deg, rgba(255, 250, 235, 0.85) 0%, rgba(254, 243, 199, 0.75) 100%);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
    border-top: 1px solid rgba(245, 158, 11, 0.25);
    border-bottom: 1px solid rgba(245, 158, 11, 0.25);
    backdrop-filter: blur(2px);
  }

  /* Efecto de destello de luz analógica */
  .retro-light-leak {
    background: radial-gradient(circle at top right, rgba(255, 170, 70, 0.22) 0%, rgba(255, 110, 50, 0.08) 40%, transparent 70%);
  }

  /* Viñeta analógica en las esquinas de la foto */
  .retro-vignette {
    box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.35);
  }

  /* Brillo reflectivo de papel fotográfico */
  .photo-sheen {
    background: linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 40%, transparent 60%);
  }
`;

export const retroPhotosHeroHtml = `
  <!-- ======================================================== -->
  <!-- FOTOS RETRO DE GUÍAS (UNA EN CADA ESQUINA DEL FRONT END) -->
  <!-- ======================================================== -->

  <!-- 1. ESQUINA SUPERIOR IZQUIERDA (GUÍAS 1) - PANTALLAS GRANDES -->
  <aside 
    class="hidden lg:block absolute top-8 xl:top-12 left-4 xl:left-8 2xl:left-14 z-20 select-none group" 
    aria-label="Foto Polaroid de Guías Tour Azul"
  >
    <div 
      class="cursor-pointer transition-transform duration-500 ease-out hover:scale-105 hover:-translate-y-2 hover:z-30" 
      onclick="openRetroPhotoModal('guias1')"
      title="Haz clic para ver foto retro de nuestros guías"
    >
      <!-- Cinta adhesiva vintage que sostiene la foto -->
      <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 washi-tape rounded-xs z-30 pointer-events-none transform -rotate-3 border-x border-dashed border-amber-300/50"></div>

      <!-- Marco Estilo Polaroid Retro -->
      <div class="retro-polaroid-card w-56 xl:w-64 p-3.5 pb-5 rounded-md transform -rotate-6 group-hover:rotate-0 group-hover:shadow-2xl transition-all duration-500">
        
        <!-- Recuadro Fotográfico de la Cámara Retro -->
        <div class="relative w-full aspect-[3/4] bg-slate-900 rounded-[2px] overflow-hidden shadow-inner">
          <img 
            src="/Guias1.jpg" 
            alt="Guías Oficiales de Tour Azul en Morrocoy" 
            class="w-full h-full object-cover retro-film-filter group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="eager"
          >
          
          <!-- Capas de Luz y Viñeta Analógica -->
          <div class="absolute inset-0 retro-light-leak pointer-events-none"></div>
          <div class="absolute inset-0 retro-vignette pointer-events-none"></div>
          <div class="absolute inset-0 photo-sheen pointer-events-none"></div>
          
          <!-- Badge analógico '35mm' en la esquina de la foto -->
          <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-[10px] text-amber-200 font-mono px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20 shadow-xs">
            <i data-lucide="camera" class="w-3 h-3 text-amber-300"></i>
            <span>35mm</span>
          </div>

          <!-- Pestaña flotante 'Ver foto' al pasar cursor -->
          <div class="absolute inset-0 bg-blue-950/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span class="px-3 py-1.5 rounded-full bg-white/95 text-tour-navy font-bold text-xs shadow-lg flex items-center gap-1.5 transform scale-90 group-hover:scale-100 transition-transform">
              <i data-lucide="zoom-in" class="w-3.5 h-3.5 text-tour-blue"></i>
              <span>Ampliar foto</span>
            </span>
          </div>
        </div>

        <!-- Parte Inferior del Marco (El clásico borde ancho de foto instantánea) -->
        <div class="pt-3 px-1 text-left">
          <div class="flex items-center justify-between gap-1">
            <span class="font-script text-xl xl:text-2xl text-slate-800 leading-tight">Nuestros Guías 🌴</span>
            <span class="font-mono text-[10px] text-red-600 font-bold tracking-widest bg-red-100/70 border border-red-200/50 px-1.5 py-0.5 rounded">'24 10 16</span>
          </div>
          <p class="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">Tour Azul · Ruta Morrocoy</p>
          
          <div class="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-400">
            <span class="flex items-center gap-1 text-slate-600 font-medium">
              <i data-lucide="sparkles" class="w-3 h-3 text-amber-500"></i>
              <span>Staff Oficial</span>
            </span>
            <span class="text-tour-blue font-semibold group-hover:text-blue-700 flex items-center gap-0.5">
              <span>Ver</span>
              <i data-lucide="chevron-right" class="w-3 h-3"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </aside>


  <!-- 2. ESQUINA SUPERIOR DERECHA (GUÍAS 2) - PANTALLAS GRANDES -->
  <aside 
    class="hidden lg:block absolute top-12 xl:top-16 right-4 xl:right-8 2xl:right-14 z-20 select-none group" 
    aria-label="Foto Polaroid de Staff Tour Azul"
  >
    <div 
      class="cursor-pointer transition-transform duration-500 ease-out hover:scale-105 hover:-translate-y-2 hover:z-30" 
      onclick="openRetroPhotoModal('guias2')"
      title="Haz clic para ver foto retro del equipo de guías"
    >
      <!-- Cinta adhesiva vintage que sostiene la foto -->
      <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 washi-tape rounded-xs z-30 pointer-events-none transform rotate-3 border-x border-dashed border-amber-300/50"></div>

      <!-- Marco Estilo Polaroid Retro -->
      <div class="retro-polaroid-card w-56 xl:w-64 p-3.5 pb-5 rounded-md transform rotate-6 group-hover:rotate-0 group-hover:shadow-2xl transition-all duration-500">
        
        <!-- Recuadro Fotográfico de la Cámara Retro -->
        <div class="relative w-full aspect-[3/4] bg-slate-900 rounded-[2px] overflow-hidden shadow-inner">
          <img 
            src="/Guias2.jpg" 
            alt="Buena Vibra y Equipo de Guías Tour Azul" 
            class="w-full h-full object-cover retro-film-filter group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="eager"
          >
          
          <!-- Capas de Luz y Viñeta Analógica -->
          <div class="absolute inset-0 retro-light-leak pointer-events-none"></div>
          <div class="absolute inset-0 retro-vignette pointer-events-none"></div>
          <div class="absolute inset-0 photo-sheen pointer-events-none"></div>
          
          <!-- Badge analógico 'Instant Cam' -->
          <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-[10px] text-amber-200 font-mono px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20 shadow-xs">
            <i data-lucide="sun" class="w-3 h-3 text-amber-300"></i>
            <span>InstaCam</span>
          </div>

          <!-- Pestaña flotante 'Ver foto' al pasar cursor -->
          <div class="absolute inset-0 bg-blue-950/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span class="px-3 py-1.5 rounded-full bg-white/95 text-tour-navy font-bold text-xs shadow-lg flex items-center gap-1.5 transform scale-90 group-hover:scale-100 transition-transform">
              <i data-lucide="zoom-in" class="w-3.5 h-3.5 text-tour-blue"></i>
              <span>Ampliar foto</span>
            </span>
          </div>
        </div>

        <!-- Parte Inferior del Marco (El clásico borde ancho de foto instantánea) -->
        <div class="pt-3 px-1 text-left">
          <div class="flex items-center justify-between gap-1">
            <span class="font-script text-xl xl:text-2xl text-slate-800 leading-tight">Buena Vibra ☀️</span>
            <span class="font-mono text-[10px] text-red-600 font-bold tracking-widest bg-red-100/70 border border-red-200/50 px-1.5 py-0.5 rounded">'24 10 16</span>
          </div>
          <p class="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">Tour Azul · Aventura & Cuidado</p>
          
          <div class="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-400">
            <span class="flex items-center gap-1 text-slate-600 font-medium">
              <i data-lucide="heart" class="w-3 h-3 text-rose-500"></i>
              <span>Pasión Viajera</span>
            </span>
            <span class="text-tour-blue font-semibold group-hover:text-blue-700 flex items-center gap-0.5">
              <span>Ver</span>
              <i data-lucide="chevron-right" class="w-3 h-3"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </aside>


  <!-- 3. VERSIÓN MÓVIL Y TABLET: DÚO DE POLAROIDS EN EL FRONT END -->
  <div class="lg:hidden relative z-20 mt-4 px-2 w-full max-w-sm mx-auto select-none">
    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-lg">
      <div class="flex items-center justify-center gap-2 mb-2 text-sky-100 text-xs font-semibold">
        <i data-lucide="camera" class="w-3.5 h-3.5 text-tour-yellow"></i>
        <span>Nuestros Guías en Acción</span>
      </div>

      <div class="flex items-center justify-center gap-3">
        <!-- Foto 1 Móvil (Inclinada a la izquierda) -->
        <div 
          class="w-1/2 cursor-pointer transform -rotate-3 hover:rotate-0 active:scale-95 transition-all duration-300"
          onclick="openRetroPhotoModal('guias1')"
        >
          <div class="retro-polaroid-card p-2 pb-3 rounded-sm shadow-md text-slate-800">
            <div class="relative aspect-[3/4] rounded-[2px] overflow-hidden bg-slate-900 shadow-inner">
              <img src="/Guias1.jpg" alt="Guías Tour Azul" class="w-full h-full object-cover retro-film-filter">
              <div class="absolute inset-0 retro-light-leak pointer-events-none"></div>
              <span class="absolute bottom-1 right-1 bg-black/60 text-amber-200 font-mono text-[8px] px-1 rounded">35mm</span>
            </div>
            <div class="pt-1.5 text-left">
              <p class="font-script text-sm text-slate-900 leading-tight">Nuestros Guías 🌴</p>
              <p class="text-[9px] text-slate-500">Staff Tour Azul</p>
            </div>
          </div>
        </div>

        <!-- Foto 2 Móvil (Inclinada a la derecha) -->
        <div 
          class="w-1/2 cursor-pointer transform rotate-3 hover:rotate-0 active:scale-95 transition-all duration-300"
          onclick="openRetroPhotoModal('guias2')"
        >
          <div class="retro-polaroid-card p-2 pb-3 rounded-sm shadow-md text-slate-800">
            <div class="relative aspect-[3/4] rounded-[2px] overflow-hidden bg-slate-900 shadow-inner">
              <img src="/Guias2.jpg" alt="Buena Vibra Tour Azul" class="w-full h-full object-cover retro-film-filter">
              <div class="absolute inset-0 retro-light-leak pointer-events-none"></div>
              <span class="absolute bottom-1 right-1 bg-black/60 text-amber-200 font-mono text-[8px] px-1 rounded">Insta</span>
            </div>
            <div class="pt-1.5 text-left">
              <p class="font-script text-sm text-slate-900 leading-tight">Buena Vibra ☀️</p>
              <p class="text-[9px] text-slate-500">Morrocoy Team</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-2 text-center">
        <span class="text-[10px] text-sky-100 font-medium inline-flex items-center gap-1">
          <i data-lucide="zoom-in" class="w-3 h-3 text-tour-yellow"></i>
          <span>Toca cualquier foto para verla completa</span>
        </span>
      </div>
    </div>
  </div>
`;

export const retroPhotosModalsHtml = `
  <!-- ======================================================== -->
  <!-- MODAL VISOR DE FOTO RETRO / CÁMARA INSTANTÁNEA EN DETALLE-->
  <!-- ======================================================== -->
  <div 
    id="modal-retro-photo" 
    class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md hidden items-center justify-center p-4 transition-all duration-300"
    role="dialog"
    aria-modal="true"
    aria-labelledby="retro-photo-modal-title"
  >
    <div 
      class="relative max-w-lg w-full bg-[#FAF8F5] rounded-xl p-4 sm:p-6 shadow-2xl border border-amber-200/50 transform scale-95 opacity-0 transition-all duration-300 ease-out flex flex-col items-center"
      id="retro-photo-modal-card"
    >
      <!-- Cinta adhesiva en la parte superior del visor modal -->
      <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-36 h-8 washi-tape rounded-xs z-30 pointer-events-none transform -rotate-1 border-x border-dashed border-amber-300/50 shadow-md"></div>

      <!-- Botón de Cerrar Modal -->
      <button 
        type="button" 
        onclick="closeRetroPhotoModal()" 
        class="absolute top-3 right-3 p-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 hover:text-slate-900 transition-colors z-30 cursor-pointer shadow-sm"
        aria-label="Cerrar visor de foto"
      >
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <!-- Recuadro Fotográfico Principal Retro -->
      <div class="relative w-full max-h-[65vh] aspect-[3/4] bg-slate-950 rounded-sm overflow-hidden shadow-2xl border border-slate-300/40">
        <img 
          id="retro-modal-image" 
          src="/Guias1.jpg" 
          alt="Foto Retro de Guías Tour Azul" 
          class="w-full h-full object-contain sm:object-cover retro-film-filter"
        >
        
        <!-- Capas Retro -->
        <div class="absolute inset-0 retro-light-leak pointer-events-none"></div>
        <div class="absolute inset-0 retro-vignette pointer-events-none"></div>
        <div class="absolute inset-0 photo-sheen pointer-events-none"></div>

        <!-- Indicador de cámara vintage -->
        <div class="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-amber-300 text-xs font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
          <i data-lucide="camera" class="w-3.5 h-3.5"></i>
          <span id="retro-modal-badge">FOTO RETRO · 35mm</span>
        </div>

        <div class="absolute top-3 right-3 bg-red-600/90 text-white text-[11px] font-mono tracking-widest px-2 py-0.5 rounded shadow-sm">
          '24 10 16
        </div>
      </div>

      <!-- Pie de Foto Estilo Chin de Cámara Retro -->
      <div class="w-full pt-4 px-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-200/80 mt-3">
        <div>
          <h3 id="retro-photo-modal-title" class="font-script text-2xl sm:text-3xl text-slate-900 leading-tight">
            Nuestros Guías 🌴
          </h3>
          <p id="retro-photo-modal-subtitle" class="text-xs sm:text-sm text-slate-600 font-medium">
            ¡Listos para llevarte a vivir la mejor experiencia en Morrocoy y toda Venezuela!
          </p>
        </div>

        <!-- Botones de Navegación entre Guias 1 y Guias 2 -->
        <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button 
            type="button" 
            onclick="switchRetroPhoto('guias1')" 
            id="btn-switch-guias1"
            class="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-sky-50 text-slate-700 transition flex items-center gap-1"
          >
            <span>Guías 1</span>
          </button>
          <button 
            type="button" 
            onclick="switchRetroPhoto('guias2')" 
            id="btn-switch-guias2"
            class="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-sky-50 text-slate-700 transition flex items-center gap-1"
          >
            <span>Guías 2</span>
          </button>
        </div>
      </div>

      <div class="w-full mt-3 pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
        <span class="flex items-center gap-1">
          <i data-lucide="shield-check" class="w-3.5 h-3.5 text-tour-blue"></i>
          <span>Personal certificado de Tour Azul</span>
        </span>
        <button 
          type="button" 
          onclick="closeRetroPhotoModal()" 
          class="text-tour-blue font-bold hover:underline"
        >
          Cerrar vista
        </button>
      </div>
    </div>
  </div>
`;

export const retroPhotosClientCode = `
  // Control del Visor de Fotos Retro de Guías
  const RETRO_PHOTOS_DATA = {
    guias1: {
      src: '/Guias1.jpg',
      title: 'Nuestros Guías 🌴',
      subtitle: 'Staff oficial de Tour Azul · ¡Listos y equipados para tu escapada perfecta!',
      badge: 'FOTO 1 · STAFF MORROCOY'
    },
    guias2: {
      src: '/Guias2.jpg',
      title: 'Buena Vibra & Sonrisas ☀️',
      subtitle: 'Guías de Tour Azul · Compromiso, puntualidad, energía y la mejor atención en ruta.',
      badge: 'FOTO 2 · EQUIPO TOUR AZUL'
    }
  };

  let currentRetroPhotoKey = 'guias1';

  function openRetroPhotoModal(photoKey) {
    const photo = RETRO_PHOTOS_DATA[photoKey] || RETRO_PHOTOS_DATA.guias1;
    currentRetroPhotoKey = photoKey;

    const modal = document.getElementById('modal-retro-photo');
    const card = document.getElementById('retro-photo-modal-card');
    const img = document.getElementById('retro-modal-image');
    const title = document.getElementById('retro-photo-modal-title');
    const subtitle = document.getElementById('retro-photo-modal-subtitle');
    const badge = document.getElementById('retro-modal-badge');

    if (!modal) return;

    img.src = photo.src;
    img.alt = photo.title;
    title.textContent = photo.title;
    subtitle.textContent = photo.subtitle;
    badge.textContent = photo.badge;

    updateRetroSwitchButtons(photoKey);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Animación suave de apertura
    setTimeout(() => {
      card.classList.remove('scale-95', 'opacity-0');
      card.classList.add('scale-100', 'opacity-100');
    }, 10);

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function switchRetroPhoto(photoKey) {
    const photo = RETRO_PHOTOS_DATA[photoKey];
    if (!photo) return;
    currentRetroPhotoKey = photoKey;

    const img = document.getElementById('retro-modal-image');
    const title = document.getElementById('retro-photo-modal-title');
    const subtitle = document.getElementById('retro-photo-modal-subtitle');
    const badge = document.getElementById('retro-modal-badge');

    // Suave transición de desvanecimiento
    img.style.opacity = '0.3';
    setTimeout(() => {
      img.src = photo.src;
      img.alt = photo.title;
      title.textContent = photo.title;
      subtitle.textContent = photo.subtitle;
      badge.textContent = photo.badge;
      img.style.opacity = '1';
    }, 150);

    updateRetroSwitchButtons(photoKey);
  }

  function updateRetroSwitchButtons(activeKey) {
    const btn1 = document.getElementById('btn-switch-guias1');
    const btn2 = document.getElementById('btn-switch-guias2');
    if (btn1 && btn2) {
      if (activeKey === 'guias1') {
        btn1.className = 'px-3 py-1.5 text-xs font-bold rounded-lg border border-tour-blue bg-blue-50 text-tour-blue transition flex items-center gap-1 shadow-xs';
        btn2.className = 'px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-sky-50 text-slate-700 transition flex items-center gap-1';
      } else {
        btn2.className = 'px-3 py-1.5 text-xs font-bold rounded-lg border border-tour-blue bg-blue-50 text-tour-blue transition flex items-center gap-1 shadow-xs';
        btn1.className = 'px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-sky-50 text-slate-700 transition flex items-center gap-1';
      }
    }
  }

  function closeRetroPhotoModal() {
    const modal = document.getElementById('modal-retro-photo');
    const card = document.getElementById('retro-photo-modal-card');
    if (!modal) return;

    card.classList.add('scale-95', 'opacity-0');
    card.classList.remove('scale-100', 'opacity-100');

    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }, 250);
  }

  // Cerrar al hacer clic en el backdrop
  document.getElementById('modal-retro-photo')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-retro-photo') {
      closeRetroPhotoModal();
    }
  });

  // Cerrar o navegar con teclado
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('modal-retro-photo');
    if (modal && !modal.classList.contains('hidden')) {
      if (e.key === 'Escape') {
        closeRetroPhotoModal();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        switchRetroPhoto(currentRetroPhotoKey === 'guias1' ? 'guias2' : 'guias1');
      }
    }
  });
`;
