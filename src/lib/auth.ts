import { createHmac, timingSafeEqual } from "node:crypto";

export type AutorPanel = "fernanda" | "jimena";

interface Cuenta {
  usuario: string;
  password: string;
  autor: AutorPanel;
  nombre: string;
}

const DURACION_SESION_MS = 1000 * 60 * 60 * 24 * 14; // 14 días

function cuentas(): Cuenta[] {
  return [
    {
      usuario: import.meta.env.FERNANDA_USER ?? "",
      password: import.meta.env.FERNANDA_PASS ?? "",
      autor: "fernanda",
      nombre: "María Fernanda",
    },
    {
      usuario: import.meta.env.JIMENA_USER ?? "",
      password: import.meta.env.JIMENA_PASS ?? "",
      autor: "jimena",
      nombre: "María Jimena",
    },
  ];
}

function secretoSesion(): string {
  const secreto = import.meta.env.SESSION_SECRET;
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

  const [autor, expiraTexto, firma] = partes;
  if (autor !== "fernanda" && autor !== "jimena") return null;

  const firmaEsperada = createHmac("sha256", secretoSesion()).update(`${autor}.${expiraTexto}`).digest("hex");
  if (!comparacionSegura(firma, firmaEsperada)) return null;

  const expira = Number(expiraTexto);
  if (!Number.isFinite(expira) || Date.now() > expira) return null;

  return autor;
}

export const DURACION_COOKIE_SEGUNDOS = DURACION_SESION_MS / 1000;

export function nombrePorAutor(autor: AutorPanel): string {
  return cuentas().find((c) => c.autor === autor)?.nombre ?? autor;
}
