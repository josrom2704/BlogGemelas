/// <reference types="astro/client" />

// Las variables del panel (<PERSONA>_USER/_PASS, SESSION_SECRET, GITHUB_*) se
// leen en tiempo de ejecución con getSecret() de "astro:env/server".

declare namespace App {
  interface Locals {
    /** Persona con sesión iniciada en el panel. Solo existe en rutas protegidas. */
    autor?: import("./config").AutorId;
  }
}
