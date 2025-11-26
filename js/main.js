// Variables globales
let productoSeleccionado = null;
let stripe = null;
let cardElement = null;
let metodoPagoActual = 'card';

// Inicialización principal
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando aplicación...');
    
    try {
        // Esperar un momento para asegurar que todo esté cargado
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verificar que productos esté definido
        if (typeof productos === 'undefined') {
            console.error('❌ ERROR: productos no está definido');
            alert('Error: No se pudieron cargar los productos. Recarga la página.');
            return;
        }
        
        console.log('✅ Productos disponibles:', productos.length);
        
        // Cargar productos de paquetes
        cargarProductos();
        
        // Cargar objetos de la tienda
        if (typeof cargarObjetos === 'function') {
            console.log('✅ Cargando objetos de la tienda...');
            cargarObjetos();
        } else {
            console.warn('⚠️ cargarObjetos no está definido');
        }
        
        // Inicializar Stripe
        inicializarStripe();
        
        // Configurar eventos
        configurarEventos();
        
        // Configurar formularios de autenticación
        configurarFormulariosAuth();
        
        // Verificar sesión
        await verificarSesion();
        
        console.log('✅ Aplicación inicializada correctamente');
    } catch (error) {
        console.error('❌ Error inicializando aplicación:', error);
        alert('Error al inicializar la aplicación: ' + error.message);
    }
});

// Cargar productos en el grid
function cargarProductos() {
    console.log('📦 Iniciando carga de productos...');
    
    const grid = document.getElementById('productosGrid');
    
    if (!grid) {
        console.error('❌ No se encontró el elemento productosGrid');
        return;
    }
    
    console.log('✅ Grid encontrado');
    console.log('📦 Total de productos a cargar:', productos.length);
    
    grid.innerHTML = ''; // Limpiar grid antes de cargar
    
    productos.forEach((producto, index) => {
        console.log(`  ${index + 1}. Cargando: ${producto.nombre}`);
        const card = crearCardProducto(producto);
        grid.appendChild(card);
    });
    
    console.log('✅ Productos cargados exitosamente en el DOM');
}

// Crear card de producto
function crearCardProducto(producto) {
    const card = document.createElement('div');
    card.className = `producto-card ${producto.popular ? 'popular' : ''}`;
    
    card.innerHTML = `
        ${producto.popular ? '<span class="badge-popular">POPULAR</span>' : ''}
        <div class="producto-icono">${producto.icono}</div>
        <h3 class="producto-nombre">${producto.nombre}</h3>
        <p class="producto-descripcion">${producto.descripcion}</p>
        <div class="producto-monedas">${producto.monedas.toLocaleString()} 💰</div>
        <div class="producto-precio">$${producto.precio.toFixed(2)} USD</div>
        <button class="btn-comprar" onclick="abrirModalCompra('${producto.id}')">
            COMPRAR AHORA
        </button>
    `;
    
    return card;
}

