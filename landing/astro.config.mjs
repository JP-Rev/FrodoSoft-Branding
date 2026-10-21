// @ts-check
import { defineConfig } from 'astro/config'

// Sitio 100% estatico: `npm run build` deja todo en dist/ y lo sirve el
// nginx del contenedor (ver Dockerfile). No hay server de Node en produccion.
export default defineConfig({
  site: 'https://www.frodosoft.com.ar',
})
