/**
 * TOUR AZUL - SECCIÓN "🔥 VIAJES DESTACADOS"
 * Módulo para la portada justo debajo del Hero con selección automática,
 * rotación suave cada 6 segundos, variedad de destinos y detección de cupos/ocupación.
 */

export const featuredSectionHtml = `
    <!-- SECCIÓN 🔥 VIAJES DESTACADOS -->
    <section id="viajes-destacados" class="relative z-20 -mt-10 md:-mt-14 max-w-6xl mx-auto px-4 mb-8">
      <!-- Contenedor Exterior -->
      <div class="bg-gradient-to-b from-white/95 to-sky-50/90 backdrop-blur-md rounded-3xl p-5 md:p-7 shadow-xl border border-sky-100/90 space-y-4">
        
        <!-- Encabezado de la Sección -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100/80 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="w-9 h-9 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg shadow-2xs animate-pulse">
              🔥
            </span>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-title font-black uppercase text-tour-navy text-lg md:text-xl tracking-tight leading-none">
                  Viajes Destacados
                </h2>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                  En tendencia
                </span>
              </div>
              <p class="text-[11px] md:text-xs text-slate-500 font-medium">
                Las salidas más solicitadas de las próximas semanas. ¡No te quedes sin tu cupo!
              </p>
            </div>
          </div>

          <!-- Indicador de Rotación Automática y Pausa -->
          <div class="flex items-center gap-2">
            <div id="featured-rotation-indicator" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/70 text-tour-blue text-[11px] font-semibold">
              <span id="featured-status-dot" class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span id="featured-status-label">Rotando cada 6s</span>
            </div>
          </div>
        </div>

        <!-- Contenedor de las 4 Tarjetas Flotantes -->
        <div 
          id="featured-cards-container" 
          class="flex md:grid md:grid-cols-4 gap-3.5 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-3 md:pb-1 no-scrollbar pt-2"
          onmouseenter="pauseFeaturedRotation()"
          onmouseleave="resumeFeaturedRotation()"
          ontouchstart="pauseFeaturedRotation()"
          ontouchend="handleTouchEndFeaturedRotation()"
        >
          <!-- Las 4 tarjetas mini estilo póster se insertan dinámicamente -->
        </div>

        <!-- Barra informativa al pie de destacados -->
        <div class="pt-1 flex flex-wrap items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
          <span class="flex items-center gap-1">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-tour-yellow"></i>
            <span>Se actualiza automáticamente según ocupación y proximidad</span>
          </span>
          <a href="#viajes" class="font-bold text-tour-blue hover:text-blue-800 transition flex items-center gap-1">
            <span>Explorar cartelera completa</span>
            <i data-lucide="arrow-down" class="w-3 h-3"></i>
          </a>
        </div>

      </div>
    </section>
`;

