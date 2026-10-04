/**
 * TOUR AZUL - OPINIONES Y SORTEO MENSUAL
 * Módulo de cliente y plantillas HTML para reseñas, bases de sorteo y panel de administración
 */

export const PREMIO_DEL_MES = "un detalle de Tour Azul";

export const BASES_SORTEO = `
1. Premio del mes: Participas por un detalle de Tour Azul, que se da a conocer al ganador.
2. Quiénes participan: Participan todos los viajeros del mes que dejen una opinión aprobada en la plataforma, sea positiva o no (el sorteo no depende de la calificación asignada).
3. Límite de participación: Se permite un máximo de una (1) participación por persona (número de teléfono verificado) por mes.
4. Fecha y modalidad: El sorteo se lleva a cabo el último día de cada mes mediante selección digital 100% aleatoria.
5. Notificación y anuncio: El ganador será contactado directamente vía WhatsApp y anunciado públicamente en nuestra cuenta oficial de Instagram (@eltourazul).
6. Condiciones generales: Tour Azul se reserva el derecho de descalificar comentarios con lenguaje ofensivo, difamatorio o con datos de viaje falsos.
`;

export const opinionsHtmlSection = `
    <!-- SECCIÓN LO QUE DICEN NUESTROS VIAJEROS -->
    <section id="opiniones" class="py-16 bg-white border-t border-sky-100">
      <div class="max-w-6xl mx-auto px-4">
        
        <!-- Encabezado de la Sección -->
        <div class="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-tour-blue text-xs font-bold uppercase tracking-wider">
            <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
            <span>Experiencias Reales</span>
          </span>
          <h2 class="font-title font-black italic text-3xl md:text-4xl uppercase text-tour-navy">
            Lo que dicen nuestros viajeros
          </h2>
          <p class="text-xs md:text-sm text-slate-500">
            Opiniones 100% reales de personas que ya vivieron su escapada con Tour Azul.
          </p>

          <!-- Resumen de Calificación y Estrellas -->
          <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-2xs">
              <span id="reviews-avg-rating" class="font-title font-black text-xl text-amber-900">5.0</span>
              <div class="flex text-amber-400 text-sm">
                <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
                <i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>
              </div>
              <span class="text-slate-300">·</span>
              <span id="reviews-total-count" class="text-xs font-bold text-slate-600">3 opiniones verificadas</span>
            </div>
            <span class="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-2xl border border-emerald-200 font-semibold">
              <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
              <span>Viajeros Verificados</span>
            </span>
          </div>
        </div>

        <!-- Contenedor del Carrusel Deslizable -->
        <div class="relative group">
          <!-- Botones de Navegación del Carrusel -->
          <button type="button" id="btn-carousel-prev" onclick="scrollOpinionsCarousel(-1)" class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-tour-navy border border-sky-200 shadow-lg flex items-center justify-center transition active:scale-95 cursor-pointer hidden md:flex">
            <i data-lucide="chevron-left" class="w-5 h-5"></i>
          </button>
          <button type="button" id="btn-carousel-next" onclick="scrollOpinionsCarousel(1)" class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-tour-navy border border-sky-200 shadow-lg flex items-center justify-center transition active:scale-95 cursor-pointer hidden md:flex">
            <i data-lucide="chevron-right" class="w-5 h-5"></i>
          </button>

          <!-- Carrusel Deslizable con Snap -->
          <div id="opinions-carousel" class="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 px-1 no-scrollbar">
            <!-- Las tarjetas se generan dinámicamente -->
          </div>
        </div>

        <!-- Banner Llamativo para Opinar y Participar en el Sorteo -->
        <div class="mt-10 rounded-3xl p-6 md:p-8 bg-gradient-to-r from-[#0B2A6B] via-[#1F3FE0] to-[#22C3D6] text-white shadow-xl relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="space-y-2 text-center md:text-left max-w-xl">
              <span class="inline-block px-3 py-1 rounded-full bg-tour-yellow text-tour-navy font-black text-xs uppercase tracking-wider shadow-sm">
                Sorteo Mensual Tour Azul
              </span>
              <h3 class="font-title font-black text-xl md:text-2xl uppercase tracking-tight leading-snug">
                🎁 Deja tu opinión y participa por un detalle de Tour Azul
              </h3>
              <p class="text-xs md:text-sm text-sky-100 font-medium leading-relaxed">
                Cuéntanos tu experiencia de viaje. Tu opinión nos ayuda a mejorar y cada mes premiamos a uno de nuestros viajeros aleatoriamente.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <button type="button" onclick="openOpinionModal()" class="w-full sm:w-auto px-6 py-3.5 rounded-full bg-tour-yellow hover:bg-yellow-400 text-tour-navy font-title font-black uppercase text-xs tracking-wider shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                <i data-lucide="message-circle" class="w-4 h-4"></i>
                <span>Cuéntanos tu experiencia</span>
              </button>
              <button type="button" onclick="openBasesSorteoModal()" class="w-full sm:w-auto px-5 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/30 backdrop-blur-md transition cursor-pointer text-center">
                Ver bases del sorteo
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
`;

