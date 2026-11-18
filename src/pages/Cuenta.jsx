import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Enlace } from '../lib/navegacion';

export default function Cuenta() {
  const { usuario, perfil, esAdmin, cargando, supabaseConfigurado, ingresar, registrar, salir } = useAuth();
  const [modo, setModo] = useState('ingresar');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  async function enviar(evento) {
    evento.preventDefault(); setError(''); setMensaje(''); setEnviando(true);
    try {
      if (modo === 'ingresar') {
        await ingresar(email.trim(), password);
        setMensaje('Sesión iniciada correctamente.');
      } else {
        const datos = await registrar(email.trim(), password, nombre);
        setMensaje(datos.session ? 'Tu cuenta se creó correctamente.' : 'Revisa tu correo para confirmar el registro antes de entrar.');
      }
      setPassword('');
    } catch (e) { setError(e.message || 'No se pudo completar la operación.'); }
    finally { setEnviando(false); }
  }

  async function cerrarSesion() {
    setError('');
    try { await salir(); setMensaje('Se cerró la sesión.'); }
    catch (e) { setError(e.message); }
  }

  return (
    <div className="sistema-pagina sistema-cuenta">
      <div className="sistema-cabecera"><span className="sistema-kicker">ACCESO A LA COMUNIDAD</span><h1>Tu cuenta</h1><p>Inicia sesión para participar en la comunidad. Los administradores también pueden publicar cursos desde su panel.</p></div>
      {!supabaseConfigurado && <div className="sistema-aviso"><strong>Falta conectar la base de datos.</strong><p>La interfaz ya está preparada, pero el registro real se activa configurando Supabase y ejecutando la migración SQL. Consulta README_SISTEMA.md.</p></div>}
      <div className="sistema-panel sistema-cuenta-panel">
        {cargando ? <p>Comprobando sesión…</p> : usuario ? (
          <>
            <span className="sistema-kicker">SESIÓN ACTIVA</span>
            <h2>Hola, {perfil?.display_name || usuario.email}</h2>
            <p>Tu cuenta es de tipo <strong>{esAdmin ? 'Administrador' : 'Estudiante'}</strong>.</p>
            <div className="sistema-acciones"><Enlace className="sistema-boton" to="/comunidad">Ir a comunidad →</Enlace><Enlace className="sistema-boton-outline" to="/academia">Ver cursos →</Enlace><Enlace className="sistema-boton-outline" to="/mis-cursos">Mis cursos y progreso →</Enlace>{esAdmin && <Enlace className="sistema-boton-outline" to="/admin">Panel de administración →</Enlace>}</div>
            <button className="sistema-enlace-peligro" type="button" onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <div className="sistema-tabs" role="group" aria-label="Tipo de acceso"><button type="button" className={modo === 'ingresar' ? 'activo' : ''} onClick={() => { setModo('ingresar'); setError(''); }}>Ingresar</button><button type="button" className={modo === 'registrar' ? 'activo' : ''} onClick={() => { setModo('registrar'); setError(''); }}>Crear cuenta</button></div>
            <h2>{modo === 'ingresar' ? 'Bienvenido de nuevo' : 'Crea tu cuenta gratuita'}</h2>
            <form onSubmit={enviar} className="sistema-formulario">
              {modo === 'registrar' && <label>Nombre público<input required maxLength={40} value={nombre} onChange={e => setNombre(e.target.value)} autoComplete="nickname" placeholder="Cómo quieres aparecer en la comunidad" /></label>}
              <label>Correo electrónico<input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" placeholder="tu@correo.com" /></label>
              <label>Contraseña<input type="password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} autoComplete={modo === 'ingresar' ? 'current-password' : 'new-password'} placeholder="Mínimo 8 caracteres" /></label>
              <button type="submit" className="sistema-boton" disabled={enviando || !supabaseConfigurado}>{enviando ? 'Procesando…' : modo === 'ingresar' ? 'Iniciar sesión' : 'Registrarme'}</button>
            </form>
            <p className="sistema-ayuda">Tu contraseña la gestiona Supabase Auth. Este proyecto no la guarda en una tabla propia.</p>
          </>
        )}
        {mensaje && <p className="sistema-exito" role="status">{mensaje}</p>}
        {error && <p className="sistema-error" role="alert">{error}</p>}
      </div>
    </div>
  );
}
