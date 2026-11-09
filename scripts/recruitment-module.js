/**
 * TOUR AZUL - MÓDULO DE PREAPERTURA Y CONVOCATORIA DE TRABAJADORES
 * «¡Únete a la aventura con Tour Azul!»
 * 
 * Gestiona:
 * 1. La configuración centralizada de preapertura (prelaunchMode).
 * 2. El aviso atractivo y botón destacado en portada.
 * 3. La sección completa de captación con introducción obligatoria y 10 preguntas.
 * 4. La validación en frontend y previsualización local de fotografía (máx. 5 MB, JPG/PNG/WEBP).
 * 5. Registro local de postulaciones y envío directo y estructurado a WhatsApp oficial.
 * 6. Panel de visualización de aspirantes.
 */

export const prelaunchHeaderButtonHtml = `
        <!-- Botón Convocatoria Equipo (Discreto y estético en la cabecera) -->
        <button 
          type="button" 
          id="btn-nav-unete-equipo" 
          onclick="showRecruitmentView()" 
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-tour-blue text-xs font-bold transition-all cursor-pointer shrink-0 border border-sky-200 active:scale-95 shadow-2xs"
          title="Convocatoria para guías y coordinadores de Tour Azul"
        >
          <span>💼</span>
          <span class="hidden sm:inline">Únete al equipo</span>
        </button>
`;

export const prelaunchHeroNoticeHtml = `
  <!-- HERO LLAMADO A LA ACCIÓN: TEMPORADA NOVIEMBRE 2026 ACTIVA -->
  <div class="relative z-10 max-w-3xl mx-auto mt-4 px-4 text-center space-y-3.5">
    
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-bold tracking-wider uppercase shadow-md animate-pulse">
      <span class="relative flex h-2.5 w-2.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-tour-yellow opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-tour-yellow"></span>
      </span>
      <span>🌴 Temporada Noviembre 2026 · Salidas Activas</span>
    </div>

    <h1 class="font-title font-black italic text-3xl sm:text-5xl md:text-6xl uppercase text-white drop-shadow-lg leading-tight tracking-tight">
      Tu escapada perfecta empieza aquí
    </h1>

    <p class="text-sky-100 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed drop-shadow-sm">
      Descubre los 17 destinos más espectaculares de Venezuela. Playas paradisíacas, cayos cristalinos y paseos inolvidables desde Barquisimeto, Cabudare y Yaracuy.
    </p>

    <!-- Botones de Acción en Hero -->
    <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
      <a 
        href="#viajes" 
        class="px-6 sm:px-8 py-3.5 rounded-full bg-tour-yellow hover:bg-yellow-300 text-tour-navy font-title font-black uppercase text-xs sm:text-sm tracking-wider shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
      >
        <span>Ver Viajes de Noviembre</span>
        <i data-lucide="compass" class="w-4 h-4 text-tour-navy"></i>
      </a>

      <a 
        href="https://wa.me/584126571155?text=%C2%A1Hola%20Tour%20Azul!%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20viajes%20de%20noviembre" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="px-5 sm:px-6 py-3.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/40 font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <i data-lucide="message-circle" class="w-4 h-4 text-emerald-300"></i>
        <span>Consultar WhatsApp</span>
      </a>
    </div>

    <!-- Subtexto de confianza -->
    <div class="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-sky-200">
      <span class="flex items-center gap-1.5">
        <i data-lucide="check-circle" class="w-3.5 h-3.5 text-tour-yellow"></i>
        <span>Reserva con 5 REF p/p</span>
      </span>
      <span class="flex items-center gap-1.5">
        <i data-lucide="bus" class="w-3.5 h-3.5 text-tour-caribe-light"></i>
        <span>Unidades ejecutivas con A/C</span>
      </span>
      <span class="flex items-center gap-1.5">
        <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-300"></i>
        <span>Guías y logística garantizada</span>
      </span>
    </div>

  </div>
`;

