import { useEffect, useState } from 'react';
import { validarImagen } from '../lib/media';

/** Previsualiza un archivo local sin enviarlo al servidor antes de guardar el formulario. */
export default function SelectorImagen({ archivo, onArchivo, actual, onQuitar, id, titulo = 'Imagen (opcional)' }) {
  const [vista, setVista] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (!archivo) { setVista(''); return; }
    const url = URL.createObjectURL(archivo);
    setVista(url);
    return () => URL.revokeObjectURL(url);
  }, [archivo]);

  function cambiar(e) {
    const nuevo = e.target.files?.[0] || null;
    e.target.value = '';
    try {
      validarImagen(nuevo);
      setError('');
      onArchivo(nuevo);
    } catch (err) { setError(err.message); }
  }

  return <div className="sistema-selector-imagen">
    <label htmlFor={id}>{titulo}</label>
    <input id={id} type="file" accept="image/png,image/jpeg,image/webp" onChange={cambiar} />
    <small>Archivo de tu dispositivo · JPG, PNG o WebP · máximo 5 MB. Las imágenes se alojan públicamente en Supabase Storage.</small>
    {(vista || actual) && <div className="sistema-imagen-vista">
      <img src={vista || actual} alt="Vista previa de la imagen que se adjuntará" loading="lazy" />
      {onQuitar && <button type="button" className="sistema-boton-outline" onClick={() => { onArchivo(null); onQuitar(); setError(''); }}>Quitar imagen</button>}
    </div>}
    {error && <p className="sistema-error" role="alert">{error}</p>}
  </div>;
}
