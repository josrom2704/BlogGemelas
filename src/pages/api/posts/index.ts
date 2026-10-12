import type { APIRoute } from "astro";
import { leerFormularioPost } from "../../../lib/admin/formulario";
import { crearPost, listarPosts } from "../../../lib/admin/posts-repo";
import { json, leerFormData, respuestaDeError } from "../../../lib/admin/respuestas";

export const prerender = false;

/** Lista todos los posts del repo (incluye borradores). */
export const GET: APIRoute = async () => {
  try {
    const posts = await listarPosts();
    return json({ ok: true, posts: posts.map(({ slug, datos }) => ({ slug, ...datos })) });
  } catch (error) {
    return respuestaDeError(error);
  }
};

/** Crea un post nuevo. */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const entrada = await leerFormularioPost(await leerFormData(request));
    const slug = await crearPost(entrada, locals.autor!);
    return json({ ok: true, slug, borrador: entrada.borrador }, 201);
  } catch (error) {
    return respuestaDeError(error);
  }
};
