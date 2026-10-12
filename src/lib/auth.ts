import { createHmac, timingSafeEqual } from "node:crypto";
import { getSecret } from "astro:env/server";
import { idsAutores, personas, type AutorId } from "../config";

export type AutorPanel = AutorId;

interface Cuenta {
  usuario: string;
  password: string;
  autor: AutorPanel;
  nombre: string;
}

const DURACION_SESION_MS = 1000 * 60 * 60 * 24 * 14; // 14 días

/** Prefijo de las variables de cada persona: "fernanda" → FERNANDA_USER / FERNANDA_PASS. */
export function prefijoVariables(autor: AutorPanel): string {
  return autor.toUpperCase().replace(/[^A-Z0-9]/g, "_");
}

/** Cuentas del panel: cada persona de config.ts que tenga usuario y contraseña configurados. */
function cuentas(): Cuenta[] {
  return idsAutores.map((autor) => {
    const prefijo = prefijoVariables(autor);
    return {
      usuario: getSecret(`${prefijo}_USER`) ?? "",
      password: getSecret(`${prefijo}_PASS`) ?? "",
      autor,
      nombre: personas[autor].nombre,
    };
  });
}

function secretoSesion(): string {
  const secreto = getSecret("SESSION_SECRET");
  if (!secreto) {
    throw new Error("Falta configurar la variable de entorno SESSION_SECRET.");
  }
  return secreto;
}

/** Compara dos strings en tiempo constante, sin fallar si tienen largo distinto. */
function comparacionSegura(a: string, b: string): boolean {
  const claveNormalizacion = "comparacion-longitud-fija";
  const ha = createHmac("sha256", claveNormalizacion).update(a).digest();
  const hb = createHmac("sha256", claveNormalizacion).update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function validarCredenciales(usuario: string, password: string): Cuenta | null {
  for (const cuenta of cuentas()) {
    if (!cuenta.usuario || !cuenta.password) continue;
    if (comparacionSegura(cuenta.usuario, usuario) && comparacionSegura(cuenta.password, password)) {
      return cuenta;
    }
  }
  return null;
}

export function crearTokenSesion(autor: AutorPanel): string {
  const expira = Date.now() + DURACION_SESION_MS;
  const payload = `${autor}.${expira}`;
  const firma = createHmac("sha256", secretoSesion()).update(payload).digest("hex");
  return `${payload}.${firma}`;
}

export function verificarTokenSesion(token: string | undefined | null): AutorPanel | null {
  if (!token) return null;
  const partes = token.split(".");
  if (partes.length !== 3) return null;

  const [autorTexto, expiraTexto, firma] = partes;
  if (!(idsAutores as string[]).includes(autorTexto)) return null;
  const autor = autorTexto as AutorPanel;

  const firmaEsperada = createHmac("sha256", secretoSesion()).update(`${autor}.${expiraTexto}`).digest("hex");
  if (!comparacionSegura(firma, firmaEsperada)) return null;

  const expira = Number(expiraTexto);
  if (!Number.isFinite(expira) || Date.now() > expira) return null;

  return autor;
}

export const DURACION_COOKIE_SEGUNDOS = DURACION_SESION_MS / 1000;

export function nombrePorAutor(autor: AutorPanel): string {
  return personas[autor]?.nombre ?? autor;
}
