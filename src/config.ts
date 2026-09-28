// ============================================================================
// CONFIGURACIÓN DEL BLOG
// Edita este archivo para cambiar el nombre del blog, las bios, los contactos
// de recaudación y la fecha del evento HMUN. No necesitas tocar nada más.
// ============================================================================

export type AutorId = "fernanda" | "jimena" | "ambas";

export const site = {
  // Nombre del blog. Propuestas en el README: "Dos Veces Soñadoras",
  // "Doble Sueño", "Fer & Jime". Cambia este valor por el que elijan.
  nombre: "Dos Veces Soñadoras",
  lema: "Dos hermanas, un mismo sueño",
  descripcion:
    "El diario de María Fernanda y María Jimena: lo que viven, lo que sueñan y el camino hacia el Harvard Model United Nations 2027.",
  idioma: "es",
  // URL final del sitio (debe coincidir con "site" en astro.config.mjs).
  url: "https://dosveces.example.com",
};

export const autoras: Record<
  Exclude<AutorId, "ambas">,
  {
    nombre: string;
    inicial: string;
    color: string;
    foto: string;
    gustos: string[];
    suenos: string[];
    frase: string;
  }
> = {
  fernanda: {
    nombre: "María Fernanda",
    inicial: "F",
    color: "#8B2439",
    foto: "/images/fernanda.jpg",
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
};

export const loQueCompartimos: string[] = [
  "Somos gemelas, pero no somos iguales: eso es lo que nos hace buen equipo.",
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
  delegacion: [
    { nombre: "María Fernanda" },
    { nombre: "María Jimena" },
    { nombre: "Lourdes" },
    { nombre: "Camila" },
  ],
  paisRepresentado: "El Salvador",
};

// ----------------------------------------------------------------------------
// CÓMO AYUDAR — contactos de recaudación (WhatsApp)
// Los números solo se usan para generar los enlaces wa.me, nunca se muestran
// en texto plano en el sitio.
// ----------------------------------------------------------------------------

export const mensajeWhatsApp =
  "Hola, vi el blog de María Fernanda y María Jimena y quiero apoyar a la delegación de HMUN 2027.";

function armarLinkWhatsApp(numero: string): string {
  const soloDigitos = numero.replace(/[^0-9]/g, "");
  return `https://wa.me/${soloDigitos}?text=${encodeURIComponent(mensajeWhatsApp)}`;
}

const contactosBase = [
  {
    nombre: "Claudia",
    rol: "Nuestra mamá",
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
