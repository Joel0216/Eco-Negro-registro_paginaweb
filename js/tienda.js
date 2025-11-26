// Sistema de Tienda de Objetos

let objetoSeleccionado = null;

// Cargar objetos en la tienda
function cargarObjetos() {
    console.log('🎮 Iniciando carga de objetos...');
    
    const grid = document.getElementById('objetosGrid');
    
    if (!grid) {
        console.warn('⚠️ No se encontró el elemento objetosGrid');
        return;
    }
    
    console.log('✅ Grid de objetos encontrado');
    console.log('🎮 Total de objetos a cargar:', objetos.length);
    
    grid.innerHTML = '';
    
    objetos.forEach((objeto, index) => {
        console.log(`  ${index + 1}. Cargando: ${objeto.nombre}`);
        const card = crearCardObjeto(objeto);
        grid.appendChild(card);
    });
    
    console.log('✅ Objetos cargados exitosamente en el DOM');
}

// Crear card de objeto
function crearCardObjeto(objeto) {
    const card = document.createElement('div');
    card.className = 'objeto-card';
    card.onclick = () => abrirModalObjeto(objeto.id);
    
    card.innerHTML = `
        <img src="${objeto.imagen}" alt="${objeto.nombre}" class="objeto-imagen" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22250%22%3E%3Crect fill=%22%231A1F3A%22 width=%22300%22 height=%22250%22/%3E%3Ctext fill=%22%2300FF41%22 font-family=%22Arial%22 font-size=%2224%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E${objeto.nombre}%3C/text%3E%3C/svg%3E'">
        <div class="objeto-info-card">
            <h3 class="objeto-nombre-card">${objeto.nombre}</h3>
            <p class="objeto-descripcion">${objeto.descripcion}</p>
            <div class="objeto-precio-card">
                <span>${objeto.precio}</span>
                <span class="objeto-precio-icono">💰</span>
            </div>
        </div>
    `;
    
    return card;
}

