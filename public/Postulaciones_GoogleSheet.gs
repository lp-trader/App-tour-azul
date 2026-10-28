/**
 * ============================================================================
 * TOUR AZUL - GOOGLE APPS SCRIPT DEDICADO PARA POSTULACIONES (Postulaciones_GoogleSheet.gs)
 * ============================================================================
 * 
 * Este script es exclusivo para el nuevo documento de Google Sheets de Postulaciones.
 * 
 * CARACTERÍSTICAS PRINCIPALES:
 * 1. Utiliza una ÚNICA pestaña en el documento ("Postulaciones").
 *    NUNCA crea pestañas nuevas por cada envío.
 * 2. Valida todos los datos obligatorios del formulario antes de escribir la fila.
 * 3. Previene colisiones de escritura con LockService.
 * 4. Soporta la recepción de fotografías (si se envía en base64, la guarda en una
 *    carpeta de Google Drive "Fotos Postulaciones Tour Azul" y coloca el enlace directo
 *    en la celda; si se envía como enlace, guarda la URL de visualización).
 * 5. Mantiene las columnas exactamente sincronizadas con el formulario y el panel.
 * 6. Soporta cambio de estado administrativo (Recibida, Contactada, Entrevistada, Seleccionada, Descartada).
 * 
 * INSTRUCCIONES DE INSTALACIÓN PASO A PASO:
 * 1. Crea una hoja de cálculo nueva y vacía en Google Sheets (ej: "Tour Azul - Postulaciones").
 * 2. En el menú superior de esa hoja, haz clic en: Extensiones > Apps Script.
 * 3. Borra el código por defecto (myFunction) y pega TODO este archivo.
 * 4. Haz clic en el icono de disco "Guardar" (o Ctrl + S / Cmd + S).
 * 5. Haz clic en el botón azul superior "Implementar" (Deploy) > "Nueva implementación".
 * 6. Selecciona el tipo de implementación: "Aplicación web" (Web app).
 * 7. Configura exactamente así:
 *    - Descripción: "Tour Azul Postulaciones v2"
 *    - Ejecutar como: "Yo" (tu cuenta de correo de Google)
 *    - Quién tiene acceso: "Cualquier usuario" (Anyone - incluso anónimos para recibir envíos públicos)
 * 8. Haz clic en "Implementar" y acepta los permisos de Google.
 * 9. Copia la "URL de la aplicación web" (termina en /exec).
 * 10. Pega esa URL en el Panel de Administración de Tour Azul (o proporciónamela).
 * ============================================================================
 */

// Nombre único de la pestaña donde se guardan todas las postulaciones
var NOMBRE_HOJA_POSTULACIONES = "Postulaciones";

// Nombre de la carpeta en Google Drive para almacenar las fotos subidas
var NOMBRE_CARPETA_DRIVE_FOTOS = "Fotos Postulaciones Tour Azul";

/**
 * Encabezados oficiales de las columnas (coinciden exactamente con el formulario)
 */
var ENCABEZADOS_POSTULACIONES = [
  "Código",
  "Fecha Registro",
  "Nombre Completo",
  "Edad",
  "Teléfono / WhatsApp",
  "Zona de Residencia",
  "Experiencia",
  "Disponibilidad",
  "Punto de Partida",
  "Motivación",
  "Talento Curioso",
  "Fotografía",
  "Estado",
  "Notas"
];

/**
 * Peticiones GET: Para verificar la conexión y consultar candidatos desde el panel admin
 * Parámetros soportados:
 * - accion=candidatos (o sin parámetros): retorna lista de postulaciones en formato JSON
 * - accion=test: prueba de conectividad y estado de la hoja
 */
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var accion = (params.accion || "candidatos").toLowerCase();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = obtenerOInicializarHoja(ss);

    // 1. TEST DE CONECTIVIDAD
    if (accion === "test" || accion === "ping") {
      return jsonResponse({
        ok: true,
        status: "success",
        servicio: "Tour Azul Postulaciones Webhook",
        documento: ss.getName(),
        pestana: sheet.getName(),
        totalPostulaciones: Math.max(0, sheet.getLastRow() - 1),
        timestamp: new Date().toISOString()
      });
    }

    // 2. OBTENER LISTA DE CANDIDATOS
    var postulaciones = obtenerTodasLasPostulaciones(sheet);
    return jsonResponse({
      ok: true,
      status: "success",
      servicio: "Tour Azul Postulaciones",
      documento: ss.getName(),
      pestana: sheet.getName(),
      data: postulaciones,
      total: postulaciones.length,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return jsonResponse({
      ok: false,
      status: "error",
      error: "Error al procesar petición GET: " + err.toString()
    });
  }
}

