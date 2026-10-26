/**
 * ============================================================================
 * TOUR AZUL - BACKEND GOOGLE APPS SCRIPT (Code.gs)
 * ============================================================================
 * 
 * Este script gestiona el inventario de asientos en tiempo real, bloqueo temporal,
 * registro de reservas en Google Sheets, tasa oficial del BCV (Euro) y autobuses.
 * 
 * INSTRUCCIONES DE DESPLIEGUE COMO APLICACIÓN WEB:
 * 1. Crea una nueva hoja de cálculo en Google Sheets (ej: "Tour Azul - Reservas").
 * 2. Ve al menú superior: Extensiones > Apps Script.
 * 3. Borra cualquier código que aparezca y pega TODO este archivo (Code.gs).
 * 4. Haz clic en el icono de disco "Guardar".
 * 5. Haz clic en el botón azul superior "Implementar" > "Nueva implementación".
 * 6. Selecciona tipo: "Aplicación web".
 * 7. Configuración exacta:
 *    - Descripción: "Tour Azul Webhook v1"
 *    - Ejecutar como: "Yo" (tu cuenta de Google)
 *    - Quién tiene acceso: "Cualquier usuario" (Anyone - incluso anónimo)
 * 8. Haz clic en "Implementar" y autoriza los permisos requeridos.
 * 9. Copia la "URL de la aplicación web" resultante (termina en /exec) y pégala
 *    en la constante WEBHOOK_URL en el archivo HTML de tu web.
 * ============================================================================
 */

// CONFIGURACIÓN GLOBAL
const TOTAL_ASIENTOS_BUS = 31;
const MINUTOS_EXPIRACION_BLOQUEO = 10;
const TASA_POR_DEFECTO = 45.80; // Tasa de respaldo si falla el scraping del BCV

/**
 * Peticiones GET del cliente web
 * Acciones soportadas:
 * - accion=tasa: Retorna { tasa: number, fecha: string }
 * - accion=asientos: Retorna { ok: true, ocupados: [...], bloqueados: [...] }
 * - accion=buses: Retorna { ok: true, buses: [{ bus: "Bus 1", ocupados: X, libres: Y, estado: "Abierto" }] }
 */
