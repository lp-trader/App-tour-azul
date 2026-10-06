export const rateClientCode = `
    // CONFIGURACIÓN TASA DE CAMBIO
    const TASA_MANUAL = 0; // Si es mayor que 0, tiene prioridad sobre todo
    const TASA_DEMO = 45.80; // tasa de prueba para el modo demo (solo si fallan las APIs)
    const CACHE_KEY_TASA = "tour_azul_tasa_bcv_v2";

    function formatVzla(val) {
      if (val === null || val === undefined || isNaN(val)) return "0,00";
      const num = Number(val);
      const parts = num.toFixed(2).split(".");
      parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ".");
      return parts.join(",");
    }

    function formatDateDisplay(dInput) {
      if (!dInput) return "Hoy";
      try {
        const d = new Date(dInput);
        if (isNaN(d.getTime())) return String(dInput);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return \`\${day}/\${month}/\${year}\`;
      } catch (e) {
        return String(dInput);
      }
    }

    function checkIsOlderThan3Days(dInput) {
      if (!dInput) return false;
      try {
        const d = new Date(dInput);
        if (isNaN(d.getTime())) return false;
        const diffMs = Date.now() - d.getTime();
        return diffMs > (3 * 24 * 60 * 60 * 1000);
      } catch (e) {
        return false;
      }
    }

    // CARGAR TASA DESDE CACHÉ LOCAL
    function loadCachedRate() {
      try {
        const raw = localStorage.getItem(CACHE_KEY_TASA);
        if (!raw) return null;
        const cached = JSON.parse(raw);
        if (cached && typeof cached.tasa === "number" && cached.tasa > 0) {
          return cached;
        }
      } catch (e) {
        console.warn("Error leyendo cache de tasa:", e);
      }
      return null;
    }

    // GUARDAR TASA EN CACHÉ LOCAL
    function saveRateCache(tasa, fecha) {
      try {
        localStorage.setItem(CACHE_KEY_TASA, JSON.stringify({
          tasa: tasa,
          fecha: fecha,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.warn("Error guardando cache de tasa:", e);
      }
    }

    // OBTENER TASA OFICIAL DEL EURO (BCV)
    async function fetchBcvRate() {
      // 1. Tasa manual de emergencia local (Prioridad absoluta)
      if (typeof TASA_MANUAL === "number" && TASA_MANUAL > 0) {
        applyRate(TASA_MANUAL, "Manual de emergencia", "manual");
        return;
      }

      // 2. Si hay WEBHOOK_URL, consultar hoja Config por si hay tasa manual remota
      if (WEBHOOK_URL) {
        try {
          const resHook = await fetch(\`\${WEBHOOK_URL}?accion=tasa\`);
          const dataHook = await resHook.json();
          if (dataHook.manual && Number(dataHook.manual) > 0) {
            applyRate(Number(dataHook.manual), dataHook.fecha || "Manual Config", "manual");
            return;
          }
          if (dataHook.tasa && Number(dataHook.tasa) > 0) {
            applyRate(Number(dataHook.tasa), dataHook.fecha || "Google Sheets", "webhook");
            saveRateCache(Number(dataHook.tasa), dataHook.fecha);
            return;
          }
        } catch (e) {
          console.warn("Webhook tasa error, procediendo a APIs oficiales:", e);
        }
      }

      // 3. API Primaria: https://ve.dolarapi.com/v1/euros/oficial
      try {
        const res1 = await fetch("https://ve.dolarapi.com/v1/euros/oficial", { cache: "no-store" });
        if (res1.ok) {
          const d1 = await res1.json();
          let rateVal = Number(d1.promedio);
          if (isNaN(rateVal) || rateVal <= 0) rateVal = Number(d1.venta);
          if (isNaN(rateVal) || rateVal <= 0) rateVal = Number(d1.compra);

          if (!isNaN(rateVal) && rateVal > 0) {
            const fechaStr = d1.fechaActualizacion || new Date().toISOString();
            applyRate(rateVal, fechaStr, "dolarapi");
            saveRateCache(rateVal, fechaStr);
            return;
          }
        }
      } catch (err1) {
        console.warn("Fallo dolarapi.com, intentando respaldo 1:", err1);
      }

      // 4. Respaldo 1: https://bcv.today/api/v1/rate.json
      try {
        const res2 = await fetch("https://bcv.today/api/v1/rate.json", { cache: "no-store" });
        if (res2.ok) {
          const d2 = await res2.json();
          const rateVal2 = Number(d2.EUR);
          if (!isNaN(rateVal2) && rateVal2 > 0) {
            const fechaStr2 = d2.effective_date || new Date().toISOString();
            applyRate(rateVal2, fechaStr2, "bcvtoday");
            saveRateCache(rateVal2, fechaStr2);
            return;
          }
        }
      } catch (err2) {
        console.warn("Fallo bcv.today:", err2);
      }

      // 5. Si ambas fallaron: usar la Caché de localStorage
      const cached = loadCachedRate();
      if (cached) {
        applyRate(cached.tasa, cached.fecha, "cache");
        return;
      }

      // 6. Modo Demo fallback: si está en modo demo y no hay internet/APIs
      if (!WEBHOOK_URL && typeof TASA_DEMO === "number" && TASA_DEMO > 0) {
        applyRate(TASA_DEMO, "Demo", "demo");
        return;
      }

      // 7. Si no hay NINGUNA tasa disponible
      handleNoRateAvailable();
    }

    // APLICAR TASA EN LA INTERFAZ
    function applyRate(tasa, fechaRaw, fuente) {
      state.tasaBCV = tasa;
      state.fechaTasa = fechaRaw;
      state.tasaDisponible = true;
      state.fuenteTasa = fuente;

      const pillContainer = document.getElementById("bcv-pill-container");
      const formattedRate = formatVzla(tasa);
      const fechaFormateada = formatDateDisplay(fechaRaw);
      const esAntigua = checkIsOlderThan3Days(fechaRaw);

      let avisoFecha = \`Actualizado \${fechaFormateada}\`;
      if (fuente === "cache") {
        avisoFecha = \`Última tasa guardada: \${fechaFormateada}\`;
      } else if (esAntigua) {
        avisoFecha = \`Tasa del \${fechaFormateada}\`;
      }

      pillContainer.innerHTML = \`
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-semibold text-tour-navy shadow-sm transition-all">
          <span class="text-sm">🇻🇪</span>
          <span>Tasa BCV Euro:</span>
          <span class="font-bold text-tour-blue">1 € = Bs. \${formattedRate}</span>
          <span class="text-sky-300 font-normal">·</span>
          <span class="text-slate-500 text-[11px] \${esAntigua ? 'text-amber-700 font-medium' : ''}">\${avisoFecha}</span>
        </div>
      \`;

      // Habilitar Pago Móvil
      const pmRadio = document.querySelector("input[name='paymentMethod'][value='Pago Móvil']");
      const pmLabel = document.getElementById("label-method-pagomovil");
      if (pmRadio) pmRadio.disabled = false;
      if (pmLabel) {
        pmLabel.classList.remove("opacity-50", "cursor-not-allowed");
        const warn = document.getElementById("pm-disabled-warning");
        if (warn) warn.remove();
      }

      renderTrips();
      if (typeof renderFeaturedCards === "function") renderFeaturedCards();
      if (currentStep === 4) renderStep4();
      if (currentStep === 5) renderStep5();
    }

    // MANEJAR CASO SIN TASA DISPONIBLE
    function handleNoRateAvailable() {
      state.tasaBCV = 0;
      state.tasaDisponible = false;

      const pillContainer = document.getElementById("bcv-pill-container");
      pillContainer.innerHTML = \`
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 shadow-sm">
          <span class="text-sm">🇻🇪</span>
          <span>Tasa BCV Euro: No disponible, consulta por WhatsApp</span>
        </div>
      \`;

      // Deshabilitar Pago Móvil, forzar Efectivo
      const pmRadio = document.querySelector("input[name='paymentMethod'][value='Pago Móvil']");
      const pmLabel = document.getElementById("label-method-pagomovil");
      if (pmRadio) {
        pmRadio.disabled = true;
        pmRadio.checked = false;
      }
      if (pmLabel) {
        pmLabel.classList.add("opacity-50", "cursor-not-allowed");
        if (!document.getElementById("pm-disabled-warning")) {
          const w = document.createElement("span");
          w.id = "pm-disabled-warning";
          w.className = "text-[10px] text-rose-600 block mt-1";
          w.textContent = "Pago Móvil no disponible sin tasa BCV";
          pmLabel.appendChild(w);
        }
      }

      // Seleccionar Efectivo
      const efRadio = document.querySelector("input[name='paymentMethod'][value='Efectivo']");
      if (efRadio) {
        efRadio.checked = true;
        state.metodoPago = "Efectivo";
        const boxPm = document.getElementById("method-box-pagomovil");
        const boxEf = document.getElementById("method-box-efectivo");
        const lblEf = document.getElementById("label-method-efectivo");
        if (boxPm) boxPm.classList.add("hidden");
        if (boxEf) boxEf.classList.remove("hidden");
        if (lblEf) lblEf.className = "relative flex flex-col p-3.5 border-2 rounded-2xl cursor-pointer transition border-emerald-500 bg-emerald-50/50";
      }

      renderTrips();
    }
`;
