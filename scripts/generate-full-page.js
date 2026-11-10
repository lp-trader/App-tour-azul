import fs from 'fs';
import { TRIPS } from './data.js';
import { rateClientCode } from './rate-client-code.js';
import { opinionsHtmlSection, opinionsModalsHtml, opinionsClientCode } from './opinions-module.js';
import { featuredSectionHtml, featuredClientCode } from './featured-trips-module.js';
import { dynamicCalendarClientCode } from './dynamic-calendar-module.js';
import { 
  prelaunchHeaderButtonHtml, 
  prelaunchHeroNoticeHtml, 
  recruitmentHtmlSection, 
  recruitmentModalsHtml, 
  recruitmentClientCode 
} from './recruitment-module.js';
import {
  retroPhotosCss,
  retroPhotosLeftHtml,
  retroPhotosRightHtml,
  retroPhotosHeroHtml,
  retroPhotosModalsHtml,
  retroPhotosClientCode
} from './retro-photos-module.js';

const logoBase64 = fs.readFileSync('logo-base64.txt', 'utf8').trim();

const html = `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Tour Azul | Tu escapada perfecta desde Barquisimeto, Cabudare y Yaracuy</title>
  <meta name="description" content="Reserva tus viajes y excursiones de Noviembre con Tour Azul. Salidas desde Barquisimeto, Cabudare y Yaracuy a los mejores destinos de Venezuela con registro en línea.">
  <meta property="og:title" content="Tour Azul | Tu escapada perfecta en Noviembre">
  <meta property="og:description" content="Salidas desde Barquisimeto, Cabudare y Yaracuy a los mejores destinos de Venezuela. Reserva con 5 REF por persona.">
  <meta property="og:type" content="website">
  <link rel="icon" type="image/svg+xml" href="${logoBase64}">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Inter:wght@400;500;600;700&family=Montserrat:ital,wght@0,800;0,900;1,800;1,900&family=Pacifico&display=swap" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'tour-blue': '#1F3FE0',
            'tour-caribe': '#22C3D6',
            'tour-caribe-light': '#5ED8E8',
            'tour-navy': '#0B2A6B',
            'tour-yellow': '#E6E83C',
            'tour-ice': '#EAF8FC',
            'tour-emerald': '#10B981',
          },
          fontFamily: {
            title: ['Montserrat', 'Poppins', 'sans-serif'],
            script: ['"Dancing Script"', '"Pacifico"', 'cursive'],
            body: ['Inter', 'sans-serif'],
          }
        }
      }
    }
  </script>

  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- Canvas Confetti CDN -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>

  <!-- HTML2Canvas CDN for Ticket Download -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

  <!-- heic2any for iPhone HEIC/HEIF photo conversion -->
  <script src="https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js"></script>

  <style>
    :root {
      --azul-rey: #1F3FE0;
      --turquesa: #22C3D6;
      --turquesa-light: #5ED8E8;
      --azul-marino: #0B2A6B;
      --amarillo-lima: #E6E83C;
      --celeste: #EAF8FC;
      --esmeralda: #10B981;
    }
    body {
      font-family: 'Inter', sans-serif;
      background-color: #F8FDFF;
      color: #0F172A;
      overflow-x: hidden;
    }
    .hero-gradient {
      background: radial-gradient(circle at 50% 20%, #22C3D6 0%, #1F3FE0 50%, #0B2A6B 100%);
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .animate-float {
      animation: float 4s ease-in-out infinite;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .seat-bounce {
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .seat-bounce:active {
      transform: scale(0.92);
    }
${retroPhotosCss}
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-tour-caribe selection:text-tour-navy">

  <!-- BARRA SUPERIOR FIJA (GLASSMORPHISM) -->
  <header class="fixed top-0 inset-x-0 z-40 bg-white/85 backdrop-blur-md border-b border-sky-100/80 transition-all duration-300">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
      <!-- Logo Brand (Fijo, nunca se encoge ni se solapa con nada) -->
      <a href="#" class="flex items-center gap-2 shrink-0 group min-w-0 select-none">
        <img src="${logoBase64}" alt="Tour Azul Logo" class="h-9 w-9 sm:h-10 sm:w-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform shrink-0">
        <span class="font-title font-black italic tracking-tight text-lg sm:text-xl text-tour-navy whitespace-nowrap shrink-0">TOUR AZUL</span>
      </a>

      <!-- Acciones de Cabecera (Alineadas a la derecha, fijas sin moverse) -->
      <div class="flex items-center gap-2 shrink-0">
${prelaunchHeaderButtonHtml}
        <!-- Botón de Acceso al Panel de Administración Completo (Viajes de Noviembre, Clientes, Guías) -->
        <button 
          type="button" 
          id="btn-nav-admin" 
          onclick="if(window.openAdminPanel){ window.openAdminPanel(); } else if(window.openAdminCandidatos){ window.openAdminCandidatos(); } else { window.location.hash = '#/admin'; }" 
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition-all cursor-pointer shrink-0 border border-slate-200 active:scale-95 shadow-2xs"
          title="Panel de Administración (Viajes de Noviembre, Clientes, Guías)"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>🛡️ Panel Admin</span>
        </button>
        <!-- Eslogan Tour Azul: Tu escapada perfecta (Oculto en móviles para evitar colisiones y que no tape nada) -->
        <div id="header-slogan" class="hidden lg:flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-sky-50/90 border border-sky-200/90 shadow-2xs shrink-0">
          <span class="text-sm sm:text-base select-none">🌴</span>
          <span class="font-script text-base sm:text-lg md:text-xl text-tour-blue font-bold tracking-wide -rotate-1 whitespace-nowrap">Tu escapada perfecta</span>
        </div>
      </div>
    </div>
  </header>

  <!-- MODO DEMO AVISO -->
  <div id="demo-banner" class="fixed top-16 inset-x-0 z-30 bg-amber-400 text-amber-950 px-4 py-1 text-xs font-medium text-center shadow-inner flex items-center justify-center gap-2 hidden">
    <i data-lucide="info" class="w-3.5 h-3.5"></i>
    <span><strong>Modo demo activo</strong> · Sin conexión a Google Sheets.</span>
  </div>

  <main class="flex-grow pt-24">
    <!-- PORTADA HERO -->
    <section class="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden hero-gradient text-white pt-10 pb-28">
      <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-tour-caribe-light/30 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main Logo Big con Fotos Retro al Lado (Más arriba, más pequeñas que el logo, sin tapar letras en móvil) -->
      <div class="relative z-10 mb-5 flex items-center justify-center gap-2.5 sm:gap-4 md:gap-6 animate-float">
        ${retroPhotosLeftHtml}

        <!-- LOGO PRINCIPAL (CENTRO) -->
        <div class="p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl inline-block shrink-0">
          <img src="${logoBase64}" alt="Tour Azul Logo" class="h-20 w-20 sm:h-28 sm:w-28 md:h-36 md:w-36 object-contain drop-shadow-xl">
        </div>

        ${retroPhotosRightHtml}
      </div>

      <!-- Hero Titles -->
      <div class="relative z-10 max-w-2xl mx-auto space-y-3">
        <h1 class="font-title font-black italic tracking-tight text-5xl md:text-7xl uppercase text-white drop-shadow-md">
          TOUR AZUL
        </h1>
        <p class="font-script text-3xl md:text-4xl text-tour-yellow drop-shadow -rotate-2">
          Tu escapada perfecta
        </p>
        <p class="text-sky-100 text-base md:text-lg font-medium tracking-wide">
          Salimos desde Barquisimeto, Cabudare y Yaracuy
        </p>

        <!-- CTA Button -->
        <div class="pt-4">
          <a href="#viajes" class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-tour-navy font-title font-black uppercase text-sm tracking-wider shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all">
            <span>Ver viajes</span>
            <i data-lucide="arrow-down" class="w-4 h-4 text-tour-blue"></i>
          </a>
        </div>
      </div>

${prelaunchHeroNoticeHtml}

      <!-- Floating Destination Chips -->
      <div class="relative z-10 mt-10 max-w-4xl mx-auto flex flex-wrap justify-center gap-2.5 px-2">
        <span class="text-xs uppercase tracking-wider font-bold text-sky-200 w-full mb-1">Destinos populares:</span>
        <div id="hero-chips" class="flex flex-wrap justify-center gap-2"></div>
      </div>

      <!-- Animated SVG Waves at Bottom -->
      <div class="absolute bottom-0 inset-x-0 leading-none pointer-events-none">
        <svg class="w-full h-16 md:h-24 text-[#F8FDFF]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>

${featuredSectionHtml}

    <!-- SECCIÓN CALENDARIO NOVIEMBRE (DINÁMICO - ESTILO FLYER OFICIAL TOUR AZUL) -->
    <section id="viajes" class="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <!-- Banner Cabecera Tropical del Calendario -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#14B8A6] via-[#0284C7] to-[#0A2663] p-5 sm:p-7 md:p-9 shadow-2xl border-2 border-sky-300/40 text-center text-white mb-6">
        <!-- Destellos caribeños decorativos -->
        <div class="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-cyan-300/20 blur-2xl pointer-events-none"></div>
        <div class="absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-amber-400/20 blur-2xl pointer-events-none"></div>

        <div class="relative z-10 space-y-2.5 max-w-3xl mx-auto">
          <!-- Logo Tour Azul Badge -->
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-tour-navy text-[11px] font-black uppercase tracking-wider shadow-md">
            <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>Tour Azul · Temporada Oficial</span>
          </div>

          <!-- Título Estilizado Calendario Noviembre -->
          <div class="pt-1">
            <span class="block font-title italic text-amber-300 text-2xl sm:text-3xl md:text-4xl drop-shadow-md font-bold tracking-wide">
              🧳 Calendario 😎
            </span>
            <h2 class="font-title font-black uppercase text-4xl sm:text-5xl md:text-6xl text-white tracking-tight drop-shadow-lg leading-none mt-1">
              NOVIEMBRE
            </h2>
          </div>

          <p class="text-sky-100 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
            Toca cualquier día o destino para conocer los detalles del viaje, qué incluye y asegurar tu reserva desde solo <strong>5 REF por persona</strong>.
          </p>

          <!-- SELECTOR DINÁMICO DE DÍAS Y SALIDAS -->
          <div class="pt-2">
            <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2 px-1 justify-start sm:justify-center" id="dynamic-days-selector"></div>
          </div>
        </div>

        <!-- Tagline inferior del Flyer -->
        <div class="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs text-sky-100">
          <span class="text-amber-300 uppercase tracking-wider text-[11px] sm:text-xs font-black">
            🌴 Noviembre se vive con los pies en la arena
          </span>
          <div class="flex items-center gap-3 text-[11px] font-bold">
            <span class="flex items-center gap-1"><i data-lucide="instagram" class="w-3.5 h-3.5 text-amber-300"></i> @eltourazul</span>
            <span class="flex items-center gap-1"><i data-lucide="phone" class="w-3.5 h-3.5 text-amber-300"></i> 0412-6571155</span>
          </div>
        </div>
      </div>

      <!-- Barra de Estado / Resumen del Filtro Dinámico -->
      <div id="dynamic-day-status-bar" class="mb-5 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-sky-100 shadow-xs">
        <div class="flex items-center gap-2">
          <span id="dynamic-status-dot" class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
          <span id="dynamic-status-text" class="text-xs sm:text-sm font-bold text-slate-800">
            Mostrando todos los viajes del mes
          </span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-slate-400 font-medium hidden md:inline">Haz clic en cualquier viaje para ver información y reservar</span>
          <button type="button" onclick="selectDynamicDay('todos')" class="text-xs font-bold text-tour-blue hover:text-blue-800 transition flex items-center gap-1 cursor-pointer">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
            <span>Ver todas las salidas</span>
          </button>
        </div>
      </div>

      <!-- GRID DINÁMICO DE VIAJES (DISEÑO FLYER TOUR AZUL) -->
      <div id="trips-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-4"></div>

      <!-- Banner de Asistencia Directa al Pie -->
      <div class="mt-8 bg-gradient-to-r from-sky-50 via-white to-sky-50 rounded-2xl p-4 border border-sky-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2.5 text-slate-700 font-medium">
          <span class="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">✓</span>
          <span>¿Tienes dudas sobre un destino o deseas pagar en bolívares a tasa oficial? Nuestro equipo te atiende de inmediato.</span>
        </div>
        <a href="https://wa.me/584126571155?text=%C2%A1Hola%20Tour%20Azul!%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20viajes%20de%20noviembre" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer">
          <i data-lucide="message-circle" class="w-4 h-4"></i>
          <span>Atención WhatsApp</span>
        </a>
      </div>
    </section>

    <!-- SECCIÓN EXPERIENCIAS REALES / OPINIONES (PAUSADA TEMPORALMENTE) -->

    <!-- SECCIÓN CÓMO FUNCIONA (PAUSADA TEMPORALMENTE)
    <section class="bg-gradient-to-b from-[#F8FDFF] to-sky-50/60 py-16 border-t border-sky-100">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span class="inline-block px-3 py-1 rounded-full bg-sky-100 text-tour-blue text-xs font-bold uppercase tracking-wider">
            Fácil y rápido
          </span>
          <h2 class="font-title font-black italic text-3xl uppercase text-tour-navy">
            CÓMO FUNCIONA
          </h2>
          <p class="text-slate-600 text-sm">
            En 4 sencillos pasos aseguras tu puesto y el de tus acompañantes.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 flex flex-col items-center text-center space-y-3">
            <div class="w-14 h-14 rounded-2xl bg-sky-100 text-tour-blue flex items-center justify-center font-bold text-xl shadow-inner">
              <i data-lucide="compass" class="w-7 h-7"></i>
            </div>
            <span class="text-xs font-bold text-tour-blue uppercase tracking-wider">Paso 1</span>
            <h3 class="font-title font-black text-lg text-tour-navy uppercase">Elige tu viaje</h3>
            <p class="text-slate-500 text-xs leading-relaxed">
              Explora nuestros destinos caribeños y de montaña con salidas fijas de fin de semana.
            </p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 flex flex-col items-center text-center space-y-3">
            <div class="w-14 h-14 rounded-2xl bg-tour-caribe/20 text-tour-caribe flex items-center justify-center font-bold text-xl shadow-inner">
              <i data-lucide="bus" class="w-7 h-7"></i>
            </div>
            <span class="text-xs font-bold text-tour-caribe uppercase tracking-wider">Paso 2</span>
            <h3 class="font-title font-black text-lg text-tour-navy uppercase">Escoge tus asientos</h3>
            <p class="text-slate-500 text-xs leading-relaxed">
              Mapa visual del autobús en tiempo real. Selecciona tus sillas favoritas numeradas del 1 al 31.
            </p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 flex flex-col items-center text-center space-y-3">
            <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl shadow-inner">
              <i data-lucide="users" class="w-7 h-7"></i>
            </div>
            <span class="text-xs font-bold text-amber-600 uppercase tracking-wider">Paso 3</span>
            <h3 class="font-title font-black text-lg text-tour-navy uppercase">Registra y paga</h3>
            <p class="text-slate-500 text-xs leading-relaxed">
              Ingresa los datos de tu grupo, punto de recogida y asegura con 5 € por persona o pago completo.
            </p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 flex flex-col items-center text-center space-y-3">
            <div class="w-14 h-14 rounded-2xl bg-emerald-100 text-tour-emerald flex items-center justify-center font-bold text-xl shadow-inner">
              <i data-lucide="ticket" class="w-7 h-7"></i>
            </div>
            <span class="text-xs font-bold text-tour-emerald uppercase tracking-wider">Paso 4</span>
            <h3 class="font-title font-black text-lg text-tour-navy uppercase">Recibe tu ticket</h3>
            <p class="text-slate-500 text-xs leading-relaxed">
              Genera tu boleto digital al instante con código único, descárgalo en imagen o recíbelo por WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>
    -->
  </main>

${recruitmentHtmlSection}

  <!-- INDICADOR FLOTANTE DESLIZA PARA VER MÁS (MÓVIL) -->
  <div id="floating-scroll-cue" class="hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 py-2 px-4 rounded-full bg-tour-navy/95 backdrop-blur-md text-white text-xs font-bold shadow-2xl border border-sky-300/40 animate-bounce transition-all duration-300 pointer-events-none md:hidden">
    <span>Desliza para ver más</span>
    <i data-lucide="chevron-down" class="w-4 h-4 text-tour-yellow"></i>
  </div>

  <!-- BOTÓN FLOTANTE WHATSAPP (OCULTO POR LOS MOMENTOS) -->
  <a id="btn-whatsapp-float" href="https://wa.me/584126571155" target="_blank" rel="noopener noreferrer" class="hidden fixed bottom-6 right-6 z-40 items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all group border-2 border-white/80" title="Contactar al WhatsApp de Tour Azul (0412-657-1155)">
    <div class="relative">
      <span class="absolute -top-1 -right-1 flex h-2.5 w-2.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
      </span>
      <i data-lucide="message-circle" class="w-5 h-5"></i>
    </div>
    <div class="flex flex-col text-left leading-tight">
      <span class="text-[11px] font-bold">¿Tienes dudas?</span>
      <span class="text-[10px] text-emerald-100 font-medium">WhatsApp 0412-657-1155</span>
    </div>
  </a>

  <!-- FOOTER -->
  <footer class="bg-white border-t border-sky-100 py-10 px-4 text-center">
    <div class="max-w-4xl mx-auto space-y-4">
      <div class="flex items-center justify-center gap-2">
        <img src="${logoBase64}" alt="Tour Azul" class="h-8 w-8 object-contain">
        <span class="font-title font-black italic text-lg text-tour-navy">TOUR AZUL</span>
      </div>
      <p class="text-xs text-slate-500 max-w-md mx-auto">
        Salidas programadas desde Barquisimeto (C.C. Metrópolis / Monumental), Cabudare (Redoma) y Yaracuy (Chivacoa / San Felipe). Tu mejor experiencia turística en Venezuela.
      </p>

      <div class="pt-1 flex flex-wrap items-center justify-center gap-2 text-xs">
        <button type="button" onclick="openPoliticasModal()" class="inline-flex items-center gap-1.5 font-bold text-tour-blue hover:text-blue-800 bg-sky-50 hover:bg-sky-100 px-3.5 py-1.5 rounded-full border border-sky-200 shadow-2xs transition cursor-pointer">
          <i data-lucide="scroll-text" class="w-4 h-4 text-tour-blue"></i>
          <span>Políticas de Reserva y Viaje 📜</span>
        </button>

        <button type="button" onclick="if(window.openAdminPanel){window.openAdminPanel();}else if(window.openAdminCandidatos){window.openAdminCandidatos();}else{window.location.hash='#/admin';}" class="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-tour-navy bg-slate-100 hover:bg-sky-100 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs transition cursor-pointer text-xs" title="Panel de Administración (Viajes de Noviembre, Clientes, Guías)">
          <i data-lucide="shield-check" class="w-4 h-4 text-tour-blue"></i>
          <span>🛡️ Panel Admin</span>
        </button>

        <span class="text-slate-300 hidden">·</span>

        <a href="https://wa.me/584126571155?text=%C2%A1Hola%20Tour%20Azul!%20Tengo%20una%20duda." target="_blank" rel="noopener noreferrer" class="hidden inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-sm transition">
          <i data-lucide="message-circle" class="w-4 h-4 text-emerald-600"></i>
          <span>WhatsApp: 0412-657-1155</span>
        </a>
      </div>

      <div class="pt-2 text-[11px] text-slate-400">
        © 2026 Tour Azul · @eltourazul · Todos los derechos reservados.
      </div>
    </div>
  </footer>

  <!-- MODAL DE DETALLES DEL VIAJE -->
  <div id="modal-detalles" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-float relative">
      <button id="btn-close-detalles" class="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition shadow">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <!-- Foto de Portada del Destino -->
      <div class="h-44 w-full -mx-6 -mt-6 rounded-t-3xl overflow-hidden relative bg-sky-900">
        <img id="modal-det-img" src="" alt="Destino" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div class="absolute bottom-3 left-4 right-4">
          <span id="modal-det-tipo" class="px-3 py-1 rounded-full bg-tour-yellow text-tour-navy font-bold text-xs shadow-sm uppercase tracking-wide"></span>
          <h3 id="modal-det-title" class="font-title font-black italic text-2xl uppercase text-white mt-1 drop-shadow leading-tight"></h3>
        </div>
      </div>

      <div>
        <p id="modal-det-fechas" class="text-sm font-semibold text-tour-blue"></p>
        <span class="text-xs text-slate-400">Salidas desde Barquisimeto, Cabudare & Yaracuy</span>
      </div>

      <!-- Precios Box -->
      <div class="bg-sky-50 rounded-2xl p-4 border border-sky-100 flex items-center justify-between">
        <div>
          <span class="text-xs text-slate-500 block">Precio por persona</span>
          <div class="flex items-baseline gap-2">
            <span id="modal-det-precio-eur" class="text-2xl font-black text-tour-blue font-title"></span>
            <span id="modal-det-precio-bs" class="text-xs text-slate-500 font-medium"></span>
          </div>
        </div>
        <div class="text-right">
          <span class="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
            Reserva con 5 REF p/p
          </span>
        </div>
      </div>

      <!-- Descripción del Destino -->
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-tour-blue mb-1.5 flex items-center gap-1.5">
          <i data-lucide="sparkles" class="w-3.5 h-3.5 text-tour-yellow"></i>
          <span>Acerca de esta experiencia</span>
        </h4>
        <p id="modal-det-descripcion" class="text-xs text-slate-700 leading-relaxed bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100"></p>
      </div>

      <!-- Qué Incluye -->
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Qué incluye</h4>
        <div id="modal-det-incluye" class="text-xs text-slate-600 space-y-1.5">
          <p class="italic text-slate-400">Pronto más información detallada de este tour.</p>
        </div>
      </div>

      <!-- Políticas de Reserva y Condiciones -->
      <div class="rounded-2xl p-3.5 bg-amber-50/90 border border-amber-200 text-amber-950 text-xs space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5 font-bold text-tour-navy">
            <i data-lucide="scroll-text" class="w-4 h-4 text-amber-700"></i>
            <span>Políticas de Reserva y Viaje 📜</span>
          </div>
          <button type="button" onclick="openPoliticasModal()" class="text-[11px] font-bold text-tour-blue hover:text-blue-800 hover:underline cursor-pointer">
            Ver las 7 normas
          </button>
        </div>
        <ul class="text-[11px] text-slate-700 space-y-1 list-disc list-inside">
          <li><strong>Tolerancia puntual:</strong> 15 min en punto de encuentro (No Show sin reembolso).</li>
          <li><strong>Reembolso directo:</strong> Con 4+ días de anticipación (monto exacto en Bs recibido).</li>
          <li><strong>Saldo a favor:</strong> Con 72 hrs de anticipación (válido 60 días continuos).</li>
          <li><strong>Cesión de cupo:</strong> Mínimo 48 hrs con datos completos del nuevo pasajero.</li>
        </ul>
        <div class="pt-1 border-t border-amber-200/60 text-[10.5px] text-amber-800 font-semibold">
          Al reservar acepta automáticamente las políticas y condiciones de Tour Azul ✅
        </div>
      </div>

      <!-- Action Button -->
      <button id="modal-det-btn-reservar" class="w-full py-3.5 rounded-2xl bg-tour-blue hover:bg-blue-700 text-white font-title font-black uppercase text-sm tracking-wider shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2">
        <span>Reservar ya con 5 REF por persona</span>
        <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>

      <!-- Botón de consulta WhatsApp en Detalles (Oculto por los momentos) -->
      <a id="modal-det-btn-whatsapp" href="https://wa.me/584126571155" target="_blank" rel="noopener noreferrer" class="hidden w-full py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition items-center justify-center gap-2 shadow-sm">
        <i data-lucide="message-circle" class="w-4 h-4 text-emerald-600"></i>
        <span>¿Dudas sobre este tour? Escríbenos al 0412-657-1155</span>
      </a>
    </div>
  </div>

  <!-- ASISTENTE DE REGISTRO Y RESERVA (SIN SELECCIÓN DE ASIENTOS) -->
  <div id="modal-wizard" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex-col justify-end md:justify-center items-center p-0 md:p-4">
    <div class="bg-white w-full max-w-2xl max-h-[92vh] md:max-h-[90vh] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">

      <!-- Cabecera del Asistente -->
      <div class="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-sky-50/70">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-tour-blue block" id="wizard-trip-name">Registro de Pasajeros</span>
          <span class="text-xs text-slate-500 font-medium" id="wizard-trip-date">Fecha</span>
        </div>
        <button id="btn-close-wizard" class="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-500 shadow-sm transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Stepper Progress Bar (3 Pasos) -->
      <div class="px-4 py-3 bg-white border-b border-slate-100">
        <div class="flex items-center justify-between relative max-w-md mx-auto">
          <div class="step-indicator flex flex-col items-center gap-1 z-10" data-step="1">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-tour-blue text-white shadow-sm ring-4 ring-blue-100 transition-all" id="step-icon-1">1</div>
            <span class="text-[10px] font-bold text-tour-navy">Pasajeros</span>
          </div>
          <div class="flex-1 h-0.5 bg-slate-200 mx-2" id="step-line-1"></div>
          <div class="step-indicator flex flex-col items-center gap-1 z-10" data-step="2">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-slate-100 text-slate-500 transition-all" id="step-icon-2">2</div>
            <span class="text-[10px] font-medium text-slate-500">Pago Reserva</span>
          </div>
          <div class="flex-1 h-0.5 bg-slate-200 mx-2" id="step-line-2"></div>
          <div class="step-indicator flex flex-col items-center gap-1 z-10" data-step="3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-slate-100 text-slate-500 transition-all" id="step-icon-3">3</div>
            <span class="text-[10px] font-medium text-slate-500">Confirmación</span>
          </div>
        </div>
      </div>

      <!-- Contenedor de Pasos -->
      <div class="p-4 md:p-6 overflow-y-auto flex-grow max-h-[62vh] space-y-4">

        <!-- PASO 1: PASAJEROS, GRUPO Y PUNTO DE PARTIDA -->
        <div id="step-content-1" class="step-view space-y-4">
          <div class="text-center space-y-1">
            <h3 class="font-title font-black text-lg text-tour-navy uppercase">Registro de Pasajeros y Salida</h3>
            <p class="text-xs text-slate-500">Indica con cuántas personas viajas y desde dónde parten.</p>
          </div>

          <!-- Selector: Viajo Solo vs Con Acompañantes -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 block">¿Cómo vas a viajar?</label>
            <div class="grid grid-cols-2 gap-2.5">
              <button type="button" id="btn-opt-solo" onclick="setViajeModo('solo')" class="p-3.5 rounded-2xl border-2 text-left transition flex flex-col gap-1 border-tour-blue bg-blue-50/70 shadow-xs cursor-pointer">
                <div class="flex items-center justify-between">
                  <span class="text-lg">👤</span>
                  <span id="check-solo" class="w-4 h-4 rounded-full bg-tour-blue text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                </div>
                <span class="font-bold text-xs text-tour-navy">Viajo solo/a</span>
                <span class="text-[11px] text-slate-500">1 sola persona</span>
              </button>

              <button type="button" id="btn-opt-grupo" onclick="setViajeModo('grupo')" class="p-3.5 rounded-2xl border-2 text-left transition flex flex-col gap-1 border-slate-200 hover:border-slate-300 bg-white cursor-pointer">
                <div class="flex items-center justify-between">
                  <span class="text-lg">👥</span>
                  <span id="check-grupo" class="w-4 h-4 rounded-full border border-slate-300 hidden"></span>
                </div>
                <span class="font-bold text-xs text-slate-700">Con acompañantes</span>
                <span class="text-[11px] text-slate-500">Pareja, amigos o familia</span>
              </button>
            </div>
          </div>

          <!-- Selector de cantidad de acompañantes (Visible si grupo) -->
          <div id="box-stepper-acomp" class="hidden p-3.5 bg-sky-50/80 rounded-2xl border border-sky-200 space-y-2">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-tour-navy block">¿Cuántas personas van en total?</span>
                <span class="text-[11px] text-slate-500">Incluyendo al titular responsable</span>
              </div>
              <div class="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-sky-200 shadow-2xs">
                <button type="button" onclick="cambiarTotalPersonas(-1)" class="w-7 h-7 rounded-lg bg-sky-50 hover:bg-sky-100 text-tour-blue font-black text-sm flex items-center justify-center transition active:scale-95 cursor-pointer">−</button>
                <span id="count-total-personas" class="font-title font-black text-tour-navy text-sm px-2">2</span>
                <button type="button" onclick="cambiarTotalPersonas(1)" class="w-7 h-7 rounded-lg bg-sky-50 hover:bg-sky-100 text-tour-blue font-black text-sm flex items-center justify-center transition active:scale-95 cursor-pointer">+</button>
              </div>
            </div>
            <p class="text-[11px] text-slate-500 italic">Cada cupo se asegura con solo 5 REF (o pago completo) a tu elección en el siguiente paso.</p>
          </div>

          <!-- Formulario Pasajero Titular -->
          <div class="p-4 bg-sky-50/50 rounded-2xl border border-sky-200/80 space-y-3">
            <div class="flex items-center justify-between border-b border-sky-100 pb-2">
              <span class="font-title font-bold text-xs uppercase text-tour-navy flex items-center gap-1.5">
                <i data-lucide="user-check" class="w-4 h-4 text-tour-blue"></i>
                <span>Titular de la Reserva (Responsable)</span>
              </span>
              <span class="text-[10px] bg-tour-blue text-white px-2 py-0.5 rounded-full font-bold">Principal</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label class="block text-slate-600 font-medium mb-1">Nombre y Apellido *</label>
                <input type="text" id="reg-lead-name" required placeholder="Ej. Carlos Pérez" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none bg-white">
              </div>
              <div>
                <label class="block text-slate-600 font-medium mb-1">Cédula de Identidad *</label>
                <input type="text" id="reg-lead-cedula" required placeholder="Ej. V-19876543" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none bg-white">
              </div>
              <div>
                <label class="block text-slate-600 font-medium mb-1">Teléfono WhatsApp *</label>
                <input type="tel" id="reg-lead-phone" required placeholder="Ej. 04121234567" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none bg-white">
              </div>
              <div>
                <label class="block text-slate-600 font-medium mb-1">Edad (opcional)</label>
                <input type="number" id="reg-lead-age" placeholder="Ej. 28" min="1" max="100" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none bg-white">
              </div>
              <div class="md:col-span-2">
                <label class="block text-slate-600 font-medium mb-1">Punto de Salida / Partida *</label>
                <input type="text" id="reg-lead-pickup" required placeholder="Selecciona abajo o escribe tu punto de partida" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none bg-white text-xs">
                <div class="flex flex-wrap gap-1.5 pt-2">
                  <button type="button" onclick="setRegPickup('Barquisimeto: C.C. Metrópolis / Monumental')" class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white text-tour-blue border border-sky-200 hover:bg-sky-50 shadow-2xs transition cursor-pointer">📍 Metrópolis (Bqto)</button>
                  <button type="button" onclick="setRegPickup('Barquisimeto: C.C. Las Trinitarias')" class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white text-tour-blue border border-sky-200 hover:bg-sky-50 shadow-2xs transition cursor-pointer">📍 Las Trinitarias (Bqto)</button>
                  <button type="button" onclick="setRegPickup('Cabudare: Redoma de Agua Viva')" class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white text-tour-blue border border-sky-200 hover:bg-sky-50 shadow-2xs transition cursor-pointer">📍 Redoma Cabudare</button>
                  <button type="button" onclick="setRegPickup('Yaracuy: Chivacoa (Pasarela / Peaje)')" class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white text-tour-blue border border-sky-200 hover:bg-sky-50 shadow-2xs transition cursor-pointer">📍 Chivacoa (Yaracuy)</button>
                  <button type="button" onclick="setRegPickup('Yaracuy: San Felipe (Redoma)')" class="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white text-tour-blue border border-sky-200 hover:bg-sky-50 shadow-2xs transition cursor-pointer">📍 San Felipe (Yaracuy)</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Contenedor dinámico de campos para acompañantes -->
          <div id="reg-acomp-container" class="space-y-3"></div>

        </div>

        <!-- PASO 2: MODALIDAD Y PAGO DE RESERVA -->
        <div id="step-content-2" class="step-view space-y-4 hidden">
          <div class="text-center space-y-1">
            <h3 class="font-title font-black text-lg text-tour-navy uppercase">Modalidad y Pago de Reserva</h3>
            <p class="text-xs text-slate-500">Asegura hoy con solo 5 REF por persona o cancela el total.</p>
          </div>

          <!-- Selector Abono vs Pago Completo -->
          <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button type="button" id="pay-opt-deposit" onclick="setRegPagoTipo('abono')" class="py-2.5 px-3 rounded-xl font-bold text-xs transition bg-white text-tour-navy shadow-sm cursor-pointer">
              Abonar Reserva (5 REF p/p)
            </button>
            <button type="button" id="pay-opt-full" onclick="setRegPagoTipo('full')" class="py-2.5 px-3 rounded-xl font-bold text-xs transition text-slate-600 hover:text-tour-navy cursor-pointer">
              Pago Completo
            </button>
          </div>

          <!-- Desglose de Montos -->
          <div class="bg-sky-50/80 border border-sky-200 rounded-2xl p-4 space-y-2 text-xs">
            <div class="flex justify-between items-center text-slate-700">
              <span>Monto a pagar hoy:</span>
              <span id="pay-amount-today" class="font-title font-black text-tour-blue text-base">-- REF</span>
            </div>
            <div class="flex justify-between items-center text-slate-600">
              <span>Saldo restante al abordar:</span>
              <span id="pay-amount-balance" class="font-bold text-slate-800">-- REF</span>
            </div>
            <div class="pt-1 border-t border-sky-100 text-[11px] text-slate-500 flex justify-between">
              <span>Total excursión (<span id="pay-people-summary">1 persona</span>):</span>
              <span id="pay-total-summary" class="font-bold text-tour-navy">-- REF</span>
            </div>
          </div>

          <!-- Método de Pago -->
          <div class="space-y-2 pt-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 block">Forma de Pago</label>
            <div class="grid grid-cols-2 gap-3">
              <!-- Pago Móvil -->
              <label class="relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-tour-blue bg-blue-50/50" id="label-method-pagomovil">
                <input type="radio" name="regPaymentMethod" value="Pago Móvil" checked onchange="setRegMetodoPago('Pago Móvil')" class="sr-only">
                <span class="font-bold text-xs text-tour-navy flex items-center gap-1.5">
                  <i data-lucide="smartphone" class="w-4 h-4 text-tour-blue"></i>
                  Pago Móvil (Bs)
                </span>
                <span class="text-[10px] text-slate-500 mt-1">Tasa oficial BCV Euro</span>
              </label>

              <!-- Efectivo -->
              <label class="relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-slate-200 hover:border-slate-300" id="label-method-efectivo">
                <input type="radio" name="regPaymentMethod" value="Efectivo" onchange="setRegMetodoPago('Efectivo')" class="sr-only">
                <span class="font-bold text-xs text-tour-navy flex items-center gap-1.5">
                  <i data-lucide="banknote" class="w-4 h-4 text-emerald-600"></i>
                  Efectivo ($/€)
                </span>
                <span class="text-[10px] text-slate-500 mt-1">Al abordar la unidad</span>
              </label>
            </div>
          </div>

          <!-- Datos Pago Móvil -->
          <div id="method-box-pagomovil" class="space-y-3 bg-white border border-sky-100 rounded-2xl p-4 text-xs">
            <div class="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
              <span class="text-[11px] text-slate-500 block">Monto exacto a transferir:</span>
              <span id="pagomovil-monto-bs" class="font-title font-black text-2xl text-tour-blue block my-1">-- Bs</span>
              <button type="button" id="btn-copy-bs" class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-tour-blue border border-sky-200 text-[11px] font-bold hover:bg-sky-50 transition shadow-sm cursor-pointer">
                <i data-lucide="copy" class="w-3 h-3"></i>
                <span id="copy-bs-text">Copiar monto</span>
              </button>
            </div>

            <div class="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-[11px]">
              <div class="flex justify-between items-center">
                <span class="text-slate-500">Banco:</span>
                <span class="font-bold text-slate-800" id="pm-banco">0102 - Banco de Venezuela</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500">Cédula:</span>
                <span class="font-bold text-slate-800" id="pm-rif">V-24162410</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500">Teléfono:</span>
                <span class="font-bold text-slate-800" id="pm-telf">0412-6571155</span>
              </div>
            </div>

            <div>
              <label class="block text-slate-700 font-bold mb-1">Número de Referencia de Pago Móvil *</label>
              <input type="text" id="pagomovil-ref" placeholder="Ej. 123456 (últimos 4 dígitos o completa)" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tour-blue text-xs font-mono">
              <span class="text-[10px] text-slate-400">Requerido para validar tu comprobante bancario.</span>
            </div>
          </div>

          <!-- Datos Efectivo -->
          <div id="method-box-efectivo" class="space-y-3 bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 text-xs hidden">
            <div class="text-center">
              <span class="text-[11px] text-emerald-800 block">Monto a pagar en efectivo:</span>
              <span id="efectivo-monto-usd" class="font-title font-black text-2xl text-emerald-700 block my-1">-- $</span>
            </div>
            <div class="p-3 bg-white rounded-xl border border-emerald-100 text-slate-600 text-[11px] leading-relaxed">
              <i data-lucide="info" class="w-3.5 h-3.5 text-emerald-600 inline mr-1"></i>
              <span>Entrega el monto en efectivo al abordar la unidad de transporte el día del viaje. Tu cupo quedará registrado en estado <strong>Pendiente de pago</strong>.</span>
            </div>
          </div>
        </div>

        <!-- PASO 3: RESUMEN Y CONFIRMACIÓN -->
        <div id="step-content-3" class="step-view space-y-4 hidden">
          <div class="text-center space-y-1">
            <h3 class="font-title font-black text-lg text-tour-navy uppercase">Resumen de tu Reserva</h3>
            <p class="text-xs text-slate-500">Revisa los datos de tus pasajeros y pago antes de enviar.</p>
          </div>

          <div id="summary-card" class="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 space-y-3 text-xs"></div>

          <div class="rounded-2xl p-3.5 bg-amber-50/90 border border-amber-200 text-amber-950 text-xs space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 font-bold text-tour-navy">
                <i data-lucide="shield-check" class="w-4 h-4 text-amber-700"></i>
                <span>Políticas de Reserva y Viaje 📜</span>
              </div>
              <button type="button" onclick="openPoliticasModal()" class="text-[11px] font-bold text-tour-blue hover:text-blue-800 hover:underline cursor-pointer">
                Leer las 7 normas
              </button>
            </div>
            <ul class="text-[11px] text-slate-700 space-y-1 list-disc list-inside">
              <li><strong>Tolerancia puntual:</strong> 15 min en punto de salida (No Show sin reembolso).</li>
              <li><strong>Reembolsos directos:</strong> Mínimo 4 días antes (mismo monto en Bs recibido).</li>
              <li><strong>Saldo a favor:</strong> Mínimo 72 hrs antes (vigencia de 60 días continuos).</li>
              <li><strong>Cesión de cupo:</strong> Mínimo 48 hrs con datos del nuevo pasajero.</li>
            </ul>
            <div class="pt-1 border-t border-amber-200/60 text-[10.5px] text-amber-900 font-bold flex items-center gap-1">
              <span>Al reservar acepta automáticamente las políticas y condiciones de Tour Azul ✅</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Barra Inferior Fija del Asistente -->
      <div class="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-4">
        <div>
          <span class="text-[11px] text-slate-400 block">Total reserva</span>
          <div class="flex items-baseline gap-1.5">
            <span id="wizard-bottom-total-eur" class="text-xl font-title font-black text-tour-navy">0 REF</span>
            <span id="wizard-bottom-total-bs" class="text-xs text-slate-500"></span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button type="button" id="btn-wizard-prev" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition hidden cursor-pointer">
            Atrás
          </button>
          <button type="button" id="btn-wizard-next" class="px-6 py-2.5 rounded-xl bg-tour-blue hover:bg-blue-700 text-white font-title font-black uppercase text-xs tracking-wider shadow-lg hover:shadow-xl transition flex items-center gap-1.5 cursor-pointer">
            <span id="btn-wizard-next-text">Continuar</span>
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

    </div>
  </div>

  <!-- MODAL DE ÉXITO Y TICKET -->
  <div id="modal-success" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-md hidden items-center justify-center p-4 overflow-y-auto">
    <div class="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-5 my-8 relative">
      <div class="text-center space-y-1">
        <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
          <i data-lucide="check" class="w-8 h-8"></i>
        </div>
        <h3 class="font-title font-black text-2xl uppercase text-tour-navy">¡RESERVA CONFIRMADA!</h3>
        <p class="text-xs text-slate-500">Tu puesto a bordo de Tour Azul ya está garantizado.</p>
      </div>

      <!-- TICKET DIGITAL CAPTURABLE -->
      <div id="ticket-card" class="bg-gradient-to-b from-white to-sky-50 border-2 border-tour-blue/40 rounded-3xl p-5 shadow-lg space-y-4 relative overflow-hidden">
        <div class="flex items-center justify-between border-b border-sky-100 pb-3">
          <div class="flex items-center gap-2">
            <img src="${logoBase64}" alt="Tour Azul" class="h-8 w-8 object-contain">
            <div>
              <span class="font-title font-black italic text-sm text-tour-navy block leading-none">TOUR AZUL</span>
              <span class="text-[9px] text-tour-caribe font-bold uppercase tracking-wider">BIENVENIDOS A BORDO</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-[9px] text-slate-400 block">ID RESERVA</span>
            <span id="ticket-id" class="font-mono font-bold text-xs text-tour-blue">TA-20261003-001</span>
          </div>
        </div>

        <div class="space-y-2 text-xs">
          <div class="flex justify-between items-center">
            <span class="text-slate-500">Destino:</span>
            <span id="ticket-destino" class="font-title font-bold text-tour-navy uppercase">--</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500">Fecha del Viaje:</span>
            <span id="ticket-fecha" class="font-bold text-slate-800">--</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500">Pasajeros a bordo:</span>
            <span id="ticket-asientos" class="font-bold text-tour-blue font-title">--</span>
          </div>
        </div>

        <div class="border-t border-dashed border-sky-200 pt-2 text-[11px] space-y-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pasajeros & Recogida:</span>
          <div id="ticket-pasajeros" class="space-y-1 text-slate-700"></div>
        </div>

        <div class="border-t border-sky-100 pt-2 flex justify-between items-center text-xs">
          <div>
            <span class="text-[10px] text-slate-400 block">Método de pago:</span>
            <span id="ticket-metodo" class="font-bold text-slate-700">--</span>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-400 block">Monto Pagado / Saldo:</span>
            <span id="ticket-pago" class="font-bold text-tour-navy">--</span>
          </div>
        </div>

        <div id="ticket-efectivo-box" class="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-semibold text-center hidden">
          <span>⚠️ Pendiente de pago: Entrega <strong id="ticket-saldo-efectivo">-- $</strong> al abordar la unidad.</span>
        </div>

        <div class="p-2.5 rounded-xl bg-amber-50/80 border border-amber-300 text-slate-800 text-[11px] text-center font-medium shadow-2xs space-y-0.5">
          <span class="font-bold text-tour-navy block text-xs">Políticas de Reserva y Viaje 📜</span>
          <span class="text-slate-600 block text-[10.5px]">15 min de tolerancia en punto de salida. Aplican condiciones oficiales de reembolso y saldos de Tour Azul.</span>
          <button type="button" onclick="openPoliticasModal()" class="text-tour-blue font-bold hover:underline inline-block text-[11px] cursor-pointer pt-0.5">
            Ver las 7 políticas completas
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <button id="btn-download-ticket" class="w-full py-3 rounded-2xl bg-tour-blue hover:bg-blue-700 text-white font-title font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition">
          <i data-lucide="download" class="w-4 h-4"></i>
          <span>Descargar Ticket (PNG)</span>
        </button>

        <button id="btn-share-whatsapp" class="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-title font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition">
          <i data-lucide="message-circle" class="w-4 h-4"></i>
          <span>Enviar ticket por WhatsApp</span>
        </button>

        <button id="btn-close-success" class="w-full py-2.5 text-xs text-slate-500 hover:text-tour-navy font-bold transition">
          Volver a la página principal
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL DE POLÍTICAS DE RESERVA Y VIAJE -->
  <div id="modal-politicas" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-3 md:p-4">
    <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-float relative border border-sky-100">
      
      <!-- Encabezado del Modal -->
      <div class="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 via-blue-50/50 to-white">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-tour-blue/10 text-tour-blue flex items-center justify-center">
            <i data-lucide="scroll-text" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-title font-black uppercase text-tour-navy text-base md:text-lg leading-tight">
              Políticas de Reserva y Viaje 📜
            </h3>
            <span class="text-xs text-slate-500 font-medium">Tour Azul · Condiciones oficiales de servicio</span>
          </div>
        </div>
        <button id="btn-close-politicas" onclick="closePoliticasModal()" class="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Contenido Scrolleable con las 7 Políticas Oficiales -->
      <div class="p-4 md:p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-700">
        
        <!-- 1️⃣ Tolerancia y Presentación en el Punto de Salida (No Show) -->
        <div class="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-lg bg-tour-blue text-white font-black text-xs">1</span>
            <h4 class="font-title font-bold text-tour-navy text-sm uppercase">Tolerancia y Presentación en el Punto de Salida (No Show)</h4>
          </div>
          <ul class="space-y-1.5 pl-1">
            <li class="flex items-start gap-2">
              <span class="text-amber-500 font-bold shrink-0">⭐️</span>
              <span><strong>Puntualidad:</strong> Es responsabilidad de cada viajero estar presente en el punto de encuentro a la hora convocada.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-500 font-bold shrink-0">⭐️</span>
              <span><strong>Tiempo de espera:</strong> Se otorgará un margen máximo de <strong>15 minutos de tolerancia</strong> en el punto de salida.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-500 font-bold shrink-0">⭐️</span>
              <span><strong>Inasistencia (No Show):</strong> Cumplidos los 15 minutos de tolerancia, la unidad iniciará el recorrido. La inasistencia sin el debido aviso previo dentro de los plazos establecidos se considerará <em>No Show</em>, lo que conlleva la pérdida total del cupo sin derecho a reembolso, abono ni reprogramación.</span>
            </li>
          </ul>
        </div>

        <!-- 2️⃣ ¿No puedes ir al viaje? (Solicitud de Reembolso Directo) -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-lg bg-tour-blue text-white font-black text-xs">2</span>
            <h4 class="font-title font-bold text-tour-navy text-sm uppercase">¿No puedes ir al viaje? (Solicitud de Reembolso Directo)</h4>
          </div>
          <ul class="space-y-1.5 pl-1">
            <li class="flex items-start gap-2">
              <span class="text-amber-500 font-bold shrink-0">⭐️</span>
              <span><strong>Plazo:</strong> Si no puedes asistir al viaje o alguno de tus compañeros no puede ir, debes notificarlo y solicitar el reembolso con <strong>4 días o más de anticipación</strong> a la fecha fijada para la salida.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-500 font-bold shrink-0">⭐️</span>
              <span><strong>Monto del Reembolso:</strong> La devolución del dinero se realizará estrictamente por el <strong>mismo monto exacto en Bolívares (VES)</strong> que fue abonado o recibido en su momento de pago. No se calculará ni ajustará la devolución a la tasa de cambio vigente al momento del reembolso ni a diferencias cambiarias posteriores, motivado a los gastos administrativos y a las reservas logísticas operativas previamente ejecutadas para el tour.</span>
            </li>
          </ul>
        </div>

        <!-- 3️⃣ Saldo a Favor y Abono para Futuros Viajes -->
        <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-lg bg-amber-600 text-white font-black text-xs">3</span>
            <h4 class="font-title font-bold text-amber-950 text-sm uppercase">Saldo a Favor y Abono para Futuros Viajes</h4>
          </div>
          <ul class="space-y-1.5 pl-1">
            <li class="flex items-start gap-2">
              <span class="text-amber-600 font-bold shrink-0">⭐️</span>
              <span><strong>Plazo:</strong> Si notificas que no podrás asistir con <strong>3 días (72 horas) de anticipación</strong>, el monto pagado no será reembolsable en efectivo ni transferencia.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-600 font-bold shrink-0">⭐️</span>
              <span><strong>Vigencia del Saldo:</strong> El 100% de lo abonado quedará como un saldo a favor a tu nombre para ser utilizado en cualquiera de nuestras salidas programadas dentro de los siguientes <strong>60 días (2 meses) continuos</strong>. Pasado este tiempo, el saldo perderá su validez.</span>
            </li>
          </ul>
        </div>

        <!-- 4️⃣ Transferencia de Cupo a Terceros -->
        <div class="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-lg bg-tour-blue text-white font-black text-xs">4</span>
            <h4 class="font-title font-bold text-tour-navy text-sm uppercase">Transferencia de Cupo a Terceros</h4>
          </div>
          <ul class="space-y-1.5 pl-1">
            <li class="flex items-start gap-2">
              <span class="text-amber-500 font-bold shrink-0">⭐️</span>
              <span><strong>Plazo:</strong> Puedes transferir o ceder tu cupo a otra persona notificando con un mínimo de <strong>48 horas de anticipación</strong> al viaje.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-500 font-bold shrink-0">⭐️</span>
              <span><strong>Sin reembolso:</strong> No se realizará devolución de dinero a la persona que ya no puede ir.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-tour-blue font-bold shrink-0">✨</span>
              <span><strong>Requisito:</strong> Debes enviar los datos de identidad completos del nuevo pasajero para autorizar su abordaje.</span>
            </li>
          </ul>
        </div>

        <!-- 5️⃣ Notificaciones a Menos de 24 Horas del Viaje -->
        <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-black text-xs">5</span>
            <h4 class="font-title font-bold text-emerald-950 text-sm uppercase">Notificaciones a Menos de 24 Horas del Viaje ✅</h4>
          </div>
          <p class="text-slate-700">
            A menos de 24 horas de la salida, todos los costos logísticos, de transporte, hospedaje y permisos se encuentran 100% liquidados y pagados por la agencia, por lo que no aplican reembolsos en dinero ni saldos a favor automáticos.
          </p>
          <p class="font-bold text-emerald-900 pt-0.5">Para ayudarte a no perder tu inversión, te ofrecemos las siguientes alternativas:</p>
          <ul class="space-y-1.5 pl-1">
            <li class="flex items-start gap-2">
              <span class="text-emerald-600 font-bold shrink-0">✨</span>
              <span><strong>Transferencia Express de Cupo:</strong> Puedes cederle tu puesto a un familiar, amigo o conocido notificando sus datos antes de la salida para que viaje en tu lugar.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-600 font-bold shrink-0">✨</span>
              <span><strong>Gestión por Lista de Espera:</strong> Intentaremos ofrecer tu cupo a los pasajeros que tengamos en lista de espera. Si logramos reubicar y vender tu asiento con éxito antes de la partida, te otorgaremos el saldo a favor correspondiente para una próxima salida.</span>
            </li>
          </ul>
        </div>

        <!-- 6️⃣ Casos de Fuerza Mayor -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-lg bg-slate-700 text-white font-black text-xs">6</span>
            <h4 class="font-title font-bold text-tour-navy text-sm uppercase">Casos de Fuerza Mayor</h4>
          </div>
          <p class="pl-1">
            ⭐️ En situaciones imprevistas debidamente justificadas (emergencias médicas con soporte médico/legal, accidentes o imprevistos graves), notifica inmediatamente a nuestro equipo de atención al cliente. Debido a los compromisos operativos previamente cancelados, no se realizarán reembolsos en metálico a última hora, pero evaluaremos la congelación del saldo a favor según la disponibilidad de la agencia.
          </p>
        </div>

        <!-- 7️⃣ Modificaciones por la Agencia -->
        <div class="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-lg bg-tour-blue text-white font-black text-xs">7</span>
            <h4 class="font-title font-bold text-tour-navy text-sm uppercase">Modificaciones por la Agencia</h4>
          </div>
          <p class="pl-1">
            ⭐️ Ante situaciones ajenas a nuestro control (condiciones climáticas extremas, cierres de vía, desastres naturales o causas de fuerza mayor) que comprometan la seguridad de los viajeros, la agencia reprogramará la salida o mantendrá el saldo a favor de los pasajeros para la nueva fecha fijada.
          </p>
        </div>

        <!-- Aceptación Automática -->
        <div class="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-center text-xs shadow-xs">
          Al estar reservando con nosotros acepta automáticamente las políticas y condiciones de reserva ✅
        </div>

      </div>

      <!-- Footer del Modal -->
      <div class="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3">
        <a href="https://wa.me/584126571155?text=%C2%A1Hola%20Tour%20Azul!%20Tengo%20una%20consulta%20sobre%20las%20pol%C3%ADticas%20de%20reserva." target="_blank" rel="noopener noreferrer" class="hidden text-emerald-700 hover:text-emerald-800 font-bold text-xs items-center gap-1.5">
          <i data-lucide="message-circle" class="w-4 h-4"></i>
          <span>Consultar por WhatsApp</span>
        </a>
        <button onclick="closePoliticasModal()" class="px-5 py-2.5 rounded-xl bg-tour-blue hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm cursor-pointer">
          Entendido y de acuerdo
        </button>
      </div>

    </div>
  </div>

${opinionsModalsHtml}

${recruitmentModalsHtml}

${retroPhotosModalsHtml}

  <!-- SPINNER OVERLAY ELEGANTE -->
  <div id="loading-overlay" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center">
    <div class="bg-white rounded-3xl p-6 flex flex-col items-center space-y-3 shadow-2xl">
      <div class="w-12 h-12 border-4 border-sky-100 border-t-tour-blue rounded-full animate-spin"></div>
      <span class="text-xs font-bold text-tour-navy" id="loading-text">Procesando tu reserva...</span>
    </div>
  </div>

  <!-- CONTENEDOR TOAST NOTIFICACIONES -->
  <div id="toast-container" class="fixed top-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none"></div>

  <!-- JAVASCRIPT ES6+ EMBEBIDO -->
  <script>
${recruitmentClientCode}
${retroPhotosClientCode}
    // Webhook de Google Apps Script (se sincroniza con /api/config o localStorage)
    const ACTIVE_APPS_SCRIPT_URL = "";
    let WEBHOOK_URL = localStorage.getItem("tour_azul_sheets_webhook_url") || "";

    // Sincronizar dinámicamente con la configuración del servidor
    fetch("/api/config")
      .then(r => r.json())
      .then(d => {
        if (d && d.config && d.config.webhookUrl) {
          WEBHOOK_URL = d.config.webhookUrl;
          try { localStorage.setItem("tour_azul_sheets_webhook_url", WEBHOOK_URL); } catch(_) {}
        }
      })
      .catch(() => {});

    const WHATSAPP_NUMERO = "584126571155";
    const MINUTOS_BLOQUEO_ASIENTO = 10;
    const ABONO_MINIMO = 5;
    const DATOS_PAGO_MOVIL = { banco: "0102 - Banco de Venezuela", cedulaRif: "V-24162410", telefono: "04126571155" };
    const INSTRUCCIONES_EFECTIVO = "Entrega el monto en efectivo al abordar la unidad el día del viaje.";

    // Notificación en pantalla tipo toast elegante
    function showToastNotification(message, type = "success") {
      const container = document.getElementById("toast-container");
      if (!container) return;
      const toast = document.createElement("div");
      const bg = type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white";
      const icon = type === "success" ? "✓" : "⚠";
      toast.className = \`pointer-events-auto px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold transition-all transform duration-300 translate-y-2 opacity-0 \${bg}\`;
      toast.innerHTML = \`<span class="text-sm font-black">\${icon}</span><span>\${message}</span>\`;
      container.appendChild(toast);
      setTimeout(() => {
        toast.classList.remove("translate-y-2", "opacity-0");
      }, 10);
      setTimeout(() => {
        toast.classList.add("opacity-0", "-translate-y-2");
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }
    window.showToastNotification = showToastNotification;

    // Normaliza el nombre del destino para la hoja correspondiente (ej: "Cayo_Muerto_18-10")
    function formatDestinoSheetName(destino, fechaViaje) {
      if (!destino) return "General";
      if (destino.includes("_") && /\d{1,2}-\d{1,2}/.test(destino)) {
        return destino;
      }
      let dateTag = "";
      if (fechaViaje && typeof fechaViaje === "string" && fechaViaje.includes("-")) {
        const parts = fechaViaje.split("-");
        if (parts.length >= 3) {
          dateTag = \`_\${parts[2]}-\${parts[1]}\`; // ej: _18-10
        }
      }
      const cleanDestino = String(destino)
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "_");
      return \`\${cleanDestino}\${dateTag}\`;
    }
    window.formatDestinoSheetName = formatDestinoSheetName;

    // ========================================================
    // GESTIÓN PERSISTENTE DE ASIENTOS OCUPADOS (SESIÓN Y LOCAL)
    // ========================================================
    function normalizeTripKey(str) {
      if (!str) return "";
      return String(str)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/^_+|_+$/g, "");
    }

    function getSeatsStorageKey(destino, fecha, bus = "Bus 1") {
      const normDest = normalizeTripKey(destino);
      const normFecha = String(fecha || "").replace(/[^0-9]/g, "");
      const normBus = normalizeTripKey(bus || "Bus 1");
      return \`tour_azul_occupied_\${normDest}_\${normFecha}_\${normBus}\`;
    }

    // Obtiene los asientos ocupados guardados en la sesión o almacenamiento local
    function getStoredOccupiedSeats(destino, fecha, bus = "Bus 1") {
      const key = getSeatsStorageKey(destino, fecha, bus);
      const setAsientos = new Set();

      // 1. Memoria activa en el estado
      if (typeof state !== "undefined" && state.asientosOcupadosCache && Array.isArray(state.asientosOcupadosCache[key])) {
        state.asientosOcupadosCache[key].forEach(n => {
          const num = Number(n);
          if (!isNaN(num) && num >= 1 && num <= 31) setAsientos.add(num);
        });
      }

      // 2. sessionStorage (persiste durante toda la pestaña/sesión del navegador)
      try {
        const rawSession = sessionStorage.getItem(key);
        if (rawSession) {
          const parsed = JSON.parse(rawSession);
          if (Array.isArray(parsed)) {
            parsed.forEach(n => {
              const num = Number(n);
              if (!isNaN(num) && num >= 1 && num <= 31) setAsientos.add(num);
            });
          }
        }
      } catch (_) {}

      // 3. localStorage (persiste entre pestañas y recargas)
      try {
        const rawLocal = localStorage.getItem(key);
        if (rawLocal) {
          const parsed = JSON.parse(rawLocal);
          if (Array.isArray(parsed)) {
            parsed.forEach(n => {
              const num = Number(n);
              if (!isNaN(num) && num >= 1 && num <= 31) setAsientos.add(num);
            });
          }
        }
      } catch (_) {}

      // 4. Registro acumulado de reservas de la sesión
      try {
        const rawBookings = sessionStorage.getItem("tour_azul_sesion_reservas");
        if (rawBookings) {
          const bookings = JSON.parse(rawBookings);
          if (Array.isArray(bookings)) {
            bookings.forEach(b => {
              if (b && b.fechaViaje === fecha && (b.bus || "Bus 1") === bus) {
                const matchDest = (b.destino === destino) || (normalizeTripKey(b.destino) === normalizeTripKey(destino));
                if (matchDest && Array.isArray(b.asientos)) {
                  b.asientos.forEach(n => {
                    const num = Number(n);
                    if (!isNaN(num) && num >= 1 && num <= 31) setAsientos.add(num);
                  });
                }
              }
            });
          }
        }
      } catch (_) {}

      return Array.from(setAsientos).sort((a, b) => a - b);
    }

    // Guarda asientos ocupados de forma persistente en sessionStorage y localStorage
    function saveStoredOccupiedSeats(destino, fecha, bus = "Bus 1", nuevosAsientos = [], replace = false) {
      const key = getSeatsStorageKey(destino, fecha, bus);
      const existentes = replace ? [] : getStoredOccupiedSeats(destino, fecha, bus);
      const setAsientos = new Set([...existentes]);

      if (Array.isArray(nuevosAsientos)) {
        nuevosAsientos.forEach(n => {
          const num = Number(n);
          if (!isNaN(num) && num >= 1 && num <= 31) {
            setAsientos.add(num);
          }
        });
      }

      const listaFinal = Array.from(setAsientos).sort((a, b) => a - b);

      if (typeof state !== "undefined" && state.asientosOcupadosCache) {
        state.asientosOcupadosCache[key] = [...listaFinal];
      }

      try {
        sessionStorage.setItem(key, JSON.stringify(listaFinal));
      } catch (_) {}

      try {
        localStorage.setItem(key, JSON.stringify(listaFinal));
      } catch (_) {}

      return listaFinal;
    }

    // Guarda la reserva confirmada en el historial de reservas de la sesión
    function saveConfirmedBookingToSession(bookingData) {
      if (!bookingData) return;
      try {
        const raw = sessionStorage.getItem("tour_azul_sesion_reservas");
        const list = raw ? JSON.parse(raw) : [];
        list.push({
          idReserva: bookingData.idReserva,
          destino: bookingData.destino,
          fechaViaje: bookingData.fechaViaje,
          bus: bookingData.bus || "Bus 1",
          asientos: bookingData.asientos || [],
          timestamp: Date.now()
        });
        sessionStorage.setItem("tour_azul_sesion_reservas", JSON.stringify(list));
      } catch (_) {}

      try {
        const rawLoc = localStorage.getItem("tour_azul_todas_reservas");
        const listLoc = rawLoc ? JSON.parse(rawLoc) : [];
        listLoc.push({
          idReserva: bookingData.idReserva,
          destino: bookingData.destino,
          fechaViaje: bookingData.fechaViaje,
          bus: bookingData.bus || "Bus 1",
          asientos: bookingData.asientos || [],
          timestamp: Date.now()
        });
        localStorage.setItem("tour_azul_todas_reservas", JSON.stringify(listLoc));
      } catch (_) {}
    }

    // Función auxiliar para calcular ocupación de una salida
    function getSalidaOccupancy(trip, salida) {
      if (!salida) return 18;
      const bus = (salida.buses && salida.buses[0]) ? salida.buses[0] : "Bus 1";
      const ocupados = getStoredOccupiedSeats(trip.destino, salida.fecha, bus);
      let hash = 0;
      const str = (trip.id || trip.destino) + salida.fecha;
      for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % 7;
      const baseOcupacion = 14 + hash;
      return Math.min(31, Math.max(ocupados.length, baseOcupacion + ocupados.length));
    }

    // Función principal para enviar reservas a Google Sheets (Google Apps Script WebHook)
    async function enviarReservaAGoogleSheets(datosReserva) {
      const urlWebHook = (typeof WEBHOOK_URL !== "undefined" && WEBHOOK_URL && WEBHOOK_URL.startsWith("http")) ? WEBHOOK_URL : "";

      if (!urlWebHook) {
        console.log("Aviso: Google Sheets no está conectado aún. La reserva se guardó localmente en el servidor.");
        return { ok: true, localOnly: true, mensaje: "Guardado local en servidor" };
      }

      // Formato exacto del destino para la hoja de Google Sheets (Ej: "Cayo_Muerto_18-10")
      const destinoHoja = formatDestinoSheetName(datosReserva.destino, datosReserva.fechaViaje);

      // Normalizar acompañantes como array de strings con nombres ['Juan Pérez', 'Maria Gomez']
      let listaAcompNombres = [];
      if (Array.isArray(datosReserva.acompanantes)) {
        listaAcompNombres = datosReserva.acompanantes.map(a => {
          if (typeof a === "string") return a;
          if (a && typeof a === "object") return a.nombre || "";
          return String(a || "");
        }).filter(Boolean);
      }

      // Estructura de los datos que espera el Google Apps Script
      const payload = {
        nombreTitular: datosReserva.nombre || datosReserva.nombreTitular || (datosReserva.titular && datosReserva.titular.nombre) || "",
        cedula: datosReserva.cedula || (datosReserva.titular && datosReserva.titular.cedula) || "",
        telefono: datosReserva.telefono || (datosReserva.titular && datosReserva.titular.telefono) || "",
        destino: datosReserva.destino || datosReserva.destinoOriginal || destinoHoja,
        destinoHoja: destinoHoja,
        destinoOriginal: datosReserva.destino || "",
        fechaViaje: datosReserva.fechaViaje || "",
        abono: Number(datosReserva.abono !== undefined ? datosReserva.abono : (datosReserva.montoAbonadoEur || 0)),
        pendiente: Number(datosReserva.pendiente !== undefined ? datosReserva.pendiente : (datosReserva.saldoPendienteEur || 0)),
        acompanantes: listaAcompNombres,
        accion: datosReserva.accion || "reservar",
        idReserva: datosReserva.idReserva || ("TA-" + (datosReserva.fechaViaje || "").replace(/-/g, "") + "-" + Math.floor(Math.random() * 900 + 100)),
        bus: datosReserva.bus || "Bus 1",
        asientos: datosReserva.asientos || [],
        totalPersonas: datosReserva.totalPersonas || (1 + listaAcompNombres.length),
        tipoPago: datosReserva.tipoPago || "Pago Móvil",
        montoAbonadoEur: Number(datosReserva.abono !== undefined ? datosReserva.abono : (datosReserva.montoAbonadoEur || 0)),
        saldoPendienteEur: Number(datosReserva.pendiente !== undefined ? datosReserva.pendiente : (datosReserva.saldoPendienteEur || 0)),
        montoPagadoBs: datosReserva.montoPagadoBs || 0,
        montoPagadoUsd: datosReserva.montoPagadoUsd || 0,
        tasaBCV: datosReserva.tasaBCV || 0,
        referenciaPagoMovil: datosReserva.referenciaPagoMovil || "",
        estadoPago: datosReserva.estadoPago || "Pendiente de pago",
        titular: datosReserva.titular || {
          nombre: datosReserva.nombre || datosReserva.nombreTitular || "",
          cedula: datosReserva.cedula || "",
          telefono: datosReserva.telefono || "",
          edad: datosReserva.edad || "",
          recogida: datosReserva.recogida || ""
        }
      };

      try {
        await fetch(urlWebHook, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        console.log("Reserva sincronizada a Google Sheets.");
        showToastNotification("¡Reserva sincronizada con Google Sheets!", "success");
        return { ok: true, payload };
      } catch (error) {
        console.warn("Aviso al enviar a Google Sheets:", error);
        return { ok: false, error };
      }
    }
    window.enviarReservaAGoogleSheets = enviarReservaAGoogleSheets;

    // DATOS DE LOS VIAJES
    const VIAJES = ${JSON.stringify(TRIPS, null, 2)};

    // ESTADO DE LA APLICACIÓN
    const state = {
      tasaBCV: 0,
      tasaDisponible: false,
      fechaTasa: "Hoy",
      fuenteTasa: "",
      mesCalendario: 10, // Noviembre (0-indexed: 10)
      anioCalendario: 2026,
      filtroDestino: "todos",
      filtroFecha: null,
      filtroDia: "todos",
      filtroPendientes: true,
      selectedTrip: null,
      selectedSalida: null,
      selectedBus: "Bus 1",
      viajeModo: "solo", // 'solo' o 'grupo'
      totalPersonas: 1,
      passengers: [{ nombre: "", cedula: "", edad: "", telefono: "", recogida: "" }],
      get titular() {
        return this.passengers[0] || { nombre: "", cedula: "", edad: "", telefono: "", recogida: "" };
      },
      set titular(val) {
        if (!this.passengers[0]) {
          this.passengers[0] = { nombre: "", cedula: "", edad: "", telefono: "", recogida: "" };
        }
        Object.assign(this.passengers[0], val);
      },
      get acompanantes() {
        return this.passengers.slice(1);
      },
      set acompanantes(val) {
        const lead = this.passengers[0] || { nombre: "", cedula: "", edad: "", telefono: "", recogida: "" };
        this.passengers = [lead, ...val];
      },
      tipoAbono: "abono", // 'abono' (5 REF p/p) o 'full'
      metodoPago: "Pago Móvil",
      referenciaPago: "",
      reservaFinal: null
    };

${rateClientCode}

${featuredClientCode}

${opinionsClientCode}

    function getBeachSvgFallback() {
      return \`<svg class="w-full h-full object-cover" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#5ED8E8"/>
            <stop offset="60%" stop-color="#A5F3FC"/>
            <stop offset="100%" stop-color="#FDE047"/>
          </linearGradient>
          <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0284C7"/>
            <stop offset="50%" stop-color="#22C3D6"/>
            <stop offset="100%" stop-color="#5EEAD4"/>
          </linearGradient>
        </defs>
        <rect width="600" height="230" fill="url(#skyGrad)"/>
        <circle cx="480" cy="90" r="45" fill="#FEF08A" opacity="0.9"/>
        <circle cx="480" cy="90" r="35" fill="#FACC15"/>
        <rect y="210" width="600" height="120" fill="url(#seaGrad)"/>
        <path d="M0,230 Q150,220 300,230 T600,230 L600,250 L0,250 Z" fill="#7DD3FC" opacity="0.6"/>
        <path d="M0,245 Q150,238 300,245 T600,245 L600,265 L0,265 Z" fill="#FFFFFF" opacity="0.5"/>
        <path d="M0,270 Q200,250 400,280 T600,290 L600,400 L0,400 Z" fill="#FDE68A"/>
        <path d="M0,300 Q250,285 500,320 L600,330 L600,400 L0,400 Z" fill="#FCD34D"/>
        <path d="M80,380 Q95,290 140,220" stroke="#78350F" stroke-width="8" stroke-linecap="round" fill="none"/>
        <path d="M140,220 Q110,180 70,195 Q105,210 140,220" fill="#15803D"/>
        <path d="M140,220 Q150,170 190,175 Q165,200 140,220" fill="#16A34A"/>
        <path d="M140,220 Q180,200 210,230 Q170,225 140,220" fill="#15803D"/>
        <path d="M140,220 Q110,210 80,240 Q110,230 140,220" fill="#16A34A"/>
      </svg>\`;
    }

    document.addEventListener("DOMContentLoaded", () => {
      lucide.createIcons();
      
      // Mostrar de inmediato la tasa guardada en caché si existe
      const cached = loadCachedRate();
      if (cached) {
        applyRate(cached.tasa, cached.fecha, "cache");
      }
      
      // Consultar APIs en segundo plano
      fetchBcvRate();
      
      // Refresco periódico cada 30 minutos
      setInterval(fetchBcvRate, 30 * 60 * 1000);

      renderHeroChips();
      initFeaturedTrips();
      scheduleMidnightCaracasUpdate();
      setInterval(initFeaturedTrips, 3600000);
      renderDestinationFilters();
      renderDynamicDaysSelector();
      renderTrips();
      setupEventListeners();
      initOpinionsSystem();

      // Aplicar modo temporal de preapertura
      applyPrelaunchModeUI();
      if (window.location.hash === "#unete-al-equipo") {
        showRecruitmentView();
      }
    });

    function renderHeroChips() {
      const container = document.getElementById("hero-chips");
      const popular = [...new Set(VIAJES.map(v => v.destino))].slice(0, 10);
      container.innerHTML = popular.map((dest, i) => \`
        <button onclick="scrollToDestination('\${dest}')" class="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-tour-navy border border-white/30 text-xs font-bold transition shadow-sm backdrop-blur-md active:scale-95 cursor-pointer" style="animation: float \${3.5 + (i % 3) * 0.7}s ease-in-out infinite; animation-delay: \${(i * 0.2)}s">
          \${dest}
        </button>
      \`).join("");
    }

    window.scrollToDestination = function(dest) {
      state.filtroDestino = dest;
      state.filtroFecha = null;
      renderDestinationFilters();
      renderTrips();
      document.getElementById("viajes").scrollIntoView({ behavior: "smooth" });
    };

    function renderDestinationFilters() {
      const container = document.getElementById("destination-filters");
      const destinations = ["todos", ...new Set(VIAJES.map(v => v.destino))];
      container.innerHTML = destinations.map(d => {
        const isSelected = state.filtroDestino === d;
        const label = d === "todos" ? "Todos los destinos" : d;
        return \`
          <button onclick="setDestinationFilter('\${d}')" class="whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold transition shadow-sm \${isSelected ? 'bg-tour-blue text-white shadow-md' : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'}">
            \${label}
          </button>
        \`;
      }).join("");
    }

    window.setDestinationFilter = function(dest) {
      state.filtroDestino = dest;
      renderDestinationFilters();
      renderTrips();
    };

${dynamicCalendarClientCode}

    window.openPoliticasModal = function() {
      const modal = document.getElementById("modal-politicas");
      if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        lucide.createIcons();
      }
    };

    window.closePoliticasModal = function() {
      const modal = document.getElementById("modal-politicas");
      if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    };

    let currentStep = 1;

    window.startBooking = function(tripId, salidaIndex = 0) {
      const trip = VIAJES.find(t => t.id === tripId);
      if (!trip) return;

      const todayIso = (typeof getCaracasTodayStr === 'function') ? getCaracasTodayStr() : new Date().toISOString().split('T')[0];
      let candidateSalida = trip.salidas[salidaIndex] || trip.salidas[0];

      if (candidateSalida.fecha < todayIso) {
        const nextAvailable = trip.salidas.find(s => s.fecha >= todayIso);
        if (nextAvailable) {
          candidateSalida = nextAvailable;
        } else {
          alert("Todas las salidas programadas para este viaje ya han culminado.");
          return;
        }
      }

      state.selectedTrip = trip;
      state.selectedSalida = candidateSalida;
      state.viajeModo = "solo";
      state.totalPersonas = 1;
      state.tipoAbono = "abono";
      state.metodoPago = "Pago Móvil";

      if (!state.passengers || state.passengers.length === 0) {
        state.passengers = [{ nombre: "", cedula: "", edad: "", telefono: "", recogida: "" }];
      }

      const tripNameEl = document.getElementById("wizard-trip-name");
      const tripDateEl = document.getElementById("wizard-trip-date");
      if (tripNameEl) tripNameEl.textContent = trip.destino;
      if (tripDateEl) tripDateEl.textContent = state.selectedSalida.fechaTexto;

      setViajeModo("solo");
      const nameInput = document.getElementById("reg-lead-name");
      const ciInput = document.getElementById("reg-lead-cedula");
      const telfInput = document.getElementById("reg-lead-phone");
      const ageInput = document.getElementById("reg-lead-age");
      const pickupInput = document.getElementById("reg-lead-pickup");
      if (nameInput) nameInput.value = state.passengers[0]?.nombre || "";
      if (ciInput) ciInput.value = state.passengers[0]?.cedula || "";
      if (telfInput) telfInput.value = state.passengers[0]?.telefono || "";
      if (ageInput) ageInput.value = state.passengers[0]?.edad || "";
      if (pickupInput) pickupInput.value = state.passengers[0]?.recogida || "";

      goToStep(1);

      const modal = document.getElementById("modal-wizard");
      if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      }
    };

    function closeWizard() {
      const modal = document.getElementById("modal-wizard");
      if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    }

    window.setViajeModo = function(modo) {
      state.viajeModo = modo;
      const btnSolo = document.getElementById("btn-opt-solo");
      const btnGrupo = document.getElementById("btn-opt-grupo");
      const checkSolo = document.getElementById("check-solo");
      const checkGrupo = document.getElementById("check-grupo");
      const boxStepper = document.getElementById("box-stepper-acomp");

      if (modo === "solo") {
        state.totalPersonas = 1;
        state.passengers = [state.passengers[0] || { nombre: "", cedula: "", edad: "", telefono: "", recogida: "" }];
        if (btnSolo) btnSolo.className = "p-3.5 rounded-2xl border-2 text-left transition flex flex-col gap-1 border-tour-blue bg-blue-50/70 shadow-xs cursor-pointer";
        if (btnGrupo) btnGrupo.className = "p-3.5 rounded-2xl border-2 text-left transition flex flex-col gap-1 border-slate-200 hover:border-slate-300 bg-white cursor-pointer";
        if (checkSolo) {
          checkSolo.className = "w-4 h-4 rounded-full bg-tour-blue text-white flex items-center justify-center text-[10px] font-bold";
          checkSolo.innerHTML = "✓";
        }
        if (checkGrupo) {
          checkGrupo.className = "w-4 h-4 rounded-full border border-slate-300 hidden";
          checkGrupo.innerHTML = "";
        }
        if (boxStepper) boxStepper.classList.add("hidden");
      } else {
        if (state.totalPersonas < 2) state.totalPersonas = 2;
        if (btnGrupo) btnGrupo.className = "p-3.5 rounded-2xl border-2 text-left transition flex flex-col gap-1 border-tour-blue bg-blue-50/70 shadow-xs cursor-pointer";
        if (btnSolo) btnSolo.className = "p-3.5 rounded-2xl border-2 text-left transition flex flex-col gap-1 border-slate-200 hover:border-slate-300 bg-white cursor-pointer";
        if (checkGrupo) {
          checkGrupo.className = "w-4 h-4 rounded-full bg-tour-blue text-white flex items-center justify-center text-[10px] font-bold";
          checkGrupo.innerHTML = "✓";
        }
        if (checkSolo) {
          checkSolo.className = "w-4 h-4 rounded-full border border-slate-300 hidden";
          checkSolo.innerHTML = "";
        }
        if (boxStepper) boxStepper.classList.remove("hidden");
      }
      const countEl = document.getElementById("count-total-personas");
      if (countEl) countEl.textContent = state.totalPersonas;
      renderRegAcompForms();
      updateWizardBottomTotal();
    };

    window.cambiarTotalPersonas = function(delta) {
      const nuevo = Math.min(15, Math.max(2, state.totalPersonas + delta));
      state.totalPersonas = nuevo;
      const countEl = document.getElementById("count-total-personas");
      if (countEl) countEl.textContent = nuevo;
      renderRegAcompForms();
      updateWizardBottomTotal();
    };

    window.setRegPickup = function(text) {
      const el = document.getElementById("reg-lead-pickup");
      if (el) {
        el.value = text;
        if (!state.passengers[0]) state.passengers[0] = { nombre: "", cedula: "", edad: "", telefono: "", recogida: "" };
        state.passengers[0].recogida = text;
      }
    };

    function escapeAttr(str) {
      if (str === null || str === undefined) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function renderRegAcompForms() {
      const container = document.getElementById("reg-acomp-container");
      if (!container) return;
      if (state.viajeModo === "solo" || state.totalPersonas <= 1) {
        container.innerHTML = "";
        return;
      }

      const numAcomp = state.totalPersonas - 1;
      let htmlStr = "";
      for (let i = 0; i < numAcomp; i++) {
        const comp = state.passengers[i + 1] || { nombre: "", cedula: "", edad: "", recogida: "" };
        htmlStr += '<div class="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2.5 shadow-2xs">' +
          '<div class="flex items-center justify-between border-b border-slate-100 pb-1.5">' +
            '<span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">' +
              '<i data-lucide="user" class="w-3.5 h-3.5 text-tour-caribe"></i>' +
              '<span>Acompañante ' + (i + 1) + '</span>' +
            '</span>' +
            '<span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Cupo adicional</span>' +
          '</div>' +
          '<div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">' +
            '<div class="sm:col-span-2">' +
              '<label class="block text-slate-600 font-medium mb-1">Nombre y Apellido *</label>' +
              '<input type="text" id="reg-comp-name-' + i + '" value="' + escapeAttr(comp.nombre) + '" placeholder="Ej. Mariana González" class="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">' +
            '</div>' +
            '<div>' +
              '<label class="block text-slate-600 font-medium mb-1">Cédula o Edad *</label>' +
              '<input type="text" id="reg-comp-cedula-' + i + '" value="' + escapeAttr(comp.cedula || comp.edad) + '" placeholder="Ej. V-25123456 o 12 años" class="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">' +
            '</div>' +
          '</div>' +
        '</div>';
      }
      container.innerHTML = htmlStr;
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    }

    window.setRegPagoTipo = function(tipo) {
      state.tipoAbono = tipo;
      const btnAbono = document.getElementById("pay-opt-deposit");
      const btnFull = document.getElementById("pay-opt-full");
      if (tipo === "abono") {
        if (btnAbono) btnAbono.className = "py-2.5 px-3 rounded-xl font-bold text-xs transition bg-white text-tour-navy shadow-sm cursor-pointer";
        if (btnFull) btnFull.className = "py-2.5 px-3 rounded-xl font-bold text-xs transition text-slate-600 hover:text-tour-navy cursor-pointer";
      } else {
        if (btnFull) btnFull.className = "py-2.5 px-3 rounded-xl font-bold text-xs transition bg-white text-tour-navy shadow-sm cursor-pointer";
        if (btnAbono) btnAbono.className = "py-2.5 px-3 rounded-xl font-bold text-xs transition text-slate-600 hover:text-tour-navy cursor-pointer";
      }
      renderStep2();
      updateWizardBottomTotal();
    };

    window.setRegMetodoPago = function(metodo) {
      state.metodoPago = metodo;
      const boxPm = document.getElementById("method-box-pagomovil");
      const boxEf = document.getElementById("method-box-efectivo");
      const lblPm = document.getElementById("label-method-pagomovil");
      const lblEf = document.getElementById("label-method-efectivo");

      if (metodo === "Pago Móvil") {
        if (boxPm) boxPm.classList.remove("hidden");
        if (boxEf) boxEf.classList.add("hidden");
        if (lblPm) lblPm.className = "relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-tour-blue bg-blue-50/50";
        if (lblEf) lblEf.className = "relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-slate-200 hover:border-slate-300";
      } else {
        if (boxPm) boxPm.classList.add("hidden");
        if (boxEf) boxEf.classList.remove("hidden");
        if (lblEf) lblEf.className = "relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-emerald-500 bg-emerald-50/50";
        if (lblPm) lblPm.className = "relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-slate-200 hover:border-slate-300";
      }
    };

    function goToStep(step) {
      currentStep = step;

      for (let s = 1; s <= 3; s++) {
        const icon = document.getElementById("step-icon-" + s);
        const line = document.getElementById("step-line-" + s);
        if (icon) {
          if (s < step) {
            icon.className = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-emerald-500 text-white shadow-sm transition-all";
            icon.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
            if (line) line.className = "flex-1 h-0.5 bg-emerald-500 mx-2";
          } else if (s === step) {
            icon.className = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-tour-blue text-white shadow-sm ring-4 ring-blue-100 transition-all";
            icon.textContent = String(s);
            if (line) line.className = "flex-1 h-0.5 bg-slate-200 mx-2";
          } else {
            icon.className = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-slate-100 text-slate-500 transition-all";
            icon.textContent = String(s);
            if (line) line.className = "flex-1 h-0.5 bg-slate-200 mx-2";
          }
        }
      }

      document.querySelectorAll(".step-view").forEach(el => el.classList.add("hidden"));
      const currentView = document.getElementById("step-content-" + step);
      if (currentView) currentView.classList.remove("hidden");

      const btnPrev = document.getElementById("btn-wizard-prev");
      const btnNextText = document.getElementById("btn-wizard-next-text");
      if (step > 1) {
        if (btnPrev) btnPrev.classList.remove("hidden");
      } else {
        if (btnPrev) btnPrev.classList.add("hidden");
      }

      if (step === 3) {
        if (btnNextText) btnNextText.textContent = "Confirmar y Enviar Reserva";
      } else {
        if (btnNextText) btnNextText.textContent = "Continuar";
      }

      if (step === 1) renderStep1();
      if (step === 2) renderStep2();
      if (step === 3) renderStep3();

      updateWizardBottomTotal();
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    }

    function renderStep1() {
      const lead = state.passengers[0] || {};
      const nameInput = document.getElementById("reg-lead-name");
      const ciInput = document.getElementById("reg-lead-cedula");
      const telfInput = document.getElementById("reg-lead-phone");
      const ageInput = document.getElementById("reg-lead-age");
      const pickupInput = document.getElementById("reg-lead-pickup");
      if (nameInput && lead.nombre) nameInput.value = lead.nombre;
      if (ciInput && lead.cedula) ciInput.value = lead.cedula;
      if (telfInput && lead.telefono) telfInput.value = lead.telefono;
      if (ageInput && lead.edad) ageInput.value = lead.edad;
      if (pickupInput && lead.recogida) pickupInput.value = lead.recogida;
      renderRegAcompForms();
    }

    function renderStep2() {
      if (!state.selectedTrip) return;
      const numPers = state.totalPersonas || 1;
      const totalEur = state.selectedTrip.precio * numPers;
      const totalAbono = 5 * numPers;

      let toPayTodayEur = (state.tipoAbono === "abono") ? totalAbono : totalEur;
      let balanceEur = totalEur - toPayTodayEur;

      const peopleText = (numPers === 1) ? "1 persona (Titular)" : (numPers + " personas (" + (state.viajeModo === 'grupo' ? 'Titular + ' + (numPers - 1) + ' acompañantes' : numPers + ' pasajeros') + ")");
      const peopleSummaryEl = document.getElementById("pay-people-summary");
      if (peopleSummaryEl) peopleSummaryEl.textContent = peopleText;

      const totalSummaryEl = document.getElementById("pay-total-summary");
      if (totalSummaryEl) totalSummaryEl.textContent = totalEur + " REF (" + totalEur + " €)";

      const todayEl = document.getElementById("pay-amount-today");
      const balanceEl = document.getElementById("pay-amount-balance");

      if (state.tasaDisponible && state.tasaBCV > 0) {
        const amountBs = formatVzla(toPayTodayEur * state.tasaBCV);
        const balanceBs = formatVzla(balanceEur * state.tasaBCV);
        if (todayEl) todayEl.textContent = toPayTodayEur + " REF (Bs. " + amountBs + ")";
        if (balanceEl) balanceEl.textContent = balanceEur + " REF (Bs. " + balanceBs + ")";
        const pmMontoEl = document.getElementById("pagomovil-monto-bs");
        if (pmMontoEl) pmMontoEl.textContent = "Bs. " + amountBs;
      } else {
        if (todayEl) todayEl.textContent = toPayTodayEur + " REF (" + toPayTodayEur + " €)";
        if (balanceEl) balanceEl.textContent = balanceEur + " REF (" + balanceEur + " €)";
        const pmMontoEl = document.getElementById("pagomovil-monto-bs");
        if (pmMontoEl) pmMontoEl.textContent = toPayTodayEur + " REF";
      }

      const efAmountEl = document.getElementById("efectivo-monto-usd");
      if (efAmountEl) efAmountEl.textContent = toPayTodayEur + " $";
    }

    function renderStep3() {
      if (!state.selectedTrip) return;
      const numPers = state.totalPersonas || 1;
      const totalEur = state.selectedTrip.precio * numPers;
      const toPayToday = (state.tipoAbono === "abono") ? (5 * numPers) : totalEur;
      const balanceEur = totalEur - toPayToday;
      const titular = state.passengers[0] || {};
      const acompList = state.passengers.slice(1);

      let acompHtml = "";
      if (acompList.length > 0) {
        acompHtml = '<div class="border-t border-sky-100 pt-2 space-y-1">' +
          '<span class="font-bold text-tour-navy block text-[11px]">Acompañantes registrados (' + acompList.length + '):</span>' +
          '<ul class="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">' +
            acompList.map(function(a) {
              return '<li><strong>' + (a.nombre || 'Acompañante') + '</strong> (' + (a.cedula || a.edad || 'Acompañante') + ')</li>';
            }).join("") +
          '</ul>' +
        '</div>';
      }

      let bsRateText = "";
      if (state.tasaDisponible && state.tasaBCV > 0) {
        bsRateText = " ≈ Bs. " + formatVzla(toPayToday * state.tasaBCV);
      }

      const summaryCard = document.getElementById("summary-card");
      if (summaryCard) {
        let cardHtml = '<div class="border-b border-sky-100 pb-2.5 flex justify-between items-center">' +
          '<div>' +
            '<span class="font-title font-bold text-base text-tour-navy block">' + state.selectedTrip.destino + '</span>' +
            '<span class="text-xs text-tour-blue font-semibold">' + state.selectedSalida.fechaTexto + '</span>' +
          '</div>' +
          '<span class="font-title font-black text-xs bg-tour-blue text-white px-3 py-1 rounded-full shadow-2xs">' +
            numPers + ' cupo' + (numPers > 1 ? 's' : '') +
          '</span>' +
        '</div>' +

        '<div class="space-y-1.5 text-xs text-slate-700">' +
          '<div class="flex justify-between">' +
            '<span class="text-slate-500">Titular Responsable:</span>' +
            '<span class="font-bold text-slate-900">' + (titular.nombre || '') + ' (' + (titular.cedula || '') + ')</span>' +
          '</div>' +
          '<div class="flex justify-between">' +
            '<span class="text-slate-500">Teléfono WhatsApp:</span>' +
            '<span class="font-bold text-slate-900">' + (titular.telefono || '') + '</span>' +
          '</div>' +
          '<div class="flex justify-between">' +
            '<span class="text-slate-500">Punto de Salida:</span>' +
            '<span class="font-bold text-tour-blue text-right max-w-[60%]">' + (titular.recogida || '') + '</span>' +
          '</div>' +
          '<div class="flex justify-between">' +
            '<span class="text-slate-500">Forma de Pago:</span>' +
            '<span class="font-bold text-tour-navy">' + state.metodoPago + ' (' + (state.tipoAbono === 'abono' ? 'Abono 5 REF p/p' : 'Pago Completo') + ')</span>' +
          '</div>';

        if (state.metodoPago === 'Pago Móvil' && state.referenciaPago) {
          cardHtml += '<div class="flex justify-between">' +
            '<span class="text-slate-500">Referencia Pago Móvil:</span>' +
            '<span class="font-mono font-bold text-tour-blue">' + state.referenciaPago + '</span>' +
          '</div>';
        }

        cardHtml += '</div>' + acompHtml +
        '<div class="border-t border-sky-100 pt-2.5 space-y-1 text-xs">' +
          '<div class="flex justify-between">' +
            '<span class="text-slate-500">Total excursión:</span>' +
            '<span class="font-bold text-tour-navy">' + totalEur + ' REF</span>' +
          '</div>' +
          '<div class="flex justify-between text-tour-blue font-black text-sm">' +
            '<span>Abono / Pago Hoy:</span>' +
            '<span>' + toPayToday + ' REF' + bsRateText + '</span>' +
          '</div>';

        if (balanceEur > 0) {
          cardHtml += '<div class="flex justify-between text-amber-800 font-bold">' +
            '<span>Saldo pendiente al abordar:</span>' +
            '<span>' + balanceEur + ' REF</span>' +
          '</div>';
        }

        cardHtml += '</div>';
        summaryCard.innerHTML = cardHtml;
      }
    }

    function updateWizardBottomTotal() {
      if (!state.selectedTrip) {
        const el = document.getElementById("wizard-bottom-total-eur");
        if (el) el.textContent = "0 REF";
        return;
      }
      const numPers = state.totalPersonas || 1;
      const totalEur = state.selectedTrip.precio * numPers;
      const el = document.getElementById("wizard-bottom-total-eur");
      if (el) el.textContent = totalEur + " REF";

      const bsEl = document.getElementById("wizard-bottom-total-bs");
      if (bsEl) {
        if (state.tasaDisponible && state.tasaBCV > 0) {
          bsEl.textContent = "≈ Bs. " + formatVzla(totalEur * state.tasaBCV);
        } else {
          bsEl.textContent = "";
        }
      }
    }

    function validateStep(step) {
      if (step === 1) {
        const name = (document.getElementById("reg-lead-name")?.value || "").trim();
        const ci = (document.getElementById("reg-lead-cedula")?.value || "").trim();
        const telf = (document.getElementById("reg-lead-phone")?.value || "").trim();
        const age = (document.getElementById("reg-lead-age")?.value || "").trim();
        const pickup = (document.getElementById("reg-lead-pickup")?.value || "").trim();

        if (!name || !ci || !telf) {
          alert("Por favor completa los datos obligatorios del titular (Nombre, Cédula y Teléfono WhatsApp).");
          return false;
        }
        if (!pickup) {
          alert("Por favor indica el punto de salida o partida (ej. Metrópolis, Las Trinitarias, Cabudare o Yaracuy).");
          return false;
        }

        state.passengers[0] = {
          nombre: name,
          cedula: ci,
          telefono: telf,
          edad: age,
          recogida: pickup
        };

        if (state.viajeModo === "grupo" && state.totalPersonas > 1) {
          const numAcomp = state.totalPersonas - 1;
          for (let i = 0; i < numAcomp; i++) {
            const compName = (document.getElementById("reg-comp-name-" + i)?.value || "").trim();
            const compCi = (document.getElementById("reg-comp-cedula-" + i)?.value || "").trim();
            if (!compName) {
              alert("Por favor ingresa el nombre del acompañante " + (i + 1) + ".");
              return false;
            }
            state.passengers[i + 1] = {
              nombre: compName,
              cedula: compCi,
              edad: compCi,
              recogida: pickup
            };
          }
        }
        return true;
      }

      if (step === 2) {
        if (state.metodoPago === "Pago Móvil") {
          const ref = (document.getElementById("pagomovil-ref")?.value || "").trim();
          if (!ref) {
            alert("Por favor ingresa el número de referencia del Pago Móvil para verificar tu comprobante.");
            return false;
          }
          state.referenciaPago = ref;
        }
        return true;
      }

      return true;
    }

    async function submitBooking() {
      const overlay = document.getElementById("loading-overlay");
      if (overlay) {
        overlay.classList.remove("hidden");
        overlay.classList.add("flex");
      }

      const numPers = state.totalPersonas || 1;
      const totalEur = state.selectedTrip.precio * numPers;
      const toPayToday = (state.tipoAbono === "abono") ? (5 * numPers) : totalEur;
      const balanceEur = totalEur - toPayToday;
      const frozenRate = state.tasaBCV || 0;
      const totalBs = frozenRate > 0 ? parseFloat((totalEur * frozenRate).toFixed(2)) : 0;
      const paidBs = (state.metodoPago === "Pago Móvil" && frozenRate > 0) ? parseFloat((toPayToday * frozenRate).toFixed(2)) : 0;
      const paidUsd = state.metodoPago === "Efectivo" ? toPayToday : 0;
      const estadoPago = state.metodoPago === "Pago Móvil" ? "Pagado" : "Pendiente de pago";

      const idReserva = "TA-" + (state.selectedSalida.fecha || "").replace(/-/g, "") + "-" + String(Math.floor(Math.random() * 900) + 100);
      const titular = state.passengers[0] || {};
      const acompanantes = state.passengers.slice(1);

      const payload = {
        accion: "reservar",
        idReserva: idReserva,
        fechaRegistro: new Date().toISOString(),
        destino: state.selectedTrip.destino,
        fechaViaje: state.selectedSalida.fecha,
        fechaTexto: state.selectedSalida.fechaTexto,
        totalPersonas: numPers,
        viajeModo: state.viajeModo,
        puntoPartida: titular.recogida || "",
        tipoAbono: state.tipoAbono,
        tipoPago: state.metodoPago,
        montoAbonadoEur: toPayToday,
        saldoPendienteEur: balanceEur,
        montoPagadoBs: paidBs,
        montoPagadoUsd: paidUsd,
        tasaBCV: frozenRate,
        referenciaPagoMovil: state.referenciaPago || "",
        estadoPago: estadoPago,
        titular: Object.assign({}, titular),
        acompanantes: acompanantes.map(function(a) { return Object.assign({}, a); }),
        passengers: state.passengers.map(function(p) { return Object.assign({}, p); })
      };

      state.reservaFinal = payload;

      // 1. Guardar en el backend del servidor (/api/reservas)
      try {
        await fetch("/api/reservas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (errApi) {
        console.warn("Aviso al guardar en servidor local /api/reservas:", errApi);
      }

      // 2. Enviar a Google Sheets mediante Apps Script Webhook
      try {
        await enviarReservaAGoogleSheets({
          nombre: titular.nombre,
          cedula: titular.cedula,
          telefono: titular.telefono,
          destino: state.selectedTrip.destino,
          fechaViaje: state.selectedSalida.fecha,
          abono: toPayToday,
          pendiente: balanceEur,
          acompanantes: acompanantes.map(function(a) { return a.nombre; }),
          idReserva: idReserva,
          totalPersonas: numPers,
          tipoPago: state.metodoPago,
          montoPagadoBs: paidBs,
          montoPagadoUsd: paidUsd,
          tasaBCV: frozenRate,
          referenciaPagoMovil: state.referenciaPago || "",
          estadoPago: estadoPago,
          titular: Object.assign({}, titular, { recogida: titular.recogida })
        });
      } catch (errSheets) {
        console.warn("Aviso al enviar a Google Sheets:", errSheets);
      }

      if (overlay) {
        overlay.classList.add("hidden");
        overlay.classList.remove("flex");
      }

      closeWizard();
      showSuccessModal(payload);
    }

    function showSuccessModal(data) {
      const modal = document.getElementById("modal-success");
      if (!modal) return;
      modal.classList.remove("hidden");
      modal.classList.add("flex");

      if (window.confetti) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }

      const idEl = document.getElementById("ticket-id");
      const destEl = document.getElementById("ticket-destino");
      const fechaEl = document.getElementById("ticket-fecha");
      const asientosEl = document.getElementById("ticket-asientos");
      const pasEl = document.getElementById("ticket-pasajeros");
      const metodoEl = document.getElementById("ticket-metodo");
      const pagoEl = document.getElementById("ticket-pago");

      if (idEl) idEl.textContent = data.idReserva;
      if (destEl) destEl.textContent = data.destino;
      if (fechaEl) fechaEl.textContent = (state.selectedSalida && state.selectedSalida.fechaTexto) || data.fechaViaje;
      if (asientosEl) asientosEl.textContent = data.totalPersonas + " pasajero" + (data.totalPersonas > 1 ? "s" : "") + " (" + (data.viajeModo === "solo" ? "Viaja solo/a" : "Con acompañantes") + ")";

      let pasList = "<div><strong>" + (data.titular.nombre || "") + "</strong> (" + (data.titular.cedula || "") + ") - Punto: " + (data.titular.recogida || "") + "</div>";
      if (Array.isArray(data.acompanantes) && data.acompanantes.length > 0) {
        data.acompanantes.forEach(function(c) {
          pasList += "<div><strong>" + (c.nombre || "") + "</strong> (" + (c.cedula || c.edad || "Acompañante") + ")</div>";
        });
      }
      if (pasEl) pasEl.innerHTML = pasList;
      if (metodoEl) metodoEl.textContent = data.tipoPago + " (" + (data.tipoAbono === "abono" ? "Abono 5 REF p/p" : "Completo") + ")";

      if (data.tipoPago === "Pago Móvil" && data.tasaBCV > 0) {
        if (pagoEl) pagoEl.textContent = data.montoAbonadoEur + " REF (Bs. " + formatVzla(data.montoPagadoBs) + ") / Saldo: " + data.saldoPendienteEur + " REF";
      } else {
        if (pagoEl) pagoEl.textContent = data.montoAbonadoEur + " REF / Saldo: " + data.saldoPendienteEur + " REF";
      }

      const efBox = document.getElementById("ticket-efectivo-box");
      if (data.tipoPago === "Efectivo") {
        if (efBox) efBox.classList.remove("hidden");
        const saldoEf = document.getElementById("ticket-saldo-efectivo");
        if (saldoEf) saldoEf.textContent = (data.saldoPendienteEur > 0 ? data.saldoPendienteEur : data.montoAbonadoEur) + " $";
      } else {
        if (efBox) efBox.classList.add("hidden");
      }

      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    }

    function setupEventListeners() {
      const btnMonthPrev = document.getElementById("btn-month-prev");
      if (btnMonthPrev) {
        btnMonthPrev.onclick = () => {
          if (state.mesCalendario > 0) {
            state.mesCalendario--;
          } else {
            state.mesCalendario = 11;
            state.anioCalendario--;
          }
          state.filtroFecha = null;
          renderCalendar();
          renderTrips();
        };
      }

      const btnMonthNext = document.getElementById("btn-month-next");
      if (btnMonthNext) {
        btnMonthNext.onclick = () => {
          if (state.mesCalendario < 11) {
            state.mesCalendario++;
          } else {
            state.mesCalendario = 0;
            state.anioCalendario++;
          }
          state.filtroFecha = null;
          renderCalendar();
          renderTrips();
        };
      }

      const clearBtn = document.getElementById("btn-clear-date-filter");
      if (clearBtn) {
        clearBtn.onclick = clearDateFilter;
      }

      const btnCloseDet = document.getElementById("btn-close-detalles");
      if (btnCloseDet) btnCloseDet.onclick = closeDetallesModal;

      const closePoliticasBtn = document.getElementById("btn-close-politicas");
      if (closePoliticasBtn) closePoliticasBtn.onclick = closePoliticasModal;

      const btnCloseWiz = document.getElementById("btn-close-wizard");
      if (btnCloseWiz) btnCloseWiz.onclick = closeWizard;

      const btnCloseSuccess = document.getElementById("btn-close-success");
      if (btnCloseSuccess) {
        btnCloseSuccess.onclick = () => {
          const mSuccess = document.getElementById("modal-success");
          if (mSuccess) {
            mSuccess.classList.add("hidden");
            mSuccess.classList.remove("flex");
          }
          renderTrips();
        };
      }

      const btnWizPrev = document.getElementById("btn-wizard-prev");
      if (btnWizPrev) {
        btnWizPrev.onclick = () => {
          if (currentStep > 1) goToStep(currentStep - 1);
        };
      }

      const btnWizNext = document.getElementById("btn-wizard-next");
      if (btnWizNext) {
        btnWizNext.onclick = () => {
          if (!validateStep(currentStep)) return;
          if (currentStep < 3) {
            goToStep(currentStep + 1);
          } else {
            submitBooking();
          }
        };
      }

      const toggleSep = document.getElementById("toggle-separate-pickup");
      if (toggleSep) {
        toggleSep.onchange = (e) => {
          if (typeof handleToggleSeparatePickup === 'function') handleToggleSeparatePickup(e.target.checked);
        };
      }

      const btnPayFull = document.getElementById("pay-opt-full");
      if (btnPayFull) {
        btnPayFull.onclick = () => { setRegPagoTipo('full'); };
      }
      const btnPayDeposit = document.getElementById("pay-opt-deposit");
      if (btnPayDeposit) {
        btnPayDeposit.onclick = () => { setRegPagoTipo('abono'); };
      }

      document.querySelectorAll("input[name='paymentMethod']").forEach(radio => {
        radio.onchange = (e) => {
          state.metodoPago = e.target.value;
          const boxPm = document.getElementById("method-box-pagomovil");
          const boxEf = document.getElementById("method-box-efectivo");
          const lblPm = document.getElementById("label-method-pagomovil");
          const lblEf = document.getElementById("label-method-efectivo");

          if (state.metodoPago === "Pago Móvil") {
            if (boxPm) boxPm.classList.remove("hidden");
            if (boxEf) boxEf.classList.add("hidden");
            if (lblPm) lblPm.className = "relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-tour-blue bg-blue-50/50";
            if (lblEf) lblEf.className = "relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-slate-200 hover:border-slate-300";
          } else {
            if (boxPm) boxPm.classList.add("hidden");
            if (boxEf) boxEf.classList.remove("hidden");
            if (lblEf) lblEf.className = "relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-emerald-500 bg-emerald-50/50";
            if (lblPm) lblPm.className = "relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-slate-200 hover:border-slate-300";
          }
        };
      });

      const btnCopyBs = document.getElementById("btn-copy-bs");
      if (btnCopyBs) {
        btnCopyBs.onclick = () => {
          const pmEl = document.getElementById("pagomovil-monto-bs");
          const text = pmEl ? pmEl.textContent.replace("Bs.", "").replace("Bs", "").trim() : "";
          if (navigator.clipboard && text) {
            navigator.clipboard.writeText(text);
          }
          const copyTextEl = document.getElementById("copy-bs-text");
          if (copyTextEl) {
            copyTextEl.textContent = "¡Copiado!";
            setTimeout(() => {
              copyTextEl.textContent = "Copiar monto";
            }, 2000);
          }
        };
      }

      const btnDlTicket = document.getElementById("btn-download-ticket");
      if (btnDlTicket) {
        btnDlTicket.onclick = () => {
          const ticketNode = document.getElementById("ticket-card");
          if (window.html2canvas && ticketNode) {
            html2canvas(ticketNode, { scale: 2.5, backgroundColor: "#ffffff" }).then(canvas => {
              const link = document.createElement("a");
              const resId = (state.reservaFinal && state.reservaFinal.idReserva) || "reserva";
              link.download = "Ticket-TourAzul-" + resId + ".png";
              link.href = canvas.toDataURL("image/png");
              link.click();
            });
          }
        };
      }

      const btnShareWa = document.getElementById("btn-share-whatsapp");
      if (btnShareWa) {
        btnShareWa.onclick = () => {
          if (!state.reservaFinal) {
            alert("La reserva aún no ha sido procesada.");
            return;
          }
          const r = state.reservaFinal;
          const idReserva = r.idReserva || "No indicado";
          const destino = r.destino || "No indicado";
          const fechaViaje = (state.selectedSalida && state.selectedSalida.fechaTexto) || r.fechaViaje || "No indicado";
          const totalP = r.totalPersonas || 1;
          const titular = r.titular || {};
          const punto = titular.recogida || r.puntoPartida || "Por coordinar";

          const nl = String.fromCharCode(10);
          const listaPasajeros = [];
          listaPasajeros.push("1. " + (titular.nombre || "Titular") + " (CI: " + (titular.cedula || "--") + ") - Telf: " + (titular.telefono || "--") + " - Salida: " + punto);
          if (Array.isArray(r.acompanantes)) {
            r.acompanantes.forEach((a, idx) => {
              listaPasajeros.push((idx + 2) + ". " + (a.nombre || "Acompañante") + " (CI/Edad: " + (a.cedula || a.edad || "--") + ")");
            });
          }

          const esEfectivo = (r.tipoPago === "Efectivo");
          const metodoPago = esEfectivo ? "Efectivo ($/€)" : (r.tipoPago || "Pago Móvil");
          let montoPagado = r.montoAbonadoEur + " REF";
          if (!esEfectivo && r.montoPagadoBs > 0) {
            montoPagado += " (Bs. " + formatVzla(r.montoPagadoBs) + ")";
          }
          const saldoPendiente = (typeof r.saldoPendienteEur === "number") ? (r.saldoPendienteEur + " REF") : "0 REF";
          const referencia = esEfectivo ? "Sin referencia (Efectivo)" : (r.referenciaPagoMovil || "No indicado");
          const estado = (r.saldoPendienteEur === 0) ? "Pagado Completo" : "Abonado (5 REF p/p)";

          const mensaje = [
            "🎫 NUEVA RESERVA REGISTRADA - TOUR AZUL",
            "",
            "N° de reserva: " + idReserva,
            "Destino: " + destino,
            "Fecha: " + fechaViaje,
            "Total pasajeros: " + totalP + " persona(s)",
            "Punto de salida: " + punto,
            "",
            "👥 LISTA DE PASAJEROS",
            listaPasajeros.join(nl),
            "",
            "💳 DETALLES DE PAGO",
            "Forma de pago: " + metodoPago,
            "Monto pagado/abonado: " + montoPagado,
            "Saldo pendiente al abordar: " + saldoPendiente,
            "Referencia de pago: " + referencia,
            "Estado de reserva: " + estado,
            "",
            "✅ Políticas aceptadas. ¡Gracias por viajar con Tour Azul!"
          ].join(nl);

          const url = "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(mensaje);
          window.open(url, "_blank");
        };
      }

      const floatWa = document.getElementById("btn-whatsapp-float");
      if (floatWa) {
        const defaultWaMsg = "¡Hola Tour Azul! Quiero consultar sobre los viajes y excursiones disponibles.";
        floatWa.href = "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(defaultWaMsg);
      }
    }
  </script>

  <!-- CONTENEDOR REACT PARA PANEL DE ADMINISTRACIÓN Y COMPONENTES -->
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;

fs.writeFileSync('index.html', html);
console.log('Successfully generated index.html with new BCV rate logic. Size:', html.length);
