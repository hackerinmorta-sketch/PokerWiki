import { useCallback, useEffect, useState } from 'react';
import { supabase, supabaseConfigurado } from '../lib/supabase';
import { Enlace } from '../lib/navegacion';
import { useAuth } from '../context/AuthContext';
import VideoLeccion from '../components/VideoLeccion';

function ImagenCurso({ curso }) {
  const imagen = curso.cover_url || '/curso/mesa-poker.webp';
  return <img className="sistema-curso-imagen" src={imagen} alt={`Imagen de portada del curso ${curso.title}`} loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/curso/mesa-poker.webp'; }} />;
}

function EtiquetaValoracion({ resumen }) {
  const cantidad = Number(resumen?.rating_count || 0);
  if (!cantidad) return <span className="sistema-calificacion-texto">Todavía sin valoraciones</span>;
  return <span className="sistema-calificacion-texto" aria-label={`Calificación media ${resumen.rating_average} de 5, con ${cantidad} valoraciones`}>
    <span aria-hidden="true">★</span> {Number(resumen.rating_average).toFixed(1)} / 5 · {cantidad} {cantidad === 1 ? 'valoración' : 'valoraciones'}
  </span>;
}

export function Academia() {
  const [cursos, setCursos] = useState([]);
  const [resumenes, setResumenes] = useState({});
  const [cargando, setCargando] = useState(supabaseConfigurado);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (!supabase) { setCargando(false); return; }
    let vigente = true;
    async function cargar() {
      const { data, error: e } = await supabase.from('courses')
        .select('id,slug,title,summary,level,cover_url,published,created_at')
        .eq('published', true).order('created_at', { ascending: false });
      if (!vigente) return;
      if (e) { setError(e.message); setCargando(false); return; }
      setCursos(data || []);
      if (data?.length) {
        const result = await supabase.from('course_rating_summary')
          .select('course_id,rating_average,rating_count').in('course_id', data.map(c => c.id));
        if (vigente && !result.error) setResumenes(Object.fromEntries((result.data || []).map(v => [v.course_id, v])));
      }
      if (vigente) setCargando(false);
    }
    cargar().catch(e => { if (vigente) { setError(e.message); setCargando(false); } });
    return () => { vigente = false; };
  }, []);

  const texto = busqueda.trim().toLocaleLowerCase('es');
  const visibles = cursos.filter(item =>
    `${item.title} ${item.summary || ''} ${item.level || ''}`.toLocaleLowerCase('es').includes(texto)
  );
  return <div className="sistema-pagina pw9-catalogo">
    <div className="sistema-cabecera">
      <span className="sistema-kicker">POKERWIKI · CURSOS PUBLICADOS</span>
      <h1>Cursos para seguir aprendiendo.</h1>
      <p>Descubre los cursos creados desde PokerWiki, organizados en lecciones con imágenes, videos, progreso y reseñas.</p>
      <div className="sistema-acciones">
        <Enlace to="/mis-cursos" className="sistema-boton">Mi aprendizaje →</Enlace>
        <Enlace to="/modalidades" className="sistema-boton-outline">Ver modalidades originales →</Enlace>
      </div>
    </div>
    <section className="pw9-catalogo-intro" aria-label="Otra opción para comenzar">
      <div><span className="sistema-kicker">FORMATOS Y VARIANTES</span>
        <h2>¿Buscas las modalidades originales?</h2>
        <p>Los cursos de Torneos, Spin & Go, Sit & Go, Cash Games, Texas Hold'em, Omaha y Stud están disponibles por separado en Modalidades.</p>
      </div>
      <Enlace className="sistema-boton-outline" to="/modalidades">Abrir modalidades →</Enlace>
    </section>
    <section className="pw9-catalogo-busqueda" aria-label="Buscar cursos publicados">
      <label className="pw9-catalogo-buscador">Buscar curso publicado
        <input type="search" value={busqueda} placeholder="Por título, tema o nivel…" onChange={e => setBusqueda(e.target.value)} />
      </label>
    </section>
    <p className="pw9-catalogo-cuenta" role="status">{visibles.length} {visibles.length === 1 ? 'curso publicado' : 'cursos publicados'}{cargando ? ' · Cargando…' : ''}</p>
    {error && <p className="sistema-error" role="alert">No se pudieron cargar los cursos: {error}</p>}
    <section className="sistema-cursos-grid" aria-label="Cursos publicados en PokerWiki">
      {visibles.map(item => <article className="sistema-curso" key={item.id}>
        <Enlace to={`/academia/${item.slug}`}><ImagenCurso curso={item} /></Enlace>
        <div className="sistema-curso-cuerpo"><span className="sistema-kicker">Curso publicado · {item.level || 'Todos los niveles'}</span>
          <h2><Enlace to={`/academia/${item.slug}`}>{item.title}</Enlace></h2>
          <EtiquetaValoracion resumen={resumenes[item.id]} /><p>{item.summary}</p>
          <Enlace className="sistema-boton-outline" to={`/academia/${item.slug}`}>Abrir curso →</Enlace>
        </div>
      </article>)}
    </section>
    {!cargando && visibles.length === 0 && !error && <div className="sistema-vacio"><h2>{busqueda ? 'Sin resultados para esta búsqueda' : 'Aún no hay cursos publicados'}</h2>
      <p>{busqueda ? 'Prueba con otro título o borra el filtro.' : 'Mientras se publican cursos nuevos, puedes explorar las siete modalidades originales.'}</p>
      <Enlace className="sistema-boton-outline" to="/modalidades">Explorar modalidades →</Enlace>
    </div>}
    {!supabaseConfigurado && <p className="sistema-ayuda">Para consultar los cursos publicados, configura tu conexión con Supabase.</p>}
  </div>;
}

