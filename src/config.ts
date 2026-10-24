// ============================================================================
// CONFIGURACIÓN DEL BLOG
// Edita este archivo para cambiar el nombre del blog, las personas, los contactos
// de recaudación y la fecha del evento HMUN. No necesitas tocar nada más.
// ============================================================================

export const site = {
  // Nombre del blog (logo, pestaña del navegador, RSS).
  nombre: "El Salvador MUN Delegation",
  // Usuario en redes, se usa como identificador corto.
  usuario: "elsalvadormundelegation",
  lema: "Una delegación, un mismo sueño",
  descripcion:
    "El diario de la delegación de El Salvador en el Harvard Model United Nations 2027: María Fernanda, María Jimena, Lourdes y Camila. Lo que vivimos, lo que soñamos y el camino para llegar.",
  idioma: "es",
  // URL final del sitio (debe coincidir con "site" en astro.config.mjs).
  url: "https://blogfjrm.vercel.app",
};

// ----------------------------------------------------------------------------
// PERSONAS
// Integrantes de la delegación y colaboradores. La clave de cada persona
// (fernanda, jimena, ...) es su identificador: se usa en el campo "author" de
// los posts y en sus variables del panel (<CLAVE>_USER y <CLAVE>_PASS).
// Privacidad: nombres de pila en todo el sitio; apellidos, colegio y grado
// solo en presentaciones y trayectorias. Nada de dirección ni edades exactas.
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
  /** Trayectoria y reconocimientos, en tercera persona. */
  trayectoria?: string;
  /** Presentación en primera persona, un párrafo por elemento. */
  presentacion?: string[];
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
    trayectoria:
      "Estudiante de undécimo grado en el Colegio La Floresta y una destacada participante en Modelos de Naciones Unidas (MUN). A lo largo de su trayectoria, ha demostrado habilidades en debate, negociación y liderazgo, obteniendo múltiples reconocimientos. Ha sido premiada como Delegada de Honor en ambas ediciones de MUN La Floresta, recibió Mención Honorífica en MUN ESEN 2023, obtuvo el Premio a la Diplomacia en MUN ESEN 2024 y fue reconocida con el Premio al Liderazgo en MUN ESEN 2024.",
    presentacion: [
      "¡Hola! Mi nombre es María Fernanda Romero y me interesa mucho comprender cómo funciona el mundo, cómo se toman las decisiones que afectan a las sociedades y de qué manera las leyes, la política y la cooperación entre países pueden contribuir a resolver los problemas que enfrentamos. Disfruto analizar diferentes puntos de vista, construir argumentos y encontrar en el diálogo una forma de defender mis ideas y aprender de los demás.",
      "A lo largo de mi trayectoria, he tenido la oportunidad de participar en competencias de debate a nivel nacional e internacional. Cada una de estas experiencias ha fortalecido mi interés por comprender mejor el mundo que nos rodea, buscar soluciones a problemas globales y reconocer el poder que tienen nuestras voces cuando se utilizan para construir, proponer y transformar.",
      "Para mí, participar en Harvard Model United Nations 2027 significa mucho más que asistir a una conferencia: representa la oportunidad tan grande de aprender de jóvenes con ideas, experiencias y perspectivas diferentes, salir de mi zona de confort y seguir creciendo tanto académica como personalmente. Pero, sobre todo, significa llevar con orgullo el nombre de El Salvador a un escenario internacional y demostrar que los jóvenes salvadoreños también tenemos ideas, sueños, voces y propuestas capaces de generar un impacto en el mundo. ¡Estoy emocionada por todo lo que esta experiencia puede enseñarme y por las oportunidades que traerá para seguir creciendo como líder y como persona!",
    ],
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
    trayectoria:
      "Estudiante de undécimo grado en el Colegio La Floresta y una destacada participante en Modelos de Naciones Unidas (MUN). A lo largo de su trayectoria, ha demostrado habilidades en debate, negociación y liderazgo, obteniendo múltiples reconocimientos. Ha sido premiada como Delegada de Honor en ambas ediciones de MUN La Floresta, recibió Mención Honorífica en MUN ESEN 2023, obtuvo el Premio a la Diplomacia en MUN ESEN 2024 y fue reconocida con el Premio al Liderazgo en MUN ESEN 2024.",
    presentacion: [
      "Mi nombre es Jimena Romero y me interesa el debate porque disfruto expresar mis ideas, defender mis opiniones y escuchar diferentes puntos de vista. Me gusta aprender sobre temas de actualidad, entender distintas perspectivas y descubrir cómo las ideas pueden generar conversaciones interesantes y abrir nuevas formas de pensar.",
      "Estoy muy emocionada por participar en Harvard Model United Nations, especialmente por la oportunidad de representar a mi país, compartir mi perspectiva y conocer a jóvenes de diferentes partes del mundo. Espero aprender de esta experiencia, enfrentar nuevos retos y llevarme nuevas ideas y conocimientos que me ayuden a crecer tanto personal como académicamente.",
    ],
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
    presentacion: [
      "Mi nombre es Lourdes Salinas y el debate se ha convertido en una de las formas en las que más disfruto aprender y conocer el mundo. Desde que comencé a participar en competencias de debate y Modelos de Naciones Unidas, he descubierto mi interés por comprender los conflictos internacionales, analizar diferentes puntos de vista y encontrar soluciones a través del diálogo. Cada experiencia me ha motivado a seguir retándome, fortalecer mis habilidades y aprender de quienes tienen perspectivas diferentes a las mías.",
      "Participar en Harvard Model United Nations 2027 es un paso muy importante para mí, porque representa la oportunidad de llevar mi pasión por el debate a un escenario internacional y compartir ideas con jóvenes de todo el mundo. Me llena de orgullo representar a El Salvador, un país pequeño en territorio, pero enorme en sueños, talento e ideas. Quiero demostrar que nuestro tamaño no define el alcance de lo que podemos aportar y que los jóvenes salvadoreños también tenemos una voz que merece ser escuchada en las conversaciones que dan forma al futuro.",
    ],
    gustos: [],
    suenos: [],
  },
  camila: {
    nombre: "Camila",
    inicial: "C",
    color: "#9A4F12",
    foto: "/images/camila.jpg",
    rol: "Delegada",
    presentacion: [
      "Mi nombre es Camila Cubas y me apasionan la diplomacia, las relaciones internacionales y el debate. He tenido la oportunidad de participar en competencias de debate a nivel nacional e internacional, experiencias que han fortalecido mi interés por el diálogo y la búsqueda de soluciones a los desafíos globales.",
      "Participar en Harvard Model United Nations 2027 representa una oportunidad para seguir aprendiendo, compartir perspectivas con jóvenes de todo el mundo y, sobre todo, representar con orgullo a mi país, El Salvador, en un escenario internacional.",
    ],
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
  instagram: "https://www.instagram.com/elsalvadormundelegation/",
  facebook: "",
  email: "",
};