// Abrir modal de objeto
async function abrirModalObjeto(objetoId) {
    const usuario = await obtenerUsuarioActual();
    
    if (!usuario) {
        alert('Debes iniciar sesión para comprar objetos');
        abrirModalLogin();
        return;
    }
    
    objetoSeleccionado = objetos.find(o => o.id === objetoId);
    
    if (!objetoSeleccionado) return;
    
    // Obtener jugador actual
    const jugador = await obtenerJugadorActual();
    
    // Configurar modal
    document.getElementById('objetoNombre').textContent = objetoSeleccionado.nombre;
    document.getElementById('objetoPrecio').textContent = `${objetoSeleccionado.precio} 💰`;
    
    // Configurar video
    const video = document.getElementById('objetoVideo');
    video.querySelector('source').src = objetoSeleccionado.video;
    video.load();
    
    // Verificar si puede comprar
    const mensaje = document.getElementById('objetoMensaje');
    const btnComprar = document.getElementById('btnComprarObjeto');
    
    if (jugador.coins < objetoSeleccionado.precio) {
        mensaje.style.background = 'rgba(255, 51, 102, 0.2)';
        mensaje.style.border = '2px solid var(--color-error)';
        mensaje.innerHTML = `
            <p style="color: var(--color-error); font-weight: 700;">
                ⚠️ No tienes suficientes monedas
            </p>
            <p style="color: var(--color-text-dim); font-size: 14px; margin-top: 5px;">
                Tienes ${jugador.coins} 💰 pero necesitas ${objetoSeleccionado.precio} 💰
            </p>
        `;
        btnComprar.disabled = true;
        btnComprar.style.opacity = '0.5';
    } else {
        mensaje.style.background = 'rgba(0, 255, 65, 0.1)';
        mensaje.style.border = '2px solid var(--color-primary)';
        mensaje.innerHTML = `
            <p style="color: var(--color-primary); font-weight: 700;">
                ✓ Tienes suficientes monedas
            </p>
            <p style="color: var(--color-text-dim); font-size: 14px; margin-top: 5px;">
                Saldo actual: ${jugador.coins} 💰 | Después de comprar: ${jugador.coins - objetoSeleccionado.precio} 💰
            </p>
        `;
        btnComprar.disabled = false;
        btnComprar.style.opacity = '1';
    }
    
    // Mostrar modal
    document.getElementById('modalObjeto').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar modal de objeto
function cerrarModalObjeto() {
    document.getElementById('modalObjeto').classList.remove('active');
    document.body.style.overflow = '';
    
    // Detener video
    const video = document.getElementById('objetoVideo');
    video.pause();
}

// Comprar objeto
async function comprarObjeto() {
    if (!objetoSeleccionado) return;
    
    const usuario = await obtenerUsuarioActual();
    
    if (!usuario) {
        alert('Debes iniciar sesión para comprar objetos');
        cerrarModalObjeto();
        abrirModalLogin();
        return;
    }
    
    const btnComprar = document.getElementById('btnComprarObjeto');
    const buttonText = btnComprar.querySelector('.button-text');
    const buttonLoader = btnComprar.querySelector('.button-loader');
    
    // Deshabilitar botón
    btnComprar.disabled = true;
    buttonText.style.display = 'none';
    buttonLoader.style.display = 'inline-block';
    
    try {
        // Comprar objeto
        const resultado = await comprarObjetoConMonedas(usuario.id, objetoSeleccionado);
        
        if (resultado.error) {
            alert('❌ ' + resultado.error);
            return;
        }
        
        // Actualizar UI
        await cargarDatosJugador(usuario.id);
        
        // Mostrar éxito
        alert(`✅ ¡${objetoSeleccionado.nombre} comprado exitosamente!\n\nNuevas monedas: ${resultado.data.nuevasMonedas} 💰`);
        
        cerrarModalObjeto();
        
    } catch (error) {
        console.error('Error comprando objeto:', error);
        alert('❌ Error al comprar el objeto. Intenta de nuevo.');
    } finally {
        btnComprar.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoader.style.display = 'none';
    }
}

// Abrir modal de inventario
async function abrirModalInventario() {
    const usuario = await obtenerUsuarioActual();
    
    if (!usuario) {
        alert('Debes iniciar sesión para ver tu inventario');
        abrirModalLogin();
        return;
    }
    
    document.getElementById('modalInventario').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Cargar inventario
    await cargarInventario(usuario.id);
}

// Cerrar modal de inventario
function cerrarModalInventario() {
    document.getElementById('modalInventario').classList.remove('active');
    document.body.style.overflow = '';
}

// Cargar inventario
async function cargarInventario(userId) {
    const container = document.getElementById('inventarioContainer');
    container.innerHTML = '<p style="text-align: center; color: var(--color-text-dim);">Cargando inventario...</p>';
    
    const resultado = await obtenerInventario(userId);
    
    if (resultado.error) {
        container.innerHTML = `
            <div class="inventario-vacio">
                <div class="inventario-vacio-icono">❌</div>
                <p class="inventario-vacio-texto">Error al cargar el inventario</p>
            </div>
        `;
        return;
    }
    
    if (!resultado.data || resultado.data.length === 0) {
        container.innerHTML = `
            <div class="inventario-vacio">
                <div class="inventario-vacio-icono">📦</div>
                <p class="inventario-vacio-texto">Tu inventario está vacío</p>
                <p style="color: var(--color-text-dim); font-size: 14px;">Compra objetos en la tienda para verlos aquí</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    resultado.data.forEach(item => {
        const objeto = objetos.find(o => o.id === item.object_id);
        
        if (!objeto) return;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventario-item';
        
        const fecha = new Date(item.purchased_at).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        itemDiv.innerHTML = `
            <img src="${objeto.imagen}" alt="${objeto.nombre}" class="inventario-imagen" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22150%22%3E%3Crect fill=%22%231A1F3A%22 width=%22200%22 height=%22150%22/%3E%3Ctext fill=%22%2300FF41%22 font-family=%22Arial%22 font-size=%2216%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E${objeto.nombre}%3C/text%3E%3C/svg%3E'">
            <div class="inventario-nombre">${objeto.nombre}</div>
            <div class="inventario-cantidad">Cantidad: ${item.quantity}</div>
            <div class="inventario-fecha">Comprado: ${fecha}</div>
        `;
        
        container.appendChild(itemDiv);
    });
}

// Actualizar links de usuario
function actualizarLinksUsuario(mostrar) {
    const historialLink = document.getElementById('historialLink');
    const inventarioLink = document.getElementById('inventarioLink');
    
    if (historialLink) {
        historialLink.style.display = mostrar ? 'block' : 'none';
    }
    
    if (inventarioLink) {
        inventarioLink.style.display = mostrar ? 'block' : 'none';
    }
}

// La tienda se inicializa desde main.js