export const featuredClientCode = `
    // =========================================================================
    // SECCIÓN 🔥 VIAJES DESTACADOS (SELECCIÓN AUTOMÁTICA Y ROTACIÓN CADA 6S)
    // =========================================================================

    const FEATURED_ROTATION_INTERVAL_MS = 6000;
    const CAPACITY_PER_BUS = 31; // Capacidad estándar del autobús Tour Azul

    let featuredCandidates = [];
    let featuredVisibleSlots = [null, null, null, null]; // 4 slots visibles
    let featuredRotationTimer = null;
    let isFeaturedPaused = false;
    let nextCandidateIndex = 0;
    let lastRotationSlot = 0;
    let currentCaracasDay = "";
    let touchResumeTimeout = null;

    // Clases escalonadas para dar el efecto de póster con alturas y posiciones orgánicas en desktop
    const featuredStaggeredStyles = [
      { heightClass: "h-72 sm:h-80 md:h-[330px]", translateClass: "md:translate-y-0", delay: "0s", duration: "4.2s" },
      { heightClass: "h-72 sm:h-80 md:h-[355px]", translateClass: "md:-translate-y-2.5", delay: "0.8s", duration: "4.8s" },
      { heightClass: "h-72 sm:h-80 md:h-[345px]", translateClass: "md:translate-y-2", delay: "1.6s", duration: "3.9s" },
      { heightClass: "h-72 sm:h-80 md:h-[330px]", translateClass: "md:-translate-y-1", delay: "2.4s", duration: "4.5s" }
    ];

    // 1. Obtener la fecha de hoy en la zona horaria America/Caracas (YYYY-MM-DD)
    function getCaracasTodayStr() {
      try {
        const formatter = new Intl.DateTimeFormat("en-CA", {
          timeZone: "America/Caracas",
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        });
        return formatter.format(new Date());
      } catch (e) {
        // Fallback en caso de que el entorno no soporte timeZone
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return \`\${year}-\${month}-\${day}\`;
      }
    }

    // Diferencia en días entre dos fechas ISO YYYY-MM-DD
    function getDaysDiffFromToday(dateIso, todayIso) {
      const d1 = new Date(todayIso + "T00:00:00");
      const d2 = new Date(dateIso + "T00:00:00");
      return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    }

    // Calcular ocupación estimada (o real si existe) para una salida
    function getSalidaOccupancy(trip, salida) {
      // 1. Si la salida tiene ocupados específicos definidos
      if (typeof salida.ocupados === "number") {
        return Math.min(CAPACITY_PER_BUS, Math.max(0, salida.ocupados));
      }
      if (Array.isArray(salida.asientosOcupados)) {
        return salida.asientosOcupados.length;
      }
      // Si se cargaron asientos en state para la salida actual
      if (state && state.selectedSalida && state.selectedSalida.fecha === salida.fecha && Array.isArray(state.asientosOcupados) && state.asientosOcupados.length > 0) {
        return state.asientosOcupados.length;
      }

      // 2. Modelo de datos de ocupación de ejemplo para modo demo
      const todayIso = getCaracasTodayStr();
      const diffDays = getDaysDiffFromToday(salida.fecha, todayIso);

      const demoOccupancyMap = {
        "cayo-muerto_2026-10-03": 31,
        "varadero_2026-10-03": 31,
        "cayo-azul-360_2026-10-04": 26,  // Hoy: 26 ocupados -> 5 disponibles (<=6 últimos cupos, >=50% muy solicitado)
        "cayo-boca-seca_2026-10-04": 28,  // Hoy: 28 ocupados -> 3 disponibles (<=6 últimos cupos, >=50% muy solicitado)
        "cayo-sombrero_2026-10-10": 22,   // 6 días: 22 ocupados (71% muy solicitado)
        "colonia-tovar_2026-10-10": 25,   // 6 días: 25 ocupados -> 6 disponibles (<=6 últimos cupos, >=50%)
        "colonia-tovar_2026-10-11": 18,   // 7 días: 18 ocupados (58% muy solicitado)
        "cayo-sal_2026-10-11": 19,        // 7 días: 19 ocupados (61% muy solicitado)
        "cayo-azul_2026-10-12": 21,       // 8 días feriado: 21 ocupados (67% muy solicitado)
        "isla-larga_2026-10-17": 15,      // 13 días: 15 ocupados (48%)
        "cepe_2026-10-17": 16,            // 13 días: 16 ocupados (51.6% muy solicitado)
        "cayo-muerto_2026-10-18": 14,     // 14 días: 14 ocupados (45%)
        "varadero_2026-10-18": 12         // 14 días: 12 ocupados (38%)
      };

      const key = \`\${trip.id}_\${salida.fecha}\`;
      if (demoOccupancyMap[key] !== undefined) {
        return demoOccupancyMap[key];
      }

      // Regla por cercanía si no está en el mapa
      if (diffDays <= 3) return 26;
      if (diffDays <= 7) return 20;
      if (diffDays <= 14) return 16;
      return 10;
    }

    // Calcular y ordenar todas las salidas candidatas válidas
    function buildFeaturedCandidates() {
      const todayIso = getCaracasTodayStr();
      currentCaracasDay = todayIso;
      const candidates = [];

      VIAJES.forEach(trip => {
        trip.salidas.forEach((salida, sIdx) => {
          // Candidatas: salidas cuya fecha sea hoy o posterior
          // Las salidas que ya pasaron NUNCA se muestran
          if (salida.fecha < todayIso) return;

          const ocupados = getSalidaOccupancy(trip, salida);
          const disponibles = Math.max(0, CAPACITY_PER_BUS - ocupados);

          // Si la salida está totalmente llena (0 cupos), no se muestra en candidatos
          if (disponibles <= 0) return;

          const diffDays = getDaysDiffFromToday(salida.fecha, todayIso);
          const ocupacionPct = (ocupados / CAPACITY_PER_BUS) * 100;
          const esDestacado = Boolean(trip.destacado || salida.destacado);

          candidates.push({
            tripId: trip.id,
            salidaIndex: sIdx,
            trip: trip,
            salida: salida,
            destino: trip.destino,
            fecha: salida.fecha,
            fechaTexto: salida.fechaTexto,
            precio: trip.precio,
            imagenUrl: trip.imagenUrl,
            tipo: trip.tipo,
            ocupados: ocupados,
            disponibles: disponibles,
            ocupacionPct: ocupacionPct,
            diffDays: diffDays,
            esDestacado: esDestacado,
            uniqueKey: \`\${trip.id}_\${salida.fecha}\`
          });
        });
      });

      // Orden de prioridad:
      // 1. Campo opcional destacado: true tiene máxima prioridad (se fuerza siempre dentro de destacados)
      // 2. Próximos 14 días primero (diffDays <= 14)
      // 3. Dentro de ellas, mayor porcentaje de ocupación (si hay datos de asientos)
      // 4. Desempate: fecha más cercana
      candidates.sort((a, b) => {
        if (a.esDestacado && !b.esDestacado) return -1;
        if (!a.esDestacado && b.esDestacado) return 1;

        const aIn14 = a.diffDays <= 14;
        const bIn14 = b.diffDays <= 14;

        if (aIn14 && !bIn14) return -1;
        if (!aIn14 && bIn14) return 1;

        if (typeof a.ocupacionPct === 'number' && typeof b.ocupacionPct === 'number' && a.ocupacionPct !== b.ocupacionPct) {
          return b.ocupacionPct - a.ocupacionPct;
        }

        return a.fecha.localeCompare(b.fecha);
      });

      return candidates;
    }

    // Inicializar los 4 slots garantizando variedad de destinos
    function selectInitialFeaturedSlots(candidates) {
      if (candidates.length === 0) return [null, null, null, null];

      const chosen = [];
      const usedDestinations = new Set();

      // Pase 1: salidas con destacado: true entran primero
      for (const cand of candidates) {
        if (chosen.length >= 4) break;
        if (cand.esDestacado && !usedDestinations.has(cand.destino)) {
          chosen.push(cand);
          usedDestinations.add(cand.destino);
        }
      }

      // Pase 2: seleccionar salidas con destinos únicos restantes
      for (const cand of candidates) {
        if (chosen.length >= 4) break;
        if (!usedDestinations.has(cand.destino)) {
          chosen.push(cand);
          usedDestinations.add(cand.destino);
        }
      }

      // Pase 3: si hay menos de 4 destinos únicos, completar con los mejores candidatos restantes sin duplicar salidas exactas
      if (chosen.length < 4) {
        for (const cand of candidates) {
          if (chosen.length >= 4) break;
          const alreadyIn = chosen.some(c => c.uniqueKey === cand.uniqueKey);
          if (!alreadyIn) {
            chosen.push(cand);
          }
        }
      }

      // Rellenar hasta 4 si aún faltan
      while (chosen.length < 4 && candidates.length > 0) {
        chosen.push(candidates[chosen.length % candidates.length]);
      }

      return chosen;
    }

    // Renderizar las 4 tarjetas póster completas
    function renderFeaturedCards() {
      const container = document.getElementById("featured-cards-container");
      if (!container) return;

      if (!featuredVisibleSlots || featuredVisibleSlots.filter(Boolean).length === 0) {
        container.innerHTML = \`
          <div class="col-span-4 py-8 text-center text-xs text-slate-400">
            No hay salidas disponibles para destacar en este momento.
          </div>
        \`;
        return;
      }

      container.innerHTML = featuredVisibleSlots.map((item, idx) => {
        if (!item) return "";
        const style = featuredStaggeredStyles[idx] || featuredStaggeredStyles[0];
        return \`
          <div id="featured-slot-\${idx}" class="w-[76vw] sm:w-[46vw] md:w-auto shrink-0 snap-center \${style.translateClass} transition-all duration-300">
            \${renderSingleFeaturedCardInnerHtml(item, idx, style)}
          </div>
        \`;
      }).join("");

      lucide.createIcons();
    }

    // Renderizar el HTML interno de una tarjeta individual
    function renderSingleFeaturedCardInnerHtml(item, slotIdx, style) {
      // Etiquetas sobre cada tarjeta:
      // "🔥 Muy solicitado" si la salida tiene el 50% o más de sus asientos ocupados
      // "¡Últimos cupos!" si quedan 6 o menos
      const badges = [];
      if (item.ocupacionPct >= 50) {
        badges.push(\`
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-title font-black text-[9px] md:text-[10px] tracking-wider uppercase shadow-md backdrop-blur-xs">
            <span>🔥 Muy solicitado</span>
          </span>
        \`);
      }
      if (item.disponibles <= 6) {
        badges.push(\`
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600/95 text-white font-title font-black text-[9px] md:text-[10px] tracking-wider uppercase shadow-md backdrop-blur-xs animate-pulse">
            <span>⚡ ¡Últimos \${item.disponibles} cupos!</span>
          </span>
        \`);
      }

      // Conversión de precio a Bolívares si hay tasa BCV
      let bsText = "";
      if (state && state.tasaDisponible && state.tasaBCV > 0) {
        const bsVal = formatVzla(item.precio * state.tasaBCV);
        bsText = \`<span class="text-tour-yellow text-[9px] md:text-[10px] block font-semibold">≈ Bs. \${bsVal}</span>\`;
      }

      // Fecha formateada corta y limpia (Ej. Dom 4 Oct, Sáb 10 Oct)
      const partesFecha = item.fechaTexto.split(" ");
      const fechaCorta = partesFecha.slice(0, 4).join(" ");

      return \`
        <div 
          id="featured-card-slot-\${slotIdx}"
          class="featured-card-item rounded-3xl relative overflow-hidden shadow-md hover:shadow-2xl border border-white/25 transition-all duration-500 flex flex-col justify-between group cursor-pointer \${style.heightClass}"
          style="animation: float \${style.duration} ease-in-out infinite; animation-delay: \${style.delay};"
          onclick="startBooking('\${item.tripId}', \${item.salidaIndex})"
        >
          <!-- Imagen de fondo con zoom suave al hover -->
          <img 
            src="\${encodeURI(item.imagenUrl)}" 
            alt="\${item.destino}" 
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95" 
            loading="lazy"
            onerror="this.style.opacity='0.3';"
          />

          <!-- Capa de oscurecimiento superior e inferior para máxima legibilidad -->
          <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 pointer-events-none"></div>

          <!-- Cabecera de la Tarjeta Póster: Etiquetas y Precio -->
          <div class="relative z-10 p-3.5 flex items-start justify-between gap-2">
            <div class="flex flex-col gap-1 items-start max-w-[70%]">
              <span class="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-[9px] uppercase tracking-wider border border-white/30">
                \${item.tipo}
              </span>
              \${badges.join("")}
            </div>

            <div class="px-2.5 py-1 rounded-2xl bg-tour-blue/95 border border-white/40 text-right backdrop-blur-md shadow-lg shrink-0">
              <span class="text-white font-title font-black text-base md:text-lg tracking-tight leading-none block">\${item.precio} €</span>
              \${bsText}
            </div>
          </div>

          <!-- Pie de la Tarjeta Póster: Destino, Fecha y Botón Reservar ya -->
          <div class="relative z-10 p-3.5 md:p-4 space-y-2">
            <div class="space-y-0.5">
              <h3 class="font-title font-black italic uppercase text-white text-base md:text-lg drop-shadow-md leading-tight group-hover:text-tour-yellow transition-colors line-clamp-1">
                \${item.destino}
              </h3>
              <div class="flex items-center gap-1.5 text-sky-200 text-[11px] font-medium">
                <i data-lucide="calendar" class="w-3 h-3 text-tour-yellow shrink-0"></i>
                <span class="truncate">\${fechaCorta}</span>
              </div>
            </div>

            <!-- Botón Reservar ya (abre asistente con salida ya elegida) -->
            <button 
              type="button" 
              onclick="event.stopPropagation(); startBooking('\${item.tripId}', \${item.salidaIndex});" 
              class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-tour-yellow to-amber-400 hover:from-yellow-400 hover:to-amber-500 text-tour-navy font-title font-black uppercase text-xs tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Reservar ya</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      \`;
    }

    // 2. Rotación: Cada 6 segundos una de las 4 tarjetas se cambia por la siguiente candidata
    function rotateNextFeaturedCard() {
      if (isFeaturedPaused) return;
      if (!featuredCandidates || featuredCandidates.length <= 4) return;

      // Comprobar si cambió el día en Caracas
      const todayIso = getCaracasTodayStr();
      if (todayIso !== currentCaracasDay) {
        initFeaturedTrips();
        if (typeof renderTrips === "function") renderTrips();
        if (typeof renderCalendar === "function") renderCalendar();
        return;
      }

      // No rotar un slot que contiene un viaje forzado como destacado: true si hay otros slots disponibles
      const nonPinnedSlots = [];
      for (let s = 0; s < 4; s++) {
        const slotItem = featuredVisibleSlots[s];
        if (!slotItem || !slotItem.esDestacado) {
          nonPinnedSlots.push(s);
        }
      }

      let targetSlotIdx;
      if (nonPinnedSlots.length > 0) {
        lastRotationSlot = (lastRotationSlot + 1) % nonPinnedSlots.length;
        targetSlotIdx = nonPinnedSlots[lastRotationSlot];
      } else {
        lastRotationSlot = (lastRotationSlot + 1) % 4;
        targetSlotIdx = lastRotationSlot;
      }

      // Obtener destinos actualmente visibles en los otros 3 slots
      const otherVisibleDestinations = new Set();
      featuredVisibleSlots.forEach((slot, idx) => {
        if (idx !== targetSlotIdx && slot) {
          otherVisibleDestinations.add(slot.destino);
        }
      });

      // Encontrar la siguiente candidata válida que:
      // 1. No esté actualmente en ninguno de los otros 3 slots
      // 2. Procure no repetir destino con los otros 3 slots (para garantizar variedad)
      let selectedNext = null;
      const totalCand = featuredCandidates.length;

      // Intento 1: Candidata con destino diferente
      for (let i = 0; i < totalCand; i++) {
        const checkIdx = (nextCandidateIndex + i) % totalCand;
        const candidate = featuredCandidates[checkIdx];

        const alreadyInOtherSlot = featuredVisibleSlots.some((s, idx) => idx !== targetSlotIdx && s && s.uniqueKey === candidate.uniqueKey);
        const isCurrentSlot = featuredVisibleSlots[targetSlotIdx] && featuredVisibleSlots[targetSlotIdx].uniqueKey === candidate.uniqueKey;

        if (!alreadyInOtherSlot && !isCurrentSlot && !otherVisibleDestinations.has(candidate.destino)) {
          selectedNext = candidate;
          nextCandidateIndex = (checkIdx + 1) % totalCand;
          break;
        }
      }

      // Intento 2: Si no hay destino libre diferente, aceptar cualquier candidata no repetida en otros slots
      if (!selectedNext) {
        for (let i = 0; i < totalCand; i++) {
          const checkIdx = (nextCandidateIndex + i) % totalCand;
          const candidate = featuredCandidates[checkIdx];
          const alreadyInOtherSlot = featuredVisibleSlots.some((s, idx) => idx !== targetSlotIdx && s && s.uniqueKey === candidate.uniqueKey);
          const isCurrentSlot = featuredVisibleSlots[targetSlotIdx] && featuredVisibleSlots[targetSlotIdx].uniqueKey === candidate.uniqueKey;

          if (!alreadyInOtherSlot && !isCurrentSlot) {
            selectedNext = candidate;
            nextCandidateIndex = (checkIdx + 1) % totalCand;
            break;
          }
        }
      }

      if (!selectedNext) return;

      // Animar el cambio en la tarjeta elegida (efecto giro 3D / desvanecimiento)
      const cardEl = document.getElementById(\`featured-card-slot-\${targetSlotIdx}\`);
      const slotEl = document.getElementById(\`featured-slot-\${targetSlotIdx}\`);
      if (!cardEl || !slotEl) return;

      // Animación de salida (giro 3D alrededor de Y con desvanecimiento)
      cardEl.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease";
      cardEl.style.transform = "perspective(900px) rotateY(90deg) scale(0.92)";
      cardEl.style.opacity = "0";

      setTimeout(() => {
        featuredVisibleSlots[targetSlotIdx] = selectedNext;
        const style = featuredStaggeredStyles[targetSlotIdx] || featuredStaggeredStyles[0];
        slotEl.innerHTML = renderSingleFeaturedCardInnerHtml(selectedNext, targetSlotIdx, style);

        const newCardEl = document.getElementById(\`featured-card-slot-\${targetSlotIdx}\`);
        if (newCardEl) {
          newCardEl.style.transform = "perspective(900px) rotateY(-90deg) scale(0.92)";
          newCardEl.style.opacity = "0";
          void newCardEl.offsetWidth; // Forzar reflujo del navegador
          newCardEl.style.transition = "transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.45s ease";
          newCardEl.style.transform = "perspective(900px) rotateY(0deg) scale(1)";
          newCardEl.style.opacity = "1";

          setTimeout(() => {
            if (newCardEl) newCardEl.style.transform = "";
          }, 500);
        }
        lucide.createIcons();
      }, 400);
    }

    // Pausar y reanudar rotación al interactuar (cursor o toque)
    window.pauseFeaturedRotation = function() {
      isFeaturedPaused = true;
      if (touchResumeTimeout) clearTimeout(touchResumeTimeout);
      const statusLabel = document.getElementById("featured-status-label");
      if (statusLabel) statusLabel.textContent = "Pausado";
      const statusDot = document.getElementById("featured-status-dot");
      if (statusDot) statusDot.className = "w-2 h-2 rounded-full bg-amber-400";
    };

    window.resumeFeaturedRotation = function() {
      if (touchResumeTimeout) clearTimeout(touchResumeTimeout);
      isFeaturedPaused = false;
      const statusLabel = document.getElementById("featured-status-label");
      if (statusLabel) statusLabel.textContent = "Rotando cada 6s";
      const statusDot = document.getElementById("featured-status-dot");
      if (statusDot) statusDot.className = "w-2 h-2 rounded-full bg-emerald-500 animate-ping";
    };

    window.handleTouchEndFeaturedRotation = function() {
      if (touchResumeTimeout) clearTimeout(touchResumeTimeout);
      touchResumeTimeout = setTimeout(() => {
        resumeFeaturedRotation();
      }, 4000);
    };

    // 3. Programación de actualización: Al cargar, cada hora y a medianoche de Caracas
    function scheduleMidnightCaracasUpdate() {
      try {
        const now = new Date();
        const caracasDateParts = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Caracas",
          hour12: false,
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        }).formatToParts(now);

        const p = {};
        caracasDateParts.forEach(part => { p[part.type] = part.value; });

        let hours = parseInt(p.hour, 10);
        if (hours === 24) hours = 0;
        const minutes = parseInt(p.minute, 10);
        const seconds = parseInt(p.second, 10);

        // Segundos restantes hasta las 00:00:01 del día siguiente en Caracas
        const secondsUntilMidnight = (24 * 3600) - (hours * 3600 + minutes * 60 + seconds) + 1;
        const msUntilMidnight = Math.max(1000, secondsUntilMidnight * 1000);

        setTimeout(() => {
          initFeaturedTrips();
          if (typeof renderTrips === "function") renderTrips();
          if (typeof renderCalendar === "function") renderCalendar();
          scheduleMidnightCaracasUpdate();
        }, msUntilMidnight);
      } catch (err) {
        console.warn("Error calculando medianoche Caracas:", err);
      }
    }

    // Inicializador principal de la sección de destacados
    function initFeaturedTrips() {
      featuredCandidates = buildFeaturedCandidates();
      featuredVisibleSlots = selectInitialFeaturedSlots(featuredCandidates);
      nextCandidateIndex = 4 % Math.max(1, featuredCandidates.length);
      renderFeaturedCards();

      // Iniciar temporizador de rotación de 6 segundos
      if (featuredRotationTimer) clearInterval(featuredRotationTimer);
      if (featuredCandidates.length > 4) {
        featuredRotationTimer = setInterval(rotateNextFeaturedCard, FEATURED_ROTATION_INTERVAL_MS);
      }
    }
`;
