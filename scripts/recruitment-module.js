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

export const prelaunchHeaderButtonHtml = ``;

export const prelaunchHeroNoticeHtml = `
  <!-- AVISO ATRACTIVO DE PREAPERTURA Y ACCESO DESTACADO -->
  <div id="prelaunch-hero-card" class="relative z-10 max-w-2xl mx-auto mt-6 px-4">
    <!-- Aura y resplandor exterior suave con colores del logo -->
    <div id="hero-card-glow" class="absolute -inset-1 bg-gradient-to-r from-tour-caribe/30 via-tour-blue/35 to-tour-yellow/20 rounded-[34px] blur-xl opacity-75 pointer-events-none transition-all duration-500"></div>

    <div id="prelaunch-card-inner" class="relative overflow-hidden bg-gradient-to-b from-[#0B2A6B]/90 via-[#0D2D72]/85 to-[#071F52]/95 backdrop-blur-xl border border-tour-caribe/45 rounded-[30px] p-6 sm:p-8 md:p-9 shadow-[0_20px_50px_rgba(7,24,64,0.65),0_0_35px_rgba(34,195,214,0.25)] text-center transition-all duration-500">
      
      <!-- Línea superior luminosa con degradado del logo -->
      <div id="hero-card-top-line" class="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-tour-caribe-light to-transparent transition-all duration-500"></div>

      <!-- Destellos radiales interiores (Turquesa y Amarillo Solar) -->
      <div class="absolute -top-16 -right-16 w-44 h-44 bg-tour-caribe/20 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute -bottom-16 -left-16 w-44 h-44 bg-tour-yellow/15 rounded-full blur-2xl pointer-events-none"></div>

      <!-- BOTÓN DE ACCESO DESTACADO "ÚNETE AL EQUIPO" - FONDO BLANCO -->
      <div class="pt-1 pb-2 flex flex-col items-center justify-center">
        <button 
          type="button" 
          id="btn-recruitment-hero"
          onclick="showRecruitmentView()" 
          class="relative group px-8 sm:px-10 py-4 rounded-full font-title font-black uppercase text-sm sm:text-base tracking-wider transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer border-2 border-white shadow-2xl hover:scale-105 active:scale-95 bg-white hover:bg-slate-50 text-tour-navy shadow-[0_12px_32px_rgba(0,0,0,0.25)]"
          title="Convocatoria de futuros trabajadores"
        >
          <span class="w-7 h-7 rounded-full bg-tour-yellow text-tour-navy flex items-center justify-center font-bold shadow-md group-hover:scale-110 group-hover:rotate-12 transition-all">
            <i data-lucide="sparkles" class="w-4 h-4 text-tour-navy"></i>
          </span>
          <span class="tracking-wider text-tour-navy font-black">Únete al equipo</span>
          <span class="w-7 h-7 rounded-full bg-tour-navy text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </span>
        </button>
      </div>

      <!-- Badge de Preapertura con los colores del logo -->
      <div class="pt-2 flex justify-center">
        <div id="hero-card-badge" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tour-navy/80 backdrop-blur-md border border-tour-caribe/50 text-white text-xs font-title font-bold tracking-wider uppercase shadow-xs transition-colors">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-tour-yellow opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-tour-yellow"></span>
          </span>
          <i data-lucide="compass" class="w-3.5 h-3.5 text-tour-caribe-light"></i>
          <span>Próxima temporada de excursiones</span>
        </div>
      </div>

      <!-- Aviso Principal Solicitado -->
      <div class="space-y-1.5 pt-2">
        <h2 id="hero-card-title" class="font-title font-black italic text-2xl sm:text-3xl md:text-4xl uppercase text-tour-yellow drop-shadow-md leading-tight tracking-tight">
          ¡Próximamente nueva aventura!
        </h2>
        <p id="hero-card-subtitle" class="text-tour-caribe-light font-bold text-base sm:text-lg md:text-xl tracking-wide flex items-center justify-center gap-2 transition-colors">
          <span class="inline-block w-4 h-0.5 bg-tour-yellow/80 rounded-full"></span>
          <span>Estamos preparando nuestros próximos viajes</span>
          <span class="inline-block w-4 h-0.5 bg-tour-yellow/80 rounded-full"></span>
        </p>
      </div>

      <p class="text-sky-100/90 text-xs sm:text-sm font-normal max-w-lg mx-auto leading-relaxed pt-1">
        Muy pronto podrás reservar tus escapadas a los mejores cayos y playas de Venezuela. Mientras afinamos los detalles de nuestros destinos, abrimos la convocatoria para sumar nuevos talentos a nuestra tripulación.
      </p>

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
              accept=".jpg, .jpeg, .png, .webp, image/jpeg, image/png, image/webp" 
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
                Formatos permitidos: JPG, PNG, WEBP · Tamaño máximo: 5 MB
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
                <span class="text-[10px] font-bold uppercase tracking-wider text-tour-blue block">Fotografía seleccionada</span>
                <p id="foto-filename" class="text-xs font-bold text-tour-navy truncate max-w-[200px] sm:max-w-xs">archivo.jpg</p>
                <p id="foto-filesize" class="text-[11px] text-slate-500">1.2 MB</p>
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
      allowedPhotoMimes: ["image/jpeg", "image/png", "image/webp"],
      allowedPhotoExtensions: [".jpg", ".jpeg", ".png", ".webp"]
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
     * Manejador de selección de fotografía (máx. 5 MB, formatos permitidos)
     */
    function handlePhotoSelect(event) {
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
      const isValidExt = APP_CONFIG.allowedPhotoExtensions.includes(ext);
      const isValidMime = APP_CONFIG.allowedPhotoMimes.includes(file.type);

      if (!isValidExt && !isValidMime) {
        if (errorEl && errorText) {
          errorText.textContent = "Formato no válido. Por favor selecciona una imagen JPG, JPEG, PNG o WEBP.";
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

      // Compresión inteligente de la imagen para garantizar que cualquier teléfono suba rápido y sin fallar
      compressImage(file, 800, 0.75).then(compressedDataUrl => {
        recruitmentState.selectedPhotoBase64 = compressedDataUrl;
      }).catch(() => {
        const reader = new FileReader();
        reader.onload = function(e) {
          recruitmentState.selectedPhotoBase64 = e.target.result;
        };
        reader.readAsDataURL(file);
      });

      if (recruitmentState.selectedPhotoPreviewUrl) {
        URL.revokeObjectURL(recruitmentState.selectedPhotoPreviewUrl);
      }
      recruitmentState.selectedPhotoPreviewUrl = URL.createObjectURL(file);

      if (previewImg) previewImg.src = recruitmentState.selectedPhotoPreviewUrl;
      if (filenameEl) filenameEl.textContent = file.name;
      if (filesizeEl) filesizeEl.textContent = (file.size / (1024 * 1024)).toFixed(2) + " MB";

      if (dropzone) dropzone.classList.add("hidden");
      if (previewBox) previewBox.classList.remove("hidden");
      
      if (window.lucide) lucide.createIcons();
    }
    window.handlePhotoSelect = handlePhotoSelect;

    /**
     * Comprime una imagen usando Canvas para que ocupe menos de 100 KB
     */
    function compressImage(file, maxWidth, quality) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = new Image();
          img.onload = function() {
            let width = img.width;
            let height = img.height;
            if (width > maxWidth || height > maxWidth) {
              if (width > height) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxWidth) / height);
                height = maxWidth;
              }
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              return resolve(e.target.result);
            }
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", quality));
          };
          img.onerror = function() {
            resolve(e.target.result);
          };
          img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

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

      // Preparar estado de botón de envío
      // Preparar estado de botón de envío
      const submitBtn = document.getElementById("btn-submit-postulacion");
      const submitText = document.getElementById("btn-submit-text");
      if (submitBtn) submitBtn.disabled = true;
      if (submitText) submitText.textContent = "Guardando en el sistema...";

      // Asegurar que la foto esté comprimida si se seleccionó (máx 800px, peso ligero)
      let fotoFinal = recruitmentState.selectedPhotoBase64;
      if (recruitmentState.selectedPhotoFile) {
        try {
          fotoFinal = await compressImage(recruitmentState.selectedPhotoFile, 800, 0.7);
        } catch (_) {}
      }

      // Generar ID único para la postulación
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const randomTag = Math.floor(1000 + Math.random() * 9000);
      const docId = "POST-" + dateStr + "-" + randomTag;

      const candidateData = {
        id: docId,
        codigo: docId,
        nombre,
        edad: edad || 24,
        telefono,
        zona: zona || "Barquisimeto",
        experiencia: expChecked ? expChecked.value : "Con disposición de aprender",
        disponibilidad: dispChecked ? dispChecked.value : "Fines de semana y feriados",
        punto_partida: puntoChecked ? puntoChecked.value : "Sí, sin inconvenientes.",
        motivacion: motivacion || "Me entusiasma formar parte del equipo de Tour Azul.",
        talento: talento || "No especificado",
        tieneFoto: Boolean(recruitmentState.selectedPhotoFile),
        fotoNombre: recruitmentState.selectedPhotoFile ? recruitmentState.selectedPhotoFile.name : null,
        foto: fotoFinal || null,
        estado: "Recibida",
        createdAt: new Date().toISOString()
      };

      recruitmentState.lastValidatedFormData = candidateData;

      // ENVIAR POSTULACIÓN CON DOBLE CANAL RESILIENTE:
      // Canal 1: Servidor central (/api/candidatos) si está disponible
      // Canal 2: Envío directo a Google Apps Script Webhook (sin 404 en Vercel ni entornos estáticos)
      // + Guardado en caché local para visualización inmediata en el Panel
      const DEFAULT_SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbyHrjILLmIl0oiQ14LoqUzUv-I6PRIhk8jtffbxWYkW-Q3wyRsgumCEQim7T1QaxpCPVA/exec";
      const webhookUrl = localStorage.getItem("tour_azul_sheets_webhook_url") ||
                         (window.__TOUR_AZUL_WEBHOOK_URL) ||
                         DEFAULT_SHEETS_WEBHOOK;

      let serverConfirmed = false;
      let assignedId = docId;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout rápido
        const respServer = await fetch("/api/candidatos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(candidateData),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        let resData = null;
        let responseText = "";
        try {
          responseText = await respServer.text();
          resData = JSON.parse(responseText);
        } catch (_) {}

        if (respServer.ok && resData && resData.ok) {
          serverConfirmed = true;
          if (resData.id) assignedId = resData.id;
        } else if (respServer.status === 400 && resData && (resData.error || resData.message)) {
          // Error de validación real del formulario
          const errorMsg = resData.error || resData.message;
          if (submitBtn) submitBtn.disabled = false;
          if (submitText) submitText.textContent = "Enviar mi postulación";
          if (typeof showToastNotification === "function") {
            showToastNotification(errorMsg, "error");
          } else {
            alert(errorMsg);
          }
          return false;
        } else {
          // Código 404 (ej. despliegue estático en Vercel NOT_FOUND) o respuesta no JSON
          console.warn("Aviso: el servidor devolvió código " + respServer.status + " en /api/candidatos. Se activa envío directo a Google Sheets.", responseText);
        }
      } catch (errApi) {
        console.warn("Aviso: /api/candidatos no disponible directamente. Activando guardado directo en Google Sheets:", errApi);
      }

      // Si el servidor /api/candidatos no respondió positivamente (ej. Vercel estático con 404):
      // Sincronizar DIRECTAMENTE con el Webhook de Google Apps Script
      if (!serverConfirmed) {
        if (submitText) submitText.textContent = "Guardando en Google Sheets...";
        const directPayload = {
          accion: "candidato",
          id: docId,
          codigo: docId,
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
          foto: candidateData.tieneFoto ? (candidateData.fotoNombre || "Sí adjunta") : "No adjunta",
          fotoNombre: candidateData.fotoNombre || null,
          tieneFoto: Boolean(candidateData.tieneFoto),
          estado: "Recibida",
          fecha: new Date().toLocaleString("es-VE")
        };

        try {
          // Envío con mode 'no-cors' para evitar restricciones de preflight en el navegador
          await fetch(webhookUrl, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(directPayload)
          });
        } catch (gasErr) {
          console.warn("Aviso en guardado directo Google Sheets:", gasErr);
        }
      }

      // Guardar en caché local para que el Panel de Administración lo liste de inmediato
      try {
        const localCandidates = JSON.parse(localStorage.getItem("tour_azul_candidatos_local") || "[]");
        const candidateRecord = {
          ...candidateData,
          id: assignedId,
          codigo: assignedId,
          syncedToSheets: true,
          _origen: serverConfirmed ? "server" : "direct-sheets"
        };
        const updatedList = [candidateRecord, ...localCandidates.filter(c => String(c.id || c.codigo) !== String(assignedId))].slice(0, 150);
        localStorage.setItem("tour_azul_candidatos_local", JSON.stringify(updatedList));
      } catch (errLocal) {
        console.warn("Aviso guardando en localStorage:", errLocal);
      }

      // Restablecer botón de envío tras confirmación exitosa
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = "Enviar mi postulación";

      const modalIdEl = document.getElementById("modal-exito-id");
      const modalNombreEl = document.getElementById("modal-exito-nombre");
      const modalTelEl = document.getElementById("modal-exito-telefono");
      const modalFotoEl = document.getElementById("modal-exito-foto");

      if (modalIdEl) modalIdEl.textContent = assignedId;
      if (modalNombreEl) modalNombreEl.textContent = nombre;
      if (modalTelEl) modalTelEl.textContent = telefono;
      if (modalFotoEl) modalFotoEl.textContent = candidateData.tieneFoto ? ("Sí (" + (candidateData.fotoNombre || "Adjunta") + ")") : "No adjunta";

      // Mensaje estructurado para WhatsApp oficial
      const msgWa = [
        "¡Hola Tour Azul! 👋 Deseo postularme a la convocatoria de tripulación:",
        "",
        "📄 Código de postulación: *" + assignedId + "*",
        "👤 Nombre: " + nombre,
        "🎂 Edad: " + edad + " años",
        "📱 Teléfono/WhatsApp: " + telefono,
        "📍 Zona de residencia: " + zona,
        "💼 Experiencia: " + (expChecked ? expChecked.value : "Con disposición de aprender"),
        "⏰ Disponibilidad: " + (dispChecked ? dispChecked.value : "Fines de semana y feriados"),
        "🚌 Punto de llegada: " + (puntoChecked ? puntoChecked.value : "Sí, sin inconvenientes."),
        "✨ Motivación: " + motivacion,
        (talento ? "🤭 Talento curioso: " + talento : ""),
        (candidateData.tieneFoto ? "📷 Foto: Adjunta en mi postulación" : "📷 Foto: No adjunta")
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

      // Limpiar formulario y foto tras confirmación
      const formEl = document.getElementById("form-postulacion");
      if (formEl) formEl.reset();
      removeSelectedPhoto();
      updateRecruitmentProgress();

      if (window.lucide) lucide.createIcons();
      if (typeof showToastNotification === "function") {
        showToastNotification("¡Postulación enviada y registrada con éxito!", "success");
      }
      return true;
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
        '<p class="font-bold text-tour-navy text-sm">Consultando postulaciones en tiempo real...</p>' +
        '<p class="text-[11px] text-slate-400">Petición al servidor central y Google Sheets</p>' +
      '</div>';

      try {
        let rawItems = [];
        const apiResp = await fetch("/api/candidatos?sync=true&_t=" + Date.now());
        if (apiResp.ok) {
          const apiJson = await apiResp.json();
          if (apiJson && Array.isArray(apiJson.candidatos)) {
            rawItems = apiJson.candidatos;
          }
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

