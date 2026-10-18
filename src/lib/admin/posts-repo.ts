// Operaciones sobre los posts del blog guardados en el repositorio de GitHub.
// El panel siempre lee desde GitHub (no desde el sitio desplegado), así ve los
// cambios recién hechos aunque Vercel todavía no termine de desplegar.

import { commitCambios, leerArchivo, listarDirectorio, type CambioArchivo } from "../github";
import { nombrePorAutor, type AutorPanel } from "../auth";
import { generarSlug } from "../posts";
import { parsearPost, serializarPost, type DatosPost } from "./frontmatter";
import { ErrorValidacion, type EntradaPost } from "./formulario";

const DIR_POSTS = "src/content/blog";
const DIR_IMAGENES = "public/images";
const DIR_IMAGENES_POSTS = "public/images/posts";
export const PORTADA_POR_DEFECTO = "/images/og-default.jpg";

const REGEX_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface PostRepo {
  slug: string;
  datos: DatosPost;
  contenido: string;
  /** Versión del archivo, para detectar ediciones simultáneas. */
  sha: string;
}

/** El post ya cambió en el repo desde que se abrió el editor. */
export class ErrorConflicto extends Error {}

function rutaPost(slug: string): string {
  return `${DIR_POSTS}/${slug}.md`;
}

function base64(texto: string): string {
  return Buffer.from(texto, "utf-8").toString("base64");
}

function hoyEnElSalvador(): string {
  // en-CA formatea como YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/El_Salvador" }).format(new Date());
}

/** Portadas subidas desde el panel: /images/<slug>-portada-<marca>.<ext> */
function esPortadaPropia(slug: string, cover: string): boolean {
  return cover.startsWith(`/images/${slug}-portada`);
}

function rutaRepoDesdeUrl(url: string): string {
  return `public${url}`;
}

/** Arma los cambios de imágenes (portada + imágenes del contenido) de un post. */
function cambiosDeImagenes(
  slug: string,
  entrada: EntradaPost,
  coverActual: string
): { cambios: CambioArchivo[]; cover: string } {
  const cambios: CambioArchivo[] = [];
  let cover = coverActual;

  if (entrada.portada || entrada.quitarPortada) {
    if (esPortadaPropia(slug, coverActual)) {
      cambios.push({ ruta: rutaRepoDesdeUrl(coverActual), eliminar: true });
    }
    cover = PORTADA_POR_DEFECTO;
  }
  if (entrada.portada) {
    const nombre = `${slug}-portada-${Date.now().toString(36)}.${entrada.portada.extension}`;
    cambios.push({ ruta: `${DIR_IMAGENES}/${nombre}`, contenidoBase64: entrada.portada.base64 });
    cover = `/images/${nombre}`;
  }

  for (const [nombre, imagen] of entrada.imagenes) {
    cambios.push({ ruta: `${DIR_IMAGENES_POSTS}/${nombre}`, contenidoBase64: imagen.base64 });
  }

  return { cambios, cover };
}

function datosDesdeEntrada(entrada: EntradaPost, cover: string, fecha: string): DatosPost {
  return {
    title: entrada.titulo,
    date: entrada.fecha ?? fecha,
    description: entrada.descripcion,
    cover,
    coverAlt: cover === PORTADA_POR_DEFECTO ? undefined : entrada.portadaAlt,
    category: entrada.categoria,
    tags: entrada.tags,
    author: entrada.autores,
    draft: entrada.borrador,
  };
}

// ----------------------------------------------------------------------------
// Lectura
// ----------------------------------------------------------------------------

export async function listarPosts(): Promise<PostRepo[]> {
  const archivos = (await listarDirectorio(DIR_POSTS)).filter(
    (a) => a.type === "file" && a.name.endsWith(".md")
  );

  const posts = await Promise.all(
    archivos.map(async (archivo) => {
      const slug = archivo.name.replace(/\.md$/, "");
      const leido = await leerArchivo(archivo.path);
      if (!leido) return null;
      try {
        return { slug, sha: leido.sha, ...parsearPost(leido.texto) };
      } catch {
        return null; // Un archivo con formato roto no debe tumbar todo el panel.
      }
    })
  );

  return posts
    .filter((p): p is PostRepo => p !== null)
    .sort((a, b) => b.datos.date.localeCompare(a.datos.date));
}

