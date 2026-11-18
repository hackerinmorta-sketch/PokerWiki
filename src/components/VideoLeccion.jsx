import { useState } from 'react';
import { urlEmbedSegura, urlYouTube } from '../lib/video';

// El iframe no se añade hasta que el estudiante lo solicite.
// Así evitamos peticiones al proveedor de video al abrir una lección.
export default function VideoLeccion({ videoId, titulo, descripcion }) {
  const [activado, setActivado] = useState(false);
  const embed = urlEmbedSegura(videoId);
  if (!embed) return null;
  return (
    <section className="pw-video-leccion" aria-label={`Video complementario de ${titulo}`}>
      <div className="pw-video-cabecera">
        <span className="sistema-kicker">VIDEO DE LA LECCIÓN</span>
        <h3>{titulo}</h3>
        {descripcion && <p>{descripcion}</p>}
      </div>
      {activado ? (
        <div className="pw-video-reproductor">
          <iframe
            src={embed}
            title={`Video educativo: ${titulo}`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="pw-video-placeholder">
          <div className="pw-video-icono" aria-hidden="true">▶</div>
          <strong>Video complementario disponible</strong>
          <p>Al abrirlo se conectará con YouTube, que puede tratar datos técnicos de reproducción.</p>
          <button type="button" className="sistema-boton" onClick={() => setActivado(true)}>
            ▶ Mostrar video
          </button>
        </div>
      )}
      <div className="pw-video-opciones">
        {activado && <button type="button" className="pw-video-cerrar" onClick={() => setActivado(false)}>Ocultar reproductor</button>}
        <a href={urlYouTube(videoId)} target="_blank" rel="noopener noreferrer">Abrir en YouTube ↗</a>
      </div>
      <small>El video es material complementario. Se puede marcar la lección como leída sin reproducirlo.</small>
    </section>
  );
}
