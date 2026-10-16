/**
 * TOUR AZUL - MÓDULO DE PREAPERTURA Y CONVOCATORIA DE TRABAJADORES
 * «¡Únete a la aventura con Tour Azul!»
 * 
 * Este módulo gestiona de forma aislada:
 * 1. La configuración centralizada de preapertura (prelaunchMode).
 * 2. El aviso atractivo y botón destacado en portada.
 * 3. La sección completa de captación de trabajadores con la introducción obligatoria y las 10 preguntas.
 * 4. La interfaz de previsualización local y validación de fotografía (sin subida externa).
 * 5. La validación en frontend y modal de confirmación honesto (sin guardado permanente en esta etapa).
 */

export const prelaunchHeaderButtonHtml = `
  <!-- Acceso destacado: Únete al equipo (Cabecera) -->
  <button 
    type="button" 
    id="btn-nav-equipo" 
    onclick="showRecruitmentView()" 
    class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-tour-blue to-tour-caribe text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
    title="Convocatoria de futuros trabajadores"
  >
    <i data-lucide="sparkles" class="w-3.5 h-3.5 text-tour-yellow"></i>
    <span>Únete al equipo</span>
  </button>
`;

export const prelaunchHeroNoticeHtml = `
  <!-- AVISO ATRACTIVO DE PREAPERTURA Y ACCESO DESTACADO -->
  <div id="prelaunch-hero-card" class="relative z-10 max-w-2xl mx-auto mt-6 px-4">
    <div class="bg-white/15 backdrop-blur-md border border-white/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4 text-center animate-float">
      <!-- Badge de Preapertura -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tour-yellow text-tour-navy text-xs font-title font-black tracking-wider uppercase shadow-md">
        <i data-lucide="compass" class="w-4 h-4 text-tour-blue"></i>
        <span>Próxima temporada de excursiones</span>
      </div>

      <!-- Aviso Principal Solicitado -->
      <h2 class="font-title font-black italic text-2xl md:text-3xl uppercase text-white drop-shadow-sm leading-snug">
        ¡Próximamente nuevas aventuras!<br>
        <span class="text-tour-caribe-light font-normal not-italic text-lg md:text-xl block mt-1">
          Estamos preparando nuestros próximos viajes
        </span>
      </h2>

      <p class="text-sky-100 text-xs md:text-sm font-medium max-w-lg mx-auto leading-relaxed">
        Muy pronto podrás reservar tus escapadas a los mejores cayos y playas de Venezuela. Mientras afinamos los detalles de nuestros destinos, abrimos la convocatoria para sumar nuevos talentos a nuestra tripulación.
      </p>

      <!-- Botón de Acceso Destacado "Únete al equipo" -->
      <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button 
          type="button" 
          onclick="showRecruitmentView()" 
          class="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-sky-50 text-tour-navy font-title font-black uppercase text-sm tracking-wider shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
        >
          <i data-lucide="sparkles" class="w-4 h-4 text-tour-blue group-hover:rotate-12 transition-transform"></i>
          <span>Únete al equipo</span>
          <i data-lucide="arrow-right" class="w-4 h-4 text-tour-caribe"></i>
        </button>

        <a 
          href="https://wa.me/584126571155?text=%C2%A1Hola%20Tour%20Azul!%20Quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20la%20preapertura%20y%20el%20equipo." 
          target="_blank" 
          rel="noopener noreferrer"
          class="hidden w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs tracking-wide border border-white/20 transition-all items-center justify-center gap-2 cursor-pointer"
        >
          <i data-lucide="message-circle" class="w-4 h-4 text-emerald-400"></i>
          <span>Consultas por WhatsApp</span>
        </a>
      </div>
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

        <!-- Indicador de preguntas completadas -->
        <div class="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span class="hidden sm:inline">Progreso:</span>
          <div class="w-24 sm:w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div id="recruitment-progress-bar" class="h-full bg-gradient-to-r from-tour-blue to-tour-caribe w-0 transition-all duration-300"></div>
          </div>
          <span id="recruitment-progress-text" class="font-bold text-tour-blue">0/8</span>
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
            Buscamos personas dinámicas, responsables, proactivas y con buena actitud para acompañar a nuestros pasajeros en excursiones a distintos destinos de Venezuela.
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
        
        <!-- ========================================== -->
        <!-- PREGUNTA 1: Nombres y apellidos -->
        <!-- ========================================== -->
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

        <!-- ========================================== -->
        <!-- PREGUNTA 2: ¿Qué edad tienes? -->
        <!-- ========================================== -->
        <div id="q-card-edad" class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90 transition-all focus-within:border-tour-blue focus-within:ring-2 focus-within:ring-sky-100">
          <div class="flex items-center justify-between mb-2">
            <label for="postulacion-edad" class="font-title font-bold text-sm md:text-base text-tour-navy block">
              Pregunta 2. ¿Qué edad tienes? <span class="text-rose-500">*</span>
            </label>
            <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Respuesta corta</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">Ingresa solo el número de tus años cumplidos (ej. 23).</p>
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
            <span>Por favor, introduce una edad numérica razonable (entre 16 y 80 años).</span>
          </p>
        </div>

        <!-- ========================================== -->
        <!-- PREGUNTA 3: Número de teléfono y WhatsApp -->
        <!-- ========================================== -->
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

        <!-- ========================================== -->
        <!-- PREGUNTA 4: ¿En qué zona de Barquisimeto o sus alrededores resides? -->
        <!-- ========================================== -->
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
            placeholder="Ej. Cabudare Centro / Los Cardones / Zona Este" 
            oninput="updateRecruitmentProgress(); clearFieldError('zona')" 
            class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tour-blue text-xs md:text-sm text-slate-800 transition bg-slate-50/40 focus:bg-white"
          >
          <p id="error-zona" class="hidden text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            <span>Por favor, especifica la zona o sector donde resides.</span>
          </p>
        </div>

        <!-- ========================================== -->
        <!-- PREGUNTA 5: Experiencia -->
        <!-- ========================================== -->
        <div id="q-card-experiencia" class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90 transition-all">
          <div class="flex items-center justify-between mb-2">
            <label class="font-title font-bold text-sm md:text-base text-tour-navy block">
              Pregunta 5. ¿Tienes experiencia en turismo, atención al cliente, recreación o actividades similares? <span class="text-rose-500">*</span>
            </label>
            <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Selección única</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">Selecciona la opción que mejor describa tu trayectoria.</p>
          
          <div class="space-y-2.5">
            <!-- Opción 1 -->
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="experiencia" value="Sí, tengo experiencia." onchange="handleRadioSelect(this, 'experiencia')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">Sí, tengo experiencia.</span>
            </label>
            <!-- Opción 2 -->
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="experiencia" value="Tengo algo de experiencia." onchange="handleRadioSelect(this, 'experiencia')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">Tengo algo de experiencia.</span>
            </label>
            <!-- Opción 3 -->
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

        <!-- ========================================== -->
        <!-- PREGUNTA 6: Disponibilidad fines de semana y feriados -->
        <!-- ========================================== -->
        <div id="q-card-disponibilidad" class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90 transition-all">
          <div class="flex items-center justify-between mb-2">
            <label class="font-title font-bold text-sm md:text-base text-tour-navy block">
              Pregunta 6. ¿Tienes disponibilidad para trabajar sábados, domingos y días feriados? <span class="text-rose-500">*</span>
            </label>
            <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Selección única</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">La mayoría de nuestras excursiones turísticas se realizan durante los fines de semana.</p>

          <div class="space-y-2.5">
            <!-- Opción 1 -->
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="disponibilidad" value="Sí, tengo disponibilidad." onchange="handleRadioSelect(this, 'disponibilidad')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">Sí, tengo disponibilidad.</span>
            </label>
            <!-- Opción 2 -->
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="disponibilidad" value="Tengo disponibilidad parcial." onchange="handleRadioSelect(this, 'disponibilidad')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">Tengo disponibilidad parcial.</span>
            </label>
            <!-- Opción 3 -->
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

        <!-- ========================================== -->
        <!-- PREGUNTA 7: Punto de partida Barquisimeto -->
        <!-- ========================================== -->
        <div id="q-card-punto_partida" class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-200/90 transition-all">
          <div class="flex items-center justify-between mb-2">
            <label class="font-title font-bold text-sm md:text-base text-tour-navy block">
              Pregunta 7. ¿Puedes llegar al punto de partida de los buses en Barquisimeto según el horario de cada excursión? <span class="text-rose-500">*</span>
            </label>
            <span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Selección única</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">Nuestras salidas inician habitualmente en la madrugada o primeras horas de la mañana.</p>

          <div class="space-y-2.5">
            <!-- Opción 1 -->
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="punto_partida" value="Sí, sin inconvenientes." onchange="handleRadioSelect(this, 'punto_partida')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">Sí, sin inconvenientes.</span>
            </label>
            <!-- Opción 2 -->
            <label class="postulacion-radio-label flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition cursor-pointer">
              <input type="radio" name="punto_partida" value="Sí, pero necesito conocer el horario con anticipación." onchange="handleRadioSelect(this, 'punto_partida')" class="w-4 h-4 text-tour-blue focus:ring-tour-blue">
              <span class="text-xs md:text-sm font-medium text-slate-700">Sí, pero necesito conocer el horario con anticipación.</span>
            </label>
            <!-- Opción 3 -->
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

        <!-- ========================================== -->
        <!-- PREGUNTA 8: Motivación y aporte -->
        <!-- ========================================== -->
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
            placeholder="Me gustaría formar parte de Tour Azul porque me apasiona viajar y hacer que las personas disfruten cada momento..." 
            oninput="updateRecruitmentProgress(); clearFieldError('motivacion')" 
            class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tour-blue text-xs md:text-sm text-slate-800 transition bg-slate-50/40 focus:bg-white resize-y"
          ></textarea>
          <p id="error-motivacion" class="hidden text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            <span>Por favor, cuéntanos tus motivos y qué puedes aportar a Tour Azul.</span>
          </p>
        </div>

        <!-- ========================================== -->
        <!-- PREGUNTA 9: Fotografía (Opcional, Local Preview) -->
        <!-- ========================================== -->
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

        <!-- ========================================== -->
        <!-- PREGUNTA 10: Talento más inútil o extraño -->
        <!-- ========================================== -->
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

          <!-- Botón de Envío Requerido -->
          <button 
            type="submit" 
            id="btn-submit-postulacion" 
            class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-tour-blue via-blue-600 to-tour-caribe hover:opacity-95 text-white font-title font-black uppercase text-xs md:text-sm tracking-wider shadow-xl hover:shadow-2xl transition-all active:scale-95 cursor-pointer order-1 sm:order-2 flex items-center justify-center gap-2.5 group"
          >
            <i data-lucide="send" class="w-4 h-4 text-tour-yellow group-hover:translate-x-0.5 transition-transform"></i>
            <span>Enviar mi postulación</span>
          </button>
        </div>

      </form>
    </div>
  </section>
`;