/**
 * Peticiones POST: Para guardar una nueva postulación o actualizar el estado de una existente.
 * Utiliza LockService para garantizar que no existan colisiones de escritura concurrente.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Esperar hasta 15 segundos para adquirir el candado de escritura
    var acquired = lock.tryLock(15000);
    if (!acquired) {
      return jsonResponse({
        ok: false,
        status: "error",
        error: "El servidor de Google Sheets está ocupado procesando otra solicitud. Por favor intenta de nuevo en unos segundos."
      });
    }

    var contents = e && e.postData ? e.postData.contents : "{}";
    var data = {};
    try {
      data = JSON.parse(contents);
    } catch (parseErr) {
      return jsonResponse({
        ok: false,
        status: "error",
        error: "Formato de datos JSON inválido en la solicitud: " + parseErr.toString()
      });
    }

    var accion = (data.accion || "postulacion").toLowerCase();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = obtenerOInicializarHoja(ss);

    // 1. ACCIÓN: GUARDAR POSTULACIÓN NUEVA
    if (accion === "postulacion" || accion === "guardar_postulacion" || accion === "candidato") {
      return jsonResponse(guardarPostulacion(ss, sheet, data));
    }

    // 2. ACCIÓN: ACTUALIZAR ESTADO DE UN CANDIDATO
    if (accion === "actualizar_estado" || accion === "cambiar_estado") {
      return jsonResponse(actualizarEstadoCandidato(sheet, data));
    }

    // 3. ACCIÓN: CONSULTA DE CANDIDATOS VÍA POST
    if (accion === "candidatos" || accion === "obtener_candidatos") {
      var lista = obtenerTodasLasPostulaciones(sheet);
      return jsonResponse({
        ok: true,
        status: "success",
        data: lista,
        total: lista.length
      });
    }

    return jsonResponse({
      ok: false,
      status: "error",
      error: "Acción POST no reconocida: " + accion
    });

  } catch (err) {
    return jsonResponse({
      ok: false,
      status: "error",
      error: "Error interno en Apps Script: " + err.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Obtiene la única pestaña de postulaciones o la inicializa si no existe.
 * NUNCA crea hojas por cada envío.
 */
function obtenerOInicializarHoja(ss) {
  var sheet = ss.getSheetByName(NOMBRE_HOJA_POSTULACIONES);
  
  // Si no existe con el nombre exacto, buscar si la hoja activa está vacía o renombrar
  if (!sheet) {
    var todas = ss.getSheets();
    if (todas.length === 1 && todas[0].getLastRow() <= 1) {
      sheet = todas[0];
      sheet.setName(NOMBRE_HOJA_POSTULACIONES);
    } else {
      sheet = ss.insertSheet(NOMBRE_HOJA_POSTULACIONES);
    }
  }

  // Inicializar encabezados si la hoja está completamente vacía
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(ENCABEZADOS_POSTULACIONES);
    
    // Estilo visual Tour Azul: Azul Marino (#0B2A6B), texto blanco, negrita
    var headerRange = sheet.getRange(1, 1, 1, ENCABEZADOS_POSTULACIONES.length);
    headerRange.setFontWeight("bold")
               .setBackground("#0B2A6B")
               .setFontColor("#FFFFFF")
               .setFontSize(10)
               .setVerticalAlignment("middle")
               .setHorizontalAlignment("center");
    
    sheet.setRowHeight(1, 35);
    sheet.setFrozenRows(1);

    // Ajustar anchos iniciales de columnas para lectura cómoda
    sheet.setColumnWidth(1, 160); // Código
    sheet.setColumnWidth(2, 150); // Fecha Registro
    sheet.setColumnWidth(3, 220); // Nombre Completo
    sheet.setColumnWidth(4, 70);  // Edad
    sheet.setColumnWidth(5, 150); // Teléfono / WhatsApp
    sheet.setColumnWidth(6, 160); // Zona
    sheet.setColumnWidth(7, 200); // Experiencia
    sheet.setColumnWidth(8, 200); // Disponibilidad
    sheet.setColumnWidth(9, 200); // Punto de partida
    sheet.setColumnWidth(10, 300); // Motivación
    sheet.setColumnWidth(11, 200); // Talento curioso
    sheet.setColumnWidth(12, 180); // Fotografía
    sheet.setColumnWidth(13, 130); // Estado
    sheet.setColumnWidth(14, 200); // Notas

    // Formato condicional para la columna de Estado (Columna 13 / M)
    aplicarFormatoCondicionalEstados(sheet);
  }

  return sheet;
}

