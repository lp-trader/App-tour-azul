import fs from 'fs';
import { TRIPS } from './data.js';
import { rateClientCode } from './rate-client-code.js';

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

      <!-- Pill BCV Tasa del Día (con Skeleton Inicial) -->
      <div id="bcv-pill-container" class="flex items-center gap-2">
        <div class="animate-pulse flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-400 shadow-sm">
          <span class="text-sm">🇻🇪</span>
          <span class="text-slate-500 font-medium">Tasa BCV Euro:</span>
          <div class="h-3.5 w-24 bg-slate-300 rounded"></div>
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

        <div id="calendar-filter-bar" class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs hidden">
          <div class="flex items-center gap-2 text-tour-navy font-medium">
            <span class="w-2.5 h-2.5 rounded-full bg-tour-caribe"></span>
            <span id="calendar-filter-text">Filtrando por fecha</span>
          </div>
          <button id="btn-clear-date-filter" class="text-tour-blue hover:underline font-bold">
            Ver todos los viajes
          </button>
        </div>
      </div>

      <!-- FILTRO POR DESTINOS -->
      <div class="mb-4">
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1" id="destination-filters"></div>
      </div>

      <!-- AVISO DE VIAJES POR DÍA SELECCIONADO (Encima de la lista de viajes) -->
      <div id="selected-date-banner" class="hidden mb-4">
        <div class="bg-gradient-to-r from-sky-50 via-blue-50/80 to-sky-50 border border-sky-200/90 rounded-2xl p-3 md:p-3.5 flex items-center justify-between shadow-xs">
          <div class="flex items-center gap-2.5">
            <span class="flex h-2.5 w-2.5 relative shrink-0">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-tour-blue opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-tour-blue"></span>
            </span>
            <span id="selected-date-text" class="text-xs md:text-sm font-bold text-tour-navy">
              2 viajes disponibles el 3 de octubre
            </span>
          </div>
          <button onclick="clearDateFilter()" class="text-[11px] md:text-xs font-bold text-tour-blue hover:text-blue-800 bg-white px-2.5 py-1 rounded-xl border border-sky-200 shadow-xs flex items-center gap-1 transition active:scale-95 cursor-pointer">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
            <span>Ver todos</span>
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
        <span class="text-slate-500">¿Dudas o preguntas?</span>
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

      <!-- Política de Cancelación Destacada -->
      <div class="rounded-2xl p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs">
        <div class="flex items-center gap-2 font-bold mb-1">
          <i data-lucide="alert-circle" class="w-4 h-4 text-amber-600"></i>
          <span>Política de cancelación</span>
        </div>
        <p>Las cancelaciones deben realizarse con al menos 24 horas de antelación al viaje.</p>
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

          <div class="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between">
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

          <div class="rounded-2xl p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <span class="font-bold block mb-0.5">Política de cancelación:</span>
            <span>Las cancelaciones deben realizarse con al menos 24 horas de antelación al viaje.</span>
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

        <div class="p-2.5 rounded-xl bg-yellow-50 border-2 border-tour-yellow text-slate-800 text-[11px] text-center font-medium shadow-sm">
          <span class="font-bold text-tour-navy block text-xs">Política de cancelación</span>
          <span>Las cancelaciones deben realizarse con al menos 24 horas de antelación al viaje.</span>
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

  <!-- SPINNER OVERLAY ELEGANTE -->
  <div id="loading-overlay" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center">
    <div class="bg-white rounded-3xl p-6 flex flex-col items-center space-y-3 shadow-2xl">
      <div class="w-12 h-12 border-4 border-sky-100 border-t-tour-blue rounded-full animate-spin"></div>
      <span class="text-xs font-bold text-tour-navy" id="loading-text">Procesando tu reserva...</span>
    </div>
  </div>

  <!-- JAVASCRIPT ES6+ EMBEBIDO -->
  <script>
    const WEBHOOK_URL = "";
    const WHATSAPP_NUMERO = "584126571155";
    const MINUTOS_BLOQUEO_ASIENTO = 10;
    const ABONO_MINIMO = 5;
    const DATOS_PAGO_MOVIL = { banco: "0102 - Banco de Venezuela", cedulaRif: "V-12345678", telefono: "04121234567" };
    const INSTRUCCIONES_EFECTIVO = "Entrega el monto en efectivo al abordar la unidad el día del viaje.";

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
      timerBloqueo: null,
      segundosRestantesTimer: MINUTOS_BLOQUEO_ASIENTO * 60,
      tipoAbono: "full",
      metodoPago: "Pago Móvil",
      titular: { nombre: "", cedula: "", edad: "", telefono: "", correo: "", recogida: "" },
      acompanantes: [],
      reservaFinal: null
    };

