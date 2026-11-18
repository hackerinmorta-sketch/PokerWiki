import { useEffect } from 'react';
import './App.css';
import { formatos, variantes } from './data';
import { useRuta } from './lib/navegacion';
import { AuthProvider } from './context/AuthContext';
import { Encabezado, PiePagina } from './components/Estructura';
import Inicio from './pages/Inicio';
import { Modalidades, DetalleModalidad } from './pages/Modalidades';
import { InformacionGeneral, Empresa, Contacto, JuegoResponsable, NoEncontrada } from './pages/Informacion';
import Cuenta from './pages/Cuenta';
import Admin from './pages/Admin';
import Comunidad from './pages/Comunidad';
import { Academia, CursoDinamico } from './pages/Academia';
import MisCursos from './pages/MisCursos';
import './Sistema.css';
import './Iteracion8.css';
import './Iteracion9.css';
import './NavegacionAjustes.css';

function Redireccion({ destino }) {
  useEffect(() => {
    window.history.replaceState({}, '', destino);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, [destino]);
  return null;
}

function seleccionarPagina(ruta) {
  if (ruta === '/') return { titulo: 'Inicio', componente: <Inicio /> };
  if (ruta === '/modalidades') return { titulo: 'Modalidades originales', componente: <Modalidades /> };
  if (ruta === '/guias') return { titulo: 'Cursos', componente: <Redireccion destino="/academia" /> };
  if (ruta === '/info') return { titulo: 'Información', componente: <InformacionGeneral /> };
  if (ruta === '/empresa') return { titulo: 'Sobre pokerWiki', componente: <Empresa /> };
  if (ruta === '/contacto') return { titulo: 'Contacto', componente: <Contacto /> };
  if (ruta === '/juego-responsable') return { titulo: 'Juego responsable', componente: <JuegoResponsable /> };
  if (ruta === '/academia') return { titulo: 'Academia', componente: <Academia /> };
  if (ruta === '/mis-cursos') return { titulo: 'Mis cursos', componente: <MisCursos /> };
  if (ruta === '/comunidad') return { titulo: 'Comunidad', componente: <Comunidad /> };
  if (ruta === '/cuenta') return { titulo: 'Cuenta', componente: <Cuenta /> };
  if (ruta === '/admin') return { titulo: 'Administración', componente: <Admin /> };
  if (ruta.startsWith('/academia/')) {
    const slug = ruta.slice('/academia/'.length);
    if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return { titulo: 'Curso', componente: <CursoDinamico slug={slug} /> };
  }
  if (ruta.startsWith('/modalidades/')) {
    const slug = ruta.slice('/modalidades/'.length);
    const contenido = [...formatos, ...variantes].find(e => e.slug === slug);
    if (contenido) return { titulo: contenido.titulo, componente: <DetalleModalidad slug={slug} /> };
  }
  if (ruta.startsWith('/guias/')) {
    // Compatibilidad con enlaces anteriores: el contenido básico pasó al curso inicial.
    return { titulo: 'Curso inicial', componente: <Redireccion destino="/modalidades/texas-holdem" /> };
  }
  return { titulo: 'Página no encontrada', componente: <NoEncontrada /> };
}

function Aplicacion() {
  const ruta = useRuta();
  const pagina = seleccionarPagina(ruta);
  useEffect(() => {
    document.title = `${pagina.titulo} | pokerWiki · Aprendizaje de póker`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [ruta, pagina.titulo]);
  return (
    <div className="pagina">
      <div className="barra-lateral" aria-hidden="true" />
      <div className="contenedor">
        <Encabezado />
        <main className="vista-animada" key={ruta} id="contenido-principal">{pagina.componente}</main>
      </div>
      <PiePagina />
    </div>
  );
}

export default function App() {
  return <AuthProvider><Aplicacion /></AuthProvider>;
}