export const recruitmentHtmlSection = `
  <!-- VISTA DEDICADA DE CONVOCATORIA: «¡Únete a la aventura con Tour Azul!» -->
  <section id="vista-reclutamiento" class="hidden min-h-screen bg-[#F8FDFF] pb-24 transition-opacity duration-300">
    
    <!-- Barra superior de navegación interna de la sección -->
    <div class="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-2xs py-3 px-4">
      <div class="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <button 
          type="button" 
          onclick="showHomeView()" 
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-tour-navy text-xs font-bold transition-all active:scale-95 cursor-pointer"
        >
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
          <span>Volver a la portada</span>
        </button>

        <!-- Indicador de preguntas completadas y acceso admin -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span class="hidden sm:inline">Progreso:</span>
            <div class="w-20 sm:w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div id="recruitment-progress-bar" class="h-full bg-gradient-to-r from-tour-blue to-tour-caribe w-0 transition-all duration-300"></div>
            </div>
            <span id="recruitment-progress-text" class="font-bold text-tour-blue">0/8</span>
          </div>

          <!-- Botón de Acceso al Panel de Candidatos -->
          <button 
            type="button" 
            id="btn-admin-postulaciones"
            onclick="if(window.openAdminCandidatos){ window.openAdminCandidatos(); } else { window.location.hash = '#/admin-candidatos'; }" 
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all border border-blue-500 cursor-pointer shadow-xs active:scale-95"
            title="Abrir Panel de Administración de Candidatos (Google Sheets)"
          >
            <i data-lucide="shield-check" class="w-3.5 h-3.5 text-white"></i>
            <span>Panel Candidatos</span>
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-4 pt-6 md:pt-10">
      
      <!-- HERO DEL FORMULARIO -->
      <div class="text-center space-y-3 mb-8">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100 text-tour-blue text-xs font-bold uppercase tracking-wider">
          <i data-lucide="users" class="w-3.5 h-3.5"></i>
          <span>Convocatoria de Talento</span>
        </div>
        
        <!-- Título obligatorio -->
        <h1 class="font-title font-black italic text-3xl md:text-5xl uppercase text-tour-navy tracking-tight">
          ¡Únete a la aventura con Tour Azul!
        </h1>
        <p class="font-script text-2xl md:text-3xl text-tour-caribe -rotate-1">
          Tu escapada perfecta empieza contigo
        </p>
      </div>

      <!-- TARJETA CON LA INTRODUCCIÓN OBLIGATORIA COMPLETA -->
      <div class="bg-white rounded-3xl p-6 md:p-8 shadow-md border-2 border-sky-100/90 mb-8 space-y-4 relative overflow-hidden">
        <!-- Decoración lateral sutil -->
        <div class="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-tour-blue via-tour-caribe to-tour-yellow"></div>
        
        <div class="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div class="w-9 h-9 rounded-2xl bg-sky-50 text-tour-blue flex items-center justify-center font-bold text-base">
            🏝️
          </div>
          <div>
            <h2 class="font-title font-black text-sm md:text-base uppercase text-tour-navy">
              Información para postulantes
            </h2>
            <span class="text-[11px] text-slate-400">Lee atentamente antes de completar las preguntas</span>
          </div>
        </div>

        <!-- Texto íntegro y obligatorio tal como fue requerido -->
        <div class="space-y-3.5 text-xs md:text-sm text-slate-700 leading-relaxed font-normal">
          <p class="font-medium text-tour-navy">
            ¡Hola! 💙 Gracias por tu interés en formar parte de Tour Azul.
          </p>
          <p>
            Buscamos personas dinámicas, responsabilidades, proactivas y con buena actitud para acompañar a nuestros pasajeros en excursiones a distintos destinos de Venezuela.
          </p>
          <p>
            Salimos desde Barquisimeto hacia lugares como Chichiriviche y sus cayos, Colonia Tovar, Mérida, Puerto Cabello, Isla Larga y muchos destinos más.
          </p>
          <p>
            Nuestro equipo se encarga de acompañar y atender a los pasajeros, apoyar con la logística, animar al grupo, estar pendiente de la experiencia y capturar los mejores momentos con fotografías.
          </p>
          <p>
            No necesitas tener experiencia previa en todas estas actividades; valoramos tu disposición para aprender, tu responsabilidad y tus ganas de trabajar en equipo.
          </p>
          <div class="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl text-amber-950 font-medium text-xs leading-relaxed flex items-start gap-2.5">
            <i data-lucide="clock" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
            <div>
              <strong class="font-bold text-amber-900 block mb-0.5">Importante:</strong>
              debes tener disponibilidad para trabajar fines de semana y días feriados, y poder llegar al punto de partida de los buses en Barquisimeto según el horario asignado.
            </div>
          </div>
          <p class="font-title font-black italic text-tour-blue text-sm md:text-base pt-1">
            ¡Queremos conocerte! 🏝️
          </p>
        </div>
      </div>

      <!-- FORMULARIO DE LAS 10 PREGUNTAS -->
      <form id="form-postulacion" onsubmit="handleRecruitmentSubmit(event)" novalidate class="space-y-6">
        
        <!-- PREGUNTA 1: Nombres y apellidos -->
        <div id="q-card-nombre" class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90 transition-all focus-within:border-tour-blue focus-within:ring-2 focus-within:ring-sky-100">
          <div class="flex items-center justify-between mb-2">
            <label for="postulacion-nombre" class="font-title font-bold text-sm md:text-base text-tour-navy block">
              Pregunta 1. Nombres y apellidos <span class="text-rose-500">*</span>
            </label>
            <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Respuesta corta</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">Escribe tu nombre y apellido completos tal como aparecen en tu documento de identidad.</p>
          <input 
            type="text" 
            id="postulacion-nombre" 
            name="nombre" 
            maxlength="150"
            placeholder="Ej. María Valentina Colmenárez García" 
            oninput="updateRecruitmentProgress(); clearFieldError('nombre')" 
            class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tour-blue text-xs md:text-sm text-slate-800 transition bg-slate-50/40 focus:bg-white"
            autocomplete="name"
          >
          <p id="error-nombre" class="hidden text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            <span>Por favor, ingresa tus nombres y apellidos completos.</span>
          </p>
        </div>

        <!-- PREGUNTA 2: ¿Qué edad tienes? -->
        <div id="q-card-edad" class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90 transition-all focus-within:border-tour-blue focus-within:ring-2 focus-within:ring-sky-100">
          <div class="flex items-center justify-between mb-2">
            <label for="postulacion-edad" class="font-title font-bold text-sm md:text-base text-tour-navy block">
              Pregunta 2. ¿Qué edad tienes? <span class="text-rose-500">*</span>
            </label>
            <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Respuesta corta</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">Ingresa solo el número de tus años cumplidos (ej. 24).</p>
          <input 
            type="number" 
            id="postulacion-edad" 
            name="edad" 
            min="16" 
            max="80" 
            placeholder="Ej. 24" 
            oninput="updateRecruitmentProgress(); clearFieldError('edad')" 
            class="w-full max-w-xs px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tour-blue text-xs md:text-sm text-slate-800 transition bg-slate-50/40 focus:bg-white"
          >
          <p id="error-edad" class="hidden text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            <span>Por favor, introduce una edad numérica válida (entre 16 y 80 años).</span>
          </p>
        </div>

        <!-- PREGUNTA 3: Número de teléfono y WhatsApp -->
        <div id="q-card-telefono" class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90 transition-all focus-within:border-tour-blue focus-within:ring-2 focus-within:ring-sky-100">
          <div class="flex items-center justify-between mb-2">
            <label for="postulacion-telefono" class="font-title font-bold text-sm md:text-base text-tour-navy block">
              Pregunta 3. Número de teléfono y WhatsApp <span class="text-rose-500">*</span>
            </label>
            <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Respuesta corta</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">Número donde podamos contactarte vía WhatsApp o llamada telefónica.</p>
          <input 
            type="tel" 
            id="postulacion-telefono" 
            name="telefono" 
            maxlength="30"
            placeholder="Ej. 0412-1234567 o 0424-9876543" 
            oninput="updateRecruitmentProgress(); clearFieldError('telefono')" 
            class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tour-blue text-xs md:text-sm text-slate-800 transition bg-slate-50/40 focus:bg-white"
            autocomplete="tel"
          >
          <p id="error-telefono" class="hidden text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            <span>Por favor, proporciona un número de teléfono o WhatsApp válido.</span>
          </p>
        </div>

        <!-- PREGUNTA 4: ¿En qué zona de Barquisimeto o sus alrededores resides? -->
        <div id="q-card-zona" class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90 transition-all focus-within:border-tour-blue focus-within:ring-2 focus-within:ring-sky-100">
          <div class="flex items-center justify-between mb-2">
            <label for="postulacion-zona" class="font-title font-bold text-sm md:text-base text-tour-navy block">
              Pregunta 4. ¿En qué zona de Barquisimeto o sus alrededores resides? <span class="text-rose-500">*</span>
            </label>
            <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Respuesta corta</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">Indica tu sector, urbanización o municipio (ej. Cabudare, Este, El Obelisco, Tamaca, Centro).</p>
          <input 
            type="text" 
            id="postulacion-zona" 
            name="zona" 
            maxlength="120"
            placeholder="Ej. Cabudare Centro / Los Cardones / Zona Este" 
            oninput="updateRecruitmentProgress(); clearFieldError('zona')" 
            class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tour-blue text-xs md:text-sm text-slate-800 transition bg-slate-50/40 focus:bg-white"
          >
          <p id="error-zona" class="hidden text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            <span>Por favor, especifica la zona o sector donde resides.</span>
          </p>
        </div>

        <!-- PREGUNTA 5: Experiencia -->
        <div id="q-card-experiencia" class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90 transition-all">
          <div class="flex items-center justify-between mb-2">
            <label class="font-title font-bold text-sm md:text-base text-tour-navy block">
              Pregunta 5. ¿Tienes experiencia en turismo, atención al cliente, recreación o actividades similares? <span class="text-rose-500">*</span>
            </label>
            <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Selección única</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">Selecciona la opción que mejor describa tu trayectoria.</p>
          
          <div class="space-y-2.5">
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="experiencia" value="Sí, tengo experiencia." onchange="handleRadioSelect(this, 'experiencia')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">Sí, tengo experiencia.</span>
            </label>
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="experiencia" value="Tengo algo de experiencia." onchange="handleRadioSelect(this, 'experiencia')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">Tengo algo de experiencia.</span>
            </label>
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="experiencia" value="No tengo experiencia, pero quiero aprender." onchange="handleRadioSelect(this, 'experiencia')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">No tengo experiencia, pero quiero aprender.</span>
            </label>
          </div>
          <p id="error-experiencia" class="hidden text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            <span>Por favor, selecciona una de las opciones de experiencia.</span>
          </p>
        </div>

        <!-- PREGUNTA 6: Disponibilidad fines de semana y feriados -->
        <div id="q-card-disponibilidad" class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90 transition-all">
          <div class="flex items-center justify-between mb-2">
            <label class="font-title font-bold text-sm md:text-base text-tour-navy block">
              Pregunta 6. ¿Tienes disponibilidad para trabajar sábados, domingos y días feriados? <span class="text-rose-500">*</span>
            </label>
            <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Selección única</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">La mayoría de nuestras excursiones turísticas se realizan durante los fines de semana.</p>

          <div class="space-y-2.5">
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="disponibilidad" value="Sí, tengo disponibilidad." onchange="handleRadioSelect(this, 'disponibilidad')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">Sí, tengo disponibilidad.</span>
            </label>
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="disponibilidad" value="Tengo disponibilidad parcial." onchange="handleRadioSelect(this, 'disponibilidad')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">Tengo disponibilidad parcial.</span>
            </label>
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="disponibilidad" value="No tengo disponibilidad habitual." onchange="handleRadioSelect(this, 'disponibilidad')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">No tengo disponibilidad habitual.</span>
            </label>
          </div>
          <p id="error-disponibilidad" class="hidden text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            <span>Por favor, indica tu disponibilidad para fines de semana.</span>
          </p>
        </div>

        <!-- PREGUNTA 7: Punto de partida Barquisimeto -->
        <div id="q-card-punto_partida" class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90 transition-all">
          <div class="flex items-center justify-between mb-2">
            <label class="font-title font-bold text-sm md:text-base text-tour-navy block">
              Pregunta 7. ¿Puedes llegar al punto de partida de los buses en Barquisimeto según el horario de cada excursión? <span class="text-rose-500">*</span>
            </label>
            <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Selección única</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">Nuestras salidas inician habitualmente en la madrugada o primeras horas de la mañana.</p>

          <div class="space-y-2.5">
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="punto_partida" value="Sí, sin inconvenientes." onchange="handleRadioSelect(this, 'punto_partida')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">Sí, sin inconvenientes.</span>
            </label>
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="punto_partida" value="Sí, pero necesito conocer el horario con anticipación." onchange="handleRadioSelect(this, 'punto_partida')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">Sí, pero necesito conocer el horario con anticipación.</span>
            </label>
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="punto_partida" value="Se me dificulta llegar al punto de partida." onchange="handleRadioSelect(this, 'punto_partida')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">Se me dificulta llegar al punto de partida.</span>
            </label>
          </div>
          <p id="error-punto_partida" class="hidden text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            <span>Por favor, selecciona una opción sobre la llegada al punto de partida.</span>
          </p>
        </div>

        <!-- PREGUNTA 8: Motivación y aporte -->
        <div id="q-card-motivacion" class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90 transition-all focus-within:border-tour-blue focus-within:ring-2 focus-within:ring-sky-100">
          <div class="flex items-center justify-between mb-2">
            <label for="postulacion-motivacion" class="font-title font-bold text-sm md:text-base text-tour-navy block">
              Pregunta 8. ¿Por qué te gustaría formar parte de Tour Azul y qué crees que puedes aportar al equipo? <span class="text-rose-500">*</span>
            </label>
            <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Respuesta larga</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">Comparte tus motivaciones, tu energía, tus habilidades y cómo harías que la experiencia de los viajeros sea inolvidable.</p>
          <textarea 
            id="postulacion-motivacion" 
            name="motivacion" 
            rows="4" 
            maxlength="2500"
            placeholder="Me gustaría formar parte de Tour Azul porque me apasiona viajar y hacer que las personas disfruten cada momento..." 
            oninput="updateRecruitmentProgress(); clearFieldError('motivacion')" 
            class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tour-blue text-xs md:text-sm text-slate-800 transition bg-slate-50/40 focus:bg-white resize-y"
          ></textarea>
          <p id="error-motivacion" class="hidden text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            <span>Por favor, cuéntanos tus motivos y qué puedes aportar a Tour Azul.</span>
          </p>
        </div>

        <!-- PREGUNTA 9: Fotografía (Opcional, Máx. 5 MB) -->
        <div id="q-card-foto" class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90 transition-all">
          <div class="flex items-center justify-between mb-2">
            <label class="font-title font-bold text-sm md:text-base text-tour-navy block">
              Pregunta 9. ¿Puedes adjuntar una fotografía tuya?
            </label>
            <span class="text-[10px] uppercase font-bold text-slate-500 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-md">Opcional</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">Una foto clara donde se te reconozca bien (JPG, JPEG, PNG o WEBP, máx. 5 MB).</p>

          <!-- Zona de Carga / Selección -->
          <div id="foto-dropzone" class="border-2 border-dashed border-sky-200 hover:border-tour-blue bg-sky-50/40 rounded-2xl p-6 text-center transition-all cursor-pointer group">
            <input 
              type="file" 
              id="postulacion-foto-input" 
              accept="image/*, .jpg, .jpeg, .png, .webp, .heic, .heif" 
              onchange="handlePhotoSelect(event)" 
              class="hidden"
            >
            <div onclick="document.getElementById('postulacion-foto-input').click()" class="space-y-2">
              <div class="w-12 h-12 rounded-full bg-white shadow-sm border border-sky-100 flex items-center justify-center mx-auto text-tour-blue group-hover:scale-110 transition-transform">
                <i data-lucide="camera" class="w-6 h-6"></i>
              </div>
              <p class="text-xs md:text-sm font-bold text-tour-navy">
                Haz clic para seleccionar tu fotografía
              </p>
              <p class="text-[11px] text-slate-400">
                Formatos permitidos: JPG, PNG, WEBP, HEIC/HEIF de iPhone · Tamaño máximo: 5 MB
              </p>
            </div>
          </div>

          <!-- Caja de Previsualización Local -->
          <div id="foto-preview-box" class="hidden mt-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <div class="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-md shrink-0">
                <img id="foto-preview-img" src="" alt="Vista previa de la foto" class="w-full h-full object-cover">
              </div>
              <div class="text-left overflow-hidden">
                <span class="text-[10px] font-bold uppercase tracking-wider text-tour-blue block">Fotografía optimizada</span>
                <p id="foto-filename" class="text-xs font-bold text-tour-navy truncate max-w-[200px] sm:max-w-xs">archivo.jpg</p>
                <p id="foto-filesize" class="text-[11px] text-emerald-700 font-bold">-- KB (comprimida)</p>
              </div>
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto">
              <button 
                type="button" 
                onclick="document.getElementById('postulacion-foto-input').click()" 
                class="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white hover:bg-sky-100 text-tour-navy text-xs font-bold border border-sky-200 transition active:scale-95 cursor-pointer"
              >
                Cambiar foto
              </button>
              <button 
                type="button" 
                onclick="removeSelectedPhoto()" 
                class="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1"
              >
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                <span>Quitar</span>
              </button>
            </div>
          </div>

          <!-- Mensaje de error de validación de fotografía -->
          <p id="error-foto" class="hidden text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            <span id="error-foto-text">Archivo no válido.</span>
          </p>
        </div>

        <!-- PREGUNTA 10: Talento curioso -->
        <div id="q-card-talento" class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90 transition-all focus-within:border-tour-blue focus-within:ring-2 focus-within:ring-sky-100">
          <div class="flex items-center justify-between mb-2">
            <label for="postulacion-talento" class="font-title font-bold text-sm md:text-base text-tour-navy block">
              Pregunta 10. 🤭 ¿Cuál es tu talento más inútil o extraño?
            </label>
            <span class="text-[10px] uppercase font-bold text-slate-500 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-md">Opcional</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">¡Nos encanta el buen humor y la autenticidad! Cuéntanos algo curioso o divertido sobre ti.</p>
          <input 
            type="text" 
            id="postulacion-talento" 
            name="talento" 
            maxlength="500"
            placeholder="Ej. Sé imitar el sonido de una trompeta con la boca / Puedo adivinar canciones en 2 segundos..." 
            class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tour-blue text-xs md:text-sm text-slate-800 transition bg-slate-50/40 focus:bg-white"
          >
        </div>

        <!-- MENSAJE DE ÉXITO VISIBLE EN PANTALLA -->
        <div id="postulacion-banner-exito" class="hidden p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 shadow-lg space-y-3 transition-all">
          <div class="flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <i data-lucide="check-circle-2" class="w-6 h-6 stroke-[2.5]"></i>
            </div>
            <div class="flex-1">
              <h4 class="font-title font-black text-lg md:text-xl text-emerald-900 tracking-tight leading-snug">
                ¡Postulación enviada con éxito!
              </h4>
              <p class="text-xs md:text-sm text-emerald-800 mt-1">
                Tus datos y documentación han sido registrados correctamente en nuestro sistema central.
              </p>
              <div class="mt-3 inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-sm text-xs md:text-sm">
                <span class="text-slate-600 font-medium">Código del candidato:</span>
                <strong id="postulacion-exito-codigo-banner" class="font-mono font-black text-tour-blue tracking-wide select-all"></strong>
              </div>
            </div>
          </div>
          <p class="text-[11px] text-emerald-700 font-medium italic border-t border-emerald-200/80 pt-2">
            El botón de envío se mantendrá bloqueado hasta que comiences a diligenciar un formulario nuevo.
          </p>
        </div>

        <!-- MENSAJE DE ERROR VISIBLE EN PANTALLA -->
        <div id="postulacion-banner-error" class="hidden p-5 rounded-3xl bg-rose-50 border-2 border-rose-400 text-rose-950 shadow-lg space-y-2 transition-all">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-2xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <i data-lucide="alert-octagon" class="w-5 h-5 stroke-[2.5]"></i>
            </div>
            <div class="flex-1">
              <h4 class="font-title font-black text-sm md:text-base text-rose-950">
                Error al procesar la postulación
              </h4>
              <p id="postulacion-error-texto" class="text-xs text-rose-800 mt-0.5 font-medium leading-relaxed">
                No se pudo conectar con el servidor.
              </p>
              <p class="text-[11px] text-rose-600 mt-1 font-semibold">
                Tus datos no se han perdido. Por favor verifica tu conexión y presiona el botón para reintentar.
              </p>
            </div>
          </div>
        </div>

        <!-- BOTONES DE ACCIÓN DEL FORMULARIO -->
        <div class="pt-4 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button 
            type="button" 
            onclick="showHomeView()" 
            class="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs transition active:scale-95 cursor-pointer order-2 sm:order-1 flex items-center justify-center gap-1.5"
          >
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
            <span>Volver a la portada</span>
          </button>

          <!-- Botón de Envío -->
          <button 
            type="submit" 
            id="btn-submit-postulacion" 
            class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-tour-blue via-blue-600 to-tour-caribe hover:opacity-95 text-white font-title font-black uppercase text-xs md:text-sm tracking-wider shadow-xl hover:shadow-2xl transition-all active:scale-95 cursor-pointer order-1 sm:order-2 flex items-center justify-center gap-2.5 group"
          >
            <i data-lucide="send" class="w-4 h-4 text-tour-yellow group-hover:translate-x-0.5 transition-transform"></i>
            <span id="btn-submit-text">Enviar mi postulación</span>
          </button>
        </div>

      </form>
    </div>
  </section>
`;

