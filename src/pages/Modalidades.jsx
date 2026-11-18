import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatos, variantes } from '../data';
import { cursos } from '../contenidoCursos';
import { Enlace } from '../lib/navegacion';
import './Cursos.css';

const TODAS = [...formatos, ...variantes];

function Etiqueta({ children }) {
  return <span className="curso-etiqueta"><span aria-hidden="true">✦</span> {children}</span>;
}

function Rastro({ pagina, titulo }) {
  return (
    <nav aria-label="Ruta de navegación" className="curso-rastro">
      <Enlace to="/">Inicio</Enlace><span aria-hidden="true">/</span>
      {titulo ? <><Enlace to="/modalidades">Modalidades</Enlace><span aria-hidden="true">/</span><strong>{titulo}</strong></> : <strong>{pagina}</strong>}
    </nav>
  );
}

function FichaCurso({ item }) {
  const curso = cursos[item.slug];
  return (
    <article className="curso-ficha">
      <Enlace to={`/modalidades/${item.slug}`} className="curso-ficha-imagen" aria-label={`Abrir curso de ${item.titulo}`}>
        <img src={curso.imagen} alt={`Imagen ilustrativa para ${item.titulo}`} />
        <span className="curso-ficha-numero">{item.numero}</span>
      </Enlace>
      <div className="curso-ficha-contenido">
        <div className="curso-ficha-meta"><span>{item.tipo}</span><span>{curso.capitulos.length} LECCIONES</span></div>
        <h3><Enlace to={`/modalidades/${item.slug}`}>{item.titulo}</Enlace></h3>
        <p>{item.resumen}</p>
        <div className="curso-ficha-pie"><span>{curso.nivel} · {curso.tiempo}</span><Enlace to={`/modalidades/${item.slug}`} className="curso-ficha-accion">VER CURSO <span aria-hidden="true">↗</span></Enlace></div>
      </div>
    </article>
  );
}

export function Modalidades() {
  const [filtro, setFiltro] = useState('formatos');
  const [busqueda, setBusqueda] = useState('');
  const lista = useMemo(() => (filtro === 'formatos' ? formatos : variantes).filter(item =>
    `${item.titulo} ${item.resumen} ${item.corto}`.toLocaleLowerCase('es').includes(busqueda.trim().toLocaleLowerCase('es'))
  ), [filtro, busqueda]);

  return (
    <div className="curso-pagina">
      <Rastro pagina="Modalidades" />
      <section className="curso-catalogo-hero" aria-labelledby="curso-titulo-principal">
        <div className="curso-catalogo-texto">
          <Etiqueta>ACADEMIA DE PÓKER · PROYECTO INFORMATIVO</Etiqueta>
          <h1 id="curso-titulo-principal">Aprende póker<br /><em>paso a paso.</em></h1>
          <p>Explora cada formato como un pequeño curso. Conoce sus reglas, estructura y diferencias con ejemplos claros y contenido organizado por lecciones.</p>
          <a href="#catalogo" className="curso-boton-claro">EXPLORAR CURSOS <span aria-hidden="true">↘</span></a>
        </div>
        <div className="curso-catalogo-visual"><img src="/curso/mesa-poker.webp" alt="Fotografía ilustrativa de mesa de póker con fichas y cartas" /><div className="curso-foto-credit">IMAGEN ILUSTRATIVA</div></div>
      </section>

      <section id="catalogo" className="curso-catalogo-seccion" aria-labelledby="curso-catalogo-titulo">
        <div className="curso-cabecera-seccion"><div><Etiqueta>EXPLORA EL CONTENIDO</Etiqueta><h2 id="curso-catalogo-titulo">Elige lo que quieres aprender</h2><p>Los formatos describen cómo se organiza una partida; las variantes explican sus reglas de cartas.</p></div><span className="curso-conteo">07 CURSOS</span></div>
        <div className="curso-herramientas">
          <div className="curso-filtros" role="group" aria-label="Tipo de cursos">
            <button type="button" className={filtro === 'formatos' ? 'curso-filtro activo' : 'curso-filtro'} aria-pressed={filtro === 'formatos'} onClick={() => setFiltro('formatos')}>Formatos de juego <span>04</span></button>
            <button type="button" className={filtro === 'variantes' ? 'curso-filtro activo' : 'curso-filtro'} aria-pressed={filtro === 'variantes'} onClick={() => setFiltro('variantes')}>Variantes de póker <span>03</span></button>
          </div>
          <label className="curso-buscador"><span aria-hidden="true">⌕</span><span className="solo-lectores">Buscar curso</span><input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar un curso..." type="search" /></label>
        </div>
        <div className="curso-grid-fichas" aria-live="polite">
          {lista.map(item => <FichaCurso key={item.slug} item={item} />)}
        </div>
        {lista.length === 0 && <div className="curso-sin-resultados">No encontramos cursos con ese nombre. Prueba con otra palabra.</div>}
        <div className="curso-pie-catalogo"><strong>¿Nunca has jugado?</strong><span>Comienza por las reglas básicas y luego vuelve a elegir una modalidad.</span><Enlace to="/modalidades/texas-holdem">IR A PRIMEROS PASOS ↗</Enlace></div>
      </section>
    </div>
  );
}