// Reseñas escritas de cursos dinámicos: una por estudiante y curso, con moderación.
function ResenasCurso({ cursoId, usuario }) {
  const [resenas, setResenas] = useState([]);
  const [contenido, setContenido] = useState('');
  const [miResena, setMiResena] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [reporteId, setReporteId] = useState(null);
  const [motivo, setMotivo] = useState('');

  const cargar = useCallback(async () => {
    if (!supabase || !cursoId) return;
    const { data, error: e } = await supabase.from('course_reviews')
      .select('id,user_id,body,status,created_at,updated_at,profiles(display_name)')
      .eq('course_id', cursoId).order('created_at', { ascending: false }).limit(70);
    if (e) { setError(e.message); setCargando(false); return; }
    let lista = data || [];
    let propia = lista.find(r => r.user_id === usuario?.id) || null;
    // Una reseña antigua puede quedar fuera de las 70 últimas; se consulta aparte
    // para poder editarla sin chocar contra la restricción UNIQUE(user_id, course_id).
    if (usuario?.id && !propia) {
      const adicional = await supabase.from('course_reviews')
        .select('id,user_id,body,status,created_at,updated_at,profiles(display_name)')
        .eq('course_id', cursoId).eq('user_id', usuario.id).maybeSingle();
      if (adicional.error) { setError(adicional.error.message); setCargando(false); return; }
      propia = adicional.data;
      if (propia) lista = [...lista, propia];
    }
    setResenas(lista);
    setMiResena(propia);
    setContenido(propia?.body || '');
    setCargando(false);
  }, [cursoId, usuario?.id]);

  useEffect(() => {
    let montado = true;
    setCargando(true); setError(''); setResenas([]); setMiResena(null); setContenido('');
    // Las respuestas asíncronas solo actualizan el estado si el componente sigue montado.
    const consultar = async () => { if (montado) await cargar(); };
    consultar();
    return () => { montado = false; };
  }, [cargar]);

  async function guardar(evento) {
    evento.preventDefault();
    if (!usuario || guardando) return;
    const texto = contenido.trim();
    if (texto.length < 20 || texto.length > 1500) {
      setError('La reseña debe tener entre 20 y 1500 caracteres.'); return;
    }
    setGuardando(true); setError(''); setMensaje('');
    const consulta = miResena
      ? supabase.from('course_reviews').update({ body: texto }).eq('id', miResena.id).eq('user_id', usuario.id)
      : supabase.from('course_reviews').insert({ course_id: cursoId, user_id: usuario.id, body: texto });
    const { error: e } = await consulta;
    if (e) setError(e.message);
    else { setMensaje(miResena ? 'Tu reseña se actualizó.' : 'Tu reseña se publicó.'); await cargar(); }
    setGuardando(false);
  }
  async function quitar() {
    if (!usuario || !miResena || guardando || !window.confirm('¿Eliminar tu reseña?')) return;
    setGuardando(true); setError(''); setMensaje('');
    const { error: e } = await supabase.from('course_reviews').delete().eq('id', miResena.id).eq('user_id', usuario.id);
    if (e) setError(e.message);
    else { setMensaje('Tu reseña se eliminó.'); await cargar(); }
    setGuardando(false);
  }
  async function reportar(evento) {
    evento.preventDefault();
    if (!usuario || !reporteId) return;
    if (motivo.trim().length < 10) { setError('Escribe un motivo de al menos 10 caracteres.'); return; }
    setGuardando(true); setError(''); setMensaje('');
    const { error: e } = await supabase.from('course_review_reports').insert({
      review_id: reporteId, reporter_id: usuario.id, reason: motivo.trim()
    });
    if (e) setError(e.code === '23505' ? 'Ya reportaste esta reseña.' : e.message);
    else { setMensaje('Reporte enviado al administrador.'); setReporteId(null); setMotivo(''); }
    setGuardando(false);
  }

  return <section className="sistema-panel sistema-resenas" aria-labelledby="titulo-resenas">
    <div className="sistema-resenas-cabecera"><div><span className="sistema-kicker">OPINIONES DE LA COMUNIDAD</span><h2 id="titulo-resenas">Reseñas del curso</h2><p>Comparte qué aprendiste y qué se podría mejorar. Las opiniones se moderan por comportamiento, no por su calificación.</p></div><span className="sistema-contador-resenas">{resenas.filter(r => r.status === 'visible').length} reseñas</span></div>
    {mensaje && <p className="sistema-exito" role="status">{mensaje}</p>}
    {error && <p className="sistema-error" role="alert">{error}</p>}
    {usuario ? <form className="sistema-formulario sistema-resena-form" onSubmit={guardar}>
      <label htmlFor="mi-resena-curso">{miResena ? 'Modificar mi reseña' : 'Escribir una reseña'}
        <textarea id="mi-resena-curso" required minLength={20} maxLength={1500} rows={4} value={contenido} onChange={e => setContenido(e.target.value)} placeholder="¿Qué explica bien el curso y qué te habría gustado aprender con más detalle?" />
      </label>
      {miResena?.status === 'hidden' && <p className="sistema-aviso">Esta reseña está oculta por moderación. Puedes editar el texto, pero solo un administrador puede restaurarla.</p>}
      <div className="sistema-acciones"><button type="submit" className="sistema-boton" disabled={guardando}>{guardando ? 'Guardando…' : miResena ? 'Actualizar reseña' : 'Publicar reseña'}</button>{miResena && <button type="button" className="sistema-boton-outline" disabled={guardando} onClick={quitar}>Eliminar mi reseña</button>}</div>
    </form> : <p><Enlace to="/cuenta">Inicia sesión</Enlace> para dejar una reseña escrita.</p>}
    {cargando ? <p>Cargando reseñas…</p> : resenas.length === 0 ? <p>Aún no hay reseñas. Puedes escribir la primera.</p> : <div className="sistema-resenas-lista">{resenas.map(r => <article className="sistema-resena" key={r.id}>
      <div className="sistema-resena-meta"><strong>{r.profiles?.display_name || 'Estudiante'}</strong><span>{new Date(r.created_at).toLocaleDateString('es-MX')}</span>{r.status === 'hidden' && <span className="sistema-resena-oculta">Oculta por moderación · Solo visible para ti o el administrador</span>}</div>
      <p>{r.body}</p>
      {usuario && usuario.id !== r.user_id && r.status === 'visible' && <button type="button" className="sistema-resena-reportar" onClick={() => { setReporteId(reporteId === r.id ? null : r.id); setMotivo(''); }}>Reportar reseña</button>}
      {reporteId === r.id && <form className="sistema-formulario sistema-reporte-resena" onSubmit={reportar}><label>Motivo del reporte<input required minLength={10} maxLength={500} value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Describe el problema de esta reseña" /></label><div className="sistema-acciones"><button className="sistema-boton" type="submit" disabled={guardando}>Enviar reporte</button><button type="button" className="sistema-boton-outline" onClick={() => setReporteId(null)}>Cancelar</button></div></form>}
    </article>)}</div>}
  </section>;
}

export function CursoDinamico({ slug }) {
  const { usuario } = useAuth();
  const [curso, setCurso] = useState(null);
  const [lecciones, setLecciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [resumenCurso, setResumenCurso] = useState(null);
  const [miRating, setMiRating] = useState(0);
  const [errorRating, setErrorRating] = useState('');
  const [resumenVotos, setResumenVotos] = useState({});
  const [misVotos, setMisVotos] = useState({});
  const [votoPendiente, setVotoPendiente] = useState(null);
  const [ratingPendiente, setRatingPendiente] = useState(false);
  const [inscrito, setInscrito] = useState(false);
  const [leidas, setLeidas] = useState([]);
  const [progresoCargando, setProgresoCargando] = useState(false);
  const [accionProgreso, setAccionProgreso] = useState(null);
  const [errorProgreso, setErrorProgreso] = useState('');

  useEffect(() => {
    if (!supabase) { setCargando(false); return; }
    let vigente = true;
    setCargando(true); setError(''); setCurso(null); setLecciones([]);
    async function cargar() {
      const { data, error: e } = await supabase.from('courses')
        .select('id,slug,title,summary,level,cover_url,published').eq('slug', slug).maybeSingle();
      if (!vigente) return;
      if (e) { setError(e.message); setCargando(false); return; }
      if (!data) { setError('Curso no encontrado o no publicado.'); setCargando(false); return; }
      const respuesta = await supabase.from('lessons')
        .select('id,title,body,position,image_url,image_alt,image_caption,youtube_video_id,video_caption')
        .eq('course_id', data.id).order('position');
      if (vigente) {
        setCurso(data); setLecciones(respuesta.data || []);
        if (respuesta.error) setError(respuesta.error.message);
        setCargando(false);
      }
    }
    cargar().catch(e => { if (vigente) { setError(e.message); setCargando(false); } });
    return () => { vigente = false; };
  }, [slug]);

  const cargarValoraciones = useCallback(async (id, ids) => {
    if (!supabase || !id) return;
    const consultas = [
      supabase.from('course_rating_summary').select('course_id,rating_count,rating_average').eq('course_id', id).maybeSingle(),
      supabase.from('lesson_vote_summary').select('lesson_id,course_id,likes,dislikes').eq('course_id', id),
    ];
    if (usuario?.id) {
      consultas.push(supabase.from('course_ratings').select('rating').eq('course_id', id).eq('user_id', usuario.id).maybeSingle());
      if (ids.length) consultas.push(supabase.from('lesson_votes').select('lesson_id,vote').in('lesson_id', ids).eq('user_id', usuario.id));
    }
    const resultados = await Promise.all(consultas);
    if (resultados.some(r => r.error)) {
      setError('Las valoraciones todavía no están disponibles. Comprueba que ejecutaste la migración 002 en Supabase.');
      return;
    }
    setResumenCurso(resultados[0].data);
    setResumenVotos(Object.fromEntries((resultados[1].data || []).map(v => [v.lesson_id, v])));
    setMiRating(usuario?.id ? Number(resultados[2]?.data?.rating || 0) : 0);
    setMisVotos(usuario?.id && ids.length ? Object.fromEntries((resultados[3]?.data || []).map(v => [v.lesson_id, v.vote])) : {});
  }, [usuario?.id]);

  useEffect(() => {
    if (curso?.id) cargarValoraciones(curso.id, lecciones.map(l => l.id));
  }, [curso?.id, lecciones, cargarValoraciones]);

  // El estado de aprendizaje se lee por usuario desde PostgreSQL, no desde useState temporal.
  useEffect(() => {
    if (!supabase || !usuario?.id || !curso?.id) {
      setInscrito(false); setLeidas([]); setProgresoCargando(false); setErrorProgreso('');
      return;
    }
    let vigente = true;
    setProgresoCargando(true);
    setErrorProgreso('');
    const ids = lecciones.map(l => l.id);
    const consultas = [
      supabase.from('course_enrollments').select('course_id').eq('course_id', curso.id).eq('user_id', usuario.id).maybeSingle(),
      ids.length ? supabase.from('lesson_progress').select('lesson_id').eq('user_id', usuario.id).in('lesson_id', ids) : Promise.resolve({ data: [], error: null }),
    ];
    Promise.all(consultas).then(([alta, avance]) => {
      if (!vigente) return;
      if (alta.error || avance.error) setErrorProgreso(alta.error?.message || avance.error?.message);
      else { setInscrito(Boolean(alta.data)); setLeidas((avance.data || []).map(x => x.lesson_id)); }
    }).catch(e => { if (vigente) setErrorProgreso(e.message); })
      .finally(() => { if (vigente) setProgresoCargando(false); });
    return () => { vigente = false; };
  }, [usuario?.id, curso?.id, lecciones]);

  async function inscribirse() {
    if (!usuario || !curso || accionProgreso) return;
    setAccionProgreso('inscripcion'); setErrorProgreso('');
    const { error: e } = inscrito
      ? await supabase.from('course_enrollments').delete().eq('user_id', usuario.id).eq('course_id', curso.id)
      : await supabase.from('course_enrollments').insert({ user_id: usuario.id, course_id: curso.id });
    if (e) setErrorProgreso(e.message);
    else setInscrito(!inscrito);
    setAccionProgreso(null);
  }

  async function marcarLeida(lessonId) {
    if (!usuario || !curso || accionProgreso) return;
    const estabaLeida = leidas.includes(lessonId);
    setAccionProgreso(lessonId); setErrorProgreso('');
    if (!inscrito && !estabaLeida) {
      const { error: altaError } = await supabase.from('course_enrollments')
        .insert({ user_id: usuario.id, course_id: curso.id });
      if (altaError && altaError.code !== '23505') {
        setErrorProgreso(altaError.message); setAccionProgreso(null); return;
      }
      setInscrito(true);
    }
    const { error: e } = estabaLeida
      ? await supabase.from('lesson_progress').delete().eq('user_id', usuario.id).eq('lesson_id', lessonId)
      : await supabase.from('lesson_progress').insert({ user_id: usuario.id, lesson_id: lessonId });
    if (e) setErrorProgreso(e.message);
    else setLeidas(v => estabaLeida ? v.filter(id => id !== lessonId) : [...v, lessonId]);
    setAccionProgreso(null);
  }

  async function calificar(estrellas) {
    if (!usuario || !curso || ratingPendiente) return;
    setRatingPendiente(true); setErrorRating(''); setMensaje('');
    const mismo = miRating === estrellas;
    const respuesta = mismo
      ? await supabase.from('course_ratings').delete().eq('course_id', curso.id).eq('user_id', usuario.id)
      : await supabase.from('course_ratings').upsert({ course_id: curso.id, user_id: usuario.id, rating: estrellas }, { onConflict: 'course_id,user_id' });
    if (respuesta.error) setErrorRating(respuesta.error.message);
    else { await cargarValoraciones(curso.id, lecciones.map(l => l.id)); setMensaje(mismo ? 'Quitaste tu valoración.' : `Calificaste el curso con ${estrellas} de 5 estrellas.`); }
    setRatingPendiente(false);
  }

  async function votar(id, valor) {
    if (!usuario || votoPendiente) return;
    setVotoPendiente(id); setError(''); setMensaje('');
    const mismo = misVotos[id] === valor;
    const respuesta = mismo
      ? await supabase.from('lesson_votes').delete().eq('lesson_id', id).eq('user_id', usuario.id)
      : await supabase.from('lesson_votes').upsert({ lesson_id: id, user_id: usuario.id, vote: valor }, { onConflict: 'lesson_id,user_id' });
    if (respuesta.error) setError(respuesta.error.message);
    else await cargarValoraciones(curso.id, lecciones.map(l => l.id));
    setVotoPendiente(null);
  }

  if (cargando) return <div className="sistema-pagina"><p>Cargando lecciones…</p></div>;
  if (!curso) return <div className="sistema-pagina"><div className="sistema-vacio"><h1>No se pudo abrir este curso</h1><p>{error || 'Revisa la conexión con la base de datos.'}</p><Enlace className="sistema-boton" to="/academia">Volver a Academia →</Enlace></div></div>;

  return <div className="sistema-pagina sistema-lectura">
    <Enlace to="/academia" className="pw-volver-curso">← Volver al catálogo de cursos</Enlace>
    <div className="sistema-migas"><Enlace to="/academia">Academia</Enlace><span> / </span><strong>{curso.title}</strong></div>
    <div className="sistema-curso-portada"><div><span className="sistema-kicker">CURSO · {curso.level || 'INTRODUCTORIO'}</span><h1>{curso.title}</h1><p>{curso.summary}</p><span className="sistema-lecciones-total">{lecciones.length} lecciones disponibles</span></div><ImagenCurso curso={curso} /></div>
    {error && <p className="sistema-error" role="alert">{error}</p>}
    <section className="sistema-panel sistema-seguimiento" aria-labelledby="titulo-seguimiento">
      <div><span className="sistema-kicker">MI APRENDIZAJE</span><h2 id="titulo-seguimiento">Tu progreso en este curso</h2><p>Marca cada lección cuando termines de estudiarla. Tu avance se conserva en tu cuenta, incluso si cambias de dispositivo.</p></div>
      {usuario ? <div className="sistema-seguimiento-acciones">
        <div className="sistema-progreso-etiqueta"><strong>{lecciones.length ? Math.round(leidas.length / lecciones.length * 100) : 0}% completado</strong><span>{leidas.length} de {lecciones.length} lecciones</span></div>
        <div className="sistema-progreso-pista" role="progressbar" aria-label="Avance del curso" aria-valuemin={0} aria-valuemax={100} aria-valuenow={lecciones.length ? Math.round(leidas.length / lecciones.length * 100) : 0}><span style={{ width: `${lecciones.length ? Math.round(leidas.length / lecciones.length * 100) : 0}%` }} /></div>
        <button type="button" className="sistema-boton-outline" disabled={Boolean(accionProgreso) || progresoCargando} onClick={inscribirse}>{progresoCargando ? 'Cargando…' : inscrito ? 'Quitar de Mis cursos' : '+ Guardar en Mis cursos'}</button>
      </div> : <p><Enlace to="/cuenta">Inicia sesión</Enlace> para guardar tu avance y continuar después.</p>}
      {errorProgreso && <p role="alert" className="sistema-error">{errorProgreso}</p>}
    </section>
    <div className="sistema-curso-layout">
      <aside className="sistema-temario"><h2>Contenido del curso</h2><nav aria-label="Índice de lecciones">{lecciones.map((l, i) => <a key={l.id} href={`#leccion-${l.id}`}><span aria-hidden="true">{leidas.includes(l.id) ? '✓' : String(i + 1).padStart(2, '0')}</span> · {l.title}</a>)}</nav>{usuario && <Enlace className="sistema-mis-cursos-enlace" to="/mis-cursos">Ver Mis cursos →</Enlace>}</aside>
      <div className="sistema-capitulos">
        {lecciones.length === 0 && <div className="sistema-vacio"><h2>Contenido en preparación</h2><p>El administrador todavía no ha añadido lecciones.</p></div>}
        {lecciones.map((l, i) => {
          const parrafos = l.body.split(/\n\s*\n/).filter(Boolean);
          const votos = resumenVotos[l.id];
          return <section className="sistema-capitulo" key={l.id} id={`leccion-${l.id}`}>
            <span className="sistema-kicker">LECCIÓN {String(i + 1).padStart(2, '0')}</span><h2>{l.title}</h2>
            {parrafos.slice(0, 1).map((p, j) => <p className="sistema-parrafo" key={j}>{p}</p>)}
            {l.image_url && <figure className="sistema-leccion-figura"><img src={l.image_url} alt={l.image_alt || 'Imagen ilustrativa de la lección'} loading="lazy" /><figcaption>{l.image_caption || l.image_alt}</figcaption></figure>}
            {parrafos.slice(1).map((p, j) => <p className="sistema-parrafo" key={j + 1}>{p}</p>)}
            {l.youtube_video_id && <VideoLeccion key={`${l.id}-${l.youtube_video_id}`} videoId={l.youtube_video_id} titulo={l.title} descripcion={l.video_caption} />}
            <div className="sistema-marcar-lectura">
              {usuario ? <button type="button" className={leidas.includes(l.id) ? 'sistema-boton-lectura leida' : 'sistema-boton-lectura'} aria-pressed={leidas.includes(l.id)} disabled={Boolean(accionProgreso) || progresoCargando} onClick={() => marcarLeida(l.id)}>{leidas.includes(l.id) ? '✓ Lección marcada como leída' : 'Marcar lección como leída'}</button> : <Enlace to="/cuenta">Inicia sesión para marcar la lección como leída →</Enlace>}
            </div>
            <div className="sistema-votos" aria-label={`¿Te resultó útil la lección ${l.title}?`}>
              <strong>¿Te resultó útil esta lección?</strong>
              <div className="sistema-votos-botones">
                <button type="button" disabled={!usuario || votoPendiente === l.id} aria-pressed={misVotos[l.id] === 1} className={misVotos[l.id] === 1 ? 'activo' : ''} onClick={() => votar(l.id, 1)}>👍 Útil ({Number(votos?.likes || 0)})</button>
                <button type="button" disabled={!usuario || votoPendiente === l.id} aria-pressed={misVotos[l.id] === -1} className={misVotos[l.id] === -1 ? 'activo' : ''} onClick={() => votar(l.id, -1)}>👎 No útil ({Number(votos?.dislikes || 0)})</button>
              </div>
              {!usuario && <small><Enlace to="/cuenta">Inicia sesión</Enlace> para votar.</small>}
            </div>
          </section>;
        })}
        <Enlace to="/academia" className="pw-volver-curso">← Volver a todos los cursos</Enlace>
        <div className="sistema-aviso"><strong>Para seguir aprendiendo</strong><p>Estos contenidos son educativos. La plataforma es un proyecto universitario no oficial y no permite apostar dinero.</p><Enlace to="/juego-responsable">Consultar juego responsable →</Enlace></div>
      </div>
    </div>
    <section className="pw9-opiniones-final" aria-label="Valorar y reseñar el curso">
      <div className="pw9-opiniones-intro"><span className="sistema-kicker">AL TERMINAR TU LECTURA</span><h2>Comparte tu experiencia</h2><p>Puedes valorar el curso y escribir una reseña cuando quieras. No necesitas completar un número mínimo de lecciones.</p></div>
      {mensaje && <p className="sistema-exito" role="status">{mensaje}</p>}
      {errorRating && <p className="sistema-error" role="alert">{errorRating}</p>}
    <section className="sistema-panel sistema-calificar" aria-labelledby="titulo-calificacion">
      <div><h2 id="titulo-calificacion">¿Qué te pareció este curso?</h2><EtiquetaValoracion resumen={resumenCurso} /><p>Tu valoración ayuda a otros estudiantes a elegir el contenido más útil. Puedes cambiarla o quitarla en cualquier momento.</p><a className="sistema-mis-cursos-enlace" href="#titulo-resenas">Leer o escribir reseñas →</a></div>
      {usuario ? <div className="sistema-estrellas" role="group" aria-label="Calificar curso de 1 a 5 estrellas">
        {[1, 2, 3, 4, 5].map(n => <button key={n} type="button" disabled={ratingPendiente} onClick={() => calificar(n)} aria-label={`Calificar con ${n} ${n === 1 ? 'estrella' : 'estrellas'}`} aria-pressed={miRating === n} title={`${n} de 5`} className={n <= miRating ? 'seleccionada' : ''}>★</button>)}
        {miRating > 0 && <small>Tu nota: {miRating}/5 (pulsa de nuevo para quitarla)</small>}
      </div> : <p><Enlace to="/cuenta">Inicia sesión</Enlace> para calificar el curso.</p>}
    </section>
      <ResenasCurso key={curso.id} cursoId={curso.id} usuario={usuario} />
    </section>
  </div>;
}
