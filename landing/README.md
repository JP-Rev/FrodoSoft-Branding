# Landing de Frodosoft — www.frodosoft.com.ar

Sitio estático en Astro. `npm run build` genera `dist/`, que sirve un nginx
dentro de un contenedor publicado en `127.0.0.1:3030`. Al público entra por el
nginx del host (`deploy/landing-frodosoft.conf`), detrás de Cloudflare.

- Textos de contacto y precio: `src/datos.ts`.
- Mockups: `src/assets/productos/` (capturas de las apps reales **con datos
  inventados**; no reemplazarlas por capturas de producción).

## Desarrollo local

```bash
npm ci
npm run dev        # http://localhost:4321
```

## Despliegue en el VPS

En orden. **Cloudflare va al final**: si se proxya antes de que el origen
responda, `www` queda dando error 521/526.

### 1. Contenedor

```bash
cd /srv/docker
git clone https://github.com/JP-Rev/FrodoSoft-Branding.git frodosoft-branding   # la primera vez
cd /srv/docker/frodosoft-branding && git pull
cd landing
docker compose up -d --build
```

Verificar:

```bash
docker ps --filter name=frodosoft_landing
curl -sI http://127.0.0.1:3030/ | head -1          # HTTP/1.1 200 OK
```

### 2. Nginx del host

```bash
cp /srv/docker/frodosoft-branding/landing/deploy/landing-frodosoft.conf /etc/nginx/sites-available/landing-frodosoft
ln -s /etc/nginx/sites-available/landing-frodosoft /etc/nginx/sites-enabled/landing-frodosoft
nginx -t && systemctl reload nginx
```

Verificar el origen sin pasar por Cloudflare:

```bash
curl -kI --resolve www.frodosoft.com.ar:443:127.0.0.1 https://www.frodosoft.com.ar/   # 200
curl -kI --resolve frodosoft.com.ar:443:127.0.0.1 https://frodosoft.com.ar/           # 301 -> www
```

Revertir: `rm /etc/nginx/sites-enabled/landing-frodosoft && nginx -t && systemctl reload nginx`.

### 3. Cloudflare (dominio `frodosoft.com.ar`)

1. **DNS → Records**: los registros `frodosoft.com.ar` y `www` hoy están en
   *DNS only* (nube gris). Editar cada uno y pasarlo a **Proxied** (nube
   naranja). No cambiar el contenido (la IP del VPS) ni tocar ningún otro
   registro — en especial los de `mail.frodosoft.com.ar` (MX/TXT de Mailgun),
   que tienen que seguir como están.
   - Si `www` no existe: **Add record** → `CNAME`, nombre `www`, destino
     `frodosoft.com.ar`, Proxied.
2. **SSL/TLS → Overview**: confirmar que sigue en **Full (strict)**. No hay que
   cambiar nada: el certificado Origin del VPS es para `frodosoft.com.ar` y
   `*.frodosoft.com.ar`, así que cubre el apex y `www`.
3. **SSL/TLS → Edge Certificates**: el certificado universal ya cubre
   `frodosoft.com.ar` y `*.frodosoft.com.ar`. Opcional: activar
   *Always Use HTTPS*.

Verificar desde afuera:

```bash
dig +short www.frodosoft.com.ar      # IPs de Cloudflare (104.x / 172.6x), NO la del VPS
dig +short frodosoft.com.ar
curl -sI https://www.frodosoft.com.ar/ | grep -iE "^HTTP|cf-cache-status|server"
curl -sI https://frodosoft.com.ar/ | grep -iE "^HTTP|location"   # 301 -> https://www...
```

⚠️ **Al proxyar el apex, `ssh root@frodosoft.com.ar` deja de funcionar**:
Cloudflare solo deja pasar HTTP/HTTPS. Entrar por SSH con la IP del VPS.

## Actualizar el sitio

```bash
cd /srv/docker/frodosoft-branding && git pull
cd landing && docker compose up -d --build
```

El HTML sale con `Cache-Control: no-cache`, así que no hace falta purgar la
caché de Cloudflare después de un deploy.
