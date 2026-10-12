import type { APIRoute } from "astro";
import { leerFormularioPost } from "../../../lib/admin/formulario";
import { actualizarPost, cambiarBorrador, eliminarPost } from "../../../lib/admin/posts-repo";
import { json, leerFormData, respuestaDeError } from "../../../lib/admin/respuestas";

export const prerender = false;

/** Guarda los cambios de un post existente. */
export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    const datos = await leerFormData(request);
    const entrada = await leerFormularioPost(datos);
    await actualizarPost(params.slug!, entrada, String(datos.get("sha") ?? ""), locals.autor!);
    return json({ ok: true, slug: params.slug, borrador: entrada.borrador });
  } catch (error) {
    return respuestaDeError(error);
  }
};

/** Publica o pasa a borrador sin abrir el editor. Body: { "borrador": boolean } */
export const PATCH: APIRoute = async ({ params, request, locals }) => {
  try {
    const { borrador } = (await request.json()) as { borrador?: unknown };
    if (typeof borrador !== "boolean") return json({ ok: false, mensaje: "Falta el campo borrador." }, 400);
    await cambiarBorrador(params.slug!, borrador, locals.autor!);
    return json({ ok: true, slug: params.slug, borrador });
  } catch (error) {
    return respuestaDeError(error);
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    await eliminarPost(params.slug!, locals.autor!);
    return json({ ok: true });
  } catch (error) {
    return respuestaDeError(error);
  }
};