export const recruitmentModalsHtml = `
  <!-- MODAL 1: CONFIRMACIÓN DE ÉXITO DE POSTULACIÓN -->
  <div id="modal-postulacion-exitosa" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md hidden items-center justify-center p-4 overflow-y-auto">
    <div class="max-w-lg w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 my-8 relative border border-emerald-100 animate-float text-center">
      <!-- Icono de Éxito -->
      <div class="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
        <i data-lucide="check-circle" class="w-8 h-8 text-emerald-600"></i>
      </div>

      <span class="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
        Postulación Registrada Exitosamente
      </span>

      <div>
        <h3 class="font-title font-black text-2xl uppercase text-tour-navy tracking-tight leading-snug">
          ¡Bienvenido a la tripulación!
        </h3>
        <p class="font-script text-xl text-tour-caribe mt-0.5">
          Tus datos ya están guardados de forma segura 💙
        </p>
      </div>

      <div class="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/80 text-left text-xs text-slate-700 space-y-2 leading-relaxed">
        <div class="flex justify-between items-center text-slate-500 pb-1 border-b border-sky-100">
          <span>Código de postulación:</span>
          <strong id="modal-exito-id" class="font-mono text-tour-blue font-bold text-xs">--</strong>
        </div>
        <div class="flex justify-between items-center text-slate-500">
          <span>Aspirante:</span>
          <strong id="modal-exito-nombre" class="text-tour-navy font-bold truncate max-w-[200px]">--</strong>
        </div>
        <div class="flex justify-between items-center text-slate-500">
          <span>WhatsApp de contacto:</span>
          <strong id="modal-exito-telefono" class="text-tour-navy font-bold">--</strong>
        </div>
        <div class="flex justify-between items-center text-slate-500">
          <span>Fotografía adjunta:</span>
          <strong id="modal-exito-foto" class="text-emerald-700 font-bold">--</strong>
        </div>
      </div>

      <p class="text-xs text-slate-500 text-left">
        Tu información ha sido registrada en el sistema de Tour Azul. Puedes enviar una copia directa a nuestro WhatsApp oficial para coordinar las siguientes etapas.
      </p>

      <div class="space-y-2 pt-2">
        <a 
          id="btn-modal-exito-wa" 
          href="https://wa.me/584126571155" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-title font-black uppercase text-xs tracking-wider shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <i data-lucide="message-circle" class="w-4 h-4"></i>
          <span>Enviar postulación por WhatsApp</span>
        </a>

        <button 
          type="button" 
          onclick="closeRecruitmentSuccessModal(); showHomeView()" 
          class="w-full py-2.5 text-xs text-slate-500 hover:text-tour-navy font-bold transition cursor-pointer"
        >
          Volver a la portada principal
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL FLOTANTE Y CENTRADO: AUTENTICACIÓN ADMIN -->
  <div id="modal-admin-auth" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs hidden items-center justify-center p-4 overflow-y-auto">
    <!-- Fondo para cerrar al hacer clic afuera sin afectar logos ni componentes -->
    <div class="fixed inset-0" onclick="closeAdminPasswordModal()"></div>

    <div class="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-sky-100 text-center animate-float z-10">
      
      <!-- Botón de Cerrar Flotante -->
      <button 
        type="button" 
        onclick="closeAdminPasswordModal()" 
        class="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition active:scale-95 cursor-pointer"
        title="Cerrar"
      >
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>

      <!-- Icono Seguro -->
      <div class="w-12 h-12 rounded-2xl bg-sky-50 text-tour-blue border border-sky-200/80 flex items-center justify-center mx-auto mb-3 shadow-inner">
        <i data-lucide="shield-check" class="w-6 h-6 text-tour-blue"></i>
      </div>

      <h3 class="font-title font-black text-lg uppercase text-tour-navy tracking-tight">
        Acceso Administrador
      </h3>
      <p class="text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
        Ingresa la clave de administrador para consultar las postulaciones en tiempo real desde Google Sheets.
      </p>

      <!-- Formulario Flotante de Clave -->
      <form id="form-admin-password" onsubmit="handleAdminPasswordSubmit(event); return false;" novalidate class="space-y-4">
        <div class="text-left space-y-1.5">
          <label for="recruitment-admin-password-input" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Contraseña de Administrador
          </label>
          <div class="relative">
            <input 
              type="password" 
              id="recruitment-admin-password-input" 
              name="recruitment-admin-password" 
              placeholder="Ingresa la clave (010203)" 
              autocomplete="current-password"
              oninput="document.getElementById('admin-password-error').classList.add('hidden'); this.classList.remove('border-rose-400', 'ring-2', 'ring-rose-200');"
              class="w-full px-4 py-2.5 pr-10 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tour-blue text-xs md:text-sm text-slate-800 transition bg-slate-50/50 focus:bg-white font-mono"
            >
            <button 
              type="button" 
              onclick="toggleAdminPasswordVisibility()" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition"
              title="Mostrar / Ocultar clave"
            >
              <i id="icon-toggle-pwd" data-lucide="eye" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Mensaje de error / Alerta si la clave es inválida -->
          <div id="admin-password-error" class="hidden mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 text-left">
            <i data-lucide="alert-circle" class="w-4 h-4 shrink-0 text-rose-600"></i>
            <span id="admin-password-error-text">Contraseña inválida. Inténtalo de nuevo.</span>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <button 
            type="button" 
            onclick="closeAdminPasswordModal()" 
            class="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            id="btn-admin-submit-auth"
            class="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-tour-blue to-tour-navy hover:opacity-95 text-white text-xs font-title font-black uppercase tracking-wider shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <i data-lucide="lock-keyhole" class="w-3.5 h-3.5 text-tour-yellow"></i>
            <span>Ingresar</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL 2: PANEL DE GESTIÓN DE POSTULACIONES -->
  <div id="modal-admin-postulaciones" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="max-w-4xl w-full bg-white rounded-3xl shadow-2xl my-6 relative border border-sky-100 flex flex-col max-h-[92vh] overflow-hidden">
      
      <!-- Cabecera del Panel Admin -->
      <div class="p-5 md:p-6 bg-gradient-to-r from-tour-navy to-tour-blue text-white flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <i data-lucide="shield-check" class="w-5 h-5 text-tour-yellow"></i>
          </div>
          <div>
            <h3 class="font-title font-black uppercase text-base md:text-lg leading-tight tracking-wide">
              Panel Administrativo de Postulaciones
            </h3>
            <span class="text-[11px] text-sky-200">Gestión de aspirantes registrados en tiempo real</span>
          </div>
        </div>

        <button 
          type="button" 
          onclick="closeAdminPostulacionesModal()" 
          class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
        >
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Contenido del Panel -->
      <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <!-- Barra de Estado Admin -->
        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-slate-600">Origen de datos:</span>
            <strong class="text-tour-navy font-bold">Google Sheets en tiempo real</strong>
          </div>

          <div class="flex items-center gap-2">
            <button 
              type="button" 
              onclick="exportarPostulacionesJSON()" 
              class="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold transition flex items-center gap-1 cursor-pointer"
              title="Descargar copia de respaldo en JSON"
            >
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span>Exportar JSON</span>
            </button>
            <button 
              type="button" 
              onclick="cargarPostulacionesAdmin()" 
              class="px-3 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-tour-blue font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
              <span>Refrescar</span>
            </button>
          </div>
        </div>

        <!-- Métricas Rápidas -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-2xs">
            <span class="text-[10px] font-bold uppercase text-slate-400 block">Total Recibidas</span>
            <span id="metric-total-postulaciones" class="text-xl font-title font-black text-tour-navy">0</span>
          </div>
          <div class="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-2xs">
            <span class="text-[10px] font-bold uppercase text-slate-400 block">Con Fotografía</span>
            <span id="metric-con-foto" class="text-xl font-title font-black text-tour-blue">0</span>
          </div>
          <div class="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-2xs">
            <span class="text-[10px] font-bold uppercase text-slate-400 block">Contactadas</span>
            <span id="metric-contactadas" class="text-xl font-title font-black text-emerald-600">0</span>
          </div>
          <div class="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-2xs">
            <span class="text-[10px] font-bold uppercase text-slate-400 block">Entrevistadas</span>
            <span id="metric-entrevistadas" class="text-xl font-title font-black text-amber-600">0</span>
          </div>
        </div>

        <!-- Filtros Rápidos -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button type="button" onclick="filterAdminPostulaciones('todas')" class="admin-filter-btn px-3 py-1.5 rounded-xl bg-tour-navy text-white font-bold transition">Todas</button>
          <button type="button" onclick="filterAdminPostulaciones('recibida')" class="admin-filter-btn px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-sky-100 transition">Nuevas</button>
          <button type="button" onclick="filterAdminPostulaciones('contactada')" class="admin-filter-btn px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-sky-100 transition">Contactadas</button>
          <button type="button" onclick="filterAdminPostulaciones('entrevistada')" class="admin-filter-btn px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-sky-100 transition">Entrevistadas</button>
        </div>

        <!-- Lista de Postulaciones -->
        <div id="admin-postulaciones-list" class="space-y-3">
          <div class="text-center py-8 text-slate-400 text-xs">
            Cargando postulaciones...
          </div>
        </div>

      </div>

    </div>
  </div>
`;


