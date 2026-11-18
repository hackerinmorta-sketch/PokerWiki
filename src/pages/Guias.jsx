import { guias } from '../data';
import { Enlace } from '../lib/navegacion';
import { PortadaInterior, TarjetaEnlace, TituloSeccion } from '../components/Estructura';

export function Guias() {
  return (
    <>
      <PortadaInterior etiqueta="APRENDE PÓKER" titulo="GUÍAS PARA PRINCIPIANTES" descripcion="Una introducción sencilla a las reglas, las combinaciones y los términos más utilizados en el póker. Sin registro ni apuestas." icono="♦" />
      <section className="seccion-tarjetas seccion-interior" aria-labelledby="titulo-guias">
        <TituloSeccion etiqueta="APRENDIZAJE PASO A PASO" titulo="ELIGE UNA GUÍA" id="titulo-guias" />
        <div className="tarjetas">
          {guias.map((guia) => <TarjetaEnlace key={guia.slug} to={`/guias/${guia.slug}`} numero={guia.numero} simbolo={guia.simbolo} titulo={guia.titulo} descripcion={guia.resumen} categoria="LEER GUÍA" />)}
        </div>
      </section>
    </>
  );
}

export function DetalleGuia({ slug }) {
  const guia = guias.find((item) => item.slug === slug);
  if (!guia) return null;
  return (
    <>
      <PortadaInterior etiqueta="CONTENIDO EDUCATIVO" titulo={guia.titulo.toUpperCase()} descripcion={guia.introduccion} icono={guia.simbolo} />
      <section className="seccion-tarjetas seccion-interior" aria-labelledby="titulo-pasos">
        <TituloSeccion etiqueta="GUÍA INTRODUCTORIA" titulo="PUNTOS PRINCIPALES" id="titulo-pasos" />
        <div className="tarjetas tarjetas-detalle">
          {guia.pasos.map(([titulo, descripcion], indice) => <article key={titulo} className="tarjeta"><div className="tarjeta-cabecera"><span>{String(indice + 1).padStart(2, '0')}</span><span className="tarjeta-simbolo" aria-hidden="true">♦</span></div><h3>{titulo}</h3><p>{descripcion}</p></article>)}
        </div>
        <div className="acciones-secundarias"><Enlace className="boton boton-contorno" to="/guias">← VOLVER A GUÍAS</Enlace><Enlace className="boton boton-dorado" to="/modalidades">VER MODALIDADES ↗</Enlace></div>
      </section>
    </>
  );
}