${rateClientCode}

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
      renderDestinationFilters();
      renderCalendar();
      renderTrips();
      setupEventListeners();
    });

    function renderHeroChips() {
      const container = document.getElementById("hero-chips");
      const popular = [
        "Cayo Muerto", "Varadero", "Cayo Azul", "Cayo Boca Seca",
        "Colonia Tovar", "Cayo Sombrero", "Cayo Sal", "Isla Larga",
        "Choroní", "Crazy Bus Halloween", "Mérida Teleférico"
      ];
      container.innerHTML = popular.map((dest, i) => \`
        <button onclick="scrollToDestination('\${dest}')" class="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-tour-navy border border-white/30 text-xs font-bold transition shadow-sm backdrop-blur-md active:scale-95" style="animation: float \${3.5 + (i % 3) * 0.7}s ease-in-out infinite; animation-delay: \${(i * 0.2)}s">
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

      for (let day = 1; day <= totalDays; day++) {
        const monthStr = String(state.mesCalendario + 1).padStart(2, "0");
        const dayStr = String(day).padStart(2, "0");
        const dateIso = \`\${state.anioCalendario}-\${monthStr}-\${dayStr}\`;

        const departures = [];
        VIAJES.forEach(v => {
          v.salidas.forEach(s => {
            if (s.fecha === dateIso) departures.push(v);
          });
        });

        const hasTrips = departures.length > 0;
        const isSelected = state.filtroFecha === dateIso;

        let bgClass = "bg-slate-50 text-slate-700 hover:bg-slate-100";
        if (hasTrips) {
          bgClass = "bg-sky-50 text-tour-blue font-bold border border-sky-200 hover:bg-sky-100";
        }
        if (isSelected) {
          bgClass = "bg-tour-blue text-white font-black shadow-md border-tour-blue";
        }

        htmlDays += \`
          <button onclick="selectCalendarDate('\${dateIso}', \${hasTrips})" class="h-10 rounded-xl relative flex flex-col items-center justify-center transition active:scale-95 \${bgClass}">
            <span>\${day}</span>
            \${hasTrips && !isSelected ? '<span class="w-1.5 h-1.5 rounded-full bg-tour-caribe mt-0.5"></span>' : ''}
          </button>
        \`;
      }

      daysContainer.innerHTML = htmlDays;

      const filterBar = document.getElementById("calendar-filter-bar");
      const filterText = document.getElementById("calendar-filter-text");
      if (state.filtroFecha) {
        filterBar.classList.remove("hidden");
        filterText.textContent = \`Filtrando por fecha: \${formatDateString(state.filtroFecha)}\`;
      } else {
        filterBar.classList.add("hidden");
      }
    }

    window.selectCalendarDate = function(dateIso, hasTrips) {
      if (!hasTrips) return;
      state.filtroFecha = (state.filtroFecha === dateIso) ? null : dateIso;
      renderCalendar();
      renderTrips();

      // Scroll automático y suave al inicio de la lista de viajes de ese día
      if (state.filtroFecha) {
        setTimeout(() => {
          const target = document.getElementById("selected-date-banner") || document.getElementById("trips-grid");
          if (target) {
            const yOffset = -24;
            const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
          }
        }, 80);
      }
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
      const container = document.getElementById("trips-grid");
      let filtered = VIAJES;

      if (state.filtroDestino !== "todos") {
        filtered = filtered.filter(v => v.destino === state.filtroDestino);
      }
      if (state.filtroFecha) {
        filtered = filtered.filter(v => v.salidas.some(s => s.fecha === state.filtroFecha));
      }

      // Actualizar aviso justo encima de la lista de viajes
      const dateBanner = document.getElementById("selected-date-banner");
      const dateBannerText = document.getElementById("selected-date-text");
      if (state.filtroFecha && dateBanner && dateBannerText) {
        const fechaTexto = getFechaHumanaCorta(state.filtroFecha);
        const count = filtered.length;
        dateBannerText.textContent = \`\${count} viaje\${count === 1 ? '' : 's'} disponible\${count === 1 ? '' : 's'} el \${fechaTexto}\`;
        dateBanner.classList.remove("hidden");
      } else if (dateBanner) {
        dateBanner.classList.add("hidden");
      }

      // Actualizar avisos de desliza para ver más
      updateScrollCue(filtered.length);

      if (filtered.length === 0) {
        container.innerHTML = \`
          <div class="col-span-full py-16 text-center space-y-3">
            <i data-lucide="compass" class="w-12 h-12 text-slate-300 mx-auto"></i>
            <h3 class="font-title font-bold text-lg text-tour-navy">No encontramos viajes con estos filtros</h3>
            <button onclick="resetFilters()" class="px-5 py-2 rounded-xl bg-tour-blue text-white text-xs font-bold">
              Ver todos los viajes
            </button>
          </div>
        \`;
        lucide.createIcons();
        return;
      }

      container.innerHTML = filtered.map(trip => {
        let bsPriceHtml = "";
        if (state.tasaDisponible && state.tasaBCV > 0) {
          const bsValue = formatVzla(trip.precio * state.tasaBCV);
          bsPriceHtml = \`<span class="text-tour-yellow text-[10px] md:text-[11px] font-semibold block mt-0.5">≈ Bs. \${bsValue}</span>\`;
        }

        const mockCupos = 31;
        let cuposText = "31 cupos disponibles";
        let cuposClass = "text-emerald-600 bg-emerald-50 border-emerald-200 font-bold";

        const fechasChipsHtml = trip.salidas.map((s, idx) => \`
          <button type="button" onclick="setTripSelectedDate('\${trip.id}', \${idx}, event)" class="px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-[10px] md:text-[11px] font-bold transition shadow-sm \${idx === 0 ? 'bg-white text-tour-navy shadow' : 'bg-black/40 text-white hover:bg-black/60'}">
            \${s.fechaTexto.split(" ")[0]} \${s.fechaTexto.split(" ")[1]}
          </button>
        \`).join("");

        return \`
          <div class="group bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-sky-100 flex flex-col transition-all duration-300 hover:-translate-y-1">
            <div class="relative h-44 sm:h-52 md:h-64 w-full overflow-hidden bg-sky-900">
              <img src="\${encodeURI(trip.imagenUrl)}" alt="\${trip.destino}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.style.opacity='0.25';" />
              <div class="absolute inset-0 bg-gradient-to-t from-[#0B2A6B]/90 via-[#0B2A6B]/25 to-transparent pointer-events-none"></div>

              <div class="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-1 items-start">
                <span class="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-tour-yellow text-tour-navy font-bold text-[10px] md:text-xs shadow-sm uppercase tracking-wide">
                  \${trip.tipo}
                </span>
                \${trip.etiquetaEspecial ? \`
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
                  \${trip.salidas[0].fechaTexto}
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
                  \${cuposText}
                </span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-1.5 md:h-2 overflow-hidden">
                <div class="bg-tour-caribe h-full rounded-full" style="width: \${Math.round((31 - mockCupos) / 31 * 100)}%"></div>
              </div>
            </div>

            <div class="p-3 md:p-4 pt-0 grid grid-cols-2 gap-2">
              <button onclick="openDetallesModal('\${trip.id}')" class="py-2.5 md:py-3 px-2 md:px-3 rounded-xl md:rounded-2xl border-2 border-tour-blue text-tour-blue font-bold text-xs hover:bg-sky-50 active:scale-95 transition flex items-center justify-center gap-1">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                <span>Detalles</span>
              </button>
              <button onclick="startBooking('\${trip.id}', 0)" class="py-2.5 md:py-3 px-2 md:px-3 rounded-xl md:rounded-2xl bg-tour-blue hover:bg-blue-700 text-white font-title font-black uppercase text-xs tracking-wider shadow-md hover:shadow-lg active:scale-95 transition flex items-center justify-center gap-1">
                <span>Reserva ya</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
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
      if (trip && trip.salidas[index]) {
        startBooking(tripId, index);
      }
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
        startBooking(trip.id, 0);
      };

      document.getElementById("modal-detalles").classList.remove("hidden");
      document.getElementById("modal-detalles").classList.add("flex");
      lucide.createIcons();
    };

    function closeDetallesModal() {
      document.getElementById("modal-detalles").classList.add("hidden");
      document.getElementById("modal-detalles").classList.remove("flex");
    }

    let currentStep = 1;

    window.startBooking = function(tripId, salidaIndex = 0) {
      const trip = VIAJES.find(t => t.id === tripId);
      if (!trip) return;

      state.selectedTrip = trip;
      state.selectedSalida = trip.salidas[salidaIndex] || trip.salidas[0];
      state.selectedBus = state.selectedSalida.buses[0] || "Bus 1";
      state.busesDisponibles = state.selectedSalida.buses || ["Bus 1"];
      state.asientosSeleccionados = [];
      state.tipoAbono = "full";
      state.metodoPago = state.tasaDisponible ? "Pago Móvil" : "Efectivo";

      document.getElementById("wizard-trip-name").textContent = trip.destino;
      document.getElementById("wizard-trip-date").textContent = state.selectedSalida.fechaTexto;

      goToStep(2);
      loadBusSeats();

      document.getElementById("modal-wizard").classList.remove("hidden");
      document.getElementById("modal-wizard").classList.add("flex");
    };

    function closeWizard() {
      if (state.timerBloqueo) clearInterval(state.timerBloqueo);
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
      const container = document.getElementById("step-1-fechas");
      container.innerHTML = state.selectedTrip.salidas.map((s, idx) => {
        const isSelected = state.selectedSalida.fecha === s.fecha;
        return \`
          <button type="button" onclick="selectSalidaDate(\${idx})" class="w-full p-4 rounded-2xl border-2 text-left transition flex items-center justify-between \${isSelected ? 'border-tour-blue bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}">
            <div>
              <span class="font-bold text-sm text-tour-navy block">\${s.fechaTexto}</span>
              <span class="text-xs text-slate-500">\${s.buses.length} unidad(es) de transporte</span>
            </div>
            \${isSelected ? '<i data-lucide="check-circle" class="w-5 h-5 text-tour-blue"></i>' : ''}
          </button>
        \`;
      }).join("");
    }

    window.selectSalidaDate = function(index) {
      state.selectedSalida = state.selectedTrip.salidas[index];
      state.selectedBus = state.selectedSalida.buses[0];
      state.busesDisponibles = state.selectedSalida.buses;
      document.getElementById("wizard-trip-date").textContent = state.selectedSalida.fechaTexto;
      renderStep1();
      loadBusSeats();
    };

    async function loadBusSeats() {
      if (!WEBHOOK_URL) {
        state.asientosOcupados = [];
        state.asientosBloqueados = [];
        renderBusSeatsUI();
        return;
      }
      try {
        const url = \`\${WEBHOOK_URL}?accion=asientos&destino=\${encodeURIComponent(state.selectedTrip.destino)}&fecha=\${state.selectedSalida.fecha}&bus=\${encodeURIComponent(state.selectedBus)}\`;
        const res = await fetch(url);
        const data = await res.json();
        state.asientosOcupados = data.ocupados || [];
        state.asientosBloqueados = data.bloqueados || [];
        renderBusSeatsUI();
      } catch (e) {
        state.asientosOcupados = [];
        state.asientosBloqueados = [];
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
      loadBusSeats();
    };

    function renderSingleSeat(num) {
      const isOcupado = state.asientosOcupados.includes(num);
      const isBloqueado = state.asientosBloqueados.includes(num);
      const isSeleccionado = state.asientosSeleccionados.includes(num);

      let styleClass = "bg-emerald-500 text-white shadow-sm border border-emerald-400 cursor-pointer hover:bg-emerald-600";
      if (isOcupado) {
        styleClass = "bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300";
      } else if (isBloqueado) {
        styleClass = "bg-amber-400 text-amber-950 cursor-not-allowed border border-amber-300";
      } else if (isSeleccionado) {
        styleClass = "bg-tour-blue text-white ring-4 ring-blue-300 ring-offset-1 font-bold shadow-md scale-105";
      }

      return \`
        <button type="button" onclick="toggleSeat(\${num})" class="w-9 h-10 rounded-xl relative flex flex-col items-center justify-center text-xs font-bold seat-bounce transition \${styleClass}" \${isOcupado || isBloqueado ? 'disabled' : ''}>
          <span class="w-5 h-1.5 rounded-full bg-white/30 mb-0.5 pointer-events-none"></span>
          <span>\${num}</span>
        </button>
      \`;
    }

    window.toggleSeat = function(num) {
      if (state.asientosOcupados.includes(num) || state.asientosBloqueados.includes(num)) return;
      if (navigator.vibrate) navigator.vibrate(20);

      const idx = state.asientosSeleccionados.indexOf(num);
      if (idx > -1) {
        state.asientosSeleccionados.splice(idx, 1);
      } else {
        state.asientosSeleccionados.push(num);
      }

      state.asientosSeleccionados.sort((a, b) => a - b);
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

    function renderStep3() {
      const container = document.getElementById("passengers-forms");
      const separatePickup = document.getElementById("toggle-separate-pickup").checked;
      
      const leadSeat = state.asientosSeleccionados[0];
      const compSeats = state.asientosSeleccionados.slice(1);

      let html = \`
        <div class="p-4 bg-sky-50/60 rounded-2xl border border-sky-200/80 space-y-3">
          <div class="flex items-center justify-between border-b border-sky-100 pb-2">
            <span class="font-title font-bold text-xs uppercase text-tour-navy flex items-center gap-1.5">
              <i data-lucide="user-check" class="w-4 h-4 text-tour-blue"></i>
              Pasajero Titular (Asiento #\${leadSeat})
            </span>
            <span class="text-[10px] bg-tour-blue text-white px-2 py-0.5 rounded-full font-bold">Principal</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="block text-slate-600 font-medium mb-1">Nombre y Apellido *</label>
              <input type="text" id="lead-name" value="\${state.titular.nombre}" required placeholder="Ej. Carlos Pérez" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
            </div>
            <div>
              <label class="block text-slate-600 font-medium mb-1">Cédula o Pasaporte *</label>
              <input type="text" id="lead-cedula" value="\${state.titular.cedula}" required placeholder="Ej. V-19876543" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
            </div>
            <div>
              <label class="block text-slate-600 font-medium mb-1">Edad *</label>
              <input type="number" id="lead-age" value="\${state.titular.edad}" required placeholder="Ej. 28" min="1" max="100" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
            </div>
            <div>
              <label class="block text-slate-600 font-medium mb-1">Teléfono WhatsApp *</label>
              <input type="tel" id="lead-phone" value="\${state.titular.telefono}" required placeholder="Ej. 04121234567" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
            </div>
            <div class="md:col-span-2">
              <label class="block text-slate-600 font-medium mb-1">Correo Electrónico (opcional)</label>
              <input type="email" id="lead-email" value="\${state.titular.correo}" placeholder="ejemplo@correo.com" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
            </div>
            <div class="md:col-span-2">
              <label class="block text-slate-600 font-medium mb-1">Punto de Recogida * (mínimo 10 caracteres)</label>
              <textarea id="lead-pickup" rows="2" required placeholder="Ej. Barquisimeto (Monumental), Cabudare (Redoma) o Yaracuy (Chivacoa / San Felipe)" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none text-xs">\${state.titular.recogida}</textarea>
              <span class="text-[10px] text-slate-400">Salidas desde Barquisimeto, Cabudare y Yaracuy. Puedes seleccionar un punto o escribirlo:</span>
              <div class="flex flex-wrap gap-1.5 pt-1.5">
                <button type="button" onclick="document.getElementById('lead-pickup').value='Barquisimeto: C.C. Metrópolis / Monumental'; document.getElementById('lead-pickup').dispatchEvent(new Event('input'));" class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sky-50 text-tour-blue border border-sky-200 hover:bg-sky-100 transition cursor-pointer">📍 Barquisimeto</button>
                <button type="button" onclick="document.getElementById('lead-pickup').value='Cabudare: Redoma de Agua Viva'; document.getElementById('lead-pickup').dispatchEvent(new Event('input'));" class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sky-50 text-tour-blue border border-sky-200 hover:bg-sky-100 transition cursor-pointer">📍 Cabudare</button>
                <button type="button" onclick="document.getElementById('lead-pickup').value='Yaracuy: Pasarela / Peaje de Chivacoa'; document.getElementById('lead-pickup').dispatchEvent(new Event('input'));" class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sky-50 text-tour-blue border border-sky-200 hover:bg-sky-100 transition cursor-pointer">📍 Yaracuy (Chivacoa)</button>
                <button type="button" onclick="document.getElementById('lead-pickup').value='Yaracuy: San Felipe (Redoma / Autopista)'; document.getElementById('lead-pickup').dispatchEvent(new Event('input'));" class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sky-50 text-tour-blue border border-sky-200 hover:bg-sky-100 transition cursor-pointer">📍 Yaracuy (San Felipe)</button>
              </div>
            </div>
          </div>
        </div>
      \`;

      compSeats.forEach((seatNum, idx) => {
        const compData = state.acompanantes[idx] || { nombre: "", edad: "", cedula: "", recogida: "" };
        html += \`
          <div class="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <span class="font-title font-bold text-xs uppercase text-slate-700 flex items-center gap-1.5">
                <i data-lucide="user" class="w-4 h-4 text-tour-caribe"></i>
                Acompañante \${idx + 1} (Asiento #\${seatNum})
              </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label class="block text-slate-600 font-medium mb-1">Nombre y Apellido *</label>
                <input type="text" id="comp-name-\${idx}" value="\${compData.nombre || ''}" required placeholder="Nombre completo" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
              </div>
              <div>
                <label class="block text-slate-600 font-medium mb-1">Edad *</label>
                <input type="number" id="comp-age-\${idx}" value="\${compData.edad || ''}" required placeholder="Edad" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
              </div>
              <div>
                <label class="block text-slate-600 font-medium mb-1">Cédula (opcional para niños)</label>
                <input type="text" id="comp-cedula-\${idx}" value="\${compData.cedula || ''}" placeholder="Cédula" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
              </div>
              \${separatePickup ? \`
                <div class="md:col-span-3">
                  <label class="block text-slate-600 font-medium mb-1">Punto de Recogida específico *</label>
                  <input type="text" id="comp-pickup-\${idx}" value="\${compData.recogida || state.titular.recogida || ''}" required placeholder="Dirección exacta de recogida" class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-tour-blue focus:outline-none">
                </div>
              \` : ''}
            </div>
          </div>
        \`;
      });

      container.innerHTML = html;
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

      const separatePickup = document.getElementById("toggle-separate-pickup").checked;
      let pickupsHtml = "";
      if (!separatePickup) {
        pickupsHtml = \`<div class="text-[11px] text-slate-500"><strong>Punto de recogida:</strong> \${state.titular.recogida}</div>\`;
      } else {
        pickupsHtml = \`
          <div class="text-[11px] text-slate-500 space-y-0.5">
            <div><strong>\${state.titular.nombre} (Asiento \${state.asientosSeleccionados[0]}):</strong> \${state.titular.recogida}</div>
            \${state.acompanantes.map((c, i) => \`<div><strong>\${c.nombre} (Asiento \${state.asientosSeleccionados[i + 1]}):</strong> \${c.recogida}</div>\`).join("")}
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
        const leadName = document.getElementById("lead-name").value.trim();
        const leadCedula = document.getElementById("lead-cedula").value.trim();
        const leadAge = document.getElementById("lead-age").value.trim();
        const leadPhone = document.getElementById("lead-phone").value.trim();
        const leadPickup = document.getElementById("lead-pickup").value.trim();

        if (!leadName || !leadCedula || !leadAge || !leadPhone) {
          alert("Por favor completa los datos obligatorios del titular.");
          return false;
        }
        if (leadPickup.length < 10) {
          alert("El punto de recogida debe tener al menos 10 caracteres con la dirección clara.");
          return false;
        }

        state.titular = {
          nombre: leadName,
          cedula: leadCedula,
          edad: leadAge,
          telefono: leadPhone,
          correo: document.getElementById("lead-email").value.trim(),
          recogida: leadPickup
        };

        const separatePickup = document.getElementById("toggle-separate-pickup").checked;
        state.acompanantes = [];
        const numAcomp = state.asientosSeleccionados.length - 1;

        for (let i = 0; i < numAcomp; i++) {
          const compName = document.getElementById(\`comp-name-\${i}\`).value.trim();
          const compAge = document.getElementById(\`comp-age-\${i}\`).value.trim();
          const compCed = document.getElementById(\`comp-cedula-\${i}\`).value.trim();
          let compPick = leadPickup;

          if (separatePickup) {
            compPick = document.getElementById(\`comp-pickup-\${i}\`).value.trim();
            if (!compPick || compPick.length < 10) {
              alert(\`El punto de recogida del acompañante \${i + 1} debe tener al menos 10 caracteres.\`);
              return false;
            }
          }

          if (!compName || !compAge) {
            alert(\`Por favor completa el nombre y la edad del acompañante \${i + 1}.\`);
            return false;
          }

          state.acompanantes.push({
            nombre: compName,
            edad: compAge,
            cedula: compCed,
            recogida: compPick
          });
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
        titular: state.titular,
        acompanantes: state.acompanantes
      };

      state.reservaFinal = payload;

      if (WEBHOOK_URL) {
        try {
          const res = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
          });
          const result = await res.json();
          if (!result.ok && result.error === "asiento_ocupado") {
            overlay.classList.add("hidden");
            alert("Uno o más asientos acaban de ser ocupados por otro cliente. Por favor vuelve a seleccionarlos.");
            loadBusSeats();
            goToStep(2);
            return;
          }
        } catch (e) {
          console.warn("Error enviando al Webhook:", e);
        }
      } else {
        await new Promise(r => setTimeout(r, 800));
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
        state.mesCalendario = 9;
        renderCalendar();
      };
      document.getElementById("btn-month-next").onclick = () => {
        state.mesCalendario = 10;
        renderCalendar();
      };
      document.getElementById("btn-clear-date-filter").onclick = () => {
        state.filtroFecha = null;
        renderCalendar();
        renderTrips();
      };

      document.getElementById("btn-close-detalles").onclick = closeDetallesModal;
      document.getElementById("btn-close-wizard").onclick = closeWizard;
      document.getElementById("btn-close-success").onclick = () => {
        document.getElementById("modal-success").classList.add("hidden");
        document.getElementById("modal-success").classList.remove("flex");
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

      document.getElementById("toggle-separate-pickup").onchange = () => {
        renderStep3();
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