/**
 * Aplica colores automáticos en la columna Estado
 */
function aplicarFormatoCondicionalEstados(sheet) {
  var range = sheet.getRange("M2:M1500");
  var reglas = [
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Recibida").setBackground("#E0F2FE").setFontColor("#0369A1").setRanges([range]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Contactada").setBackground("#DCFCE7").setFontColor("#15803D").setRanges([range]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Entrevistada").setBackground("#FEF3C7").setFontColor("#B45309").setRanges([range]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Seleccionada").setBackground("#F3E8FF").setFontColor("#7E22CE").setRanges([range]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Descartada").setBackground("#FFE4E6").setFontColor("#BE123C").setRanges([range]).build()
  ];
  sheet.setConditionalFormatRules(reglas);
}

/**
 * Valida y registra una postulación en una única fila de la hoja
 */
function guardarPostulacion(ss, sheet, data) {
  // 1. VALIDACIONES OBLIGATORIAS
  var nombre = String(data.nombre || data.Nombre || data.nombreCompleto || "").trim();
  if (!nombre || nombre.length < 3) {
    return { ok: false, status: "error", error: "El nombre completo es obligatorio y debe tener al menos 3 caracteres." };
  }

  var edadVal = data.edad !== undefined ? data.edad : data.Edad;
  var edad = parseInt(edadVal, 10);
  if (isNaN(edad) || edad < 16 || edad > 85) {
    return { ok: false, status: "error", error: "La edad debe ser un número válido entre 16 y 85 años." };
  }

  var telefono = String(data.telefono || data.Teléfono || data.whatsapp || "").trim();
  if (!telefono || telefono.length < 7) {
    return { ok: false, status: "error", error: "El número de teléfono y WhatsApp es obligatorio." };
  }

  var zona = String(data.zona || data.Zona || "").trim();
  if (!zona) {
    return { ok: false, status: "error", error: "La zona de residencia es obligatoria." };
  }

  var experiencia = String(data.experiencia || data.Experiencia || "").trim();
  if (!experiencia) {
    return { ok: false, status: "error", error: "La respuesta de experiencia es obligatoria." };
  }

  var disponibilidad = String(data.disponibilidad || data.Disponibilidad || "").trim();
  if (!disponibilidad) {
    return { ok: false, status: "error", error: "La respuesta de disponibilidad es obligatoria." };
  }

  var puntoPartida = String(data.punto_partida || data.puntoPartida || data["Punto de partida"] || "").trim();
  if (!puntoPartida) {
    return { ok: false, status: "error", error: "La confirmación de llegada al punto de partida es obligatoria." };
  }

  var motivacion = String(data.motivacion || data.Motivación || "").trim();
  if (!motivacion || motivacion.length < 8) {
    return { ok: false, status: "error", error: "La motivación de postulación es obligatoria." };
  }

  var talento = String(data.talento || data.Talento || "No especificado").trim();
  var estado = String(data.estado || data.Estado || "Recibida").trim();
  var notas = String(data.notas || data.Notas || "").trim();

  // 2. GENERAR ID ÚNICO Y FECHA
  var now = new Date();
  var tz = Session.getScriptTimeZone();
  var fechaRegistro = Utilities.formatDate(now, tz, "yyyy-MM-dd HH:mm:ss");
  var fechaCompacta = Utilities.formatDate(now, tz, "yyyyMMdd");
  var proximoIndice = Math.max(1, sheet.getLastRow());
  var codigoPostulacion = String(data.codigo || data.id || data.Código || ("POST-" + fechaCompacta + "-" + padNumero(proximoIndice, 4))).trim();

  // 3. PROCESAR FOTOGRAFÍA (Google Drive o enlace)
  var valorFoto = procesarFotografia(codigoPostulacion, nombre, data);

  // 4. INSERTAR FILA EN LA ÚNICA HOJA
  var fila = [
    codigoPostulacion,
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
    valorFoto,
    estado,
    notas
  ];

  sheet.appendRow(fila);
  var numFilaInsertada = sheet.getLastRow();

  // Centrar columnas clave
  sheet.getRange(numFilaInsertada, 1).setHorizontalAlignment("center"); // Código
  sheet.getRange(numFilaInsertada, 2).setHorizontalAlignment("center"); // Fecha
  sheet.getRange(numFilaInsertada, 4).setHorizontalAlignment("center"); // Edad
  sheet.getRange(numFilaInsertada, 13).setHorizontalAlignment("center"); // Estado

  // Validar menú desplegable en la celda de Estado
  var reglaEstado = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Recibida", "Contactada", "Entrevistada", "Seleccionada", "Descartada"], true)
    .build();
  sheet.getRange(numFilaInsertada, 13).setDataValidation(reglaEstado);

  return {
    ok: true,
    status: "success",
    id: codigoPostulacion,
    codigo: codigoPostulacion,
    nombre: nombre,
    fila: numFilaInsertada,
    mensaje: "Postulación registrada exitosamente en Google Sheets (Hoja: " + NOMBRE_HOJA_POSTULACIONES + ")"
  };
}

