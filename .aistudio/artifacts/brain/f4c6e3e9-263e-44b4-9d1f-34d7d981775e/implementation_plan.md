# Plan de Integración: Cloud Firestore y Firebase Storage para Tour Azul

Plan técnico integral y actualizado para registrar las postulaciones de candidatos en **Cloud Firestore** (colección `postulaciones`) y almacenar sus fotografías de forma **privada y segura en Firebase Storage**, garantizando la validación estricta de archivos (JPG, JPEG, PNG, WEBP de hasta 5 MB), la gestión de transacciones para evitar archivos huérfanos, la protección mediante reglas independientes de seguridad, la auditoría del build en Vercel y la total preservación del sistema de reservas, 31 asientos y Google Sheets.

> [!IMPORTANT]
> **Modo Planificación (Cero modificaciones aplicadas):** Este documento detalla la arquitectura, los archivos a modificar, las reglas propuestas y el protocolo de pruebas. Ningún archivo del código fuente ni despliegue se ejecutará hasta contar con su aprobación explícita.

---

## 1. Alcance Técnico y Arquitectura de la Solución

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA DEL SISTEMA                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [ Candidato / Navegador ]                                             │
│       │ 1. Completa formulario + selecciona fotografía                 │
│       │ 2. Validación en cliente (campos, MIME y <= 5 MB)             │
│       │ 3. Genera postulacionId único seguro                          │
│       ▼                                                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    FLUJO DE ENVÍO TRANSACCIONAL                  │  │
│  │                                                                  │  │
│  │   Paso 1: Subida a Firebase Storage                              │  │
│  │   └─► Ruta: /postulaciones/{postulacionId}/foto.{ext}            │  │
│  │   └─► Reglas Storage validan: Content-Type y size <= 5 MB         │  │
│  │                                                                  │  │
│  │   Paso 2: Registro en Cloud Firestore                            │  │
│  │   └─► Colección: /postulaciones/{postulacionId}                  │  │
│  │   └─► Guarda metadatos y referencia de localización segura:      │  │
│  │       { storagePath, nombreOriginal, tamañoBytes, tipoMime }     │  │
│  │   └─► Reglas Firestore validan esquema, tipos y serverTimestamp  │  │
│  │                                                                  │  │
│  │   Manejo de Errores y Rollback Anti-Huérfanos:                   │  │
│  │   └─► Si falla Storage: se aborta el flujo y no se toca Firestore│  │
│  │   └─► Si falla Firestore: se ejecuta borrado compensatorio en    │  │
│  │       Storage del archivo recién subido y se notifica al usuario │  │
│  │   └─► Solo tras confirmación de ambos: se despliega el modal de  │  │
│  │       éxito definitivo con el identificador de postulación       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│       │                                                                │
│       ▼                                                                │
│  [ Privacidad y Control de Acceso ]                                    │
│       ├─► Fotografías: PRIVADAS (Sin URLs públicas / Sin getDownloadURL)│
│       ├─► Lectura Firestore y Storage: Exclusiva para el Administrador │
│       │   autenticado y verificado (luisperera87@gmail.com)            │
│       └─► Visitantes anónimos / externos: Lectura bloqueada (403)     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Archivos que Cambiarían y Justificación

| Archivo | Motivo y Cambios Previstos |
| :--- | :--- |
| **`package.json`** | 1. Modificar `"build": "vite build"` por `"build": "node scripts/generate-full-page.js && vite build"`. Esto garantiza que Vercel regenere `index.html` compilando todos los módulos JavaScript antes del bundle final.<br>2. Añadir dependencias oficiales de Firebase (`firebase`) requeridas para Firestore y Storage. |
| **`scripts/recruitment-module.js`** | 1. Implementar la validación rigurosa de la fotografía (tipo MIME: `image/jpeg`, `image/png`, `image/webp` y tamaño `<= 5 * 1024 * 1024` bytes).<br>2. Diseñar el flujo de subida asíncrono con control de concurrencia (botón en estado `disabled` con spinner y mensaje de progreso).<br>3. Integrar la llamada a `uploadBytes()` de Firebase Storage y posterior `setDoc()` en Firestore.<br>4. Implementar bloque `try/catch` con lógica compensatoria: si Firestore falla tras haber subido el archivo a Storage, ejecutar `deleteObject()` para no dejar archivos huérfanos en el bucket.<br>5. No invocar `getDownloadURL()`: conservar la referencia estructurada interna (`storagePath`) para lectura privada administrativa.<br>6. Mostrar modal de confirmación definitiva con número de postulación únicamente tras el éxito total.<br>7. Mantener honeypot antispam invisible. |
| **`scripts/generate-full-page.js`** | Integrar la inicialización limpia y desacoplada del SDK de Firebase Web (App, Firestore, Storage) usando las credenciales públicas del proyecto, sin afectar los scripts ni el estado de reservas, asientos, calendario o Google Sheets. |
| **`firebase-blueprint.json`** *(Nuevo)* | Representación intermedia (IR) estandarizada del modelo de datos de `postulaciones`, definiendo cada propiedad, sus longitudes, tipos y el sub-objeto seguro `foto`. |
| **`firestore.rules`** *(Nuevo)* | Reglas de seguridad Zero-Trust para Cloud Firestore: validación estricta de la estructura del documento en creación pública; prohibición absoluta de lectura/escritura a usuarios no autorizados; lectura y gestión reservadas a `luisperera87@gmail.com`. |
| **`storage.rules`** *(Nuevo)* | Reglas de seguridad para Firebase Storage: validación estricta en subidas hacia `/postulaciones/{postulacionId}/{fileName}` (tamaño máximo 5 MB, tipo MIME permitido, formato de nombre seguro); lectura bloqueada al público y reservada al administrador. |
| **`.env.example`** | Documentar las variables de entorno públicas necesarias (`VITE_FIREBASE_*`) sin contener credenciales privadas ni secretos de servicio. |

