import { assertNonEmpty, assertPublicAssetExists, type PublicAssetPath } from "./asset-validation";
import { createSocialImageMetadata, type SocialImageMetadata } from "./site";

export interface DownloadAsset {
  kind: "audio" | "pdf" | "gpx";
  href: PublicAssetPath;
  label: string;
  iconSrc: PublicAssetPath;
  iconAlt: string;
  ariaLabel: string;
  download?: boolean;
}

export interface AudioTrack {
  src: PublicAssetPath;
  title: string;
  subtitle: string;
}

export interface EtapaStat {
  label: string;
  value: string;
}

export interface TreasureSpot {
  title: string;
  description: string;
  imageSrc: PublicAssetPath;
  imageAlt: string;
}

export interface RouteDef {
  id: string;
  url: PublicAssetPath;
  color: string;
}

export interface EtapaRecord {
  id: number;
  idLabel: string;
  slug: `etapa-0${1 | 2 | 3 | 4 | 5}`;
  path: `/etapas/etapa-0${1 | 2 | 3 | 4 | 5}`;
  cardTitle: string;
  detailTitle: string;
  layoutTitle: string;
  layoutDescription: string;
  routeSummary: string;
  heroRouteLabel: string;
  heroImage: PublicAssetPath;
  heroAlt: string;
  socialImage?: SocialImageMetadata;
  cardImage: PublicAssetPath;
  mapRoutes: RouteDef[];
  audioTracks: AudioTrack[];
  stats: EtapaStat[];
  detailDownloads: DownloadAsset[];
  cardDownloads: {
    home: DownloadAsset[];
    list: DownloadAsset[];
  };
  treasures: TreasureSpot[];
  warningParagraphs: string[];
}

const mp3Icon = "/images/mp3.webp" as const;
const pdfIcon = "/images/pdf.webp" as const;
const gpxIcon = "/images/gpx.webp" as const;

const createAudioDownload = (href: PublicAssetPath): DownloadAsset => ({
  kind: "audio",
  href,
  label: "MP3",
  iconSrc: mp3Icon,
  iconAlt: "MP3",
  ariaLabel: "Audio (MP3)",
});

const createPdfDownload = (href: PublicAssetPath): DownloadAsset => ({
  kind: "pdf",
  href,
  label: "PDF",
  iconSrc: pdfIcon,
  iconAlt: "PDF",
  ariaLabel: "PDF",
  download: true,
});

const createGpxDownload = (href: PublicAssetPath): DownloadAsset => ({
  kind: "gpx",
  href,
  label: "GPX",
  iconSrc: gpxIcon,
  iconAlt: "GPX",
  ariaLabel: "GPX",
  download: true,
});

