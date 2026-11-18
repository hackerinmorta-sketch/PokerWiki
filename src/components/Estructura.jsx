import { useEffect, useState } from 'react';
import { Enlace, useRuta } from '../lib/navegacion';
import { useAuth } from '../context/AuthContext';

export function Marca() {
  return (
    <div className="marca" aria-label="PokerWiki, plataforma académica independiente">
      <span className="marca-emblema" aria-hidden="true"><span className="marca-pica">♠</span></span>
      <span className="marca-nombre">poker<span>Wiki</span></span>
    </div>
  );
}

// Cada pestaña tiene un símbolo decorativo que aparece con hover y foco de teclado.
// No sustituye al texto, ni exige usar ratón para navegar.
const enlaces = [
  { to: '/', texto: 'Inicio', palo: '♠' },
  { to: '/academia', texto: 'Cursos', palo: '♦' },
  { to: '/modalidades', texto: 'Modalidades', palo: '♥' },
  { to: '/mis-cursos', texto: 'Mi aprendizaje', palo: '♣' },
  { to: '/comunidad', texto: 'Comunidad', palo: '♠' },
  { to: '/info', texto: 'Info', palo: '♦' },
];

export function Encabezado() {
  const ruta = useRuta();
  const { usuario, perfil, esAdmin } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  useEffect(() => setMenuAbierto(false), [ruta]);
  useEffect(() => {
    if (!menuAbierto) return;
    const cerrar = e => { if (e.key === 'Escape') setMenuAbierto(false); };
    window.addEventListener('keydown', cerrar);
    return () => window.removeEventListener('keydown', cerrar);
  }, [menuAbierto]);

  function enlaceActivo(to) {
    if (to === '/') return ruta === '/';
    if (to === '/info') return ['/info', '/empresa', '/contacto', '/juego-responsable'].includes(ruta);
    return ruta === to || ruta.startsWith(to + '/');
  }
  function renderEnlace(item) {
    const activo = enlaceActivo(item.to);
    return <Enlace key={item.to} to={item.to} aria-current={activo ? 'page' : undefined}
      className={activo ? 'header-link seleccionado pw-nav-item' : 'header-link pw-nav-item'}
      onClick={() => setMenuAbierto(false)}>
      <span className="pw-nav-palo" aria-hidden="true">{item.palo}</span>
      <span>{item.texto}</span>
    </Enlace>;
  }
  return (
    <header className="encabezado encabezado-sistema">
      <Enlace to="/" className="marca-link" aria-label="Volver a la página principal"><Marca /></Enlace>
      <nav className="header-nav-desktop" aria-label="Menú principal">
        {enlaces.map(renderEnlace)}
      </nav>
      <div className="header-acceso"><Enlace to="/cuenta" className="header-boton-cuenta">{usuario ? (perfil?.display_name || 'Mi cuenta') : 'Ingresar'}</Enlace></div>
      <button className="header-hamburguesa" type="button" aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuAbierto} aria-controls="menu-movil" onClick={() => setMenuAbierto(v => !v)}>
        <span /><span /><span />
      </button>
      <nav id="menu-movil" className="header-menu-movil" aria-label="Menú para dispositivos móviles" hidden={!menuAbierto}>
        {enlaces.map(renderEnlace)}
        {esAdmin && <Enlace to="/admin" className="header-link pw-nav-item" onClick={() => setMenuAbierto(false)}>Administración</Enlace>}
        <Enlace to="/cuenta" className="header-link header-link-cuenta" onClick={() => setMenuAbierto(false)}>{usuario ? 'Mi cuenta' : 'Iniciar sesión / Registrarme'}</Enlace>
      </nav>
    </header>
  );
}

// Compatibilidad con importaciones de las primeras iteraciones.
// El menú real vive en el encabezado.
export function Navegacion() { return null; }

export function FranjaOscura() {
  return (
    <div className="franja-oscura">
      <div className="franja-texto"><span className="mini-linea" /><div><strong>APRENDE · EXPLORA · DESCUBRE</strong><small>Un espacio de información y cultura del póker.</small></div></div>
      <div className="franja-naipes" aria-hidden="true"><span>♠</span><span>♦</span><span>♦</span></div>
    </div>
  );
}

export function PiePagina() {
  return (
    <footer className="pw-footer" aria-label="Pie de página general">
      <div className="pw-footer-superior">
        <div>
          <div className="pw-footer-logo">poker<span>Wiki</span></div>
          <p>Una plataforma de aprendizaje y comunidad para descubrir las reglas, formatos y estrategias del póker a tu ritmo.</p>
        </div>
        <nav aria-label="Enlaces de aprendizaje">
          <h2>Aprende</h2>
          <Enlace to="/academia">Cursos</Enlace>
          <Enlace to="/modalidades">Modalidades</Enlace>
          <Enlace to="/modalidades/texas-holdem">Empezar desde cero</Enlace>
          <Enlace to="/mis-cursos">Mi aprendizaje</Enlace>
        </nav>
        <nav aria-label="Enlaces del proyecto">
          <h2>Comunidad y ayuda</h2>
          <Enlace to="/comunidad">Comunidad</Enlace>
          <Enlace to="/info">Información</Enlace>
          <Enlace to="/empresa">Sobre el proyecto</Enlace>
          <Enlace to="/contacto">Contacto</Enlace>
          <Enlace to="/juego-responsable">Juego responsable</Enlace>
        </nav>
      </div>
      <div className="pw-footer-inferior">
        <span>© {new Date().getFullYear()} pokerWiki · Proyecto universitario</span>
        <span>Proyecto educativo independiente, sin servicios de apuestas ni transacciones.</span>
      </div>
    </footer>
  );
}

export function TituloSeccion({ etiqueta, titulo, id }) {
  return (
    <div className="secciones-titulo"><div><p className="pre-titulo"><span className="linea-roja" /> {etiqueta}</p><h2 id={id}>{titulo}</h2></div></div>
  );
}

export function PortadaInterior({ etiqueta, titulo, descripcion, icono = '♠' }) {
  return (
    <section className="hero-marco portada-interior">
      <div className="portada-interior-contenido">
        <div className="portada-interior-textos"><p className="pre-titulo"><span className="linea-roja" /> {etiqueta}</p><h1>{titulo}</h1><p>{descripcion}</p><div className="hero-botones"><Enlace className="boton boton-dorado" to="/">← VOLVER AL INICIO</Enlace><Enlace className="boton boton-contorno" to="/academia">VER CURSOS ↗</Enlace></div></div>
        <div className="portada-simbolo" aria-hidden="true"><span>{icono}</span><small>INFORMACIÓN · PÓKER</small></div>
      </div>
      <FranjaOscura />
    </section>
  );
}

export function TarjetaEnlace({ to, numero, simbolo = '♠', titulo, descripcion, categoria = 'EXPLORAR SECCIÓN' }) {
  return (
    <article className="tarjeta tarjeta-interactiva"><div className="tarjeta-cabecera"><span>{numero}</span><span className="tarjeta-simbolo" aria-hidden="true">{simbolo}</span></div><h3><Enlace to={to} className="tarjeta-titulo-enlace">{titulo}</Enlace></h3><p>{descripcion}</p><Enlace to={to} className="tarjeta-proximamente">{categoria}<span aria-hidden="true">→</span></Enlace></article>
  );
}
