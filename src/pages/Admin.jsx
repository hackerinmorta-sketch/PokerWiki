import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Enlace } from '../lib/navegacion';
import SelectorImagen from '../components/SelectorImagen';
import ModeracionResenas from '../components/ModeracionResenas';
import { subirImagen, identificarObjeto, eliminarObjeto } from '../lib/media';
import { extraerIdYouTube } from '../lib/video';

const NUEVO = { title: '', slug: '', summary: '', level: 'Principiante', cover_url: '', published: false };
const LECCION = { title: '', body: '', position: 1, image_url: '', image_alt: '', image_caption: '', video_url: '', video_caption: '' };
function convertirSlug(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
}

export default function Admin() {
  const { usuario, esAdmin, cargando } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [cursoId, setCursoId] = useState(null);
  const [datos, setDatos] = useState(NUEVO);
  const [archivoPortada, setArchivoPortada] = useState(null);
  const [lecciones, setLecciones] = useState([]);
  const [leccionId, setLeccionId] = useState(null);
  const [leccion, setLeccion] = useState(LECCION);
  const [archivoLeccion, setArchivoLeccion] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [reportes, setReportes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const cargarCursos = useCallback(async () => {
    if (!supabase || !esAdmin) return;
    const { data, error: e } = await supabase.from('courses').select('*').order('updated_at', { ascending: false });
    if (e) setError(e.message);
    else setCursos(data || []);
  }, [esAdmin]);
  useEffect(() => { cargarCursos(); }, [cargarCursos]);
  useEffect(() => { if (esAdmin) cargarReportes(); }, [esAdmin]);

  async function cargarReportes() {
    const { data, error: e } = await supabase.from('reports')
      .select('id,reason,status,post_id,created_at').eq('status', 'pending')
      .order('created_at', { ascending: false }).limit(25);
    if (e) setError(e.message);
    else setReportes(data || []);
  }

  async function resolverReporte(id) {
    const { error: e } = await supabase.from('reports').update({ status: 'reviewed' }).eq('id', id);
    if (e) setError(e.message);
    else { setMensaje('Reporte marcado como revisado.'); await cargarReportes(); }
  }

  async function cargarLecciones(id) {
    const { data, error: e } = await supabase.from('lessons').select('*').eq('course_id', id).order('position');
    if (e) setError(e.message);
    else setLecciones(data || []);
  }

  function elegirCurso(curso) {
    setCursoId(curso.id);
    setDatos({ title: curso.title, slug: curso.slug, summary: curso.summary, level: curso.level || 'Principiante', cover_url: curso.cover_url || '', published: curso.published });
    setArchivoPortada(null);
    setLeccionId(null); setLeccion(LECCION); setArchivoLeccion(null);
    setError(''); setMensaje(''); cargarLecciones(curso.id);
  }
  function nuevoCurso() {
    setCursoId(null); setDatos(NUEVO); setArchivoPortada(null); setLecciones([]);
    setLeccionId(null); setLeccion(LECCION); setArchivoLeccion(null);
    setError(''); setMensaje('');
  }
  function editarLeccion(l) {
    setLeccionId(l.id);
    setLeccion({ title: l.title, body: l.body, position: l.position, image_url: l.image_url || '', image_alt: l.image_alt || '', image_caption: l.image_caption || '', video_url: l.youtube_video_id ? `https://www.youtube.com/watch?v=${l.youtube_video_id}` : '', video_caption: l.video_caption || '' });
    setArchivoLeccion(null);
    document.getElementById('form-leccion')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function guardarCurso(evento) {
    evento.preventDefault(); setError(''); setMensaje(''); setProcesando(true);
    let imagenNueva = null;
    try {
      const slug = convertirSlug(datos.slug || datos.title);
      if (!slug) throw new Error('Escribe un título válido.');
      if (datos.published && !cursoId) throw new Error('Primero guarda el curso, agrega una lección y después publícalo.');
      if (datos.published && lecciones.length === 0) throw new Error('Añade al menos una lección antes de publicar.');
      const cover = datos.cover_url.trim();
      if (!archivoPortada && cover && !/^https:\/\//i.test(cover) && !cover.startsWith('/')) throw new Error('Utiliza una URL HTTPS o una ruta de imagen local (/...).');
      if (archivoPortada) imagenNueva = await subirImagen(archivoPortada, { bucket: 'course-media', carpeta: 'covers' });
      const payload = {
        title: datos.title.trim(), slug, summary: datos.summary.trim(), level: datos.level,
        cover_url: imagenNueva?.url || cover || null, published: datos.published,
      };
      const solicitud = cursoId
        ? supabase.from('courses').update(payload).eq('id', cursoId).select().single()
        : supabase.from('courses').insert({ ...payload, author_id: usuario.id }).select().single();
      const { data, error: e } = await solicitud;
      if (e) throw e;
      const anterior = cursoId && datos.cover_url !== data.cover_url ? identificarObjeto(datos.cover_url, 'course-media') : null;
      await cargarCursos(); elegirCurso(data);
      setMensaje(cursoId ? 'Curso actualizado.' : 'Curso creado. Ya puedes añadir lecciones.');
      if (anterior) eliminarObjeto(anterior).catch(() => setError('Curso guardado, pero no se pudo eliminar la portada antigua del almacenamiento.'));
    } catch (e) {
      if (imagenNueva) await eliminarObjeto(imagenNueva).catch(() => {});
      setError(e.message);
    } finally { setProcesando(false); }
  }

  async function borrarCurso() {
    if (!cursoId || !window.confirm('¿Eliminar este curso y todas sus lecciones? Esta acción no se puede deshacer.')) return;
    setProcesando(true); setError('');
    const archivos = [datos.cover_url, ...lecciones.map(l => l.image_url)].map(u => identificarObjeto(u, 'course-media')).filter(Boolean);
    const { error: e } = await supabase.from('courses').delete().eq('id', cursoId);
    if (e) setError(e.message);
    else {
      nuevoCurso(); await cargarCursos(); setMensaje('Curso eliminado.');
      const resultados = await Promise.allSettled(archivos.map(eliminarObjeto));
      if (resultados.some(r => r.status === 'rejected')) setError('Curso eliminado, pero quedaron imágenes antiguas por limpiar en Storage.');
    }
    setProcesando(false);
  }

  async function guardarLeccion(evento) {
    evento.preventDefault(); setError(''); setMensaje(''); setProcesando(true);
    let imagenNueva = null;
    try {
      if (!cursoId) throw new Error('Guarda el curso antes de crear lecciones.');
      const imagenQuedara = Boolean(archivoLeccion || leccion.image_url);
      if (imagenQuedara && leccion.image_alt.trim().length < 5) throw new Error('Describe la imagen en el texto alternativo (mínimo 5 caracteres).');
      const videoId = leccion.video_url.trim() ? extraerIdYouTube(leccion.video_url) : null;
      if (leccion.video_url.trim() && !videoId) throw new Error('El video debe ser un enlace HTTPS válido de YouTube o un ID de 11 caracteres.');
      if (leccion.video_caption.trim().length > 300) throw new Error('La descripción del video no puede superar los 300 caracteres.');
      if (archivoLeccion) imagenNueva = await subirImagen(archivoLeccion, { bucket: 'course-media', carpeta: 'lessons' });
      const payload = {
        title: leccion.title.trim(), body: leccion.body.trim(), position: Number(leccion.position),
        image_url: imagenNueva?.url || leccion.image_url || null,
        image_alt: imagenQuedara ? leccion.image_alt.trim() : null,
        image_caption: imagenQuedara ? leccion.image_caption.trim() || null : null,
        youtube_video_id: videoId,
        video_caption: videoId ? leccion.video_caption.trim() || null : null,
      };
      const solicitud = leccionId
        ? supabase.from('lessons').update(payload).eq('id', leccionId)
        : supabase.from('lessons').insert({ ...payload, course_id: cursoId });
      const { error: e } = await solicitud;
      if (e) throw e;
      const anterior = leccionId && lecciones.find(l => l.id === leccionId)?.image_url;
      await cargarLecciones(cursoId);
      setLeccion(LECCION); setLeccionId(null); setArchivoLeccion(null);
      setMensaje('Lección guardada correctamente.');
      if (anterior && anterior !== payload.image_url) {
        const objeto = identificarObjeto(anterior, 'course-media');
        if (objeto) eliminarObjeto(objeto).catch(() => setError('Lección guardada, pero no se pudo retirar la imagen anterior de Storage.'));
      }
    } catch (e) {
      if (imagenNueva) await eliminarObjeto(imagenNueva).catch(() => {});
      setError(e.message);
    } finally { setProcesando(false); }
  }

  async function borrarLeccion(id) {
    if (!window.confirm('¿Eliminar esta lección y sus votos?')) return;
    const anterior = lecciones.find(l => l.id === id)?.image_url;
    const { error: e } = await supabase.from('lessons').delete().eq('id', id);
    if (e) setError(e.message);
    else {
      setLeccionId(null); setLeccion(LECCION); setArchivoLeccion(null);
      await cargarLecciones(cursoId); setMensaje('Lección eliminada.');
      const objeto = identificarObjeto(anterior, 'course-media');
      if (objeto) eliminarObjeto(objeto).catch(() => setError('La lección se eliminó, pero su imagen sigue en Storage.'));
    }
  }

  if (cargando) return <div className="sistema-pagina">Comprobando permisos…</div>;
  if (!usuario) return <div className="sistema-pagina sistema-vacio"><h1>Acceso reservado</h1><p>Inicia sesión para acceder al panel.</p><Enlace to="/cuenta">Iniciar sesión</Enlace></div>;
  if (!esAdmin) return <div className="sistema-pagina sistema-vacio"><h1>Sin permisos de administrador</h1><p>Tu cuenta no tiene permisos para editar cursos.</p><Enlace to="/academia">Ver Academia</Enlace></div>;

  return <div className="sistema-pagina sistema-admin">
    <div className="sistema-cabecera">
      <span className="sistema-kicker">PANEL DE ADMINISTRACIÓN</span><h1>Gestión de cursos</h1>
      <p>Crea cursos con lecciones, imágenes y videos enlazados de YouTube desde este panel. Los contenidos se guardan en Supabase sin modificar el código React.</p>
      <div className="sistema-acciones"><Enlace className="sistema-boton-outline" to="/academia">Ver catálogo público →</Enlace><button className="sistema-boton" type="button" onClick={nuevoCurso}>+ Crear nuevo curso</button></div>
    </div>
    {mensaje && <div className="sistema-exito" role="status">{mensaje}</div>}
    {error && <div className="sistema-error" role="alert">{error}</div>}
    <div className="sistema-admin-grid">
      <aside className="sistema-panel sistema-admin-lista">
        <h2>Cursos disponibles</h2>
        {cursos.length === 0 && <p>Cuando crees tu primer curso aparecerá aquí.</p>}
        {cursos.map(c => <button type="button" key={c.id} onClick={() => elegirCurso(c)} className={c.id === cursoId ? 'sistema-admin-item activo' : 'sistema-admin-item'}><strong>{c.title}</strong><small>{c.published ? 'Publicado' : 'Borrador'} · {c.slug}</small></button>)}
      </aside>
      <div className="sistema-admin-editor">
        <form className="sistema-panel sistema-formulario" onSubmit={guardarCurso}>
          <h2>{cursoId ? 'Editar curso' : 'Nuevo curso'}</h2>
          <label>Título<input required minLength={3} maxLength={100} value={datos.title} onChange={e => setDatos(v => ({ ...v, title: e.target.value, slug: cursoId ? v.slug : convertirSlug(e.target.value) }))} placeholder="Ej. Introducción a torneos" /></label>
          <label>Identificador de la URL<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={70} value={datos.slug} onChange={e => setDatos(v => ({ ...v, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))} placeholder="introduccion-a-torneos" /></label>
          <label>Resumen<textarea required rows={3} minLength={15} maxLength={1000} value={datos.summary} onChange={e => setDatos(v => ({ ...v, summary: e.target.value }))} /></label>
          <label>Nivel<select value={datos.level} onChange={e => setDatos(v => ({ ...v, level: e.target.value }))}><option>Principiante</option><option>Intermedio</option><option>Avanzado</option></select></label>
          <label>URL de portada (alternativa al archivo local)<input maxLength={500} value={datos.cover_url} onChange={e => { setDatos(v => ({ ...v, cover_url: e.target.value })); setArchivoPortada(null); }} placeholder="https://... o /curso/mesa-poker.webp" /></label>
          <SelectorImagen id="archivo-portada" titulo="Subir portada desde este dispositivo" archivo={archivoPortada} onArchivo={setArchivoPortada} actual={datos.cover_url} onQuitar={() => setDatos(v => ({ ...v, cover_url: '' }))} />
          <label className="sistema-check"><input type="checkbox" checked={datos.published} onChange={e => setDatos(v => ({ ...v, published: e.target.checked }))} /> Publicar curso para todos</label>
          <div className="sistema-acciones"><button className="sistema-boton" type="submit" disabled={procesando}>{procesando ? 'Guardando…' : 'Guardar curso'}</button>{cursoId && <button className="sistema-enlace-peligro" type="button" disabled={procesando} onClick={borrarCurso}>Eliminar curso</button>}</div>
        </form>
        {cursoId && <div className="sistema-panel sistema-lecciones-admin">
          <h2>Lecciones del curso</h2>
          <p>Cada lección puede incluir texto, una imagen y un video complementario de YouTube. Los videos se enlazan sin cargar archivos pesados a Supabase.</p>
          {lecciones.map(l => <div className="sistema-leccion-item" key={l.id}><span>{l.position}. {l.title} {l.image_url ? ' · Imagen' : ''}{l.youtube_video_id ? ' · Video' : ''}</span><div><button type="button" onClick={() => editarLeccion(l)}>Editar</button><button type="button" disabled={procesando} onClick={() => borrarLeccion(l.id)}>Eliminar</button></div></div>)}
          <form id="form-leccion" className="sistema-formulario" onSubmit={guardarLeccion}>
            <h3>{leccionId ? 'Modificar lección' : 'Añadir lección'}</h3>
            <label>Título<input required maxLength={130} value={leccion.title} onChange={e => setLeccion(v => ({ ...v, title: e.target.value }))} /></label>
            <label>Orden<input required type="number" min="1" max="999" value={leccion.position} onChange={e => setLeccion(v => ({ ...v, position: e.target.value }))} /></label>
            <label>Contenido (separa párrafos con una línea vacía)<textarea required rows={10} minLength={30} maxLength={20000} value={leccion.body} onChange={e => setLeccion(v => ({ ...v, body: e.target.value }))} /></label>
            <SelectorImagen id="archivo-leccion" titulo="Imagen de la lección" archivo={archivoLeccion} onArchivo={setArchivoLeccion} actual={leccion.image_url} onQuitar={() => setLeccion(v => ({ ...v, image_url: '', image_alt: '', image_caption: '' }))} />
            {(archivoLeccion || leccion.image_url) && <>
              <label>Descripción para lectores de pantalla (obligatoria)<input required minLength={5} maxLength={180} value={leccion.image_alt} onChange={e => setLeccion(v => ({ ...v, image_alt: e.target.value }))} placeholder="Ej. Mesa de seis jugadores con fichas y cartas comunitarias" /></label>
              <label>Pie de imagen (opcional)<input maxLength={300} value={leccion.image_caption} onChange={e => setLeccion(v => ({ ...v, image_caption: e.target.value }))} placeholder="Ejemplo de una situación preflop" /></label>
            </>}
            <div className="pw-video-editor">
              <strong>Video complementario (opcional)</strong>
              <p>Pega un enlace HTTPS de YouTube, YouTube Shorts o youtu.be. No se permiten iframes personalizados ni archivos Base64. El reproductor solo se abrirá cuando el alumno lo solicite.</p>
              <label>Enlace al video<input type="text" maxLength={300} placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX" value={leccion.video_url} onChange={e => setLeccion(v => ({ ...v, video_url: e.target.value }))} /></label>
              {leccion.video_url.trim() && <p className={extraerIdYouTube(leccion.video_url) ? 'pw-video-editor-correcto' : 'pw-video-editor-error'} role="status">{extraerIdYouTube(leccion.video_url) ? '✓ Enlace compatible. No requiere subir archivos.' : 'El enlace debe ser HTTPS y pertenecer a YouTube.'}</p>}
              <label>Descripción del video (opcional)<input type="text" maxLength={300} placeholder="Explicación visual de una mano preflop" value={leccion.video_caption} onChange={e => setLeccion(v => ({ ...v, video_caption: e.target.value }))} /></label>
            </div>
            <div className="sistema-acciones"><button className="sistema-boton" type="submit" disabled={procesando}>{procesando ? 'Guardando…' : leccionId ? 'Actualizar lección' : '+ Añadir lección'}</button>{leccionId && <button type="button" className="sistema-boton-outline" onClick={() => { setLeccionId(null); setLeccion(LECCION); setArchivoLeccion(null); }}>Cancelar</button>}</div>
          </form>
        </div>}
      </div>
    </div>
    <section className="sistema-panel sistema-reportes-admin"><h2>Reportes de la comunidad ({reportes.length})</h2><p>Estos avisos permiten revisar posibles incumplimientos.</p>{reportes.length === 0 && <p>No hay reportes pendientes.</p>}{reportes.map(r => <div key={r.id} className="sistema-reporte-item"><div><strong>{r.reason}</strong><small>Publicación {r.post_id} · {new Date(r.created_at).toLocaleDateString('es-MX')}</small></div><div className="sistema-acciones"><Enlace className="sistema-boton-outline" to="/comunidad">Ver comunidad</Enlace><button className="sistema-boton" type="button" onClick={() => resolverReporte(r.id)}>Marcar revisado</button></div></div>)}</section>
    <ModeracionResenas />
  </div>;
}
