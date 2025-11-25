// Sistema de autenticación con Supabase

// Verificar sesión actual
async function verificarSesion() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        mostrarUsuarioLogueado(session.user);
        return session.user;
    }
    
    return null;
}

// Registro de nuevo usuario
async function registrarUsuario(email, password, username) {
    try {
        // 1. Verificar si el username ya existe
        const { data: existingUser } = await supabase
            .from('players')
            .select('username')
            .eq('username', username)
            .single();
        
        if (existingUser) {
            return { error: 'El nombre de usuario ya está en uso' };
        }
        
        // 2. Crear usuario en auth con metadata
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });
        
        if (authError) throw authError;
        
        if (!authData.user) {
            return { error: 'Error al crear la cuenta' };
        }
        
        // 3. Verificar si necesita confirmación de email
        const needsConfirmation = authData.user.identities && authData.user.identities.length === 0;
        
        if (needsConfirmation) {
            return { 
                data: { user: authData.user },
                message: '¡Cuenta creada! Revisa tu email para confirmar tu cuenta antes de iniciar sesión.',
                needsConfirmation: true
            };
        }
        
        // 4. Si no necesita confirmación, el trigger ya creó el jugador
        // Obtener datos del jugador
        const { data: playerData } = await supabase
            .from('players')
            .select('*')
            .eq('user_id', authData.user.id)
            .single();
        
        return { 
            data: { 
                user: authData.user, 
                player: playerData 
            },
            message: '¡Cuenta creada exitosamente! Ya puedes iniciar sesión.'
        };
        
    } catch (error) {
        console.error('Error en registro:', error);
        
        // Mensaje más claro para error de RLS
        if (error.message && error.message.includes('row-level security')) {
            return { 
                error: 'Error de configuración. Por favor contacta al administrador.',
                details: 'Necesitas desactivar la confirmación de email en Supabase o ejecutar el SQL de arreglo.'
            };
        }
        
        return { error: error.message || 'Error al registrar usuario' };
    }
}

// Inicio de sesión
async function iniciarSesion(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            console.error('Error de autenticación:', error);
            
            // Mensajes más específicos
            if (error.message.includes('Email not confirmed')) {
                return { error: 'Debes confirmar tu email antes de iniciar sesión. Revisa tu correo.' };
            }
            if (error.message.includes('Invalid login credentials')) {
                return { error: 'Email o contraseña incorrectos. Verifica tus datos.' };
            }
            
            throw error;
        }
        
        // Obtener datos del jugador
        const { data: playerData, error: playerError } = await supabase
            .from('players')
            .select('*')
            .eq('user_id', data.user.id)
            .single();
        
        // Si no existe el jugador, crearlo ahora
        if (playerError || !playerData) {
            console.log('Creando perfil de jugador...');
            const { data: newPlayer } = await supabase
                .from('players')
                .insert({
                    user_id: data.user.id,
                    username: data.user.email.split('@')[0],
                    email: data.user.email,
                    coins: 0
                })
                .select()
                .single();
            
            return { 
                data: { 
                    user: data.user, 
                    player: newPlayer 
                } 
            };
        }
        
        return { 
            data: { 
                user: data.user, 
                player: playerData 
            } 
        };
        
    } catch (error) {
        console.error('Error en inicio de sesión:', error);
        return { error: 'Email o contraseña incorrectos' };
    }
}

// Cerrar sesión
async function cerrarSesion() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        ocultarUsuarioLogueado();
        return { success: true };
        
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        return { error: 'Error al cerrar sesión' };
    }
}

// Mostrar usuario logueado en el header
function mostrarUsuarioLogueado(user) {
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');
    
    if (authButtons && userInfo) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        
        // Cargar datos del jugador
        cargarDatosJugador(user.id);
        
        // Mostrar link de historial
        actualizarLinkHistorial(true);
    }
}

// Ocultar usuario logueado
function ocultarUsuarioLogueado() {
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');
    
    if (authButtons && userInfo) {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
    }
    
    // Ocultar link de historial
    actualizarLinkHistorial(false);
    
    // Recargar página
    window.location.reload();
}

// Cargar datos del jugador
async function cargarDatosJugador(userId) {
    try {
        const { data, error } = await supabase
            .from('players')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error) throw error;
        
        // Actualizar UI con datos del jugador
        document.getElementById('usernameDisplay').textContent = data.username;
        document.getElementById('coinsDisplay').textContent = data.coins.toLocaleString();
        
        // Guardar en variable global
        window.jugadorActual = data;
        
    } catch (error) {
        console.error('Error cargando datos del jugador:', error);
    }
}

// Obtener usuario actual
async function obtenerUsuarioActual() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Obtener jugador actual
async function obtenerJugadorActual() {
    const user = await obtenerUsuarioActual();
    
    if (!user) return null;
    
    const { data } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', user.id)
        .single();
    
    return data;
}
