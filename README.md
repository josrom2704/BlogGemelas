# Dos Veces Soñadoras

Blog personal de María Fernanda y María Jimena, escrito con [Astro](https://astro.build). Sitio 100% estático, sin backend, listo para desplegar en Netlify o Vercel.

## Nombre del blog

El nombre actual (`Dos Veces Soñadoras`) es provisional y se cambia en un solo lugar: `src/config.ts` → `site.nombre`. Otras opciones pensadas para gemelas:

1. **Dos Veces Soñadoras**
2. **Doble Sueño**
3. **Fer & Jime**

## Correr el proyecto en local

Requisitos: [Node.js](https://nodejs.org) 22 o superior.

```bash
npm install
npm run dev
```

El sitio queda disponible en `http://localhost:4321`.

Otros comandos útiles:

```bash
npm run build    # genera el sitio estático en dist/
npm run preview  # sirve dist/ para revisar el build de producción
```

## Crear un post nuevo

1. Copia la plantilla `templates/post.md` dentro de `src/content/blog/` con un nombre de archivo corto y sin espacios (ese nombre será la URL del post, ej. `mi-nuevo-post.md` → `/blog/mi-nuevo-post/`).
2. Completa el frontmatter:
   - `title`, `date`, `description`
   - `cover`: ruta de la imagen dentro de `/public/images/`
   - `category`: una de `HMUN 2027`, `Recaudación`, `Vida`, `Colegio`, `Viajes`
   - `author`: `fernanda`, `jimena` o `ambas`
   - `draft: true` mientras lo estás escribiendo; cámbialo a `false` (o bórralo) para publicarlo
3. Escribe el contenido en Markdown debajo del frontmatter.
4. Guarda la imagen de portada en `public/images/`.

**Importante — privacidad:** ambas son menores de edad. En cualquier post nuevo, usa solo nombres de pila (incluyendo los de Lourdes y Camila), y no incluyas apellidos, dirección, colegio ni edad exacta.

## Cambiar bios, contactos y fecha del evento

Todo el contenido editable vive en **`src/config.ts`**:

- `site`: nombre, lema y descripción del blog
- `autoras`: bio, gustos, sueños y frase de cada hermana
- `loQueCompartimos`: lista de la sección "Lo que compartimos"
- `hmun`: fecha del evento (usada por la cuenta regresiva), delegación y descripción de HMUN
- `contactosAyuda`: números de WhatsApp para la página "Cómo ayudar" (los números nunca se muestran en texto plano, solo se usan para generar el link `wa.me`)
- `actividadesRecaudacion`: rifa, Garage Sale, donaciones, etc.
- `categorias`: categorías disponibles para los posts

## Imágenes

Coloca estos archivos en `public/images/` (ya existen placeholders generados automáticamente que puedes reemplazar):

- `hmun-flyer.jpeg` — portada del post "¡Nos vamos a Harvard!"
- `garage-sale.jpeg` — portada del post del Garage Sale
- `fernanda.jpg` / `jimena.jpg` — fotos de perfil de cada hermana (si no existen, se muestra automáticamente su inicial en un círculo de su color)

No se usa la carta de invitación oficial de HMUN como imagen del sitio.

## Desplegar

### Netlify

1. Sube el proyecto a un repositorio de GitHub/GitLab.
2. En Netlify, "Add new site" → "Import an existing project".
3. Build command: `npm run build` — Publish directory: `dist`.

### Vercel

1. Sube el proyecto a un repositorio.
2. En Vercel, "Add New Project" e importa el repositorio (detecta Astro automáticamente).
3. Build command: `npm run build` — Output directory: `dist`.

Antes de desplegar, actualiza la URL final del sitio en dos lugares: `site.url` en `src/config.ts` y `site` en `astro.config.mjs`. Esto es lo que usan el sitemap, el RSS y las etiquetas Open Graph para compartir en redes.