export const opinionsModalsHtml = `
  <!-- MODAL DE FORMULARIO DE OPINIÓN (PANTALLA COMPLETA EN MÓVIL) -->
  <div id="modal-opinion" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-0 md:p-4">
    <div class="bg-white w-full max-w-lg h-full md:h-auto md:max-h-[92vh] rounded-none md:rounded-3xl flex flex-col overflow-hidden shadow-2xl relative border border-sky-100">
      
      <!-- Encabezado del Modal -->
      <div class="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 via-blue-50/40 to-white">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <i data-lucide="star" class="w-5 h-5 fill-amber-400"></i>
          </div>
          <div>
            <h3 class="font-title font-black uppercase text-tour-navy text-base md:text-lg leading-tight">
              Tu Opinión Cuenta ⭐
            </h3>
            <span class="text-xs text-slate-500 font-medium">Comparte tu experiencia de viaje con Tour Azul</span>
          </div>
        </div>
        <button type="button" onclick="closeOpinionModal()" class="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Vista 1: Formulario de Opinión -->
      <div id="opinion-form-view" class="p-4 md:p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-700 flex-grow">
        
        <!-- Selector de Estrellas Interactivo (1 al 5) -->
        <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
          <label class="block font-title font-bold text-tour-navy text-xs uppercase">
            ¿Cómo calificarías tu viaje? *
          </label>
          <div id="stars-selector-container" class="flex items-center justify-center gap-2 py-1">
            <!-- 5 Estrellas -->
          </div>
          <div id="rating-label-text" class="text-xs font-bold text-amber-800 transition">
            ¡Excelente! Me encantó
          </div>
        </div>

        <!-- Selector de Viaje y Fecha -->
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label class="block text-slate-700 font-bold">Viaje y fecha de salida *</label>
            <span id="opinion-trip-locked-badge" class="hidden text-[10px] font-bold text-tour-blue bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
              Fijado desde enlace directo 🔒
            </span>
          </div>
          <select id="opinion-viaje-select" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none bg-white text-xs text-slate-700 font-medium">
            <option value="">Selecciona tu viaje...</option>
          </select>
        </div>

        <!-- Datos del Viajero -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-700 font-bold mb-1">Nombre y Apellido *</label>
            <input type="text" id="opinion-nombre" placeholder="Ej. Carlos Pérez" required class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none text-xs">
            <span class="text-[10px] text-slate-400 block mt-0.5">En la web se mostrará: Carlos P.</span>
          </div>

          <div>
            <label class="block text-slate-700 font-bold mb-1">Teléfono con el que reservó *</label>
            <input type="tel" id="opinion-telefono" placeholder="Ej. 04121234567" required class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none text-xs">
            <span class="text-[10px] text-slate-400 block mt-0.5">Para validar tu reserva y contactarte</span>
          </div>
        </div>

        <!-- Comentario (Máximo 300 Caracteres) -->
        <div class="space-y-1">
          <div class="flex justify-between items-center">
            <label class="block text-slate-700 font-bold">Tu comentario *</label>
            <span class="text-[11px] text-slate-400 font-mono"><span id="opinion-char-count">0</span> / 300</span>
          </div>
          <textarea id="opinion-comentario" rows="3" maxlength="300" placeholder="¿Qué tal fue la atención, el transporte, la puntualidad y el destino? Cuéntanos..." required class="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none text-xs leading-relaxed resize-none"></textarea>
        </div>

        <!-- Foto OPCIONAL con Redimensión Canvas -->
        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-slate-700 font-bold">Foto del viaje (opcional)</label>
            <span class="text-[10px] text-slate-400">Máx. 1000 px · JPG optimizado</span>
          </div>

          <!-- Botón Seleccionar Foto -->
          <div id="photo-upload-controls" class="flex items-center gap-3">
            <input type="file" id="opinion-foto-input" accept="image/*" class="hidden">
            <button type="button" onclick="document.getElementById('opinion-foto-input').click()" class="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-tour-blue text-tour-navy font-bold text-xs flex items-center gap-2 shadow-2xs transition active:scale-95 cursor-pointer">
              <i data-lucide="camera" class="w-4 h-4 text-tour-blue"></i>
              <span id="btn-foto-text">Agregar foto (opcional)</span>
            </button>
          </div>

          <!-- Preview de Foto Redimensionada -->
          <div id="opinion-photo-preview-wrap" class="hidden flex items-center gap-3 pt-2">
            <div class="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-slate-100">
              <img id="opinion-photo-preview" src="" alt="Foto" class="w-full h-full object-cover">
            </div>
            <div class="space-y-1 flex-grow">
              <span class="text-xs font-semibold text-slate-700 block">Foto lista para adjuntar</span>
              <button type="button" onclick="removeOpinionPhoto()" class="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                <span>Quitar foto</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Casillas de Verificación Obligatoria y Sorteo -->
        <div class="space-y-2 pt-1 border-t border-slate-100">
          <label class="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" id="opinion-check-autorizo" class="mt-0.5 rounded border-slate-300 text-tour-blue focus:ring-tour-blue">
            <span class="text-[11px] text-slate-600 font-medium">
              Autorizo publicar mi comentario y mi foto en la página web de Tour Azul *
            </span>
          </label>

          <label class="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" id="opinion-check-sorteo" checked class="mt-0.5 rounded border-slate-300 text-tour-blue focus:ring-tour-blue">
            <span class="text-[11px] text-tour-navy font-bold">
              🎁 Quiero participar en el sorteo del mes por un detalle de Tour Azul
            </span>
          </label>
        </div>

        <!-- Alerta de Modo Demo Discreta -->
        <div id="opinion-demo-notice" class="hidden p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
          <i data-lucide="info" class="w-4 h-4 text-amber-600 shrink-0"></i>
          <span>Modo demo: Se simulará el registro de tu opinión sin conexión a Google Sheets.</span>
        </div>

        <div id="opinion-error-msg" class="hidden p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"></div>

      </div>

      <!-- Vista 2: Pantalla de Gracias con Confeti -->
      <div id="opinion-success-view" class="hidden p-6 md:p-8 text-center space-y-4 flex-grow flex flex-col items-center justify-center">
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
          <i data-lucide="party-popper" class="w-8 h-8"></i>
        </div>
        <div class="space-y-1.5 max-w-sm">
          <h4 class="font-title font-black text-xl text-tour-navy uppercase">
            ¡Muchas gracias por tu opinión!
          </h4>
          <p class="text-xs text-slate-600 leading-relaxed">
            Tu comentario ha sido recibido y quedará visible en la web una vez verificado por nuestro equipo.
          </p>
          <div class="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-bold mt-2">
            🎉 ¡Ya estás participando en el sorteo de este mes por un detalle de Tour Azul!
          </div>
        </div>
        <button type="button" onclick="closeOpinionModalAndScrollTrips()" class="px-6 py-3 rounded-full bg-tour-blue hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition active:scale-95 cursor-pointer">
          Ver otros viajes
        </button>
      </div>

      <!-- Barra Inferior Fija del Formulario -->
      <div id="opinion-footer-bar" class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
        <button type="button" onclick="closeOpinionModal()" class="px-4 py-2.5 text-xs text-slate-500 hover:text-tour-navy font-bold transition cursor-pointer">
          Cancelar
        </button>
        <button type="button" id="btn-submit-opinion" onclick="submitOpinionForm()" class="px-6 py-2.5 rounded-xl bg-tour-blue hover:bg-blue-700 text-white font-title font-black uppercase text-xs tracking-wider shadow-md transition flex items-center gap-2 cursor-pointer">
          <span>Enviar mi opinión</span>
          <i data-lucide="send" class="w-3.5 h-3.5"></i>
        </button>
      </div>

    </div>
  </div>

  <!-- MODAL DE BASES DEL SORTEO -->
  <div id="modal-bases-sorteo" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 md:p-4">
    <div class="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative border border-sky-100">
      
      <!-- Encabezado del Modal -->
      <div class="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 via-sky-50 to-white">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <i data-lucide="gift" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-title font-black uppercase text-tour-navy text-base md:text-lg leading-tight">
              Bases del Sorteo Mensual 🎁
            </h3>
            <span class="text-xs text-slate-500 font-medium">Tour Azul · Transparencia y premiación</span>
          </div>
        </div>
        <button type="button" onclick="closeBasesSorteoModal()" class="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Contenido de las Bases -->
      <div class="p-4 md:p-6 overflow-y-auto space-y-3.5 text-xs leading-relaxed text-slate-700">
        
        <div class="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300 text-amber-950 font-bold text-center">
          Premio del mes: <span class="text-tour-blue underline font-black">un detalle de Tour Azul</span>
        </div>

        <div class="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">
          <span class="font-bold text-tour-navy block text-xs">1. ¿Cuál es el premio?</span>
          <p>Participas por un detalle de Tour Azul, que se da a conocer directamente al ganador al concluir la selección.</p>
        </div>

        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span class="font-bold text-tour-navy block text-xs">2. ¿Quiénes participan?</span>
          <p>Participan los viajeros del mes que dejen una opinión aprobada en la web, sea positiva o no (el sorteo no depende de la calificación asignada).</p>
        </div>

        <div class="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">
          <span class="font-bold text-tour-navy block text-xs">3. Límite de participación</span>
          <p>Una (1) participación por persona (número de teléfono registrado) por mes.</p>
        </div>

        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span class="font-bold text-tour-navy block text-xs">4. Fecha del sorteo</span>
          <p>El sorteo se realiza el último día del mes mediante selección digital 100% aleatoria.</p>
        </div>

        <div class="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">
          <span class="font-bold text-tour-navy block text-xs">5. Contacto y anuncio oficial</span>
          <p>El ganador se contacta directamente por WhatsApp y se anuncia públicamente en nuestra cuenta oficial de Instagram (@eltourazul).</p>
        </div>

        <div class="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
          <span class="font-bold text-rose-950 block text-xs">6. Validación</span>
          <p class="text-rose-900">Tour Azul puede descalificar comentarios con lenguaje ofensivo, difamatorio o con datos de viaje no verificables.</p>
        </div>

      </div>

      <!-- Pie del Modal -->
      <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
        <button type="button" onclick="closeBasesSorteoModal()" class="px-6 py-2.5 rounded-xl bg-tour-blue hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm cursor-pointer">
          Entendido
        </button>
      </div>

    </div>
  </div>

  <!-- PANTALLA COMPLETA DE ADMINISTRACIÓN DEL SORTEO (?admin=sorteo) -->
  <div id="admin-sorteo-screen" class="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md hidden flex-col items-center justify-start overflow-y-auto p-4 md:p-6 text-slate-800">
    <div class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-sky-100 flex flex-col">
      
      <!-- Barra Superior Admin -->
      <div class="p-4 md:p-5 border-b border-slate-100 bg-gradient-to-r from-tour-navy via-[#1F3FE0] to-tour-caribe text-white flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md">
            <i data-lucide="award" class="w-6 h-6 text-tour-yellow"></i>
          </div>
          <div>
            <h2 class="font-title font-black uppercase text-base md:text-lg leading-tight">
              Sorteo Mensual · Panel Admin
            </h2>
            <span class="text-xs text-sky-100 font-medium">Tour Azul · Selección oficial del ganador</span>
          </div>
        </div>
        <button type="button" onclick="exitAdminSorteo()" class="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer">
          <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
          <span class="hidden sm:inline">Volver a la web</span>
        </button>
      </div>

      <!-- Estado A: Puerta de Clave de Administrador -->
      <div id="admin-gate-view" class="p-6 md:p-8 space-y-5 text-center">
        <div class="w-14 h-14 rounded-2xl bg-sky-50 text-tour-blue mx-auto flex items-center justify-center">
          <i data-lucide="lock" class="w-7 h-7"></i>
        </div>
        <div class="space-y-1">
          <h3 class="font-title font-bold text-lg text-tour-navy uppercase">Autenticación Requerida</h3>
          <p class="text-xs text-slate-500 max-w-md mx-auto">
            Ingresa la clave de administrador para acceder a la ruleta del sorteo mensual. La clave se verifica en el servidor.
          </p>
        </div>

        <form id="admin-login-form" onsubmit="handleAdminLogin(event)" class="max-w-xs mx-auto space-y-3">
          <input type="password" id="admin-password-input" placeholder="Clave de administrador" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-tour-blue focus:outline-none text-xs text-center font-mono">
          <button type="submit" id="btn-admin-login" class="w-full py-2.5 rounded-xl bg-tour-blue hover:bg-blue-700 text-white font-title font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer">
            Ingresar al sorteo
          </button>
        </form>

        <div id="admin-demo-fast-access" class="hidden pt-2 border-t border-slate-100">
          <span class="text-[11px] text-amber-700 font-medium block mb-2">Modo demo activo · Sin conexión al Webhook</span>
          <button type="button" onclick="startDemoAdminSorteo()" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow transition cursor-pointer">
            Entrar con participantes de ejemplo
          </button>
        </div>

        <div id="admin-login-error" class="hidden text-xs text-rose-600 font-bold"></div>
      </div>

      <!-- Estado B: Ruleta y Panel del Sorteo -->
      <div id="admin-panel-view" class="hidden p-4 md:p-6 space-y-6">
        
        <!-- Info del Mes y Conteo -->
        <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-sky-50/80 border border-sky-200">
          <div>
            <span class="text-[11px] text-slate-500 block">Sorteo del mes:</span>
            <span id="sorteo-mes-label" class="font-title font-black text-sm text-tour-navy uppercase">--</span>
          </div>
          <div class="text-right">
            <span class="text-[11px] text-slate-500 block">Participantes elegibles:</span>
            <span id="sorteo-participantes-count" class="font-title font-black text-sm text-emerald-700">0</span>
          </div>
        </div>

        <!-- Ruleta Gráfica Interactiva Canvas -->
        <div class="flex flex-col items-center justify-center space-y-4 py-2">
          
          <div class="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
            <!-- Puntero Arriba -->
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-20 drop-shadow-md">
              <div class="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-tour-yellow"></div>
            </div>

            <!-- Canvas de la Ruleta -->
            <canvas id="roulette-canvas" width="400" height="400" class="w-full h-full rounded-full shadow-2xl border-4 border-white"></canvas>

            <!-- Centro de la Ruleta -->
            <div class="absolute w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-xl border-2 border-tour-navy flex items-center justify-center z-10 pointer-events-none">
              <span class="font-title font-black italic text-[10px] md:text-xs text-tour-navy text-center leading-tight">
                TOUR<br>AZUL
              </span>
            </div>
          </div>

          <!-- Botón de Giro -->
          <div class="pt-2 text-center space-y-2">
            <button type="button" id="btn-spin-roulette" onclick="spinRoulette()" class="px-8 py-3.5 rounded-full bg-gradient-to-r from-tour-yellow to-amber-400 hover:from-yellow-400 hover:to-amber-500 text-tour-navy font-title font-black uppercase text-sm tracking-wider shadow-xl hover:shadow-2xl transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              🎰 Girar Ruleta
            </button>
            <p id="roulette-status-text" class="text-xs text-slate-500 font-medium">
              El ganador es elegido al azar por el servidor.
            </p>
          </div>
        </div>

        <!-- Tarjeta del Ganador -->
        <div id="admin-winner-card" class="hidden p-5 rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-sky-50 border-2 border-tour-yellow shadow-lg space-y-3 animate-float">
          <div class="flex items-center justify-between border-b border-amber-200/80 pb-2">
            <div class="flex items-center gap-2">
              <span class="text-2xl">🏆</span>
              <div>
                <span class="text-[10px] uppercase tracking-wider font-bold text-amber-800 block">Ganador Oficial del Sorteo</span>
                <h4 id="winner-name" class="font-title font-black text-lg text-tour-navy">--</h4>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] uppercase">
              Premio: Un detalle
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <span class="text-slate-400 block text-[10px]">Viaje realizado:</span>
              <span id="winner-viaje" class="font-semibold text-slate-700">--</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Teléfono (Privado Admin):</span>
              <span id="winner-phone" class="font-mono font-bold text-tour-blue">--</span>
            </div>
          </div>

          <div class="p-3 bg-white/90 rounded-2xl border border-amber-200/60 text-xs italic text-slate-600">
            "<span id="winner-comment">--</span>"
          </div>

          <div class="pt-2 flex flex-wrap items-center justify-between gap-2">
            <a id="winner-whatsapp-btn" href="#" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow transition">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>Contactar por WhatsApp</span>
            </a>

            <button type="button" onclick="confirmResetDraw()" class="text-xs text-rose-600 hover:text-rose-700 font-bold underline cursor-pointer">
              Repetir sorteo
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
`;

