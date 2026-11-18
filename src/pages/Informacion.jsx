import { Enlace } from '../lib/navegacion';
import { PortadaInterior, TituloSeccion } from '../components/Estructura';

export function InformacionGeneral() {
  return <>
    <PortadaInterior etiqueta="INFORMACIÓN Y AYUDA" titulo="TODO SOBRE POKERWIKI" descripcion="Conoce el propósito de PokerWiki, encuentra orientación y consulta recursos de juego responsable." icono="♦" />
    <section className="seccion-tarjetas seccion-interior" aria-labelledby="titulo-informacion">
      <TituloSeccion etiqueta="RECURSOS DEL SITIO" titulo="¿QUÉ NECESITAS SABER?" id="titulo-informacion" />
      <div className="tarjetas">
        <article className="tarjeta"><div className="tarjeta-cabecera"><span>01</span><span className="tarjeta-simbolo" aria-hidden="true">♠</span></div><h3>Sobre el proyecto</h3><p>Conoce los objetivos educativos y el carácter independiente de PokerWiki.</p><Enlace to="/empresa" className="tarjeta-proximamente">CONOCER EL PROYECTO →</Enlace></article>
        <article className="tarjeta"><div className="tarjeta-cabecera"><span>02</span><span className="tarjeta-simbolo" aria-hidden="true">♦</span></div><h3>Contacto y ayuda</h3><p>Encuentra las opciones para resolver tus dudas y participar en la comunidad.</p><Enlace to="/contacto" className="tarjeta-proximamente">CONSULTAR AYUDA →</Enlace></article>
        <article className="tarjeta"><div className="tarjeta-cabecera"><span>03</span><span className="tarjeta-simbolo" aria-hidden="true">♣</span></div><h3>Juego responsable</h3><p>Lee información educativa sobre hábitos responsables y prevención de riesgos.</p><Enlace to="/juego-responsable" className="tarjeta-proximamente">LEER MÁS →</Enlace></article>
      </div>
    </section>
  </>;
}

export function Empresa() {
  return (
    <>
      <PortadaInterior etiqueta="INFORMACIÓN INSTITUCIONAL" titulo="ACERCA DE POKERWIKI" descripcion="PokerWiki es un proyecto universitario independiente para aprender póker y compartir conocimientos. No representa a ninguna plataforma de apuestas." icono="♠" />
      <section className="seccion-tarjetas seccion-interior" aria-labelledby="titulo-empresa">
        <TituloSeccion etiqueta="CONTEXTO DEL PROYECTO" titulo="HISTORIA Y PROPÓSITO" id="titulo-empresa" />
        <div className="tarjetas">
          <article className="tarjeta"><div className="tarjeta-cabecera"><span>01</span><span className="tarjeta-simbolo">♠</span></div><h3>Nuestra identidad</h3><p>PokerWiki reúne cursos de póker, seguimiento del aprendizaje y una comunidad de estudiantes. Su contenido es educativo e independiente.</p></article>
          <article className="tarjeta"><div className="tarjeta-cabecera"><span>02</span><span className="tarjeta-simbolo">♦</span></div><h3>Nuestro objetivo</h3><p>Organizar información sobre modalidades, guías, contexto empresarial y juego responsable en una interfaz clara.</p></article>
          <article className="tarjeta"><div className="tarjeta-cabecera"><span>03</span><span className="tarjeta-simbolo">♣</span></div><h3>Alcance académico</h3><p>Este sitio es una demostración universitaria independiente. No representa a la empresa ni procesa apuestas o dinero.</p></article>
        </div>
        <div className="acciones-secundarias"><Enlace className="boton boton-dorado" to="/modalidades">EXPLORAR MODALIDADES ↗</Enlace><Enlace className="boton boton-contorno" to="/contacto">IR A CONTACTO →</Enlace></div>
      </section>
    </>
  );
}

