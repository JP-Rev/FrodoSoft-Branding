/*
 * Mockup del precio y la promocion (primer mes gratis) para mandar por
 * WhatsApp. Misma plantilla que las piezas de Kinetic y VetAdmin (fondo
 * oscuro, kicker, titulo, pie con la marca), con el acento teal que comparten
 * las dos apps.
 *
 * El precio y el contacto se cambian aca arriba y se regenera:
 *   node precio-whatsapp.cjs salida
 */
const { chromium } = require('/opt/node-tools/node_modules/playwright')
const fs = require('fs')
const path = require('path')

const SALIDA = path.resolve(process.argv[2] || 'salida')

// ---- Lo que cambia seguido ------------------------------------------------
const PRECIO = '$20.000'
const POR = '/ mes por sistema'
// Cada app con su color: Kinetic teal, VetAdmin ambar.
const NOTA = '<b class="k">Kinetic</b> o <b class="v">VetAdmin</b>: cada sistema se contrata por separado.'
const WHATSAPP = '2346 48-2861'
const PUNTOS = [
  'Hosting, dominio seguro (HTTPS) y respaldo diario',
  'Actualizaciones y soporte',
  'Ajustes a la medida de tu forma de trabajo',
]
// ---------------------------------------------------------------------------

const FONTS = '/usr/share/fonts/opentype/inter'
const ASSETS = path.join(__dirname, 'assets')
const ACENTO = '#0d9488'
const ACENTO_CLARO = '#5eead4'
const ACENTO_OSCURO = '#0d5564'

const b64 = (f) => fs.readFileSync(f).toString('base64')
const png = (f) => `data:image/png;base64,${b64(path.join(ASSETS, f))}`
const fuente = (archivo, familia, peso) => `
@font-face { font-family: '${familia}'; font-weight: ${peso}; font-style: normal;
  src: url(data:font/otf;base64,${b64(path.join(FONTS, archivo))}) format('opentype'); }`
const CSS_FUENTES = [
  fuente('InterDisplay-Bold.otf', 'Inter Display', 700),
  fuente('Inter-Regular.otf', 'Inter', 400),
  fuente('Inter-Medium.otf', 'Inter', 500),
  fuente('Inter-SemiBold.otf', 'Inter', 600),
].join('\n')

const FORMATOS = [
  { id: 'feed', w: 1080, h: 1080 },
  { id: 'historia', w: 1080, h: 1920 },
]