---

## 3. Reglas Propuestas de Seguridad

### A. Reglas para Cloud Firestore (`firestore.rules`)

Estas reglas garantizan que ningún usuario ajeno pueda leer postulaciones de otros candidatos ni inyectar datos no autorizados:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Bloqueo global por defecto (Zero-Trust)
    match /{document=**} {
      allow read, write: if false;
    }

    // Funciones auxiliares de seguridad
    function incoming() {
      return request.resource.data;
    }

    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn() &&
        request.auth.token.email_verified == true &&
        request.auth.token.email == 'luisperera87@gmail.com';
    }

    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$');
    }

    // Validador estricto del sub-objeto de fotografía segura
    function isValidFotoMeta(foto) {
      return foto is map &&
        foto.keys().hasAll(['storagePath', 'nombreOriginal', 'tamañoBytes', 'tipoMime']) &&
        foto.keys().hasOnly(['storagePath', 'nombreOriginal', 'tamañoBytes', 'tipoMime', 'subidoEl']) &&
        foto.storagePath is string && foto.storagePath.size() <= 256 && foto.storagePath.matches('^postulaciones/[a-zA-Z0-9_\\-]+/[a-zA-Z0-9_\\-\\.]+$') &&
        foto.nombreOriginal is string && foto.nombreOriginal.size() >= 1 && foto.nombreOriginal.size() <= 150 &&
        foto.tamañoBytes is int && foto.tamañoBytes > 0 && foto.tamañoBytes <= 5242880 && // Máx 5 MB
        foto.tipoMime in ['image/jpeg', 'image/png', 'image/webp'];
    }

    // Validador completo de la postulación
    function isValidPostulacion(data) {
      return (
        // Validación de claves
        data.keys().hasAll([
          'nombre', 'edad', 'telefono', 'zona', 'experiencia',
          'disponibilidad', 'punto_partida', 'motivacion',
          'tieneFoto', 'estado', 'creadoEl'
        ]) &&
        data.keys().hasOnly([
          'nombre', 'edad', 'telefono', 'zona', 'experiencia',
          'disponibilidad', 'punto_partida', 'motivacion',
          'talento', 'tieneFoto', 'foto', 'estado', 'creadoEl'
        ]) &&

        // Campos requeridos
        data.nombre is string && data.nombre.size() >= 3 && data.nombre.size() <= 100 &&
        data.edad is int && data.edad >= 16 && data.edad <= 80 &&
        data.telefono is string && data.telefono.size() >= 7 && data.telefono.size() <= 30 &&
        data.zona is string && data.zona.size() >= 2 && data.zona.size() <= 100 &&
        data.motivacion is string && data.motivacion.size() >= 10 && data.motivacion.size() <= 2000 &&

        // Opciones de selección
        data.experiencia in [
          'Sí, tengo experiencia.',
          'Tengo algo de experiencia.',
          'No tengo experiencia, pero quiero aprender.'
        ] &&
        data.disponibilidad in [
          'Sí, tengo disponibilidad.',
          'Tengo disponibilidad parcial.',
          'No tengo disponibilidad habitual.'
        ] &&
        data.punto_partida in [
          'Sí, sin inconvenientes.',
          'Sí, pero necesito conocer el horario con anticipación.',
          'Se me dificulta llegar al punto de partida.'
        ] &&

        // Campo opcional talento
        (!('talento' in data) || (data.talento is string && data.talento.size() <= 500)) &&

        // Validación de fotografía
        data.tieneFoto is bool &&
        (!data.tieneFoto || ('foto' in data && isValidFotoMeta(data.foto))) &&

        // Estado inicial inmutable y timestamp oficial
        data.estado == 'pendiente' &&
        data.creadoEl == request.time
      );
    }

    // Reglas para la colección postulaciones
    match /postulaciones/{postulacionId} {
      // Creación pública validada estrictamente
      allow create: if isValidId(postulacionId) && isValidPostulacion(incoming());

      // Lectura privada exclusiva para el administrador
      allow get, list: if isAdmin();

      // Prohibición de actualización y borrado desde el cliente público
      allow update, delete: if isAdmin();
    }
  }
}
```

---

### B. Reglas Propuestas para Firebase Storage (`storage.rules`)

Estas reglas garantizan que solo se puedan subir imágenes válidas a la carpeta de cada postulación, y que **nadie del público pueda descargarlas ni leerlas**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Bloqueo global de lectura y escritura
    match /{allPaths=**} {
      allow read, write: if false;
    }

    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn() &&
        request.auth.token.email_verified == true &&
        request.auth.token.email == 'luisperera87@gmail.com';
    }

    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$');
    }

    function isValidFileName(name) {
      return name is string && name.size() <= 100 && name.matches('^[a-zA-Z0-9_\\-\\.]+$');
    }

    // Reglas específicas para fotografías de postulaciones
    match /postulaciones/{postulacionId}/{fileName} {
      
      // Subida pública restringida al candidato durante el registro
      allow create: if isValidId(postulacionId) &&
        isValidFileName(fileName) &&
        request.resource.size <= 5 * 1024 * 1024 && // Máximo 5 MB
        request.resource.contentType in [
          'image/jpeg',
          'image/png',
          'image/webp'
        ];

      // Lectura estrictamente privada: solo el administrador autorizado puede ver/descargar
      allow read: if isAdmin();

      // Borrado: permitido al administrador y para rollback de la operación
      allow delete: if isAdmin();
    }
  }
}
```

