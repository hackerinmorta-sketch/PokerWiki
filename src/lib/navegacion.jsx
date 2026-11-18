import { useEffect, useState } from 'react';

// Router pequeño para esta primera entrega. Utiliza la API History del navegador.
// No requiere instalar paquetes adicionales. Cuando el sitio crezca, puede
// sustituirse por React Router sin cambiar los contenidos de las páginas.
function rutaActual() {
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

export function useRuta() {
  const [ruta, setRuta] = useState(rutaActual);
  useEffect(() => {
    const actualizar = () => setRuta(rutaActual());
    window.addEventListener('popstate', actualizar);
    return () => window.removeEventListener('popstate', actualizar);
  }, []);
  return ruta;
}

export function navegar(destino) {
  if (rutaActual() !== destino) {
    window.history.pushState({}, '', destino);
    window.dispatchEvent(new PopStateEvent('popstate'));
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function Enlace({ to, children, onClick, ...props }) {
  function ir(evento) {
    if (onClick) onClick(evento);
    if (evento.defaultPrevented || evento.button !== 0 || evento.metaKey ||
      evento.ctrlKey || evento.shiftKey || evento.altKey || props.target === '_blank') return;
    evento.preventDefault();
    navegar(to);
  }
  return <a href={to} onClick={ir} {...props}>{children}</a>;
}
