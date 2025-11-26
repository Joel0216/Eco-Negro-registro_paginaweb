// Sistema de Pasarela de Pago con Stripe

// Configuración de Stripe
const STRIPE_PUBLIC_KEY = 'pk_test_51SXVlNRaJEwIqKbp8DVnD5Ht8jI2iV5vVpVPYhlIcwx7faCwpDBqUiYIbyax8WaL3x4nhgSt8OujujNZQkhmNQ5300uy8QzliY';

// Procesar pago con tarjeta usando Stripe
async function procesarPagoTarjeta(producto, datosUsuario) {
    return new Promise((resolve, reject) => {
        // Por ahora simulamos el pago ya que necesitamos un backend para Stripe
        // En producción, aquí se haría la llamada a tu backend que procesa con Stripe
        setTimeout(() => {
            const exito = Math.random() > 0.05;
            
            if (exito) {
                resolve({
                    success: true,
                    paymentId: 'PAY-' + generarIdAleatorio(),
                    method: 'card',
                    amount: producto.precio,
                    timestamp: new Date().toISOString()
                });
            } else {
                reject({
                    success: false,
                    error: 'Pago rechazado. Verifica los datos de tu tarjeta.'
                });
            }
        }, 2000);
    });
}

// Simular procesamiento de pago con PayPal
async function procesarPagoPayPal(producto, datosUsuario) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const exito = Math.random() > 0.05;
            
            if (exito) {
                resolve({
                    success: true,
                    paymentId: 'PAYPAL-' + generarIdAleatorio(),
                    method: 'paypal',
                    amount: producto.precio,
                    timestamp: new Date().toISOString()
                });
            } else {
                reject({
                    success: false,
                    error: 'Pago de PayPal cancelado o rechazado.'
                });
            }
        }, 1500);
    });
}

// Simular procesamiento de pago con Mercado Pago
async function procesarPagoMercadoPago(producto, datosUsuario) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const exito = Math.random() > 0.05;
            
            if (exito) {
                resolve({
                    success: true,
                    paymentId: 'MP-' + generarIdAleatorio(),
                    method: 'mercadopago',
                    amount: producto.precio,
                    timestamp: new Date().toISOString()
                });
            } else {
                reject({
                    success: false,
                    error: 'Pago de Mercado Pago rechazado.'
                });
            }
        }, 1800);
    });
}

// Generar ID aleatorio para transacciones
function generarIdAleatorio() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

// Procesar pago según el método seleccionado
async function procesarPago(metodoPago, producto, datosUsuario) {
    try {
        let resultado;
        
        switch(metodoPago) {
            case 'stripe':
            case 'card':
                resultado = await procesarPagoTarjeta(producto, datosUsuario);
                break;
            case 'paypal':
                resultado = await procesarPagoPayPal(producto, datosUsuario);
                break;
            case 'mercadopago':
                resultado = await procesarPagoMercadoPago(producto, datosUsuario);
                break;
            default:
                throw new Error('Método de pago no válido');
        }
        
        return resultado;
        
    } catch (error) {
        console.error('Error procesando pago:', error);
        throw error;
    }
}

// Validar datos de tarjeta (simulado)
function validarDatosTarjeta(numeroTarjeta, cvv, expiracion) {
    // Validación básica simulada
    if (!numeroTarjeta || numeroTarjeta.length < 13) {
        return { valid: false, error: 'Número de tarjeta inválido' };
    }
    
    if (!cvv || cvv.length < 3) {
        return { valid: false, error: 'CVV inválido' };
    }
    
    if (!expiracion || expiracion.length < 5) {
        return { valid: false, error: 'Fecha de expiración inválida' };
    }
    
    return { valid: true };
}

// Formatear número de tarjeta
function formatearNumeroTarjeta(numero) {
    return numero.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
}

// Detectar tipo de tarjeta
function detectarTipoTarjeta(numero) {
    const primerDigito = numero.charAt(0);
    
    if (primerDigito === '4') return 'Visa';
    if (primerDigito === '5') return 'Mastercard';
    if (primerDigito === '3') return 'American Express';
    
    return 'Desconocida';
}
