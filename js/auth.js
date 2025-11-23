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
        
        // 2. Crear usuario en auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password
        });
        
        if (authError) throw authError;
        
        if (!authData.user) {
            return { error: 'Error al crear la cuenta' };
        }
        
        // 3. Crear perfil de jugador
        const { data: playerData, error: playerError } = await supabase
            .from('players')
            .insert({
                user_id: authData.user.id,
                username: username,
                email: email,
                coins: 0
            })
            .select()
            .single();
        
        if (playerError) {
            // Si falla, eliminar usuario de auth
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw playerError;
        }
        
        return { 
            data: { 
                user: authData.user, 
                player: playerData 
            },
            message: '¡Cuenta creada exitosamente! Revisa tu email para confirmar.'
        };
        
    } catch (error) {
        console.error('Error en registro:', error);
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
        
        if (error) throw error;
        
        // Obtener datos del jugador
        const { data: playerData } = await supabase
            .from('players')
            .select('*')
            .eq('user_id', data.user.id)
            .single();
        
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
