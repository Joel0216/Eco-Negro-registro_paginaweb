# 🎮 ECO NEGRO - Página de Recarga de Monedas

Página web de recarga de monedas para el juego Eco Negro con diseño futurista, sistema de autenticación y pasarela de pago simulada.

## ✨ Características

- 🔐 **Sistema de autenticación completo** (Registro e inicio de sesión)
- 💰 **6 paquetes de monedas** con bonificaciones
- 💳 **Pasarela de pago simulada** (Tarjeta, PayPal, Mercado Pago)
- 📊 **Historial de compras** con estadísticas
- 🎨 **Diseño futurista** con colores neón (verde y cyan)
- 📱 **Responsive design** (móvil, tablet, desktop)
- ⚡ **Actualización automática** de monedas
- 🔄 **Integración con Supabase** para base de datos

## 🚀 Instalación Rápida

### 1. Configurar Supabase

Ejecuta estos SQL en tu Supabase SQL Editor:

#### Paso 1: Limpiar base de datos
```sql
-- Ejecuta: PASO_1_BORRAR_TODO_COMPLETO.sql
```

#### Paso 2: Crear tablas
```sql
-- Ejecuta: PASO_2_CREAR_TODO_NUEVO.sql
```

### 2. Abrir la página

```bash
# Simplemente abre index.html en tu navegador
```

## 📊 Estructura de Base de Datos

### Tabla: `players`
- Información del jugador
- Saldo de monedas
- Creación automática al registrarse

### Tabla: `transactions`
- Historial de compras
- Estado de transacciones
- Método de pago utilizado

## 🎮 Uso

### Registro
1. Clic en "Registrarse"
2. Ingresa username, email y contraseña
3. ¡Listo! Inicia sesión automáticamente

### Comprar Monedas
1. Selecciona un paquete
2. Elige método de pago
3. Completa los datos (simulados)
4. Las monedas se agregan automáticamente

### Ver Historial
1. Estando logueado, clic en "Historial"
2. Ve todas tus compras y estadísticas

## 💳 Pasarela de Pago (Simulada)

Los pagos son **simulados** para desarrollo:
- **Tarjeta**: Cualquier número (ej: 4242 4242 4242 4242)
- **CVV**: Cualquier 3 dígitos
- **Expiración**: Cualquier fecha futura
- **Tasa de éxito**: 95%

## 📁 Estructura del Proyecto

```
├── index.html                    # Página principal
├── css/
│   └── styles.css               # Estilos completos
├── js/
│   ├── main.js                  # Lógica principal
│   ├── auth.js                  # Sistema de autenticación
│   ├── supabase.js              # Conexión a Supabase
│   ├── productos.js             # Catálogo de productos
│   ├── payment.js               # Pasarela de pago simulada
│   └── historial.js             # Sistema de historial
├── PASO_1_BORRAR_TODO_COMPLETO.sql
├── PASO_2_CREAR_TODO_NUEVO.sql
├── INSTRUCCIONES_SIMPLES.md
└── README.md
```

## 🔧 Configuración Avanzada

### Cambiar colores
Edita `css/styles.css`:
```css
:root {
    --bg-primary: #0A0E27;
    --color-primary: #00FF41;
    --color-secondary: #00D9FF;
}
```

### Modificar productos
Edita `js/productos.js`:
```javascript
const productos = [
    {
        id: 'coins_100',
        nombre: '100 Monedas',
        precio: 0.99,
        monedas: 100,
        icono: '💰',
        popular: false
    }
];
```

### Credenciales de Supabase
Ya configuradas en `js/supabase.js`:
```javascript
const SUPABASE_URL = 'https://xcvrjpyuhqqsqlltuuai.supabase.co';
const SUPABASE_ANON_KEY = 'tu_clave_aqui';
```

## 🔐 Seguridad

- ✅ Row Level Security (RLS) en Supabase
- ✅ Cada usuario solo ve sus propios datos
- ✅ Validación de datos en frontend
- ✅ Políticas de seguridad configuradas

## 📱 Responsive

- **Móvil**: < 768px (1 columna)
- **Tablet**: 768px - 1024px (2 columnas)
- **Desktop**: > 1024px (3 columnas)

## 🚀 Para Producción

Para usar pagos reales:

1. **Integrar Stripe/PayPal**
   - Obtener claves API
   - Configurar en `js/payment.js`

2. **Crear Backend**
   - Node.js + Express
   - Procesar pagos de forma segura
   - Configurar webhooks

3. **Configurar Email**
   - Activar confirmación de email en Supabase
   - Configurar servicio SMTP

## 📞 Soporte

Para problemas o preguntas:
- Revisa `INSTRUCCIONES_SIMPLES.md`
- Revisa `RESUMEN_COMPLETO.md`
- Verifica la consola del navegador (F12)

## 📄 Licencia

© 2024 Eco Negro. Todos los derechos reservados.