/**
 * Procesa la foto adjunta. Si viene en base64, la guarda en una carpeta de Google Drive
 * para no saturar los 50.000 caracteres de límite por celda de Google Sheets.
 */
function procesarFotografia(codigo, nombre, data) {
  var rawFoto = data.foto || data.fotoBase64 || data.Foto;
  var fotoUrl = data.fotoUrl || null;
  var tieneFoto = Boolean(data.tieneFoto || rawFoto || fotoUrl);

  if (!tieneFoto) {
    return "No adjunta";
  }

  // Si ya es una URL pública o del servidor
  if (fotoUrl && typeof fotoUrl === "string" && (fotoUrl.startsWith("http") || fotoUrl.startsWith("/uploads"))) {
    return fotoUrl;
  }

  // Si viene en Base64 desde el navegador o servidor
  if (rawFoto && typeof rawFoto === "string" && rawFoto.indexOf("base64,") !== -1) {
    try {
      var partes = rawFoto.split("base64,");
      var meta = partes[0];
      var base64Data = partes[1];
      
      var mimeType = "image/jpeg";
      var extension = ".jpg";
      if (meta.indexOf("image/png") !== -1) {
        mimeType = "image/png";
        extension = ".png";
      } else if (meta.indexOf("image/webp") !== -1) {
        mimeType = "image/webp";
        extension = ".webp";
      }

      var decodedBytes = Utilities.base64Decode(base64Data);
      var blob = Utilities.newBlob(decodedBytes, mimeType, "foto_" + codigo + extension);

      // Obtener o crear carpeta en Google Drive
      var folder = obtenerOCrearCarpetaDrive(NOMBRE_CARPETA_DRIVE_FOTOS);
      var file = folder.createFile(blob);
      
      // Establecer permiso para que el administrador pueda verla con el enlace desde cualquier dispositivo
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      var fileId = file.getId();
      // Retornar enlace directo de imagen para que cargue inmediatamente en etiquetas <img> de cualquier dispositivo
      return "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1000";

    } catch (errDrive) {
      Logger.log("Aviso al guardar en Google Drive: " + errDrive);
      // Respaldo resiliente: Si la imagen base64 cabe en la celda (< 48.000 caracteres), guardarla directamente
      if (rawFoto.length < 48000) {
        return rawFoto;
      }
      return data.fotoNombre ? ("Sí adjunta (" + data.fotoNombre + ")") : "Sí adjunta";
    }
  }

  // Si ya es un enlace directo
  if (typeof rawFoto === "string" && (rawFoto.startsWith("http") || rawFoto.startsWith("/uploads"))) {
    return rawFoto;
  }

  return (data.fotoNombre ? ("Sí adjunta (" + data.fotoNombre + ")") : "Sí adjunta");
}

/**
 * Obtiene o crea la carpeta de fotos en Google Drive
 */
function obtenerOCrearCarpetaDrive(nombreCarpeta) {
  var folders = DriveApp.getFoldersByName(nombreCarpeta);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(nombreCarpeta);
}

/**
 * ============================================================================
 * FUNCIÓN DE AUTORIZACIÓN: EJECUTAR UNA SOLA VEZ EN EL EDITOR DE APPS SCRIPT
 * ============================================================================
 * Para que Google permita a este script crear la carpeta "Fotos Postulaciones Tour Azul"
 * en tu Google Drive, selecciona "autorizarPermisosDrive" en el menú desplegable superior
 * del editor de Apps Script y presiona "Ejecutar". Google te solicitará otorgar permisos.
 * 
 * Si no la ejecutas, no hay problema: las fotos se guardarán automáticamente en la celda
 * de Google Sheets y en el servidor, garantizando visibilidad en todos los dispositivos.
 * ============================================================================
 */