function SimuladorCiegas() {
  const [ciega, setCiega] = useState('0.02');
  const [profundidad, setProfundidad] = useState(100);
  const importe = (Number(ciega) * profundidad).toFixed(2);
  return (
    <div className="curso-simulador">
      <div className="curso-simulador-titulo"><span className="curso-emoji" aria-hidden="true">♠</span><div><span>ACTIVIDAD INTERACTIVA</span><h3>Calcula un stack en ciegas grandes</h3></div></div>
      <p>Prueba cómo cambia el valor matemático de un stack al modificar la ciega grande. Los importes son ficticios y no constituyen una recomendación de apuesta.</p>
      <div className="curso-simulador-controles">
        <label>Ciega grande (ejemplo)<select value={ciega} onChange={e => setCiega(e.target.value)}><option value="0.02">$0.02 (NL2)</option><option value="0.05">$0.05 (NL5)</option><option value="0.10">$0.10 (NL10)</option><option value="0.25">$0.25 (NL25)</option></select></label>
        <label>Profundidad del stack <strong>{profundidad} BB</strong><input type="range" min="20" max="150" step="10" value={profundidad} onChange={e => setProfundidad(Number(e.target.value))} /></label>
      </div>
      <div className="curso-simulador-resultado"><div><small>VALOR TEÓRICO DEL STACK</small><strong>${importe}</strong></div><p>{profundidad} ciegas grandes × ${Number(ciega).toFixed(2)} por ciega grande</p></div>
    </div>
  );
}

function ComparacionCash() {
  return (
    <figure className="curso-comparativa" aria-label="Comparación de características de Cash Games y torneos">
      <div className="curso-comparativa-col curso-comparativa-cash"><span>MESAS CASH</span><strong>BLINDS FIJAS</strong><small>Entrada y salida normalmente flexibles</small><div className="curso-blinds">$0.01 / $0.02 <span>→</span> $0.01 / $0.02 <span>→</span> $0.01 / $0.02</div></div>
      <div className="curso-comparativa-col"><span>TORNEOS</span><strong>BLINDS CRECIENTES</strong><small>Etapas, eliminaciones y premios por posición</small><div className="curso-blinds">25 / 50 <span>→</span> 50 / 100 <span>→</span> 100 / 200</div></div>
      <figcaption>Esquema educativo con valores de ejemplo. No describe una mesa o evento específico.</figcaption>
    </figure>
  );
}

function Capitulo({ capitulo, indice, leido, onMarcar, cash, total }) {
  return (
    <section id={`leccion-${capitulo.id}`} className="curso-leccion" aria-labelledby={`titulo-${capitulo.id}`}>
      <div className="curso-leccion-heading"><div className="curso-leccion-numero">{String(indice + 1).padStart(2, '0')}</div><div><span>{capitulo.etiqueta}</span><h2 id={`titulo-${capitulo.id}`}>{capitulo.titulo}</h2></div></div>
      <div className="curso-prosa">
        {capitulo.parrafos.map((parrafo, i) => <p key={i}>{parrafo}</p>)}
        {cash && capitulo.id === 'estructura' && <SimuladorCiegas />}
        {cash && capitulo.id === 'desarrollo' && <figure className="curso-imagen-intermedia"><img src="/curso/mesa-poker.webp" loading="lazy" alt="Escena ilustrativa de una mesa de póker con fichas, jugadores y cartas" /><figcaption>La posición y las decisiones de apuesta cambian en cada etapa de la mano. Imagen ilustrativa.</figcaption></figure>}
        {cash && capitulo.id === 'comparacion' && <ComparacionCash />}
        {capitulo.puntos && <div className="curso-puntos"><h3>Ideas clave</h3><ul>{capitulo.puntos.map((punto, i) => <li key={i}><span aria-hidden="true">✓</span>{punto}</li>)}</ul></div>}
        {capitulo.nota && <aside className="curso-alerta"><span aria-hidden="true">i</span><p>{capitulo.nota}</p></aside>}
      </div>
      <div className="curso-leccion-cierre"><button type="button" className={leido ? 'curso-marcar marcado' : 'curso-marcar'} onClick={onMarcar} aria-pressed={leido}>{leido ? '✓ Lección marcada como leída' : 'Marcar lección como leída'}</button><span>{indice + 1} / {total}</span></div>
    </section>
  );
}

