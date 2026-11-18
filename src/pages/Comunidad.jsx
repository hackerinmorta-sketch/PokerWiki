import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, supabaseConfigurado } from '../lib/supabase';
import { Enlace } from '../lib/navegacion';
import SelectorImagen from '../components/SelectorImagen';
import { subirImagen, eliminarObjeto, identificarObjeto } from '../lib/media';

const CATEGORIAS = ['Preguntas', 'Estrategia', 'Modalidades', 'Presentaciones', 'General'];
const formatearFecha = fecha => new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(fecha));

function ImagenComunidad({ url, alt, descripcion }) {
  if (!url) return null;
  return <figure className="sistema-post-imagen"><img src={url} alt={alt || descripcion || 'Imagen adjunta a la conversación'} loading="lazy" onError={e => { e.currentTarget.hidden = true; }} />{descripcion && <figcaption>{descripcion}</figcaption>}</figure>;
}

export default function Comunidad() {
  const { usuario, esAdmin, perfil } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [nombres, setNombres] = useState({});
  const [seleccionada, setSeleccionada] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [cuerpo, setCuerpo] = useState('');
  const [categoria, setCategoria] = useState('Preguntas');
  const [archivoPost, setArchivoPost] = useState(null);
  const [altPost, setAltPost] = useState('');
  const [comentario, setComentario] = useState('');
  const [archivoRespuesta, setArchivoRespuesta] = useState(null);
  const [altRespuesta, setAltRespuesta] = useState('');
  const [cargando, setCargando] = useState(supabaseConfigurado);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarPublicaciones = useCallback(async () => {
    if (!supabase) return;
    const { data, error: e } = await supabase.from('posts')
      .select('id,author_id,title,body,category,created_at,image_url,image_alt')
      .order('created_at', { ascending: false }).limit(50);
    if (e) { setError(e.message); setCargando(false); return; }
    setPublicaciones(data || []);
    const ids = [...new Set((data || []).map(p => p.author_id))];
    if (ids.length) {
      const perfiles = await supabase.from('profiles').select('id,display_name').in('id', ids);
      if (!perfiles.error) setNombres(actual => ({ ...actual, ...Object.fromEntries((perfiles.data || []).map(p => [p.id, p.display_name])) }));
    }
    setCargando(false);
  }, []);

  const cargarRespuestas = useCallback(async id => {
    if (!supabase || !id) return;
    const { data, error: e } = await supabase.from('comments')
      .select('id,post_id,author_id,body,created_at,image_url,image_alt')
      .eq('post_id', id).order('created_at', { ascending: true });
    if (e) { setError(e.message); return; }
    setRespuestas(data || []);
    const ids = [...new Set((data || []).map(p => p.author_id))];
    if (ids.length) {
      const perfiles = await supabase.from('profiles').select('id,display_name').in('id', ids);
      if (!perfiles.error) setNombres(actual => ({ ...actual, ...Object.fromEntries((perfiles.data || []).map(p => [p.id, p.display_name])) }));
    }
  }, []);

  useEffect(() => { cargarPublicaciones(); }, [cargarPublicaciones]);
  useEffect(() => { if (seleccionada) cargarRespuestas(seleccionada.id); }, [seleccionada?.id, cargarRespuestas]);
  useEffect(() => { if (seleccionada) document.querySelector('.sistema-hilo')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [seleccionada?.id]);

  async function publicar(evento) {
    evento.preventDefault(); if (!usuario) return;
    setError(''); setMensaje(''); setEnviando(true);
    let imagenNueva = null;
    try {
      if (archivoPost && altPost.trim().length < 5) throw new Error('Describe la imagen adjunta con al menos 5 caracteres.');
      if (archivoPost) imagenNueva = await subirImagen(archivoPost, { bucket: 'community-media', carpeta: usuario.id });
      const { error: e } = await supabase.from('posts').insert({
        author_id: usuario.id, title: titulo.trim(), body: cuerpo.trim(), category: categoria,
        image_url: imagenNueva?.url || null, image_alt: imagenNueva ? altPost.trim() : null,
      });
      if (e) throw e;
      setTitulo(''); setCuerpo(''); setArchivoPost(null); setAltPost('');
      setMensaje('Publicación creada.'); await cargarPublicaciones();
    } catch (e) {
      if (imagenNueva) await eliminarObjeto(imagenNueva).catch(() => {});
      setError(e.message);
    } finally { setEnviando(false); }
  }

  async function responder(evento) {
    evento.preventDefault(); if (!usuario || !seleccionada) return;
    setError(''); setEnviando(true);
    let imagenNueva = null;
    try {
      if (archivoRespuesta && altRespuesta.trim().length < 5) throw new Error('Describe la imagen de la respuesta con al menos 5 caracteres.');
      if (archivoRespuesta) imagenNueva = await subirImagen(archivoRespuesta, { bucket: 'community-media', carpeta: usuario.id });
      const { error: e } = await supabase.from('comments').insert({
        post_id: seleccionada.id, author_id: usuario.id, body: comentario.trim(),
        image_url: imagenNueva?.url || null, image_alt: imagenNueva ? altRespuesta.trim() : null,
      });
      if (e) throw e;
      setComentario(''); setArchivoRespuesta(null); setAltRespuesta(''); await cargarRespuestas(seleccionada.id);
    } catch (e) {
      if (imagenNueva) await eliminarObjeto(imagenNueva).catch(() => {});
      setError(e.message);
    } finally { setEnviando(false); }
  }

  async function eliminarPublicacion(post) {
    if (!window.confirm('¿Eliminar la publicación y todos sus comentarios?')) return;
    setError('');
    // Borrado en cascada de comentarios en PostgreSQL; archivos del almacenamiento se limpian por separado.
    const adjuntos = [post.image_url, ...respuestas.filter(r => r.post_id === post.id).map(r => r.image_url)]
      .map(url => identificarObjeto(url, 'community-media')).filter(Boolean);
    const { error: e } = await supabase.from('posts').delete().eq('id', post.id);
    if (e) setError(e.message);
    else {
      setSeleccionada(null); setRespuestas([]); setMensaje('Publicación eliminada.'); await cargarPublicaciones();
      const resultados = await Promise.allSettled(adjuntos.map(eliminarObjeto));
      if (resultados.some(r => r.status === 'rejected')) setError('Tema eliminado. Algunas imágenes podrían requerir limpieza manual en Storage.');
    }
  }

  async function eliminarComentario(respuesta) {
    if (!window.confirm('¿Eliminar el comentario?')) return;
    const { error: e } = await supabase.from('comments').delete().eq('id', respuesta.id);
    if (e) setError(e.message);
    else {
      await cargarRespuestas(seleccionada.id);
      const objeto = identificarObjeto(respuesta.image_url, 'community-media');
      if (objeto) eliminarObjeto(objeto).catch(() => setError('Comentario eliminado, pero no se pudo retirar su imagen de Storage.'));
    }
  }

  async function reportarPost(post) {
    if (!usuario) return;
    const razon = window.prompt('Describe brevemente el motivo del reporte (mínimo 10 caracteres):');
    if (!razon) return;
    if (razon.trim().length < 10) { setError('Explica con un poco más de detalle el motivo.'); return; }
    const { error: e } = await supabase.from('reports').insert({ post_id: post.id, reporter_id: usuario.id, reason: razon.trim().slice(0, 500) });
    if (e) setError(e.message); else setMensaje('Reporte enviado para su revisión.');
  }

  return <div className="sistema-pagina sistema-comunidad">
    <div className="sistema-cabecera"><span className="sistema-kicker">COMUNIDAD · ESPACIO EDUCATIVO</span><h1>Una comunidad para aprender.</h1><p>Comparte preguntas, imágenes de manos y estrategias. Puedes adjuntar una imagen desde tu computadora o celular tanto al publicar como al responder.</p><div className="sistema-acciones">{!usuario && <Enlace className="sistema-boton" to="/cuenta">Ingresar para participar →</Enlace>}<Enlace className="sistema-boton-outline" to="/academia">Explorar cursos →</Enlace></div></div>
    {!supabaseConfigurado && <div className="sistema-aviso"><strong>Comunidad pendiente de conexión</strong><p>Configura Supabase para activar publicaciones persistentes.</p></div>}
    {error && <p className="sistema-error" role="alert">{error}</p>}
    {mensaje && <p className="sistema-exito" role="status">{mensaje}</p>}
    <div className="sistema-comunidad-grid">
      <div>
        <div className="sistema-panel sistema-foro-cabecera"><h2>Conversaciones recientes</h2><span>{publicaciones.length} temas</span></div>
        {cargando && <p>Cargando conversaciones…</p>}
        {!cargando && publicaciones.length === 0 && <div className="sistema-vacio"><h3>Todavía no hay publicaciones</h3><p>Cuando un usuario publique el primer tema aparecerá aquí.</p></div>}
        <div className="sistema-lista-posts">{publicaciones.map(post => <article key={post.id} className={seleccionada?.id === post.id ? 'sistema-post elegido' : 'sistema-post'}>
          <button type="button" className="sistema-post-boton" onClick={() => { setSeleccionada(post); setMensaje(''); }}>
            <span className="sistema-kicker">{post.category} {post.image_url ? '· Con imagen' : ''}</span><h3>{post.title}</h3><p>{post.body.length > 190 ? post.body.slice(0, 190) + '…' : post.body}</p>
            {post.image_url && <img className="sistema-post-miniatura" src={post.image_url} alt={post.image_alt || 'Vista de la imagen adjunta'} loading="lazy" onError={e => { e.currentTarget.hidden = true; }} />}
            <small>{nombres[post.author_id] || 'Usuario'} · {formatearFecha(post.created_at)}</small>
          </button>
        </article>)}</div>
      </div>
      <aside className="sistema-columna-derecha">
        {usuario ? <form className="sistema-panel sistema-formulario" onSubmit={publicar}>
          <h2>Crear una conversación</h2><p>Publicarás como <strong>{perfil?.display_name || usuario.email}</strong>.</p>
          <label>Título<input required minLength={8} maxLength={140} value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="¿Qué duda tienes?" /></label>
          <label>Categoría<select value={categoria} onChange={e => setCategoria(e.target.value)}>{CATEGORIAS.map(c => <option key={c}>{c}</option>)}</select></label>
          <label>Tu publicación<textarea required minLength={20} maxLength={5000} rows={5} value={cuerpo} onChange={e => setCuerpo(e.target.value)} placeholder="Incluye el contexto y formula tu pregunta…" /></label>
          <SelectorImagen id="imagen-post" titulo="Imagen del tema (opcional)" archivo={archivoPost} onArchivo={setArchivoPost} onQuitar={() => setAltPost('')} />
          {archivoPost && <label>Descripción de imagen para accesibilidad<input required minLength={5} maxLength={180} value={altPost} onChange={e => setAltPost(e.target.value)} placeholder="Ej. Cartas del flop y posición del jugador" /></label>}
          <button disabled={enviando} className="sistema-boton" type="submit">{enviando ? 'Publicando…' : 'Publicar tema →'}</button>
        </form> : <div className="sistema-panel"><h2>Participa en las conversaciones</h2><p>Para escribir o responder debes iniciar sesión.</p><Enlace className="sistema-boton" to="/cuenta">Acceder →</Enlace></div>}
        <div className="sistema-aviso"><strong>Normas básicas</strong><p>No publiques datos privados ni capturas que muestren contraseñas, correos o información bancaria. Utiliza imágenes propias o autorizadas; respeta a los demás.</p></div>
      </aside>
    </div>
    {seleccionada && <section className="sistema-panel sistema-hilo" aria-labelledby="hilo-titulo">
      <div className="sistema-hilo-cabecera"><span className="sistema-kicker">{seleccionada.category} · {formatearFecha(seleccionada.created_at)}</span><button type="button" className="sistema-boton-outline" onClick={() => setSeleccionada(null)}>Cerrar conversación ×</button></div>
      <h2 id="hilo-titulo">{seleccionada.title}</h2><p className="sistema-hilo-texto">{seleccionada.body}</p>
      <ImagenComunidad url={seleccionada.image_url} alt={seleccionada.image_alt} />
      <small>Publicado por {nombres[seleccionada.author_id] || 'Usuario'}</small>
      <div className="sistema-acciones">{(usuario?.id === seleccionada.author_id || esAdmin) && <button type="button" className="sistema-enlace-peligro" onClick={() => eliminarPublicacion(seleccionada)}>Eliminar tema</button>}{usuario && usuario.id !== seleccionada.author_id && <button type="button" className="sistema-boton-outline" onClick={() => reportarPost(seleccionada)}>Reportar publicación</button>}</div>
      <div className="sistema-respuestas"><h3>Respuestas ({respuestas.length})</h3>{respuestas.length === 0 && <p>Aún no hay comentarios en esta conversación.</p>}{respuestas.map(r => <article className="sistema-respuesta" key={r.id}><strong>{nombres[r.author_id] || 'Usuario'}</strong><small>{formatearFecha(r.created_at)}</small><p>{r.body}</p><ImagenComunidad url={r.image_url} alt={r.image_alt} />{(usuario?.id === r.author_id || esAdmin) && <button type="button" onClick={() => eliminarComentario(r)}>Eliminar respuesta</button>}</article>)}</div>
      {usuario ? <form className="sistema-formulario" onSubmit={responder}>
        <label>Escribir una respuesta<textarea required maxLength={3000} minLength={2} rows={4} value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Comparte una explicación útil…" /></label>
        <SelectorImagen id="imagen-respuesta" titulo="Imagen de la respuesta (opcional)" archivo={archivoRespuesta} onArchivo={setArchivoRespuesta} onQuitar={() => setAltRespuesta('')} />
        {archivoRespuesta && <label>Descripción de imagen<input required minLength={5} maxLength={180} value={altRespuesta} onChange={e => setAltRespuesta(e.target.value)} /></label>}
        <button type="submit" className="sistema-boton" disabled={enviando}>{enviando ? 'Enviando…' : 'Responder →'}</button>
      </form> : <p><Enlace to="/cuenta">Inicia sesión</Enlace> para responder.</p>}
    </section>}
  </div>;
}