export const recruitmentModalsHtml = `
  <!-- MODAL DE CONFIRMACIÓN PROVISIONAL HONESTO (ETAPA DE PREAPERTURA) -->
  <div id="modal-postulacion-provisional" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md hidden items-center justify-center p-4 overflow-y-auto">
    <div class="max-w-lg w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 my-8 relative border border-sky-100 animate-float text-center">
      
      <!-- Icono Ilustrativo -->
      <div class="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-100 to-blue-50 text-tour-blue flex items-center justify-center mx-auto shadow-inner border border-sky-200">
        <i data-lucide="sparkles" class="w-8 h-8 text-tour-blue"></i>
      </div>

      <!-- Badge de Preapertura -->
      <span class="inline-block px-3.5 py-1 rounded-full bg-sky-100 text-tour-navy text-[11px] font-bold uppercase tracking-wider">
        Fase de preapertura · En preparación
      </span>

      <!-- Título de Verificación -->
      <div>
        <h3 class="font-title font-black text-2xl uppercase text-tour-navy tracking-tight leading-snug">
          ¡Formulario completado correctamente!
        </h3>
        <p class="font-script text-xl text-tour-caribe mt-0.5">
          Gracias por querer ser parte de Tour Azul 💙
        </p>
      </div>

      <!-- Aviso Honesto Requerido (Sin simulación de éxito falso) -->
      <div class="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/80 text-left text-xs text-slate-700 space-y-2.5 leading-relaxed">
        <div class="flex items-center gap-2 font-bold text-tour-navy">
          <i data-lucide="info" class="w-4 h-4 text-tour-blue shrink-0"></i>
          <span>Aviso importante sobre el estado de postulación:</span>
        </div>
        <p>
          Esta aplicación se encuentra actualmente en su <strong>etapa de preapertura</strong> y estamos preparando la infraestructura de almacenamiento y base de datos para la recepción definitiva de postulaciones.
        </p>
        <p>
          Tus respuestas han sido <strong>validadas con éxito en tu navegador</strong> y se mantendrán intactas en el formulario para que puedas revisarlas o modificarlas en cualquier momento.
        </p>
        <p class="text-[11px] text-slate-500 pt-1 border-t border-sky-200/60">
          El envío definitivo y almacenamiento oficial estará activo en cuanto concluyamos la configuración técnica del sistema. ¡Nos pondremos en contacto tan pronto comiencen las entrevistas!
        </p>
      </div>

      <!-- Resumen rápido de datos ingresados -->
      <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1">
        <div class="flex justify-between items-center text-slate-500">
          <span>Candidato(a):</span>
          <strong id="modal-candidato-nombre" class="text-tour-navy font-bold truncate max-w-[200px]">--</strong>
        </div>
        <div class="flex justify-between items-center text-slate-500">
          <span>Contacto WhatsApp:</span>
          <strong id="modal-candidato-telefono" class="text-tour-navy font-bold">--</strong>
        </div>
        <div class="flex justify-between items-center text-slate-500">
          <span>Fotografía adjunta:</span>
          <strong id="modal-candidato-foto" class="text-emerald-600 font-bold">No adjunta</strong>
        </div>
      </div>

      <!-- Botones de Acción del Modal -->
      <div class="space-y-2 pt-2">
        <button 
          type="button" 
          onclick="closeRecruitmentProvisionalModal()" 
          class="w-full py-3.5 rounded-2xl bg-tour-blue hover:bg-blue-700 text-white font-title font-black uppercase text-xs tracking-wider shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <i data-lucide="edit-3" class="w-4 h-4"></i>
          <span>Revisar mis respuestas en el formulario</span>
        </button>

        <a 
          id="btn-modal-wa-reclutamiento" 
          href="https://wa.me/584126571155" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="hidden w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-title font-bold text-xs uppercase tracking-wider shadow-md transition items-center justify-center gap-2 cursor-pointer"
        >
          <i data-lucide="message-circle" class="w-4 h-4"></i>
          <span>Escribir al WhatsApp oficial</span>
        </a>

        <button 
          type="button" 
          onclick="closeRecruitmentProvisionalModal(); showHomeView()" 
          class="w-full py-2.5 text-xs text-slate-500 hover:text-tour-navy font-bold transition cursor-pointer"
        >
          Volver a la portada principal
        </button>
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

    // Estado aislado para el formulario de postulación
    const recruitmentState = {
      currentView: "home", // "home" | "recruitment"
      selectedPhotoFile: null,
      selectedPhotoPreviewUrl: null,
      lastValidatedFormData: null
    };

    /**
     * Aplica el modo de preapertura en la portada:
     * Oculta temporalmente los accesos públicos para consultar destinos y reservar,
     * sin borrar el código de viajes, calendario ni lógica de reservas.
     */
    function applyPrelaunchModeUI() {
      const isPrelaunch = Boolean(APP_CONFIG.prelaunchMode);
      
      // 1. Botón "Ver viajes" en el Hero
      const heroCtaContainer = document.querySelector(".hero-gradient .pt-4");
      if (heroCtaContainer) {
        if (isPrelaunch) {
          heroCtaContainer.classList.add("hidden");
        } else {
          heroCtaContainer.classList.remove("hidden");
        }
      }

      // 2. Destinos Populares Chips en el Hero
      const heroChipsSection = document.getElementById("hero-chips") ? document.getElementById("hero-chips").closest(".relative.z-10.mt-10") : null;
      if (heroChipsSection) {
        if (isPrelaunch) {
          heroChipsSection.classList.add("hidden");
        } else {
          heroChipsSection.classList.remove("hidden");
        }
      }

      // 3. Sección "Viajes Destacados"
      const featuredSec = document.getElementById("viajes-destacados");
      if (featuredSec) {
        if (isPrelaunch) {
          featuredSec.classList.add("hidden");
        } else {
          featuredSec.classList.remove("hidden");
        }
      }

      // 4. Sección "Viajes del Mes" y Calendario
      const viajesSec = document.getElementById("viajes");
      if (viajesSec) {
        if (isPrelaunch) {
          viajesSec.classList.add("hidden");
        } else {
          viajesSec.classList.remove("hidden");
        }
      }

      // 5. Mostrar u ocultar la tarjeta de aviso de preapertura en el Hero
      const prelaunchHeroCard = document.getElementById("prelaunch-hero-card");
      if (prelaunchHeroCard) {
        if (isPrelaunch) {
          prelaunchHeroCard.classList.remove("hidden");
        } else {
          prelaunchHeroCard.classList.add("hidden");
        }
      }

      // 6. Botón de la cabecera
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

      // Actualizar hash de URL sin recargar para navegación limpia
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

    // Escuchar el evento popstate para soportar el botón Atrás del navegador
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
     * Limpia el mensaje de error de un campo cuando el usuario escribe o selecciona
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
     * Actualiza la barra de progreso del formulario según campos obligatorios completados
     */
    function updateRecruitmentProgress() {
      let completedCount = 0;
      const totalRequired = 8;

      // 1. Nombre
      const nombre = (document.getElementById("postulacion-nombre")?.value || "").trim();
      if (nombre.length >= 3) completedCount++;

      // 2. Edad
      const edadVal = parseInt(document.getElementById("postulacion-edad")?.value, 10);
      if (!isNaN(edadVal) && edadVal >= 16 && edadVal <= 80) completedCount++;

      // 3. Teléfono
      const telf = (document.getElementById("postulacion-telefono")?.value || "").trim();
      if (telf.length >= 7) completedCount++;

      // 4. Zona
      const zona = (document.getElementById("postulacion-zona")?.value || "").trim();
      if (zona.length >= 2) completedCount++;

      // 5. Experiencia
      const exp = document.querySelector('input[name="experiencia"]:checked');
      if (exp) completedCount++;

      // 6. Disponibilidad
      const disp = document.querySelector('input[name="disponibilidad"]:checked');
      if (disp) completedCount++;

      // 7. Punto de partida
      const punto = document.querySelector('input[name="punto_partida"]:checked');
      if (punto) completedCount++;

      // 8. Motivación
      const motiv = (document.getElementById("postulacion-motivacion")?.value || "").trim();
      if (motiv.length >= 10) completedCount++;

      // Actualizar UI
      const percent = Math.round((completedCount / totalRequired) * 100);
      const bar = document.getElementById("recruitment-progress-bar");
      const text = document.getElementById("recruitment-progress-text");
      if (bar) bar.style.width = \`\${percent}%\`;
      if (text) text.textContent = \`\${completedCount}/\${totalRequired}\`;
    }
    window.updateRecruitmentProgress = updateRecruitmentProgress;

    /**
     * Manejador de selección de fotografía (previsualización local aislada)
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

      // Validar formato
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

      // Validar tamaño (máximo 5 MB)
      if (file.size > APP_CONFIG.maxPhotoSizeBytes) {
        if (errorEl && errorText) {
          errorText.textContent = \`El archivo supera el límite de 5 MB (tamaño actual: \${(file.size / (1024 * 1024)).toFixed(1)} MB).\`;
          errorEl.classList.remove("hidden");
        }
        event.target.value = "";
        return;
      }

      // Archivo válido: guardar en estado local y generar vista previa local
      recruitmentState.selectedPhotoFile = file;

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

      if (previewImg) previewImg.src = "";
      if (dropzone) dropzone.classList.remove("hidden");
      if (previewBox) previewBox.classList.add("hidden");
      if (errorEl) errorEl.classList.add("hidden");
    }
    window.removeSelectedPhoto = removeSelectedPhoto;

    /**
     * Validación completa del formulario y despliegue del modal de preapertura honesto
     */
    function handleRecruitmentSubmit(event) {
      if (event) event.preventDefault();

      let hasErrors = false;
      let firstErrorElement = null;

      function markError(fieldName, message) {
        hasErrors = true;
        const errEl = document.getElementById(\`error-\${fieldName}\`);
        const cardEl = document.getElementById(\`q-card-\${fieldName}\`);
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

      // 1. Nombres y apellidos
      const nombreInput = document.getElementById("postulacion-nombre");
      const nombre = (nombreInput?.value || "").trim();
      if (!nombre || nombre.length < 3) {
        markError("nombre", "Por favor ingresa tus nombres y apellidos.");
      }

      // 2. Edad
      const edadInput = document.getElementById("postulacion-edad");
      const edad = parseInt(edadInput?.value, 10);
      if (isNaN(edad) || edad < 16 || edad > 80) {
        markError("edad", "Por favor ingresa una edad numérica razonable (entre 16 y 80 años).");
      }

      // 3. Teléfono y WhatsApp
      const telfInput = document.getElementById("postulacion-telefono");
      const telefono = (telfInput?.value || "").trim();
      if (!telefono || telefono.length < 7) {
        markError("telefono", "Por favor ingresa tu número de teléfono y WhatsApp.");
      }

      // 4. Zona de residencia
      const zonaInput = document.getElementById("postulacion-zona");
      const zona = (zonaInput?.value || "").trim();
      if (!zona || zona.length < 2) {
        markError("zona", "Por favor indica en qué zona de Barquisimeto o alrededores resides.");
      }

      // 5. Experiencia
      const expChecked = document.querySelector('input[name="experiencia"]:checked');
      if (!expChecked) {
        markError("experiencia", "Por favor selecciona una de las opciones de experiencia.");
      }

      // 6. Disponibilidad
      const dispChecked = document.querySelector('input[name="disponibilidad"]:checked');
      if (!dispChecked) {
        markError("disponibilidad", "Por favor indica tu disponibilidad para fines de semana.");
      }

      // 7. Punto de partida
      const puntoChecked = document.querySelector('input[name="punto_partida"]:checked');
      if (!puntoChecked) {
        markError("punto_partida", "Por favor responde si puedes llegar al punto de partida.");
      }

      // 8. Motivación y aporte
      const motivInput = document.getElementById("postulacion-motivacion");
      const motivacion = (motivInput?.value || "").trim();
      if (!motivacion || motivacion.length < 10) {
        markError("motivacion", "Por favor cuéntanos por qué te gustaría formar parte del equipo.");
      }

      // 10. Talento inútil o extraño (opcional)
      const talentoInput = document.getElementById("postulacion-talento");
      const talento = (talentoInput?.value || "").trim();

      if (hasErrors) {
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (typeof showToastNotification === "function") {
          showToastNotification("Por favor completa todas las preguntas obligatorias marcadas con asterisco (*).", "error");
        }
        return false;
      }

      // Formulario Válido: Guardar datos en memoria del estado (aislado, sin persistencia en BD)
      recruitmentState.lastValidatedFormData = {
        nombre,
        edad,
        telefono,
        zona,
        experiencia: expChecked.value,
        disponibilidad: dispChecked.value,
        punto_partida: puntoChecked.value,
        motivacion,
        talento: talento || "No especificado",
        tieneFoto: Boolean(recruitmentState.selectedPhotoFile),
        fotoNombre: recruitmentState.selectedPhotoFile ? recruitmentState.selectedPhotoFile.name : null,
        fechaValidacion: new Date().toISOString()
      };

      // Desplegar datos en el modal provisional
      document.getElementById("modal-candidato-nombre").textContent = nombre;
      document.getElementById("modal-candidato-telefono").textContent = telefono;
      document.getElementById("modal-candidato-foto").textContent = recruitmentState.selectedPhotoFile 
        ? \`Sí (\${recruitmentState.selectedPhotoFile.name})\` 
        : "No adjuntada (opcional)";

      // Preparar enlace a WhatsApp
      const waBtn = document.getElementById("btn-modal-wa-reclutamiento");
      if (waBtn) {
        const msgWa = \`¡Hola Tour Azul! 👋 Mi nombre es \${nombre}. Acabo de completar el formulario de postulación para el equipo en la web y me encantaría estar al tanto de los próximos pasos de la convocatoria.\`;
        waBtn.href = \`https://wa.me/\${APP_CONFIG.whatsappNumero}?text=\${encodeURIComponent(msgWa)}\`;
      }

      // Abrir modal honesto de preapertura
      const modal = document.getElementById("modal-postulacion-provisional");
      if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      }

      if (window.lucide) lucide.createIcons();
      return true;
    }
    window.handleRecruitmentSubmit = handleRecruitmentSubmit;

    function closeRecruitmentProvisionalModal() {
      const modal = document.getElementById("modal-postulacion-provisional");
      if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    }
    window.closeRecruitmentProvisionalModal = closeRecruitmentProvisionalModal;
`;
