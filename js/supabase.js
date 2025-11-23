// Configuración de Supabase
const SUPABASE_URL = 'https://xcvrjpyuhqqsqlltuuai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjdnJqcHl1aHFxc3FsbHR1dWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDg2NDUsImV4cCI6MjA3OTQ4NDY0NX0.chupqonmwwKw63utwJ703SCXLahdRopUvgzrxoLRiYk';

// Inicializar cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Buscar jugador por email
async function buscarJugadorPorEmail(email) {
    try {
        const { data, error } = await supabase
            .from('players')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return { error: 'Email no encontrado. Regístrate en el juego primero.' };
            }
            throw error;
        }

        return { data };
    } catch (error) {
        console.error('Error buscando jugador:', error);
        return { error: 'Error al buscar el jugador. Intenta de nuevo.' };
    }
}

// Actualizar monedas del jugador
async function actualizarMonedas(email, monedasAAgregar) {
    try {
        const jugador = await buscarJugadorPorEmail(email);
        
        if (jugador.error) {
            return { error: jugador.error };
        }

        const nuevasMonedas = jugador.data.coins + monedasAAgregar;

        const { data, error } = await supabase
            .from('players')
            .update({ 
                coins: nuevasMonedas,
                updated_at: new Date().toISOString()
            })
            .eq('email', email)
            .select();

        if (error) throw error;

        return { data: { ...data[0], monedasAgregadas: monedasAAgregar } };
    } catch (error) {
        console.error('Error actualizando monedas:', error);
        return { error: 'Error al actualizar las monedas. Intenta de nuevo.' };
    }
}

// Registrar transacción
async function registrarTransaccion(userId, producto, metodoPago, estado = 'completed') {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: userId,
                product_id: producto.id,
                product_name: producto.nombre,
                amount: producto.precio,
                currency: 'USD',
                status: estado,
                payment_method: metodoPago
            })
            .select();

        if (error) throw error;

        return { data: data[0] };
    } catch (error) {
        console.error('Error registrando transacción:', error);
        return { error: 'Error al registrar la transacción.' };
    }
}