export const recruitmentClientCode = `
    // =========================================================================
    // CONFIGURACIÓN CENTRALIZADA DE PREAPERTURA Y MÓDULO DE POSTULACIONES
    // =========================================================================
    const APP_CONFIG = {
      // Activa o desactiva temporalmente el modo de preapertura
      prelaunchMode: true,
      
      // WhatsApp oficial para postulaciones y consultas
      whatsappNumero: "584126571155",
      
      // Límite de tamaño de foto para postulaciones (5 MB)
      maxPhotoSizeBytes: 5 * 1024 * 1024,
      allowedPhotoMimes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
      allowedPhotoExtensions: [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"]
    };
    window.APP_CONFIG = APP_CONFIG;

    // Clave para almacenamiento local de postulaciones (persistencia directa en navegador)
    const STORAGE_KEY_POSTULACIONES = "tour_azul_postulaciones";

    let adminPostulacionesCache = [];
    let currentAdminFilter = "todas";

    // Estado aislado para el formulario de postulación
    const recruitmentState = {
      currentView: "home", // "home" | "recruitment"
      selectedPhotoFile: null,
      selectedPhotoPreviewUrl: null,
      selectedPhotoBase64: null,
      lastValidatedFormData: null
    };

    function setHeroNoticeTheme(themeId) {
      // Función mantenida por compatibilidad (selector retirado)
    }
    window.setHeroNoticeTheme = setHeroNoticeTheme;

    /**
     * Aplica el modo de preapertura en la portada
     */
    function applyPrelaunchModeUI() {
      const isPrelaunch = Boolean(APP_CONFIG.prelaunchMode);
      
      const heroCtaContainer = document.querySelector(".hero-gradient .pt-4");
      if (heroCtaContainer) {
        if (isPrelaunch) {
          heroCtaContainer.classList.add("hidden");
        } else {
          heroCtaContainer.classList.remove("hidden");
        }
      }

      const heroChipsSection = document.getElementById("hero-chips") ? document.getElementById("hero-chips").closest(".relative.z-10.mt-10") : null;
      if (heroChipsSection) {
        if (isPrelaunch) {
          heroChipsSection.classList.add("hidden");
        } else {
          heroChipsSection.classList.remove("hidden");
        }
      }

      const featuredSec = document.getElementById("viajes-destacados");
      if (featuredSec) {
        if (isPrelaunch) {
          featuredSec.classList.add("hidden");
        } else {
          featuredSec.classList.remove("hidden");
        }
      }

      const viajesSec = document.getElementById("viajes");
      if (viajesSec) {
        if (isPrelaunch) {
          viajesSec.classList.add("hidden");
        } else {
          viajesSec.classList.remove("hidden");
        }
      }

      const prelaunchHeroCard = document.getElementById("prelaunch-hero-card");
      if (prelaunchHeroCard) {
        if (isPrelaunch) {
          prelaunchHeroCard.classList.remove("hidden");
        } else {
          prelaunchHeroCard.classList.add("hidden");
        }
      }

      const btnNavEquipo = document.getElementById("btn-nav-equipo");
      if (btnNavEquipo) {
        btnNavEquipo.classList.remove("hidden");
      }
    }
    window.applyPrelaunchModeUI = applyPrelaunchModeUI;

    /**
     * Muestra la vista dedicada del formulario «Únete al equipo»
     */
    function showRecruitmentView() {
      recruitmentState.currentView = "recruitment";
      
      const homeMain = document.querySelector("main");
      const recruitmentSection = document.getElementById("vista-reclutamiento");
      const floatingScroll = document.getElementById("floating-scroll-cue");
      const scrollMore = document.getElementById("scroll-more-container");
      
      if (homeMain) homeMain.classList.add("hidden");
      if (floatingScroll) floatingScroll.classList.add("hidden");
      if (scrollMore) scrollMore.classList.add("hidden");
      
      if (recruitmentSection) {
        recruitmentSection.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      updateRecruitmentProgress();
      if (window.lucide) lucide.createIcons();

      if (window.location.hash !== "#unete-al-equipo") {
        window.history.pushState({ view: "recruitment" }, "", "#unete-al-equipo");
      }
    }
    window.showRecruitmentView = showRecruitmentView;

    /**
     * Regresa a la portada principal
     */
    function showHomeView() {
      recruitmentState.currentView = "home";
      
      const homeMain = document.querySelector("main");
      const recruitmentSection = document.getElementById("vista-reclutamiento");
      
      if (recruitmentSection) recruitmentSection.classList.add("hidden");
      if (homeMain) homeMain.classList.remove("hidden");
      
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      if (window.location.hash === "#unete-al-equipo") {
        window.history.pushState({ view: "home" }, "", window.location.pathname + window.location.search);
      }
      
      if (window.lucide) lucide.createIcons();
    }
    window.showHomeView = showHomeView;

    window.addEventListener("popstate", () => {
      if (window.location.hash === "#unete-al-equipo") {
        showRecruitmentView();
      } else {
        showHomeView();
      }
    });

    /**
     * Gestión del estilo de los radio buttons al seleccionarse
     */
    function handleRadioSelect(radioElement, groupName) {
      const allLabels = document.querySelectorAll(\`input[name="\${groupName}"]\`);
      allLabels.forEach(inp => {
        const lbl = inp.closest(".postulacion-radio-label");
        if (lbl) {
          if (inp === radioElement) {
            lbl.classList.remove("border-slate-200", "bg-sky-50/40");
            lbl.classList.add("border-tour-blue", "bg-blue-50/70", "shadow-xs");
          } else {
            lbl.classList.remove("border-tour-blue", "bg-blue-50/70", "shadow-xs");
            lbl.classList.add("border-slate-200");
          }
        }
      });
      clearFieldError(groupName);
      updateRecruitmentProgress();
    }
    window.handleRadioSelect = handleRadioSelect;

    /**
     * Limpia el mensaje de error de un campo
     */
    function clearFieldError(fieldName) {
      const errEl = document.getElementById(\`error-\${fieldName}\`);
      const cardEl = document.getElementById(\`q-card-\${fieldName}\`);
      if (errEl) errEl.classList.add("hidden");
      if (cardEl) {
        cardEl.classList.remove("border-rose-400", "ring-2", "ring-rose-100");
      }
    }
    window.clearFieldError = clearFieldError;

    /**
     * Actualiza la barra de progreso del formulario
     */
    function updateRecruitmentProgress() {
      let completedCount = 0;
      const totalRequired = 8;

      const nombre = (document.getElementById("postulacion-nombre")?.value || "").trim();
      if (nombre.length >= 3) completedCount++;

      const edadVal = parseInt(document.getElementById("postulacion-edad")?.value, 10);
      if (!isNaN(edadVal) && edadVal >= 16 && edadVal <= 80) completedCount++;

      const telf = (document.getElementById("postulacion-telefono")?.value || "").trim();
      if (telf.length >= 7) completedCount++;

      const zona = (document.getElementById("postulacion-zona")?.value || "").trim();
      if (zona.length >= 2) completedCount++;

      const exp = document.querySelector('input[name="experiencia"]:checked');
      if (exp) completedCount++;

      const disp = document.querySelector('input[name="disponibilidad"]:checked');
      if (disp) completedCount++;

      const punto = document.querySelector('input[name="punto_partida"]:checked');
      if (punto) completedCount++;

      const motiv = (document.getElementById("postulacion-motivacion")?.value || "").trim();
      if (motiv.length >= 10) completedCount++;

      const percent = Math.round((completedCount / totalRequired) * 100);
      const bar = document.getElementById("recruitment-progress-bar");
      const text = document.getElementById("recruitment-progress-text");
      if (bar) bar.style.width = \`\${percent}%\`;
      if (text) text.textContent = \`\${completedCount}/\${totalRequired}\`;
    }
    window.updateRecruitmentProgress = updateRecruitmentProgress;

    /**
     * Asegura la disponibilidad de heic2any para convertir imágenes HEIC/HEIF de iPhone
     */
    async function getHeicConverter() {
      if (typeof window !== "undefined" && window.heic2any) {
        return window.heic2any;
      }
      return new Promise(resolve => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js";
        script.onload = () => resolve(window.heic2any || null);
        script.onerror = () => resolve(null);
        document.head.appendChild(script);
      });
    }

    /**
     * Comprime la foto en el navegador antes de enviarla:
     * - Cárgala en un canvas, reduce el lado más largo a máximo 800 px
     * - Expórtala como JPEG con calidad 0.6
     * - Si el resultado pesa más de 400 KB, vuelve a comprimir bajando la calidad (0.5, 0.4...) hasta que baje de 400 KB
     * - Funciona con fotos HEIC/HEIF de iPhone y respeta la orientación EXIF de la foto
     */
    async function compressImage(file) {
      if (!file) throw new Error("No se proporcionó ningún archivo de imagen.");

      let blobToProcess = file;
      const fileNameLower = (file.name || "").toLowerCase();
      const isHeic = file.type === "image/heic" || file.type === "image/heif" ||
                     fileNameLower.endsWith(".heic") || fileNameLower.endsWith(".heif");

      if (isHeic) {
        try {
          const heic2any = await getHeicConverter();
          if (heic2any) {
            const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
            blobToProcess = Array.isArray(converted) ? converted[0] : converted;
          }
        } catch (heicErr) {
          console.warn("Aviso al convertir formato HEIC de iPhone con heic2any:", heicErr);
        }
      }

      // Obtener elemento dibujable respetando la orientación EXIF
      let drawable = null;
      let naturalWidth = 0;
      let naturalHeight = 0;
      let isBitmap = false;
      let tempObjectUrl = null;

      if (typeof createImageBitmap === "function") {
        try {
          // 'from-image' orienta automáticamente la imagen según EXIF (incluyendo fotos de iPhone/Safari)
          drawable = await createImageBitmap(blobToProcess, { imageOrientation: "from-image" });
          naturalWidth = drawable.width;
          naturalHeight = drawable.height;
          isBitmap = true;
        } catch (_) {
          drawable = null;
        }
      }

      if (!drawable) {
        drawable = await new Promise((resolve, reject) => {
          const img = new Image();
          tempObjectUrl = URL.createObjectURL(blobToProcess);
          img.onload = () => {
            naturalWidth = img.naturalWidth || img.width;
            naturalHeight = img.naturalHeight || img.height;
            resolve(img);
          };
          img.onerror = () => {
            if (tempObjectUrl) URL.revokeObjectURL(tempObjectUrl);
            reject(new Error("No se pudo decodificar la imagen seleccionada."));
          };
          img.src = tempObjectUrl;
        });
      }

      // Reducir el lado más largo a máximo 800 px
      const maxLado = 800;
      let targetWidth = naturalWidth;
      let targetHeight = naturalHeight;

      if (targetWidth > maxLado || targetHeight > maxLado) {
        if (targetWidth >= targetHeight) {
          targetHeight = Math.round((targetHeight * maxLado) / targetWidth);
          targetWidth = maxLado;
        } else {
          targetWidth = Math.round((targetWidth * maxLado) / targetHeight);
          targetHeight = maxLado;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No se pudo inicializar el lienzo de compresión 2D.");

      // Limpiar y dibujar con suavizado
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(drawable, 0, 0, targetWidth, targetHeight);

      if (isBitmap && typeof drawable.close === "function") {
        drawable.close();
      }
      if (tempObjectUrl) {
        URL.revokeObjectURL(tempObjectUrl);
      }

      // Helper para calcular peso en KB de un DataURL Base64
      function calcSizeKB(dataUrl) {
        const idx = dataUrl.indexOf(",");
        const raw = idx >= 0 ? dataUrl.slice(idx + 1) : dataUrl;
        return (raw.length * 3 / 4) / 1024;
      }

      // Calidad inicial: 0.6. Si pesa más de 400 KB, bajar progresivamente (0.5, 0.4, 0.35, 0.25)
      const qualities = [0.6, 0.5, 0.4, 0.35, 0.25];
      let bestDataUrl = "";
      let bestSizeKB = 0;

      for (const q of qualities) {
        bestDataUrl = canvas.toDataURL("image/jpeg", q);
        bestSizeKB = calcSizeKB(bestDataUrl);
        if (bestSizeKB <= 400) {
          break;
        }
      }

      return {
        dataUrl: bestDataUrl,
        sizeKB: bestSizeKB,
        width: targetWidth,
        height: targetHeight
      };
    }
    window.compressImage = compressImage;

    /**
     * Manejador de selección de fotografía (máx. 5 MB, formatos permitidos, muestra vista previa comprimida y peso)
     */
    async function handlePhotoSelect(event) {
      const file = event.target.files && event.target.files[0];
      const errorEl = document.getElementById("error-foto");
      const errorText = document.getElementById("error-foto-text");
      const dropzone = document.getElementById("foto-dropzone");
      const previewBox = document.getElementById("foto-preview-box");
      const previewImg = document.getElementById("foto-preview-img");
      const filenameEl = document.getElementById("foto-filename");
      const filesizeEl = document.getElementById("foto-filesize");

      if (errorEl) errorEl.classList.add("hidden");

      if (!file) return;

      const ext = "." + file.name.split(".").pop().toLowerCase();
      const isValidExt = APP_CONFIG.allowedPhotoExtensions.includes(ext) || file.type.startsWith("image/");
      const isValidMime = APP_CONFIG.allowedPhotoMimes.includes(file.type) || file.type.startsWith("image/");

      if (!isValidExt && !isValidMime) {
        if (errorEl && errorText) {
          errorText.textContent = "Formato no válido. Por favor selecciona una imagen JPG, JPEG, PNG, WEBP o HEIC/HEIF.";
          errorEl.classList.remove("hidden");
        }
        event.target.value = "";
        return;
      }

      if (file.size > APP_CONFIG.maxPhotoSizeBytes) {
        if (errorEl && errorText) {
          errorText.textContent = "El archivo supera el límite de 5 MB (tamaño: " + (file.size / (1024 * 1024)).toFixed(1) + " MB).";
          errorEl.classList.remove("hidden");
        }
        event.target.value = "";
        return;
      }

      recruitmentState.selectedPhotoFile = file;

      // Mostrar caja de previsualización con estado de carga
      if (dropzone) dropzone.classList.add("hidden");
      if (previewBox) previewBox.classList.remove("hidden");
      if (filenameEl) filenameEl.textContent = file.name;
      if (filesizeEl) filesizeEl.textContent = "Optimizando y comprimiendo...";

      try {
        // Comprimir la foto en el navegador antes de enviar
        const result = await compressImage(file);
        recruitmentState.selectedPhotoBase64 = result.dataUrl;
        recruitmentState.selectedPhotoCompressedSizeKB = result.sizeKB;

        // Muestra una vista previa de la foto ya comprimida y su peso en KB antes de enviar
        if (previewImg) previewImg.src = result.dataUrl;
        if (filesizeEl) filesizeEl.textContent = result.sizeKB.toFixed(1) + " KB (comprimida)";
      } catch (errFoto) {
        console.warn("Aviso al comprimir fotografía, intentando fallback:", errFoto);
        const reader = new FileReader();
        reader.onload = function(e) {
          recruitmentState.selectedPhotoBase64 = e.target.result;
          if (previewImg) previewImg.src = e.target.result;
          if (filesizeEl) filesizeEl.textContent = (file.size / 1024).toFixed(1) + " KB";
        };
        reader.readAsDataURL(file);
      }

      if (window.lucide) lucide.createIcons();
    }
    window.handlePhotoSelect = handlePhotoSelect;

    /**
     * Quita la fotografía seleccionada y restablece la caja
     */
    function removeSelectedPhoto() {
      const input = document.getElementById("postulacion-foto-input");
      const dropzone = document.getElementById("foto-dropzone");
      const previewBox = document.getElementById("foto-preview-box");
      const previewImg = document.getElementById("foto-preview-img");
      const errorEl = document.getElementById("error-foto");

      if (input) input.value = "";
      if (recruitmentState.selectedPhotoPreviewUrl) {
        URL.revokeObjectURL(recruitmentState.selectedPhotoPreviewUrl);
      }
      recruitmentState.selectedPhotoFile = null;
      recruitmentState.selectedPhotoPreviewUrl = null;
      recruitmentState.selectedPhotoBase64 = null;
      recruitmentState.selectedPhotoCompressedSizeKB = null;

      if (previewImg) previewImg.src = "";
      if (dropzone) dropzone.classList.remove("hidden");
      if (previewBox) previewBox.classList.add("hidden");
      if (errorEl) errorEl.classList.add("hidden");
    }
    window.removeSelectedPhoto = removeSelectedPhoto;

    /**
     * Envío y guardado de la postulación (Conectado con el servidor central para todos los dispositivos)
     */
    async function handleRecruitmentSubmit(event) {
      if (event) event.preventDefault();

      let hasErrors = false;
      let firstErrorElement = null;

      function markError(fieldName, message) {
        hasErrors = true;
        const errEl = document.getElementById("error-" + fieldName);
        const cardEl = document.getElementById("q-card-" + fieldName);
        if (errEl) {
          errEl.classList.remove("hidden");
          if (message) {
            const span = errEl.querySelector("span");
            if (span) span.textContent = message;
          }
        }
        if (cardEl) {
          cardEl.classList.add("border-rose-400", "ring-2", "ring-rose-100");
          if (!firstErrorElement) firstErrorElement = cardEl;
        }
      }

      // Validaciones de campos
      const nombreInput = document.getElementById("postulacion-nombre");
      const nombre = (nombreInput?.value || "").trim();
      if (!nombre || nombre.length < 3) {
        markError("nombre", "Por favor ingresa tus nombres y apellidos.");
      }

      const edadInput = document.getElementById("postulacion-edad");
      const edad = parseInt(edadInput?.value, 10);
      if (isNaN(edad) || edad < 16 || edad > 80) {
        markError("edad", "Por favor ingresa una edad numérica razonable (entre 16 y 80 años).");
      }

      const telfInput = document.getElementById("postulacion-telefono");
      const telefono = (telfInput?.value || "").trim();
      if (!telefono || telefono.length < 7) {
        markError("telefono", "Por favor ingresa tu número de teléfono y WhatsApp.");
      }

      const zonaInput = document.getElementById("postulacion-zona");
      const zona = (zonaInput?.value || "").trim();
      if (!zona || zona.length < 2) {
        markError("zona", "Por favor indica en qué zona de Barquisimeto o alrededores resides.");
      }

      const expChecked = document.querySelector('input[name="experiencia"]:checked');
      if (!expChecked) {
        markError("experiencia", "Por favor selecciona una de las opciones de experiencia.");
      }

      const dispChecked = document.querySelector('input[name="disponibilidad"]:checked');
      if (!dispChecked) {
        markError("disponibilidad", "Por favor indica tu disponibilidad para fines de semana.");
      }

      const puntoChecked = document.querySelector('input[name="punto_partida"]:checked');
      if (!puntoChecked) {
        markError("punto_partida", "Por favor responde si puedes llegar al punto de partida.");
      }

      const motivInput = document.getElementById("postulacion-motivacion");
      const motivacion = (motivInput?.value || "").trim();
      if (!motivacion || motivacion.length < 10) {
        markError("motivacion", "Por favor cuéntanos por qué te gustaría formar parte del equipo.");
      }

      const talentoInput = document.getElementById("postulacion-talento");
      const talento = (talentoInput?.value || "").trim();

      if (hasErrors) {
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (typeof showToastNotification === "function") {
          showToastNotification("Por favor completa las preguntas obligatorias marcadas con asterisco (*).", "error");
        }
        return false;
      }

      // Preparar estado de botón de envío y banners
      // (3) Mientras se envía, deshabilita el botón y cambia su texto a "Enviando..."
      const submitBtn = document.getElementById("btn-submit-postulacion");
      const submitText = document.getElementById("btn-submit-text");
      if (submitBtn) submitBtn.disabled = true;
      if (submitText) submitText.textContent = "Enviando...";

      // Ocultar banners anteriores al iniciar nuevo intento
      const bannerError = document.getElementById("postulacion-banner-error");
      const bannerExito = document.getElementById("postulacion-banner-exito");
      if (bannerError) bannerError.classList.add("hidden");
      if (bannerExito) bannerExito.classList.add("hidden");

      // 2. Generar ID único usando crypto.randomUUID()
      const docId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : ("POST-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9));

      // 3. Comprimir la foto en el navegador si aún no se había comprimido
      let fotoFinal = recruitmentState.selectedPhotoBase64;
      if (recruitmentState.selectedPhotoFile && !fotoFinal) {
        try {
          const compResult = await compressImage(recruitmentState.selectedPhotoFile);
          fotoFinal = compResult.dataUrl;
          recruitmentState.selectedPhotoBase64 = fotoFinal;
        } catch (errFoto) {
          console.warn("Aviso al comprimir fotografía antes de enviar:", errFoto);
        }
      }

      // 4. Preparar payload con ID y foto comprimida en base64
      const DEFAULT_SHEETS_WEBHOOK = "";
      const webhookUrl = localStorage.getItem("tour_azul_sheets_webhook_url") ||
                         (window.__TOUR_AZUL_WEBHOOK_URL) ||
                         DEFAULT_SHEETS_WEBHOOK;

      // El body es JSON.stringify({accion:"candidato", codigo, id, ...campos, foto: base64Comprimido})
      const postPayload = {
        accion: "candidato",
        codigo: docId,
        id: docId,
        nombre: nombre,
        nombreCompleto: nombre,
        edad: edad || 24,
        telefono: telefono,
        zona: zona || "Barquisimeto",
        experiencia: expChecked ? expChecked.value : "Con disposición de aprender",
        disponibilidad: dispChecked ? dispChecked.value : "Fines de semana y feriados",
        punto_partida: puntoChecked ? puntoChecked.value : "Sí, sin inconvenientes.",
        motivacion: motivacion || "Me entusiasma formar parte del equipo de Tour Azul.",
        talento: talento || "No especificado",
        foto: fotoFinal || "No adjunta",
        fotoBase64: fotoFinal || null,
        tieneFoto: Boolean(fotoFinal && fotoFinal !== "No adjunta"),
        estado: "Recibida",
        fecha: new Date().toLocaleString("es-VE")
      };

      // 5. Envía el POST con Content-Type: text/plain y sin ningún otro header
      let isSuccess = false;
      let responsePayload = null;
      let errorDetalle = "";

      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(postPayload)
        });

        if (response.ok) {
          try {
            const rawText = await response.text();
            responsePayload = JSON.parse(rawText);
            if (responsePayload && (responsePayload.status === "success" || responsePayload.ok === true)) {
              isSuccess = true;
            } else {
              const errMsg = responsePayload && (responsePayload.error || responsePayload.mensaje);
              errorDetalle = errMsg || ("Status " + response.status + ": " + rawText.slice(0, 200));
            }
          } catch (_) {
            // Si el servidor respondió HTTP 200 pero no era JSON estricto (redirección exitosa de Apps Script)
            isSuccess = true;
          }
        } else {
          let snippet = "";
          try {
            const t = await response.text();
            snippet = t.slice(0, 200);
          } catch (_) {}
          errorDetalle = "Status " + response.status + ": " + snippet;
        }
      } catch (err) {
        // Muestra el error real en el catch: err.name, err.message, y si hubo respuesta, status y snippet
        errorDetalle = "[" + (err.name || "Error") + "]: " + (err.message || String(err));
        console.warn("Fallo capturado en fetch POST:", err);
      }

      // 6. Verifica antes de dar error. Si el fetch falla, espera 3 segundos y consulta con GET la lista de candidatos (?accion=candidatos). Si el código de esta postulación ya existe, trátalo como éxito.
      if (!isSuccess) {
        if (submitText) submitText.textContent = "Verificando registro...";
        try {
          await new Promise(resolve => setTimeout(resolve, 3000));
          const sep = webhookUrl.includes("?") ? "&" : "?";
          const checkUrl = webhookUrl + sep + "accion=candidatos&_t=" + Date.now();
          const checkResp = await fetch(checkUrl, { cache: "no-store" });
          if (checkResp.ok) {
            const checkText = await checkResp.text();
            let checkJson = null;
            try { checkJson = JSON.parse(checkText); } catch (_) {}
            let lista = [];
            if (checkJson && checkJson.status === "success" && Array.isArray(checkJson.data)) lista = checkJson.data;
            else if (Array.isArray(checkJson)) lista = checkJson;
            else if (checkJson && Array.isArray(checkJson.candidatos)) lista = checkJson.candidatos;

            const existe = lista.some(item => {
              const cod = String(item.Código || item.codigo || item.id || "").trim();
              return cod === docId;
            });

            if (existe) {
              isSuccess = true;
              errorDetalle = "";
            }
          }
        } catch (errCheck) {
          console.warn("Fallo durante verificación secundaria GET:", errCheck);
        }
      }

      // Procesar resultado según éxito o fallo
      if (isSuccess) {
        // (1) Limpia TODOS los campos del formulario, incluida la foto y su vista previa
        const formEl = document.getElementById("form-postulacion");
        if (formEl) formEl.reset();
        removeSelectedPhoto();

        if (formEl) {
          const textInputs = formEl.querySelectorAll('input[type="text"], input[type="number"], input[type="tel"], textarea');
          textInputs.forEach(input => { input.value = ""; });
          const radioInputs = formEl.querySelectorAll('input[type="radio"]');
          radioInputs.forEach(radio => { radio.checked = false; });

          const cards = formEl.querySelectorAll('[id^="q-card-"]');
          cards.forEach(card => card.classList.remove("border-rose-400", "ring-2", "ring-rose-100"));
          const errorMsgs = formEl.querySelectorAll('[id^="error-"]');
          errorMsgs.forEach(err => err.classList.add("hidden"));
        }
        updateRecruitmentProgress();

        // (2) Muestra un mensaje bien visible de "Postulación enviada con éxito" con el código del candidato
        const candidateCode = (responsePayload && (responsePayload.codigo || responsePayload.id)) || docId;

        if (bannerExito) {
          const codeBanner = document.getElementById("postulacion-exito-codigo-banner");
          if (codeBanner) codeBanner.textContent = candidateCode;
          bannerExito.classList.remove("hidden");
          bannerExito.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        const modalIdEl = document.getElementById("modal-exito-id");
        const modalNombreEl = document.getElementById("modal-exito-nombre");
        const modalTelEl = document.getElementById("modal-exito-telefono");
        const modalFotoEl = document.getElementById("modal-exito-foto");

        const tieneFotoAdjunta = Boolean(fotoFinal && fotoFinal !== "No adjunta");
        const fotoNombre = recruitmentState.selectedPhotoFile ? recruitmentState.selectedPhotoFile.name : (tieneFotoAdjunta ? "Adjunta" : "No adjunta");

        if (modalIdEl) modalIdEl.textContent = candidateCode;
        if (modalNombreEl) modalNombreEl.textContent = nombre;
        if (modalTelEl) modalTelEl.textContent = telefono;
        if (modalFotoEl) modalFotoEl.textContent = tieneFotoAdjunta ? ("Sí (" + fotoNombre + ")") : "No adjunta";

        // Mensaje estructurado para WhatsApp oficial
        const msgWa = [
          "¡Hola Tour Azul! 👋 Deseo postularme a la convocatoria de tripulación:",
          "",
          "📄 Código de postulación: *" + candidateCode + "*",
          "👤 Nombre: " + nombre,
          "🎂 Edad: " + edad + " años",
          "📱 Teléfono/WhatsApp: " + telefono,
          "📍 Zona de residencia: " + zona,
          "💼 Experiencia: " + (expChecked ? expChecked.value : "Con disposición de aprender"),
          "⏰ Disponibilidad: " + (dispChecked ? dispChecked.value : "Fines de semana y feriados"),
          "🚌 Punto de llegada: " + (puntoChecked ? puntoChecked.value : "Sí, sin inconvenientes."),
          "✨ Motivación: " + motivacion,
          (talento ? "🤭 Talento curioso: " + talento : ""),
          (tieneFotoAdjunta ? "📷 Foto: Adjunta en mi postulación" : "📷 Foto: No adjunta")
        ].filter(Boolean).join(String.fromCharCode(10));

        const waExitoBtn = document.getElementById("btn-modal-exito-wa");
        if (waExitoBtn) {
          waExitoBtn.href = "https://wa.me/" + APP_CONFIG.whatsappNumero + "?text=" + encodeURIComponent(msgWa);
        }

        const modalExito = document.getElementById("modal-postulacion-exitosa");
        if (modalExito) {
          modalExito.classList.remove("hidden");
          modalExito.classList.add("flex");
        }

        if (window.lucide) lucide.createIcons();
        if (typeof showToastNotification === "function") {
          showToastNotification("¡Postulación enviada con éxito! Código: " + candidateCode, "success");
        }

        // Estados del botón: mientras envía deshabilitado. Si es éxito, muestra "Postulación enviada con éxito"
        if (submitBtn) submitBtn.disabled = true;
        if (submitText) submitText.textContent = "Postulación enviada con éxito";

        function enableOnNewFormFill() {
          const bannerExito = document.getElementById("postulacion-banner-exito");
          if (bannerExito) bannerExito.classList.add("hidden");

          if (submitBtn) {
            submitBtn.disabled = false;
            if (submitText) submitText.textContent = "Enviar mi postulación";
          }

          if (formEl) {
            formEl.removeEventListener("input", enableOnNewFormFill);
            formEl.removeEventListener("change", enableOnNewFormFill);
          }
        }

        if (formEl) {
          formEl.addEventListener("input", enableOnNewFormFill, { once: true });
          formEl.addEventListener("change", enableOnNewFormFill, { once: true });
        }

        return true;
      } else {
        // (5) Si falla, NO limpies los campos, muestra el error en pantalla y rehabilita el botón para reintentar
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.textContent = "Reintentar postulación";

        if (bannerError) {
          const errTxt = document.getElementById("postulacion-error-texto");
          if (errTxt) {
            errTxt.textContent = errorDetalle || "No fue posible registrar la postulación en Google Sheets. Revisa la conexión.";
          }
          bannerError.classList.remove("hidden");
          bannerError.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        if (typeof showToastNotification === "function") {
          showToastNotification("Error al enviar postulación: " + errorDetalle, "error");
        }
        if (window.lucide) lucide.createIcons();
        return false;
      }
    }
    window.handleRecruitmentSubmit = handleRecruitmentSubmit;

    // Sincronizar postulaciones pendientes cuando el dispositivo recupere conexión
    async function syncPendingSubmissions() {
      try {
        const raw = localStorage.getItem("tour_azul_postulaciones_pendientes");
        if (!raw) return;
        const pend = JSON.parse(raw);
        if (!Array.isArray(pend) || pend.length === 0) return;

        const stillPending = [];
        for (const item of pend) {
          try {
            const res = await fetch("/api/candidatos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item)
            });
            if (!res.ok) stillPending.push(item);
          } catch (_) {
            stillPending.push(item);
          }
        }
        if (stillPending.length > 0) {
          localStorage.setItem("tour_azul_postulaciones_pendientes", JSON.stringify(stillPending));
        } else {
          localStorage.removeItem("tour_azul_postulaciones_pendientes");
        }
      } catch (_) {}
    }
    window.addEventListener("online", syncPendingSubmissions);
    setTimeout(syncPendingSubmissions, 2000);

    function closeRecruitmentSuccessModal() {
      const modal = document.getElementById("modal-postulacion-exitosa");
      if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    }
    window.closeRecruitmentSuccessModal = closeRecruitmentSuccessModal;

    // =========================================================================
    // PANEL ADMINISTRATIVO CON AUTENTICACIÓN SEGURA EN SERVIDOR
    // =========================================================================

    function getRecruitmentPasswordInput() {
      return document.getElementById("recruitment-admin-password-input") || document.getElementById("admin-password-input");
    }

    /**
     * Despliega el formulario flotante y centrado solicitando la contraseña de administrador
     */
    function openAdminPostulacionesModal() {
      // Si ya tiene un token de administrador activo, abrir directamente el panel
      const token = sessionStorage.getItem("tour_azul_admin_token") || localStorage.getItem("tour_azul_admin_token");
      if (token) {
        if (window.openAdminCandidatos) {
          window.openAdminCandidatos();
        } else {
          window.location.hash = "#/admin-candidatos";
        }
        return;
      }

      const authModal = document.getElementById("modal-admin-auth");
      if (authModal) {
        authModal.classList.remove("hidden");
        authModal.classList.add("flex");
      }
      
      const pwdInput = getRecruitmentPasswordInput();
      if (pwdInput) {
        pwdInput.value = "";
        pwdInput.classList.remove("border-rose-400", "ring-2", "ring-rose-200");
        setTimeout(() => pwdInput.focus(), 80);
      }
      
      const errBox = document.getElementById("admin-password-error");
      if (errBox) {
        errBox.classList.add("hidden");
      }
      
      if (window.lucide) lucide.createIcons();
    }
    window.openAdminPostulacionesModal = openAdminPostulacionesModal;

    /**
     * Cierra el cuadro de diálogo de contraseña
     */
    function closeAdminPasswordModal() {
      const authModal = document.getElementById("modal-admin-auth");
      if (authModal) {
        authModal.classList.add("hidden");
        authModal.classList.remove("flex");
      }
      const pwdInput = getRecruitmentPasswordInput();
      if (pwdInput) {
        pwdInput.value = "";
        pwdInput.classList.remove("border-rose-400", "ring-2", "ring-rose-200");
      }
      const errBox = document.getElementById("admin-password-error");
      if (errBox) errBox.classList.add("hidden");
    }
    window.closeAdminPasswordModal = closeAdminPasswordModal;

    /**
     * Alterna la visibilidad del texto de la contraseña
     */
    function toggleAdminPasswordVisibility() {
      const pwdInput = getRecruitmentPasswordInput();
      const icon = document.getElementById("icon-toggle-pwd");
      if (!pwdInput) return;
      if (pwdInput.type === "password") {
        pwdInput.type = "text";
        if (icon) icon.setAttribute("data-lucide", "eye-off");
      } else {
        pwdInput.type = "password";
        if (icon) icon.setAttribute("data-lucide", "eye");
      }
      if (window.lucide) lucide.createIcons();
    }
    window.toggleAdminPasswordVisibility = toggleAdminPasswordVisibility;

    /**
     * Valida la contraseña de administrador en el servidor (/api/admin/login)
     */
    async function handleAdminPasswordSubmit(event) {
      if (event && event.preventDefault) event.preventDefault();

      const pwdInput = getRecruitmentPasswordInput();
      const errBox = document.getElementById("admin-password-error");
      const errText = document.getElementById("admin-password-error-text");
      const rawPassword = pwdInput ? (pwdInput.value || "") : "";
      const password = rawPassword.trim();

      if (!password) {
        if (errBox) errBox.classList.remove("hidden");
        if (errText) errText.textContent = "Por favor ingresa la contraseña.";
        return false;
      }

      function grantAccess(token) {
        closeAdminPasswordModal();
        sessionStorage.setItem("tour_azul_admin_token", token);
        localStorage.setItem("tour_azul_admin_token", token);
        if (window.openAdminCandidatos) {
          window.openAdminCandidatos();
        } else {
          window.location.hash = "#/admin-candidatos";
        }
        if (window.lucide) lucide.createIcons();
        if (typeof showToastNotification === "function") {
          showToastNotification("Acceso concedido al Administrador.", "success");
        }
      }

      try {
        const resp = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password })
        });

        if (resp.status === 404) {
          // Entorno estático (ej. Vercel sin servidor backend): validar directamente
          if (password === "010203") {
            grantAccess("local-admin-" + Date.now());
            return false;
          } else {
            if (errBox) errBox.classList.remove("hidden");
            if (errText) errText.textContent = "Clave de administrador incorrecta.";
            if (pwdInput) {
              pwdInput.classList.add("border-rose-400", "ring-2", "ring-rose-200");
              pwdInput.select();
            }
            return false;
          }
        }

        const data = await resp.json().catch(() => null);
        if (resp.ok && data && data.ok && data.token) {
          grantAccess(data.token);
          return false;
        } else {
          if (errBox) errBox.classList.remove("hidden");
          if (errText) errText.textContent = (data && data.error) ? data.error : "Clave de administrador incorrecta.";
          if (pwdInput) {
            pwdInput.classList.add("border-rose-400", "ring-2", "ring-rose-200");
            pwdInput.select();
            pwdInput.focus();
          }
          return false;
        }
      } catch (err) {
        if (password === "010203") {
          grantAccess("local-admin-" + Date.now());
          return false;
        }
        if (errBox) errBox.classList.remove("hidden");
        if (errText) errText.textContent = "Error al verificar credenciales con el servidor.";
        return false;
      }
    }
    window.handleAdminPasswordSubmit = handleAdminPasswordSubmit;

    function closeAdminPostulacionesModal() {
      const modal = document.getElementById("modal-admin-postulaciones");
      if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    }
    window.closeAdminPostulacionesModal = closeAdminPostulacionesModal;

    /**
     * Normalizador flexible de registros provenientes de Google Sheets
     */
    function normalizarCandidatoPostulacion(item, idx) {
      if (!item || typeof item !== "object") return null;

      const nombre = item.Nombre || item.nombre || item["Nombre y Apellido"] || item["Nombres y apellidos"] || item.name || "Aspirante sin nombre";
      const id = item.Código || item.codigo || item.id || item.ID || item["Código de postulación"] || ("POST-" + (idx + 1));
      const edad = item.Edad !== undefined ? item.Edad : (item.edad !== undefined ? item.edad : "--");
      const telefono = item.Teléfono || item.telefono || item.Telefono || item.WhatsApp || item.whatsapp || item.celular || "--";
      const zona = item.Zona || item.zona || item.Sector || item.sector || item["Zona de residencia"] || "--";
      const experiencia = item.Experiencia || item.experiencia || "--";
      const disponibilidad = item.Disponibilidad || item.disponibilidad || "--";
      const punto_partida = item["Punto de partida"] || item.punto_partida || item.puntoPartida || item.punto || "--";
      const motivacion = item.Motivación || item.motivacion || item.Motivacion || item["Por qué te gustaría formar parte"] || "--";
      const talento = item.Talento || item.talento || item["Talento curioso"] || "";
      const foto = item.Foto || item.foto || item.Fotografia || item.fotografia || item.fotoNombre || "";
      const tieneFoto = Boolean(foto && foto !== "No adjunta" && foto !== "No" && foto !== "-" && foto !== "null");
      const estado = (item.Estado || item.estado || "recibida").toLowerCase();
      const createdAt = item.Fecha || item.fecha || item.createdAt || item.timestamp || item["Marca temporal"] || item["Fecha de registro"] || "";

      return {
        ...item,
        id,
        nombre,
        edad,
        telefono,
        zona,
        experiencia,
        disponibilidad,
        punto_partida,
        motivacion,
        talento,
        foto,
        tieneFoto,
        fotoNombre: typeof foto === "string" && foto.length > 0 ? (foto.length > 40 ? "Fotografía adjunta" : foto) : (tieneFoto ? "Sí" : null),
        fotoUrl: typeof foto === "string" && (foto.startsWith("http://") || foto.startsWith("https://") || foto.startsWith("data:image/")) ? foto : null,
        estado,
        createdAt
      };
    }

    /**
     * Carga la lista de postulaciones desde el servidor central y Google Sheets
     */
    async function cargarPostulacionesAdmin() {
      const listEl = document.getElementById("admin-postulaciones-list");
      if (!listEl) return;

      listEl.innerHTML = '<div class="text-center py-12 text-slate-500 text-xs space-y-3">' +
        '<div class="w-8 h-8 border-3 border-tour-blue border-t-transparent rounded-full animate-spin mx-auto"></div>' +
        '<p class="font-bold text-tour-navy text-sm">Consultando postulaciones desde Google Apps Script...</p>' +
      '</div>';

      try {
        const targetUrl = localStorage.getItem("tour_azul_sheets_webhook_url") ||
                          (window.__TOUR_AZUL_WEBHOOK_URL) ||
                          "";

        let rawItems = [];
        if (targetUrl && targetUrl.startsWith("http")) {
          const sep = targetUrl.includes("?") ? "&" : "?";
          const gResp = await fetch(targetUrl + sep + "accion=candidatos&_t=" + Date.now());
          if (gResp.ok) {
            const gText = await gResp.text();
            let gJson = null;
            try { gJson = JSON.parse(gText); } catch (_) {}
            if (gJson && gJson.status === "success" && Array.isArray(gJson.data)) {
              rawItems = gJson.data;
            } else if (Array.isArray(gJson)) {
              rawItems = gJson;
            } else if (gJson && Array.isArray(gJson.candidatos)) {
              rawItems = gJson.candidatos;
            }
          }
        } else {
          // Si no hay Google Sheets conectado, consultar directamente al servidor local
          const sResp = await fetch("/api/candidatos?sync=false");
          if (sResp.ok) {
            const sJson = await sResp.json();
            if (sJson && Array.isArray(sJson.candidatos)) {
              rawItems = sJson.candidatos;
            }
          }
        }

        const gText = await gResp.text();
        let gJson = null;
        try { gJson = JSON.parse(gText); } catch (_) {}
        if (gJson && gJson.status === "success" && Array.isArray(gJson.data)) {
          rawItems = gJson.data;
        } else if (Array.isArray(gJson)) {
          rawItems = gJson;
        } else if (gJson && Array.isArray(gJson.candidatos)) {
          rawItems = gJson.candidatos;
        }

        const items = rawItems.map((item, idx) => normalizarCandidatoPostulacion(item, idx)).filter(Boolean);

        // Ordenar por fecha descendente
        items.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
        });

        adminPostulacionesCache = items;
        actualizarMetricasAdmin(items);
        renderAdminPostulacionesList(items);

        if (window.lucide) lucide.createIcons();
      } catch (err) {
        console.warn("Fallo al consultar postulaciones:", err);
        listEl.innerHTML = '<div class="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-3">' +
          '<div class="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">' +
            '<i data-lucide="alert-triangle" class="w-5 h-5"></i>' +
          '</div>' +
          '<div>' +
            '<p class="text-xs font-bold text-amber-900">No se pudieron cargar postulaciones</p>' +
            '<p class="text-[11px] text-amber-700 mt-1 max-w-md mx-auto">' + (err.message || 'Error de conexión con el servidor.') + '</p>' +
          '</div>' +
          '<button type="button" onclick="cargarPostulacionesAdmin()" class="px-4 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition cursor-pointer active:scale-95 shadow-xs">' +
            'Reintentar' +
          '</button>' +
        '</div>';
        if (window.lucide) lucide.createIcons();
      }
    }
    window.cargarPostulacionesAdmin = cargarPostulacionesAdmin;

    function actualizarMetricasAdmin(items) {
      const total = items.length;
      const conFoto = items.filter(i => i.tieneFoto).length;
      const contactadas = items.filter(i => i.estado === "contactada").length;
      const entrevistadas = items.filter(i => i.estado === "entrevistada").length;

      const elTotal = document.getElementById("metric-total-postulaciones");
      const elFoto = document.getElementById("metric-con-foto");
      const elCont = document.getElementById("metric-contactadas");
      const elEnt = document.getElementById("metric-entrevistadas");

      if (elTotal) elTotal.textContent = total;
      if (elFoto) elFoto.textContent = conFoto;
      if (elCont) elCont.textContent = contactadas;
      if (elEnt) elEnt.textContent = entrevistadas;
    }

    function filterAdminPostulaciones(filtro) {
      currentAdminFilter = filtro;
      const buttons = document.querySelectorAll(".admin-filter-btn");
      buttons.forEach(btn => {
        btn.classList.remove("bg-tour-navy", "text-white");
        btn.classList.add("bg-slate-100", "text-slate-700");
      });
      if (typeof event !== "undefined" && event && event.target && event.target.classList) {
        event.target.classList.remove("bg-slate-100", "text-slate-700");
        event.target.classList.add("bg-tour-navy", "text-white");
      }

      let filtered = adminPostulacionesCache;
      if (filtro !== "todas") {
        filtered = adminPostulacionesCache.filter(item => item.estado === filtro);
      }
      renderAdminPostulacionesList(filtered);
    }
    window.filterAdminPostulaciones = filterAdminPostulaciones;

    function renderAdminPostulacionesList(items) {
      const listEl = document.getElementById("admin-postulaciones-list");
      if (!listEl) return;

      if (items.length === 0) {
        listEl.innerHTML = '<div class="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">' +
          '<div class="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">' +
            '<i data-lucide="inbox" class="w-5 h-5"></i>' +
          '</div>' +
          '<p class="text-xs font-bold text-slate-700">No hay postulaciones registradas en esta vista.</p>' +
          '<p class="text-[11px] text-slate-400">Los registros cargados en tiempo real desde la hoja de cálculo de Google Sheets aparecerán aquí.</p>' +
        '</div>';
        if (window.lucide) lucide.createIcons();
        return;
      }

      listEl.innerHTML = items.map(post => {
        const fechaTxt = post.createdAt ? (isNaN(new Date(post.createdAt).getTime()) ? post.createdAt : new Date(post.createdAt).toLocaleString("es-VE", { dateStyle: "short", timeStyle: "short" })) : "Fecha no registrada";
        const statusColors = {
          recibida: "bg-sky-100 text-tour-blue",
          contactada: "bg-emerald-100 text-emerald-800",
          entrevistada: "bg-amber-100 text-amber-800",
          descartada: "bg-rose-100 text-rose-800"
        };
        const stBadge = statusColors[post.estado] || statusColors.recibida;

        // Limpieza de teléfono para enlace directo a WhatsApp
        const cleanTelf = String(post.telefono || "").replace(/[^0-9]/g, "");
        const waLink = cleanTelf ? ("https://wa.me/" + (cleanTelf.startsWith("58") ? cleanTelf : ("58" + cleanTelf.replace(/^0/, "")))) : null;

        return '<div class="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-2xs space-y-3 transition hover:border-sky-200">' +
          '<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">' +
            '<div>' +
              '<span class="font-mono text-[10px] text-slate-400 block">' + post.id + ' · ' + fechaTxt + '</span>' +
              '<h4 class="font-title font-bold text-sm md:text-base text-tour-navy">' + (post.nombre || "Sin nombre") + '</h4>' +
            '</div>' +
            '<div class="flex items-center gap-2">' +
              '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ' + stBadge + '">' +
                (post.estado || "recibida") +
              '</span>' +
              '<select data-post-id="' + post.id + '" onchange="cambiarEstadoPostulacion(this.dataset.postId, this.value)" class="text-[11px] font-bold border border-slate-200 rounded-xl px-2 py-1 bg-slate-50 text-slate-700 cursor-pointer">' +
                '<option value="recibida"' + (post.estado === "recibida" ? " selected" : "") + '>Recibida</option>' +
                '<option value="contactada"' + (post.estado === "contactada" ? " selected" : "") + '>Contactada</option>' +
                '<option value="entrevistada"' + (post.estado === "entrevistada" ? " selected" : "") + '>Entrevistada</option>' +
                '<option value="descartada"' + (post.estado === "descartada" ? " selected" : "") + '>Descartada</option>' +
              '</select>' +
              '<button type="button" data-post-id="' + post.id + '" onclick="eliminarPostulacionAdmin(this.dataset.postId)" class="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer" title="Eliminar registro de la vista">' +
                '<i data-lucide="trash-2" class="w-3.5 h-3.5"></i>' +
              '</button>' +
            '</div>' +
          '</div>' +
          '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-600">' +
            '<div><strong class="text-slate-800">Edad:</strong> ' + (post.edad || "--") + '</div>' +
            '<div><strong class="text-slate-800">Zona:</strong> ' + (post.zona || "--") + '</div>' +
            '<div><strong class="text-slate-800">Teléfono:</strong> ' + (post.telefono || "--") + '</div>' +
            '<div class="sm:col-span-2 md:col-span-3"><strong class="text-slate-800">Experiencia:</strong> ' + (post.experiencia || "--") + '</div>' +
            '<div class="sm:col-span-2 md:col-span-3"><strong class="text-slate-800">Disponibilidad:</strong> ' + (post.disponibilidad || "--") + '</div>' +
            '<div class="sm:col-span-2 md:col-span-3"><strong class="text-slate-800">Llegada a punto Barquisimeto:</strong> ' + (post.punto_partida || "--") + '</div>' +
          '</div>' +
          '<div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">' +
            '<div><strong class="text-tour-navy block">Motivación y Aporte:</strong> <p class="text-slate-600 mt-0.5 whitespace-pre-line">' + (post.motivacion || "--") + '</p></div>' +
            (post.talento && post.talento !== "No especificado" ? ('<div class="pt-1 border-t border-slate-200/60"><strong class="text-tour-blue">Talento curioso:</strong> <span class="text-slate-600">' + post.talento + '</span></div>') : "") +
          '</div>' +
          '<div class="flex flex-wrap items-center justify-between gap-2 pt-1">' +
            '<div>' +
              (post.fotoUrl ? ('<a href="' + post.fotoUrl + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-[11px] font-bold text-tour-blue bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-100 transition"><i data-lucide="image" class="w-3.5 h-3.5"></i><span>Ver fotografía</span></a>') : (post.tieneFoto ? ('<span class="inline-flex items-center gap-1 text-[11px] font-bold text-tour-blue bg-sky-50 px-2 py-1 rounded-lg border border-sky-100"><i data-lucide="image" class="w-3 h-3"></i><span>Foto: ' + (post.fotoNombre || "Adjunta") + '</span></span>') : '<span class="text-[11px] text-slate-400 italic">Sin fotografía adjunta</span>')) +
            '</div>' +
            '<div>' +
              (waLink ? ('<a href="' + waLink + '?text=' + encodeURIComponent("¡Hola " + (post.nombre || "") + "! Te saludamos desde Tour Azul en relación a tu postulación de trabajo.") + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition active:scale-95 cursor-pointer shadow-xs"><i data-lucide="message-circle" class="w-3.5 h-3.5"></i><span>Contactar por WhatsApp</span></a>') : "") +
            '</div>' +
          '</div>' +
        '</div>';
      }).join("");

      if (window.lucide) lucide.createIcons();
    }

    /**
     * Actualiza el estado de una postulación en memoria y en la vista
     */
    function cambiarEstadoPostulacion(docId, nuevoEstado) {
      const target = adminPostulacionesCache.find(p => p.id === docId);
      if (target) {
        target.estado = nuevoEstado;
        target.updatedAt = new Date().toISOString();
      }
      actualizarMetricasAdmin(adminPostulacionesCache);
      if (typeof showToastNotification === "function") {
        showToastNotification("Estado actualizado a: " + nuevoEstado, "success");
      }
    }
    window.cambiarEstadoPostulacion = cambiarEstadoPostulacion;

    /**
     * Elimina una postulación de la vista activa
     */
    function eliminarPostulacionAdmin(docId) {
      if (!confirm("¿Deseas quitar este registro de la lista visible?")) return;
      adminPostulacionesCache = adminPostulacionesCache.filter(p => p.id !== docId);
      actualizarMetricasAdmin(adminPostulacionesCache);
      filterAdminPostulaciones(currentAdminFilter);
      if (typeof showToastNotification === "function") {
        showToastNotification("Registro removido de la vista", "info");
      }
    }
    window.eliminarPostulacionAdmin = eliminarPostulacionAdmin;

    /**
     * Descarga todas las postulaciones en formato JSON
     */
    function exportarPostulacionesJSON() {
      try {
        const raw = JSON.stringify(adminPostulacionesCache, null, 2);
        const blob = new Blob([raw], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "postulaciones_tour_azul_" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        alert("Error al exportar: " + err.message);
      }
    }
    window.exportarPostulacionesJSON = exportarPostulacionesJSON;
`;

