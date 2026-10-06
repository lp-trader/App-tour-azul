import fs from 'fs';
import { TRIPS } from './data.js';
import { rateClientCode } from './rate-client-code.js';
import { opinionsHtmlSection, opinionsModalsHtml, opinionsClientCode } from './opinions-module.js';
import { featuredSectionHtml, featuredClientCode } from './featured-trips-module.js';

const logoBase64 = fs.readFileSync('logo-base64.txt', 'utf8').trim();

const html = `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Tour Azul | Tu escapada perfecta desde Barquisimeto, Cabudare y Yaracuy</title>
  <meta name="description" content="Reserva tus viajes y excursiones con Tour Azul. Salidas desde Barquisimeto, Cabudare y Yaracuy a los mejores destinos de Venezuela con selección interactiva de asientos.">
  <meta property="og:title" content="Tour Azul | Tu escapada perfecta">
  <meta property="og:description" content="Salidas desde Barquisimeto, Cabudare y Yaracuy a los mejores destinos de Venezuela. Reserva con 5 € por persona.">
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
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-tour-caribe selection:text-tour-navy">

  <!-- BARRA SUPERIOR FIJA (GLASSMORPHISM) -->
  <header class="fixed top-0 inset-x-0 z-40 bg-white/85 backdrop-blur-md border-b border-sky-100/80 transition-all duration-300">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo Brand -->
      <a href="#" class="flex items-center gap-2.5 group">
        <img src="${logoBase64}" alt="Tour Azul Logo" class="h-10 w-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform">
        <span class="font-title font-black italic tracking-tight text-xl text-tour-navy">TOUR AZUL</span>
      </a>

      <!-- Acciones de Cabecera -->
      <div class="flex items-center gap-2">
        <!-- Pill BCV Tasa del Día (con Skeleton Inicial) -->
        <div id="bcv-pill-container" class="flex items-center gap-2">
          <div class="animate-pulse flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-400 shadow-sm">
            <span class="text-sm">🇻🇪</span>
            <span class="text-slate-500 font-medium hidden md:inline">Tasa BCV Euro:</span>
            <div class="h-3.5 w-20 md:w-24 bg-slate-300 rounded"></div>
          </div>
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

      <!-- Main Logo Big -->
      <div class="relative z-10 mb-4 animate-float">
        <div class="p-3 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl inline-block">
          <img src="${logoBase64}" alt="Tour Azul Logo" class="h-28 w-28 md:h-36 md:w-36 object-contain drop-shadow-xl">
        </div>
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

    <!-- SECCIÓN VIAJES DEL MES -->
    <section id="viajes" class="max-w-6xl mx-auto px-4 py-12">
      <div class="text-center max-w-xl mx-auto mb-8 space-y-2">
        <span class="inline-block px-3 py-1 rounded-full bg-sky-100 text-tour-blue text-xs font-bold uppercase tracking-wider">
          Calendario de salidas
        </span>
        <h2 class="font-title font-black italic text-3xl md:text-4xl uppercase text-tour-navy">
          VIAJES DEL MES
        </h2>
        <p class="text-slate-600 text-sm">
          Elige tu destino favorito y reserva tu asiento con solo 5 € por persona.
        </p>
      </div>

      <!-- CALENDARIO INTERACTIVO -->
      <div class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-sky-100 mb-8 max-w-3xl mx-auto">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <i data-lucide="calendar" class="w-5 h-5 text-tour-blue"></i>
            <span class="font-title font-black uppercase text-tour-navy text-sm md:text-base" id="calendar-month-title">Octubre 2026</span>
          </div>
          <div class="flex items-center gap-1.5">
            <button id="btn-month-prev" class="p-2 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-700 transition">
              <i data-lucide="chevron-left" class="w-4 h-4"></i>
            </button>
            <button id="btn-month-next" class="p-2 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-700 transition">
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
          <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span class="text-tour-blue">Sáb</span><span class="text-tour-blue">Dom</span>
        </div>

        <div id="calendar-days" class="grid grid-cols-7 gap-1.5 text-sm"></div>

        <!-- BARRA INFERIOR DEL CALENDARIO: BOTÓN SIEMPRE VISIBLE -->
        <div class="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-2 text-slate-600 font-medium">
            <span id="calendar-status-dot" class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span id="calendar-status-text">Mostrando todos los viajes del mes</span>
          </div>
          <button id="btn-always-see-all" onclick="clearDateFilter()" class="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 active:scale-95 text-tour-blue font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
            <span>Ver todos los viajes</span>
          </button>
        </div>
      </div>

      <!-- FILTRO POR DESTINOS -->
      <div class="mb-4">
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1" id="destination-filters"></div>
      </div>

      <!-- ETIQUETA CHIP DE FILTRO POR FECHA (Encima de la lista de viajes) -->
      <div id="selected-date-banner" class="hidden mb-5">
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white/95 border border-sky-200/90 rounded-2xl p-3 md:p-3.5 shadow-xs">
          <div class="flex items-center gap-2">
            <!-- Chip "Mostrando: [día y mes]" con X a la derecha -->
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-tour-navy text-xs md:text-sm font-bold shadow-xs">
              <span class="w-2 h-2 rounded-full bg-tour-blue shrink-0"></span>
              <span>Mostrando: <strong class="text-tour-blue" id="selected-date-chip-label">3 de octubre</strong></span>
              <button onclick="clearDateFilter()" title="Eliminar filtro" class="ml-1 p-0.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer flex items-center justify-center">
                <i data-lucide="x" class="w-4 h-4"></i>
              </button>
            </div>
            <span id="selected-date-count" class="text-xs text-slate-500 font-medium hidden sm:inline"></span>
          </div>

          <button onclick="clearDateFilter()" class="text-xs font-bold text-tour-blue hover:text-blue-800 hover:underline flex items-center gap-1 transition cursor-pointer">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
            <span>Ver todos los viajes</span>
          </button>
        </div>
      </div>

      <!-- GRID DE TARJETAS DE VIAJE -->
      <div id="trips-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"></div>

      <!-- AVISO DESLIZA PARA VER MÁS (Debajo del último viaje en móvil) -->
      <div id="scroll-more-container" class="hidden pt-4 pb-2 text-center md:hidden">
        <div class="inline-flex items-center gap-1.5 py-2 px-4 rounded-full bg-tour-navy/95 backdrop-blur-md text-white text-xs font-bold shadow-lg border border-sky-400/30 animate-bounce">
          <span>Desliza para ver más</span>
          <i data-lucide="chevron-down" class="w-4 h-4 text-tour-yellow"></i>
        </div>
      </div>
    </section>

${opinionsHtmlSection}

    <!-- SECCIÓN CÓMO FUNCIONA -->
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
  </main>

  <!-- INDICADOR FLOTANTE DESLIZA PARA VER MÁS (MÓVIL) -->
  <div id="floating-scroll-cue" class="hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 py-2 px-4 rounded-full bg-tour-navy/95 backdrop-blur-md text-white text-xs font-bold shadow-2xl border border-sky-300/40 animate-bounce transition-all duration-300 pointer-events-none md:hidden">
    <span>Desliza para ver más</span>
    <i data-lucide="chevron-down" class="w-4 h-4 text-tour-yellow"></i>
  </div>

  <!-- BOTÓN FLOTANTE WHATSAPP -->
  <a id="btn-whatsapp-float" href="https://wa.me/584126571155" target="_blank" rel="noopener noreferrer" class="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all group border-2 border-white/80" title="Contactar al WhatsApp de Tour Azul (0412-657-1155)">
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

        <span class="text-slate-300 hidden sm:inline">·</span>

        <a href="https://wa.me/584126571155?text=%C2%A1Hola%20Tour%20Azul!%20Tengo%20una%20duda." target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-sm transition">
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
            Reserva con 5 € p/p
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
        <span>Reservar ya con 5 €</span>
        <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </button>

      <!-- Botón de consulta WhatsApp en Detalles -->
      <a id="modal-det-btn-whatsapp" href="https://wa.me/584126571155" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm">
        <i data-lucide="message-circle" class="w-4 h-4 text-emerald-600"></i>
        <span>¿Dudas sobre este tour? Escríbenos al 0412-657-1155</span>
      </a>
    </div>
  </div>

  <!-- ASISTENTE DE RESERVA -->
  <div id="modal-wizard" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex-col justify-end md:justify-center items-center p-0 md:p-4">
    <div class="bg-white w-full max-w-2xl max-h-[92vh] md:max-h-[90vh] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">

      <div class="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-sky-50/60">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-tour-blue block" id="wizard-trip-name">Reserva de Viaje</span>
          <span class="text-xs text-slate-500" id="wizard-trip-date">Fecha</span>
        </div>
        <button id="btn-close-wizard" class="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-500 shadow-sm transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Stepper Progress Bar -->
      <div class="px-4 py-3 bg-white border-b border-slate-100">
        <div class="flex items-center justify-between relative max-w-md mx-auto">
          <div class="step-indicator flex flex-col items-center gap-1 z-10" data-step="1">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-tour-blue text-white shadow-sm transition-all" id="step-icon-1">1</div>
            <span class="text-[10px] font-medium text-tour-navy hidden sm:inline">Tour</span>
          </div>
          <div class="flex-1 h-0.5 bg-slate-200 mx-1" id="step-line-1"></div>
          <div class="step-indicator flex flex-col items-center gap-1 z-10" data-step="2">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-slate-100 text-slate-500 transition-all" id="step-icon-2">2</div>
            <span class="text-[10px] font-medium text-slate-500 hidden sm:inline">Asientos</span>
          </div>
          <div class="flex-1 h-0.5 bg-slate-200 mx-1" id="step-line-2"></div>
          <div class="step-indicator flex flex-col items-center gap-1 z-10" data-step="3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-slate-100 text-slate-500 transition-all" id="step-icon-3">3</div>
            <span class="text-[10px] font-medium text-slate-500 hidden sm:inline">Grupo</span>
          </div>
          <div class="flex-1 h-0.5 bg-slate-200 mx-1" id="step-line-3"></div>
          <div class="step-indicator flex flex-col items-center gap-1 z-10" data-step="4">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-slate-100 text-slate-500 transition-all" id="step-icon-4">4</div>
            <span class="text-[10px] font-medium text-slate-500 hidden sm:inline">Pago</span>
          </div>
          <div class="flex-1 h-0.5 bg-slate-200 mx-1" id="step-line-4"></div>
          <div class="step-indicator flex flex-col items-center gap-1 z-10" data-step="5">
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-slate-100 text-slate-500 transition-all" id="step-icon-5">5</div>
            <span class="text-[10px] font-medium text-slate-500 hidden sm:inline">Ticket</span>
          </div>
        </div>
      </div>

      <!-- Stepper Content Container -->
      <div class="p-4 md:p-6 overflow-y-auto flex-grow max-h-[62vh]">

        <!-- PASO 1: CONFIRMAR TOUR Y FECHA -->
        <div id="step-content-1" class="step-view space-y-4">
          <div class="text-center space-y-1">
            <h3 class="font-title font-black text-lg text-tour-navy uppercase">Confirma tu viaje y fecha</h3>
            <p class="text-xs text-slate-500">Selecciona la fecha disponible para esta excursión.</p>
          </div>
          <div id="step-1-fechas" class="space-y-2 pt-2"></div>
        </div>

        <!-- PASO 2: BUS Y ASIENTOS -->
        <div id="step-content-2" class="step-view space-y-4 hidden">
          <div class="text-center space-y-1">
            <h3 class="font-title font-black text-lg text-tour-navy uppercase">Elige tus asientos</h3>
            <p class="text-xs text-slate-500">Toca las sillas disponibles para tu grupo (31 puestos por unidad).</p>
          </div>

          <div id="bus-tabs-container" class="flex justify-center gap-2 pt-1 hidden"></div>

          <div id="seat-timer-box" class="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-900 hidden">
            <div class="flex items-center gap-2">
              <i data-lucide="clock" class="w-4 h-4 text-amber-600"></i>
              <span>Asientos apartados temporalmente:</span>
            </div>
            <span id="seat-timer-countdown" class="font-bold font-mono text-amber-700">10:00</span>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-3 text-[11px] py-1">
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-sm"></span>
              <span class="text-slate-600">Disponible</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 rounded-md bg-tour-blue shadow-sm"></span>
              <span class="text-slate-600">Seleccionado</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 rounded-md bg-amber-400 shadow-sm"></span>
              <span class="text-slate-600">En proceso</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 rounded-md bg-slate-300 shadow-sm"></span>
              <span class="text-slate-400">Ocupado</span>
            </div>
          </div>

          <div class="max-w-xs mx-auto bg-slate-50 border-2 border-slate-300 rounded-[36px] p-4 shadow-inner relative">
            <div class="w-full h-8 border-b-2 border-dashed border-slate-300 mb-3 flex items-center justify-between px-3 text-[10px] font-bold text-slate-400 uppercase">
              <div class="flex items-center gap-1">
                <i data-lucide="circle-dot" class="w-4 h-4 text-slate-500"></i>
                <span>Piloto</span>
              </div>
              <div class="text-center text-[9px] bg-slate-200 px-2 py-0.5 rounded text-slate-600">
                Frente
              </div>
              <div class="flex items-center gap-1 text-emerald-600">
                <span>Puerta</span>
                <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
              </div>
            </div>

            <div id="bus-seat-grid" class="space-y-2"></div>

            <div class="mt-4 pt-2 border-t-2 border-slate-200 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Parte trasera / Motor
            </div>
          </div>
        </div>

        <!-- PASO 3: PASAJEROS Y PUNTO DE RECOGIDA -->
        <div id="step-content-3" class="step-view space-y-4 hidden">
          <div class="text-center space-y-1">
            <h3 class="font-title font-black text-lg text-tour-navy uppercase">Datos de los pasajeros</h3>
            <p class="text-xs text-slate-500">Completa los datos del titular y acompañantes.</p>
          </div>

          <div id="passengers-forms" class="space-y-4"></div>

          <div id="toggle-separate-pickup-box" class="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between">
            <div class="text-xs pr-2">
              <span class="font-bold text-tour-navy block">¿Algún acompañante se recoge en otro punto?</span>
              <span class="text-[11px] text-slate-500">Activa si las personas del grupo abordan en paradas distintas.</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="toggle-separate-pickup" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tour-blue"></div>
            </label>
          </div>
        </div>

        <!-- PASO 4: PAGO -->
        <div id="step-content-4" class="step-view space-y-4 hidden">
          <div class="text-center space-y-1">
            <h3 class="font-title font-black text-lg text-tour-navy uppercase">Opciones de pago</h3>
            <p class="text-xs text-slate-500">Paga el total o asegura hoy con el abono mínimo de 5 € por persona.</p>
          </div>

          <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button type="button" id="pay-opt-full" class="py-2.5 px-3 rounded-xl font-bold text-xs transition bg-white text-tour-navy shadow-sm">
              Pago Completo
            </button>
            <button type="button" id="pay-opt-deposit" class="py-2.5 px-3 rounded-xl font-bold text-xs transition text-slate-600 hover:text-tour-navy">
              Abonar Reserva (5 € p/p)
            </button>
          </div>

          <div class="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 space-y-2 text-xs">
            <div class="flex justify-between items-center text-slate-600">
              <span>Monto a pagar hoy:</span>
              <span id="pay-amount-today" class="font-bold text-tour-blue text-sm">-- €</span>
            </div>
            <div class="flex justify-between items-center text-slate-600">
              <span>Saldo pendiente al abordar:</span>
              <span id="pay-amount-balance" class="font-bold text-slate-700">-- €</span>
            </div>
          </div>

          <div class="space-y-2 pt-1">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400 block">Método de pago</label>
            <div class="grid grid-cols-2 gap-3">
              <!-- Pago Móvil -->
              <label class="relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-tour-blue bg-blue-50/50" id="label-method-pagomovil">
                <input type="radio" name="paymentMethod" value="Pago Móvil" checked class="sr-only">
                <span class="font-bold text-xs text-tour-navy flex items-center gap-1.5">
                  <i data-lucide="smartphone" class="w-4 h-4 text-tour-blue"></i>
                  Pago Móvil
                </span>
                <span class="text-[10px] text-slate-500 mt-1">En Bolívares (Tasa BCV)</span>
              </label>

              <!-- Efectivo -->
              <label class="relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-slate-200 hover:border-slate-300" id="label-method-efectivo">
                <input type="radio" name="paymentMethod" value="Efectivo" class="sr-only">
                <span class="font-bold text-xs text-tour-navy flex items-center gap-1.5">
                  <i data-lucide="banknote" class="w-4 h-4 text-emerald-600"></i>
                  Efectivo ($)
                </span>
                <span class="text-[10px] text-slate-500 mt-1">Pago directo al abordar</span>
              </label>
            </div>
          </div>

          <!-- DETALLES SEGÚN MÉTODO -->
          <div id="method-box-pagomovil" class="space-y-3 bg-white border border-sky-100 rounded-2xl p-4 text-xs">
            <div class="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
              <span class="text-[11px] text-slate-500 block">Monto exacto a transferir:</span>
              <span id="pagomovil-monto-bs" class="font-title font-black text-2xl text-tour-blue block my-1">-- Bs</span>
              <button type="button" id="btn-copy-bs" class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-tour-blue border border-sky-200 text-[11px] font-bold hover:bg-sky-50 transition shadow-sm">
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
                <span class="text-slate-500">Cédula / RIF:</span>
                <span class="font-bold text-slate-800" id="pm-rif">V-12345678</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500">Teléfono:</span>
                <span class="font-bold text-slate-800" id="pm-telf">0412-1234567</span>
              </div>
            </div>

            <div>
              <label class="block text-slate-600 font-medium mb-1">Número de referencia (obligatorio):</label>
              <input type="text" id="pagomovil-ref" placeholder="Ej. 123456" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tour-blue text-xs">
            </div>

            <div>
              <label class="block text-slate-600 font-medium mb-1">Comprobante de pago (opcional):</label>
              <input type="file" id="pagomovil-file" accept="image/*" class="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-tour-blue hover:file:bg-sky-100">
            </div>
          </div>

          <div id="method-box-efectivo" class="space-y-3 bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 text-xs hidden">
            <div class="text-center">
              <span class="text-[11px] text-emerald-800 block">Monto a pagar en dólares en efectivo:</span>
              <span id="efectivo-monto-usd" class="font-title font-black text-2xl text-emerald-700 block my-1">-- $</span>
            </div>
            <div class="p-3 bg-white rounded-xl border border-emerald-100 text-slate-600 text-[11px] leading-relaxed">
              <i data-lucide="info" class="w-3.5 h-3.5 text-emerald-600 inline mr-1"></i>
              <span id="efectivo-instrucciones">Entrega el monto en efectivo al abordar la unidad el día del viaje. Tus asientos quedarán asegurados con estado "Pendiente de pago".</span>
            </div>
          </div>
        </div>

        <!-- PASO 5: RESUMEN -->
        <div id="step-content-5" class="step-view space-y-4 hidden">
          <div class="text-center space-y-1">
            <h3 class="font-title font-black text-lg text-tour-navy uppercase">Resumen de tu reserva</h3>
            <p class="text-xs text-slate-500">Revisa los datos antes de confirmar.</p>
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
              <li><strong>Tolerancia:</strong> 15 min en punto de salida (No Show sin reembolso).</li>
              <li><strong>Reembolsos directos:</strong> Mínimo 4 días antes (mismo monto en Bs recibido).</li>
              <li><strong>Saldo a favor:</strong> Mínimo 72 hrs antes (vigencia de 60 días continuos).</li>
              <li><strong>Cesión de cupo:</strong> Mínimo 48 hrs con datos del nuevo pasajero.</li>
            </ul>
            <div class="pt-1 border-t border-amber-200/60 text-[10.5px] text-amber-900 font-bold flex items-center gap-1">
              <span>Al estar reservando con nosotros acepta automáticamente las políticas y condiciones de reserva ✅</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Barra Inferior Fija del Asistente -->
      <div class="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-4">
        <div>
          <span class="text-[11px] text-slate-400 block">Total reserva</span>
          <div class="flex items-baseline gap-1.5">
            <span id="wizard-bottom-total-eur" class="text-xl font-title font-black text-tour-navy">0 €</span>
            <span id="wizard-bottom-total-bs" class="text-xs text-slate-500"></span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button type="button" id="btn-wizard-prev" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition hidden">
            Atrás
          </button>
          <button type="button" id="btn-wizard-next" class="px-6 py-2.5 rounded-xl bg-tour-blue hover:bg-blue-700 text-white font-title font-black uppercase text-xs tracking-wider shadow-lg hover:shadow-xl transition flex items-center gap-1.5">
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
            <span class="text-slate-500">Unidad y Asientos:</span>
            <span id="ticket-asientos" class="font-bold text-tour-blue font-mono">--</span>
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
      <div class="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
        <a href="https://wa.me/584126571155?text=%C2%A1Hola%20Tour%20Azul!%20Tengo%20una%20consulta%20sobre%20las%20pol%C3%ADticas%20de%20reserva." target="_blank" rel="noopener noreferrer" class="text-emerald-700 hover:text-emerald-800 font-bold text-xs flex items-center gap-1.5">
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
    const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzdxxU7xWb9Vjv_R8v5RncFEG8eHau7J7mI5isKOqNksG2OVk2ohDSqf84tZ-1j_WFpLA/exec";
    const WHATSAPP_NUMERO = "584126571155";
    const MINUTOS_BLOQUEO_ASIENTO = 10;
    const ABONO_MINIMO = 5;
    const DATOS_PAGO_MOVIL = { banco: "0102 - Banco de Venezuela", cedulaRif: "V-12345678", telefono: "04121234567" };
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
    function saveStoredOccupiedSeats(destino, fecha, bus = "Bus 1", nuevosAsientos = []) {
      const key = getSeatsStorageKey(destino, fecha, bus);
      const existentes = getStoredOccupiedSeats(destino, fecha, bus);
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
      const urlWebHook = "https://script.google.com/macros/s/AKfycbzdxxU7xWb9Vjv_R8v5RncFEG8eHau7J7mI5isKOqNksG2OVk2ohDSqf84tZ-1j_WFpLA/exec";

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
        // Campos extendidos para sincronización de inventario y resumen
        accion: datosReserva.accion || "reservar",
        idReserva: datosReserva.idReserva || \`TA-\${(datosReserva.fechaViaje || "").replace(/-/g, "")}-\${Math.floor(Math.random() * 900 + 100)}\`,
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
        const respuesta = await fetch(urlWebHook, {
          method: "POST",
          mode: "no-cors", // Necesario para evitar bloqueos de CORS con Google Apps Script
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        console.log("Reserva enviada correctamente a Google Sheets y registrada en Base_General y Destinos.");
        showToastNotification("¡Reserva registrada con éxito en Google Sheets!", "success");
        try {
          if (typeof window !== "undefined" && window.alert) {
            window.alert("¡Reserva registrada con éxito!");
          }
        } catch (_) {}
        return { ok: true, payload };
      } catch (error) {
        console.error("Error al enviar la reserva:", error);
        showToastNotification("Hubo un error al registrar la reserva. Por favor, intenta de nuevo.", "error");
        try {
          if (typeof window !== "undefined" && window.alert) {
            window.alert("Hubo un error al registrar la reserva. Por favor, intenta de nuevo.");
          }
        } catch (_) {}
        throw error;
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
      mesCalendario: 9,
      anioCalendario: 2026,
      filtroDestino: "todos",
      filtroFecha: null,
      selectedTrip: null,
      selectedSalida: null,
      selectedBus: "Bus 1",
      busesDisponibles: ["Bus 1"],
      asientosOcupados: [],
      asientosBloqueados: [],
      asientosSeleccionados: [],
      asientosOcupadosCache: {},
      passengers: [],
      otroPunto: false,
      get titular() {
        return this.passengers[0] || { nombre: "", cedula: "", edad: "", telefono: "", correo: "", recogida: "" };
      },
      set titular(val) {
        if (!this.passengers[0]) {
          this.passengers[0] = { nombre: "", cedula: "", edad: "", telefono: "", correo: "", recogida: "" };
        }
        Object.assign(this.passengers[0], val);
      },
      get acompanantes() {
        return this.passengers.slice(1);
      },
      set acompanantes(val) {
        const lead = this.passengers[0] || { nombre: "", cedula: "", edad: "", telefono: "", correo: "", recogida: "" };
        this.passengers = [lead, ...val];
      },
      timerBloqueo: null,
      segundosRestantesTimer: MINUTOS_BLOQUEO_ASIENTO * 60,
      tipoAbono: "full",
      metodoPago: "Pago Móvil",
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
      renderCalendar();
      renderTrips();
      setupEventListeners();
      initOpinionsSystem();
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

    function renderCalendar() {
      const monthTitle = document.getElementById("calendar-month-title");
      const daysContainer = document.getElementById("calendar-days");
      const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      
      monthTitle.textContent = \`\${monthNames[state.mesCalendario]} \${state.anioCalendario}\`;

      const firstDay = new Date(state.anioCalendario, state.mesCalendario, 1);
      const totalDays = new Date(state.anioCalendario, state.mesCalendario + 1, 0).getDate();
      
      let startOffset = firstDay.getDay() - 1;
      if (startOffset === -1) startOffset = 6;

      let htmlDays = "";
      for (let i = 0; i < startOffset; i++) {
        htmlDays += \`<div class="h-10 rounded-xl"></div>\`;
      }

      const todayIso = (typeof getCaracasTodayStr === 'function') ? getCaracasTodayStr() : new Date().toISOString().split('T')[0];

      for (let day = 1; day <= totalDays; day++) {
        const monthStr = String(state.mesCalendario + 1).padStart(2, "0");
        const dayStr = String(day).padStart(2, "0");
        const dateIso = \`\${state.anioCalendario}-\${monthStr}-\${dayStr}\`;
        const isPastDate = dateIso < todayIso;

        // Datos reales dinámicos de salidas desde VIAJES
        const departures = [];
        VIAJES.forEach(v => {
          v.salidas.forEach(s => {
            if (s.fecha === dateIso) departures.push(v);
          });
        });

        const countTrips = departures.length;
        const hasTrips = countTrips > 0;
        const isSelected = state.filtroFecha === dateIso;

        if (!hasTrips) {
          // Día sin viajes: gris claro y no seleccionable
          htmlDays += \`
            <div class="h-10 rounded-xl flex flex-col items-center justify-center text-slate-300 bg-slate-50/50 cursor-default select-none pointer-events-none border border-transparent">
              <span class="text-xs font-medium">\${day}</span>
            </div>
          \`;
        } else if (isPastDate) {
          // Salidas cuya fecha ya pasó: mostrar atenuadas y no seleccionables para evitar reservas
          htmlDays += \`
            <div class="h-10 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-100/70 border border-slate-200/60 cursor-not-allowed select-none opacity-45" title="\${day} de \${monthNames[state.mesCalendario]} (\${countTrips} salida\${countTrips > 1 ? 's' : ''} ya culminada\${countTrips > 1 ? 's' : ''})">
              <span class="text-xs line-through font-medium">\${day}</span>
              <span class="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Pasado</span>
            </div>
          \`;
        } else {
          // Día con viajes vigentes: seleccionable con 1 punto si 1 viaje o 2 puntos si 2 viajes
          let bgClass = "bg-sky-50 text-tour-blue font-bold border border-sky-200 hover:bg-sky-100 hover:border-sky-300 cursor-pointer";
          if (isSelected) {
            bgClass = "bg-tour-blue text-white font-black shadow-md border-tour-blue";
          }

          const dotColor = isSelected ? "bg-white" : "bg-tour-caribe";
          let dotsHtml = "";
          if (countTrips === 1) {
            dotsHtml = \`<div class="flex items-center justify-center mt-0.5"><span class="w-1.5 h-1.5 rounded-full \${dotColor}"></span></div>\`;
          } else {
            dotsHtml = \`<div class="flex items-center gap-1 justify-center mt-0.5"><span class="w-1.5 h-1.5 rounded-full \${dotColor}"></span><span class="w-1.5 h-1.5 rounded-full \${dotColor}"></span></div>\`;
          }

          htmlDays += \`
            <button type="button" onclick="selectCalendarDate('\${dateIso}', true)" class="h-10 rounded-xl relative flex flex-col items-center justify-center transition active:scale-95 \${bgClass}" title="\${day} de \${monthNames[state.mesCalendario]} (\${countTrips} viaje\${countTrips > 1 ? 's' : ''})">
              <span class="text-xs">\${day}</span>
              \${dotsHtml}
            </button>
          \`;
        }
      }

      daysContainer.innerHTML = htmlDays;

      // Actualizar la barra inferior del calendario que siempre está visible
      const statusDot = document.getElementById("calendar-status-dot");
      const statusText = document.getElementById("calendar-status-text");
      if (statusDot && statusText) {
        if (state.filtroFecha) {
          statusDot.className = "w-2.5 h-2.5 rounded-full bg-tour-blue shrink-0 animate-pulse";
          statusText.innerHTML = \`Filtrando por: <strong class="text-tour-blue">\${getFechaHumanaCorta(state.filtroFecha)}</strong>\`;
        } else {
          statusDot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0";
          statusText.textContent = "Mostrando todos los viajes del mes";
        }
      }

      lucide.createIcons();
    }

    window.selectCalendarDate = function(dateIso, hasTrips) {
      const todayIso = (typeof getCaracasTodayStr === 'function') ? getCaracasTodayStr() : new Date().toISOString().split('T')[0];
      if (dateIso < todayIso) return;

      // 2. Si el usuario toca otra vez el día que ya está seleccionado, se deselecciona y se muestran todos los viajes
      if (state.filtroFecha === dateIso) {
        state.filtroFecha = null;
        renderCalendar();
        renderTrips();
        return;
      }

      state.filtroFecha = dateIso;
      renderCalendar();
      renderTrips();

      // Scroll automático y suave al inicio de la lista de viajes de ese día
      setTimeout(() => {
        const target = document.getElementById("selected-date-banner") || document.getElementById("trips-grid");
        if (target) {
          const yOffset = -24;
          const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        }
      }, 80);
    };

    window.clearDateFilter = function() {
      state.filtroFecha = null;
      renderCalendar();
      renderTrips();
    };

    function formatDateString(iso) {
      const [y, m, d] = iso.split("-");
      return \`\${d}/\${m}/\${y}\`;
    }

    function getFechaHumanaCorta(iso) {
      if (!iso) return "";
      const parts = iso.split("-");
      const d = parseInt(parts[2], 10);
      const m = parseInt(parts[1], 10);
      const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
      const mes = meses[m - 1] || "octubre";
      return \`\${d} de \${mes}\`;
    }

    function getNextTripDate(fromIso) {
      const todayIso = (typeof getCaracasTodayStr === 'function') ? getCaracasTodayStr() : new Date().toISOString().split('T')[0];
      const allDates = [];
      VIAJES.forEach(v => {
        v.salidas.forEach(s => {
          if (s.fecha && s.fecha >= todayIso && !allDates.includes(s.fecha)) {
            allDates.push(s.fecha);
          }
        });
      });
      allDates.sort();
      return allDates.find(d => d > fromIso) || (allDates.length > 0 ? allDates[0] : null);
    }

    let scrollCueDismissed = false;

    function updateScrollCue(count) {
      const floatCue = document.getElementById("floating-scroll-cue");
      const inlineCue = document.getElementById("scroll-more-container");
      if (!floatCue) return;

      // Solo si se eligió un día y hay MÁS de 1 viaje (count > 1)
      if (state.filtroFecha && count > 1) {
        scrollCueDismissed = false;
        floatCue.classList.remove("hidden");
        floatCue.style.opacity = "1";
        if (inlineCue) inlineCue.classList.remove("hidden");
        lucide.createIcons();
      } else {
        floatCue.classList.add("hidden");
        if (inlineCue) inlineCue.classList.add("hidden");
      }
    }

    // Desaparecer flecha y aviso al hacer scroll o llegar al final
    window.addEventListener("scroll", () => {
      const floatCue = document.getElementById("floating-scroll-cue");
      if (!floatCue || floatCue.classList.contains("hidden") || scrollCueDismissed) return;

      const banner = document.getElementById("selected-date-banner");
      if (!banner) return;
      const bannerRect = banner.getBoundingClientRect();

      // Si el usuario scrollea hacia abajo o llega cerca del final
      if (bannerRect.top < -60 || (window.innerHeight + window.scrollY >= document.body.offsetHeight - 180)) {
        scrollCueDismissed = true;
        floatCue.style.opacity = "0";
        setTimeout(() => {
          if (scrollCueDismissed) floatCue.classList.add("hidden");
        }, 300);
      }
    }, { passive: true });

    function renderTrips() {
      const todayIso = (typeof getCaracasTodayStr === 'function') ? getCaracasTodayStr() : new Date().toISOString().split('T')[0];
      const container = document.getElementById("trips-grid");
      let filtered = VIAJES;

      if (state.filtroDestino !== "todos") {
        filtered = filtered.filter(v => v.destino === state.filtroDestino);
      }
      if (state.filtroFecha) {
        filtered = filtered.filter(v => v.salidas.some(s => s.fecha === state.filtroFecha));
      }

      // Ordenar: primero los viajes que tienen salidas vigentes (>= todayIso); al final los que ya culminaron
      filtered = [...filtered].sort((a, b) => {
        const aUpcoming = a.salidas.some(s => s.fecha >= todayIso);
        const bUpcoming = b.salidas.some(s => s.fecha >= todayIso);
        if (aUpcoming && !bUpcoming) return -1;
        if (!aUpcoming && bUpcoming) return 1;
        return 0;
      });

      // 1. Etiqueta tipo chip "Mostrando: [día y mes]" con X a la derecha encima de la lista de viajes
      const dateBanner = document.getElementById("selected-date-banner");
      const chipLabel = document.getElementById("selected-date-chip-label");
      const countLabel = document.getElementById("selected-date-count");
      if (state.filtroFecha && dateBanner) {
        const fechaTexto = getFechaHumanaCorta(state.filtroFecha);
        const count = filtered.length;
        if (chipLabel) chipLabel.textContent = fechaTexto;
        if (countLabel) {
          countLabel.textContent = \`(\${count} viaje\${count === 1 ? '' : 's'} disponible\${count === 1 ? '' : 's'})\`;
        }
        dateBanner.classList.remove("hidden");
      } else if (dateBanner) {
        dateBanner.classList.add("hidden");
      }

      // Actualizar avisos de desliza para ver más
      updateScrollCue(filtered.length);

      // 4. Si se selecciona un día sin viajes (o filtro sin resultados)
      if (filtered.length === 0) {
        if (state.filtroFecha) {
          const fechaHumana = getFechaHumanaCorta(state.filtroFecha);
          const nextIso = getNextTripDate(state.filtroFecha);
          const nextFechaTexto = nextIso ? getFechaHumanaCorta(nextIso) : "";

          container.innerHTML = \`
            <div class="col-span-full py-12 px-4 text-center space-y-4 max-w-lg mx-auto bg-white rounded-3xl border border-sky-100 p-6 shadow-sm">
              <div class="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <i data-lucide="calendar-x" class="w-7 h-7"></i>
              </div>
              <div class="space-y-1">
                <h3 class="font-title font-bold text-lg text-tour-navy">No hay viajes el \${fechaHumana}</h3>
                <p class="text-xs text-slate-500">Puedes consultar la siguiente salida programada o ver la cartelera completa del mes.</p>
              </div>
              <div class="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                \${nextIso ? \`
                  <button type="button" onclick="selectCalendarDate('\${nextIso}', true)" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-tour-blue text-white text-xs font-bold shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-1.5 cursor-pointer">
                    <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                    <span>Ver próximo viaje (\${nextFechaTexto})</span>
                  </button>
                \` : ''}
                <button type="button" onclick="clearDateFilter()" class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
                  <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                  <span>Ver todos los viajes</span>
                </button>
              </div>
            </div>
          \`;
        } else {
          container.innerHTML = \`
            <div class="col-span-full py-16 text-center space-y-3">
              <i data-lucide="compass" class="w-12 h-12 text-slate-300 mx-auto"></i>
              <h3 class="font-title font-bold text-lg text-tour-navy">No encontramos viajes con estos filtros</h3>
              <button onclick="resetFilters()" class="px-5 py-2 rounded-xl bg-tour-blue text-white text-xs font-bold cursor-pointer">
                Ver todos los viajes
              </button>
            </div>
          \`;
        }
        lucide.createIcons();
        return;
      }

      container.innerHTML = filtered.map(trip => {
        let bsPriceHtml = "";
        if (state.tasaDisponible && state.tasaBCV > 0) {
          const bsValue = formatVzla(trip.precio * state.tasaBCV);
          bsPriceHtml = \`<span class="text-tour-yellow text-[10px] md:text-[11px] font-semibold block mt-0.5">≈ Bs. \${bsValue}</span>\`;
        }

        const upcomingSalidas = trip.salidas.filter(s => s.fecha >= todayIso);
        const allSalidasPassed = (upcomingSalidas.length === 0);

        // Salida principal a mostrar (la primera futura o la última si ya pasaron todas)
        const primarySalida = (!allSalidasPassed) ? upcomingSalidas[0] : trip.salidas[trip.salidas.length - 1];
        const primarySalidaIdx = trip.salidas.findIndex(s => s.fecha === primarySalida.fecha);

        // Ocupación calculada
        const cuposOcupados = (typeof getSalidaOccupancy === 'function') ? getSalidaOccupancy(trip, primarySalida) : 18;
        const cuposDisp = Math.max(0, 31 - cuposOcupados);
        let cuposText = \`\${cuposDisp} cupos disponibles\`;
        let cuposClass = "text-emerald-600 bg-emerald-50 border-emerald-200 font-bold";
        if (cuposDisp <= 6) {
          cuposText = \`¡Últimos \${cuposDisp} cupos!\`;
          cuposClass = "text-rose-600 bg-rose-50 border-rose-200 font-bold animate-pulse";
        } else if (cuposOcupados >= 16) {
          cuposText = "🔥 Muy solicitado";
          cuposClass = "text-amber-700 bg-amber-50 border-amber-200 font-bold";
        }

        const fechasChipsHtml = trip.salidas.map((s, idx) => {
          const isPast = s.fecha < todayIso;
          if (isPast) {
            return \`
              <span class="px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-[10px] md:text-[11px] font-bold bg-black/40 text-slate-400 line-through cursor-not-allowed select-none" title="Salida culminada (\${s.fechaTexto})">
                \${s.fechaTexto.split(" ")[0]} \${s.fechaTexto.split(" ")[1]} (Pasada)
              </span>
            \`;
          }
          const isPrimary = s.fecha === primarySalida.fecha;
          return \`
            <button type="button" onclick="setTripSelectedDate('\${trip.id}', \${idx}, event)" class="px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-[10px] md:text-[11px] font-bold transition shadow-sm \${isPrimary ? 'bg-white text-tour-navy shadow' : 'bg-black/40 text-white hover:bg-black/60'} cursor-pointer">
              \${s.fechaTexto.split(" ")[0]} \${s.fechaTexto.split(" ")[1]}
            </button>
          \`;
        }).join("");

        // Tarjeta atenuada si todas las fechas ya pasaron
        const cardClass = allSalidasPassed 
          ? "opacity-60 grayscale-[35%] bg-slate-50 border-slate-200" 
          : "bg-white border-sky-100 hover:shadow-2xl hover:-translate-y-1";

        const tagHtml = allSalidasPassed ? \`
          <span class="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-slate-700 text-white font-bold text-[10px] md:text-xs shadow-sm uppercase tracking-wide">
            Finalizado
          </span>
        \` : \`
          <span class="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-tour-yellow text-tour-navy font-bold text-[10px] md:text-xs shadow-sm uppercase tracking-wide">
            \${trip.tipo}
          </span>
        \`;

        const actionBtnHtml = allSalidasPassed ? \`
          <button disabled class="py-2.5 md:py-3 px-2 md:px-3 rounded-xl md:rounded-2xl bg-slate-200 text-slate-500 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1">
            <i data-lucide="calendar-off" class="w-3.5 h-3.5"></i>
            <span>Fecha culminada</span>
          </button>
        \` : \`
          <button onclick="startBooking('\${trip.id}', \${primarySalidaIdx})" class="py-2.5 md:py-3 px-2 md:px-3 rounded-xl md:rounded-2xl bg-tour-blue hover:bg-blue-700 text-white font-title font-black uppercase text-xs tracking-wider shadow-md hover:shadow-lg active:scale-95 transition flex items-center justify-center gap-1 cursor-pointer">
            <span>Reserva ya</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        \`;

        return \`
          <div class="group rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border flex flex-col transition-all duration-300 \${cardClass}">
            <div class="relative h-44 sm:h-52 md:h-64 w-full overflow-hidden bg-sky-900">
              <img src="\${encodeURI(trip.imagenUrl)}" alt="\${trip.destino}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.style.opacity='0.25';" />
              <div class="absolute inset-0 bg-gradient-to-t from-[#0B2A6B]/90 via-[#0B2A6B]/25 to-transparent pointer-events-none"></div>

              <div class="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-1 items-start">
                \${tagHtml}
                \${trip.etiquetaEspecial && !allSalidasPassed ? \`
                  <span class="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[9px] md:text-[10px] shadow-sm uppercase tracking-wider">
                    \${trip.etiquetaEspecial}
                  </span>
                \` : ''}
              </div>

              <div class="absolute top-3 right-3 md:top-4 md:right-4 bg-tour-blue/95 border border-white/30 backdrop-blur-md rounded-xl md:rounded-2xl px-2.5 py-1.5 md:px-3.5 md:py-2 text-right shadow-lg">
                <span class="text-white font-title font-black text-xl md:text-2xl tracking-tight block leading-none">\${trip.precio} €</span>
                \${bsPriceHtml}
              </div>

              <div class="absolute bottom-3 inset-x-3 md:bottom-4 md:inset-x-4 space-y-1">
                <h3 class="font-title font-black italic text-xl md:text-2xl lg:text-3xl uppercase text-white drop-shadow-md tracking-tight leading-none">
                  \${trip.destino}
                </h3>
                <p class="text-sky-200 text-[11px] md:text-xs font-medium">
                  \${primarySalida.fechaTexto} \${allSalidasPassed ? '(Culminado)' : ''}
                </p>
                \${trip.salidas.length > 1 ? \`
                  <div class="flex items-center gap-1.5 pt-0.5">
                    \${fechasChipsHtml}
                  </div>
                \` : ''}
              </div>
            </div>

            <div class="p-3 md:p-4 flex-grow space-y-2">
              <p class="text-[11px] md:text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">\${trip.descripcion || ''}</p>
              <div class="flex items-center justify-between text-[11px] md:text-xs pt-0.5">
                <span class="text-slate-500">Ocupación del bus</span>
                <span class="px-2 py-0.5 rounded-full border text-[10px] md:text-[11px] \${cuposClass}">
                  \${allSalidasPassed ? '0 cupos (Finalizado)' : cuposText}
                </span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-1.5 md:h-2 overflow-hidden">
                <div class="bg-tour-caribe h-full rounded-full" style="width: \${allSalidasPassed ? 100 : Math.round((cuposOcupados / 31) * 100)}%"></div>
              </div>
            </div>

            <div class="p-3 md:p-4 pt-0 grid grid-cols-2 gap-2">
              <button onclick="openDetallesModal('\${trip.id}')" class="py-2.5 md:py-3 px-2 md:px-3 rounded-xl md:rounded-2xl border-2 border-tour-blue text-tour-blue font-bold text-xs hover:bg-sky-50 active:scale-95 transition flex items-center justify-center gap-1 cursor-pointer">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                <span>Detalles</span>
              </button>
              \${actionBtnHtml}
            </div>
          </div>
        \`;
      }).join("");

      lucide.createIcons();
    }

    window.resetFilters = function() {
      state.filtroDestino = "todos";
      state.filtroFecha = null;
      renderDestinationFilters();
      renderCalendar();
      renderTrips();
    };

    window.setTripSelectedDate = function(tripId, index, event) {
      event.stopPropagation();
      const trip = VIAJES.find(t => t.id === tripId);
      if (!trip || !trip.salidas[index]) return;
      const todayIso = (typeof getCaracasTodayStr === 'function') ? getCaracasTodayStr() : new Date().toISOString().split('T')[0];
      if (trip.salidas[index].fecha < todayIso) {
        alert("Esta salida ya ocurrió. Por favor selecciona una fecha disponible.");
        return;
      }
      startBooking(tripId, index);
    };

    window.openDetallesModal = function(tripId) {
      const trip = VIAJES.find(t => t.id === tripId);
      if (!trip) return;

      const imgEl = document.getElementById("modal-det-img");
      if (imgEl) imgEl.src = encodeURI(trip.imagenUrl);

      document.getElementById("modal-det-tipo").textContent = trip.tipo;
      document.getElementById("modal-det-title").textContent = trip.destino;
      document.getElementById("modal-det-fechas").textContent = trip.salidas.map(s => s.fechaTexto).join(" · ");
      document.getElementById("modal-det-precio-eur").textContent = \`\${trip.precio} €\`;
      
      const descEl = document.getElementById("modal-det-descripcion");
      if (descEl) descEl.textContent = trip.descripcion || "Disfruta de una experiencia inolvidable con el confort y seguridad de Tour Azul.";

      const bsPriceEl = document.getElementById("modal-det-precio-bs");
      if (state.tasaDisponible && state.tasaBCV > 0) {
        bsPriceEl.textContent = \`≈ Bs. \${formatVzla(trip.precio * state.tasaBCV)}\`;
      } else {
        bsPriceEl.textContent = "";
      }

      const incluyeContainer = document.getElementById("modal-det-incluye");
      if (trip.detalles && trip.detalles.length > 0) {
        incluyeContainer.innerHTML = trip.detalles.map(d => \`
          <div class="flex items-start gap-2.5 py-1.5 px-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-sky-50/50 transition">
            <span class="text-xs text-slate-700 font-medium leading-relaxed">\${d}</span>
          </div>
        \`).join("");
      } else {
        incluyeContainer.innerHTML = \`<p class="italic text-slate-400">Pronto más información detallada de este tour.</p>\`;
      }

      const detWaBtn = document.getElementById("modal-det-btn-whatsapp");
      if (detWaBtn) {
        const msg = \`¡Hola Tour Azul! Tengo una consulta sobre el viaje a \${trip.destino} (\${trip.salidas[0].fechaTexto}): \`;
        detWaBtn.href = \`https://wa.me/\${WHATSAPP_NUMERO}?text=\${encodeURIComponent(msg)}\`;
      }

      document.getElementById("modal-det-btn-reservar").onclick = () => {
        closeDetallesModal();
        const todayIso = (typeof getCaracasTodayStr === 'function') ? getCaracasTodayStr() : new Date().toISOString().split('T')[0];
        const upcomingIdx = trip.salidas.findIndex(s => s.fecha >= todayIso);
        startBooking(trip.id, upcomingIdx !== -1 ? upcomingIdx : 0);
      };

      document.getElementById("modal-detalles").classList.remove("hidden");
      document.getElementById("modal-detalles").classList.add("flex");
      lucide.createIcons();
    };

    function closeDetallesModal() {
      document.getElementById("modal-detalles").classList.add("hidden");
      document.getElementById("modal-detalles").classList.remove("flex");
    }

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

      // Si la salida solicitada ya pasó, buscar automáticamente la primera salida futura disponible
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
      state.selectedBus = state.selectedSalida.buses[0] || "Bus 1";
      state.busesDisponibles = state.selectedSalida.buses || ["Bus 1"];
      state.asientosSeleccionados = [];
      state.passengers = [];
      state.otroPunto = false;
      state.tipoAbono = "full";
      state.metodoPago = state.tasaDisponible ? "Pago Móvil" : "Efectivo";

      // Cargar inmediatamente los asientos ocupados guardados en la sesión para este bus
      state.asientosOcupados = getStoredOccupiedSeats(trip.destino, candidateSalida.fecha, state.selectedBus);
      state.asientosBloqueados = [];

      document.getElementById("wizard-trip-name").textContent = trip.destino;
      document.getElementById("wizard-trip-date").textContent = state.selectedSalida.fechaTexto;

      goToStep(2);
      loadBusSeats();

      if (state.seatPollingInterval) clearInterval(state.seatPollingInterval);
      state.seatPollingInterval = setInterval(() => {
        if (currentStep === 2 && document.getElementById("modal-wizard") && !document.getElementById("modal-wizard").classList.contains("hidden")) {
          loadBusSeats();
        }
      }, 20000);

      document.getElementById("modal-wizard").classList.remove("hidden");
      document.getElementById("modal-wizard").classList.add("flex");
    };

    function closeWizard() {
      if (state.timerBloqueo) clearInterval(state.timerBloqueo);
      if (state.seatPollingInterval) clearInterval(state.seatPollingInterval);
      document.getElementById("modal-wizard").classList.add("hidden");
      document.getElementById("modal-wizard").classList.remove("flex");
    }

    function goToStep(step) {
      currentStep = step;

      for (let s = 1; s <= 5; s++) {
        const icon = document.getElementById(\`step-icon-\${s}\`);
        const line = document.getElementById(\`step-line-\${s}\`);
        if (s < step) {
          icon.className = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-emerald-500 text-white shadow-sm transition-all";
          icon.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
          if (line) line.className = "flex-1 h-0.5 bg-emerald-500 mx-1";
        } else if (s === step) {
          icon.className = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-tour-blue text-white shadow-sm ring-4 ring-blue-100 transition-all";
          icon.textContent = s;
          if (line) line.className = "flex-1 h-0.5 bg-slate-200 mx-1";
        } else {
          icon.className = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-slate-100 text-slate-500 transition-all";
          icon.textContent = s;
          if (line) line.className = "flex-1 h-0.5 bg-slate-200 mx-1";
        }
      }

      document.querySelectorAll(".step-view").forEach(el => el.classList.add("hidden"));
      document.getElementById(\`step-content-\${step}\`).classList.remove("hidden");

      const btnPrev = document.getElementById("btn-wizard-prev");
      const btnNextText = document.getElementById("btn-wizard-next-text");
      if (step > 1) {
        btnPrev.classList.remove("hidden");
      } else {
        btnPrev.classList.add("hidden");
      }

      if (step === 5) {
        btnNextText.textContent = "Confirmar Reserva";
      } else {
        btnNextText.textContent = "Continuar";
      }

      if (step === 1) renderStep1();
      if (step === 2) renderBusSeatsUI();
      if (step === 3) renderStep3();
      if (step === 4) renderStep4();
      if (step === 5) renderStep5();

      updateWizardBottomTotal();
      lucide.createIcons();
    }

    function renderStep1() {
      const todayIso = (typeof getCaracasTodayStr === 'function') ? getCaracasTodayStr() : new Date().toISOString().split('T')[0];
      const container = document.getElementById("step-1-fechas");
      container.innerHTML = state.selectedTrip.salidas.map((s, idx) => {
        const isPast = s.fecha < todayIso;
        if (isPast) {
          return \`
            <div class="w-full p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 opacity-45 cursor-not-allowed flex items-center justify-between">
              <div>
                <span class="font-bold text-sm text-slate-500 line-through block">\${s.fechaTexto}</span>
                <span class="text-xs text-rose-500 font-semibold">Salida culminada (No disponible)</span>
              </div>
              <span class="px-2.5 py-1 rounded-md bg-slate-200 text-slate-600 text-[10px] font-bold uppercase">Pasada</span>
            </div>
          \`;
        }
        const isSelected = state.selectedSalida.fecha === s.fecha;
        return \`
          <button type="button" onclick="selectSalidaDate(\${idx})" class="w-full p-4 rounded-2xl border-2 text-left transition flex items-center justify-between \${isSelected ? 'border-tour-blue bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'} cursor-pointer">
            <div>
              <span class="font-bold text-sm text-tour-navy block">\${s.fechaTexto}</span>
              <span class="text-xs text-slate-500">\${s.buses.length} unidad(es) de transporte</span>
            </div>
            \${isSelected ? '<i data-lucide="check-circle" class="w-5 h-5 text-tour-blue"></i>' : ''}
          </button>
        \`;
      }).join("");
      lucide.createIcons();
    }

    window.selectSalidaDate = function(index) {
      const target = state.selectedTrip.salidas[index];
      if (!target) return;
      const todayIso = (typeof getCaracasTodayStr === 'function') ? getCaracasTodayStr() : new Date().toISOString().split('T')[0];
      if (target.fecha < todayIso) {
        alert("Esta salida ya ocurrió y no puede ser seleccionada.");
        return;
      }
      state.selectedSalida = target;
      state.selectedBus = state.selectedSalida.buses[0] || "Bus 1";
      state.busesDisponibles = state.selectedSalida.buses || ["Bus 1"];
      state.asientosSeleccionados = [];
      state.asientosOcupados = getStoredOccupiedSeats(state.selectedTrip.destino, target.fecha, state.selectedBus);
      state.asientosBloqueados = [];
      document.getElementById("wizard-trip-date").textContent = state.selectedSalida.fechaTexto;
      renderStep1();
      renderBusSeatsUI();
      loadBusSeats();
    };

    async function loadBusSeats() {
      if (!state.selectedTrip || !state.selectedSalida) return;

      const destino = state.selectedTrip.destino;
      const fecha = state.selectedSalida.fecha;
      const bus = state.selectedBus || "Bus 1";

      // 1. CARGA INMEDIATA DESDE LA SESIÓN LOCAL (UI instantánea, sin parpadeo)
      const localOcupados = getStoredOccupiedSeats(destino, fecha, bus);
      state.asientosOcupados = [...localOcupados];
      renderBusSeatsUI();

      // 2. CONSULTAR A GOOGLE SHEETS / WEBHOOK SI ESTÁ CONFIGURADO
      if (!WEBHOOK_URL) {
        return;
      }

      try {
        const destinoHoja = (typeof formatDestinoSheetName === "function") 
          ? formatDestinoSheetName(destino, fecha) 
          : destino;

        const params = new URLSearchParams({
          accion: "asientos",
          destino: destino,
          destinoHoja: destinoHoja,
          fecha: fecha,
          bus: bus,
          _t: Date.now().toString()
        });

        const url = \`\${WEBHOOK_URL}?\${params.toString()}\`;
        const res = await fetch(url, { redirect: "follow" });
        if (res.ok) {
          const data = await res.json();
          if (data && data.ok) {
            const serverOcupados = Array.isArray(data.ocupados) ? data.ocupados.map(Number) : [];
            const serverBloqueados = Array.isArray(data.bloqueados) ? data.bloqueados.map(Number) : [];

            // Fusionar asientos de la hoja con los asientos bloqueados en la sesión actual
            const combinedOcupados = [...new Set([...localOcupados, ...serverOcupados])].sort((a, b) => a - b);
            saveStoredOccupiedSeats(destino, fecha, bus, combinedOcupados);

            state.asientosOcupados = combinedOcupados;
            state.asientosBloqueados = serverBloqueados.filter(s => !combinedOcupados.includes(s));
            renderBusSeatsUI();
          }
        }
      } catch (e) {
        console.warn("Aviso al consultar asientos de Google Sheets (usando caché de sesión):", e);
        state.asientosOcupados = getStoredOccupiedSeats(destino, fecha, bus);
        renderBusSeatsUI();
      }
    }

    function renderBusSeatsUI() {
      const tabsContainer = document.getElementById("bus-tabs-container");
      if (state.busesDisponibles.length > 1) {
        tabsContainer.classList.remove("hidden");
        tabsContainer.innerHTML = state.busesDisponibles.map(b => {
          const isSelected = state.selectedBus === b;
          return \`
            <button type="button" onclick="selectBus('\${b}')" class="px-4 py-1.5 rounded-xl font-bold text-xs transition shadow-sm \${isSelected ? 'bg-tour-blue text-white shadow' : 'bg-white text-slate-600 border border-slate-200'}">
              \${b}
            </button>
          \`;
        }).join("");
      } else {
        tabsContainer.classList.add("hidden");
      }

      const container = document.getElementById("bus-seat-grid");
      let html = "";

      for (let f = 0; f < 6; f++) {
        const s1 = f * 4 + 1;
        const s2 = f * 4 + 2;
        const s3 = f * 4 + 3;
        const s4 = f * 4 + 4;

        html += \`
          <div class="flex items-center justify-between gap-1">
            <div class="flex gap-1.5">
              \${renderSingleSeat(s1)}
              \${renderSingleSeat(s2)}
            </div>
            <div class="w-8 text-center text-[10px] text-slate-300 font-mono">·</div>
            <div class="flex gap-1.5">
              \${renderSingleSeat(s3)}
              \${renderSingleSeat(s4)}
            </div>
          </div>
        \`;
      }

      html += \`
        <div class="flex items-center justify-between gap-1">
          <div class="flex gap-1.5">
            \${renderSingleSeat(25)}
            \${renderSingleSeat(26)}
          </div>
          <div class="w-8 text-center text-[10px] text-slate-300 font-mono">·</div>
          <div class="flex gap-1.5 opacity-30 pointer-events-none">
            <div class="w-9 h-9 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">Pta</div>
            <div class="w-9 h-9"></div>
          </div>
        </div>
      \`;

      html += \`
        <div class="flex items-center justify-between gap-1 pt-1">
          \${renderSingleSeat(27)}
          \${renderSingleSeat(28)}
          \${renderSingleSeat(29)}
          \${renderSingleSeat(30)}
          \${renderSingleSeat(31)}
        </div>
      \`;

      container.innerHTML = html;
    }

    window.selectBus = function(busName) {
      state.selectedBus = busName;
      state.asientosSeleccionados = [];
      state.asientosOcupados = getStoredOccupiedSeats(state.selectedTrip.destino, state.selectedSalida.fecha, busName);
      renderBusSeatsUI();
      loadBusSeats();
    };

    function renderSingleSeat(num) {
      const isOcupado = state.asientosOcupados.includes(num);
      const isBloqueado = state.asientosBloqueados.includes(num);
      const isSeleccionado = state.asientosSeleccionados.includes(num);

      let styleClass = "bg-emerald-500 text-white shadow-sm border border-emerald-400 cursor-pointer hover:bg-emerald-600";
      let titleAttr = \`Asiento \${num} disponible\`;
      if (isOcupado) {
        styleClass = "bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300 opacity-80 select-none shadow-none";
        titleAttr = \`Asiento \${num} ocupado (reservado)\`;
      } else if (isBloqueado) {
        styleClass = "bg-amber-400 text-amber-950 cursor-not-allowed border border-amber-300 select-none shadow-none";
        titleAttr = \`Asiento \${num} apartado temporalmente\`;
      } else if (isSeleccionado) {
        styleClass = "bg-tour-blue text-white ring-4 ring-blue-300 ring-offset-1 font-bold shadow-md scale-105";
        titleAttr = \`Asiento \${num} seleccionado por ti\`;
      }

      return \`
        <button type="button" onclick="toggleSeat(\${num})" title="\${titleAttr}" class="w-9 h-10 rounded-xl relative flex flex-col items-center justify-center text-xs font-bold seat-bounce transition \${styleClass}" \${isOcupado || isBloqueado ? 'disabled' : ''}>
          <span class="w-5 h-1.5 rounded-full bg-white/30 mb-0.5 pointer-events-none"></span>
          <span>\${num}</span>
        </button>
      \`;
    }

    function syncPassengersWithSeats() {
      const numNeeded = state.asientosSeleccionados.length;
      if (numNeeded === 0) return;

      // Asegurar que exista al menos el pasajero titular
      if (state.passengers.length === 0) {
        state.passengers.push({
          seat: state.asientosSeleccionados[0],
          nombre: "",
          cedula: "",
          edad: "",
          telefono: "",
          correo: "",
          recogida: ""
        });
      }

      // Si se agregaron asientos, añadir acompañantes vacíos conservando los ya escritos
      while (state.passengers.length < numNeeded) {
        const nextSeat = state.asientosSeleccionados[state.passengers.length];
        const defaultPickup = (state.passengers[0] && state.passengers[0].recogida) ? state.passengers[0].recogida : "";
        state.passengers.push({
          seat: nextSeat,
          nombre: "",
          edad: "",
          cedula: "",
          recogida: defaultPickup
        });
      }

      // Si se redujeron asientos, quitar solo los que dejaron de existir
      if (state.passengers.length > numNeeded) {
        state.passengers = state.passengers.slice(0, numNeeded);
      }

      // Sincronizar número de asiento según el orden actual
      state.asientosSeleccionados.forEach((seatNum, i) => {
        if (state.passengers[i]) {
          state.passengers[i].seat = seatNum;
        }
      });
    }

    window.toggleSeat = function(num) {
      const currentOcupados = getStoredOccupiedSeats(state.selectedTrip.destino, state.selectedSalida.fecha, state.selectedBus);
      if (state.asientosOcupados.includes(num) || currentOcupados.includes(num) || state.asientosBloqueados.includes(num)) {
        if (!state.asientosOcupados.includes(num) && currentOcupados.includes(num)) {
          state.asientosOcupados = [...currentOcupados];
          renderBusSeatsUI();
        }
        return;
      }
      if (navigator.vibrate) navigator.vibrate(20);

      const idx = state.asientosSeleccionados.indexOf(num);
      if (idx > -1) {
        state.asientosSeleccionados.splice(idx, 1);
      } else {
        state.asientosSeleccionados.push(num);
      }

      state.asientosSeleccionados.sort((a, b) => a - b);
      syncPassengersWithSeats();
      renderBusSeatsUI();
      updateWizardBottomTotal();

      if (state.asientosSeleccionados.length > 0 && !state.timerBloqueo) {
        startSeatCountdown();
      }
    };

    function startSeatCountdown() {
      const box = document.getElementById("seat-timer-box");
      const display = document.getElementById("seat-timer-countdown");
      box.classList.remove("hidden");
      state.segundosRestantesTimer = MINUTOS_BLOQUEO_ASIENTO * 60;

      if (state.timerBloqueo) clearInterval(state.timerBloqueo);
      state.timerBloqueo = setInterval(() => {
        state.segundosRestantesTimer--;
        const m = Math.floor(state.segundosRestantesTimer / 60);
        const s = state.segundosRestantesTimer % 60;
        display.textContent = \`\${String(m).padStart(2, '0')}:\${String(s).padStart(2, '0')}\`;

        if (state.segundosRestantesTimer <= 0) {
          clearInterval(state.timerBloqueo);
          state.timerBloqueo = null;
          alert("El tiempo para reservar tus asientos ha expirado. Vuelve a seleccionarlos.");
          state.asientosSeleccionados = [];
          box.classList.add("hidden");
          goToStep(2);
        }
      }, 1000);
    }

    function escapeAttr(str) {
      if (str === null || str === undefined) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function handleToggleSeparatePickup(isSeparate) {
      state.otroPunto = Boolean(isSeparate);
      const leadPickup = (state.passengers[0] && state.passengers[0].recogida) ? state.passengers[0].recogida : (document.getElementById("lead-pickup")?.value || "");

      const numComps = Math.max(0, state.asientosSeleccionados.length - 1);
      for (let i = 0; i < numComps; i++) {
        const wrap = document.getElementById(\`comp-pickup-wrap-\${i}\`);
        const input = document.getElementById(\`comp-pickup-\${i}\`);
        if (wrap) {
          if (state.otroPunto) {
            wrap.classList.remove("hidden");
            // Al activar: aparece el campo prellenado con el punto del titular si está vacío y editable
            if (input && (!input.value || !input.value.trim())) {
              input.value = leadPickup;
              if (state.passengers[i + 1]) {
                state.passengers[i + 1].recogida = leadPickup;
              }
            }
          } else {
            // Al desactivar: se ocultan los campos y todos usan el punto del titular, pero se conserva lo que se escribió
            wrap.classList.add("hidden");
          }
        }
      }
    }

    function bindPassengerRealtimeEvents() {
      // Titular (index 0)
      const leadName = document.getElementById("lead-name");
      if (leadName) leadName.oninput = (e) => { state.passengers[0].nombre = e.target.value; };
      const leadCedula = document.getElementById("lead-cedula");
      if (leadCedula) leadCedula.oninput = (e) => { state.passengers[0].cedula = e.target.value; };
      const leadAge = document.getElementById("lead-age");
      if (leadAge) leadAge.oninput = (e) => { state.passengers[0].edad = e.target.value; };
      const leadPhone = document.getElementById("lead-phone");
      if (leadPhone) leadPhone.oninput = (e) => { state.passengers[0].telefono = e.target.value; };
      const leadEmail = document.getElementById("lead-email");
      if (leadEmail) leadEmail.oninput = (e) => { state.passengers[0].correo = e.target.value; };
      const leadPickup = document.getElementById("lead-pickup");
      if (leadPickup) {
        leadPickup.oninput = (e) => {
          state.passengers[0].recogida = e.target.value;
          // Si el interruptor de otro punto no está activo, sincronizar los acompañantes
          if (!state.otroPunto) {
            for (let i = 1; i < state.passengers.length; i++) {
              state.passengers[i].recogida = e.target.value;
              const cInput = document.getElementById(\`comp-pickup-\${i - 1}\`);
              if (cInput && (!cInput.value || !cInput.value.trim())) {
                cInput.value = e.target.value;
              }
            }
          }
        };
      }

      // Acompañantes (index 1..N)
      const numComps = Math.max(0, state.asientosSeleccionados.length - 1);
      for (let i = 0; i < numComps; i++) {
        const compIdx = i;
        const pIdx = i + 1;
        const cName = document.getElementById(\`comp-name-\${compIdx}\`);
        if (cName) cName.oninput = (e) => {
          if (state.passengers[pIdx]) state.passengers[pIdx].nombre = e.target.value;
        };
        const cAge = document.getElementById(\`comp-age-\${compIdx}\`);
        if (cAge) cAge.oninput = (e) => {
          if (state.passengers[pIdx]) state.passengers[pIdx].edad = e.target.value;
        };
        const cCed = document.getElementById(\`comp-cedula-\${compIdx}\`);
        if (cCed) cCed.oninput = (e) => {
          if (state.passengers[pIdx]) state.passengers[pIdx].cedula = e.target.value;
        };
        const cPick = document.getElementById(\`comp-pickup-\${compIdx}\`);
        if (cPick) cPick.oninput = (e) => {
          if (state.passengers[pIdx]) state.passengers[pIdx].recogida = e.target.value;
        };
      }
    }

    window.selectLeadPickup = function(text) {
      const el = document.getElementById("lead-pickup");
      if (el) {
        el.value = text;
        state.passengers[0].recogida = text;
        if (!state.otroPunto) {
          for (let i = 1; i < state.passengers.length; i++) {
            state.passengers[i].recogida = text;
            const cInput = document.getElementById(\`comp-pickup-\${i - 1}\`);
            if (cInput && (!cInput.value || !cInput.value.trim())) {
              cInput.value = text;
            }
          }
        }
      }
    };

    function renderStep3() {
      syncPassengersWithSeats();

      const container = document.getElementById("passengers-forms");
      const togglePickupBox = document.getElementById("toggle-separate-pickup-box");
      const togglePickup = document.getElementById("toggle-separate-pickup");

      const numTotal = state.asientosSeleccionados.length;
      const numComps = Math.max(0, numTotal - 1);

      // Mostrar el interruptor solo si hay 2 o más pasajeros (titular + al menos 1 acompañante)
      if (togglePickupBox) {
        if (numComps > 0) {
          togglePickupBox.classList.remove("hidden");
        } else {
          togglePickupBox.classList.add("hidden");
        }
      }
      if (togglePickup) {
        togglePickup.checked = Boolean(state.otroPunto);
      }

      // Si el contenedor ya tiene exactamente el número correcto de tarjetas, actualizamos asientos sin borrar el DOM
      const existingCards = container.querySelectorAll(".passenger-card");
      if (existingCards.length === numTotal && numTotal > 0) {
        const leadBadge = document.getElementById("lead-seat-badge");
        if (leadBadge) leadBadge.textContent = \`Asiento #\${state.asientosSeleccionados[0]}\`;
        for (let i = 0; i < numComps; i++) {
          const compBadge = document.getElementById(\`comp-seat-badge-\${i}\`);
          if (compBadge) compBadge.textContent = \`Asiento #\${state.asientosSeleccionados[i + 1]}\`;
        }
        handleToggleSeparatePickup(state.otroPunto);
        return;
      }

      // Construcción del formulario manteniendo los datos que viven en state.passengers
      const leadSeat = state.asientosSeleccionados[0] || "--";
      const leadData = state.passengers[0] || { nombre: "", cedula: "", edad: "", telefono: "", correo: "", recogida: "" };

      let html = \`
        <div class="passenger-card p-4 bg-sky-50/60 rounded-2xl border border-sky-200/80 space-y-3">
          <div class="flex items-center justify-between border-b border-sky-100 pb-2">
            <span class="font-title font-bold text-xs uppercase text-tour-navy flex items-center gap-1.5">
              <i data-lucide="user-check" class="w-4 h-4 text-tour-blue"></i>
              <span>Pasajero Titular (<span id="lead-seat-badge">Asiento #\${leadSeat}</span>)</span>
            </span>
            <span class="text-[10px] bg-tour-blue text-white px-2 py-0.5 rounded-full font-bold">Principal</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="block text-slate-600 font-medium mb-1">Nombre y Apellido *</label>
              <input type="text" id="lead-name" value="\${escapeAttr(leadData.nombre)}" required placeholder="Ej. Carlos Pérez" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
            </div>
            <div>
              <label class="block text-slate-600 font-medium mb-1">Cédula o Pasaporte *</label>
              <input type="text" id="lead-cedula" value="\${escapeAttr(leadData.cedula)}" required placeholder="Ej. V-19876543" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
            </div>
            <div>
              <label class="block text-slate-600 font-medium mb-1">Edad *</label>
              <input type="number" id="lead-age" value="\${escapeAttr(leadData.edad)}" required placeholder="Ej. 28" min="1" max="100" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
            </div>
            <div>
              <label class="block text-slate-600 font-medium mb-1">Teléfono WhatsApp *</label>
              <input type="tel" id="lead-phone" value="\${escapeAttr(leadData.telefono)}" required placeholder="Ej. 04121234567" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
            </div>
            <div class="md:col-span-2">
              <label class="block text-slate-600 font-medium mb-1">Correo Electrónico (opcional)</label>
              <input type="email" id="lead-email" value="\${escapeAttr(leadData.correo)}" placeholder="ejemplo@correo.com" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
            </div>
            <div class="md:col-span-2">
              <label class="block text-slate-600 font-medium mb-1">Punto de Recogida * (mínimo 10 caracteres)</label>
              <textarea id="lead-pickup" rows="2" required placeholder="Ej. Barquisimeto (Monumental), Cabudare (Redoma) o Yaracuy (Chivacoa / San Felipe)" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none text-xs">\${escapeAttr(leadData.recogida)}</textarea>
              <span class="text-[10px] text-slate-400">Salidas desde Barquisimeto, Cabudare y Yaracuy. Puedes seleccionar un punto o escribirlo:</span>
              <div class="flex flex-wrap gap-1.5 pt-1.5">
                <button type="button" onclick="selectLeadPickup('Barquisimeto: C.C. Metrópolis / Monumental')" class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sky-50 text-tour-blue border border-sky-200 hover:bg-sky-100 transition cursor-pointer">📍 Barquisimeto</button>
                <button type="button" onclick="selectLeadPickup('Cabudare: Redoma de Agua Viva')" class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sky-50 text-tour-blue border border-sky-200 hover:bg-sky-100 transition cursor-pointer">📍 Cabudare</button>
                <button type="button" onclick="selectLeadPickup('Yaracuy: Pasarela / Peaje de Chivacoa')" class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sky-50 text-tour-blue border border-sky-200 hover:bg-sky-100 transition cursor-pointer">📍 Yaracuy (Chivacoa)</button>
                <button type="button" onclick="selectLeadPickup('Yaracuy: San Felipe (Redoma / Autopista)')" class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sky-50 text-tour-blue border border-sky-200 hover:bg-sky-100 transition cursor-pointer">📍 Yaracuy (San Felipe)</button>
              </div>
            </div>
          </div>
        </div>
      \`;

      for (let i = 0; i < numComps; i++) {
        const compSeat = state.asientosSeleccionados[i + 1] || "--";
        const compData = state.passengers[i + 1] || { nombre: "", edad: "", cedula: "", recogida: "" };
        const compPickupVal = compData.recogida || "";

        html += \`
          <div class="passenger-card p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <span class="font-title font-bold text-xs uppercase text-slate-700 flex items-center gap-1.5">
                <i data-lucide="user" class="w-4 h-4 text-tour-caribe"></i>
                <span>Acompañante \${i + 1} (<span id="comp-seat-badge-\${i}">Asiento #\${compSeat}</span>)</span>
              </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label class="block text-slate-600 font-medium mb-1">Nombre y Apellido *</label>
                <input type="text" id="comp-name-\${i}" value="\${escapeAttr(compData.nombre)}" required placeholder="Nombre completo" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
              </div>
              <div>
                <label class="block text-slate-600 font-medium mb-1">Edad *</label>
                <input type="number" id="comp-age-\${i}" value="\${escapeAttr(compData.edad)}" required placeholder="Edad" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
              </div>
              <div>
                <label class="block text-slate-600 font-medium mb-1">Cédula (opcional para niños)</label>
                <input type="text" id="comp-cedula-\${i}" value="\${escapeAttr(compData.cedula)}" placeholder="Cédula" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
              </div>
              
              <div id="comp-pickup-wrap-\${i}" class="comp-pickup-wrapper md:col-span-3 \${state.otroPunto ? '' : 'hidden'}">
                <label class="block text-slate-600 font-medium mb-1">Punto de Recogida específico * (mínimo 10 caracteres)</label>
                <input type="text" id="comp-pickup-\${i}" value="\${escapeAttr(compPickupVal)}" placeholder="Dirección exacta de recogida" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none text-xs">
              </div>
            </div>
          </div>
        \`;
      }

      container.innerHTML = html;
      bindPassengerRealtimeEvents();
      lucide.createIcons();
    }

    function renderStep4() {
      const numPers = state.asientosSeleccionados.length;
      const totalEur = state.selectedTrip.precio * numPers;
      const totalAbono = ABONO_MINIMO * numPers;

      let amountEurToPay = totalEur;
      let balanceEur = 0;
      if (state.tipoAbono === "abono") {
        amountEurToPay = totalAbono;
        balanceEur = totalEur - totalAbono;
      }

      if (state.tasaDisponible && state.tasaBCV > 0) {
        const amountBs = formatVzla(amountEurToPay * state.tasaBCV);
        const balanceBs = formatVzla(balanceEur * state.tasaBCV);

        document.getElementById("pay-amount-today").textContent = \`\${amountEurToPay} € (Bs. \${amountBs})\`;
        document.getElementById("pay-amount-balance").textContent = \`\${balanceEur} € (Bs. \${balanceBs})\`;
        document.getElementById("pagomovil-monto-bs").textContent = \`Bs. \${amountBs}\`;
      } else {
        document.getElementById("pay-amount-today").textContent = \`\${amountEurToPay} €\`;
        document.getElementById("pay-amount-balance").textContent = \`\${balanceEur} €\`;
        document.getElementById("pagomovil-monto-bs").textContent = "Tasa no disponible";
      }

      document.getElementById("efectivo-monto-usd").textContent = \`\${amountEurToPay} $\`;
      document.getElementById("pm-banco").textContent = DATOS_PAGO_MOVIL.banco;
      document.getElementById("pm-rif").textContent = DATOS_PAGO_MOVIL.cedulaRif;
      document.getElementById("pm-telf").textContent = DATOS_PAGO_MOVIL.telefono;
      document.getElementById("efectivo-instrucciones").textContent = INSTRUCCIONES_EFECTIVO;
    }

    function renderStep5() {
      const numPers = state.asientosSeleccionados.length;
      const totalEur = state.selectedTrip.precio * numPers;
      const totalAbono = ABONO_MINIMO * numPers;

      let paidEur = totalEur;
      let balanceEur = 0;
      if (state.tipoAbono === "abono") {
        paidEur = totalAbono;
        balanceEur = totalEur - totalAbono;
      }

      let totalBsStr = "";
      let paidBsStr = "";
      let balanceBsStr = "";
      if (state.tasaDisponible && state.tasaBCV > 0) {
        totalBsStr = \` (Bs. \${formatVzla(totalEur * state.tasaBCV)})\`;
        paidBsStr = \` (Bs. \${formatVzla(paidEur * state.tasaBCV)})\`;
        balanceBsStr = \` (Bs. \${formatVzla(balanceEur * state.tasaBCV)})\`;
      }

      const separatePickup = state.otroPunto;
      let pickupsHtml = "";
      if (!separatePickup) {
        pickupsHtml = \`<div class="text-[11px] text-slate-500"><strong>Punto de recogida:</strong> \${state.titular.recogida}</div>\`;
      } else {
        pickupsHtml = \`
          <div class="text-[11px] text-slate-500 space-y-0.5">
            <div><strong>\${state.titular.nombre} (Asiento \${state.asientosSeleccionados[0]}):</strong> \${state.titular.recogida}</div>
            \${state.acompanantes.map((c, i) => \`<div><strong>\${c.nombre} (Asiento \${state.asientosSeleccionados[i + 1]}):</strong> \${c.recogida || state.titular.recogida}</div>\`).join("")}
          </div>
        \`;
      }

      document.getElementById("summary-card").innerHTML = \`
        <div class="border-b border-sky-100 pb-2 flex justify-between items-center">
          <div>
            <span class="font-title font-bold text-sm text-tour-navy block">\${state.selectedTrip.destino}</span>
            <span class="text-xs text-tour-blue">\${state.selectedSalida.fechaTexto} · \${state.selectedBus}</span>
          </div>
          <span class="font-mono font-bold text-xs bg-sky-100 text-tour-blue px-2.5 py-1 rounded-full">
            Asientos: \${state.asientosSeleccionados.join(", ")}
          </span>
        </div>

        <div class="space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-500">Pasajeros:</span>
            <span class="font-bold text-slate-800">\${numPers} persona(s)</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Método de Pago:</span>
            <span class="font-bold text-tour-navy">\${state.metodoPago}</span>
          </div>
          \${pickupsHtml}
        </div>

        <div class="border-t border-sky-100 pt-2 space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-500">Total de la reserva:</span>
            <span class="font-bold text-tour-navy">\${totalEur} €\${totalBsStr}</span>
          </div>
          <div class="flex justify-between text-tour-blue font-bold">
            <span>Monto pagado / abonado:</span>
            <span>\${paidEur} €\${paidBsStr}</span>
          </div>
          \${balanceEur > 0 ? \`
            <div class="flex justify-between text-amber-800 font-bold">
              <span>Saldo pendiente al abordar:</span>
              <span>\${balanceEur} €\${balanceBsStr}</span>
            </div>
          \` : ''}
          \${state.tasaDisponible ? \`
            <div class="text-[10px] text-slate-400 pt-1 text-right">
              Tasa BCV congelada: 1 € = Bs. \${formatVzla(state.tasaBCV)}
            </div>
          \` : ''}
        </div>
      \`;
    }

    function updateWizardBottomTotal() {
      const numPers = state.asientosSeleccionados.length;
      if (!state.selectedTrip || numPers === 0) {
        document.getElementById("wizard-bottom-total-eur").textContent = "0 €";
        document.getElementById("wizard-bottom-total-bs").textContent = "";
        return;
      }

      const totalEur = state.selectedTrip.precio * numPers;
      document.getElementById("wizard-bottom-total-eur").textContent = \`\${totalEur} €\`;

      if (state.tasaDisponible && state.tasaBCV > 0) {
        const totalBs = formatVzla(totalEur * state.tasaBCV);
        document.getElementById("wizard-bottom-total-bs").textContent = \`≈ Bs. \${totalBs}\`;
      } else {
        document.getElementById("wizard-bottom-total-bs").textContent = "";
      }
    }

    function validateStep(step) {
      if (step === 2) {
        if (state.asientosSeleccionados.length === 0) {
          alert("Debes seleccionar al menos un asiento en el autobús.");
          return false;
        }
        return true;
      }
      if (step === 3) {
        const leadNameEl = document.getElementById("lead-name");
        const leadCedulaEl = document.getElementById("lead-cedula");
        const leadAgeEl = document.getElementById("lead-age");
        const leadPhoneEl = document.getElementById("lead-phone");
        const leadEmailEl = document.getElementById("lead-email");
        const leadPickupEl = document.getElementById("lead-pickup");

        if (leadNameEl) state.passengers[0].nombre = leadNameEl.value.trim();
        if (leadCedulaEl) state.passengers[0].cedula = leadCedulaEl.value.trim();
        if (leadAgeEl) state.passengers[0].edad = leadAgeEl.value.trim();
        if (leadPhoneEl) state.passengers[0].telefono = leadPhoneEl.value.trim();
        if (leadEmailEl) state.passengers[0].correo = leadEmailEl.value.trim();
        if (leadPickupEl) state.passengers[0].recogida = leadPickupEl.value.trim();

        const lead = state.passengers[0];
        if (!lead.nombre || !lead.cedula || !lead.edad || !lead.telefono) {
          alert("Por favor completa los datos obligatorios del titular.");
          return false;
        }
        if (!lead.recogida || lead.recogida.length < 10) {
          alert("El punto de recogida del titular debe tener al menos 10 caracteres con la dirección clara.");
          return false;
        }

        const numAcomp = Math.max(0, state.asientosSeleccionados.length - 1);
        for (let i = 0; i < numAcomp; i++) {
          const compNameEl = document.getElementById(\`comp-name-\${i}\`);
          const compAgeEl = document.getElementById(\`comp-age-\${i}\`);
          const compCedEl = document.getElementById(\`comp-cedula-\${i}\`);
          const compPickEl = document.getElementById(\`comp-pickup-\${i}\`);

          if (!state.passengers[i + 1]) {
            state.passengers[i + 1] = {
              seat: state.asientosSeleccionados[i + 1],
              nombre: "",
              edad: "",
              cedula: "",
              recogida: lead.recogida
            };
          }

          if (compNameEl) state.passengers[i + 1].nombre = compNameEl.value.trim();
          if (compAgeEl) state.passengers[i + 1].edad = compAgeEl.value.trim();
          if (compCedEl) state.passengers[i + 1].cedula = compCedEl.value.trim();
          if (compPickEl && state.otroPunto) {
            state.passengers[i + 1].recogida = compPickEl.value.trim();
          }

          const comp = state.passengers[i + 1];
          if (!comp.nombre || !comp.edad) {
            alert(\`Por favor completa el nombre y la edad del acompañante \${i + 1}.\`);
            return false;
          }

          if (state.otroPunto) {
            if (!comp.recogida || comp.recogida.length < 10) {
              alert(\`El punto de recogida del acompañante \${i + 1} debe tener al menos 10 caracteres.\`);
              return false;
            }
          }
        }
        return true;
      }
      if (step === 4) {
        if (state.metodoPago === "Pago Móvil") {
          if (!state.tasaDisponible) {
            alert("El pago móvil no está disponible en este momento debido a que no hay tasa BCV disponible.");
            return false;
          }
          const ref = document.getElementById("pagomovil-ref").value.trim();
          if (!ref) {
            alert("Por favor ingresa el número de referencia del Pago Móvil.");
            return false;
          }
        }
        return true;
      }
      return true;
    }

    async function submitBooking() {
      const overlay = document.getElementById("loading-overlay");
      overlay.classList.remove("hidden");
      overlay.classList.add("flex");

      const numPers = state.asientosSeleccionados.length;
      const totalEur = state.selectedTrip.precio * numPers;
      const totalAbono = ABONO_MINIMO * numPers;
      let paidEur = totalEur;
      let balanceEur = 0;
      if (state.tipoAbono === "abono") {
        paidEur = totalAbono;
        balanceEur = totalEur - totalAbono;
      }

      // Congelar la tasa usada y montos
      const frozenRate = state.tasaBCV || 0;
      const totalBs = frozenRate > 0 ? parseFloat((totalEur * frozenRate).toFixed(2)) : 0;
      const paidBs = (state.metodoPago === "Pago Móvil" && frozenRate > 0) ? parseFloat((paidEur * frozenRate).toFixed(2)) : 0;
      const paidUsd = state.metodoPago === "Efectivo" ? paidEur : 0;
      const estadoPago = state.metodoPago === "Pago Móvil" ? "Pagado" : "Pendiente de pago";

      const now = new Date();
      const idReserva = \`TA-\${state.selectedSalida.fecha.replace(/-/g, "")}-\${String(Math.floor(Math.random() * 900) + 100)}\`;

      const payload = {
        accion: "reservar",
        idReserva: idReserva,
        fechaRegistro: now.toISOString(),
        destino: state.selectedTrip.destino,
        fechaViaje: state.selectedSalida.fecha,
        bus: state.selectedBus,
        asientos: state.asientosSeleccionados,
        totalPersonas: numPers,
        tipoPago: state.metodoPago,
        montoAbonadoEur: paidEur,
        saldoPendienteEur: balanceEur,
        montoPagadoBs: paidBs,
        montoPagadoUsd: paidUsd,
        tasaBCV: frozenRate,
        referenciaPagoMovil: state.metodoPago === "Pago Móvil" ? document.getElementById("pagomovil-ref").value.trim() : "",
        estadoPago: estadoPago,
        titular: { ...state.passengers[0] },
        acompanantes: state.passengers.slice(1).map(c => ({
          ...c,
          recogida: (state.otroPunto && c.recogida) ? c.recogida : state.passengers[0].recogida
        })),
        passengers: state.passengers.map((p, idx) => ({
          ...p,
          recogida: (idx === 0 || (state.otroPunto && p.recogida)) ? p.recogida : state.passengers[0].recogida
        }))
      };

      state.reservaFinal = payload;

      // ============================================================
      // 🔒 BLOQUEO INMEDIATO Y PERSISTENTE EN LA INTERFAZ Y SESIÓN
      // ============================================================
      const asientosConfirmados = [...state.asientosSeleccionados];
      const destActual = state.selectedTrip.destino;
      const fechaActual = state.selectedSalida.fecha;
      const busActual = state.selectedBus;

      // Guardar de inmediato en sessionStorage y localStorage
      const asientosActualizados = saveStoredOccupiedSeats(destActual, fechaActual, busActual, asientosConfirmados);
      saveConfirmedBookingToSession(payload);

      // Actualizar el estado en memoria para reflejar inmediatamente el bloqueo
      state.asientosOcupados = [...asientosActualizados];
      state.asientosBloqueados = state.asientosBloqueados.filter(s => !asientosConfirmados.includes(s));
      state.asientosSeleccionados = [];

      // Cancelar el temporizador de bloqueo temporal si existía
      if (state.timerBloqueo) {
        clearInterval(state.timerBloqueo);
        state.timerBloqueo = null;
      }
      const boxTimer = document.getElementById("seat-timer-box");
      if (boxTimer) boxTimer.classList.add("hidden");

      // Actualizar la interfaz de asientos y las tarjetas de viaje
      renderBusSeatsUI();
      if (typeof renderTrips === "function") renderTrips();

      // Enviar la reserva a Google Sheets mediante enviarReservaAGoogleSheets
      const datosParaSheets = {
        nombre: state.passengers[0].nombre,
        cedula: state.passengers[0].cedula,
        telefono: state.passengers[0].telefono,
        destino: state.selectedTrip.destino,
        fechaViaje: state.selectedSalida.fecha,
        abono: paidEur,
        pendiente: balanceEur,
        acompanantes: state.passengers.slice(1).map(c => c.nombre),
        idReserva: idReserva,
        bus: state.selectedBus,
        asientos: asientosConfirmados,
        totalPersonas: numPers,
        tipoPago: state.metodoPago,
        montoPagadoBs: paidBs,
        montoPagadoUsd: paidUsd,
        tasaBCV: frozenRate,
        referenciaPagoMovil: state.metodoPago === "Pago Móvil" ? (document.getElementById("pagomovil-ref") ? document.getElementById("pagomovil-ref").value.trim() : "") : "",
        estadoPago: estadoPago,
        titular: { ...state.passengers[0] },
        passengers: state.passengers
      };

      try {
        await enviarReservaAGoogleSheets(datosParaSheets);
      } catch (e) {
        console.warn("Aviso al registrar en Google Sheets:", e);
      }

      overlay.classList.add("hidden");
      closeWizard();
      showSuccessModal(payload);
    }

    function showSuccessModal(data) {
      const modal = document.getElementById("modal-success");
      modal.classList.remove("hidden");
      modal.classList.add("flex");

      if (window.confetti) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }

      document.getElementById("ticket-id").textContent = data.idReserva;
      document.getElementById("ticket-destino").textContent = data.destino;
      document.getElementById("ticket-fecha").textContent = state.selectedSalida.fechaTexto;
      document.getElementById("ticket-asientos").textContent = \`\${data.bus} · Sillas: \${data.asientos.join(", ")}\`;

      let pasList = \`<div><strong>\${data.titular.nombre}</strong> (Asiento \${data.asientos[0]}) - Recogida: \${data.titular.recogida}</div>\`;
      data.acompanantes.forEach((c, i) => {
        pasList += \`<div><strong>\${c.nombre}</strong> (Asiento \${data.asientos[i + 1]}) - Recogida: \${c.recogida}</div>\`;
      });
      document.getElementById("ticket-pasajeros").innerHTML = pasList;

      document.getElementById("ticket-metodo").textContent = data.tipoPago;

      if (data.tipoPago === "Pago Móvil" && data.tasaBCV > 0) {
        document.getElementById("ticket-pago").textContent = \`\${data.montoAbonadoEur} € (Bs. \${formatVzla(data.montoPagadoBs)}) / Saldo: \${data.saldoPendienteEur} €\`;
      } else {
        document.getElementById("ticket-pago").textContent = \`\${data.montoAbonadoEur} € / Saldo: \${data.saldoPendienteEur} €\`;
      }

      const efBox = document.getElementById("ticket-efectivo-box");
      if (data.tipoPago === "Efectivo") {
        efBox.classList.remove("hidden");
        document.getElementById("ticket-saldo-efectivo").textContent = \`\${data.saldoPendienteEur > 0 ? data.saldoPendienteEur : data.montoAbonadoEur} $\`;
      } else {
        efBox.classList.add("hidden");
      }

      lucide.createIcons();
    }

    function setupEventListeners() {
      document.getElementById("btn-month-prev").onclick = () => {
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
      document.getElementById("btn-month-next").onclick = () => {
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
      const clearBtn = document.getElementById("btn-clear-date-filter");
      if (clearBtn) {
        clearBtn.onclick = clearDateFilter;
      }

      document.getElementById("btn-close-detalles").onclick = closeDetallesModal;
      const closePoliticasBtn = document.getElementById("btn-close-politicas");
      if (closePoliticasBtn) closePoliticasBtn.onclick = closePoliticasModal;
      document.getElementById("btn-close-wizard").onclick = closeWizard;
      document.getElementById("btn-close-success").onclick = () => {
        document.getElementById("modal-success").classList.add("hidden");
        document.getElementById("modal-success").classList.remove("flex");
        renderTrips();
      };

      document.getElementById("btn-wizard-prev").onclick = () => {
        if (currentStep > 1) goToStep(currentStep - 1);
      };
      document.getElementById("btn-wizard-next").onclick = () => {
        if (!validateStep(currentStep)) return;
        if (currentStep < 5) {
          goToStep(currentStep + 1);
        } else {
          submitBooking();
        }
      };

      document.getElementById("toggle-separate-pickup").onchange = (e) => {
        handleToggleSeparatePickup(e.target.checked);
      };

      document.getElementById("pay-opt-full").onclick = () => {
        state.tipoAbono = "full";
        document.getElementById("pay-opt-full").className = "py-2.5 px-3 rounded-xl font-bold text-xs transition bg-white text-tour-navy shadow-sm";
        document.getElementById("pay-opt-deposit").className = "py-2.5 px-3 rounded-xl font-bold text-xs transition text-slate-600 hover:text-tour-navy";
        renderStep4();
      };
      document.getElementById("pay-opt-deposit").onclick = () => {
        state.tipoAbono = "abono";
        document.getElementById("pay-opt-deposit").className = "py-2.5 px-3 rounded-xl font-bold text-xs transition bg-white text-tour-navy shadow-sm";
        document.getElementById("pay-opt-full").className = "py-2.5 px-3 rounded-xl font-bold text-xs transition text-slate-600 hover:text-tour-navy";
        renderStep4();
      };

      document.querySelectorAll("input[name='paymentMethod']").forEach(radio => {
        radio.onchange = (e) => {
          state.metodoPago = e.target.value;
          const boxPm = document.getElementById("method-box-pagomovil");
          const boxEf = document.getElementById("method-box-efectivo");
          const lblPm = document.getElementById("label-method-pagomovil");
          const lblEf = document.getElementById("label-method-efectivo");

          if (state.metodoPago === "Pago Móvil") {
            boxPm.classList.remove("hidden");
            boxEf.classList.add("hidden");
            lblPm.className = "relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-tour-blue bg-blue-50/50";
            lblEf.className = "relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-slate-200 hover:border-slate-300";
          } else {
            boxPm.classList.add("hidden");
            boxEf.classList.remove("hidden");
            lblEf.className = "relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-emerald-500 bg-emerald-50/50";
            lblPm.className = "relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-slate-200 hover:border-slate-300";
          }
        };
      });

      document.getElementById("btn-copy-bs").onclick = () => {
        const text = document.getElementById("pagomovil-monto-bs").textContent.replace("Bs.", "").replace("Bs", "").trim();
        navigator.clipboard.writeText(text);
        document.getElementById("copy-bs-text").textContent = "¡Copiado!";
        setTimeout(() => {
          document.getElementById("copy-bs-text").textContent = "Copiar monto";
        }, 2000);
      };

      document.getElementById("btn-download-ticket").onclick = () => {
        const ticketNode = document.getElementById("ticket-card");
        if (window.html2canvas) {
          html2canvas(ticketNode, { scale: 2.5, backgroundColor: "#ffffff" }).then(canvas => {
            const link = document.createElement("a");
            link.download = \`Ticket-TourAzul-\${state.reservaFinal.idReserva}.png\`;
            link.href = canvas.toDataURL("image/png");
            link.click();
          });
        }
      };

      document.getElementById("btn-share-whatsapp").onclick = () => {
        if (!state.reservaFinal) {
          alert("La reserva aún no ha sido procesada.");
          return;
        }

        const r = state.reservaFinal;
        const idReserva = r.idReserva || "No indicado";
        const destino = r.destino || "No indicado";
        const fechaViaje = (state.selectedSalida && state.selectedSalida.fechaTexto) || r.fechaViaje || "No indicado";
        const unidad = r.bus || "No indicado";

        // 👥 PASAJEROS: 1 línea por pasajero
        const listaPasajeros = [];
        const leadSeat = (r.asientos && r.asientos[0]) ? r.asientos[0] : "No indicado";
        const leadName = (r.titular && r.titular.nombre) ? r.titular.nombre : "No indicado";
        const leadPickup = (r.titular && r.titular.recogida) ? r.titular.recogida : "No indicado";
        listaPasajeros.push("1. " + leadName + " - Asiento " + leadSeat + " - Recogida: " + leadPickup);

        if (Array.isArray(r.acompanantes)) {
          r.acompanantes.forEach((comp, idx) => {
            const compSeat = (r.asientos && r.asientos[idx + 1]) ? r.asientos[idx + 1] : "No indicado";
            const compName = (comp && comp.nombre) ? comp.nombre : "No indicado";
            const compPickup = (comp && comp.recogida) ? comp.recogida : leadPickup;
            listaPasajeros.push((idx + 2) + ". " + compName + " - Asiento " + compSeat + " - Recogida: " + compPickup);
          });
        }

        const nl = String.fromCharCode(10);
        const pasajerosTexto = listaPasajeros.join(nl);

        // 💳 PAGO: Método, montos, referencia y estado
        const esEfectivo = (r.tipoPago === "Efectivo");
        const metodoPago = esEfectivo ? "Efectivo en dólares" : (r.tipoPago || "No indicado");

        let montoPagado = "No indicado";
        if (typeof r.montoAbonadoEur === "number") {
          if (!esEfectivo && r.montoPagadoBs > 0) {
            montoPagado = r.montoAbonadoEur + " € (Bs. " + formatVzla(r.montoPagadoBs) + ")";
          } else if (!esEfectivo && r.tasaBCV > 0) {
            montoPagado = r.montoAbonadoEur + " € (Bs. " + formatVzla(r.montoAbonadoEur * r.tasaBCV) + ")";
          } else {
            montoPagado = r.montoAbonadoEur + " €";
          }
        }

        const saldoPendiente = (typeof r.saldoPendienteEur === "number") ? (r.saldoPendienteEur + " €") : "0 €";

        let referenciaTexto = "No indicado";
        let estadoTexto = "Pendiente de pago";

        if (esEfectivo) {
          referenciaTexto = "Sin referencia (efectivo)";
          estadoTexto = "Pendiente de pago";
        } else {
          // Si es Pago Móvil, tomar solo los últimos 4 dígitos
          const rawRef = (r.referenciaPagoMovil || "").trim();
          referenciaTexto = rawRef.length > 0 ? rawRef.slice(-4) : "No indicado";
          estadoTexto = (r.saldoPendienteEur === 0) ? "Pagado completo" : "Abonado";
        }

        const mensajeWhatsApp = [
          "🎫 NUEVA RESERVA - TOUR AZUL",
          "",
          "N° de reserva: " + idReserva,
          "Destino: " + destino,
          "Fecha: " + fechaViaje,
          "Unidad: " + unidad,
          "",
          "👥 PASAJEROS",
          pasajerosTexto,
          "",
          "💳 PAGO",
          "Método de pago: " + metodoPago,
          "Monto pagado: " + montoPagado,
          "Saldo pendiente: " + saldoPendiente,
          "Referencia (últimos 4 dígitos): " + referenciaTexto,
          "Estado: " + estadoTexto
        ].join(nl);

        const url = "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(mensajeWhatsApp);
        window.open(url, "_blank");
      };

      const floatWa = document.getElementById("btn-whatsapp-float");
      const defaultWaMsg = "¡Hola Tour Azul! Quiero consultar sobre los viajes y excursiones disponibles.";
      floatWa.href = \`https://wa.me/\${WHATSAPP_NUMERO}?text=\${encodeURIComponent(defaultWaMsg)}\`;
    }
  </script>
</body>
</html>`;

fs.writeFileSync('index.html', html);
console.log('Successfully generated index.html with new BCV rate logic. Size:', html.length);
