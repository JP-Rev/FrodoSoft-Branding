# Promos para WhatsApp

`precio-whatsapp.cjs` genera el mockup del precio y la promoción (primer mes
gratis), que se manda por WhatsApp en vez de publicarse en la landing.

```bash
node promos/precio-whatsapp.cjs promos/salida
```

- El precio, la nota y el WhatsApp están al principio del script.
- Sale en 1080×1080 (feed / chat) y 1080×1920 (estado de WhatsApp).
- Necesita Playwright con Chromium y las fuentes Inter instaladas en
  `/usr/share/fonts/opentype/inter`.