export function DetalleModalidad({ slug }) {
  const modalidad = TODAS.find(item => item.slug === slug);
  const curso = cursos[slug];
  const { usuario } = useAuth();
  const [leidas, setLeidas] = useState([]);
  const [inscrito, setInscrito] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [cargandoProgreso, setCargandoProgreso] = useState(false);
  const [errorProgreso, setErrorProgreso] = useState('');
  useEffect(() => {
    // La lectura puede seguir usándose sin cuenta, pero no persiste.
    if (!supabase || !usuario?.id || !curso) {
      setInscrito(false); setLeidas([]); setCargandoProgreso(false); return;
    }
    let vigente = true;
    setLeidas([]); setInscrito(false); setErrorProgreso(''); setCargandoProgreso(true);
    Promise.all([
      supabase.from('legacy_course_enrollments').select('course_slug').eq('user_id', usuario.id).eq('course_slug', slug).maybeSingle(),
      supabase.from('legacy_lesson_progress').select('lesson_key').eq('user_id', usuario.id).eq('course_slug', slug),
    ]).then(([alta, avance]) => {
      if (!vigente) return;
      if (alta.error || avance.error) setErrorProgreso(alta.error?.message || avance.error?.message);
      else { setInscrito(Boolean(alta.data)); setLeidas((avance.data || []).map(x => x.lesson_key)); }
    }).catch(e => { if (vigente) setErrorProgreso(e.message); })
      .finally(() => { if (vigente) setCargandoProgreso(false); });
    return () => { vigente = false; };
  }, [usuario?.id, slug, curso]);
  if (!modalidad || !curso) return null;
  const cash = slug === 'cash-games';
  const total = curso.capitulos.length;
  const porcentaje = Math.round(leidas.length / total * 100);
  const siguiente = TODAS[(TODAS.findIndex(item => item.slug === slug) + 1) % TODAS.length];

  async function inscribir() {
    if (!usuario || guardando) return;
    setGuardando(true); setErrorProgreso('');
    const { error } = inscrito
      ? await supabase.from('legacy_course_enrollments').delete().eq('user_id', usuario.id).eq('course_slug', slug)
      : await supabase.from('legacy_course_enrollments').insert({user_id: usuario.id, course_slug: slug});
    if (error) setErrorProgreso(error.message);
    else setInscrito(!inscrito);
    setGuardando(false);
  }
  async function marcar(id) {
    if (guardando || cargandoProgreso) return;
    const yaLeida = leidas.includes(id);
    if (!usuario) { setLeidas(actual => yaLeida ? actual.filter(x => x !== id) : [...actual,id]); return; }
    setGuardando(true); setErrorProgreso('');
    if (!inscrito && !yaLeida) {
      const { error: alta } = await supabase.from('legacy_course_enrollments')
        .insert({user_id: usuario.id, course_slug: slug});
      if (alta && alta.code !== '23505') {
        setErrorProgreso(alta.message); setGuardando(false); return;
      }
      setInscrito(true);
    }
    const { error } = yaLeida
      ? await supabase.from('legacy_lesson_progress').delete().eq('user_id', usuario.id).eq('course_slug', slug).eq('lesson_key', id)
      : await supabase.from('legacy_lesson_progress').insert({user_id: usuario.id, course_slug: slug, lesson_key: id});
    if (error) setErrorProgreso(error.message);
    else setLeidas(actual => yaLeida ? actual.filter(x => x !== id) : [...actual,id]);
    setGuardando(false);
  }

  return (
    <div className="curso-pagina curso-detalle-pagina">
      <Rastro titulo={modalidad.titulo} />
      <Enlace to="/academia" className="pw-volver-curso">← Volver al catálogo</Enlace>
      <section className="curso-hero-detalle" aria-labelledby="curso-detalle-titulo">
        <div className="curso-hero-textos">
          <Etiqueta>CURSO · {modalidad.tipo.toUpperCase()}</Etiqueta>
          <h1 id="curso-detalle-titulo">{modalidad.titulo}</h1>
          <p>{curso.subtitulo}</p>
          <div className="curso-hero-meta"><span>▤ {total} lecciones</span><span>◷ {curso.tiempo}</span><span>◇ {curso.nivel}</span></div>
          <a className="curso-boton-claro" href={`#leccion-${curso.capitulos[0].id}`}>COMENZAR A LEER <span aria-hidden="true">↓</span></a>
        </div>
        <figure className="curso-hero-foto"><img src={curso.imagen} alt={`Imagen ilustrativa para el curso de ${modalidad.titulo}`} /><figcaption>Imagen ilustrativa · No representa una mesa real de la plataforma</figcaption></figure>
      </section>
      <div className="curso-columnas">
        <aside className="curso-aside" aria-label="Índice del curso">
          <div className="curso-aside-panel">
            <span className="curso-aside-tipo">TU RUTA DE APRENDIZAJE</span>
            <h2>Contenido del curso</h2>
            <p>{total} lecciones para leer a tu ritmo.</p>
            <div className="curso-progreso"><div><strong>{porcentaje}%</strong><span>Marcado como leído</span></div><div className="curso-progreso-barra"><div style={{width:`${porcentaje}%`}} /></div></div>
            <nav aria-label="Índice de lecciones"><ol>{curso.capitulos.map((capitulo, i) => <li key={capitulo.id}><a href={`#leccion-${capitulo.id}`}><span className={leidas.includes(capitulo.id) ? 'curso-indice-num listo' : 'curso-indice-num'}>{leidas.includes(capitulo.id) ? '✓' : String(i + 1).padStart(2,'0')}</span><span>{capitulo.titulo}</span></a></li>)}</ol></nav>
            <small>{usuario ? 'Tus avances quedan guardados en Supabase.' : 'Sin iniciar sesión, el progreso se pierde al salir.'}</small>
            {usuario ? <button type="button" className="curso-guardar-seguimiento" disabled={guardando || cargandoProgreso} onClick={inscribir}>{inscrito ? '✓ Guardado · Quitar de Mis cursos' : '+ Guardar en Mis cursos'}</button> : <Enlace className="curso-regresar" to="/cuenta">Ingresar para guardar progreso →</Enlace>}
            {errorProgreso && <p role="alert" className="sistema-error">{errorProgreso}</p>}
            {usuario && <Enlace className="curso-regresar" to="/mis-cursos">Mis cursos y progreso →</Enlace>}
            <Enlace className="curso-regresar" to="/modalidades">← Volver a modalidades</Enlace>
          </div>
        </aside>
        <div className="curso-lectura">
          <section className="curso-aprender" aria-labelledby="curso-objetivos"><Etiqueta>ANTES DE EMPEZAR</Etiqueta><h2 id="curso-objetivos">Qué aprenderás</h2><div className="curso-objetivos">{curso.objetivos.map((objetivo,i)=><div key={objetivo}><span>{String(i+1).padStart(2,'0')}</span><p>{objetivo}</p></div>)}</div></section>
          {curso.capitulos.map((capitulo,indice)=><Capitulo key={capitulo.id} capitulo={capitulo} indice={indice} leido={leidas.includes(capitulo.id)} onMarcar={()=>marcar(capitulo.id)} cash={cash} total={total}/>)}
          {curso.glosario && <section className="curso-extra" id="glosario"><Etiqueta>PARA REPASAR</Etiqueta><h2>Glosario esencial</h2><div className="curso-glosario">{curso.glosario.map(([termino,definicion])=><div key={termino}><strong>{termino}</strong><p>{definicion}</p></div>)}</div></section>}
          {curso.preguntas && <section className="curso-extra" id="preguntas"><Etiqueta>DUDAS FRECUENTES</Etiqueta><h2>Preguntas comunes</h2><div className="curso-faq">{curso.preguntas.map(([p,r])=><details key={p}><summary>{p}</summary><p>{r}</p></details>)}</div></section>}
          <section className="curso-fin"><div><Etiqueta>CONTINÚA APRENDIENDO</Etiqueta><h2>Tu siguiente curso</h2><p>{siguiente.titulo}. {siguiente.resumen}</p></div><Enlace className="curso-boton-final" to={`/modalidades/${siguiente.slug}`}>IR AL SIGUIENTE →</Enlace></section>
          <div className="curso-fuentes">Lectura introductoria para fines académicos. Consulta las condiciones oficiales de cada formato. <a href={curso.fuente} target="_blank" rel="noopener noreferrer">Ver referencia oficial ↗</a> · <Enlace to="/juego-responsable">Juego responsable</Enlace></div>
        </div>
      </div>
    </div>
  );
}