export const opinionsClientCode = `
    // =========================================================================
    // SISTEMA DE OPINIONES Y SORTEO MENSUAL TOUR AZUL
    // =========================================================================

    const PREMIO_DEL_MES = "un detalle de Tour Azul";

    const BASES_SORTEO = \`
1. Premio del mes: Participas por un detalle de Tour Azul, que se da a conocer al ganador.
2. Quiénes participan: Participan todos los viajeros del mes que dejen una opinión aprobada en la plataforma, sea positiva o no (el sorteo no depende de la calificación asignada).
3. Límite de participación: Se permite un máximo de una (1) participación por persona (número de teléfono verificado) por mes.
4. Fecha y modalidad: El sorteo se lleva a cabo el último día de cada mes mediante selección digital 100% aleatoria.
5. Notificación y anuncio: El ganador será contactado directamente vía WhatsApp y anunciado públicamente en nuestra cuenta oficial de Instagram (@eltourazul).
6. Condiciones generales: Tour Azul se reserva el derecho de descalificar comentarios con lenguaje ofensivo, difamatorio o con datos de viaje falsos.
    \`;

    // Array de comentarios en Modo Demo
    const COMENTARIOS_DEMO = [
      {
        id: "demo-com-1",
        nombre: "Mariana R.",
        telefono: "04121234567",
        calificacion: 5,
        comentario: "¡La mejor experiencia de viaje! La puntualidad del autobús en el Monumental de Barquisimeto fue impecable y las atenciones en Cayo Muerto insuperables. ¡100% recomendados!",
        destino: "Cayo Muerto",
        fechaViaje: "2026-10-03",
        fechaTexto: "03/10/2026",
        verificado: true,
        fotoUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
        participaSorteo: true,
        esEjemplo: true
      },
      {
        id: "demo-com-2",
        nombre: "Alejandro M.",
        telefono: "04149876543",
        calificacion: 5,
        comentario: "El viaje a Colonia Tovar superó todas nuestras expectativas. El bus súper cómodo con buen aire acondicionado y el guía muy atento en todo momento. ¡Ya planeando el próximo!",
        destino: "Colonia Tovar",
        fechaViaje: "2026-10-04",
        fechaTexto: "04/10/2026",
        verificado: true,
        fotoUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80",
        participaSorteo: true,
        esEjemplo: true
      },
      {
        id: "demo-com-3",
        nombre: "Valentina S.",
        telefono: "04165551234",
        calificacion: 5,
        comentario: "Increíble día en Morrocoy. Todo súper organizado desde la recogida en la Redoma de Cabudare. La lancha puntual y los cayos un paraíso total. ¡Tour Azul se ganó mi confianza!",
        destino: "Cayo Sombrero",
        fechaViaje: "2026-10-10",
        fechaTexto: "10/10/2026",
        verificado: true,
        fotoUrl: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&auto=format&fit=crop&q=80",
        participaSorteo: true,
        esEjemplo: true
      }
    ];

    let currentComentarios = [];
    let selectedOpinionRating = 5;
    let selectedOpinionPhotoBase64 = null;
    let lockedTripId = null;

    // Helper: generar slug legible (destino-fecha)
    function generateSalidaSlug(destino, fecha) {
      if (!destino || !fecha) return "";
      const clean = destino
        .toLowerCase()
        .normalize("NFD").replace(/[\\u0300-\\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return \`\${clean}-\${fecha}\`;
    }

    // Inicializar sistema de comentarios y verificar URLs (?opinar= y ?admin=sorteo)
    function initOpinionsSystem() {
      renderStarsRatingSelector();
      populateOpinionTripSelector();
      loadComentarios();

      const urlParams = new URLSearchParams(window.location.search);
      const opinarSlug = urlParams.get("opinar");
      if (opinarSlug) {
        handleDirectOpinionLink(opinarSlug);
      }

      if (urlParams.get("admin") === "sorteo") {
        showAdminSorteoScreen();
      }

      // Contador de caracteres en tiempo real
      const commentInput = document.getElementById("opinion-comentario");
      const charCounter = document.getElementById("opinion-char-count");
      if (commentInput && charCounter) {
        commentInput.addEventListener("input", () => {
          charCounter.textContent = commentInput.value.length;
        });
      }

      // Subida y procesamiento de foto con Canvas
      const photoInput = document.getElementById("opinion-foto-input");
      if (photoInput) {
        photoInput.addEventListener("change", handleOpinionPhotoSelected);
      }
    }

    // Cargar comentarios (desde Webhook si existe, o Modo Demo)
    async function loadComentarios() {
      if (WEBHOOK_URL) {
        try {
          const res = await fetch(\`\${WEBHOOK_URL}?accion=comentarios\`);
          const data = await res.json();
          if (data && data.ok && Array.isArray(data.comentarios) && data.comentarios.length > 0) {
            currentComentarios = data.comentarios;
            renderOpinionsCarousel(currentComentarios);
            return;
          }
        } catch (e) {
          console.warn("Fallo cargando opiniones del Webhook, usando demo:", e);
        }
      }

      // Fallback a demo
      currentComentarios = [...COMENTARIOS_DEMO];
      // Incluir opiniones locales guardadas en demo si existen
      try {
        const localSaved = JSON.parse(localStorage.getItem("tour_azul_opiniones_demo") || "[]");
        if (Array.isArray(localSaved) && localSaved.length > 0) {
          currentComentarios = [...localSaved, ...currentComentarios];
        }
      } catch (err) {}

      renderOpinionsCarousel(currentComentarios);
    }

    // Dibujar el Carrusel de Opiniones
    function renderOpinionsCarousel(reviews) {
      const carousel = document.getElementById("opinions-carousel");
      if (!carousel) return;

      if (!reviews || reviews.length === 0) {
        carousel.innerHTML = \`
          <div class="col-span-full py-8 text-center text-xs text-slate-400">
            Aún no hay opiniones aprobadas este mes. ¡Sé el primero en compartir la tuya!
          </div>
        \`;
        return;
      }

      // Actualizar promedio
      const totalStars = reviews.reduce((acc, r) => acc + (Number(r.calificacion) || 5), 0);
      const avg = (totalStars / reviews.length).toFixed(1);
      const avgEl = document.getElementById("reviews-avg-rating");
      const totalEl = document.getElementById("reviews-total-count");
      if (avgEl) avgEl.textContent = avg;
      if (totalEl) totalEl.textContent = \`\${reviews.length} opinione\${reviews.length === 1 ? '' : 's'} verificada\${reviews.length === 1 ? '' : 's'}\`;

      carousel.innerHTML = reviews.map(r => {
        const starsHtml = Array.from({ length: 5 }, (_, i) => {
          const filled = i < (r.calificacion || 5);
          return \`<i data-lucide="star" class="w-3.5 h-3.5 \${filled ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}"></i>\`;
        }).join("");

        const photoHtml = (r.fotoUrl || r.fotoBase64) ? \`
          <div class="mt-3 relative h-32 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
            <img src="\${r.fotoUrl || r.fotoBase64}" alt="Foto de \${r.nombre}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy">
          </div>
        \` : '';

        return \`
          <div class="w-80 md:w-96 shrink-0 snap-start bg-sky-50/40 rounded-3xl p-5 border border-sky-100 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1">
                  \${starsHtml}
                </div>
                \${r.esEjemplo ? \`
                  <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium text-[10px]">
                    Ejemplo
                  </span>
                \` : \`
                  <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <i data-lucide="check-circle" class="w-3 h-3 text-emerald-600"></i>
                    <span>Verificado</span>
                  </span>
                \`}
              </div>

              <p class="text-xs text-slate-700 leading-relaxed font-normal italic">
                "\${r.comentario}"
              </p>

              \${photoHtml}
            </div>

            <div class="pt-4 mt-3 border-t border-sky-100/70 flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-tour-blue text-white font-title font-bold text-xs flex items-center justify-center shrink-0">
                  \${r.nombre.charAt(0)}
                </div>
                <div>
                  <span class="font-bold text-tour-navy block text-xs">\${r.nombre}</span>
                  <span class="text-[10px] text-slate-400 block">\${r.destino} · \${r.fechaTexto || r.fechaViaje}</span>
                </div>
              </div>
            </div>
          </div>
        \`;
      }).join("");

      lucide.createIcons();
    }

    // Scroll manual del carrusel con flechas
    window.scrollOpinionsCarousel = function(dir) {
      const carousel = document.getElementById("opinions-carousel");
      if (carousel) {
        const offset = dir * 320;
        carousel.scrollBy({ left: offset, behavior: "smooth" });
      }
    };

    // Renderizar selector de 5 estrellas interactivas
    function renderStarsRatingSelector() {
      const container = document.getElementById("stars-selector-container");
      if (!container) return;

      container.innerHTML = [1, 2, 3, 4, 5].map(num => \`
        <button type="button" onclick="setOpinionRating(\${num})" class="p-1 transition-transform hover:scale-125 active:scale-95 focus:outline-none cursor-pointer" title="\${num} estrella\${num > 1 ? 's' : ''}">
          <i id="star-icon-\${num}" data-lucide="star" class="w-8 h-8 transition-colors \${num <= selectedOpinionRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}"></i>
        </button>
      \`).join("");

      lucide.createIcons();
      updateRatingLabel(selectedOpinionRating);
    }

    window.setOpinionRating = function(rating) {
      selectedOpinionRating = rating;
      for (let i = 1; i <= 5; i++) {
        const icon = document.getElementById(\`star-icon-\${i}\`);
        if (icon) {
          if (i <= rating) {
            icon.className = "w-8 h-8 transition-colors text-amber-400 fill-amber-400";
          } else {
            icon.className = "w-8 h-8 transition-colors text-slate-300";
          }
        }
      }
      updateRatingLabel(rating);
    };

    function updateRatingLabel(rating) {
      const label = document.getElementById("rating-label-text");
      if (!label) return;
      const texts = {
        1: "😞 Malo",
        2: "😐 Regular",
        3: "🙂 Bueno",
        4: "😊 Muy bueno",
        5: "🤩 ¡Excelente! Me encantó"
      };
      label.textContent = texts[rating] || "¡Excelente! Me encantó";
    }

    // Llenar selector de viajes disponibles
    function populateOpinionTripSelector() {
      const select = document.getElementById("opinion-viaje-select");
      if (!select) return;

      let optionsHtml = '<option value="">Selecciona tu viaje...</option>';
      VIAJES.forEach(v => {
        v.salidas.forEach(s => {
          const slug = generateSalidaSlug(v.destino, s.fecha);
          optionsHtml += \`<option value="\${slug}">\${v.destino} (\${s.fechaTexto})</option>\`;
        });
      });
      select.innerHTML = optionsHtml;
    }

    // Manejar enlace directo ?opinar=cayo-muerto-2026-10-03
    function handleDirectOpinionLink(slug) {
      const select = document.getElementById("opinion-viaje-select");
      const lockedBadge = document.getElementById("opinion-trip-locked-badge");
      if (!select) return;

      let matched = false;
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value === slug) {
          select.selectedIndex = i;
          matched = true;
          break;
        }
      }

      if (matched) {
        lockedTripId = slug;
        select.disabled = true;
        select.classList.add("bg-slate-100", "cursor-not-allowed");
        if (lockedBadge) lockedBadge.classList.remove("hidden");
        openOpinionModal();
      }
    }

    // Procesar foto seleccionada con redimensión Canvas a máx 1000px
    function handleOpinionPhotoSelected(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen válido.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1000;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Exportar en JPEG calidad 0.7 (menos de ~300 KB)
          const base64 = canvas.toDataURL("image/jpeg", 0.7);
          selectedOpinionPhotoBase64 = base64;

          // Mostrar vista previa
          const previewImg = document.getElementById("opinion-photo-preview");
          const previewWrap = document.getElementById("opinion-photo-preview-wrap");
          const btnText = document.getElementById("btn-foto-text");
          if (previewImg) previewImg.src = base64;
          if (previewWrap) previewWrap.classList.remove("hidden");
          if (btnText) btnText.textContent = "Cambiar foto";
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }

    window.removeOpinionPhoto = function() {
      selectedOpinionPhotoBase64 = null;
      const fileInput = document.getElementById("opinion-foto-input");
      const previewWrap = document.getElementById("opinion-photo-preview-wrap");
      const btnText = document.getElementById("btn-foto-text");
      if (fileInput) fileInput.value = "";
      if (previewWrap) previewWrap.classList.add("hidden");
      if (btnText) btnText.textContent = "Agregar foto (opcional)";
    };

    // Apertura y Cierre de Modales
    window.openOpinionModal = function() {
      const modal = document.getElementById("modal-opinion");
      const formView = document.getElementById("opinion-form-view");
      const successView = document.getElementById("opinion-success-view");
      const footerBar = document.getElementById("opinion-footer-bar");
      const demoNotice = document.getElementById("opinion-demo-notice");

      if (formView) formView.classList.remove("hidden");
      if (successView) successView.classList.add("hidden");
      if (footerBar) footerBar.classList.remove("hidden");

      if (!WEBHOOK_URL && demoNotice) {
        demoNotice.classList.remove("hidden");
      }

      if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        lucide.createIcons();
      }
    };

    window.closeOpinionModal = function() {
      const modal = document.getElementById("modal-opinion");
      if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    };

    window.closeOpinionModalAndScrollTrips = function() {
      closeOpinionModal();
      setTimeout(() => {
        const viajesEl = document.getElementById("viajes");
        if (viajesEl) {
          viajesEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    };

    window.openBasesSorteoModal = function() {
      const modal = document.getElementById("modal-bases-sorteo");
      if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        lucide.createIcons();
      }
    };

    window.closeBasesSorteoModal = function() {
      const modal = document.getElementById("modal-bases-sorteo");
      if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    };

    // Enviar Formulario de Opinión
    window.submitOpinionForm = async function() {
      const errorEl = document.getElementById("opinion-error-msg");
      if (errorEl) errorEl.classList.add("hidden");

      const selectViaje = document.getElementById("opinion-viaje-select");
      const viajeSlug = selectViaje ? selectViaje.value : "";
      const nombre = document.getElementById("opinion-nombre")?.value.trim() || "";
      const telefono = document.getElementById("opinion-telefono")?.value.trim() || "";
      const comentario = document.getElementById("opinion-comentario")?.value.trim() || "";
      const autorizo = document.getElementById("opinion-check-autorizo")?.checked || false;
      const participaSorteo = document.getElementById("opinion-check-sorteo")?.checked || false;

      // Validaciones
      if (!viajeSlug) {
        showOpinionError("Por favor selecciona el viaje que realizaste.");
        return;
      }
      if (!nombre) {
        showOpinionError("Por favor ingresa tu nombre y apellido.");
        return;
      }
      if (!telefono || telefono.length < 10) {
        showOpinionError("Por favor ingresa un número de teléfono válido (mínimo 10 dígitos).");
        return;
      }
      if (!comentario || comentario.length < 10) {
        showOpinionError("Por favor escribe tu opinión (mínimo 10 caracteres).");
        return;
      }
      if (!autorizo) {
        showOpinionError("Debes autorizar la publicación de tu comentario para continuar.");
        return;
      }

      // Obtener datos del viaje seleccionado
      let destinoNombre = "Viaje Tour Azul";
      let fechaViaje = "";
      let fechaTexto = "";
      VIAJES.forEach(v => {
        v.salidas.forEach(s => {
          if (generateSalidaSlug(v.destino, s.fecha) === viajeSlug) {
            destinoNombre = v.destino;
            fechaViaje = s.fecha;
            fechaTexto = s.fechaTexto;
          }
        });
      });

      // Crear nombre público (Primer nombre + inicial del apellido)
      const parts = nombre.split(" ");
      const primerNombre = parts[0] || nombre;
      const inicialApellido = parts[1] ? \` \${parts[1].charAt(0).toUpperCase()}.\` : "";
      const nombrePublico = \`\${primerNombre}\${inicialApellido}\`;

      // Validación de duplicado local en navegador
      const checkKey = \`opinion_\${telefono}_\${viajeSlug}\`;
      if (localStorage.getItem(checkKey)) {
        showOpinionError("Ya has registrado una opinión para este viaje con ese número telefónico.");
        return;
      }

      const btnSubmit = document.getElementById("btn-submit-opinion");
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = \`<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Enviando...</span>\`;
      }

      const payload = {
        accion: "comentario",
        viajeSlug: viajeSlug,
        destino: destinoNombre,
        fechaViaje: fechaViaje,
        fechaTexto: fechaTexto,
        nombre: nombre,
        nombrePublico: nombrePublico,
        telefono: telefono,
        calificacion: selectedOpinionRating,
        comentario: comentario,
        fotoBase64: selectedOpinionPhotoBase64 || "",
        autorizaPublicar: true,
        participaSorteo: participaSorteo,
        estado: "Pendiente"
      };

      if (WEBHOOK_URL) {
        try {
          const res = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
          });
          const result = await res.json();
          if (!result.ok) {
            showOpinionError(result.error || "No se pudo registrar la opinión.");
            if (btnSubmit) {
              btnSubmit.disabled = false;
              btnSubmit.innerHTML = \`<span>Enviar mi opinión</span><i data-lucide="send" class="w-3.5 h-3.5"></i>\`;
              lucide.createIcons();
            }
            return;
          }
        } catch (e) {
          console.warn("Error enviando al Webhook:", e);
        }
      } else {
        // Simulación en Modo Demo
        await new Promise(r => setTimeout(r, 600));
        // Guardar opinión localmente en demo
        try {
          const localList = JSON.parse(localStorage.getItem("tour_azul_opiniones_demo") || "[]");
          localList.unshift({
            id: \`demo-local-\${Date.now()}\`,
            nombre: nombrePublico,
            telefono: telefono,
            calificacion: selectedOpinionRating,
            comentario: comentario,
            destino: destinoNombre,
            fechaViaje: fechaViaje,
            fechaTexto: fechaTexto,
            verificado: true,
            fotoUrl: selectedOpinionPhotoBase64 || "",
            participaSorteo: participaSorteo,
            esEjemplo: false
          });
          localStorage.setItem("tour_azul_opiniones_demo", JSON.stringify(localList));
        } catch (err) {}
      }

      // Marcar enviado para evitar duplicados
      try {
        localStorage.setItem(checkKey, "true");
      } catch (e) {}

      // Mostrar pantalla de gracias con confeti
      const formView = document.getElementById("opinion-form-view");
      const successView = document.getElementById("opinion-success-view");
      const footerBar = document.getElementById("opinion-footer-bar");
      if (formView) formView.classList.add("hidden");
      if (footerBar) footerBar.classList.add("hidden");
      if (successView) successView.classList.remove("hidden");

      if (window.confetti) {
        confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
      }

      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = \`<span>Enviar mi opinión</span><i data-lucide="send" class="w-3.5 h-3.5"></i>\`;
      }
      lucide.createIcons();
    };

    function showOpinionError(msg) {
      const errorEl = document.getElementById("opinion-error-msg");
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.remove("hidden");
      } else {
        alert(msg);
      }
    }

    // =========================================================================
    // ADMINISTRACIÓN DEL SORTEO (?admin=sorteo) Y RULETA
    // =========================================================================

    let adminKeySession = "";
    let sorteoParticipantes = [];
    let rouletteAngle = 0;
    let isSpinningRoulette = false;

    function showAdminSorteoScreen() {
      const screen = document.getElementById("admin-sorteo-screen");
      if (!screen) return;
      screen.classList.remove("hidden");
      screen.classList.add("flex");
      document.body.style.overflow = "hidden";

      const demoFastAccess = document.getElementById("admin-demo-fast-access");
      if (!WEBHOOK_URL && demoFastAccess) {
        demoFastAccess.classList.remove("hidden");
      }

      lucide.createIcons();
    }

    window.exitAdminSorteo = function() {
      const screen = document.getElementById("admin-sorteo-screen");
      if (screen) {
        screen.classList.add("hidden");
        screen.classList.remove("flex");
      }
      document.body.style.overflow = "";

      // Quitar ?admin=sorteo de la URL sin recargar
      const url = new URL(window.location);
      url.searchParams.delete("admin");
      window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : ""));
    };

    window.handleAdminLogin = async function(e) {
      e.preventDefault();
      const input = document.getElementById("admin-password-input");
      const pass = input ? input.value.trim() : "";
      const errorEl = document.getElementById("admin-login-error");
      const btn = document.getElementById("btn-admin-login");

      if (errorEl) errorEl.classList.add("hidden");

      if (!pass) {
        if (errorEl) {
          errorEl.textContent = "Por favor ingresa la clave.";
          errorEl.classList.remove("hidden");
        }
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.textContent = "Verificando en el servidor...";
      }

      if (WEBHOOK_URL) {
        try {
          const res = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ accion: "sorteo_verificar_admin", clave: pass })
          });
          const data = await res.json();
          if (data && data.ok) {
            adminKeySession = pass;
            sorteoParticipantes = data.participantes || [];
            initRouletteView(data.participantes, data.ganadorPrevio);
            return;
          } else {
            if (errorEl) {
              errorEl.textContent = data.error || "Clave de administrador incorrecta.";
              errorEl.classList.remove("hidden");
            }
          }
        } catch (err) {
          if (errorEl) {
            errorEl.textContent = "Error al conectar con el servidor.";
            errorEl.classList.remove("hidden");
          }
        } finally {
          if (btn) {
            btn.disabled = false;
            btn.textContent = "Ingresar al sorteo";
          }
        }
      } else {
        // En modo demo, aceptar clave y cargar participantes demo
        startDemoAdminSorteo();
      }
    };

    window.startDemoAdminSorteo = function() {
      adminKeySession = "demo-admin";
      sorteoParticipantes = [
        { nombre: "Carlos Pérez", nombreCorto: "Carlos P.", telefono: "04121234567", destino: "Cayo Muerto", comentario: "Excelente servicio y puntualidad." },
        { nombre: "Mariana Rodríguez", nombreCorto: "Mariana R.", telefono: "04149876543", destino: "Cayo Muerto", comentario: "El mejor viaje que he tenido." },
        { nombre: "Alejandro Mendoza", nombreCorto: "Alejandro M.", telefono: "04165551234", destino: "Colonia Tovar", comentario: "Comodidad total en el autobús." },
        { nombre: "Valentina Sánchez", nombreCorto: "Valentina S.", telefono: "04245558899", destino: "Cayo Sombrero", comentario: "Morrocoy espectacular." },
        { nombre: "Luis Gómez", nombreCorto: "Luis G.", telefono: "04127773322", destino: "Choroní", comentario: "Las mejores curvas y playa." },
        { nombre: "Andrea Blanco", nombreCorto: "Andrea B.", telefono: "04142221100", destino: "Varadero", comentario: "Hermoso día en familia." }
      ];
      initRouletteView(sorteoParticipantes, null);
    };

    function initRouletteView(participantes, ganadorPrevio) {
      document.getElementById("admin-gate-view").classList.add("hidden");
      document.getElementById("admin-panel-view").classList.remove("hidden");

      const now = new Date();
      const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      const mesLabel = \`\${meses[now.getMonth()]} \${now.getFullYear()}\`;
      const mesKey = \`sorteo_\${now.getFullYear()}_\${now.getMonth() + 1}\`;

      document.getElementById("sorteo-mes-label").textContent = mesLabel;
      document.getElementById("sorteo-participantes-count").textContent = \`\${participantes.length} viajeros\`;

      // Comprobar si ya se realizó el sorteo este mes
      const savedDraw = ganadorPrevio || JSON.parse(localStorage.getItem(mesKey) || "null");
      if (savedDraw) {
        showWinnerCard(savedDraw);
        const spinBtn = document.getElementById("btn-spin-roulette");
        const statusText = document.getElementById("roulette-status-text");
        if (spinBtn) {
          spinBtn.disabled = true;
          spinBtn.textContent = "Sorteo Realizado";
        }
        if (statusText) {
          statusText.textContent = "El sorteo de este mes ya fue realizado con éxito.";
        }
      }

      drawRouletteWheel(0);
      lucide.createIcons();
    }

    // Dibujar la ruleta en el Canvas
    function drawRouletteWheel(currentRotationAngle) {
      const canvas = document.getElementById("roulette-canvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = centerX - 10;

      ctx.clearRect(0, 0, width, height);

      const count = Math.max(1, sorteoParticipantes.length);
      const arc = (2 * Math.PI) / count;

      // Colores de Tour Azul
      const colors = ["#0B2A6B", "#22C3D6", "#1F3FE0", "#FFCC00", "#0284C7", "#065F46"];

      for (let i = 0; i < count; i++) {
        const angle = currentRotationAngle + (i * arc);
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
        ctx.lineTo(centerX, centerY);
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Texto del participante
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = (colors[i % colors.length] === "#FFCC00") ? "#0B2A6B" : "#FFFFFF";
        ctx.font = "bold 13px Montserrat, sans-serif";
        const pName = (sorteoParticipantes[i]?.nombreCorto || sorteoParticipantes[i]?.nombre || \`Viajero \${i + 1}\`);
        ctx.fillText(pName, radius - 24, 5);
        ctx.restore();
      }
    }

    // Girar la Ruleta y Detenerla en el Ganador Elegido por el Servidor
    window.spinRoulette = async function() {
      if (isSpinningRoulette) return;
      if (sorteoParticipantes.length === 0) {
        alert("No hay participantes elegibles registrados para este mes.");
        return;
      }

      const spinBtn = document.getElementById("btn-spin-roulette");
      const statusText = document.getElementById("roulette-status-text");
      if (spinBtn) spinBtn.disabled = true;
      if (statusText) statusText.textContent = "Obteniendo ganador al azar desde el servidor...";

      isSpinningRoulette = true;

      let winningIndex = 0;
      let winnerData = null;

      const now = new Date();
      const mesKey = \`sorteo_\${now.getFullYear()}_\${now.getMonth() + 1}\`;

      // 1. Obtener el ganador desde el servidor (o demo)
      if (WEBHOOK_URL) {
        try {
          const res = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              accion: "sorteo_ganador",
              clave: adminKeySession,
              mesKey: mesKey,
              repetir: Boolean(window.sorteoRepetirActivo)
            })
          });
          const resData = await res.json();
          if (resData && !resData.ok && resData.yaSorteado) {
            isSpinningRoulette = false;
            if (spinBtn) {
              spinBtn.disabled = true;
              spinBtn.textContent = "Sorteo Realizado";
            }
            if (statusText) statusText.textContent = resData.error;
            if (resData.ganador) showWinnerCard(resData.ganador);
            return;
          }
          if (resData && resData.ok && resData.ganador) {
            winnerData = resData.ganador;
            winningIndex = resData.ganador.index || 0;
            window.sorteoRepetirActivo = false;
          }
        } catch (e) {
          console.warn("Error obteniendo ganador del servidor:", e);
        }
      }

      // Si es demo o falló la llamada
      if (!winnerData) {
        winningIndex = Math.floor(Math.random() * sorteoParticipantes.length);
        winnerData = sorteoParticipantes[winningIndex];
      }

      // 2. Calcular ángulo exacto para que el puntero (a 270 grados / 12 en punto) señale al ganador
      const count = sorteoParticipantes.length;
      const arc = (2 * Math.PI) / count;

      // El puntero está arriba en 12 en punto = 3*PI/2 rad (-PI/2)
      const pointerAngle = 1.5 * Math.PI;
      const targetSegmentCenter = (winningIndex * arc) + (arc / 2);
      
      // Número de vueltas completas para darle emoción (6 vueltas = 12*PI rad)
      const fullRotations = 6 * 2 * Math.PI;
      const finalAngle = fullRotations + (pointerAngle - targetSegmentCenter);

      const startTime = performance.now();
      const duration = 5000; // 5 segundos de animación que desacelera

      function animateSpin(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);

        // Curva cúbica de desaceleración suave (ease-out cubic)
        const ease = 1 - Math.pow(1 - progress, 3);
        rouletteAngle = ease * finalAngle;

        drawRouletteWheel(rouletteAngle);

        if (progress < 1) {
          requestAnimationFrame(animateSpin);
        } else {
          isSpinningRoulette = false;
          // Guardar para evitar sorteos duplicados en el mes
          localStorage.setItem(mesKey, JSON.stringify(winnerData));

          // Confeti y tarjeta del ganador
          if (window.confetti) {
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
          }
          showWinnerCard(winnerData);
          if (statusText) statusText.textContent = "¡Tenemos un ganador seleccionado!";
          if (spinBtn) {
            spinBtn.disabled = true;
            spinBtn.textContent = "Sorteo Realizado";
          }
        }
      }

      requestAnimationFrame(animateSpin);
    };

    function showWinnerCard(winner) {
      const card = document.getElementById("admin-winner-card");
      if (!card) return;

      document.getElementById("winner-name").textContent = winner.nombre || winner.nombreCorto || "Ganador";
      document.getElementById("winner-viaje").textContent = \`\${winner.destino || ''} · \${winner.fechaTexto || winner.fechaViaje || ''}\`;
      document.getElementById("winner-phone").textContent = winner.telefono || "No indicado";
      document.getElementById("winner-comment").textContent = winner.comentario || "Sin comentario";

      const waBtn = document.getElementById("winner-whatsapp-btn");
      if (waBtn && winner.telefono) {
        const cleanPhone = String(winner.telefono).replace(/[^0-9]/g, "");
        const waNumber = cleanPhone.startsWith("58") ? cleanPhone : ("58" + cleanPhone.replace(/^0/, ""));
        const msg = \`¡Hola \${winner.nombre || ''}! Te escribe el equipo de Tour Azul. ¡Muchas felicidades! Has resultado ganador de nuestro sorteo mensual por tu opinión en el viaje a \${winner.destino || ''}. Te has ganado un detalle de Tour Azul. 🎁🎉\`;
        waBtn.href = \`https://wa.me/\${waNumber}?text=\${encodeURIComponent(msg)}\`;
      }

      card.classList.remove("hidden");
      lucide.createIcons();
    }

    window.confirmResetDraw = function() {
      const conf = confirm("¿Estás seguro de que deseas repetir el sorteo de este mes? Esto anulará el resultado anterior.");
      if (!conf) return;

      window.sorteoRepetirActivo = true;
      const now = new Date();
      const mesKey = \`sorteo_\${now.getFullYear()}_\${now.getMonth() + 1}\`;
      localStorage.removeItem(mesKey);

      const card = document.getElementById("admin-winner-card");
      const spinBtn = document.getElementById("btn-spin-roulette");
      const statusText = document.getElementById("roulette-status-text");

      if (card) card.classList.add("hidden");
      if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.textContent = "🎰 Girar Ruleta";
      }
      if (statusText) statusText.textContent = "El ganador es elegido al azar por el servidor.";
    };
`;
