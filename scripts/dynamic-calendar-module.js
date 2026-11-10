/**
 * TOUR AZUL - MÓDULO DE CALENDARIO DINÁMICO NOVIEMBRE
 * Basado fielmente en el diseño del flyer oficial de Instagram (@eltourazul)
 * Elimina la tabla mensual tradicional de 30 días y la reemplaza por un
 * selector de días con salidas reales y tarjetas compactas estilo flyer.
 */

export const dynamicCalendarClientCode = `
    // DÍAS CON SALIDAS DE NOVIEMBRE (CALENDARIO DINÁMICO TOUR AZUL)
    const DIAS_NOVIEMBRE = [
      { id: "todos", label: "🌟 Todos los viajes", badge: "17", desc: "Todos los 17 viajes del mes" },
      { id: "proximos", label: "🟢 Próximos", badge: "13", desc: "Salidas vigentes y disponibles para reservar" },
      { id: "2026-11-14", label: "Sáb 14 N", dayRibbon: "SÁBADO 14", fullText: "Sábado 14 de Noviembre", badge: "2", viajesNombres: "Full Day Choroní y Cayo Muerto" },
      { id: "2026-11-15", label: "Dom 15 N", dayRibbon: "DOMINGO 15", fullText: "Domingo 15 de Noviembre", badge: "2", viajesNombres: "Preferia de La Chinita y Cayo Boca Seca" },
      { id: "2026-11-21", label: "Sáb 21 N", dayRibbon: "SÁBADO 21", fullText: "Sábado 21 de Noviembre", badge: "2", viajesNombres: "Hacienda Santa Teresa y Viaje de Belleza" },
      { id: "2026-11-22", label: "Dom 22 N", dayRibbon: "DOMINGO 22", fullText: "Domingo 22 de Noviembre", badge: "1", viajesNombres: "Colonia Tovar" },
      { id: "2026-11-28", label: "Sáb 28 N", dayRibbon: "SÁBADO 28", fullText: "Sábado 28 de Noviembre", badge: "4", viajesNombres: "Cayo Sal, Adícora + Médanos, Tour Mérida y Choroní Estadía" },
      { id: "2026-11-29", label: "Dom 29 N", dayRibbon: "DOMINGO 29", fullText: "Domingo 29 de Noviembre", badge: "2", viajesNombres: "Isla Larga y Cayo Azul" },
      { id: "pasados", label: "⚪ Pasados (7 y 8)", badge: "4", desc: "Salidas culminadas del 7 y 8 de Noviembre" }
    ];

    function renderDynamicDaysSelector() {
      const container = document.getElementById("dynamic-days-selector");
      if (!container) return;

      container.innerHTML = DIAS_NOVIEMBRE.map(d => {
        const isSelected = state.filtroDia === d.id;
        const btnClass = isSelected
          ? "bg-[#FFCC00] text-[#0B2A6B] font-black shadow-lg ring-2 ring-white scale-105"
          : "bg-white/20 hover:bg-white/35 text-white backdrop-blur-md border border-white/25 font-bold";
        const badgeClass = isSelected
          ? "bg-[#0B2A6B]/20 text-[#0B2A6B]"
          : "bg-white/25 text-white";

        return \`
          <button type="button" onclick="selectDynamicDay('\${d.id}')" class="whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5 \${btnClass}">
            <span>\${d.label}</span>
            <span class="text-[10px] font-black px-1.5 py-0.5 rounded-full \${badgeClass}">\${d.badge}</span>
          </button>
        \`;
      }).join("");

      updateDynamicStatusBar();
      if (window.lucide) lucide.createIcons();
    }
    window.renderDynamicDaysSelector = renderDynamicDaysSelector;

    function updateDynamicStatusBar() {
      const statusDot = document.getElementById("dynamic-status-dot");
      const statusText = document.getElementById("dynamic-status-text");
      if (!statusText) return;

      const currentDay = DIAS_NOVIEMBRE.find(d => d.id === state.filtroDia) || DIAS_NOVIEMBRE[0];

      if (state.filtroDia === "todos") {
        if (statusDot) statusDot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0";
        statusText.innerHTML = \`Mostrando: <strong class="text-tour-blue">Todos los viajes de Noviembre (17 salidas)</strong>\`;
      } else if (state.filtroDia === "proximos") {
        if (statusDot) statusDot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse";
        statusText.innerHTML = \`Mostrando: <strong class="text-emerald-700">Próximos viajes vigentes (13 salidas disponibles para reservar)</strong>\`;
      } else if (state.filtroDia === "pasados") {
        if (statusDot) statusDot.className = "w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0";
        statusText.innerHTML = \`Mostrando: <strong class="text-slate-600">Salidas culminadas (7 y 8 de Noviembre)</strong>\`;
      } else {
        if (statusDot) statusDot.className = "w-2.5 h-2.5 rounded-full bg-[#0B2A6B] shrink-0 animate-pulse";
        statusText.innerHTML = \`Mostrando salidas de: <strong class="text-[#0B2A6B]">\${currentDay.fullText}</strong> (\${currentDay.viajesNombres || ''})\`;
      }
    }

    window.selectDynamicDay = function(dayId) {
      state.filtroDia = dayId;
      state.filtroFecha = (dayId && dayId.startsWith("2026-")) ? dayId : null;
      renderDynamicDaysSelector();
      renderTrips();

      // Scroll suave hacia los viajes
      setTimeout(() => {
        const grid = document.getElementById("trips-grid");
        if (grid) {
          const y = grid.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        }
      }, 50);
    };

    function getFechaHumanaCorta(iso) {
      if (!iso) return "";
      const parts = iso.split("-");
      const d = parseInt(parts[2], 10);
      const m = parseInt(parts[1], 10);
      const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
      const mes = meses[m - 1] || "noviembre";
      return \`\${d} de \${mes}\`;
    }

    // Render de viajes con el diseño fiel al Flyer oficial de Noviembre
    function renderTrips() {
      const todayIso = (typeof getCaracasTodayStr === 'function') ? getCaracasTodayStr() : new Date().toISOString().split('T')[0];
      const container = document.getElementById("trips-grid");
      if (!container) return;

      let filtered = VIAJES;

      // Filtro por destino si aplica
      if (state.filtroDestino && state.filtroDestino !== "todos") {
        filtered = filtered.filter(v => v.destino === state.filtroDestino);
      }

      // Filtro dinámico de días de Noviembre
      if (state.filtroDia === "proximos") {
        filtered = filtered.filter(v => v.salidas.some(s => s.fecha >= todayIso));
      } else if (state.filtroDia === "pasados") {
        filtered = filtered.filter(v => v.salidas.every(s => s.fecha < todayIso));
      } else if (state.filtroDia && state.filtroDia !== "todos") {
        filtered = filtered.filter(v => v.salidas.some(s => s.fecha === state.filtroDia));
      }

      // Ordenar: primero los próximos a salir
      filtered = [...filtered].sort((a, b) => {
        const aUpcoming = a.salidas.some(s => s.fecha >= todayIso);
        const bUpcoming = b.salidas.some(s => s.fecha >= todayIso);
        if (aUpcoming && !bUpcoming) return -1;
        if (!aUpcoming && bUpcoming) return 1;
        return 0;
      });

      if (filtered.length === 0) {
        container.innerHTML = \`
          <div class="col-span-full py-12 px-4 text-center space-y-4 max-w-md mx-auto bg-white rounded-3xl border border-sky-100 p-6 shadow-sm">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <i data-lucide="calendar-x" class="w-7 h-7"></i>
            </div>
            <div class="space-y-1">
              <h3 class="font-title font-bold text-lg text-tour-navy">No hay viajes para este filtro</h3>
              <p class="text-xs text-slate-500">Puedes consultar la cartelera completa de Noviembre.</p>
            </div>
            <button type="button" onclick="selectDynamicDay('todos')" class="px-5 py-2.5 rounded-xl bg-tour-blue text-white text-xs font-bold transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer shadow-md hover:bg-blue-700">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
              <span>Ver todos los viajes de Noviembre</span>
            </button>
          </div>
        \`;
        if (window.lucide) lucide.createIcons();
        return;
      }

      container.innerHTML = filtered.map(trip => {
        const upcomingSalidas = trip.salidas.filter(s => s.fecha >= todayIso);
        const isPastTrip = (upcomingSalidas.length === 0);
        const primarySalida = !isPastTrip ? upcomingSalidas[0] : trip.salidas[trip.salidas.length - 1];

        // Texto del listón amarillo inferior (ej: "SÁBADO 14", "DOMINGO 15")
        let dayRibbonText = primarySalida.fechaTexto.toUpperCase();
        if (primarySalida.fecha === "2026-11-07") dayRibbonText = "SÁBADO 7";
        else if (primarySalida.fecha === "2026-11-08") dayRibbonText = "DOMINGO 8";
        else if (primarySalida.fecha === "2026-11-14") dayRibbonText = "SÁBADO 14";
        else if (primarySalida.fecha === "2026-11-15") dayRibbonText = "DOMINGO 15";
        else if (primarySalida.fecha === "2026-11-21") {
          dayRibbonText = trip.salidas.length > 1 ? "SÁB 21 Y DOM 22" : "SÁBADO 21";
        }
        else if (primarySalida.fecha === "2026-11-22") dayRibbonText = "DOMINGO 22";
        else if (primarySalida.fecha === "2026-11-28") {
          dayRibbonText = (trip.tipo && trip.tipo.includes("2 Días")) ? "SÁB 28 AL 29" : "SÁBADO 28";
        }
        else if (primarySalida.fecha === "2026-11-29") dayRibbonText = "DOMINGO 29";

        // Precio aproximado en Bolívares
        let bsPriceHtml = "";
        if (state.tasaDisponible && state.tasaBCV > 0) {
          const bsValue = formatVzla(trip.precio * state.tasaBCV);
          bsPriceHtml = \`<span class="text-amber-300 text-[10px] font-semibold block leading-tight">≈ Bs. \${bsValue}</span>\`;
        }

        const cardStateClass = isPastTrip
          ? "opacity-60 grayscale-[35%] bg-slate-100"
          : "bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300";

        return \`
          <div onclick="openDetallesModal('\${trip.id}')" role="button" tabindex="0" class="group rounded-2xl md:rounded-3xl border-2 border-sky-100/90 shadow-sm flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all duration-300 \${cardStateClass}" title="Toca para ver información y reservar \${trip.destino}">
            
            <!-- CAP SUPERIOR AZUL REY: REF {PRECIO} -->
            <div class="bg-[#0B2A6B] text-white py-2 px-2 text-center rounded-t-2xl shadow-xs group-hover:bg-[#071D49] transition">
              <span class="font-title font-black text-base sm:text-lg md:text-xl tracking-tight leading-none text-white block drop-shadow-xs">
                REF \${trip.precio}
              </span>
              \${bsPriceHtml}
            </div>

            <!-- FOTO COMPACTA CON MARCO BLANCO (ESTILO POSTAL FLYER) -->
            <div class="p-2 sm:p-2.5 pb-1 bg-white">
              <div class="relative w-full h-28 sm:h-32 md:h-36 rounded-xl overflow-hidden bg-sky-900 shadow-inner">
                <img src="\${encodeURI(trip.imagenUrl)}" alt="\${trip.destino}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" onerror="this.style.opacity='0.25';" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

                \${trip.etiquetaEspecial && !isPastTrip ? \`
                  <span class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[9px] uppercase shadow-sm tracking-wide">
                    \${trip.etiquetaEspecial}
                  </span>
                \` : ''}

                \${isPastTrip ? \`
                  <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center">
                    <span class="px-2.5 py-1 rounded-full bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider shadow">
                      Culminado
                    </span>
                  </div>
                \` : ''}
              </div>
            </div>

            <!-- NOMBRE DEL DESTINO EN AZUL MARINO EN NEGRITA -->
            <div class="px-2 py-1 text-center bg-white flex-grow flex flex-col justify-center">
              <h3 class="font-title font-black text-xs sm:text-sm md:text-base uppercase text-[#0B2A6B] leading-tight line-clamp-1 group-hover:text-tour-blue transition">
                \${trip.destino}
              </h3>
              <p class="text-[9.5px] sm:text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                \${trip.tipo || 'Full Day'} · Salidas fijas
              </p>
            </div>

            <!-- LISTÓN INFERIOR AMARILLO: DÍA DEL VIAJE -->
            <div class="p-2 pt-0 bg-white rounded-b-2xl">
              <div class="bg-[#FFCC00] text-[#0B2A6B] font-title font-black uppercase text-[10px] sm:text-xs py-1.5 px-2 rounded-xl text-center shadow-2xs group-hover:bg-amber-400 group-hover:shadow-sm transition flex items-center justify-center gap-1">
                <span>\${dayRibbonText}</span>
              </div>
            </div>

          </div>
        \`;
      }).join("");

      if (window.lucide) lucide.createIcons();
    }
    window.renderTrips = renderTrips;

    window.resetFilters = function() {
      state.filtroDestino = "todos";
      state.filtroDia = "todos";
      state.filtroFecha = null;
      renderDestinationFilters();
      renderDynamicDaysSelector();
      renderTrips();
    };

    window.openDetallesModal = function(tripId) {
      const trip = VIAJES.find(t => t.id === tripId);
      if (!trip) return;

      const imgEl = document.getElementById("modal-det-img");
      if (imgEl) imgEl.src = encodeURI(trip.imagenUrl);

      document.getElementById("modal-det-tipo").textContent = trip.tipo;
      document.getElementById("modal-det-title").textContent = trip.destino;
      document.getElementById("modal-det-fechas").textContent = trip.salidas.map(s => s.fechaTexto).join(" · ");
      document.getElementById("modal-det-precio-eur").textContent = \`REF \${trip.precio}\`;
      
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
        incluyeContainer.innerHTML = \`<p class="italic text-slate-400">Transporte ejecutivo ida y vuelta con aire acondicionado, traslados correspondientes, guías animadores y dinámicas a bordo.</p>\`;
      }

      const detWaBtn = document.getElementById("modal-det-btn-whatsapp");
      if (detWaBtn) {
        const msg = \`¡Hola Tour Azul! Tengo una consulta sobre el viaje a \${trip.destino} (\${trip.salidas[0].fechaTexto}): \`;
        detWaBtn.href = \`https://wa.me/\${WHATSAPP_NUMERO}?text=\${encodeURIComponent(msg)}\`;
      }

      const todayIso = (typeof getCaracasTodayStr === 'function') ? getCaracasTodayStr() : new Date().toISOString().split('T')[0];
      const upcomingSalidas = trip.salidas.filter(s => s.fecha >= todayIso);
      const isPastTrip = (upcomingSalidas.length === 0);
      const upcomingIdx = trip.salidas.findIndex(s => s.fecha >= todayIso);

      const btnReservar = document.getElementById("modal-det-btn-reservar");
      if (btnReservar) {
        if (isPastTrip) {
          btnReservar.disabled = true;
          btnReservar.className = "w-full py-3.5 rounded-2xl bg-slate-200 text-slate-500 font-title font-black uppercase text-sm tracking-wider cursor-not-allowed flex items-center justify-center gap-2";
          btnReservar.innerHTML = '<span>Esta salida ya culminó</span><i data-lucide="calendar-off" class="w-4 h-4"></i>';
        } else {
          btnReservar.disabled = false;
          btnReservar.className = "w-full py-3.5 rounded-2xl bg-tour-blue hover:bg-blue-700 text-white font-title font-black uppercase text-sm tracking-wider shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer";
          btnReservar.innerHTML = '<span>Reservar este viaje (Abono 5 REF por persona)</span><i data-lucide="arrow-right" class="w-4 h-4"></i>';
          btnReservar.onclick = () => {
            closeDetallesModal();
            startBooking(trip.id, upcomingIdx !== -1 ? upcomingIdx : 0);
          };
        }
      }

      document.getElementById("modal-detalles").classList.remove("hidden");
      document.getElementById("modal-detalles").classList.add("flex");
      if (window.lucide) lucide.createIcons();
    };

    function closeDetallesModal() {
      document.getElementById("modal-detalles").classList.add("hidden");
      document.getElementById("modal-detalles").classList.remove("flex");
    }
    window.closeDetallesModal = closeDetallesModal;
`;
