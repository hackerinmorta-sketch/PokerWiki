import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, supabaseConfigurado } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [iniciando, setIniciando] = useState(supabaseConfigurado);
  const [cargandoPerfil, setCargandoPerfil] = useState(false);

  useEffect(() => {
    if (!supabase) return undefined;
    let vigente = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!vigente) return;
      if (error) console.error('Error al recuperar la sesión:', error.message);
      setSesion(data?.session || null);
      setIniciando(false);
    }).catch(() => {
      if (vigente) setIniciando(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evento, siguiente) => {
      if (vigente) {
        setSesion(siguiente);
        setIniciando(false);
      }
    });
    return () => { vigente = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!supabase || !sesion?.user?.id) {
      setPerfil(null);
      setCargandoPerfil(false);
      return;
    }
    let vigente = true;
    setCargandoPerfil(true);
    supabase.from('profiles').select('id,display_name,role').eq('id', sesion.user.id).single()
      .then(({ data, error }) => {
        if (!vigente) return;
        if (error) console.error('No se pudo cargar el perfil:', error.message);
        setPerfil(data || null);
        setCargandoPerfil(false);
      }).catch(() => { if (vigente) { setPerfil(null); setCargandoPerfil(false); } });
    return () => { vigente = false; };
  }, [sesion?.user?.id]);

  const value = useMemo(() => ({
    supabaseConfigurado,
    usuario: sesion?.user || null,
    perfil,
    esAdmin: Boolean(perfil?.role === 'admin'),
    cargando: iniciando || cargandoPerfil,
    async ingresar(email, password) {
      if (!supabase) throw new Error('Configura Supabase antes de iniciar sesión.');
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    async registrar(email, password, nombre) {
      if (!supabase) throw new Error('Configura Supabase antes de registrar usuarios.');
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { display_name: nombre.trim().slice(0, 40) } },
      });
      if (error) throw error;
      return data;
    },
    async salir() {
      if (!supabase) return;
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setPerfil(null);
    },
  }), [sesion, perfil, iniciando, cargandoPerfil]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth necesita AuthProvider.');
  return contexto;
}