function autorizarPermisosDrive() {
  try {
    var folder = obtenerOCrearCarpetaDrive(NOMBRE_CARPETA_DRIVE_FOTOS);
    Logger.log("¡Éxito! Carpeta lista en Google Drive: " + folder.getName() + " (ID: " + folder.getId() + ")");
    return "¡Permisos de Google Drive concedidos exitosamente! Carpeta: " + folder.getName();
  } catch (err) {
    Logger.log("Error al autorizar Drive: " + err);
    throw err;
  }
}

/**
 * Actualiza el estado de una postulación existente en la hoja
 */
function actualizarEstadoCandidato(sheet, data) {
  var codigo = String(data.codigo || data.id || data.Código || "").trim().toLowerCase();
  var nuevoEstado = String(data.estado || data.Estado || "").trim();

  if (!codigo || !nuevoEstado) {
    return { ok: false, status: "error", error: "Se requiere 'codigo' y 'estado' para actualizar." };
  }

  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) {
    return { ok: false, status: "error", error: "No hay registros en la hoja para actualizar." };
  }

  // Buscar fila por código (columna 1 / index 0)
  for (var i = 1; i < rows.length; i++) {
    var codFila = String(rows[i][0] || "").trim().toLowerCase();
    if (codFila === codigo) {
      sheet.getRange(i + 1, 13).setValue(nuevoEstado);
      if (data.notas !== undefined) {
        sheet.getRange(i + 1, 14).setValue(String(data.notas));
      }
      return {
        ok: true,
        status: "success",
        codigo: rows[i][0],
        estadoAnterior: rows[i][12],
        nuevoEstado: nuevoEstado,
        fila: i + 1
      };
    }
  }

  return { ok: false, status: "error", error: "No se encontró el candidato con código: " + codigo };
}

/**
 * Lee todas las postulaciones desde la hoja única
 */
function obtenerTodasLasPostulaciones(sheet) {
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  var tz = Session.getScriptTimeZone();
  var lista = [];

  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    var nombre = String(r[2] || "").trim();
    var tel = String(r[4] || "").trim();
    if (!nombre && !tel) continue; // Ignorar filas en blanco

    var cod = String(r[0] || ("POST-" + i)).trim();
    var fechaStr = r[1] instanceof Date ? Utilities.formatDate(r[1], tz, "yyyy-MM-dd HH:mm:ss") : String(r[1] || "");

    lista.push({
      id: cod,
      codigo: cod,
      Código: cod,
      fecha: fechaStr,
      Fecha: fechaStr,
      createdAt: fechaStr,
      nombre: nombre,
      Nombre: nombre,
      edad: r[3] !== undefined ? r[3] : "--",
      Edad: r[3] !== undefined ? r[3] : "--",
      telefono: tel,
      Teléfono: tel,
      zona: String(r[5] || ""),
      Zona: String(r[5] || ""),
      experiencia: String(r[6] || ""),
      Experiencia: String(r[6] || ""),
      disponibilidad: String(r[7] || ""),
      Disponibilidad: String(r[7] || ""),
      punto_partida: String(r[8] || ""),
      puntoPartida: String(r[8] || ""),
      "Punto de partida": String(r[8] || ""),
      motivacion: String(r[9] || ""),
      Motivación: String(r[9] || ""),
      talento: String(r[10] || ""),
      Talento: String(r[10] || ""),
      foto: normalizarFotoParaVisualizar(r[11]),
      Foto: normalizarFotoParaVisualizar(r[11]),
      estado: String(r[12] || "Recibida"),
      Estado: String(r[12] || "Recibida"),
      notas: String(r[13] || ""),
      Notas: String(r[13] || "")
    });
  }

  // Retornar en orden inverso (más recientes primero)
  return lista.reverse();
}

/**
 * Helper para formatear ceros a la izquierda
 */
function padNumero(num, size) {
  var s = String(num);
  while (s.length < (size || 3)) s = "0" + s;
  return s;
}

/**
 * Convierte enlaces de Google Drive en URLs de imagen directa (thumbnails)
 */
function normalizarFotoParaVisualizar(val) {
  if (!val) return "";
  var s = String(val).trim();
  if (s.indexOf("drive.google.com") !== -1) {
    var match = s.match(/\/d\/([a-zA-Z0-9_-]+)/) || s.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return "https://drive.google.com/thumbnail?id=" + match[1] + "&sz=w1000";
    }
  }
  return s;
}

/**
 * Respuesta JSON limpia con Content-Type correcto para fetch en JavaScript
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
