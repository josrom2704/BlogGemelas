/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly FERNANDA_USER: string;
  readonly FERNANDA_PASS: string;
  readonly JIMENA_USER: string;
  readonly JIMENA_PASS: string;
  readonly SESSION_SECRET: string;
  readonly GITHUB_TOKEN: string;
  readonly GITHUB_OWNER: string;
  readonly GITHUB_REPO: string;
  readonly GITHUB_BRANCH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    /** Autora con sesión iniciada en el panel. Solo existe en rutas protegidas. */
    autor?: import("./lib/auth").AutorPanel;
  }
}
