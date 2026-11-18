// Contenido editorial del prototipo académico. No son datos en tiempo real.
export const formatos = [
  {
    slug: 'torneos', numero: '01', simbolo: '♠', tipo: 'Formato de competición',
    titulo: 'Torneos multimesa', corto: 'MTT',
    resumen: 'Competiciones en las que participan jugadores de varias mesas hasta llegar a una mesa final.',
    descripcion: 'En un torneo multimesa (MTT), los participantes comienzan con una cantidad de fichas definida. A medida que avanza el evento, aumentan las ciegas, se eliminan jugadores y las mesas se reorganizan.',
    claves: ['Se juega con una estructura de ciegas que avanza por niveles.', 'Los participantes no pueden retirar sus fichas como dinero durante el torneo.', 'La duración depende del formato y del número de participantes.'],
    aviso: 'Existen estructuras regulares, turbo y otras variantes. Las condiciones concretas dependen de cada evento.'
  },
  {
    slug: 'spin-and-go', numero: '02', simbolo: '♦', tipo: 'Formato de torneo rápido',
    titulo: 'Spin & Go', corto: 'Spin & Go',
    resumen: 'Torneos rápidos, generalmente de tres jugadores, con un premio definido aleatoriamente antes de empezar.',
    descripcion: 'Spin & Go es un formato de torneo Sit & Go hiperturbo. En su versión clásica participan tres jugadores y el premio se determina mediante un multiplicador aleatorio antes de que se reparta la primera mano.',
    claves: ['Estructura muy rápida, con niveles de ciegas cortos.', 'En el formato clásico participan tres personas.', 'El premio se determina de forma aleatoria; no es una ganancia garantizada.'],
    aviso: 'Las modalidades disponibles y sus reglas específicas pueden variar según el mercado.'
  },
  {
    slug: 'sit-and-go', numero: '03', simbolo: '♣', tipo: 'Torneo sin horario fijo',
    titulo: 'Sit & Go', corto: 'Sit & Go',
    resumen: 'Torneos que comienzan cuando se completa el número previsto de participantes.',
    descripcion: 'A diferencia de muchos torneos programados, un Sit & Go generalmente no tiene una hora de inicio predeterminada: arranca cuando se llenan los asientos requeridos.',
    claves: ['Puede jugarse en una mesa o en varias, según el formato.', 'Cada participante recibe fichas iniciales de torneo.', 'Su duración depende de la estructura y del número de jugadores.'],
    aviso: 'No todos los Sit & Go tienen la misma cantidad de jugadores ni la misma velocidad.'
  },
  {
    slug: 'cash-games', numero: '04', simbolo: '♥', tipo: 'Juego por mesas',
    titulo: 'Cash Games', corto: 'Cash',
    resumen: 'Mesas con límites de apuesta definidos, sin estructura de eliminación propia de un torneo.',
    descripcion: 'Las partidas cash funcionan de forma diferente a los torneos. En las mesas con dinero real, las fichas representan valor monetario y las ciegas suelen permanecer fijas durante la sesión.',
    claves: ['No hay una mesa final ni niveles crecientes de ciegas como en un MTT.', 'Las mesas se organizan por modalidad y límites.', 'También pueden existir mesas de dinero ficticio para aprender sin apostar dinero real.'],
    aviso: 'La disponibilidad y las condiciones dependen de la plataforma y de la regulación correspondiente.'
  },
];

export const variantes = [
  {
    slug: 'texas-holdem', numero: '05', simbolo: '♠', tipo: 'Variante de póker',
    titulo: "Texas Hold'em", corto: 'Hold’em',
    resumen: 'Dos cartas privadas por jugador y hasta cinco cartas comunitarias.',
    descripcion: "Texas Hold'em es una de las variantes más conocidas. Cada jugador recibe dos cartas privadas y puede combinar cualquiera de ellas con las cinco cartas comunitarias para formar su mejor mano de cinco cartas.",
    claves: ['Dos cartas privadas para cada participante.', 'Cinco cartas comunitarias repartidas en flop, turn y river.', 'Se busca formar la mejor mano de cinco cartas.'],
    aviso: 'Las reglas de apuesta cambian según se juegue con límite, pot-limit o sin límite.'
  },
  {
    slug: 'omaha', numero: '06', simbolo: '♦', tipo: 'Variante de póker',
    titulo: 'Omaha', corto: 'Omaha',
    resumen: 'Cuatro cartas privadas en el formato tradicional, usando exactamente dos para la mano final.',
    descripcion: 'En Omaha tradicional, cada jugador recibe cuatro cartas privadas y debe utilizar exactamente dos de ellas junto con tres cartas comunitarias para construir su mejor mano de cinco cartas.',
    claves: ['Generalmente cuatro cartas privadas.', 'Es obligatorio usar exactamente dos privadas y tres comunitarias.', 'Existen modalidades como Omaha Hi/Lo.'],
    aviso: 'La regla de combinación de cartas es diferente a la de Texas Hold’em.'
  },
  {
    slug: 'seven-card-stud', numero: '07', simbolo: '♣', tipo: 'Variante de póker',
    titulo: 'Seven Card Stud', corto: 'Stud',
    resumen: 'Cada jugador puede recibir siete cartas y no existen cartas comunitarias.',
    descripcion: 'En Seven Card Stud, cada participante recibe cartas propias, algunas descubiertas y otras ocultas. A diferencia de Hold’em y Omaha, no hay flop, turn ni river comunitarios.',
    claves: ['No se comparten cartas comunitarias.', 'Se reparten cartas visibles y ocultas.', 'La mejor mano de cinco cartas determina al ganador en la variante high.'],
    aviso: 'También existen variantes como Stud Hi/Lo.'
  }
];