export async function obtenerPost(slug: string): Promise<PostRepo | null> {
  if (!REGEX_SLUG.test(slug)) return null;
  const leido = await leerArchivo(rutaPost(slug));
  if (!leido) return null;
  return { slug, sha: leido.sha, ...parsearPost(leido.texto) };
}

// ----------------------------------------------------------------------------
// Escritura
// ----------------------------------------------------------------------------

async function slugDisponible(titulo: string): Promise<string> {
  const base = generarSlug(titulo);
  if (!base) throw new ErrorValidacion("El título debe tener al menos una letra o número.");

  const existentes = new Set((await listarDirectorio(DIR_POSTS)).map((a) => a.name.replace(/\.md$/, "")));
  let candidato = base;
  for (let sufijo = 2; existentes.has(candidato); sufijo++) {
    candidato = `${base}-${sufijo}`;
  }
  return candidato;
}

export async function crearPost(entrada: EntradaPost, autorSesion: AutorPanel): Promise<string> {
  const slug = await slugDisponible(entrada.titulo);
  const { cambios, cover } = cambiosDeImagenes(slug, entrada, PORTADA_POR_DEFECTO);
  const datos = datosDesdeEntrada(entrada, cover, hoyEnElSalvador());

  cambios.push({ ruta: rutaPost(slug), contenidoBase64: base64(serializarPost(datos, entrada.contenido)) });
  const tipo = entrada.borrador ? "Borrador" : "Nuevo post";
  await commitCambios(cambios, `${tipo}: ${entrada.titulo} (por ${nombrePorAutor(autorSesion)})`);
  return slug;
}

export async function actualizarPost(
  slug: string,
  entrada: EntradaPost,
  shaEsperado: string,
  autorSesion: AutorPanel
): Promise<void> {
  const actual = await obtenerPost(slug);
  if (!actual) throw new ErrorValidacion("Ese post ya no existe.");
  if (shaEsperado && actual.sha !== shaEsperado) {
    throw new ErrorConflicto(
      "Este post se modificó desde otro lugar mientras lo editabas. Copia tu texto, recarga la página y vuelve a aplicar tus cambios."
    );
  }

  const { cambios, cover } = cambiosDeImagenes(slug, entrada, actual.datos.cover);
  const datos = datosDesdeEntrada(entrada, cover, actual.datos.date);
  // El editor no maneja la galería todavía: se conserva tal cual.
  datos.gallery = actual.datos.gallery;
  datos.galleryTitle = actual.datos.galleryTitle;

  cambios.push({ ruta: rutaPost(slug), contenidoBase64: base64(serializarPost(datos, entrada.contenido)) });
  await commitCambios(cambios, `Edita post: ${entrada.titulo} (por ${nombrePorAutor(autorSesion)})`);
}

export async function cambiarBorrador(slug: string, borrador: boolean, autorSesion: AutorPanel): Promise<void> {
  const actual = await obtenerPost(slug);
  if (!actual) throw new ErrorValidacion("Ese post ya no existe.");

  const texto = serializarPost({ ...actual.datos, draft: borrador }, actual.contenido);
  const accion = borrador ? "Pasa a borrador" : "Publica";
  await commitCambios(
    [{ ruta: rutaPost(slug), contenidoBase64: base64(texto) }],
    `${accion}: ${actual.datos.title} (por ${nombrePorAutor(autorSesion)})`
  );
}

export async function eliminarPost(slug: string, autorSesion: AutorPanel): Promise<void> {
  const actual = await obtenerPost(slug);
  if (!actual) throw new ErrorValidacion("Ese post ya no existe.");

  const cambios: CambioArchivo[] = [{ ruta: rutaPost(slug), eliminar: true }];
  if (esPortadaPropia(slug, actual.datos.cover)) {
    cambios.push({ ruta: rutaRepoDesdeUrl(actual.datos.cover), eliminar: true });
  }
  await commitCambios(cambios, `Elimina post: ${actual.datos.title} (por ${nombrePorAutor(autorSesion)})`);
}