---

## 4. Gestión de Errores y Prevención de Archivos Huérfanos

Para satisfacer el requisito de consistencia y confirmación honesta:

1. **Secuencia de Ejecución:**
   ```
   [Inicio Envío]
        │
        ├─► 1. Validar campos en cliente. Si hay error -> Marcar campos y abortar.
        │
        ├─► 2. Deshabilitar botón + mostrar "Enviando postulación...".
        │
        ├─► 3. Generar postulacionId único mediante doc(collection(db, 'postulaciones')).id.
        │
        ├─► 4. ¿Hay foto adjunta?
        │       ├─► SÍ:
        │       │    a) Subir archivo a Storage: ref(storage, `postulaciones/${postulacionId}/foto.${ext}`)
        │       │    b) Si la subida a Storage falla -> Capturar error, reactivar botón y alertar al usuario.
        │       │       (Firestore nunca es tocado).
        │       │    c) Si Storage tiene éxito -> Guardar referencia en metadata para Firestore.
        │       │
        │       ├─► NO: Proceder directamente al paso 5.
        │
        ├─► 5. Guardar documento en Firestore con setDoc(doc(db, 'postulaciones', postulacionId), data).
        │       │
        │       ├─► Si falla setDoc():
        │       │    a) Si se había subido foto a Storage -> Invocar deleteObject(fotoRef) de inmediato
        │       │       para revertir y limpiar el archivo huérfano.
        │       │    b) Reactivar botón y mostrar mensaje explicativo de fallo de conexión.
        │       │
        │       └─► Si setDoc() tiene éxito:
        │            a) Limpiar formulario y estado de foto en memoria.
        │            b) Desplegar modal de confirmación con el código oficial de postulación.
   ```

2. **Privacidad Absoluta:**
   - **No se llamará a `getDownloadURL()`**.
   - En Firestore solo se guarda la ruta interna (`storagePath: "postulaciones/abc123xyz/foto.jpg"`).
   - Como las reglas de Storage bloquean `read` a usuarios no autenticados, ningún visitante puede acceder a las fotos por URL directa. El panel administrativo consultará la fotografía mediante autenticación segura con la cuenta autorizada.

---

## 5. Verificación del Proyecto `tour-azul-app-web` y Disponibilidad de Storage

1. **Proyecto Existente:**
   - Se utilizará estrictamente el proyecto `tour-azul-app-web`.
   - No se crearán proyectos adicionales ni configuraciones ficticias.
2. **Requisitos de Firebase Storage:**
   - Firebase Storage requiere que el servicio de Cloud Storage esté habilitado en el proyecto Firebase (`tour-azul-app-web`).
   - El bucket predeterminado en Firebase sigue el formato `tour-azul-app-web.firebasestorage.app` o `tour-azul-app-web.appspot.com`.
   - En la fase de ejecución, comprobaremos la disponibilidad del bucket y las credenciales del SDK web público (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).