export function Contacto() {
  return (
    <>
      <PortadaInterior etiqueta="CONTACTO Y AYUDA" titulo="INFORMACIÓN DE CONTACTO" descripcion="PokerWiki ofrece materiales educativos y una comunidad de estudiantes. No gestiona cuentas ni servicios de plataformas de apuestas." icono="♦" />
      <section className="seccion-tarjetas seccion-interior" aria-labelledby="titulo-contacto">
        <TituloSeccion etiqueta="INFORMACIÓN ÚTIL" titulo="¿CÓMO PODEMOS ORIENTARTE?" id="titulo-contacto" />
        <div className="tarjetas">
          <article className="tarjeta"><div className="tarjeta-cabecera"><span>01</span><span className="tarjeta-simbolo">♠</span></div><h3>Información educativa</h3><p>Consulta explicaciones sobre las modalidades y las reglas básicas de póker.</p><Enlace to="/academia" className="tarjeta-proximamente">VER CURSOS <span>→</span></Enlace></article>
          <article className="tarjeta"><div className="tarjeta-cabecera"><span>02</span><span className="tarjeta-simbolo">♦</span></div><h3>Preguntas de la comunidad</h3><p>Comparte tus dudas sobre el contenido educativo con otros estudiantes registrados.</p><Enlace to="/comunidad" className="tarjeta-proximamente">VISITAR COMUNIDAD <span>→</span></Enlace></article>
          <article className="tarjeta"><div className="tarjeta-cabecera"><span>03</span><span className="tarjeta-simbolo">♣</span></div><h3>Juego responsable</h3><p>Infórmate sobre la importancia de los límites personales y la prevención de riesgos.</p><Enlace to="/juego-responsable" className="tarjeta-proximamente">LEER MÁS <span>→</span></Enlace></article>
        </div>
        <div className="preguntas"><h3>Preguntas frecuentes</h3><details><summary>¿PokerWiki es una plataforma oficial de apuestas?</summary><p>No. Es un proyecto universitario independiente, sin apuestas ni operaciones financieras.</p></details><details><summary>¿Puedo registrarme o jugar aquí?</summary><p>Puedes crear una cuenta para guardar cursos, escribir reseñas y participar en la comunidad. No se ofrecen juegos con dinero ni apuestas.</p></details><details><summary>¿Dónde puedo consultar reglas y modalidades?</summary><p>En las secciones de <Enlace to="/academia">Cursos</Enlace> y <Enlace to="/modalidades">Modalidades</Enlace>.</p></details></div>
      </section>
    </>
  );
}

export function JuegoResponsable() {
  return (
    <>
      <PortadaInterior etiqueta="PREVENCIÓN Y SEGURIDAD" titulo="JUEGO RESPONSABLE" descripcion="El póker con apuestas implica riesgos económicos y personales. Esta sección reúne principios básicos de prevención y orientación." icono="♣" />
      <section className="seccion-tarjetas seccion-interior" aria-labelledby="titulo-responsable">
        <TituloSeccion etiqueta="INFORMACIÓN PREVENTIVA" titulo="PRINCIPIOS IMPORTANTES" id="titulo-responsable" />
        <div className="tarjetas">
          <article className="tarjeta"><div className="tarjeta-cabecera"><span>01</span><span className="tarjeta-simbolo">♣</span></div><h3>Conocer los riesgos</h3><p>Ninguna estrategia garantiza ganancias. El azar sigue interviniendo y pueden producirse pérdidas.</p></article>
          <article className="tarjeta"><div className="tarjeta-cabecera"><span>02</span><span className="tarjeta-simbolo">♦</span></div><h3>Establecer límites</h3><p>Los límites de tiempo y dinero son una medida de prevención. Nunca deben utilizarse recursos destinados a necesidades básicas.</p></article>
          <article className="tarjeta"><div className="tarjeta-cabecera"><span>03</span><span className="tarjeta-simbolo">♠</span></div><h3>Buscar orientación</h3><p>Si el juego afecta la economía, el bienestar o las relaciones personales, conviene interrumpirlo y pedir ayuda profesional.</p></article>
        </div>
        <div className="nota-informativa"><strong>Importante</strong><p>Este sitio no ofrece apuestas ni asesoría profesional. La información es educativa y no sustituye servicios de apoyo especializados.</p></div>
        <div className="acciones-secundarias"><Enlace className="boton boton-contorno" to="/">← VOLVER AL INICIO</Enlace><Enlace className="boton boton-dorado" to="/contacto">INFORMACIÓN DE CONTACTO ↗</Enlace></div>
      </section>
    </>
  );
}

export function NoEncontrada() {
  return (
    <>
      <PortadaInterior etiqueta="ERROR 404" titulo="PÁGINA NO ENCONTRADA" descripcion="La dirección que buscas no corresponde a una sección de este prototipo. Utiliza el menú para regresar." icono="♠" />
    </>
  );
}