export const guias = [
  {
    slug: 'primeros-pasos', numero: '01', simbolo: '♠', titulo: 'Primeros pasos',
    resumen: 'Objetivo del juego, desarrollo de una mano y acciones básicas.',
    introduccion: 'El póker reúne distintos juegos de cartas donde las apuestas, las decisiones y las combinaciones de manos tienen un papel central. Esta guía comienza por lo esencial.',
    pasos: [
      ['Objetivo', 'En muchas variantes, el objetivo es ganar el bote con la mejor mano válida o haciendo que los demás jugadores se retiren.'],
      ['Rondas de apuesta', 'Según la variante, puede haber varias rondas en las que los jugadores deciden cómo continuar.'],
      ['Acciones', 'Pasar (check), igualar (call), apostar (bet), subir (raise) y retirarse (fold) son acciones habituales.']
    ]
  },
  {
    slug: 'jerarquia-de-manos', numero: '02', simbolo: '♦', titulo: 'Jerarquía de manos',
    resumen: 'Aprende qué combinaciones son más fuertes en el póker tradicional high.',
    introduccion: 'Conocer el orden de las manos es básico para interpretar una partida de Texas Hold’em o de otras variantes high.',
    pasos: [
      ['De mayor a menor', 'Escalera real, escalera de color, póker, full house, color, escalera, trío, doble pareja, pareja y carta alta.'],
      ['Desempates', 'Si dos jugadores tienen el mismo tipo de combinación, se comparan los valores relevantes de las cartas.'],
      ['Atención a la modalidad', 'En variantes low o hi/lo las reglas de clasificación pueden ser diferentes.']
    ]
  },
  {
    slug: 'glosario', numero: '03', simbolo: '♣', titulo: 'Glosario de póker',
    resumen: 'Términos importantes para entender una mesa o un torneo.',
    introduccion: 'Muchas expresiones del póker se mantienen en inglés. Aquí tienes una referencia básica para leer contenido sin perderte entre términos.',
    pasos: [
      ['Blinds (ciegas)', 'Apuestas obligatorias que ayudan a formar el bote antes de repartir las cartas.'],
      ['Stack', 'Cantidad de fichas que posee un jugador en un momento determinado.'],
      ['Flop, turn y river', 'En Hold’em y Omaha, son las etapas en las que aparecen las cartas comunitarias.'],
      ['Buy-in', 'Importe de entrada requerido en un torneo o cantidad necesaria para sentarse en determinadas mesas.']
    ]
  }
];

export const destacados = [
  { etiqueta: 'TU PORTAL INFORMATIVO', antes: 'EL MUNDO DEL', acento: 'PÓKER', despues: 'EN UN SOLO LUGAR.', descripcion: 'Explora las modalidades de póker, conoce nuestra historia y encuentra recursos para comenzar a aprender, paso a paso.', enlace: '/guias', boton: 'EXPLORAR GUÍAS', imagen: '/images%20(1).jpg', alt: 'Fotografía temática de póker con cartas y fichas' },
  { etiqueta: 'CONOCE LOS FORMATOS', antes: 'DE LOS TORNEOS A LOS', acento: 'SPIN & GO', despues: '', descripcion: 'Descubre cómo funcionan los torneos multimesa, Sit & Go, Spin & Go y las mesas cash.', enlace: '/modalidades', boton: 'VER MODALIDADES', imagen: '/poker-hero.svg', alt: 'Ilustración gráfica de cartas y fichas de póker' },
  { etiqueta: 'APRENDE PASO A PASO', antes: 'EMPIEZA CON LAS', acento: 'REGLAS BÁSICAS', despues: '', descripcion: 'Familiarízate con las manos de póker, las rondas de apuesta y el vocabulario habitual del juego.', enlace: '/guias/primeros-pasos', boton: 'EMPEZAR A APRENDER', imagen: '/images%20(1).jpg', alt: 'Fotografía de una mesa de póker' }
];
