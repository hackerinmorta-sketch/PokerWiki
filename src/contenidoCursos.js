// Material didáctico introductorio. No representa asesoría financiera ni condiciones comerciales actualizadas.
// Las reglas, tarifas y formatos específicos pueden variar por plataforma y jurisdicción.
export const cursos = {
  'cash-games': {
    nivel: 'Inicial a intermedio', tiempo: '12–18 min',
    subtitulo: 'Aprende cómo funcionan las mesas de dinero, las ciegas, los stacks y las decisiones más habituales.',
    imagen: '/curso/cash-hero.webp',
    objetivos: ['Distinguir una mesa cash de un torneo.', 'Entender las ciegas, el buy-in y la profundidad del stack.', 'Reconocer las etapas de una mano y decisiones básicas.', 'Identificar el rake, los riesgos y el juego responsable.'],
    capitulos: [
      { id: 'concepto', etiqueta: '01 / FUNDAMENTOS', titulo: '¿Qué es un Cash Game?',
        parrafos: [
          'Un Cash Game, también llamado ring game, es una partida de póker en la que las fichas tienen un valor asociado al dinero utilizado para entrar a la mesa. A diferencia de un torneo, no se juega hasta que quede un único ganador: la mesa continúa mientras haya jugadores y la sala la mantenga abierta.',
          'Un participante puede sentarse cuando existe un asiento disponible y dejar la mesa al finalizar una mano, según las reglas aplicables. Las ciegas permanecen en el nivel establecido para esa mesa, aunque el tamaño de los stacks individuales cambia al ganar o perder botes.'
        ],
        puntos: ['Las fichas representan un valor monetario en mesas de dinero real.', 'No existen premios por posición como en un torneo multimesa.', 'La entrada a la mesa está sujeta a límites mínimos y máximos.'],
        nota: 'También hay mesas de dinero ficticio. Son adecuadas para aprender la interfaz sin apostar dinero real.'
      },
      { id: 'estructura', etiqueta: '02 / ESTRUCTURA', titulo: 'Ciegas, buy-in y profundidad del stack',
        parrafos: [
          'Una mesa puede anunciarse como $0.01/$0.02. El primer importe corresponde a la ciega pequeña (SB) y el segundo a la ciega grande (BB). La ciega grande se utiliza para expresar los tamaños de stack y las apuestas de una forma que permite comparar diferentes niveles.',
          'El buy-in es la cantidad con la que entras. En muchas mesas, los límites permiten comprar entre unas 20 y 100 ciegas grandes, aunque esto depende de la sala y del formato. Por ejemplo, 100 BB en una mesa de $0.01/$0.02 equivalen a $2.00. Ese valor es solo un ejemplo matemático, no una recomendación para jugar.'
        ],
        puntos: ['20 BB representan un stack corto; 100 BB suelen considerarse un stack relativamente profundo.', 'En cash, las ciegas no aumentan automáticamente por niveles.', 'Las apuestas máximas dependen del límite: No-Limit, Pot-Limit o Fixed-Limit.']
      },
      { id: 'desarrollo', etiqueta: '03 / UNA MANO', titulo: '¿Cómo transcurre una mano?',
        parrafos: [
          'En Texas Hold’em se colocan las ciegas, cada persona recibe dos cartas privadas y comienza la ronda preflop. Después pueden mostrarse tres cartas comunitarias (flop), una cuarta (turn) y una quinta (river), con nuevas rondas de apuesta entre ellas.',
          'En cada turno, según lo que haya sucedido antes, se puede pasar (check), apostar (bet), igualar (call), subir (raise) o retirarse (fold). Si dos o más jugadores permanecen después de la última ronda, se comparan las manos en el showdown; el mejor juego válido gana el bote, salvo empates.'
        ],
        puntos: ['Preflop: elegir si entrar al bote y con qué tamaño.', 'Flop y turn: evaluar cómo cambia la fuerza de la mano.', 'River: decidir la última apuesta o respuesta y llegar al showdown si corresponde.']
      },
      { id: 'posicion', etiqueta: '04 / DECISIONES', titulo: 'La posición importa',
        parrafos: [
          'Estar en posición significa actuar después del rival en las calles posteriores. Eso permite observar su acción antes de tomar una decisión. Por esta razón, la posición influye en qué manos se juegan y cómo se administran los tamaños de apuesta.',
          'En una mesa de seis jugadores (6-max) suele haber más manos por hora y rangos de apertura distintos a los de una mesa de nueve jugadores. No existe una tabla universal que garantice resultados. Es necesario considerar la variante, el stack efectivo, las posiciones y la acción previa.'
        ],
        puntos: ['Las posiciones tempranas suelen requerir una selección de manos más cuidadosa.', 'En el botón (BTN) se actúa después de muchas posiciones rivales tras el flop.', 'El tamaño del stack efectivo condiciona cuánto se puede ganar o perder frente a un rival.']
      },
      { id: 'apuestas', etiqueta: '05 / CONCEPTOS', titulo: 'Valor, faroles y pot odds',
        parrafos: [
          'Una apuesta por valor busca recibir pagos de manos peores. Un farol intenta provocar que el rival retire una mano mejor que la propia. Ambas decisiones necesitan un razonamiento sobre el rango del rival; apostar sin un objetivo suele ser un error.',
          'Las pot odds permiten comparar el coste de pagar con el bote final que se podría ganar. Si el bote es de $10, el rival apuesta $5 y debes pagar $5, el bote final sería de $20. Necesitarías aproximadamente un 25 % de equity para que el call alcanzara el punto de equilibrio, sin considerar rake ni apuestas futuras.'
        ],
        puntos: ['Una mano fuerte no siempre necesita apostar muy grande.', 'Un proyecto no justifica automáticamente pagar cualquier apuesta.', 'Las pot odds son solo una parte de la decisión: importan la equity, los rangos y la acción futura.']
      },
      { id: 'comparacion', etiqueta: '06 / COMPARACIÓN', titulo: 'Cash Games frente a torneos',
        parrafos: [
          'En un torneo se paga una entrada y se recibe un stack de fichas de torneo. Las ciegas aumentan según los niveles y las decisiones pueden depender de la estructura de premios. En cash, en cambio, los stacks tienen valor monetario y no hay una etapa final obligatoria para la mesa.',
          'Las partidas cash permiten sesiones de duración flexible, pero eso no elimina la varianza ni los riesgos económicos. Las pérdidas y ganancias a corto plazo pueden variar mucho incluso con decisiones razonables.'
        ],
        puntos: ['Cash: ciegas normalmente fijas y entrada o salida flexible.', 'Torneos: ciegas crecientes y eliminación progresiva.', 'Ambos formatos requieren comprender reglas, probabilidades y límites personales.']
      },
      { id: 'riesgos', etiqueta: '07 / RESPONSABILIDAD', titulo: 'Rake, varianza y juego responsable',
        parrafos: [
          'En partidas con dinero real, la sala puede cobrar una comisión llamada rake, que afecta los resultados. Las condiciones varían por plataforma, formato y mercado. No debe suponerse que jugar muchas manos o estudiar garantiza ganancias.',
          'La varianza describe las fluctuaciones del resultado respecto de su valor esperado. Puedes ganar con decisiones malas o perder con decisiones correctas durante periodos cortos. Por eso, conocer las reglas y controlar el tiempo y el dinero dedicado al juego es más importante que buscar recuperar pérdidas.'
        ],
        puntos: ['No uses dinero destinado a necesidades básicas.', 'Establece límites de tiempo y dinero antes de participar.', 'No persigas las pérdidas ni interpretes una buena racha como garantía.', 'Consulta los recursos de juego responsable y la regulación local.'],
        nota: 'Este proyecto es educativo, no ofrece apuestas, inscripciones ni recomendaciones financieras.'
      }
    ],
    glosario: [ ['BB', 'Ciega grande; unidad común para medir stacks y apuestas.'], ['SB', 'Ciega pequeña, colocada antes de repartir.'], ['Stack efectivo', 'La cantidad máxima que puede ponerse en juego entre dos rivales.'], ['Rake', 'Comisión que cobra una sala en determinadas partidas.'], ['3-bet', 'Nueva subida después de una subida inicial preflop.'], ['Showdown', 'Momento en que se comparan las manos al final.'] ],
    preguntas: [
      ['¿Se puede salir de la mesa en cualquier momento?', 'Por lo general, sí, después de finalizar la mano y sujeto a las reglas de la sala.'],
      ['¿Las ciegas aumentan como en los torneos?', 'No en una mesa cash estándar. Para jugar otros límites se cambia de mesa.'],
      ['¿Cash Games significa jugar sin riesgo?', 'No. Los resultados son inciertos, hay riesgo de perder dinero y pueden aplicarse comisiones.']
    ],
    fuente: 'https://www.pokerstars.com/help/articles/ring-explanations/14982/'
  },
  'torneos': {
    nivel:'Principiante', tiempo:'7–9 min', subtitulo:'Aprende la estructura de un MTT, los niveles de ciegas y cómo se llega a la mesa final.', imagen:'/images%20(1).jpg',
    objetivos:['Comprender la inscripción y el stack inicial.','Entender los niveles y la eliminación.','Identificar el papel de la estructura de premios.'],
    capitulos:[
      {id:'definicion',etiqueta:'01 / PRINCIPIOS',titulo:'¿Qué es un torneo multimesa?',parrafos:['Los torneos multimesa (MTT) reúnen participantes distribuidos en distintas mesas. Cada jugador recibe fichas de torneo al inscribirse y compite bajo una estructura predefinida. Las mesas se equilibran a medida que se eliminan jugadores.','Las fichas del torneo no equivalen directamente a dinero en efectivo: los premios, cuando existen, dependen de la posición final y de las reglas del evento.'],puntos:['Inicio y niveles definidos.','Mesas que se reorganizan.','Eliminaciones hasta la fase final.']},
      {id:'niveles',etiqueta:'02 / ESTRUCTURA',titulo:'Ciegas, ante y ritmos',parrafos:['Las ciegas suben progresivamente y reducen la cantidad de ciegas grandes que representa un stack si no gana fichas. Algunos torneos también utilizan ante, una aportación obligatoria que ayuda a formar el bote.','Las versiones turbo y regulares tienen tiempos de nivel diferentes, pero la duración de un torneo real depende de su estructura y cantidad de participantes.'],puntos:['Comprueba la duración de los niveles.','Identifica si se cobra ante.','Observa el stack en BB, no solo en fichas.']},
      {id:'etapas',etiqueta:'03 / FASES',titulo:'De las primeras manos a la mesa final',parrafos:['En la etapa inicial hay stacks relativamente profundos. En fases intermedias pueden aparecer stacks cortos y decisiones de all-in. Cerca de premios, la estructura de pagos influye en decisiones a través de conceptos como ICM.','En un torneo no basta con acumular fichas: las decisiones dependen también de la situación general y de la supervivencia del stack.'],puntos:['Etapa inicial.','Etapas intermedias y burbuja.','Mesa final y premios.']},
      {id:'precauciones',etiqueta:'04 / RESPONSABILIDAD',titulo:'Qué revisar antes de participar',parrafos:['Las entradas, reentradas, comisiones y niveles dependen de cada evento. Algunos torneos pueden durar varias horas. Consulta la información específica antes de comenzar y nunca comprometas dinero necesario para tus gastos.'],puntos:['Revisa duración estimada y estructura.','Comprende el pago de premios.','No supongas ganancias garantizadas.']}
    ], fuente:'https://www.pokerstars.com/poker/tournaments/types/'
  },
  'spin-and-go': {
    nivel:'Principiante', tiempo:'6–8 min', subtitulo:'Torneos rápidos de tres jugadores con un premio determinado aleatoriamente.', imagen:'/curso/mesa-poker.webp',
    objetivos:['Identificar el mecanismo del premio aleatorio.','Comprender las ciegas rápidas.','Distinguir el formato de un Sit & Go convencional.'],
    capitulos:[
      {id:'funcionamiento',etiqueta:'01 / FORMATO',titulo:'¿Cómo funciona un Spin & Go?',parrafos:['En el formato clásico participan tres jugadores y el torneo comienza cuando se completa la mesa. Antes de jugar se sortea un multiplicador que determina el premio acumulado.','La naturaleza rápida del formato produce situaciones frecuentes con stacks cortos. El premio de un sorteo es aleatorio y no representa una recompensa garantizada por participar.'],puntos:['Tres jugadores en el formato clásico.','Premio definido antes de repartir la primera mano.','Estructura de ciegas corta o hiperturbo.']},
      {id:'diferencias',etiqueta:'02 / COMPARACIÓN',titulo:'¿En qué se diferencia de un MTT?',parrafos:['Un MTT puede reunir muchas mesas y prolongarse durante horas. Un Spin & Go reúne una única mesa de pocos participantes, con una dinámica mucho más rápida.','Las estructuras disponibles, multiplicadores y stacks iniciales pueden cambiar según el mercado y las condiciones de la plataforma.'],puntos:['Duración breve, pero no fija.','Menos participantes.','Premios variables definidos por sorteo.']},
      {id:'estrategia',etiqueta:'03 / CONCEPTOS',titulo:'Stacks cortos y heads-up',parrafos:['Con ciegas crecientes y stacks reducidos, la posición y el tamaño del stack relativo a las ciegas tienen mucho peso. Cuando se elimina un jugador, los dos restantes pasan a disputar un heads-up.','No existe una estrategia sencilla que elimine el azar; aprender probabilidades y gestión del riesgo es más útil que intentar adivinar multiplicadores.'],puntos:['Interpretar el stack en BB.','Conocer las posiciones de botón y ciegas.','Entender la fase heads-up.']},
      {id:'responsabilidad',etiqueta:'04 / RESPONSABILIDAD',titulo:'Varianza y precauciones',parrafos:['El multiplicador aleatorio introduce una fuente adicional de incertidumbre en los resultados. Una sesión corta no permite evaluar de forma fiable la habilidad de un jugador.','Revisa las condiciones de cada juego, establece límites y no utilices este formato como método para obtener ingresos.'],puntos:['Premios sujetos al azar.','Los niveles varían por multiplicador y sala.','No hay ganancias aseguradas.']}
    ], fuente:'https://www.pokerstars.com/poker/tournaments/types/'
  },
  'sit-and-go': {
    nivel:'Principiante', tiempo:'6–8 min', subtitulo:'Torneos que comienzan cuando se registra el número previsto de jugadores.', imagen:'/poker-hero.svg',
    objetivos:['Entender el inicio por cupos.','Identificar las fases habituales.','Diferenciar SNG y MTT.'],
    capitulos:[
      {id:'definicion',etiqueta:'01 / FORMATO',titulo:'Inicio sin horario fijo',parrafos:['Un Sit & Go comienza cuando se llena el número de asientos requerido. A diferencia de un torneo programado, no necesita una hora de inicio determinada.','Puede haber formatos de una mesa y formatos multimesa con estructuras diferentes. En muchos casos se paga una entrada y se reciben fichas de torneo.'],puntos:['Inicio al completar participantes.','Número de jugadores según modalidad.','Estructura y premios preestablecidos.']},
      {id:'etapas',etiqueta:'02 / DESARROLLO',titulo:'Etapas de un Sit & Go',parrafos:['En un Sit & Go de una mesa las ciegas aumentan y los jugadores van quedando eliminados. Las etapas inicial, intermedia y de premios pueden exigir decisiones muy diferentes.','No todos los Sit & Go son iguales: algunos son turbo, otros regulares y otros presentan reglas adicionales.'],puntos:['Ciegas ascendentes.','Eliminaciones progresivas.','Final entre los jugadores restantes.']},
      {id:'diferencias',etiqueta:'03 / CONTEXTO',titulo:'Sit & Go, Spin & Go y MTT',parrafos:['Spin & Go es un tipo específico de Sit & Go rápido con premio aleatorio. Un MTT tradicional, en cambio, puede abrir registro por horario y reunir muchas mesas.','La elección entre formatos no elimina el riesgo ni garantiza resultados.'],puntos:['Sit & Go: comienzo por cupos.','Spin & Go: variante rápida con sorteo.','MTT: torneo de múltiples mesas.']}
    ], fuente:'https://www.pokerstars.com/poker/tournaments/types/'
  },
  'texas-holdem': {
    nivel:'Principiante', tiempo:'15–20 min', subtitulo:'Aprende desde cero las reglas, acciones, manos y conceptos de Texas Hold’em.', imagen:'/curso/cash-hero.webp',
    objetivos:['Reconocer las rondas y las cartas comunitarias.','Identificar qué significa cada acción de apuesta.','Comparar correctamente manos de cinco cartas.','Comprender términos habituales del juego.'],
    capitulos:[
      {id:'cartas',etiqueta:'01 / REGLAS',titulo:'Dos cartas privadas',parrafos:['En Texas Hold’em cada jugador recibe dos cartas privadas que únicamente él puede ver. En la mesa pueden aparecer hasta cinco cartas comunitarias compartidas.','El objetivo es formar la mejor mano válida de cinco cartas o ganar el bote cuando los demás jugadores se retiran. Es posible utilizar ambas cartas privadas, una o ninguna para formar la mano final.'],puntos:['Dos cartas privadas.','Hasta cinco cartas comunitarias.','Mejor mano final de cinco cartas.']},
      {id:'rondas',etiqueta:'02 / RONDAS',titulo:'Preflop, flop, turn y river',parrafos:['La primera ronda de apuestas ocurre antes de las cartas comunitarias, llamada preflop. Se reparte el flop de tres cartas, luego el turn de una y finalmente el river de una.','Puede haber una ronda de apuestas después de cada etapa si todavía participan jugadores que pueden actuar.'],puntos:['Preflop: dos cartas propias.','Flop: tres cartas comunitarias.','Turn y river: una carta cada uno.']},
      {id:'decisiones',etiqueta:'03 / ESTRATEGIA',titulo:'Posición y selección de manos',parrafos:['La posición condiciona la información disponible al actuar. Una mano inicial que puede ser razonable en el botón quizá no lo sea en una posición temprana.','La estrategia depende además del tamaño del stack, las apuestas previas y el tipo de rival.'],puntos:['Observar la posición.','Evaluar el stack en ciegas grandes.','No confundir una pareja con una victoria segura.']},
      {id:'acciones-basicas',etiqueta:'04 / FUNDAMENTOS',titulo:'Qué significa apostar, igualar, subir y retirarse',parrafos:[
        'En una ronda de apuestas cada jugador decide según su mano, su posición y lo que hayan hecho los demás. Retirarse (fold) significa abandonar la mano actual y no invertir más fichas en ella. Pasar (check) permite conservar la opción de continuar sin apostar, pero únicamente si nadie ha realizado una apuesta pendiente de igualar.',
        'Apostar (bet) es introducir fichas en el bote cuando todavía no hay una apuesta activa en esa ronda. Una apuesta por valor busca que otras manos peores paguen; un farol intenta que manos mejores abandonen. No toda apuesta es un farol y no hay una única cantidad correcta que funcione en todas las situaciones.',
        'Igualar (call) consiste en aportar las fichas necesarias para continuar frente a una apuesta. Subir (raise) incrementa esa apuesta, de modo que los adversarios deben decidir nuevamente si igualan, vuelven a subir o se retiran. Antes de igualar conviene comparar el coste con el tamaño total que puede ganarse y con la probabilidad estimada de mejorar o ganar.'
      ],puntos:['Check solo es posible si no hay una apuesta pendiente.','Bet inicia una apuesta en la ronda; raise aumenta una apuesta existente.','Valora el motivo de apostar antes de elegir la cantidad.']},
      {id:'jerarquia-manos',etiqueta:'05 / FUNDAMENTOS',titulo:'Cómo se comparan las manos de póker',parrafos:[
        'En Texas Hold’em se comparan manos de cinco cartas. El orden habitual, de mayor a menor, es escalera real, escalera de color, póker (cuatro del mismo valor), full house, color, escalera, trío, doble pareja, pareja y carta alta.',
        'Si dos jugadores tienen la misma categoría de mano, no se declara automáticamente un empate. Se comparan primero las cartas que determinan esa categoría y, cuando corresponda, los desempates o kickers. Por ejemplo, una pareja de ases normalmente vence a una pareja de reyes.',
        'En ocasiones la mejor mano está completamente en las cinco cartas comunitarias. Entonces los jugadores que permanezcan en la mano pueden empatar si nadie logra formar una combinación superior con sus cartas privadas.'
      ],puntos:['Usa exactamente cinco cartas para evaluar la mano final.','Conoce la categoría y los desempates.','Las variantes low y hi/lo pueden usar otros criterios.']},
      {id:'glosario-inicial',etiqueta:'06 / REFERENCIA',titulo:'Glosario para entender una mesa',parrafos:[
        'Blinds o ciegas son apuestas obligatorias colocadas antes de repartir las cartas. Stack es la cantidad de fichas con las que cuenta un jugador. Buy-in puede referirse al coste de inscripción de un torneo o al importe con el que se entra a una mesa cash, dependiendo del contexto.',
        'Preflop es la etapa anterior a las cartas comunitarias. Flop designa las primeras tres cartas compartidas; turn, la cuarta; river, la quinta. Showdown es el momento en que las manos se comparan cuando quedan varios jugadores tras la última ronda de apuestas.',
        'Pot significa bote. Pot odds es una forma de expresar qué proporción del bote final representa el coste de igualar una apuesta. Estos términos se utilizan para describir decisiones, no para garantizar resultados.'
      ],puntos:['Blinds: apuestas obligatorias.','Stack: fichas disponibles.','Pot odds: relación entre coste de igualar y bote final.']}
    ], fuente:'https://www.pokerstars.com/poker/learn/'
  },
  'omaha': {
    nivel:'Principiante', tiempo:'6–8 min', subtitulo:'Una variante con más cartas privadas y una regla de combinación obligatoria.', imagen:'/images%20(1).jpg',
    objetivos:['Distinguir Omaha de Hold’em.','Recordar la regla de dos cartas privadas.','Comprender las manos finales.'],
    capitulos:[
      {id:'cartas',etiqueta:'01 / REGLAS',titulo:'Cuatro cartas privadas en Omaha clásico',parrafos:['En Omaha tradicional cada jugador recibe cuatro cartas privadas y comparte hasta cinco cartas comunitarias con el resto de la mesa.','La diferencia central con Hold’em es que debes usar exactamente dos cartas privadas y tres comunitarias para construir tu mano final de cinco cartas.'],puntos:['Cuatro cartas privadas.','Exactamente dos privadas en la mano final.','Exactamente tres comunitarias.']},
      {id:'variantes',etiqueta:'02 / FORMATOS',titulo:'Omaha Hi y Omaha Hi/Lo',parrafos:['Omaha Hi premia a la mejor mano alta. Omaha Hi/Lo puede dividir el bote entre la mejor mano alta y una mano baja que cumpla los requisitos establecidos.','Las reglas específicas deben revisarse antes de jugar cada variante.'],puntos:['Omaha Hi.','Omaha Hi/Lo.','Pot-Limit Omaha es una estructura de apuestas común.']},
      {id:'errores',etiqueta:'03 / CONCEPTOS',titulo:'Errores de interpretación frecuentes',parrafos:['Un principiante puede creer que, si hay cuatro cartas del mismo palo en la mesa, automáticamente tiene color. En Omaha eso no es necesariamente cierto, porque debe utilizar exactamente dos de sus cartas privadas.','Tampoco puede utilizar solo una carta privada para formar una escalera.'],puntos:['Usar siempre dos privadas.','Comprobar que haya tres comunitarias.','No aplicar las reglas de Hold’em.']}
    ], fuente:'https://www.pokerstars.com/poker/learn/'
  },
  'seven-card-stud': {
    nivel:'Principiante', tiempo:'6–8 min', subtitulo:'Póker sin cartas comunitarias con cartas propias visibles y ocultas.', imagen:'/poker-hero.svg',
    objetivos:['Identificar la ausencia de flop comunitario.','Comprender las cartas abiertas y cerradas.','Reconocer el objetivo de la mano final.'],
    capitulos:[
      {id:'definicion',etiqueta:'01 / REGLAS',titulo:'Sin cartas comunitarias',parrafos:['En Seven Card Stud cada jugador recibe cartas propias, algunas visibles para los oponentes y otras ocultas. No se comparten cinco cartas comunitarias como en Hold’em.','Los participantes pueden recibir hasta siete cartas en distintas rondas y formar su mejor combinación de cinco cartas en la versión high.'],puntos:['Hasta siete cartas propias.','Cartas abiertas y cartas cerradas.','La mejor mano high utiliza cinco cartas.']},
      {id:'desarrollo',etiqueta:'02 / JUEGO',titulo:'Las calles y las apuestas',parrafos:['El reparto se organiza en calles, con apuestas después de distintas etapas. Las cartas expuestas ofrecen información pública sobre lo que cada rival puede estar formando.','Esta información visible modifica la estrategia y hace necesario prestar atención a las cartas descubiertas.'],puntos:['Cartas visibles influyen en las decisiones.','Las apuestas se distribuyen entre calles.','No existe flop, turn o river comunitario.']},
      {id:'variantes',etiqueta:'03 / VARIANTES',titulo:'Seven Card Stud Hi/Lo',parrafos:['La variante Hi/Lo puede dividir el bote entre manos altas y bajas elegibles. Sus reglas de mano baja no son iguales a la jerarquía tradicional high.','Conviene estudiar cada modalidad por separado.'],puntos:['Stud high.','Stud Hi/Lo.','Comparar la clasificación específica de cada modalidad.']}
    ], fuente:'https://www.pokerstars.com/poker/learn/'
  }
};
