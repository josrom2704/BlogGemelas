// ============================================================================
// CONFIGURACIÓN DEL BLOG
// Edita este archivo para cambiar el nombre del blog, las personas, los contactos
// de recaudación y la fecha del evento HMUN. No necesitas tocar nada más.
// ============================================================================

export const site = {
  // Nombre corto del blog (logo, pestaña del navegador, RSS).
  nombre: "DEMUNES",
  // Significado de las siglas, se muestra junto al nombre.
  nombreCompleto: "MUN El Salvador",
  lema: "Una delegación, un mismo sueño",
  descripcion:
    "DEMUNES (MUN El Salvador) es el diario de la delegación de El Salvador: María Fernanda, María Jimena, Lourdes y Camila. Lo que vivimos, lo que soñamos y el camino hacia el Harvard Model United Nations 2027.",
  idioma: "es",
  // URL final del sitio (debe coincidir con "site" en astro.config.mjs).
  url: "https://blogfjrm.vercel.app",
};

// ----------------------------------------------------------------------------
// PERSONAS
// Integrantes de la delegación y colaboradores. La clave de cada persona
// (fernanda, jimena, ...) es su identificador: se usa en el campo "author" de
// los posts y en sus variables del panel (<CLAVE>_USER y <CLAVE>_PASS).
// Privacidad: solo nombres de pila; nada de apellidos, colegio ni edades.
// ----------------------------------------------------------------------------

export interface Persona {
  nombre: string;
  inicial: string;
  color: string;
  /** Foto en /public/images; si no existe se muestra la inicial. */
  foto?: string;
  /** Rol visible, ej. "Delegada" o "Fotografía". */
  rol: string;
  frase?: string;
  gustos?: string[];
  suenos?: string[];
}

export const integrantes = {
  fernanda: {
    nombre: "María Fernanda",
    inicial: "F",
    color: "#8B2439",
    foto: "/images/fernanda.jpg",
    rol: "Delegada",
    gustos: [
      "Escribir en su cuaderno de ideas",
      "El café con leche de los domingos",
      "Armar playlists para cada estado de ánimo",
    ],
    suenos: [
      "Estudiar Relaciones Internacionales",
      "Conocer Boston y después el resto del mundo",
      "Debatir en Naciones Unidas de verdad algún día",
    ],
    frase: "Lo que no se sueña en grande, no se cumple en grande.",
  },
  jimena: {
    nombre: "María Jimena",
    inicial: "J",
    color: "#1B2A4A",
    foto: "/images/jimena.jpg",
    rol: "Delegada",
    gustos: [
      "Leer hasta quedarse dormida",
      "Organizar listas y calendarios para todo",
      "Las tardes de películas en familia",
    ],
    suenos: [
      "Ser una voz que represente bien a El Salvador",
      "Estudiar Ciencias Políticas",
      "Viajar y aprender de otras culturas",
    ],
    frase: "Juntas llegamos más lejos, y más rápido.",
  },
  lourdes: {
    nombre: "Lourdes",
    inicial: "L",
    color: "#2F6B4F",
    foto: "/images/lourdes.jpg",
    rol: "Delegada",
    // Completa con su frase, gustos y sueños cuando ella los comparta.
    gustos: [],
    suenos: [],
  },
  camila: {
    nombre: "Camila",
    inicial: "C",
    color: "#9A4F12",
    foto: "/images/camila.jpg",
    rol: "Delegada",
    gustos: [],
    suenos: [],
  },
} satisfies Record<string, Persona>;

// Personas que ayudan y también pueden publicar desde el panel. Ejemplo:
//   ana: { nombre: "Ana", inicial: "A", color: "#5B4B8A", rol: "Fotografía" },
export const colaboradores = {} satisfies Record<string, Persona>;

export type IntegranteId = keyof typeof integrantes;
export type AutorId = IntegranteId | keyof typeof colaboradores;

