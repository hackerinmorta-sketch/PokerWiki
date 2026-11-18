import { useEffect, useState } from 'react';
import { supabase, supabaseConfigurado } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Enlace } from '../lib/navegacion';
import { formatos, variantes } from '../data';
import { cursos as cursosOriginales } from '../contenidoCursos';

const originales = [...formatos, ...variantes];

function BarraProgreso({ porcentaje }) {
  return <div className="sistema-progreso-pista" role="progressbar" aria-label="Porcentaje de lecciones completadas" aria-valuemin={0} aria-valuemax={100} aria-valuenow={porcentaje}>
    <span style={{ width: `${porcentaje}%` }} />
  </div>;
}

export default function MisCursos() {
  const { usuario, cargando: cargandoSesion } = useAuth();
  const [elementos, setElementos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase || !usuario?.id) { setCargando(false); setElementos([]); return; }
    let vigente = true;
    setCargando(true); setError('');
    async function consultar() {
      const uid = usuario.id;
      const consultas = await Promise.all([
        supabase.from('course_enrollments').select('course_id,enrolled_at').eq('user_id', uid),
        supabase.from('legacy_course_enrollments').select('course_slug,enrolled_at').eq('user_id', uid),
        supabase.from('lesson_progress').select('lesson_id').eq('user_id', uid),
        supabase.from('legacy_lesson_progress').select('course_slug,lesson_key').eq('user_id', uid),
      ]);
      const fallo = consultas.find(r => r.error);
      if (fallo) throw fallo.error;
      const [inscripciones, originalesGuardados, dinamicosCompletados, originalesCompletados] = consultas.map(r => r.data || []);
      const ids = inscripciones.map(x => x.course_id);
      let cursosPublicados = [];
      let leccionesPublicadas = [];
      if (ids.length) {
        const [c, l] = await Promise.all([
          supabase.from('courses').select('id,slug,title,summary,cover_url,level').eq('published', true).in('id', ids),
          supabase.from('lessons').select('id,course_id').in('course_id', ids),
        ]);
        if (c.error || l.error) throw c.error || l.error;
        cursosPublicados = c.data || [];
        leccionesPublicadas = l.data || [];
      }
      const completos = new Set(dinamicosCompletados.map(l => l.lesson_id));
      const listaDinamica = cursosPublicados.map(c => {
        const lecciones = leccionesPublicadas.filter(l => l.course_id === c.id);
        const cantidad = lecciones.filter(l => completos.has(l.id)).length;
        return {
          clave: `d-${c.id}`, ruta: `/academia/${c.slug}`, titulo: c.title,
          resumen: c.summary, imagen: c.cover_url || '/curso/mesa-poker.webp',
          tipo: 'Curso de la comunidad', total: lecciones.length, leidas: cantidad,
          fecha: inscripciones.find(x => x.course_id === c.id)?.enrolled_at,
        };
      });
      const listaOriginal = originalesGuardados.flatMap(ins => {
        const info = originales.find(x => x.slug === ins.course_slug);
        const contenido = cursosOriginales[ins.course_slug];
        if (!info || !contenido) return [];
        const leidas = new Set(originalesCompletados.filter(x => x.course_slug === ins.course_slug).map(x => x.lesson_key));
        return [{
          clave: `e-${info.slug}`, ruta: `/modalidades/${info.slug}`, titulo: info.titulo,
          resumen: info.resumen, imagen: contenido.imagen,
          tipo: 'Curso original', total: contenido.capitulos.length,
          leidas: contenido.capitulos.filter(x => leidas.has(x.id)).length,
          fecha: ins.enrolled_at,
        }];
      });
      if (vigente) setElementos([...listaDinamica, ...listaOriginal]
        .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '')));
    }
    consultar().catch(e => { if (vigente) setError(e.message || 'No se pudo cargar tu progreso.'); })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [usuario?.id]);

  if (cargandoSesion) return <div className="sistema-pagina"><p>Comprobando sesión…</p></div>;
  if (!usuario) return <div className="sistema-pagina"><div className="sistema-vacio"><h1>Mis cursos</h1><p>Inicia sesión para guardar tus cursos y conservar el progreso en tus lecciones.</p><Enlace className="sistema-boton" to="/cuenta">Ingresar o registrarme →</Enlace></div></div>;
  return <div className="sistema-pagina sistema-mis-cursos">
    <section className="sistema-cabecera"><span className="sistema-kicker">TU ESPACIO DE APRENDIZAJE</span><h1>Mis cursos</h1><p>Retoma tus lecturas donde las dejaste. Tus lecciones completadas se guardan en Supabase y se sincronizan con tu cuenta.</p><div className="sistema-acciones"><Enlace className="sistema-boton" to="/academia">Explorar cursos →</Enlace><Enlace className="sistema-boton-outline" to="/modalidades">Ver cursos originales →</Enlace></div></section>
    {!supabaseConfigurado && <div className="sistema-aviso">Configura Supabase para utilizar el historial de aprendizaje.</div>}
    {cargando && <p>Cargando tu avance…</p>}
    {error && <p className="sistema-error" role="alert">{error}. Verifica que hayas ejecutado la migración SQL 003.</p>}
    {!cargando && !error && elementos.length === 0 && <div className="sistema-vacio"><h2>Aún no has guardado cursos</h2><p>Abre cualquier curso y pulsa «Guardar en Mis cursos» para comenzar. También se guardará automáticamente al marcar una lección como leída.</p><Enlace className="sistema-boton-outline" to="/academia">Ir al catálogo →</Enlace></div>}
    <section className="sistema-mis-cursos-grid" aria-label="Cursos que sigo">
      {elementos.map(item => {
        const pct = item.total ? Math.round(item.leidas / item.total * 100) : 0;
        return <article className="sistema-mis-curso" key={item.clave}>
          <Enlace to={item.ruta}><img src={item.imagen} alt={`Portada de ${item.titulo}`} loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/curso/mesa-poker.webp'; }} /></Enlace>
          <div className="sistema-mis-curso-body"><span className="sistema-kicker">{item.tipo}</span><h2><Enlace to={item.ruta}>{item.titulo}</Enlace></h2><p>{item.resumen}</p>
            <div className="sistema-progreso-etiqueta"><strong>{pct}% completado</strong><span>{item.leidas}/{item.total} lecciones</span></div><BarraProgreso porcentaje={pct} />
            <Enlace to={item.ruta} className="sistema-boton-outline">{pct === 100 && item.total ? 'Repasar curso →' : 'Continuar aprendiendo →'}</Enlace>
          </div>
        </article>;
      })}
    </section>
    <p className="sistema-ayuda">Los cursos que dejen de estar publicados no aparecen en esta lista. El historial de lecciones permanece asociado a tu cuenta hasta que se eliminen sus registros.</p>
  </div>;
}
