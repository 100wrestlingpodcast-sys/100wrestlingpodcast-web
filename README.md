# 100% Wrestling Podcast Web App

Esta es la aplicación web oficial y PWA para **100% Wrestling Podcast**. Ha sido construida utilizando React, TypeScript, Tailwind CSS v4, Lucide Icons, Vite y PWA Service Workers.

El proyecto está diseñado para sentirse como una aplicación nativa móvil en teléfonos (barra de navegación inferior) y como un completo portal deportivo en desktop (barra de navegación superior).

---

## Estructura del Proyecto

* `src/assets/`: Carpeta con los logotipos oficiales de los shows y los banners publicitarios.
* `src/components/`: Componentes comunes del diseño (Header, MobileNavigation, Footer).
* `src/pages/`: Vistas de las pestañas principales (Inicio, Calendario, Enlaces, Mercancía, Contacto).
* `src/services/`: Capa lógica de integración (calendarService.ts) que lee y procesa el CSV de Google Sheets.
* `src/utils/`: Funciones de utilidad para el formateo de zonas horarias, cálculo de cuentas regresivas y exportación `.ics`.
* `public/`: Contiene los iconos de PWA, `manifest.json`, el service worker `sw.js` y la página de respaldo `offline.html`.

---

## Comandos Disponibles

En el directorio del proyecto puedes ejecutar:

### `npm run dev`
Inicia el servidor de desarrollo local en http://localhost:3000.

### `npm run build`
Compila la aplicación optimizada para producción dentro de la carpeta `dist/`.

### `npm run sync-desktop`
Copia de forma segura y automatizada todos los archivos del proyecto a tu carpeta del Escritorio: `/Users/albertoaliceahernandez/Desktop/100% Wrestling Podcast Web/` (excluyendo archivos del compilador y dependencias pesadas).

---

## Configuración del Calendario de Google Sheets

Para conectar tu propio Google Sheet de administración al calendario dinámico:

1. Crea una hoja de cálculo en Google Sheets.
2. Añade exactamente estas columnas en la primera fila (cabecera):
   `id`, `title`, `program_type`, `event_type`, `date`, `start_time`, `timezone`, `description`, `logo_url`, `banner_url`, `youtube_url`, `patreon_url`, `status`, `featured`, `visible`, `display_order`
3. Rellena los datos de los shows. Por ejemplo:
   * **program_type** valores posibles: `raw`, `dynamite`, `smackdown`, `ple`, `special`
   * **event_type** valores posibles: `weekly`, `ple`, `special`
   * **status** valores posibles: `upcoming`, `live`, `completed`, `cancelled`
   * **featured** y **visible** valores posibles: `TRUE` o `FALSE`
   * **date** formato: `YYYY-MM-DD` (ej. `2026-08-08`)
   * **start_time** formato de 24h: `HH:MM` (ej. `19:00`)
   * **timezone** formato IANA: `America/Chicago`, `America/New_York`, `America/Puerto_Rico`, etc.
4. En Google Sheets, ve a **Archivo > Compartir > Publicar en la Web**.
5. Selecciona la hoja correspondiente, cambia el formato a **Valores separados por comas (.csv)** y pulsa **Publicar**.
6. Copia el enlace generado.
7. Crea un archivo `.env` en la raíz de tu proyecto (o configúralo en las variables de entorno de Netlify/Vercel) con la variable:
   ```env
   VITE_GOOGLE_SHEET_CALENDAR_URL="URL_DEL_CSV_DE_GOOGLE_SHEETS"
   ```

*Nota: Si no se define la variable o falla la conexión, la aplicación cargará automáticamente un calendario de prueba de alta fidelidad para garantizar que la web nunca se vea vacía.*

---

## Cómo Reemplazar Logos y Banners

* Los logotipos y banners cargados localmente se encuentran en la carpeta `src/assets/`.
* Si deseas cambiar el banner promocional de **Ringside Collectibles** de la página de inicio, puedes reemplazar el archivo `src/assets/ringside collectibles banner_.png` con tu nueva imagen manteniendo el mismo nombre, o editar el campo `directLink` y `bannerAsset` en `src/data/siteConfig.ts`.
* El logo de la cabecera e icono general se puede actualizar en `src/assets/100% wrestling logo white.png` y `src/assets/100% wrestling podcast logo.png`.

---

## Cómo Subir a Netlify

Dado que has solicitado que el proyecto resida en la carpeta del Escritorio `100% Wrestling Podcast Web`:

1. Asegúrate de ejecutar `npm run sync-desktop` en el terminal de desarrollo para que el escritorio tenga la última versión de tu código y la carpeta `dist/` compilada.
2. Inicia sesión en tu cuenta de [Netlify](https://www.netlify.com/).
3. Ve a **Add new site > Deploy manually**.
4. Arrastra y suelta la carpeta `dist` que se encuentra dentro de `100% Wrestling Podcast Web` en tu Escritorio.
5. ¡Listo! Netlify servirá tu portal de wrestling en cuestión de segundos de forma gratuita.
6. Si deseas realizar builds automáticas conectando un repositorio de GitHub, configura los comandos en Netlify como:
   * **Build command:** `npm run build`
   * **Publish directory:** `dist`
   * **Environment variable:** `VITE_GOOGLE_SHEET_CALENDAR_URL`
