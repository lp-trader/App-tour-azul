/**
 * Módulo de Fotos Retro de Guías para Tour Azul
 * Renderiza dos fotos tipo polaroid decorativas de la fachada:
 * - Una a cada lado / esquina de la fachada, flanqueando la palabra "TOUR AZUL" (no arriba).
 * - Más pequeñas que el logo y de tamaño 100% uniforme.
 * - Sin zoom ni modal al hacer clic (no interactivas, meramente decorativas).
 * - Se mueven y desplazan al compás del scroll igual que el logo y el contenido del hero.
 */

export const retroPhotosCss = `
  /* Filtro y Estilos de Polaroid Retro para Fachada */
  .retro-polaroid-card {
    background-color: #FAF8F5;
    background-image: radial-gradient(circle at 50% 0%, #FFFFFF 0%, #FAF6EE 100%);
    box-shadow: 
      0 8px 20px -4px rgba(2, 23, 62, 0.3),
      0 12px 28px -8px rgba(0, 0, 0, 0.35),
      0 0 1px 1px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(226, 220, 208, 0.9);
    border-bottom: 2px solid rgba(198, 190, 175, 0.7);
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    will-change: transform;
    cursor: default;
    user-select: none;
  }

  /* Filtro de película retro analógica */
  .retro-film-filter {
    filter: sepia(0.12) contrast(1.06) brightness(1.02) saturate(1.12);
  }

  /* Cinta adhesiva vintage / washi tape */
  .washi-tape {
    background: linear-gradient(180deg, rgba(255, 250, 235, 0.85) 0%, rgba(254, 243, 199, 0.75) 100%);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    border-top: 1px solid rgba(245, 158, 11, 0.25);
    border-bottom: 1px solid rgba(245, 158, 11, 0.25);
    backdrop-filter: blur(2px);
  }

  /* Efecto de destello de luz analógica */
  .retro-light-leak {
    background: radial-gradient(circle at top right, rgba(255, 170, 70, 0.2) 0%, rgba(255, 110, 50, 0.06) 40%, transparent 70%);
  }

  /* Viñeta analógica en las esquinas de la foto */
  .retro-vignette {
    box-shadow: inset 0 0 18px rgba(0, 0, 0, 0.35);
  }

  /* Brillo reflectivo de papel fotográfico */
  .photo-sheen {
    background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, transparent 60%);
  }
`;

export const retroPhotosLeftHtml = `
  <!-- FOTO RETRO GUÍAS 1 (IZQUIERDA DEL LOGO - MÁS ARRIBA, MÁS PEQUEÑA QUE EL LOGO, SIN TAPAR NADA) -->
  <div class="relative select-none pointer-events-none transform -rotate-3 hover:rotate-0 transition-transform shrink-0">
    <!-- Cinta adhesiva vintage -->
    <div class="absolute -top-2 sm:-top-2.5 left-1/2 -translate-x-1/2 w-8 sm:w-11 md:w-14 h-2 sm:h-2.5 washi-tape rounded-xs z-30 pointer-events-none -rotate-2 border-x border-dashed border-amber-300/50"></div>
    
    <!-- Marco polaroid blanco (Más pequeña que el logo) -->
    <div class="retro-polaroid-card w-14 sm:w-18 md:w-22 p-1 sm:p-1.5 pb-1.5 sm:pb-2.5 rounded-sm sm:rounded-md shadow-lg opacity-95">
      <div class="relative w-full aspect-[3/4] bg-slate-900 rounded-[2px] overflow-hidden shadow-inner">
        <img 
          src="/Guias1.jpg" 
          alt="Nuestras Guías Tour Azul" 
          class="w-full h-full object-cover retro-film-filter"
          loading="eager"
        >
        <div class="absolute inset-0 retro-light-leak pointer-events-none"></div>
        <div class="absolute inset-0 retro-vignette pointer-events-none"></div>
        <div class="absolute inset-0 photo-sheen pointer-events-none"></div>
      </div>
      <div class="pt-1 px-0.5 text-center">
        <span class="font-script text-[8.5px] sm:text-xs md:text-sm text-slate-800 leading-tight block truncate">Nuestras Guías 🌴</span>
      </div>
    </div>
  </div>
`;

export const retroPhotosRightHtml = `
  <!-- FOTO RETRO GUÍAS 2: BUENA VIBRA (DERECHA DEL LOGO - MÁS ARRIBA, MÁS PEQUEÑA QUE EL LOGO, SIN TAPAR NADA) -->
  <div class="relative select-none pointer-events-none transform rotate-3 hover:rotate-0 transition-transform shrink-0">
    <!-- Cinta adhesiva vintage -->
    <div class="absolute -top-2 sm:-top-2.5 left-1/2 -translate-x-1/2 w-8 sm:w-11 md:w-14 h-2 sm:h-2.5 washi-tape rounded-xs z-30 pointer-events-none rotate-2 border-x border-dashed border-amber-300/50"></div>
    
    <!-- Marco polaroid blanco (Más pequeña que el logo) -->
    <div class="retro-polaroid-card w-14 sm:w-18 md:w-22 p-1 sm:p-1.5 pb-1.5 sm:pb-2.5 rounded-sm sm:rounded-md shadow-lg opacity-95">
      <div class="relative w-full aspect-[3/4] bg-slate-900 rounded-[2px] overflow-hidden shadow-inner">
        <img 
          src="/Guias2.jpg" 
          alt="Buena Vibra Tour Azul" 
          class="w-full h-full object-cover retro-film-filter"
          loading="eager"
        >
        <div class="absolute inset-0 retro-light-leak pointer-events-none"></div>
        <div class="absolute inset-0 retro-vignette pointer-events-none"></div>
        <div class="absolute inset-0 photo-sheen pointer-events-none"></div>
      </div>
      <div class="pt-1 px-0.5 text-center">
        <span class="font-script text-[8.5px] sm:text-xs md:text-sm text-slate-800 leading-tight block truncate">Buena Vibra ☀️</span>
      </div>
    </div>
  </div>
`;

export const retroPhotosHeroHtml = '';

// Sin modal para cumplir con el requisito de que no se pueda dar clic ni agrandar la foto
export const retroPhotosModalsHtml = '';

// Sin listeners ni modales interactivos
export const retroPhotosClientCode = `
  // Fotos retro de fachada: decorativas, no interactivas
`;