// Abrir modal de compra
async function abrirModalCompra(productoId) {
    productoSeleccionado = productos.find(p => p.id === productoId);
    
    if (!productoSeleccionado) return;
    
    // Verificar si el usuario está logueado
    const usuario = await obtenerUsuarioActual();
    const emailGroup = document.getElementById('emailGroup');
    const loggedUserMessage = document.getElementById('loggedUserMessage');
    const emailInput = document.getElementById('emailJugador');
    
    if (usuario) {
        // Usuario logueado: ocultar campo de email
        const jugador = await obtenerJugadorActual();
        emailGroup.style.display = 'none';
        loggedUserMessage.style.display = 'block';
        document.getElementById('buyingAsUsername').textContent = jugador.username;
        emailInput.removeAttribute('required');
    } else {
        // Usuario no logueado: mostrar campo de email
        emailGroup.style.display = 'block';
        loggedUserMessage.style.display = 'none';
        emailInput.setAttribute('required', 'required');
    }
    
    // Mostrar información del producto
    const productoInfo = document.getElementById('productoSeleccionado');
    productoInfo.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 10px;">${productoSeleccionado.icono}</div>
        <h3 style="color: var(--color-primary); margin-bottom: 5px;">${productoSeleccionado.nombre}</h3>
        <p style="color: var(--color-secondary); font-size: 24px; font-weight: 900;">
            ${productoSeleccionado.monedas.toLocaleString()} Monedas
        </p>
        <p style="font-size: 28px; font-weight: 900; margin-top: 10px;">
            $${productoSeleccionado.precio.toFixed(2)} USD
        </p>
    `;
    
    // Mostrar modal
    document.getElementById('modalCompra').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modalCompra').classList.remove('active');
    document.body.style.overflow = '';
    limpiarFormulario();
}

// Cerrar modal de éxito
function cerrarModalExito() {
    document.getElementById('modalExito').classList.remove('active');
    document.body.style.overflow = '';
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('formCompra').reset();
    document.getElementById('emailError').classList.remove('active');
    if (cardElement) {
        cardElement.clear();
    }
}

// Inicializar Stripe
async function inicializarStripe() {
    try {
        // Nota: Reemplaza con tu clave pública real de Stripe
        // stripe = Stripe(STRIPE_PUBLIC_KEY);
        
        // Por ahora, simulamos Stripe para desarrollo
        console.log('Stripe inicializado (modo demo)');
    } catch (error) {
        console.error('Error inicializando Stripe:', error);
    }
}

// Configurar eventos
function configurarEventos() {
    // Métodos de pago
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            metodoPagoActual = method.dataset.method;
            
            // Mostrar/ocultar secciones de pago
            document.getElementById('cardPayment').style.display = 'none';
            document.getElementById('paypalPayment').style.display = 'none';
            document.getElementById('mercadopagoPayment').style.display = 'none';
            
            if (metodoPagoActual === 'card') {
                document.getElementById('cardPayment').style.display = 'block';
            } else if (metodoPagoActual === 'paypal') {
                document.getElementById('paypalPayment').style.display = 'block';
            } else if (metodoPagoActual === 'mercadopago') {
                document.getElementById('mercadopagoPayment').style.display = 'block';
            }
        });
    });
    
    // Formatear número de tarjeta
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Formatear fecha de expiración
    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // Solo números en CVV
    const cardCvv = document.getElementById('cardCvv');
    if (cardCvv) {
        cardCvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    // Formulario de compra
    document.getElementById('formCompra').addEventListener('submit', procesarCompra);
}

// Procesar compra
async function procesarCompra(e) {
    e.preventDefault();
    
    // Verificar si el usuario está logueado
    const usuarioActual = await obtenerUsuarioActual();
    
    if (usuarioActual) {
        // Usuario logueado: usar su cuenta directamente
        await procesarCompraLogueado();
    } else {
        // Usuario no logueado: usar email manual
        await procesarCompraSinLogin();
    }
}

// Procesar compra sin login (método original)
async function procesarCompraSinLogin() {
    const email = document.getElementById('emailJugador').value.trim();
    const submitButton = document.getElementById('submitButton');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');
    const cardErrors = document.getElementById('card-errors');
    
    // Validar email
    if (!validarEmail(email)) {
        mostrarError('emailError', 'Por favor ingresa un email válido');
        return;
    }
    
    // Validar datos de pago si es tarjeta
    if (metodoPagoActual === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCvv = document.getElementById('cardCvv').value;
        
        const validacion = validarDatosTarjeta(cardNumber, cardCvv, cardExpiry);
        if (!validacion.valid) {
            cardErrors.textContent = validacion.error;
            cardErrors.classList.add('active');
            return;
        }
        cardErrors.classList.remove('active');
    }
    
    // Deshabilitar botón
    submitButton.disabled = true;
    buttonText.textContent = 'PROCESANDO...';
    buttonLoader.style.display = 'inline-block';
    
    try {
        // 1. Buscar jugador
        const jugador = await buscarJugadorPorEmail(email);
        
        if (jugador.error) {
            mostrarError('emailError', jugador.error);
            return;
        }
        
        // 2. Procesar pago
        const resultadoPago = await procesarPago(metodoPagoActual, productoSeleccionado, jugador.data);
        
        if (!resultadoPago.success) {
            throw new Error(resultadoPago.error || 'Error al procesar el pago');
        }
        
        // 3. Actualizar monedas
        const resultado = await actualizarMonedas(email, productoSeleccionado.monedas);
        
        if (resultado.error) {
            throw new Error(resultado.error);
        }
        
        // 4. Registrar transacción
        await registrarTransaccion(
            jugador.data.user_id,
            productoSeleccionado,
            resultadoPago.method,
            resultadoPago.paymentId,
            'completed'
        );
        
        // 5. Mostrar éxito
        mostrarExito(resultado.data);
        cerrarModal();
        
    } catch (error) {
        console.error('Error en la compra:', error);
        alert('❌ ' + error.message);
    } finally {
        // Rehabilitar botón
        submitButton.disabled = false;
        buttonText.textContent = 'CONFIRMAR COMPRA';
        buttonLoader.style.display = 'none';
    }
}

// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Mostrar error
function mostrarError(elementId, mensaje) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = mensaje;
    errorElement.classList.add('active');
    
    setTimeout(() => {
        errorElement.classList.remove('active');
    }, 5000);
}

// Simular pago (para desarrollo)
function simularPago() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('Pago procesado exitosamente (simulado)');
            resolve();
        }, 1500);
    });
}

// Mostrar modal de éxito
function mostrarExito(datos) {
    const successMessage = document.getElementById('successMessage');
    successMessage.innerHTML = `
        <p style="margin: 20px 0; font-size: 18px;">
            Se han agregado <strong style="color: var(--color-primary);">
            ${datos.monedasAgregadas.toLocaleString()} monedas</strong> a tu cuenta.
        </p>
        <p style="color: var(--color-text-dim);">
            Nuevo saldo: <strong style="color: var(--color-secondary);">
            ${datos.coins.toLocaleString()} monedas</strong>
        </p>
        <p style="margin-top: 20px; font-size: 14px; color: var(--color-text-dim);">
            Las monedas están disponibles en tu cuenta del juego.
        </p>
    `;
    
    document.getElementById('modalExito').classList.add('active');
}

// Menu toggle para móvil
document.getElementById('menuToggle')?.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});


// ========== FUNCIONES DE AUTENTICACIÓN ==========

// Abrir modal de login
function abrirModalLogin() {
    document.getElementById('modalLogin').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar modal de login
function cerrarModalLogin() {
    document.getElementById('modalLogin').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('formLogin').reset();
    document.getElementById('loginError').classList.remove('active');
}

// Abrir modal de registro
function abrirModalRegistro() {
    document.getElementById('modalRegistro').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar modal de registro
function cerrarModalRegistro() {
    document.getElementById('modalRegistro').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('formRegistro').reset();
    document.getElementById('registerError').classList.remove('active');
}

// Configurar formularios de autenticación
function configurarFormulariosAuth() {
    // Manejar login
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const button = document.getElementById('loginButton');
    const buttonText = button.querySelector('.button-text');
    const buttonLoader = button.querySelector('.button-loader');
    const errorDiv = document.getElementById('loginError');
    
    // Deshabilitar botón
    button.disabled = true;
    buttonText.style.display = 'none';
    buttonLoader.style.display = 'inline-block';
    errorDiv.classList.remove('active');
    
    try {
        const resultado = await iniciarSesion(email, password);
        
        if (resultado.error) {
            errorDiv.textContent = resultado.error;
            errorDiv.classList.add('active');
            return;
        }
        
        // Éxito
        cerrarModalLogin();
        mostrarUsuarioLogueado(resultado.data.user);
        
        // Mostrar mensaje de bienvenida
        alert(`¡Bienvenido ${resultado.data.player.username}! Tienes ${resultado.data.player.coins} monedas.`);
        
    } catch (error) {
        errorDiv.textContent = 'Error al iniciar sesión';
        errorDiv.classList.add('active');
    } finally {
        button.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoader.style.display = 'none';
    }
        });
    }

    // Manejar registro
    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const button = document.getElementById('registerButton');
    const buttonText = button.querySelector('.button-text');
    const buttonLoader = button.querySelector('.button-loader');
    const errorDiv = document.getElementById('registerError');
    
    // Validar contraseñas
    if (password !== passwordConfirm) {
        errorDiv.textContent = 'Las contraseñas no coinciden';
        errorDiv.classList.add('active');
        return;
    }
    
    if (password.length < 6) {
        errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
        errorDiv.classList.add('active');
        return;
    }
    
    // Deshabilitar botón
    button.disabled = true;
    buttonText.style.display = 'none';
    buttonLoader.style.display = 'inline-block';
    errorDiv.classList.remove('active');
    
    try {
        const resultado = await registrarUsuario(email, password, username);
        
        if (resultado.error) {
            errorDiv.textContent = resultado.error;
            errorDiv.classList.add('active');
            return;
        }
        
        // Éxito
        cerrarModalRegistro();
        
        // Si no necesita confirmación, iniciar sesión automáticamente
        if (!resultado.needsConfirmation) {
            alert('¡Cuenta creada! Iniciando sesión...');
            
            // Iniciar sesión automáticamente
            setTimeout(async () => {
                const loginResult = await iniciarSesion(email, password);
                if (loginResult.data) {
                    mostrarUsuarioLogueado(loginResult.data.user);
                    alert(`¡Bienvenido ${loginResult.data.player.username}! Tienes ${loginResult.data.player.coins} monedas.`);
                } else {
                    // Si falla el auto-login, mostrar modal de login
                    abrirModalLogin();
                }
            }, 500);
        } else {
            alert(resultado.message || '¡Cuenta creada! Revisa tu email para confirmar.');
            setTimeout(() => {
                abrirModalLogin();
            }, 500);
        }
        
    } catch (error) {
        errorDiv.textContent = 'Error al crear la cuenta';
        errorDiv.classList.add('active');
    } finally {
        button.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoader.style.display = 'none';
    }
        });
    }
}

// Manejar logout
async function handleLogout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        const resultado = await cerrarSesion();
        
        if (resultado.success) {
            alert('Sesión cerrada exitosamente');
        }
    }
}



// Modificar la función de procesar compra para usar el usuario logueado
async function procesarCompraLogueado() {
    const jugador = await obtenerJugadorActual();
    
    if (!jugador) {
        alert('Debes iniciar sesión para comprar monedas');
        abrirModalLogin();
        return;
    }
    
    const submitButton = document.getElementById('submitButton');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');
    const cardErrors = document.getElementById('card-errors');
    
    // Validar datos de pago si es tarjeta
    if (metodoPagoActual === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCvv = document.getElementById('cardCvv').value;
        
        const validacion = validarDatosTarjeta(cardNumber, cardCvv, cardExpiry);
        if (!validacion.valid) {
            cardErrors.textContent = validacion.error;
            cardErrors.classList.add('active');
            return;
        }
        cardErrors.classList.remove('active');
    }
    
    // Deshabilitar botón
    submitButton.disabled = true;
    buttonText.textContent = 'PROCESANDO...';
    buttonLoader.style.display = 'inline-block';
    
    try {
        // Procesar pago con la pasarela simulada
        const resultadoPago = await procesarPago(metodoPagoActual, productoSeleccionado, jugador);
        
        if (!resultadoPago.success) {
            throw new Error(resultadoPago.error || 'Error al procesar el pago');
        }
        
        // Actualizar monedas
        const resultado = await actualizarMonedas(jugador.email, productoSeleccionado.monedas);
        
        if (resultado.error) {
            throw new Error(resultado.error);
        }
        
        // Registrar transacción
        await registrarTransaccion(
            jugador.user_id,
            productoSeleccionado,
            resultadoPago.method,
            resultadoPago.paymentId,
            'completed'
        );
        
        // Actualizar UI
        await cargarDatosJugador(jugador.user_id);
        
        // Mostrar éxito
        mostrarExito(resultado.data);
        cerrarModal();
        
    } catch (error) {
        console.error('Error en la compra:', error);
        alert('❌ ' + error.message);
    } finally {
        submitButton.disabled = false;
        buttonText.textContent = 'CONFIRMAR COMPRA';
        buttonLoader.style.display = 'none';
    }
}


// ========== FUNCIONES DE HISTORIAL ==========

// Abrir modal de historial
async function abrirHistorial() {
    const usuario = await obtenerUsuarioActual();
    
    if (!usuario) {
        alert('Debes iniciar sesión para ver tu historial');
        abrirModalLogin();
        return;
    }
    
    document.getElementById('modalHistorial').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Cargar historial
    await renderizarHistorial(usuario.id);
}

// Cerrar modal de historial
function cerrarHistorial() {
    document.getElementById('modalHistorial').classList.remove('active');
    document.body.style.overflow = '';
}

// Mostrar/ocultar link de historial según login
function actualizarLinkHistorial(mostrar) {
    const historialLink = document.getElementById('historialLink');
    if (historialLink) {
        historialLink.style.display = mostrar ? 'block' : 'none';
    }
}
