# El Salvador MUN Delegation

Blog de la delegación de El Salvador (María Fernanda, María Jimena, Lourdes y Camila) y sus colaboradores rumbo al Harvard Model United Nations 2027, escrito con [Astro](https://astro.build) y desplegado en Vercel. Las páginas públicas son estáticas; el panel `/admin` corre en el servidor y publica los posts haciendo commits al repositorio.

## Nombre del blog

El nombre se cambia en un solo lugar: `src/config.ts` → `site.nombre` (`El Salvador MUN Delegation`) y `site.usuario` (`elsalvadormundelegation`).

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

## Panel de publicación (`/admin`)

La forma normal de publicar es el panel en `https://<tu-sitio>/admin`. Cada integrante o colaborador entra con su propio usuario y contraseña y puede:

- Ver todos los posts (publicados y borradores) leídos directamente del repositorio.
- Crear un post con editor Markdown, barra de formato, portada e imágenes dentro del texto.
- Editar cualquier post (la URL no cambia aunque cambie el título).
- Publicar / pasar a borrador con un clic, o eliminar un post.

Cada acción es **un solo commit** en GitHub (post + imágenes juntos); Vercel lo detecta y redespliega el sitio en uno o dos minutos. Las imágenes se reducen en el navegador (máx. 1600px, JPG) porque Vercel limita cada petición a ~4.5MB.

### Configuración

Copia `.env.example` como `.env` para probar en local, y configura las mismas variables en Vercel → Project Settings → Environment Variables:

- `<PERSONA>_USER` / `<PERSONA>_PASS`: credenciales del panel de cada persona definida en `src/config.ts`, usando su clave en mayúsculas: `FERNANDA_USER`, `JIMENA_USER`, `LOURDES_USER`, `CAMILA_USER`, etc. Quien no tenga sus dos variables configuradas simplemente no puede entrar.
- `SESSION_SECRET`: texto largo y aleatorio para firmar la sesión.
- `GITHUB_TOKEN`: token *fine-grained* con acceso solo a este repositorio y permiso **Contents: Read and write**.
- `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`: repositorio y rama donde se publican los posts.

### Estructura del código

| Ruta | Qué hace |
| --- | --- |
| `src/middleware.ts` | Protege `/admin/*` y `/api/*` (salvo login/logout) con la cookie de sesión. |
| `src/lib/auth.ts` | Credenciales y token de sesión firmado (HMAC). |
| `src/lib/github.ts` | Cliente de la API de GitHub: leer archivos y hacer commits con varios archivos. |
| `src/lib/admin/frontmatter.ts` | Lee y escribe el formato de los posts (frontmatter + Markdown). |
| `src/lib/admin/formulario.ts` | Valida lo que envía el editor (campos e imágenes). |
| `src/lib/admin/posts-repo.ts` | Listar, crear, editar, publicar/despublicar y eliminar posts. |
| `src/pages/api/posts/` | API: `GET`/`POST /api/posts`, `PUT`/`PATCH`/`DELETE /api/posts/:slug`. |
| `src/pages/admin/` | Pantallas: lista de posts, nuevo, editar y login. |
| `src/components/admin/FormularioPost.astro` | Editor compartido por "nuevo" y "editar". |

Las portadas se guardan en `public/images/<slug>-portada-*.jpg` y las imágenes del contenido en `public/images/posts/`.

## Crear un post a mano (sin el panel)

1. Copia la plantilla `templates/post.md` dentro de `src/content/blog/` con un nombre de archivo corto y sin espacios (ese nombre será la URL del post, ej. `mi-nuevo-post.md` → `/blog/mi-nuevo-post/`).
2. Completa el frontmatter:
   - `title`, `date`, `description`
   - `cover`: ruta de la imagen dentro de `/public/images/`
   - `category`: una de `HMUN 2027`, `Recaudación`, `Vida`, `Colegio`, `Viajes`
   - `author`: la clave de una persona (`"lourdes"`) o una lista si escribieron varias (`["fernanda", "camila"]`)
   - `draft: true` mientras lo estás escribiendo; cámbialo a `false` (o bórralo) para publicarlo
3. Escribe el contenido en Markdown debajo del frontmatter.
4. Guarda la imagen de portada en `public/images/`.

**Importante — privacidad:** las integrantes son menores de edad. En cualquier post nuevo, usa solo nombres de pila y no incluyas apellidos, dirección, colegio ni edad exacta (apellidos, colegio y grado solo aparecen en las presentaciones y trayectorias de "Sobre nosotras").

## Cambiar bios, contactos y fecha del evento

Todo el contenido editable vive en **`src/config.ts`**:

- `site`: nombre, lema y descripción del blog
- `integrantes`: las 4 delegadas (nombre, color, foto, frase, gustos y sueños)
- `colaboradores`: personas que ayudan y también publican; para agregar a alguien, añade una entrada aquí y configura sus variables `<CLAVE>_USER` / `<CLAVE>_PASS` en Vercel
- `loQueCompartimos`: lista de la sección "Lo que compartimos"
- `hmun`: fecha del evento (usada por la cuenta regresiva), delegación y descripción de HMUN
- `contactosAyuda`: números de WhatsApp para la página "Cómo ayudar" (los números nunca se muestran en texto plano, solo se usan para generar el link `wa.me`)
- `actividadesRecaudacion`: rifa, Garage Sale, donaciones, etc.
- `categorias`: categorías disponibles para los posts

## Imágenes

Coloca estos archivos en `public/images/` (ya existen placeholders generados automáticamente que puedes reemplazar):

- `hmun-flyer.jpeg` — portada del post "¡Nos vamos a Harvard!"
- `garage-sale.jpeg` — portada del post del Garage Sale
- `fernanda.jpg`, `jimena.jpg`, `lourdes.jpg`, `camila.jpg` — fotos de perfil de cada integrante (si no existen, se muestra automáticamente su inicial en un círculo de su color)

No se usa la carta de invitación oficial de HMUN como imagen del sitio.

## Desplegar

El sitio usa el adaptador de Vercel (el panel necesita funciones de servidor).

1. Sube el proyecto a un repositorio.
2. En Vercel, "Add New Project" e importa el repositorio (detecta Astro automáticamente).
3. Configura las variables de entorno del panel (ver arriba).

Antes de desplegar, actualiza la URL final del sitio en dos lugares: `site.url` en `src/config.ts` y `site` en `astro.config.mjs`. Esto es lo que usan el sitemap, el RSS y las etiquetas Open Graph para compartir en redes.