3. **Cero Secretos en el Frontend:**
   - Únicamente se incorporará la configuración pública del cliente web.
   - Jamás se incluirán claves de servicio (`serviceAccountKey.json`), tokens privados de administración ni variables de entorno secretas en el código accesible por el navegador.

---

## 6. Revisión del Proceso de Compilación para Vercel

### Diagnóstico Actual:
- En `package.json`, el script de build actual es:
  ```json
  "build": "vite build"
  ```
- **Problema detectado:** El archivo `index.html` del repositorio no se compila directamente desde `src/`, sino que es el resultado del ensamblador modular `node scripts/generate-full-page.js` que toma los módulos `data.js`, `recruitment-module.js`, `featured-trips-module.js`, etc. Si Vercel ejecuta únicamente `vite build`, compilará el HTML estático previo sin incorporar las actualizaciones de los scripts modulares.

### Solución a Implementar:
- Actualizar el script de `package.json` a:
  ```json
  "build": "node scripts/generate-full-page.js && vite build"
  ```
- De esta manera, cada despliegue en Vercel primero ejecuta el generador para asegurar que `index.html` tenga todos los componentes y scripts sincronizados, y a continuación Vite empaqueta la distribución final en la carpeta `dist`.

---

## 7. Garantía de Inmutabilidad de los Sistemas Existentes

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ZONA PROTEGIDA INTACTA                          │
├────────────────────────────────────────────────────────────────────────┤
│  ✓ Catálogo de viajes y destinos (scripts/data.js)                     │
│  ✓ Selección visual interactiva de los 31 asientos del bus            │
│  ✓ Algoritmo de tarifas, abono de 5 € y conversión Tasa Oficial BCV    │
│  ✓ Integración con Google Sheets y Apps Script (Code.gs)              │
│  ✓ Generación de boletos y descarga de tickets (html2canvas)          │
│  ✓ Módulo de viajes destacados y opiniones                            │
└────────────────────────────────────────────────────────────────────────┘
```

El módulo de postulaciones opera bajo un namespace de eventos y estado aislado (`recruitmentState`), sin interactuar ni interferir con la máquina de estados del wizard de reservas (`state`).

---

## 8. Protocolo de Pruebas Previsto

Una vez aprobado este plan, se ejecutarán las siguientes pruebas ordenadas:

1. **Prueba de Build y Generación de Vercel:**
   - Ejecutar `node scripts/generate-full-page.js` para asegurar que el HTML se construya sin errores de sintaxis ni caracteres truncados.
   - Ejecutar `npm run build` (`node scripts/generate-full-page.js && vite build`) para confirmar la compilación completa de la carpeta `dist`.
   - Ejecutar `npm run lint` (`tsc --noEmit`).

2. **Pruebas de Validación del Formulario y Fotografía:**
   - **Formato inválido:** Intentar adjuntar un archivo `.pdf`, `.gif` o `.exe` y verificar que el validador lo rechace inmediatamente con mensaje claro.
   - **Límite de tamaño:** Intentar adjuntar una imagen mayor a 5 MB y verificar que el cliente impida la carga con mensaje que indique el peso actual.
   - **Formato válido:** Cargar una imagen `.jpg` o `.png` menor a 5 MB y verificar la previsualización local, nombre y tamaño.

3. **Prueba de Subida y Consistencia en Firebase:**
   - Enviar una postulación completa con fotografía.
   - Verificar en Firebase Storage que la imagen se almacene en la ruta esperada con sus metadatos y acceso restringido.
   - Verificar en Cloud Firestore que el documento se cree en la colección `postulaciones` con su timestamp oficial, datos validados y la referencia al archivo.
   - Confirmar que el navegador muestre el modal definitivo de éxito con el código de postulación.

4. **Prueba de Privacidad y Seguridad (Zero-Trust):**
   - Intentar acceder directamente al archivo de Storage sin autenticación y verificar respuesta `403 Forbidden` / `unauthorized`.
   - Intentar consultar la colección de Firestore desde el cliente anónimo y comprobar que la lectura está totalmente bloqueada.

5. **Prueba de Resiliencia y Rollback (Anti-Huérfanos):**
   - Simular una interrupción en el guardado de Firestore para comprobar que se ejecuta la compensación en Storage evitando archivos huérfanos.

6. **Prueba de No-Regresión Funcional:**
   - Abrir el cotizador y asistente de reservas.
   - Probar la selección de asientos del bus (1 al 31).
   - Verificar el cálculo en Bolívares con la tasa BCV y la generación del boleto.