export const personas: Record<AutorId, Persona> = { ...integrantes, ...colaboradores };
export const idsIntegrantes = Object.keys(integrantes) as IntegranteId[];
export const idsAutores = Object.keys(personas) as AutorId[];

export const loQueCompartimos: string[] = [
  "Somos cuatro, cada una con su propia voz: eso es lo que nos hace buen equipo.",
  "Creemos que representar a El Salvador es una responsabilidad y un honor.",
  "Nos gusta documentar todo: por eso existe este blog.",
  "Compartimos el mismo sueño de llegar a Boston con la delegación completa.",
];

// ----------------------------------------------------------------------------
// HMUN 2027
// ----------------------------------------------------------------------------

export const hmun = {
  nombreEvento: "Harvard Model United Nations 2027",
  siglas: "HMUN 2027",
  ciudad: "Boston, Massachusetts",
  // Fecha/hora en UTC-6 (El Salvador) usada para la cuenta regresiva.
  fechaInicio: "2027-01-28T00:00:00-06:00",
  fechaFin: "2027-01-31T00:00:00-06:00",
  fechaTextoCorta: "28 al 31 de enero de 2027",
  descripcion:
    "HMUN es una de las simulaciones de Naciones Unidas más grandes y antiguas del mundo, organizada por estudiantes de la Universidad de Harvard. Cada año reúne a cerca de 4,000 estudiantes de secundaria de todo el mundo para debatir, negociar y proponer soluciones a problemas globales representando a distintos países.",
  delegacion: idsIntegrantes.map((id) => personas[id]),
  paisRepresentado: "El Salvador",
};

// ----------------------------------------------------------------------------
// CÓMO AYUDAR — contactos de recaudación (WhatsApp)
// Los números solo se usan para generar los enlaces wa.me, nunca se muestran
// en texto plano en el sitio.
// ----------------------------------------------------------------------------

export const mensajeWhatsApp = `Hola, vi el blog ${site.nombre} y quiero apoyar a la delegación de El Salvador en HMUN 2027.`;

function armarLinkWhatsApp(numero: string): string {
  const soloDigitos = numero.replace(/[^0-9]/g, "");
  return `https://wa.me/${soloDigitos}?text=${encodeURIComponent(mensajeWhatsApp)}`;
}

const contactosBase = [
  {
    nombre: "Claudia",
    rol: "Mamá de María Fernanda y María Jimena",
    numero: "+50370143259",
  },
  {
    nombre: "Carolina S.",
    rol: "Coordinación de recaudación",
    numero: "+50363100576",
  },
  {
    nombre: "Carolina C.",
    rol: "Coordinación de recaudación",
    numero: "+50370636987",
  },
];

export const contactosAyuda = contactosBase.map((c) => ({
  ...c,
  link: armarLinkWhatsApp(c.numero),
}));

export const actividadesRecaudacion = [
  {
    titulo: "Rifa",
    descripcion:
      "Boletos disponibles para una rifa con premios sorpresa. Pregunta por los números disponibles a través de cualquiera de nuestros contactos.",
    icono: "🎟️",
  },
  {
    titulo: "Garage Sale",
    descripcion:
      "Recibimos donaciones de ropa, accesorios, libros, decoración y otros artículos en buen estado para vender.",
    icono: "🧺",
  },
  {
    titulo: "Donaciones",
    descripcion:
      "Empresas y amigos pueden apoyar con una donación directa, en efectivo o en artículos para la rifa o el Garage Sale.",
    icono: "💛",
  },
];

// ----------------------------------------------------------------------------
// CATEGORÍAS
// ----------------------------------------------------------------------------

export const categorias = [
  "HMUN 2027",
  "Recaudación",
  "Vida",
  "Colegio",
  "Viajes",
] as const;

export type Categoria = (typeof categorias)[number];

// ----------------------------------------------------------------------------
// REDES / CONTACTO GENERAL (opcional, edita o deja vacío)
// ----------------------------------------------------------------------------

export const redes = {
  instagram: "",
  facebook: "",
  email: "",
};