function html(f) {
  const hist = f.id === 'historia'
  const pad = 76
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
${CSS_FUENTES}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: ${f.w}px; height: ${f.h}px; }
body {
  font-family: 'Inter', sans-serif; color: #e8eef5; overflow: hidden;
  display: flex; flex-direction: column;
  background:
    radial-gradient(45% 38% at 6% 100%, rgba(13,148,136,.30) 0%, rgba(13,148,136,0) 70%),
    radial-gradient(120% 90% at 85% 0%, ${ACENTO_OSCURO} 0%, #0d2338 45%, #0a1526 100%);
}
.cuerpo { flex: 1; display: flex; flex-direction: column; padding: ${hist ? '120px' : '64px'} ${pad}px 0; }
.kicker { font-size: ${hist ? 25 : 21}px; font-weight: 600; text-transform: uppercase; letter-spacing: .18em; color: ${ACENTO_CLARO}; }
h1 {
  font-family: 'Inter Display', sans-serif; font-weight: 700; color: #fff; letter-spacing: -.03em;
  font-size: ${hist ? 108 : 78}px; line-height: 1.02; margin: ${hist ? 30 : 20}px 0 ${hist ? 52 : 30}px;
}
h1 em { font-style: normal; color: ${ACENTO_CLARO}; }
.precio {
  align-self: flex-start; border: 2px solid rgba(94,234,212,.38); border-radius: ${hist ? 40 : 30}px;
  background: linear-gradient(135deg, rgba(13,148,136,.24), rgba(13,148,136,.08));
  padding: ${hist ? '44px 56px 40px' : '28px 44px 26px'};
}
.monto { display: flex; flex-wrap: wrap; align-items: baseline; gap: ${hist ? '0 22px' : '0 16px'}; }
.monto strong { font-family: 'Inter Display', sans-serif; font-weight: 700; color: #fff; letter-spacing: -.04em; font-size: ${hist ? 176 : 116}px; line-height: 1; }
.monto span { white-space: nowrap; font-size: ${hist ? 40 : 30}px; font-weight: 500; color: #a8bccd; }
.nota { margin-top: ${hist ? 18 : 12}px; font-size: ${hist ? 26 : 23}px; color: #93a9bd; line-height: 1.4; }
.nota b { font-weight: 600; }
.nota .k { color: #5eead4; }
.nota .v { color: #fcd34d; }
.app:last-child strong { color: #fcd34d; }
.app:first-child strong { color: #5eead4; }
.puntos { list-style: none; display: flex; flex-direction: column; gap: ${hist ? 34 : 20}px; margin-top: ${hist ? 64 : 34}px; }
.puntos li { display: flex; align-items: center; gap: 24px; font-size: ${hist ? 34 : 29}px; font-weight: 500; color: #e8eef5; }
.tick { width: ${hist ? 22 : 17}px; height: ${hist ? 22 : 17}px; border-radius: 50%; background: ${ACENTO}; flex: none; box-shadow: 0 0 0 8px rgba(13,148,136,.2); }
.cta {
  align-self: flex-start; margin-top: auto; margin-bottom: ${hist ? 64 : 40}px;
  font-size: ${hist ? 38 : 29}px; font-weight: 600; color: #04121d; background: ${ACENTO_CLARO};
  padding: ${hist ? '30px 50px' : '21px 36px'}; border-radius: 999px;
  box-shadow: 0 18px 40px rgba(94,234,212,.22);
}
footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: ${hist ? '40px' : '30px'} ${pad}px ${hist ? '48px' : '36px'};
  background: rgba(4,12,20,.55); border-top: 1px solid rgba(255,255,255,.08);
}
.apps { display: flex; align-items: center; gap: ${hist ? 34 : 26}px; }
.app { display: flex; align-items: center; gap: ${hist ? 18 : 14}px; }
.app img { width: ${hist ? 76 : 60}px; height: ${hist ? 76 : 60}px; border-radius: ${hist ? 18 : 15}px; }
.app strong { font-family: 'Inter Display', sans-serif; font-weight: 700; font-size: ${hist ? 36 : 29}px; letter-spacing: -.02em; color: #fff; }
.frodo { display: flex; align-items: center; gap: 14px; }
.frodo img { height: ${hist ? 60 : 48}px; filter: invert(1); opacity: .92; }
.frodo span { font-size: ${hist ? 24 : 19}px; color: #9db2c4; }
</style></head><body>
  <div class="cuerpo">
    <div class="kicker">Suscripción mensual</div>
    <h1>Probalo un mes<br><em>gratis</em></h1>
    <div class="precio">
      <div class="monto"><strong>${PRECIO}</strong><span>${POR}</span></div>
      <p class="nota">${NOTA}</p>
    </div>
    <ul class="puntos">${PUNTOS.map((t) => `<li><span class="tick"></span>${t}</li>`).join('')}</ul>
    <div class="cta">Escribinos por WhatsApp · ${WHATSAPP}</div>
  </div>
  <footer>
    <div class="apps">
      <div class="app"><img src="${png('kinetic-icon.png')}" alt=""><strong>Kinetic</strong></div>
      <div class="app"><img src="${png('vetadmin-icon.png')}" alt=""><strong>VetAdmin</strong></div>
    </div>
    <div class="frodo"><img src="${png('frodosoft-logo-black.png')}" alt=""><span>frodosoft.com.ar</span></div>
  </footer>
</body></html>`
}

;(async () => {
  fs.mkdirSync(SALIDA, { recursive: true })
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
  for (const f of FORMATOS) {
    const ctx = await browser.newContext({ viewport: { width: f.w, height: f.h }, deviceScaleFactor: 1 })
    const page = await ctx.newPage()
    await page.setContent(html(f), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(250)
    const file = path.join(SALIDA, `precio-whatsapp-${f.id}-${f.w}x${f.h}.png`)
    await page.screenshot({ path: file })
    console.log('ok', path.basename(file))
    await ctx.close()
  }
  await browser.close()
})()
