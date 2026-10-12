import { idsIntegrantes, personas, type AutorId, type Persona } from "../config";

export function personasDe(autores: AutorId[]): Persona[] {
  return autores.map((id) => personas[id]).filter(Boolean);
}

/** "María Fernanda", "María Fernanda y Lourdes" o "Toda la delegación". */
export function nombreAutores(autores: AutorId[]): string {
  const esTodaLaDelegacion =
    autores.length === idsIntegrantes.length && idsIntegrantes.every((id) => autores.includes(id));
  if (esTodaLaDelegacion) return "Toda la delegación";

  const nombres = personasDe(autores).map((p) => p.nombre);
  if (nombres.length <= 1) return nombres[0] ?? "";
  return `${nombres.slice(0, -1).join(", ")} y ${nombres.at(-1)}`;
}
