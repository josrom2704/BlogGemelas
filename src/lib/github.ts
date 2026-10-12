// Cliente mínimo de la API de GitHub. El repositorio es la "base de datos" del
// blog: cada cambio hecho desde el panel es un commit, y Vercel vuelve a
// desplegar el sitio automáticamente.

import { getSecret } from "astro:env/server";

const API = "https://api.github.com";

function envRequerido(nombre: string): string {
  const valor = getSecret(nombre);
  if (!valor) throw new Error(`Falta configurar la variable de entorno ${nombre}.`);
  return valor;
}

function rama(): string {
  return getSecret("GITHUB_BRANCH") || "main";
}

function urlRepo(sufijo: string): string {
  return `${API}/repos/${envRequerido("GITHUB_OWNER")}/${envRequerido("GITHUB_REPO")}${sufijo}`;
}

function urlContenido(ruta: string): string {
  const rutaCodificada = ruta.split("/").map(encodeURIComponent).join("/");
  return urlRepo(`/contents/${rutaCodificada}?ref=${encodeURIComponent(rama())}`);
}

function encabezados(): Record<string, string> {
  return {
    Authorization: `Bearer ${envRequerido("GITHUB_TOKEN")}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "demunes-admin",
  };
}

export class ErrorGitHub extends Error {
  constructor(
    mensaje: string,
    readonly status: number
  ) {
    super(mensaje);
  }
}

async function pedir<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { ...encabezados(), "Content-Type": "application/json", ...init.headers },
  });
  if (!res.ok) {
    throw new ErrorGitHub(`GitHub respondió ${res.status}: ${await res.text()}`, res.status);
  }
  return (await res.json()) as T;
}

// ----------------------------------------------------------------------------
// Lectura
// ----------------------------------------------------------------------------

export interface EntradaDirectorio {
  name: string;
  path: string;
  sha: string;
  type: "file" | "dir" | "symlink" | "submodule";
}

/** Lista un directorio del repo. Devuelve [] si el directorio no existe. */
export async function listarDirectorio(ruta: string): Promise<EntradaDirectorio[]> {
  try {
    return await pedir<EntradaDirectorio[]>(urlContenido(ruta));
  } catch (error) {
    if (error instanceof ErrorGitHub && error.status === 404) return [];
    throw error;
  }
}

export interface ArchivoRepo {
  texto: string;
  sha: string;
}

/** Lee un archivo de texto del repo, o null si no existe. */
export async function leerArchivo(ruta: string): Promise<ArchivoRepo | null> {
  try {
    const datos = await pedir<{ content: string; sha: string }>(urlContenido(ruta));
    return { texto: Buffer.from(datos.content, "base64").toString("utf-8"), sha: datos.sha };
  } catch (error) {
    if (error instanceof ErrorGitHub && error.status === 404) return null;
    throw error;
  }
}

// ----------------------------------------------------------------------------
// Escritura: un solo commit con varios archivos
// ----------------------------------------------------------------------------

export type CambioArchivo =
  | { ruta: string; contenidoBase64: string }
  | { ruta: string; eliminar: true };

/**
 * Aplica todos los cambios en un único commit sobre la rama configurada, para
 * que un post y sus imágenes lleguen juntos y Vercel despliegue una sola vez.
 * Si otra persona hizo un commit en medio, reintenta sobre la versión nueva.
 */
export async function commitCambios(cambios: CambioArchivo[], mensaje: string): Promise<string> {
  if (cambios.length === 0) throw new Error("No hay cambios para guardar.");

  // Los blobs no dependen de la rama, se suben una sola vez.
  const entradas = await Promise.all(
    cambios.map(async (cambio) => {
      if ("eliminar" in cambio) {
        return { path: cambio.ruta, mode: "100644", type: "blob", sha: null };
      }
      const blob = await pedir<{ sha: string }>(urlRepo("/git/blobs"), {
        method: "POST",
        body: JSON.stringify({ content: cambio.contenidoBase64, encoding: "base64" }),
      });
      return { path: cambio.ruta, mode: "100644", type: "blob", sha: blob.sha };
    })
  );

  const refUrl = urlRepo(`/git/refs/heads/${encodeURIComponent(rama())}`);
  const MAX_INTENTOS = 3;

  for (let intento = 1; ; intento++) {
    const ref = await pedir<{ object: { sha: string } }>(refUrl);
    const commitPadre = await pedir<{ tree: { sha: string } }>(urlRepo(`/git/commits/${ref.object.sha}`));

    const arbol = await pedir<{ sha: string }>(urlRepo("/git/trees"), {
      method: "POST",
      body: JSON.stringify({ base_tree: commitPadre.tree.sha, tree: entradas }),
    });
    const commit = await pedir<{ sha: string }>(urlRepo("/git/commits"), {
      method: "POST",
      body: JSON.stringify({ message: mensaje, tree: arbol.sha, parents: [ref.object.sha] }),
    });

    try {
      await pedir(refUrl, { method: "PATCH", body: JSON.stringify({ sha: commit.sha, force: false }) });
      return commit.sha;
    } catch (error) {
      // 422 = la rama avanzó mientras armábamos el commit.
      if (error instanceof ErrorGitHub && error.status === 422 && intento < MAX_INTENTOS) continue;
      throw error;
    }
  }
}