export const etapas: EtapaRecord[] = [
  {
    id: 1,
    idLabel: "01",
    slug: "etapa-01",
    path: "/etapas/etapa-01",
    cardTitle: "El Guardián del Horizonte",
    detailTitle: "El Guardián del Horizonte",
    layoutTitle: "Etapa 01 — El Guardián del Horizonte",
    layoutDescription: "Etapa 01 entre Agua Amarga y Las Negras, con relato histórico, audio, mapa y descargas PDF y GPX del recorrido.",
    routeSummary: "Agua Amarga > Las Negras · 13 km",
    heroRouteLabel: "Agua Amarga → Las Negras · 13 km",
    heroImage: "/images/fondo-01.webp",
    heroAlt: "Paisaje costero de Cabo de Gata",
    socialImage: createSocialImageMetadata("/images/fondo-01.webp", "Paisaje costero de Cabo de Gata"),
    cardImage: "/images/01.webp",
    mapRoutes: [{ id: "ruta-01", url: "/geojson/01.geojson", color: "#3a5f73" }],
    audioTracks: [{ src: "/descargas/01.mp3", title: "Etapa 01", subtitle: "El Guardián del Horizonte" }],
    stats: [
      { label: "Distancia", value: "13 km" },
      { label: "Duración estimada", value: "3 horas y media" },
      { label: "Inicio", value: "Agua Amarga" },
      { label: "Final", value: "Las Negras" },
      { label: "Dificultad", value: "Medio-Alto" },
    ],
    detailDownloads: [createPdfDownload("/descargas/01.pdf"), createGpxDownload("/descargas/01.gpx")],
    cardDownloads: {
      home: [createAudioDownload("/descargas/01.mp3"), createPdfDownload("/descargas/01.pdf"), createGpxDownload("/descargas/01.gpx")],
      list: [createAudioDownload("/descargas/01.mp3"), createPdfDownload("/descargas/01.pdf"), createGpxDownload("/descargas/01.gpx")],
    },
    treasures: [
      {
        title: "Torre de Mesa Roldán",
        description:
          "Función Estratégica: Torres construida en el siglo XVIII. Su diseño buscaba una única cosa: impedir el desembarco masivo. Obsérvalo desde la distancia: su posición le daba control visual absoluto. Cuando el pirata veía esta construcción, sabía que el juego había terminado en este tramo. Contempla su poderío sin tener que ascender.",
        imageSrc: "/images/01-01.webp",
        imageAlt: "Torre de Mesa Roldán",
      },
      {
        title: "Cala San Pedro y el Tesoro del Agua",
        description:
          "La paz de esta cala esconde una intensa lucha. Tu camino te lleva hasta el Castillo de San Pedro, cuyo único y vital objetivo era custodiar la fuente de agua dulce. Los corsarios, tras días de travesía, venían aquí a reabastecerse. La fortaleza en ruinas que encontrarás te recordará que cada recurso en la costa de Cabo de Gata era un punto de batalla.",
        imageSrc: "/images/01-02.webp",
        imageAlt: "Cala San Pedro y el Tesoro del Agua",
      },
    ],
    warningParagraphs: [
      "Si el torrero vigilaba el mar, tú debes custodiar la tierra. Por favor, lleva contigo tus residuos. Y si es posible, haz honor a la historia recogiendo algún “botín” de basura que encuentres. Preservar este Parque Natural es el mayor legado de la Senda Pirata del Cabo de Gata.",
    ],
  },
  {
    id: 2,
    idLabel: "02",
    slug: "etapa-02",
    path: "/etapas/etapa-02",
    cardTitle: "La Custodia del Alumbre y la Protección de los Mineros",
    detailTitle: "La Custodia del Alumbre",
    layoutTitle: "Etapa 02 — La Custodia del Alumbre",
    layoutDescription: "Etapa 02 entre Las Negras y Rodalquilar, con historia sobre la custodia del alumbre, mapa, audio y descargas PDF y GPX.",
    routeSummary: "Las Negras > Rodalquilar · 17 km",
    heroRouteLabel: "Las Negras → Rodalquilar · 17 km",
    heroImage: "/images/fondo-02.webp",
    heroAlt: "Paisaje costero de Cabo de Gata",
    socialImage: createSocialImageMetadata("/images/fondo-02.webp", "Paisaje costero de Cabo de Gata"),
    cardImage: "/images/02.webp",
    mapRoutes: [{ id: "ruta-02", url: "/geojson/02.geojson", color: "#9a6b2f" }],
    audioTracks: [{ src: "/descargas/02.mp3", title: "Etapa 02", subtitle: "La Custodia del Alumbre" }],
    stats: [
      { label: "Distancia", value: "17 km" },
      { label: "Dificultad", value: "Media-Alta" },
      { label: "Inicio", value: "Las Negras" },
      { label: "Final", value: "Rodalquilar" },
      { label: "Duración estimada", value: "4 horas y media" },
    ],
    detailDownloads: [createPdfDownload("/descargas/02.pdf"), createGpxDownload("/descargas/02.gpx")],
    cardDownloads: {
      home: [createAudioDownload("/descargas/02.mp3"), createPdfDownload("/descargas/02.pdf"), createGpxDownload("/descargas/02.gpx")],
      list: [createAudioDownload("/descargas/02.mp3"), createPdfDownload("/descargas/02.pdf"), createGpxDownload("/descargas/02.gpx")],
    },
    treasures: [
      {
        title: "El Castillo de San Ramón",
        description:
          "La Fortaleza que Detuvo el Saqueo. Este imponente fuerte del siglo XVIII, situado estratégicamente en la Playa del Playazo, no es una batería diseñada para el combate directo. Su objetivo era doble: impedir el desembarco masivo en la playa y asegurar la salida del mineral (plomo, plata y alumbre) que salía del Valle de Rodalquilar. Al rodear sus muros, sientes la solidez de una defensa que funcionó. Fue aquí donde la Corona invirtió para proteger su riqueza.",
        imageSrc: "/images/02-01.webp",
        imageAlt: "El Castillo de San Ramón",
      },
      {
        title: "Castillo de los Alumbres",
        description:
          "En tu ruta, verás los restos del Castillo de los Alumbres. Esta estructura del siglo XVI es una de las más antiguas de la zona y no vigilaba directamente el mar, sino que custodiaba las explotaciones de alumbre que se encontraban cerca. Su existencia demuestra que la Monarquía se vio obligada a proteger la riqueza mineral desde el inicio de la explotación.",
        imageSrc: "/images/02-02.webp",
        imageAlt: "Castillo de los Alumbres",
      },
      {
        title: "La Torre de los Lobos",
        description:
          "Punto más alto de la red defensiva del levante almeriense. Aunque originalmente fue una torre vigía, hoy alberga el Faro de la Polacra, singular por ser el que está situado a mayor altura del Mediterráneo. Esto explica que sus señales de alerta llegaran a ser vistas hasta Sierra Alhamilla.",
        imageSrc: "/images/02-03.webp",
        imageAlt: "La Torre de los Lobos",
      },
      {
        title: "Paisaje minero",
        description:
          "Mientras caminas hacia Rodalquilar, observarás las ruinas de las antiguas explotaciones mineras. Estas estructuras son un recordatorio constante la importancia económica de este lugar. Los corsarios no solo buscaban cautivos; la riqueza tangible de la tierra era un imán, y el Castillo de San Ramón fue la respuesta para protegerla.",
        imageSrc: "/images/02-04.webp",
        imageAlt: "Paisaje minero",
      },
    ],
    warningParagraphs: [
      "Este territorio fue custodiado para proteger un bien valioso. Hoy su mayor riqueza es el paisaje que atraviesas. Camina con respeto, no abandones residuos, no recojas piedras, plantas u otros elementos naturales y mantente siempre en los senderos autorizados. Tu paso responsable contribuye a conservar un espacio único, el Parque Natural Cabo de Gata-Níjar.",
    ],
  },
  {
    id: 3,
    idLabel: "03",
    slug: "etapa-03",
    path: "/etapas/etapa-03",
    cardTitle: "Camino del Botín y la Indefensión del Interior",
    detailTitle: "Camino del Botín",
    layoutTitle: "Etapa 03 — Camino del Botín",
    layoutDescription: "Etapa 03 entre Rodalquilar y La Isleta del Moro, con relato sobre el botín corsario, mapa, audio y descargas PDF y GPX.",
    routeSummary: "Rodalquilar > La Isleta del Moro · 14,2 km",
    heroRouteLabel: "Rodalquilar → La Isleta del Moro · 14,2 km",
    heroImage: "/images/fondo-03.webp",
    heroAlt: "Paisaje costero de Cabo de Gata",
    socialImage: createSocialImageMetadata("/images/fondo-03.webp", "Paisaje costero de Cabo de Gata"),
    cardImage: "/images/03.webp",
    mapRoutes: [{ id: "ruta-03", url: "/geojson/03.geojson", color: "#8c3b2e" }],
    audioTracks: [{ src: "/descargas/03.mp3", title: "Etapa 03", subtitle: "Camino del Botín" }],
    stats: [
      { label: "Distancia", value: "14,2 km" },
      { label: "Duración estimada", value: "4 horas" },
      { label: "Inicio", value: "Rodalquilar" },
      { label: "Final", value: "La Isleta del Moro" },
      { label: "Dificultad", value: "Media-Alta" },
    ],
    detailDownloads: [createPdfDownload("/descargas/03.pdf"), createGpxDownload("/descargas/03.gpx")],
    cardDownloads: {
      home: [createAudioDownload("/descargas/03.mp3"), createPdfDownload("/descargas/03.pdf"), createGpxDownload("/descargas/03.gpx")],
      list: [createAudioDownload("/descargas/03.mp3"), createPdfDownload("/descargas/03.pdf"), createGpxDownload("/descargas/03.gpx")],
    },
    treasures: [
      {
        title: "El Cortijo del Fraile",
        description:
          "Desde la Rellana, la silueta del Cortijo del Fraile te recordará que el peligro no solo estaba en el mar. Fue levantado por frailes Dominicos en el siglo XVIII como parte del esfuerzo de la Corona por colonizar y asegurar el territorio. Sin embargo, su aislamiento, lejos de las grandes fortalezas costeras, lo convertía en un blanco de alto valor para los corsarios que lograban penetrar en el interior buscando el botín, sobre todo, cautivos.",
        imageSrc: "/images/03-01.webp",
        imageAlt: "El Cortijo del Fraile",
      },
      {
        title: "La Isleta del Moro",
        description:
          "Al descender hacia La Isleta, alcanzarás un pequeño puerto natural cuyo nombre lo dice todo. Esta “Isleta del Moro” era conocida históricamente como un punto ideal para la aguada y el escondite de las galeras berberiscas. Aunque hoy es un refugio de pescadores, su geografía la marcó como un punto negro en el mapa de defensa, donde las incursiones se planeaban.",
        imageSrc: "/images/03-02.webp",
        imageAlt: "La Isleta del Moro",
      },
    ],
    warningParagraphs: [
      "Caminas por un paisaje marcado por la historia minera y el esfuerzo humano. Respeta las huellas del pasado: no recojas minerales, piedras ni restos naturales, no accedas a zonas no autorizadas y evita alterar el entorno. Mirar el horizonte también es saber cuándo detenerse para proteger lo que otros cuidaron antes.",
    ],
  },
  {
    id: 4,
    idLabel: "04",
    slug: "etapa-04",
    path: "/etapas/etapa-04",
    cardTitle: "El Anillo Defensivo",
    detailTitle: "El Anillo Defensivo",
    layoutTitle: "Etapa 04 — El Anillo Defensivo",
    layoutDescription: "Etapa 04 entre La Isleta del Moro y San José, con relatos del anillo defensivo, mapa, audios y descargas PDF y GPX.",
    routeSummary: "La Isleta del Moro > San José · 12,3 km",
    heroRouteLabel: "La Isleta del Moro → San José · 12,3 km",
    heroImage: "/images/fondo-04.webp",
    heroAlt: "Paisaje costero de Cabo de Gata",
    socialImage: createSocialImageMetadata("/images/fondo-04.webp", "Paisaje costero de Cabo de Gata"),
    cardImage: "/images/04.webp",
    mapRoutes: [{ id: "ruta-04", url: "/geojson/04.geojson", color: "#4f6b4a" }],
    audioTracks: [
      { src: "/descargas/04-01.mp3", title: "Etapa 04", subtitle: "Fuego cruzado en Los Escullos" },
      { src: "/descargas/04-02.mp3", title: "Etapa 04", subtitle: "La tensión del centinela" },
    ],
    stats: [
      { label: "Distancia", value: "12,3 km" },
      { label: "Duración estimada", value: "3 horas" },
      { label: "Inicio", value: "La Isleta del Moro" },
      { label: "Final", value: "San José" },
      { label: "Dificultad", value: "Media-Baja" },
    ],
    detailDownloads: [createPdfDownload("/descargas/04.pdf"), createGpxDownload("/descargas/04.gpx")],
    cardDownloads: {
      home: [
        {
          ...createAudioDownload("/descargas/04-01.mp3"),
          label: "MP3 · Parte 1",
          ariaLabel: "Audio (MP3) — Fuego cruzado en Los Escullos",
        },
        {
          ...createAudioDownload("/descargas/04-02.mp3"),
          label: "MP3 · Parte 2",
          ariaLabel: "Audio (MP3) — La tensión del centinela",
        },
        createPdfDownload("/descargas/04.pdf"),
        createGpxDownload("/descargas/04.gpx"),
      ],
      list: [
        {
          ...createAudioDownload("/descargas/04-01.mp3"),
          label: "MP3 · Parte 1",
          ariaLabel: "Audio (MP3) — Fuego cruzado en Los Escullos",
        },
        {
          ...createAudioDownload("/descargas/04-02.mp3"),
          label: "MP3 · Parte 2",
          ariaLabel: "Audio (MP3) — La tensión del centinela",
        },
        createPdfDownload("/descargas/04.pdf"),
        createGpxDownload("/descargas/04.gpx"),
      ],
    },
    treasures: [
      {
        title: "Batería defensiva de San Felipe (Los Escullos)",
        description:
          "Edificio cuya función era la defensa artillada e impedir que los navíos piratas se aproximaran a la costa y pudieran desembarcar en la bahía de los Escullos. Fue diseñada como una batería costera con capacidad para alojar cuatro cañones y su correspondiente guarnición militar. Es un ejemplo de fortificación abaluartada de la segunda mitad del siglo XVIII. Originalmente, contaba con foso, puente levadizo y cuarteles.",
        imageSrc: "/images/04-01.webp",
        imageAlt: "Batería defensiva de San Felipe (Los Escullos)",
      },
      {
        title: "Torre de Cala Higuera",
        description:
          "Mientras caminas, el paisaje estará dominado por la silueta de la Torre de Cala Higuera. Situada en un cerro a 224 metros, esta torre del siglo XVIII era un “ojo en el cielo” que controlaba todos los movimientos en las grandes bahías que dan al Sollarete (hoy San Jose). Su función era la comunicación. Desde aquí, el torrero no solo buscaba velas enemigas, sino que miraba constantemente hacia la cercana Torre de Vela Blanca (Etapa 5) para replicar la señal de humo o fuego. Su trabajo era la vida o muerte de sus vecinos.",
        imageSrc: "/images/04-02.webp",
        imageAlt: "Torre de Cala Higuera",
      },
      {
        title: "El Fuerte escondido de San José",
        description:
          "Al llegar a la bahía de San José, debes saber que esta población no estaba desprotegida. Debajo del actual cuartel de la Guardia Civil se encuentran los restos del histórico Castillo de San José. Esta fortaleza fue levantada entre 1733 y 1735, con el objetivo de proteger este puerto natural. Aunque su estructura original está hoy oculta, su existencia demuestra que, para el siglo XVIII, la Corona estaba decidida a consolidar y defender los núcleos de población estables contra cualquier amenaza.",
        imageSrc: "/images/04-03.webp",
        imageAlt: "El Fuerte (escondido) de San José",
      },
    ],
    warningParagraphs: [
      "Este tramo forma parte de un delicado equilibrio entre costa, mar y tierra. Permanece en los senderos señalizados, respeta la fauna y la vegetación litoral y reduce al mínimo tu impacto.",
      "El mejor recuerdo del camino es dejarlo tal y como lo encontraste.",
    ],
  },
  {
    id: 5,
    idLabel: "05",
    slug: "etapa-05",
    path: "/etapas/etapa-05",
    cardTitle: "El Fin de la Frontera",
    detailTitle: "El Fin de la Frontera",
    layoutTitle: "Etapa 05 — El Fin de la Frontera",
    layoutDescription: "Etapa 05 entre San José y La Fabriquilla, con relato sobre la frontera, mapa, audio y descargas PDF y GPX.",
    routeSummary: "San José > La Fabriquilla (Faro) · 15,12 km",
    heroRouteLabel: "San José → La Fabriquilla (Faro) · 15,12 km",
    heroImage: "/images/fondo-05.webp",
    heroAlt: "Paisaje costero de Cabo de Gata",
    socialImage: createSocialImageMetadata("/images/fondo-05.webp", "Paisaje costero de Cabo de Gata"),
    cardImage: "/images/05.webp",
    mapRoutes: [{ id: "ruta-05", url: "/geojson/05.geojson", color: "#2f2b26" }],
    audioTracks: [{ src: "/descargas/05.mp3", title: "Etapa 05", subtitle: "El Fin de la Frontera" }],
    stats: [
      { label: "Distancia", value: "15,12 km" },
      { label: "Duración estimada", value: "4 horas y media" },
      { label: "Inicio", value: "San José" },
      { label: "Final", value: "La Fabriquilla (Faro)" },
      { label: "Dificultad", value: "Media-Alta" },
    ],
    detailDownloads: [createPdfDownload("/descargas/05.pdf"), createGpxDownload("/descargas/05.gpx")],
    cardDownloads: {
      home: [createAudioDownload("/descargas/05.mp3"), createPdfDownload("/descargas/05.pdf"), createGpxDownload("/descargas/05.gpx")],
      list: [createAudioDownload("/descargas/05.mp3"), createPdfDownload("/descargas/05.pdf"), createGpxDownload("/descargas/05.gpx")],
    },
    treasures: [
      {
        title: "Torre de Vela Blanca",
        description:
          "Esta torre troncocónica no solo vigilaba: era el centro neurálgico. Si el fuego llegaba hasta aquí, significaba que la amenaza era inminente y las alarmas sonarían en la ciudad de Almería. Su posición, inexpugnable, fue clave para que el sistema funcionara durante siglos. Tómate un momento para apreciar su dominio visual.",
        imageSrc: "/images/05-01.webp",
        imageAlt: "Torre de Vela Blanca",
      },
      {
        title: "El Faro de Cabo de Gata",
        description:
          "El faro que te guía no es solo una luz, sino un símbolo de la transformación histórica de la costa. Se asienta sobre las ruinas del antiguo Castillo de San Francisco de Paula, una fortaleza defensiva del siglo XVIII, conocida popularmente como El Corralete, que custodiaba este punto crucial del litoral. Tras siglos de enfrentamientos, el siglo XIX trajo la paz definitiva con el Norte de África. Con la desaparición de la amenaza corsaria, la necesidad de defender la costa fue reemplazada por la necesidad de guiar la navegación civil y comercial.",
        imageSrc: "/images/05-02.webp",
        imageAlt: "El Faro de Cabo de Gata",
      },
    ],
    warningParagraphs: [
      "Has llegado al final del camino, pero no del compromiso. Respeta la vegetación dunar, no abandones residuos y extrema el cuidado en zonas de acantilado y costa.",
      "El verdadero logro del vigía es regresar sabiendo que su paso no ha dejado huella.",
    ],
  },
];

