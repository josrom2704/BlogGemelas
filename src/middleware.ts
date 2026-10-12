import { defineMiddleware } from "astro:middleware";
import { verificarTokenSesion } from "./lib/auth";

// Rutas del panel que no requieren sesión.
const RUTAS_PUBLICAS = new Set(["/admin/login", "/api/login", "/api/logout"]);

function normalizar(ruta: string): string {
  return ruta.length > 1 ? ruta.replace(/\/+$/, "") : ruta;
}

/**
 * Protege todo /admin y /api: si no hay sesión válida, las páginas redirigen
 * al login y la API responde 401. Las páginas protegidas leen la autora desde
 * Astro.locals.autor.
 */
export const onRequest = defineMiddleware((context, next) => {
  const ruta = normalizar(context.url.pathname);
  const esPanel = ruta === "/admin" || ruta.startsWith("/admin/");
  const esApi = ruta.startsWith("/api/");

  if ((!esPanel && !esApi) || RUTAS_PUBLICAS.has(ruta) || context.isPrerendered) {
    return next();
  }

  const autor = verificarTokenSesion(context.cookies.get("session")?.value);
  if (!autor) {
    if (esApi) {
      return new Response(
        JSON.stringify({ ok: false, mensaje: "Tu sesión expiró. Vuelve a iniciar sesión." }),
        { status: 401, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }
    return context.redirect("/admin/login");
  }

  context.locals.autor = autor;
  return next();
});
