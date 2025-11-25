// Sistema de Historial de Compras

// Obtener historial de transacciones del usuario
async function obtenerHistorialCompras(userId, limite = 50) {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limite);
        
        if (error) throw error;
        
        return { data };
        
    } catch (error) {
        console.error('Error obteniendo historial:', error);
        return { error: 'Error al cargar el historial de compras' };
    }
}

// Obtener estadísticas de compras del usuario
async function obtenerEstadisticasCompras(userId) {
    try {
        const { data, error } = await supabase
            .from('transactions')
            .select('amount, coins_amount, status')
            .eq('user_id', userId)
            .eq('status', 'completed');
        
        if (error) throw error;
        
        const totalGastado = data.reduce((sum, t) => sum + parseFloat(t.amount), 0);
        // Calcular monedas desde el producto si coins_amount no existe
        const totalMonedas = data.reduce((sum, t) => {
            if (t.coins_amount) {
                return sum + t.coins_amount;
            }
            // Buscar el producto para obtener las monedas
            const producto = productos.find(p => p.id === t.product_id);
            return sum + (producto ? producto.monedas : 0);
        }, 0);
        const totalCompras = data.length;
        
        return {
            data: {
                totalGastado: totalGastado.toFixed(2),
                totalMonedas,
                totalCompras
            }
        };
        
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        return { error: 'Error al cargar estadísticas' };
    }
}

// Formatear fecha para mostrar
function formatearFecha(fecha) {
    const date = new Date(fecha);
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', opciones);
}

// Obtener color según estado
function obtenerColorEstado(estado) {
    const colores = {
        'completed': 'var(--color-primary)',
        'pending': 'var(--color-secondary)',
        'failed': 'var(--color-error)',
        'refunded': '#FFA500'
    };
    return colores[estado] || 'var(--color-text-dim)';
}

// Obtener texto según estado
function obtenerTextoEstado(estado) {
    const textos = {
        'completed': 'Completado',
        'pending': 'Pendiente',
        'failed': 'Fallido',
        'refunded': 'Reembolsado'
    };
    return textos[estado] || estado;
}

// Renderizar historial en el modal
async function renderizarHistorial(userId) {
    const historialContainer = document.getElementById('historialContainer');
    const statsContainer = document.getElementById('statsContainer');
    
    // Mostrar loading
    historialContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-dim);">Cargando historial...</p>';
    
    try {
        // Obtener historial y estadísticas
        const [historial, estadisticas] = await Promise.all([
            obtenerHistorialCompras(userId),
            obtenerEstadisticasCompras(userId)
        ]);
        
        if (historial.error) {
            historialContainer.innerHTML = `<p style="color: var(--color-error);">${historial.error}</p>`;
            return;
        }
        
        // Renderizar estadísticas
        if (estadisticas.data) {
            statsContainer.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-value">${estadisticas.data.totalMonedas.toLocaleString()}</div>
                        <div class="stat-label">Monedas Compradas</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💵</div>
                        <div class="stat-value">$${estadisticas.data.totalGastado}</div>
                        <div class="stat-label">Total Gastado</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🛒</div>
                        <div class="stat-value">${estadisticas.data.totalCompras}</div>
                        <div class="stat-label">Compras Realizadas</div>
                    </div>
                </div>
            `;
        }
        
        // Renderizar historial
        if (historial.data.length === 0) {
            historialContainer.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div style="font-size: 60px; margin-bottom: 20px;">🛍️</div>
                    <p style="color: var(--color-text-dim);">No tienes compras aún</p>
                    <p style="color: var(--color-text-dim); font-size: 14px;">¡Compra tu primer paquete de monedas!</p>
                </div>
            `;
            return;
        }
        
        let html = '<div class="historial-list">';
        
        historial.data.forEach(transaccion => {
            const colorEstado = obtenerColorEstado(transaccion.status);
            const textoEstado = obtenerTextoEstado(transaccion.status);
            
            // Obtener monedas del producto si no está en la transacción
            let monedas = transaccion.coins_amount;
            if (!monedas) {
                const producto = productos.find(p => p.id === transaccion.product_id);
                monedas = producto ? producto.monedas : 0;
            }
            
            html += `
                <div class="historial-item">
                    <div class="historial-header">
                        <div class="historial-producto">
                            <span class="historial-icono">${obtenerIconoProducto(transaccion.product_id)}</span>
                            <div>
                                <div class="historial-nombre">${transaccion.product_name}</div>
                                <div class="historial-fecha">${formatearFecha(transaccion.created_at)}</div>
                            </div>
                        </div>
                        <div class="historial-monto">
                            <div class="historial-precio">$${parseFloat(transaccion.amount).toFixed(2)}</div>
                            <div class="historial-monedas">+${monedas.toLocaleString()} 💰</div>
                        </div>
                    </div>
                    <div class="historial-footer">
                        <span class="historial-metodo">
                            ${obtenerIconoMetodo(transaccion.payment_method)} ${transaccion.payment_method.toUpperCase()}
                        </span>
                        <span class="historial-estado" style="color: ${colorEstado};">
                            ${textoEstado}
                        </span>
                        ${transaccion.payment_id ? `<span class="historial-id">ID: ${transaccion.payment_id}</span>` : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        historialContainer.innerHTML = html;
        
    } catch (error) {
        console.error('Error renderizando historial:', error);
        historialContainer.innerHTML = '<p style="color: var(--color-error);">Error al cargar el historial</p>';
    }
}

// Obtener icono según producto
function obtenerIconoProducto(productId) {
    const producto = productos.find(p => p.id === productId);
    return producto ? producto.icono : '💰';
}

// Obtener icono según método de pago
function obtenerIconoMetodo(metodo) {
    const iconos = {
        'card': '💳',
        'stripe': '💳',
        'paypal': '🅿️',
        'mercadopago': '💙'
    };
    return iconos[metodo] || '💳';
}
