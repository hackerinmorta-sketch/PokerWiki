import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Debe renderizarse solo para esAdmin; la base de datos vuelve a validar el rol.
export default function ModeracionResenas() {
  const [resenas, setResenas] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargar = useCallback(async () => {
    const [r, avisos] = await Promise.all([
      supabase.from('course_reviews').select('id,course_id,user_id,body,status,created_at,profiles(display_name),courses(title)').order('created_at', { ascending: false }).limit(80),
      supabase.from('course_review_reports').select('id,review_id,reason,status,created_at').eq('status', 'pending').order('created_at', { ascending: false }).limit(40),
    ]);
    if (r.error || avisos.error) throw r.error || avisos.error;
    const recientes = r.data || [];
    const faltantes = (avisos.data || []).map(a => a.review_id).filter(id => !recientes.some(x => x.id === id));
    let reportadasAntiguas = [];
    if (faltantes.length) {
      const extra = await supabase.from('course_reviews')
        .select('id,course_id,user_id,body,status,created_at,profiles(display_name),courses(title)')
        .in('id', faltantes);
      if (extra.error) throw extra.error;
      reportadasAntiguas = extra.data || [];
    }
    setResenas([...recientes, ...reportadasAntiguas]); setReportes(avisos.data || []);
  }, []);

  useEffect(() => {
    let vigente = true;
    cargar().catch(e => { if (vigente) setError(e.message); }).finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [cargar]);

  async function cambiarEstado(resena) {
    setProcesando(resena.id); setError(''); setMensaje('');
    const nuevo = resena.status === 'visible' ? 'hidden' : 'visible';
    const { error: e } = await supabase.from('course_reviews').update({status: nuevo}).eq('id', resena.id);
    if (e) setError(e.message);
    else { setMensaje(nuevo === 'visible' ? 'Reseña restaurada.' : 'Reseña oculta.'); await cargar().catch(x => setError(x.message)); }
    setProcesando('');
  }
  async function revisar(id) {
    setProcesando(id); setError(''); setMensaje('');
    const { error: e } = await supabase.from('course_review_reports').update({status:'reviewed'}).eq('id', id);
    if (e) setError(e.message);
    else { setMensaje('Reporte revisado.'); await cargar().catch(x => setError(x.message)); }
    setProcesando('');
  }

  return <section className="sistema-panel sistema-moderacion-resenas" aria-labelledby="resenas-admin-titulo">
    <span className="sistema-kicker">RETROALIMENTACIÓN</span><h2 id="resenas-admin-titulo">Moderación de reseñas</h2>
    <p>Los estudiantes pueden publicar opiniones negativas; solo oculta contenido que incumpla las reglas de la comunidad. Las reseñas ocultas siguen visibles para el autor y el administrador.</p>
    {mensaje && <p className="sistema-exito" role="status">{mensaje}</p>}
    {error && <p className="sistema-error" role="alert">{error}</p>}
    {cargando ? <p>Cargando comentarios…</p> : <>
      <h3>Reportes pendientes ({reportes.length})</h3>
      {reportes.length === 0 && <p>No hay reportes de reseñas pendientes.</p>}
      {reportes.map(rep => {
        const asociada = resenas.find(r => r.id === rep.review_id);
        return <div className="sistema-admin-resena" key={rep.id}>
          <strong>Motivo: {rep.reason}</strong><p>{asociada ? `Curso: ${asociada.courses?.title || 'Curso'} · ${asociada.body.slice(0, 200)}` : 'Reseña fuera de las últimas 80 entradas o eliminada.'}</p>
          <button className="sistema-boton-outline" type="button" disabled={Boolean(procesando)} onClick={() => revisar(rep.id)}>Marcar reporte como revisado</button>
        </div>;
      })}
      <h3>Reseñas recientes ({resenas.length})</h3>
      {resenas.length === 0 && <p>Todavía no existen reseñas.</p>}
      {resenas.map(r => <div className="sistema-admin-resena" key={r.id}>
        <div className="sistema-resena-meta"><strong>{r.courses?.title || 'Curso'} · {r.profiles?.display_name || 'Usuario'}</strong><small>{new Date(r.created_at).toLocaleDateString('es-MX')} · {r.status === 'visible' ? 'Visible' : 'Oculta'}</small></div>
        <p>{r.body}</p>
        <button type="button" disabled={Boolean(procesando)} className={r.status === 'visible' ? 'sistema-boton-outline' : 'sistema-boton'} onClick={() => cambiarEstado(r)}>{r.status === 'visible' ? 'Ocultar reseña' : 'Restaurar reseña'}</button>
      </div>)}
    </>}
  </section>;
}
