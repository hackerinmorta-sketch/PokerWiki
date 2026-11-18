import { useEffect, useState } from 'react';
import { Enlace } from '../lib/navegacion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatos, variantes } from '../data';
import { cursos as cursosOriginales } from '../contenidoCursos';

// Acceso directo al último curso guardado. No añade una segunda portada ni un carrusel.
function ContinuarAprendiendo() {
  const { usuario } = useAuth();
  const [ultimo, setUltimo] = useState(null);
  useEffect(() => {
    if (!supabase || !usuario?.id) { setUltimo(null); return; }
    let vigente = true;
    async function cargar() {
      const uid = usuario.id;
      const [nuevos, originales] = await Promise.all([
        supabase.from('course_enrollments').select('course_id,enrolled_at').eq('user_id', uid).order('enrolled_at', { ascending: false }).limit(1),
        supabase.from('legacy_course_enrollments').select('course_slug,enrolled_at').eq('user_id', uid).order('enrolled_at', { ascending: false }).limit(1),
      ]);
      if (nuevos.error || originales.error || !vigente) return;
      const candidatoNuevo = nuevos.data?.[0];
      const candidatoOriginal = originales.data?.[0];
      if (!candidatoNuevo && !candidatoOriginal) return;
      let resultado = null;
      if (candidatoNuevo && (!candidatoOriginal || candidatoNuevo.enrolled_at >= candidatoOriginal.enrolled_at)) {
        const { data, error } = await supabase.from('courses')
          .select('id,slug,title,published').eq('id', candidatoNuevo.course_id).eq('published', true).maybeSingle();
        if (!error && data) resultado = { titulo: data.title, ruta: `/academia/${data.slug}` };
      }
      if (!resultado && candidatoOriginal) {
        const info = [...formatos, ...variantes].find(c => c.slug === candidatoOriginal.course_slug);
        if (info && cursosOriginales[info.slug]) resultado = { titulo: info.titulo, ruta: `/modalidades/${info.slug}` };
      }
      if (vigente) setUltimo(resultado);
    }
    cargar().catch(() => { if (vigente) setUltimo(null); });
    return () => { vigente = false; };
  }, [usuario?.id]);
  if (!usuario || !ultimo) return null;
  return <div className="pw9-continuar">
    <div><span className="sistema-kicker">TU APRENDIZAJE</span><strong>{ultimo.titulo}</strong><small>Continúa desde tu curso guardado</small></div>
    <Enlace to={ultimo.ruta}>Continuar →</Enlace>
  </div>;
}

export default function Inicio() {
  return (
    <section className="hero-marco pw-inicio" aria-labelledby="titulo-principal">
      <div className="hero-contenido">
        <div className="hero-texto">
          <p className="pre-titulo"><span className="linea-roja" /> POKERWIKI · APRENDIZAJE ABIERTO</p>
          <h1 id="titulo-principal">EL PÓKER SE ENTIENDE <span>PASO A PASO.</span></h1>
          <p className="hero-descripcion">Explora cursos, aprende a tu ritmo y comparte preguntas con otros estudiantes. Todo en un espacio educativo organizado, sin apuestas ni transacciones.</p>
          <div className="hero-botones">
            <Enlace to="/academia" className="boton boton-dorado">EXPLORAR CURSOS <span aria-hidden="true">↗</span></Enlace>
            <Enlace to="/comunidad" className="boton boton-contorno">IR A LA COMUNIDAD <span aria-hidden="true">→</span></Enlace>
          </div>
          <ContinuarAprendiendo />
        </div>
        <div className="hero-imagen-wrap">
          <img className="hero-imagen" src="/images%20(1).jpg" alt="Fotografía ilustrativa de cartas y fichas sobre una mesa de póker" />
        </div>
      </div>
    </section>
  );
}
