# 🎮 ECO NEGRO - Página de Recarga de Monedas

Página web de recarga de monedas para el juego Eco Negro, con diseño futurista y neón.

## 🚀 Características

- ✅ Diseño futurista con colores neón (verde y cyan)
- ✅ 6 paquetes de monedas con bonificaciones
- ✅ Integración con Supabase
- ✅ Sistema de pagos (Stripe/PayPal)
- ✅ Responsive design (móvil, tablet, desktop)
- ✅ Animaciones suaves y efectos glow
- ✅ Actualización automática de monedas

## 📦 Estructura del Proyecto

```
pagina-recarga/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos completos
├── js/
│   ├── main.js         # Lógica principal
│   ├── supabase.js     # Conexión a base de datos
│   └── productos.js    # Catálogo de productos
└── README.md
```

## 🔧 Configuración

### 1. Base de Datos (Supabase)

Las credenciales ya están configuradas en `js/supabase.js`:
- URL: https://xcvrjpyuhqqsqlltuuai.supabase.co
- Tablas: `players` y `transactions`

### 2. Pasarela de Pago

Para activar pagos reales, edita `js/main.js`:

```javascript
// Stripe
const STRIPE_PUBLIC_KEY = 'tu_clave_publica_de_stripe';

// O configura PayPal en el HTML
```

## 🎨 Personalización

### Colores

Edita las variables CSS en `css/styles.css`:

```css
:root {
    --bg-primary: #0A0E27;
    --color-primary: #00FF41;
    --color-secondary: #00D9FF;
}
```

### Productos

Modifica los paquetes en `js/productos.js`:

```javascript
const productos = [
    {
        id: 'coins_100',
        nombre: '100 Monedas',
        precio: 0.99,
        monedas: 100,
        // ...
    }
];
```

## 🚀 Uso

1. Abre `index.html` en un navegador
2. Selecciona un paquete de monedas
3. Ingresa tu email registrado en el juego
4. Completa el pago
5. ¡Las monedas se agregan automáticamente!

## 📱 Responsive

- **Móvil**: < 768px (1 columna)
- **Tablet**: 768px - 1024px (2 columnas)
- **Desktop**: > 1024px (3 columnas)

## 🔐 Seguridad

- Validación de email
- Verificación de jugador en base de datos
- Procesamiento seguro de pagos
- Registro de todas las transacciones

## 🛠️ Desarrollo

### Modo Demo

Actualmente funciona en modo demo (pagos simulados). Para producción:

1. Configura tu cuenta de Stripe/PayPal
2. Agrega las claves públicas en `js/main.js`
3. Crea un backend para procesar pagos (Node.js + Express)
4. Configura webhooks para confirmar pagos

### Backend Recomendado

```javascript
// api/create-payment-intent.js
const stripe = require('stripe')('tu_clave_secreta');

app.post('/api/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd'
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
});
```

## 📞 Soporte

Para problemas o preguntas sobre la página de recarga, contacta al equipo de Eco Negro.

## 📄 Licencia

© 2024 Eco Negro. Todos los derechos reservados.