function validateEtapas(records: EtapaRecord[]): void {
  if (records.length !== 5) {
    throw new Error(`Expected 5 etapas, received ${records.length}.`);
  }

  const seenIds = new Set<number>();
  const seenSlugs = new Set<string>();
  const seenPaths = new Set<string>();

  for (const etapa of records) {
    if (seenIds.has(etapa.id)) {
      throw new Error(`Duplicate etapa id: ${etapa.id}`);
    }
    if (seenSlugs.has(etapa.slug)) {
      throw new Error(`Duplicate etapa slug: ${etapa.slug}`);
    }
    if (seenPaths.has(etapa.path)) {
      throw new Error(`Duplicate etapa path: ${etapa.path}`);
    }

    seenIds.add(etapa.id);
    seenSlugs.add(etapa.slug);
    seenPaths.add(etapa.path);

    assertNonEmpty(etapa.idLabel, `Etapa ${etapa.id} label`);
    assertNonEmpty(etapa.cardTitle, `Etapa ${etapa.id} card title`);
    assertNonEmpty(etapa.detailTitle, `Etapa ${etapa.id} detail title`);
    assertNonEmpty(etapa.layoutTitle, `Etapa ${etapa.id} layout title`);
    assertNonEmpty(etapa.layoutDescription, `Etapa ${etapa.id} layout description`);
    assertNonEmpty(etapa.routeSummary, `Etapa ${etapa.id} route summary`);
    assertNonEmpty(etapa.heroRouteLabel, `Etapa ${etapa.id} hero route label`);
    assertPublicAssetExists(etapa.heroImage, `Etapa ${etapa.id} hero image`);
    if (etapa.socialImage) {
      assertNonEmpty(etapa.socialImage.alt, `Etapa ${etapa.id} social image alt`);
      assertPublicAssetExists(etapa.socialImage.src, `Etapa ${etapa.id} social image`);
    }
    assertPublicAssetExists(etapa.cardImage, `Etapa ${etapa.id} card image`);

    if (etapa.mapRoutes.length === 0) {
      throw new Error(`Etapa ${etapa.id} requires at least one route.`);
    }

    for (const route of etapa.mapRoutes) {
      assertNonEmpty(route.id, `Etapa ${etapa.id} route id`);
      assertNonEmpty(route.color, `Etapa ${etapa.id} route color`);
      assertPublicAssetExists(route.url, `Etapa ${etapa.id} route geojson`);
    }

    if (etapa.audioTracks.length === 0) {
      throw new Error(`Etapa ${etapa.id} requires at least one audio track.`);
    }

    for (const track of etapa.audioTracks) {
      assertNonEmpty(track.title, `Etapa ${etapa.id} audio title`);
      assertNonEmpty(track.subtitle, `Etapa ${etapa.id} audio subtitle`);
      assertPublicAssetExists(track.src, `Etapa ${etapa.id} audio file`);
    }

    for (const stat of etapa.stats) {
      assertNonEmpty(stat.label, `Etapa ${etapa.id} stat label`);
      assertNonEmpty(stat.value, `Etapa ${etapa.id} stat value`);
    }

    for (const download of [...etapa.detailDownloads, ...etapa.cardDownloads.home, ...etapa.cardDownloads.list]) {
      assertNonEmpty(download.label, `Etapa ${etapa.id} download label`);
      assertNonEmpty(download.iconAlt, `Etapa ${etapa.id} download icon alt`);
      assertNonEmpty(download.ariaLabel, `Etapa ${etapa.id} download aria label`);
      assertPublicAssetExists(download.href, `Etapa ${etapa.id} download file`);
      assertPublicAssetExists(download.iconSrc, `Etapa ${etapa.id} download icon`);
    }

    for (const treasure of etapa.treasures) {
      assertNonEmpty(treasure.title, `Etapa ${etapa.id} treasure title`);
      assertNonEmpty(treasure.description, `Etapa ${etapa.id} treasure description`);
      assertPublicAssetExists(treasure.imageSrc, `Etapa ${etapa.id} treasure image`);
    }

    for (const paragraph of etapa.warningParagraphs) {
      assertNonEmpty(paragraph, `Etapa ${etapa.id} warning paragraph`);
    }
  }
}

validateEtapas(etapas);

export const totalEtapas = etapas.length;

export function getEtapa(id: number): EtapaRecord {
  const etapa = etapas.find((item) => item.id === id);

  if (!etapa) {
    throw new Error(`Unknown etapa id: ${id}`);
  }

  return etapa;
}