function doGet(e) {
  try {
    const params = e ? e.parameter : {};
    const accion = params.accion || "";
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Asegurar estructura de las hojas requeridas
    inicializarHojasSiNoExisten(ss);

    // 1. OBTENER CANDIDATOS / POSTULACIONES (Para el panel de administración)
    // Soportado explícitamente con accion=candidatos o accion=postulaciones, o por defecto si no se indica accion
    if (accion === "candidatos" || accion === "postulaciones" || accion === "") {
      const candidatos = obtenerCandidatosPostulaciones(ss);
      return jsonResponse({
        status: "success",
        ok: true,
        data: candidatos,
        postulaciones: candidatos,
        total: candidatos.length
      });
    }

    // 2. OBTENER TASA BCV
    if (accion === "tasa") {
      const dataTasa = obtenerOGenerarTasaBCV(ss);
      return jsonResponse({ ok: true, tasa: dataTasa.tasa, fecha: dataTasa.fecha });
    }

    // 3. OBTENER ASIENTOS OCUPADOS Y BLOQUEADOS
    if (accion === "asientos") {
      const destino = params.destino || "";
      const destinoHoja = params.destinoHoja || "";
      const fecha = params.fecha || params.fechaViaje || "";
      const bus = params.bus || "Bus 1";

      const resultado = obtenerEstadoAsientos(ss, destino, fecha, bus, false, destinoHoja);
      return jsonResponse({
        status: "success",
        ok: true,
        destino: destino,
        fecha: fecha,
        bus: bus,
        asientos: resultado.ocupados.map(String),
        ocupados: resultado.ocupados,
        bloqueados: resultado.bloqueados
      });
    }

    // 4. OBTENER BUSES ABIERTOS PARA UN DESTINO Y FECHA
    if (accion === "buses") {
      const destino = params.destino || "";
      const fecha = params.fecha || "";
      const buses = obtenerBusesAbiertos(ss, destino, fecha);
      return jsonResponse({ ok: true, buses: buses });
    }

    // 5. OBTENER COMENTARIOS APROBADOS
    if (accion === "comentarios") {
      const comentarios = obtenerComentariosAprobados(ss);
      return jsonResponse({ ok: true, comentarios: comentarios });
    }

    return jsonResponse({ ok: false, error: "Accion no reconocida" });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

/**
 * Peticiones POST del cliente web
 * Acciones soportadas:
 * - accion=bloquear: Bloquea asientos temporalmente por 10 minutos
 * - accion=reservar: Registra la reserva definitiva con LockService anti-colisión
 */
function doPost(e) {
  // LockService garantiza que dos clientes no compren el mismo asiento al mismo milisegundo
  const lock = LockService.getScriptLock();
  
  try {
    // Esperar hasta 10 segundos para adquirir el candado
    const acquired = lock.tryLock(10000);
    if (!acquired) {
      return jsonResponse({ ok: false, error: "Servidor ocupado. Intenta de nuevo en unos segundos." });
    }

    const contents = e.postData ? e.postData.contents : "{}";
    const data = JSON.parse(contents);
    const accion = data.accion || "reservar";
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Asegurar estructura de las hojas requeridas
    inicializarHojasSiNoExisten(ss);

    // 0. CONSULTAR ASIENTOS OCUPADOS
    if (accion === "asientos") {
      const destino = data.destino || "";
      const destinoHoja = data.destinoHoja || "";
      const fecha = data.fecha || data.fechaViaje || "";
      const bus = data.bus || "Bus 1";

      const resultado = obtenerEstadoAsientos(ss, destino, fecha, bus, false, destinoHoja);
      return jsonResponse({
        status: "success",
        ok: true,
        destino: destino,
        fecha: fecha,
        bus: bus,
        asientos: resultado.ocupados.map(String),
        ocupados: resultado.ocupados,
        bloqueados: resultado.bloqueados
      });
    }

    // 1. BLOQUEAR ASIENTOS TEMPORALMENTE
    if (accion === "bloquear") {
      const destino = data.destino;
      const fecha = data.fechaViaje;
      const bus = data.bus || "Bus 1";
      const asientos = data.asientos || [];

      // Verificar si alguno ya está ocupado
      const estadoActual = obtenerEstadoAsientos(ss, destino, fecha, bus);
      const conflictivos = asientos.filter(a => estadoActual.ocupados.includes(a));
      
      if (conflictivos.length > 0) {
        return jsonResponse({ ok: false, error: "asiento_ocupado", asientos: conflictivos });
      }

      registrarBloqueoTemporal(ss, destino, fecha, bus, asientos);
      return jsonResponse({ ok: true, mensaje: "Asientos bloqueados temporalmente" });
    }

    // 2. RESERVAR DEFINITIVAMENTE
    if (accion === "reservar") {
      const destino = data.destino;
      const fecha = data.fechaViaje;
      const bus = data.bus || "Bus 1";
      const asientos = data.asientos || [];

      // Validar disponibilidad una vez más con el Lock activo
      const estadoActual = obtenerEstadoAsientos(ss, destino, fecha, bus, true /* ignorar bloqueos propios */);
      const ocupadosConflictivos = asientos.filter(a => estadoActual.ocupados.includes(a));
      
      if (ocupadosConflictivos.length > 0) {
        return jsonResponse({ ok: false, error: "asiento_ocupado", asientos: ocupadosConflictivos });
      }

      // Generar ID único de Reserva: TA-AAAAMMDD-XXX
      const fechaSanitizada = (fecha || "20261001").replace(/[^0-9]/g, "");
      const sheetReservas = ss.getSheetByName("Reservas");
      const numFila = sheetReservas.getLastRow() + 1;
      const idReserva = data.idReserva || `TA-${fechaSanitizada}-${pad(numFila, 3)}`;

      // Guardar en hoja "Reservas" (una fila por cada pasajero)
      guardarReservaEnHoja(ss, idReserva, data);

      // Eliminar bloqueos temporales de estos asientos
      liberarBloqueosAsientos(ss, destino, fecha, bus, asientos);

      // Actualizar hoja "Resumen"
      actualizarHojaResumen(ss);

      return jsonResponse({
        ok: true,
        idReserva: idReserva,
        destino: destino,
        fecha: fecha,
        bus: bus,
        asientos: asientos,
        mensaje: "Reserva confirmada con éxito"
      });
    }

    // 3. REGISTRAR POSTULACIÓN DE CANDIDATO EN HOJA "Tour Azul Postulaciones"
    if (accion === "postulacion" || accion === "candidato" || accion === "guardar_postulacion") {
      return jsonResponse(guardarPostulacionEnHoja(ss, data));
    }

    // 4. OBTENER CANDIDATOS VÍA POST (Alternativa para clientes sin GET directo)
    if (accion === "candidatos" || accion === "obtener_candidatos" || accion === "postulaciones") {
      const candidatos = obtenerCandidatosPostulaciones(ss);
      return jsonResponse({
        status: "success",
        ok: true,
        data: candidatos,
        postulaciones: candidatos,
        total: candidatos.length
      });
    }

    // 5. REGISTRAR COMENTARIO Y OPINIÓN
    if (accion === "comentario") {
      return jsonResponse(registrarComentario(ss, data));
    }

    // 6. VERIFICAR ADMIN DEL SORTEO
    if (accion === "sorteo_verificar_admin") {
      return jsonResponse(verificarAdminSorteo(ss, data.clave));
    }

    // 7. ELEGIR GANADOR DEL SORTEO
    if (accion === "sorteo_ganador") {
      return jsonResponse(elegirGanadorSorteo(ss, data));
    }

    return jsonResponse({ ok: false, error: "Accion POST no reconocida" });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  } finally {
    // Liberar siempre el candado
    lock.releaseLock();
  }
}

/**
 * Guarda las filas de la reserva en la hoja "Reservas".
 * IMPORTANTE: Inserta una fila por cada pasajero según el contrato exacto de columnas:
 * 1. ID Reserva
 * 2. Fecha Registro
 * 3. Nombre Completo
 * 4. Cédula
 * 5. Edad
 * 6. Teléfono
 * 7. Punto de Recogida
 * 8. Acompañantes
 * 9. Asientos
 * 10. Bus
 * 11. Total Personas
 * 12. Tipo Pago
 * 13. Monto Abonado (€)
 * 14. Saldo Pendiente (€)
 * 15. Referencia Pago Móvil
 * 16. Destino
 * 17. Fecha del Viaje
 * 18. Tasa BCV Euro
 * 19. Monto Pagado (Bs)
 * 20. Monto Pagado (USD)
 * 21. Estado de Pago
 */
function guardarReservaEnHoja(ss, idReserva, data) {
  const sheet = ss.getSheetByName("Reservas");
  const now = new Date();
  const fechaRegistro = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");

  // Soporte bidireccional: datos estructurados u objetos simples (nombreTitular, cedula, telefono, abono, pendiente, acompanantes)
  const titular = data.titular || {
    nombre: data.nombreTitular || data.nombre || "",
    cedula: data.cedula || "",
    telefono: data.telefono || "",
    edad: data.edad || "",
    recogida: data.recogida || data.puntoRecogida || ""
  };
  if (!titular.nombre && data.nombreTitular) titular.nombre = data.nombreTitular;
  if (!titular.cedula && data.cedula) titular.cedula = data.cedula;
  if (!titular.telefono && data.telefono) titular.telefono = data.telefono;

  // Normalizar acompañantes
  const acompanantesRaw = data.acompanantes || [];
  const acompanantes = acompanantesRaw.map(a => typeof a === "string" ? { nombre: a } : a);

  const asientos = Array.isArray(data.asientos) ? data.asientos : [];
  const totalPersonas = data.totalPersonas || (1 + acompanantes.length);
  const tipoPago = data.tipoPago || "Pago Móvil";
  const estadoPago = data.estadoPago || (tipoPago === "Pago Móvil" ? "Pagado" : "Pendiente de pago");
  const tasaBCV = data.tasaBCV || TASA_POR_DEFECTO;
  const abonoEur = data.abono !== undefined ? data.abono : (data.montoAbonadoEur || 0);
  const pendienteEur = data.pendiente !== undefined ? data.pendiente : (data.saldoPendienteEur || 0);

  const nombresAcompString = acompanantes.map(a => a.nombre).join(", ");
  const asientosString = asientos.join(", ");

  // 1. Fila para el Pasajero Titular en hoja "Reservas"
  const filaTitular = [
    idReserva,
    fechaRegistro,
    titular.nombre || "",
    titular.cedula || "",
    titular.edad || "",
    titular.telefono || "",
    titular.recogida || "",
    nombresAcompString,
    asientosString,
    data.bus || "Bus 1",
    totalPersonas,
    tipoPago,
    abonoEur,
    pendienteEur,
    tipoPago === "Pago Móvil" ? (data.referenciaPagoMovil || "") : "",
    data.destino || "",
    data.fechaViaje || "",
    tasaBCV,
    tipoPago === "Pago Móvil" ? (data.montoPagadoBs || 0) : 0,
    tipoPago === "Efectivo" ? (data.montoPagadoUsd || 0) : 0,
    estadoPago
  ];

  sheet.appendRow(filaTitular);
  const startRow = sheet.getLastRow();

  // Filas para cada Acompañante (si los hay)
  acompanantes.forEach((acomp, idx) => {
    const filaAcomp = [
      idReserva,
      fechaRegistro,
      acomp.nombre || "",
      acomp.cedula || "(Sin cédula)",
      acomp.edad || "",
      titular.telefono || "",
      acomp.recogida || titular.recogida || "",
      `Acompañante de ${titular.nombre}`,
      asientos[idx + 1] ? asientos[idx + 1].toString() : "",
      data.bus || "Bus 1",
      totalPersonas,
      tipoPago,
      0, // El monto ya se registró en el titular
      0,
      tipoPago === "Pago Móvil" ? (data.referenciaPagoMovil || "") : "",
      data.destino || "",
      data.fechaViaje || "",
      tasaBCV,
      0,
      0,
      estadoPago
    ];
    sheet.appendRow(filaAcomp);
  });

  const endRow = sheet.getLastRow();

  // Aplicar validación desplegable en columna "Estado de Pago" (Columna 21)
  const rangoEstado = sheet.getRange(startRow, 21, endRow - startRow + 1, 1);
  const reglaDesplegable = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Pagado", "Pendiente de pago"], true)
    .build();
  rangoEstado.setDataValidation(reglaDesplegable);

  // 2. Registrar en Base_General
  guardarEnBaseGeneral(ss, idReserva, fechaRegistro, titular, acompanantes, data, abonoEur, pendienteEur, estadoPago);

  // 3. Registrar en Hoja específica del Destino (ej: "Cayo_Muerto_18-10")
  guardarEnHojaDestino(ss, idReserva, titular, acompanantes, data, abonoEur, pendienteEur, estadoPago);
}

/**
 * Guarda el resumen consolidado en la hoja "Base_General"
 */
function guardarEnBaseGeneral(ss, idReserva, fechaRegistro, titular, acompanantes, data, abono, pendiente, estado) {
  let sheet = ss.getSheetByName("Base_General");
  if (!sheet) {
    sheet = ss.insertSheet("Base_General");
    const h = ["Fecha", "ID Reserva", "Titular", "Cédula", "Teléfono", "Destino", "Fecha Viaje", "Abono (€)", "Pendiente (€)", "Acompañantes", "Bus", "Asientos", "Estado"];
    sheet.appendRow(h);
    sheet.getRange(1, 1, 1, h.length).setFontWeight("bold").setBackground("#0B2A6B").setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  const nombresAcomp = acompanantes.map(a => a.nombre).join(", ");
  const asientosStr = Array.isArray(data.asientos) ? data.asientos.join(", ") : (data.asientos || "");
  sheet.appendRow([
    fechaRegistro,
    idReserva,
    titular.nombre || "",
    titular.cedula || "",
    titular.telefono || "",
    data.destino || "",
    data.fechaViaje || "",
    abono,
    pendiente,
    nombresAcomp,
    data.bus || "Bus 1",
    asientosStr,
    estado
  ]);
}

/**
 * Función auxiliar para verificar coincidencia flexible de destinos
 */
function destinosCoinciden(d1, d2) {
  if (!d1 || !d2) return false;
  if (d1 === d2) return true;
  const s1 = String(d1).toLowerCase().replace(/[^a-z0-9]/g, "");
  const s2 = String(d2).toLowerCase().replace(/[^a-z0-9]/g, "");
  return s1 === s2 || s1.startsWith(s2) || s2.startsWith(s1);
}

/**
 * Guarda los pasajeros en la hoja individual del viaje/destino (ej: "Cayo_Muerto_18-10")
 */
function guardarEnHojaDestino(ss, idReserva, titular, acompanantes, data, abono, pendiente, estado) {
  const nombreHoja = String(data.destinoHoja || data.destino || "").trim();
  if (!nombreHoja) return;
  let sheet = ss.getSheetByName(nombreHoja);
  if (!sheet) {
    sheet = ss.insertSheet(nombreHoja);
    const h = ["ID Reserva", "Pasajero", "Cédula", "Teléfono", "Asiento", "Bus", "Punto Recogida", "Abono (€)", "Pendiente (€)", "Estado"];
    sheet.appendRow(h);
    sheet.getRange(1, 1, 1, h.length).setFontWeight("bold").setBackground("#1F3FE0").setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  const asientos = Array.isArray(data.asientos) ? data.asientos : [];
  // Fila titular
  sheet.appendRow([
    idReserva,
    titular.nombre || "",
    titular.cedula || "",
    titular.telefono || "",
    asientos[0] || "",
    data.bus || "Bus 1",
    titular.recogida || "",
    abono,
    pendiente,
    estado
  ]);
  // Filas acompañantes
  acompanantes.forEach((ac, idx) => {
    sheet.appendRow([
      idReserva,
      ac.nombre || "",
      ac.cedula || "(Acompañante)",
      titular.telefono || "",
      asientos[idx + 1] || "",
      data.bus || "Bus 1",
      ac.recogida || titular.recogida || "",
      0,
      0,
      estado
    ]);
  });
}

/**
 * Obtiene los asientos ocupados (reservados en "Reservas") y bloqueados (en "Bloqueos")
 */
function obtenerEstadoAsientos(ss, destino, fecha, bus, omitirBloqueos = false, destinoHoja = "") {
  inicializarHojasSiNoExisten(ss);

  const ocupadosSet = new Set();
  const bloqueadosSet = new Set();

  // 1. Revisar hoja "Reservas"
  const sheetReservas = ss.getSheetByName("Reservas");
  const dataReservas = sheetReservas.getDataRange().getValues();

  // Cabecera en fila 1:
  // Col 9 (index 8): Asientos
  // Col 10 (index 9): Bus
  // Col 16 (index 15): Destino
  // Col 17 (index 16): Fecha del Viaje
  for (let i = 1; i < dataReservas.length; i++) {
    const row = dataReservas[i];
    const rAsientos = row[8] ? row[8].toString() : "";
    const rBus = row[9] ? row[9].toString() : "Bus 1";
    const rDestino = row[15] ? row[15].toString() : "";
    const rFecha = row[16] ? Utilities.formatDate(new Date(row[16]), Session.getScriptTimeZone(), "yyyy-MM-dd") : "";

    const destCoincide = (rDestino === destino) ||
      (destinoHoja && rDestino === destinoHoja) ||
      destinosCoinciden(rDestino, destino) ||
      (destinoHoja && destinosCoinciden(rDestino, destinoHoja));

    if (destCoincide && rFecha === fecha && rBus === bus) {
      const lista = rAsientos.split(",");
      lista.forEach(numStr => {
        const n = parseInt(numStr.trim(), 10);
        if (!isNaN(n) && n >= 1 && n <= TOTAL_ASIENTOS_BUS) {
          ocupadosSet.add(n);
        }
      });
    }
  }

  // 2. Revisar hoja "Bloqueos" y limpiar los vencidos
  if (!omitirBloqueos) {
    limpiarBloqueosVencidos(ss);
    const sheetBloqueos = ss.getSheetByName("Bloqueos");
    const dataBloqueos = sheetBloqueos.getDataRange().getValues();
    const nowMs = new Date().getTime();

    for (let j = 1; j < dataBloqueos.length; j++) {
      const bRow = dataBloqueos[j];
      const bAsiento = parseInt(bRow[0], 10);
      const bBus = bRow[1] ? bRow[1].toString() : "Bus 1";
      const bDestino = bRow[2] ? bRow[2].toString() : "";
      const bFecha = bRow[3] ? Utilities.formatDate(new Date(bRow[3]), Session.getScriptTimeZone(), "yyyy-MM-dd") : "";
      const bExpira = bRow[4] ? new Date(bRow[4]).getTime() : 0;

      const destCoincideBloq = (bDestino === destino) ||
        (destinoHoja && bDestino === destinoHoja) ||
        destinosCoinciden(bDestino, destino) ||
        (destinoHoja && destinosCoinciden(bDestino, destinoHoja));

      if (destCoincideBloq && bFecha === fecha && bBus === bus && bExpira > nowMs) {
        if (!ocupadosSet.has(bAsiento)) {
          bloqueadosSet.add(bAsiento);
        }
      }
    }
  }

  return {
    ocupados: Array.from(ocupadosSet).sort((a, b) => a - b),
    bloqueados: Array.from(bloqueadosSet).sort((a, b) => a - b)
  };
}

/**
 * Registra bloqueo temporal de asientos en la hoja "Bloqueos"
 */
function registrarBloqueoTemporal(ss, destino, fecha, bus, asientos) {
  const sheet = ss.getSheetByName("Bloqueos");
  const now = new Date();
  const expira = new Date(now.getTime() + MINUTOS_EXPIRACION_BLOQUEO * 60 * 1000);

  asientos.forEach(asiento => {
    sheet.appendRow([asiento, bus, destino, fecha, expira]);
  });
}

/**
 * Limpia filas de bloqueos vencidos de la hoja "Bloqueos"
 */
function limpiarBloqueosVencidos(ss) {
  const sheet = ss.getSheetByName("Bloqueos");
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return;

  const nowMs = new Date().getTime();
  const filasAEliminar = [];

  for (let i = 1; i < data.length; i++) {
    const expira = data[i][4] ? new Date(data[i][4]).getTime() : 0;
    if (expira <= nowMs) {
      filasAEliminar.push(i + 1);
    }
  }

  // Eliminar desde el final hacia el inicio para preservar índices
  for (let k = filasAEliminar.length - 1; k >= 0; k--) {
    sheet.deleteRow(filasAEliminar[k]);
  }
}

/**
 * Libera asientos de la hoja "Bloqueos" cuando se reservan
 */
function liberarBloqueosAsientos(ss, destino, fecha, bus, asientos) {
  const sheet = ss.getSheetByName("Bloqueos");
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return;

  const asientosSet = new Set(asientos.map(a => parseInt(a, 10)));
  const filasAEliminar = [];

  for (let i = 1; i < data.length; i++) {
    const bAsiento = parseInt(data[i][0], 10);
    const bBus = data[i][1] ? data[i][1].toString() : "Bus 1";
    const bDestino = data[i][2] ? data[i][2].toString() : "";
    const bFecha = data[i][3] ? Utilities.formatDate(new Date(data[i][3]), Session.getScriptTimeZone(), "yyyy-MM-dd") : "";

    if (bDestino === destino && bFecha === fecha && bBus === bus && asientosSet.has(bAsiento)) {
      filasAEliminar.push(i + 1);
    }
  }

  for (let k = filasAEliminar.length - 1; k >= 0; k--) {
    sheet.deleteRow(filasAEliminar[k]);
  }
}

/**
 * Obtiene los autobuses abiertos para una salida desde la hoja "Buses".
 * Si no existe una fila para esa salida, crea automáticamente "Bus 1" Abierto.
 */
function obtenerBusesAbiertos(ss, destino, fecha) {
  const sheet = ss.getSheetByName("Buses");
  const data = sheet.getDataRange().getValues();
  const busesEncontrados = [];

  for (let i = 1; i < data.length; i++) {
    const bDestino = data[i][0] ? data[i][0].toString() : "";
    const bFecha = data[i][1] ? Utilities.formatDate(new Date(data[i][1]), Session.getScriptTimeZone(), "yyyy-MM-dd") : "";
    const bNombre = data[i][2] ? data[i][2].toString() : "Bus 1";
    const bEstado = data[i][3] ? data[i][3].toString() : "Abierto";

    if (bDestino === destino && bFecha === fecha) {
      if (bEstado.toLowerCase() === "abierto") {
        const estadoAsientos = obtenerEstadoAsientos(ss, destino, fecha, bNombre);
        const ocupadosCount = estadoAsientos.ocupados.length;
        busesEncontrados.push({
          bus: bNombre,
          ocupados: ocupadosCount,
          libres: Math.max(0, TOTAL_ASIENTOS_BUS - ocupadosCount),
          estado: "Abierto"
        });
      }
    }
  }

  // Si no hay ninguno registrado, auto-crear "Bus 1" Abierto
  if (busesEncontrados.length === 0 && destino && fecha) {
    sheet.appendRow([destino, fecha, "Bus 1", "Abierto"]);
    busesEncontrados.push({
      bus: "Bus 1",
      ocupados: 0,
      libres: TOTAL_ASIENTOS_BUS,
      estado: "Abierto"
    });
  }

  return busesEncontrados;
}

/**
 * Obtiene la tasa BCV del Euro desde la hoja "Config" o la consulta en bcv.org.ve
 */
function obtenerOGenerarTasaBCV(ss) {
  inicializarHojasSiNoExisten(ss);
  const sheetConfig = ss.getSheetByName("Config");
  const data = sheetConfig.getDataRange().getValues();

  // Estructura Hoja Config:
  // Fila 2: Col A = Tasa Guardada, Col B = Fecha Actualizacion, Col C = Tasa Manual (Prioritaria)
  let tasaGuardada = data[1] ? parseFloat(data[1][0]) : 0;
  let fechaGuardada = data[1] ? (data[1][1] ? data[1][1].toString() : "") : "";
  let tasaManual = data[1] ? parseFloat(data[1][2]) : 0;

  // Si el administrador colocó una tasa manual en Col C, esa tiene prioridad absoluta
  if (!isNaN(tasaManual) && tasaManual > 0) {
    return { tasa: tasaManual, fecha: "Manual (Prioritaria)" };
  }

  const hoyStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");

  // Si ya se consultó hoy, retornar la guardada
  if (tasaGuardada > 0 && fechaGuardada.startsWith(hoyStr)) {
    return { tasa: tasaGuardada, fecha: fechaGuardada };
  }

  // Consultar bcv.org.ve vía UrlFetchApp
  try {
    const url = "https://www.bcv.org.ve/";
    const options = {
      muteHttpExceptions: true,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    };
    const response = UrlFetchApp.fetch(url, options);
    const html = response.getContentText();

    // Regex para ubicar el contenedor de la moneda EURO en el BCV
    // Formato típico en el DOM: <div id="euro"> ... <strong> 45,80120000 </strong>
    const matchEuro = html.match(/id=["']euro["'][\s\S]*?<strong>\s*([0-9.,]+)\s*<\/strong>/i);
    
    if (matchEuro && matchEuro[1]) {
      const valorLimpio = matchEuro[1].replace(/\./g, "").replace(",", ".");
      const valorNum = parseFloat(valorLimpio);
      if (!isNaN(valorNum) && valorNum > 0) {
        // Guardar en la hoja Config
        sheetConfig.getRange(2, 1).setValue(valorNum);
        sheetConfig.getRange(2, 2).setValue(hoyStr);
        return { tasa: valorNum, fecha: hoyStr };
      }
    }
  } catch (err) {
    Logger.log("Error al consultar el portal del BCV: " + err);
  }

  // Fallback: Si falló el BCV, usar la última guardada o la constante por defecto
  if (tasaGuardada > 0) {
    return { tasa: tasaGuardada, fecha: `Tasa del ${fechaGuardada}` };
  }

  // Guardar tasa por defecto inicial
  sheetConfig.getRange(2, 1).setValue(TASA_POR_DEFECTO);
  sheetConfig.getRange(2, 2).setValue(hoyStr);
  return { tasa: TASA_POR_DEFECTO, fecha: hoyStr };
}

/**
 * Actualiza la hoja "Resumen" con el inventario consolidado
 */
function actualizarHojaResumen(ss) {
  const sheetResumen = ss.getSheetByName("Resumen");
  const sheetReservas = ss.getSheetByName("Reservas");
  const dataReservas = sheetReservas.getDataRange().getValues();

  // Mapear por clave: Destino|Fecha|Bus
  const conteo = {};
  for (let i = 1; i < dataReservas.length; i++) {
    const row = dataReservas[i];
    const destino = row[15];
    const fecha = row[16] ? Utilities.formatDate(new Date(row[16]), Session.getScriptTimeZone(), "yyyy-MM-dd") : "";
    const bus = row[9] || "Bus 1";
    const asientos = row[8] ? row[8].toString() : "";

    if (destino && fecha) {
      const key = `${destino}|${fecha}|${bus}`;
      if (!conteo[key]) {
        conteo[key] = new Set();
      }
      asientos.split(",").forEach(a => {
        const n = parseInt(a.trim(), 10);
        if (!isNaN(n)) conteo[key].add(n);
      });
    }
  }

  // Limpiar contenido previo de Resumen manteniendo cabeceras
  const lastRow = sheetResumen.getLastRow();
  if (lastRow > 1) {
    sheetResumen.getRange(2, 1, lastRow - 1, 5).clearContent();
  }

  const filasResumen = [];
  for (const k in conteo) {
    const [dest, fec, b] = k.split("|");
    const ocupados = conteo[k].size;
    const libres = Math.max(0, TOTAL_ASIENTOS_BUS - ocupados);
    filasResumen.push([dest, fec, b, `${ocupados} / ${TOTAL_ASIENTOS_BUS}`, libres]);
  }

  if (filasResumen.length > 0) {
    sheetResumen.getRange(2, 1, filasResumen.length, 5).setValues(filasResumen);
  }
}

/**
 * Inicializa automáticamente las hojas y cabeceras si no existen
 */
function inicializarHojasSiNoExisten(ss) {
  // 1. Hoja "Reservas"
  let sReservas = ss.getSheetByName("Reservas");
  if (!sReservas) {
    sReservas = ss.insertSheet("Reservas");
    const headers = [
      "ID Reserva", "Fecha Registro", "Nombre Completo", "Cédula", "Edad",
      "Teléfono", "Punto de Recogida", "Acompañantes", "Asientos", "Bus",
      "Total Personas", "Tipo Pago", "Monto Abonado (€)", "Saldo Pendiente (€)",
      "Referencia Pago Móvil", "Destino", "Fecha del Viaje", "Tasa BCV Euro",
      "Monto Pagado (Bs)", "Monto Pagado (USD)", "Estado de Pago"
    ];
    sReservas.appendRow(headers);
    sReservas.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#0B2A6B").setFontColor("#FFFFFF");
    sReservas.setFrozenRows(1);

    // Formato condicional para columna 21 "Estado de Pago" (Amarillo = Pendiente, Verde = Pagado)
    const ruleYellow = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Pendiente de pago")
      .setBackground("#FEF08A")
      .setFontColor("#854D0E")
      .setRanges([sReservas.getRange("U2:U1000")])
      .build();

    const ruleGreen = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Pagado")
      .setBackground("#BBF7D0")
      .setFontColor("#14532D")
      .setRanges([sReservas.getRange("U2:U1000")])
      .build();

    sReservas.setConditionalFormatRules([ruleYellow, ruleGreen]);
  }

  // 2. Hoja "Buses"
  let sBuses = ss.getSheetByName("Buses");
  if (!sBuses) {
    sBuses = ss.insertSheet("Buses");
    const hBuses = ["Destino", "Fecha", "Bus", "Estado"];
    sBuses.appendRow(hBuses);
    sBuses.getRange(1, 1, 1, hBuses.length).setFontWeight("bold").setBackground("#1F3FE0").setFontColor("#FFFFFF");
    sBuses.setFrozenRows(1);
  }

  // 3. Hoja "Bloqueos"
  let sBloqueos = ss.getSheetByName("Bloqueos");
  if (!sBloqueos) {
    sBloqueos = ss.insertSheet("Bloqueos");
    const hBloq = ["Asiento", "Bus", "Destino", "Fecha", "Expiracion"];
    sBloqueos.appendRow(hBloq);
    sBloqueos.getRange(1, 1, 1, hBloq.length).setFontWeight("bold").setBackground("#334155").setFontColor("#FFFFFF");
    sBloqueos.setFrozenRows(1);
  }

  // 4. Hoja "Config"
  let sConfig = ss.getSheetByName("Config");
  if (!sConfig) {
    sConfig = ss.insertSheet("Config");
    const hConf = ["Tasa BCV Guardada", "Fecha Actualizacion", "Tasa Manual (Prioritaria)"];
    sConfig.appendRow(hConf);
    sConfig.appendRow([TASA_POR_DEFECTO, Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd"), ""]);
    sConfig.getRange(1, 1, 1, hConf.length).setFontWeight("bold").setBackground("#0284C7").setFontColor("#FFFFFF");
  }

  // 5. Hoja "Resumen"
  let sResumen = ss.getSheetByName("Resumen");
  if (!sResumen) {
    sResumen = ss.insertSheet("Resumen");
    const hRes = ["Destino", "Fecha", "Bus", "Asientos Ocupados", "Asientos Libres"];
    sResumen.appendRow(hRes);
    sResumen.getRange(1, 1, 1, hRes.length).setFontWeight("bold").setBackground("#0D9488").setFontColor("#FFFFFF");
    sResumen.setFrozenRows(1);
  }

  // 6. Hoja "Opiniones"
  let sOpiniones = ss.getSheetByName("Opiniones");
  if (!sOpiniones) {
    sOpiniones = ss.insertSheet("Opiniones");
    const hOpin = ["Timestamp", "ID", "Nombre", "Nombre Publico", "Telefono", "Destino", "Fecha Viaje", "Calificacion", "Comentario", "Foto Base64", "Autoriza", "Participa Sorteo", "Estado"];
    sOpiniones.appendRow(hOpin);
    sOpiniones.getRange(1, 1, 1, hOpin.length).setFontWeight("bold").setBackground("#1F3FE0").setFontColor("#FFFFFF");
    sOpiniones.setFrozenRows(1);
  }

  // 7. Hoja "Sorteos"
  let sSorteos = ss.getSheetByName("Sorteos");
  if (!sSorteos) {
    sSorteos = ss.insertSheet("Sorteos");
    const hSort = ["Timestamp", "Mes", "Ganador", "Telefono", "Destino", "Fecha Viaje", "Comentario"];
    sSorteos.appendRow(hSort);
    sSorteos.getRange(1, 1, 1, hSort.length).setFontWeight("bold").setBackground("#B45309").setFontColor("#FFFFFF");
    sSorteos.setFrozenRows(1);
  }

  // 8. Hoja "Tour Azul Postulaciones" (Módulo de Candidatos y Convocatoria)
  let sPostulaciones = getHojaPostulaciones(ss);
  if (!sPostulaciones) {
    sPostulaciones = ss.insertSheet("Tour Azul Postulaciones");
    const hPost = [
      "Código", "Fecha Registro", "Nombre Completo", "Edad", "Teléfono", 
      "Zona", "Experiencia", "Disponibilidad", "Punto de partida", 
      "Motivación", "Talento Curioso", "Foto", "Estado"
    ];
    sPostulaciones.appendRow(hPost);
    sPostulaciones.getRange(1, 1, 1, hPost.length).setFontWeight("bold").setBackground("#0B2A6B").setFontColor("#FFFFFF");
    sPostulaciones.setFrozenRows(1);

    // Formato condicional para columna Estado (Columna 13 / M)
    const ruleRecibida = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Recibida")
      .setBackground("#E0F2FE")
      .setFontColor("#0369A1")
      .setRanges([sPostulaciones.getRange("M2:M1000")])
      .build();

    const ruleContactada = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Contactada")
      .setBackground("#DCFCE7")
      .setFontColor("#15803D")
      .setRanges([sPostulaciones.getRange("M2:M1000")])
      .build();

    const ruleEntrevistada = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Entrevistada")
      .setBackground("#FEF3C7")
      .setFontColor("#B45309")
      .setRanges([sPostulaciones.getRange("M2:M1000")])
      .build();

    const ruleDescartada = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Descartada")
      .setBackground("#FFE4E6")
      .setFontColor("#BE123C")
      .setRanges([sPostulaciones.getRange("M2:M1000")])
      .build();

    sPostulaciones.setConditionalFormatRules([ruleRecibida, ruleContactada, ruleEntrevistada, ruleDescartada]);
  }
}

/**
 * Busca de forma flexible la hoja de postulaciones dentro de la hoja de cálculo "Registro Tour Azul"
 */
function getHojaPostulaciones(ss) {
  // 1. Variantes de nombres comunes
  const variantes = [
    "Tour Azul Postulaciones",
    "Tour Azul - Postulaciones",
    "tour azul postulaciones",
    "Tour azul postulaciones",
    "Postulaciones Tour Azul",
    "Postulaciones",
    "postulaciones",
    "Candidatos",
    "candidatos"
  ];
  for (let i = 0; i < variantes.length; i++) {
    const s = ss.getSheetByName(variantes[i]);
    if (s) return s;
  }
  // 2. Búsqueda insensible a mayúsculas y espacios
  const sheets = ss.getSheets();
  for (let j = 0; j < sheets.length; j++) {
    const name = sheets[j].getName().trim().toLowerCase();
    if (name.includes("postulaci") || name.includes("candidat")) {
      return sheets[j];
    }
  }
  return null;
}

/**
 * Registra una postulación en la hoja "Tour Azul Postulaciones"
 */
function guardarPostulacionEnHoja(ss, data) {
  let sheet = getHojaPostulaciones(ss);
  if (!sheet) {
    sheet = ss.insertSheet("Tour Azul Postulaciones");
  }

  const hDefault = [
    "Código", "Fecha Registro", "Nombre Completo", "Edad", "Teléfono", 
    "Zona", "Experiencia", "Disponibilidad", "Punto de partida", 
    "Motivación", "Talento Curioso", "Foto", "Estado"
  ];

  // Si la hoja está totalmente vacía, insertar cabecera oficial
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(hDefault);
    sheet.getRange(1, 1, 1, hDefault.length).setFontWeight("bold").setBackground("#0B2A6B").setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }

  const now = new Date();
  const fechaRegistro = data.fecha || data.createdAt || Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  const dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyyMMdd");
  const nextNum = Math.max(1, sheet.getLastRow());
  const idPostulacion = data.id || data.codigo || data.Código || `POST-${dateStr}-${pad(nextNum, 3)}`;

  const nombre = data.nombre || data.Nombre || data.nombreCompleto || "Sin nombre";
  const edad = data.edad !== undefined ? data.edad : (data.Edad !== undefined ? data.Edad : "");
  const telefono = data.telefono || data.Teléfono || data.whatsapp || "";
  const zona = data.zona || data.Zona || "";
  const experiencia = data.experiencia || data.Experiencia || "";
  const disponibilidad = data.disponibilidad || data.Disponibilidad || "";
  const puntoPartida = data.punto_partida || data.puntoPartida || data["Punto de partida"] || "";
  const motivacion = data.motivacion || data.Motivación || "";
  const talento = data.talento || data.Talento || "No especificado";

  // Procesar fotografía del candidato
  const rawFoto = data.foto || data.fotoBase64 || data.Foto;
  let foto = "No adjunta";

  if (rawFoto && typeof rawFoto === "string" && rawFoto.indexOf("base64,") !== -1) {
    try {
      const partes = rawFoto.split("base64,");
      const meta = partes[0];
      const base64Data = partes[1];
      let mimeType = "image/jpeg";
      let extension = ".jpg";
      if (meta.indexOf("image/png") !== -1) {
        mimeType = "image/png";
        extension = ".png";
      } else if (meta.indexOf("image/webp") !== -1) {
        mimeType = "image/webp";
        extension = ".webp";
      }
      const decodedBytes = Utilities.base64Decode(base64Data);
      const blob = Utilities.newBlob(decodedBytes, mimeType, "foto_" + idPostulacion + extension);
      let folder;
      const folders = DriveApp.getFoldersByName("Fotos Postulaciones Tour Azul");
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder("Fotos Postulaciones Tour Azul");
      }
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      foto = "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w1000";
    } catch (eDrive) {
      Logger.log("Aviso Drive en Code.gs: " + eDrive);
      if (rawFoto.length < 48000) {
        foto = rawFoto;
      } else {
        foto = data.fotoNombre ? ("Sí adjunta (" + data.fotoNombre + ")") : "Sí adjunta";
      }
    }
  } else if (typeof rawFoto === "string" && (rawFoto.startsWith("http") || rawFoto.startsWith("/uploads"))) {
    foto = rawFoto;
  } else if (data.tieneFoto) {
    foto = data.fotoNombre ? ("Sí adjunta (" + data.fotoNombre + ")") : "Sí adjunta";
  }
  const estado = data.estado || data.Estado || "Recibida";

  // Mapear según cabeceras existentes si las hay
  const lastCol = Math.max(1, sheet.getLastColumn());
  const headerValues = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h || "").trim().toLowerCase());

  // Si tiene cabeceras reconocibles, armar fila ordenada para las columnas existentes
  if (headerValues.some(h => h.includes("nombre") || h.includes("código") || h.includes("codigo") || h.includes("tel"))) {
    const filaDinamica = [];
    for (let c = 0; c < headerValues.length; c++) {
      const h = headerValues[c];
      if (h.includes("código") || h.includes("codigo") || h === "id") filaDinamica.push(idPostulacion);
      else if (h.includes("fecha") || h.includes("timestamp") || h.includes("marca")) filaDinamica.push(fechaRegistro);
      else if (h.includes("nombre")) filaDinamica.push(nombre);
      else if (h.includes("edad")) filaDinamica.push(edad);
      else if (h.includes("tel") || h.includes("whatsapp") || h.includes("cel")) filaDinamica.push(telefono);
      else if (h.includes("zona") || h.includes("sector") || h.includes("residencia")) filaDinamica.push(zona);
      else if (h.includes("experiencia")) filaDinamica.push(experiencia);
      else if (h.includes("disponibilidad")) filaDinamica.push(disponibilidad);
      else if (h.includes("partida") || h.includes("punto")) filaDinamica.push(puntoPartida);
      else if (h.includes("motivaci") || h.includes("aporte")) filaDinamica.push(motivacion);
      else if (h.includes("talento")) filaDinamica.push(talento);
      else if (h.includes("foto") || h.includes("imagen")) filaDinamica.push(foto);
      else if (h.includes("estado")) filaDinamica.push(estado);
      else filaDinamica.push("");
    }
    sheet.appendRow(filaDinamica);
  } else {
    // Fila estándar por defecto
    const fila = [
      idPostulacion,
      fechaRegistro,
      nombre,
      edad,
      telefono,
      zona,
      experiencia,
      disponibilidad,
      puntoPartida,
      motivacion,
      talento,
      foto,
      estado
    ];
    sheet.appendRow(fila);
  }

  return {
    status: "success",
    ok: true,
    id: idPostulacion,
    codigo: idPostulacion,
    nombre: nombre,
    mensaje: "Postulación registrada con éxito en Google Sheets (Tour Azul Postulaciones)"
  };
}

/**
 * Obtiene todas las postulaciones desde la hoja "Tour Azul Postulaciones"
 */
function obtenerCandidatosPostulaciones(ss) {
  let sheet = getHojaPostulaciones(ss);
  if (!sheet) {
    inicializarHojasSiNoExisten(ss);
    sheet = getHojaPostulaciones(ss);
  }
  if (!sheet) return [];

  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  // Buscar en las primeras 5 filas cuál es la fila de encabezados
  let headerRowIdx = 0;
  for (let r = 0; r < Math.min(5, rows.length); r++) {
    const candidateHeaders = rows[r].map(h => String(h || "").trim().toLowerCase());
    if (candidateHeaders.some(h => h.includes("nombre") || h.includes("código") || h.includes("codigo") || h.includes("aspirante"))) {
      headerRowIdx = r;
      break;
    }
  }

  const headers = rows[headerRowIdx].map(h => String(h || "").trim().toLowerCase());

  // Mapeador flexible de índices de columnas
  const findIdx = (predicate, defaultIdx) => {
    const idx = headers.findIndex(predicate);
    return idx !== -1 ? idx : defaultIdx;
  };

  const idxCodigo = findIdx(h => h.includes("código") || h.includes("codigo") || h === "id", 0);
  const idxFecha = findIdx(h => h.includes("fecha") || h.includes("timestamp") || h.includes("marca"), 1);
  const idxNombre = findIdx(h => h.includes("nombre"), 2);
  const idxEdad = findIdx(h => h.includes("edad"), 3);
  const idxTelefono = findIdx(h => h.includes("tel") || h.includes("whatsapp") || h.includes("cel"), 4);
  const idxZona = findIdx(h => h.includes("zona") || h.includes("sector") || h.includes("residencia"), 5);
  const idxExp = findIdx(h => h.includes("experiencia"), 6);
  const idxDisp = findIdx(h => h.includes("disponibilidad"), 7);
  const idxPunto = findIdx(h => h.includes("punto"), 8);
  const idxMotiv = findIdx(h => h.includes("motivaci") || h.includes("aporte"), 9);
  const idxTalento = findIdx(h => h.includes("talento"), 10);
  const idxFoto = findIdx(h => h.includes("foto") || h.includes("imagen"), 11);
  const idxEstado = findIdx(h => h.includes("estado"), 12);

  const candidatos = [];

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const r = rows[i];
    const nom = String(r[idxNombre] || "").trim();
    const telVal = String(r[idxTelefono] || "").trim();
    if (!nom && !telVal) continue; // Ignorar filas totalmente vacías

    const cod = String(r[idxCodigo] || ("POST-" + i)).trim();
    const fechaVal = r[idxFecha] ? (r[idxFecha] instanceof Date ? Utilities.formatDate(r[idxFecha], Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss") : String(r[idxFecha])) : "";
    const edadVal = r[idxEdad] !== undefined ? r[idxEdad] : "--";
    const telVal = String(r[idxTelefono] || "").trim();
    const zonVal = String(r[idxZona] || "").trim();
    const expVal = String(r[idxExp] || "").trim();
    const dispVal = String(r[idxDisp] || "").trim();
    const puntoVal = String(r[idxPunto] || "").trim();
    const motivVal = String(r[idxMotiv] || "").trim();
    const talentoVal = String(r[idxTalento] || "").trim();
    let fotoVal = String(r[idxFoto] || "").trim();
    if (fotoVal.indexOf("drive.google.com") !== -1) {
      const matchDrive = fotoVal.match(/\/d\/([a-zA-Z0-9_-]+)/) || fotoVal.match(/id=([a-zA-Z0-9_-]+)/);
      if (matchDrive && matchDrive[1]) {
        fotoVal = "https://drive.google.com/thumbnail?id=" + matchDrive[1] + "&sz=w1000";
      }
    }
    const estadoVal = String(r[idxEstado] || "Recibida").trim();

    // Objeto compatible con ambas nomenclaturas (PascalCase y camelCase) para que AdminCandidatos.tsx lo lea sin problemas
    candidatos.push({
      id: cod,
      Código: cod,
      codigo: cod,
      Fecha: fechaVal,
      fecha: fechaVal,
      createdAt: fechaVal,
      Nombre: nom,
      nombre: nom,
      Edad: edadVal,
      edad: edadVal,
      Teléfono: telVal,
      telefono: telVal,
      Zona: zonVal,
      zona: zonVal,
      Experiencia: expVal,
      experiencia: expVal,
      Disponibilidad: dispVal,
      disponibilidad: dispVal,
      "Punto de partida": puntoVal,
      punto_partida: puntoVal,
      puntoPartida: puntoVal,
      Motivación: motivVal,
      motivacion: motivVal,
      Talento: talentoVal,
      talento: talentoVal,
      Foto: fotoVal,
      foto: fotoVal,
      Estado: estadoVal,
      estado: estadoVal
    });
  }

  // Devolver del más reciente al más antiguo
  return candidatos.reverse();
}

/**
 * Obtiene comentarios aprobados para mostrar en la web
 */
function obtenerComentariosAprobados(ss) {
  const sheet = ss.getSheetByName("Opiniones");
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  const headers = rows[0];
  const idxNombrePub = headers.indexOf("Nombre Publico");
  const idxDestino = headers.indexOf("Destino");
  const idxFecha = headers.indexOf("Fecha Viaje");
  const idxCalif = headers.indexOf("Calificacion");
  const idxComent = headers.indexOf("Comentario");
  const idxFoto = headers.indexOf("Foto Base64");
  const idxEstado = headers.indexOf("Estado");

  const lista = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const estado = row[idxEstado];
    if (estado === "Aprobado") {
      lista.unshift({
        id: "com-" + i,
        nombre: row[idxNombrePub] || "Viajero",
        destino: row[idxDestino] || "",
        fechaViaje: row[idxFecha] || "",
        fechaTexto: row[idxFecha] ? Utilities.formatDate(new Date(row[idxFecha]), Session.getScriptTimeZone(), "dd/MM/yyyy") : "",
        calificacion: Number(row[idxCalif]) || 5,
        comentario: row[idxComent] || "",
        fotoUrl: row[idxFoto] || "",
        verificado: true
      });
    }
  }
  return lista;
}

/**
 * Registra una opinión enviada desde la web
 */
function registrarComentario(ss, data) {
  const sheet = ss.getSheetByName("Opiniones");
  if (!sheet) return { ok: false, error: "Hoja Opiniones no encontrada" };

  const tel = String(data.telefono || "").trim();
  const slug = String(data.viajeSlug || "").trim();
  const rows = sheet.getDataRange().getValues();

  // Validar unicidad por teléfono + viaje
  for (let i = 1; i < rows.length; i++) {
    const rowTel = String(rows[i][4] || "").trim();
    const rowSlug = String(rows[i][5] || "").trim() + "-" + String(rows[i][6] || "").trim();
    if (rowTel === tel && rowSlug.indexOf(slug) !== -1) {
      return { ok: false, error: "Ya existe un comentario registrado para este teléfono y viaje." };
    }
  }

  const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  const idCom = "OPIN-" + Date.now();

  sheet.appendRow([
    now,
    idCom,
    data.nombre,
    data.nombrePublico,
    data.telefono,
    data.destino,
    data.fechaViaje,
    data.calificacion,
    data.comentario,
    data.fotoBase64 || "",
    data.autorizaPublicar ? "SI" : "NO",
    data.participaSorteo ? "SI" : "NO",
    "Pendiente" // Requiere aprobación manual
  ]);

  return { ok: true, mensaje: "Opinión registrada con éxito para revisión", id: idCom };
}

/**
 * Verifica la clave de admin y devuelve participantes elegibles
 */
function verificarAdminSorteo(ss, clave) {
  // Clave guardada en Config o fallback seguro
  const claveReal = getClaveAdminConfig(ss);
  if (clave !== claveReal) {
    return { ok: false, error: "Clave de administrador incorrecta" };
  }

  const now = new Date();
  const mesKey = "sorteo_" + now.getFullYear() + "_" + (now.getMonth() + 1);
  let ganadorPrevio = null;

  const sSorteos = ss.getSheetByName("Sorteos");
  if (sSorteos) {
    const sRows = sSorteos.getDataRange().getValues();
    for (let j = sRows.length - 1; j >= 1; j--) {
      if (String(sRows[j][1] || "") === mesKey) {
        ganadorPrevio = {
          nombre: sRows[j][2],
          telefono: sRows[j][3],
          destino: sRows[j][4],
          fechaViaje: sRows[j][5],
          comentario: sRows[j][6]
        };
        break;
      }
    }
  }

  const participantes = obtenerParticipantesSorteoMes(ss);
  return { ok: true, participantes: participantes, ganadorPrevio: ganadorPrevio };
}

/**
 * Elige el ganador al azar desde el backend
 */
function elegirGanadorSorteo(ss, data) {
  const claveReal = getClaveAdminConfig(ss);
  if (data.clave !== claveReal) {
    return { ok: false, error: "Clave de administrador incorrecta" };
  }

  const sSorteos = ss.getSheetByName("Sorteos");
  const now = new Date();
  const mesKey = data.mesKey || ("sorteo_" + now.getFullYear() + "_" + (now.getMonth() + 1));

  // Impedir un segundo sorteo en el mismo mes, salvo con confirmación explícita (repetir: true)
  if (sSorteos && !data.repetir) {
    const sRows = sSorteos.getDataRange().getValues();
    for (let j = sRows.length - 1; j >= 1; j--) {
      if (String(sRows[j][1] || "") === mesKey) {
        return {
          ok: false,
          yaSorteado: true,
          error: "Ya se ha realizado el sorteo de este mes. Si deseas sortear nuevamente usa el botón 'Repetir sorteo'.",
          ganador: {
            nombre: sRows[j][2],
            telefono: sRows[j][3],
            destino: sRows[j][4],
            fechaViaje: sRows[j][5],
            comentario: sRows[j][6]
          }
        };
      }
    }
  }

  const participantes = obtenerParticipantesSorteoMes(ss);
  if (participantes.length === 0) {
    return { ok: false, error: "No hay participantes elegibles (opiniones aprobadas) para el sorteo de este mes." };
  }

  // Selección 100% aleatoria en el servidor
  const winningIndex = Math.floor(Math.random() * participantes.length);
  const ganador = participantes[winningIndex];
  ganador.index = winningIndex;

  // Registrar en hoja Sorteos
  if (sSorteos) {
    const timeStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    sSorteos.appendRow([
      timeStr,
      mesKey,
      ganador.nombre,
      ganador.telefono,
      ganador.destino,
      ganador.fechaViaje,
      ganador.comentario
    ]);
  }

  return { ok: true, ganador: ganador };
}

function getClaveAdminConfig(ss) {
  const cfg = ss.getSheetByName("Config");
  if (cfg) {
    const vals = cfg.getDataRange().getValues();
    if (vals.length > 2 && vals[2][0]) {
      return String(vals[2][0]).trim();
    }
  }
  return "010203"; // Clave oficial del administrador (010203)
}

function obtenerParticipantesSorteoMes(ss) {
  const sheet = ss.getSheetByName("Opiniones");
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  const headers = rows[0];
  const idxNombre = headers.indexOf("Nombre");
  const idxNombrePub = headers.indexOf("Nombre Publico");
  const idxTel = headers.indexOf("Telefono");
  const idxDestino = headers.indexOf("Destino");
  const idxFecha = headers.indexOf("Fecha Viaje");
  const idxComent = headers.indexOf("Comentario");
  const idxPart = headers.indexOf("Participa Sorteo");
  const idxEstado = headers.indexOf("Estado");

  const elegibles = [];
  const telsVistos = {};

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const tel = String(r[idxTel] || "").trim();
    const participa = String(r[idxPart] || "").toUpperCase() === "SI";
    const estado = (idxEstado !== -1) ? String(r[idxEstado] || "").trim().toLowerCase() : "";

    // Participan los viajeros del mes que dejen una opinión aprobada (sin importar calificación)
    // y máximo 1 participación por persona/teléfono por mes
    const esAprobado = estado === "aprobado" || estado === "aprobada";
    if (esAprobado && participa && tel && !telsVistos[tel]) {
      telsVistos[tel] = true;
      elegibles.push({
        nombre: r[idxNombre] || r[idxNombrePub],
        nombreCorto: r[idxNombrePub] || r[idxNombre],
        telefono: tel,
        destino: r[idxDestino] || "",
        fechaViaje: r[idxFecha] || "",
        comentario: r[idxComent] || ""
      });
    }
  }
  return elegibles;
}

/**
 * Función auxiliar para responder JSON
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Rellena números con ceros a la izquierda
 */
function pad(num, size) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}
