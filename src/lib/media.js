import { supabase } from './supabase';

export const MAX_IMAGEN_BYTES = 5 * 1024 * 1024;
const TIPOS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function validarImagen(archivo) {
  if (!archivo) return;
  if (!(archivo.type in TIPOS)) {
    throw new Error('Selecciona un JPG, PNG o WebP. No se aceptan SVG ni GIF.');
  }
  if (archivo.size === 0 || archivo.size > MAX_IMAGEN_BYTES) {
    throw new Error('La imagen debe pesar como máximo 5 MB y no estar vacía.');
  }
}

/**
 * Sube al bucket público con nombre único, sin sobreescribir archivos anteriores.
 * No almacenar imágenes en Base64 dentro de PostgreSQL.
 */
export async function subirImagen(archivo, { bucket, carpeta }) {
  if (!archivo || !supabase) return null;
  validarImagen(archivo);
  if (!['course-media', 'community-media'].includes(bucket)) throw new Error('Bucket no permitido.');
  if (!/^[a-z0-9-]+$/.test(carpeta)) throw new Error('Carpeta de imagen inválida.');
  const ruta = `${carpeta}/${crypto.randomUUID()}.${TIPOS[archivo.type]}`;
  const { error } = await supabase.storage.from(bucket).upload(ruta, archivo, {
    cacheControl: '3600', upsert: false, contentType: archivo.type,
  });
  if (error) throw new Error(`No se pudo subir la imagen: ${error.message}`);
  const { data } = supabase.storage.from(bucket).getPublicUrl(ruta);
  return { bucket, ruta, url: data.publicUrl };
}

/** Solo elimina URLs que correspondan a los buckets administrados por la aplicación. */
export function identificarObjeto(url, bucket) {
  if (!url || !supabase) return null;
  const base = supabase.storage.from(bucket).getPublicUrl('');
  const prefijo = base.data.publicUrl.replace(/\/$/, '') + '/';
  if (!url.startsWith(prefijo)) return null;
  let ruta;
  try { ruta = decodeURIComponent(url.slice(prefijo.length).split('?')[0]); }
  catch { return null; }
  if (!/^(?:covers|lessons|[0-9a-f-]{36})\/[a-z0-9-]+\.(?:jpg|png|webp)$/i.test(ruta)) return null;
  return { bucket, ruta };
}

export async function eliminarObjeto(objeto) {
  if (!objeto || !supabase) return;
  const { error } = await supabase.storage.from(objeto.bucket).remove([objeto.ruta]);
  if (error) throw error;
}
