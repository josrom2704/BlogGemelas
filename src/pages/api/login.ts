import type { APIRoute } from "astro";
import { validarCredenciales, crearTokenSesion, DURACION_COOKIE_SEGUNDOS } from "../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const datos = await request.formData();
  const usuario = String(datos.get("usuario") ?? "").trim();
  const password = String(datos.get("password") ?? "");

  const cuenta = validarCredenciales(usuario, password);

  if (!cuenta) {
    return redirect("/admin/login?error=1");
  }

  const token = crearTokenSesion(cuenta.autor);
  cookies.set("session", token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
    maxAge: DURACION_COOKIE_SEGUNDOS,
  });

  return redirect("/admin");
};
