// Solo IDs de YouTube permiten generar una URL de inserción.
// Nunca insertamos iframes ni HTML proporcionado por administradores o usuarios.
const ID_VALIDO = /^[a-zA-Z0-9_-]{11}$/;
const DOMINIOS_YOUTUBE = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com']);
const DOMINIOS_EMBED = new Set(['youtube-nocookie.com', 'www.youtube-nocookie.com']);
const DOMINIOS_CORTOS = new Set(['youtu.be', 'www.youtu.be']);

export function extraerIdYouTube(valor) {
  if (typeof valor !== 'string') return null;
  const texto = valor.trim();
  if (ID_VALIDO.test(texto)) return texto;
  let url;
  try { url = new URL(texto); } catch { return null; }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
  const host = url.hostname.toLowerCase();
  const segmentos = url.pathname.split('/').filter(Boolean);
  let id = null;
  if (DOMINIOS_CORTOS.has(host) && segmentos.length === 1) {
    id = segmentos[0];
  } else if (DOMINIOS_YOUTUBE.has(host)) {
    if (url.pathname === '/watch') id = url.searchParams.get('v');
    else if (['embed', 'shorts', 'live'].includes(segmentos[0]) && segmentos.length === 2) id = segmentos[1];
  } else if (DOMINIOS_EMBED.has(host)) {
    if (segmentos[0] === 'embed' && segmentos.length === 2) id = segmentos[1];
  }
  return id && ID_VALIDO.test(id) ? id : null;
}

export function urlEmbedSegura(id) {
  if (!ID_VALIDO.test(id || '')) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1`;
}

export function urlYouTube(id) {
  if (!ID_VALIDO.test(id || '')) return null;
  return `https://www.youtube.com/watch?v=${id}`;
}
