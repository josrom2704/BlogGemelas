import { ErrorGitHub } from "../github";
import { ErrorValidacion } from "./formulario";
import { ErrorConflicto } from "./posts-repo";

/** Mensaje entendible para errores al hablar con GitHub. */
export function mensajeDeError(error: unknown): string {
  if (error instanceof ErrorGitHub) {
    if (error.status === 401) return "El token de GitHub (GITHUB_TOKEN) no es válido o expiró. Hay que generar uno nuevo.";
    if (error.status === 403) return "El token de GitHub no tiene permiso de escritura (Contents: Read and write) o se alcanzó el límite de uso.";
    if (error.status === 404) return "No se encontró el repositorio. Revisa GITHUB_OWNER, GITHUB_REPO y GITHUB_BRANCH.";
  }
  const detalle = error instanceof Error ? error.message : String(error);
  return `No se pudo conectar con GitHub. Detalle: ${detalle}`;
}

export function json(datos: unknown, status = 200): Response {
  return new Response(JSON.stringify(datos), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

/** Traduce cualquier error del panel a una respuesta JSON con un mensaje legible. */
export function respuestaDeError(error: unknown): Response {
  if (error instanceof ErrorValidacion) return json({ ok: false, mensaje: error.message }, 400);
  if (error instanceof ErrorConflicto) return json({ ok: false, mensaje: error.message }, 409);

  console.error("[panel]", error);
  return json({ ok: false, mensaje: mensajeDeError(error) }, 502);
}

export async function leerFormData(request: Request): Promise<FormData> {
  try {
    return await request.formData();
  } catch {
    throw new ErrorValidacion("No se pudo leer el formulario (¿las imágenes pesan demasiado?).");
  }
}
