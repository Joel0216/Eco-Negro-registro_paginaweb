# 🔍 Cómo Debuggear el Problema

## Paso 1: Abrir debug.html

1. Abre `debug.html` en tu navegador
2. Verás un console log visual con todos los tests
3. Busca mensajes de error en rojo (❌)

## Paso 2: Verificar la Consola del Navegador

1. Abre `index.html`
2. Presiona `F12` para abrir las herramientas de desarrollador
3. Ve a la pestaña "Console"
4. Busca estos mensajes:

### ✅ Mensajes Correctos (deberías ver):
```
🚀 Inicializando aplicación...
✅ Productos disponibles: 6
📦 Iniciando carga de productos...
✅ Grid encontrado
📦 Total de productos a cargar: 6
  1. Cargando: 100 Monedas
  2. Cargando: 500 Monedas
  3. Cargando: 1000 Monedas
  4. Cargando: 2500 Monedas
  5. Cargando: 5000 Monedas
  6. Cargando: 10000 Monedas
✅ Productos cargados exitosamente en el DOM
✅ Cargando objetos de la tienda...
🎮 Iniciando carga de objetos...
✅ Grid de objetos encontrado
🎮 Total de objetos a cargar: 3
  1. Cargando: Chip de Hiper-Eco
  2. Cargando: Inhibidor Sónico
  3. Cargando: Batería Resonante
✅ Objetos cargados exitosamente en el DOM
✅ Aplicación inicializada correctamente
```

### ❌ Mensajes de Error (NO deberías ver):
```
❌ ERROR: productos no está definido
❌ No se encontró el elemento productosGrid
❌ Error inicializando aplicación
```

## Paso 3: Verificar el HTML

Abre `index.html` y busca estos elementos:

### Debe existir:
```html
<div class="productos-grid" id="productosGrid">
```

### Y también:
```html
<div class="objetos-grid" id="objetosGrid">
```

## Paso 4: Verificar el Orden de Scripts

Al final de `index.html` debe estar en este orden:

```html
<script src="https://js.stripe.com/v3/"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/productos.js"></script>
<script src="js/supabase.js"></script>
<script src="js/auth.js"></script>
<script src="js/payment.js"></script>
<script src="js/historial.js"></script>
<script src="js/tienda.js"></script>
<script src="js/main.js"></script>  <!-- DEBE SER EL ÚLTIMO -->
```

## Paso 5: Soluciones Rápidas

### Si no aparecen los paquetes:

1. **Recargar con caché limpio:**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Verificar que productos.js se cargó:**
   - En la consola escribe: `productos`
   - Debería mostrar un array con 6 elementos

3. **Verificar que el grid existe:**
   - En la consola escribe: `document.getElementById('productosGrid')`
   - Debería mostrar el elemento HTML

### Si no aparecen los objetos:

1. **Verificar que objetos.js se cargó:**
   - En la consola escribe: `objetos`
   - Debería mostrar un array con 3 elementos

2. **Verificar que el grid existe:**
   - En la consola escribe: `document.getElementById('objetosGrid')`
   - Debería mostrar el elemento HTML

### Si los formularios no funcionan:

1. **Verificar que los modales existen:**
   - En la consola escribe: `document.getElementById('formLogin')`
   - Debería mostrar el formulario

2. **Verificar que Supabase está conectado:**
   - En la consola escribe: `supabase`
   - Debería mostrar el objeto de Supabase

## Paso 6: Reportar el Error

Si después de todos estos pasos sigue sin funcionar, copia y pega:

1. **Todos los mensajes de la consola** (F12 → Console)
2. **El resultado de estos comandos en la consola:**
   ```javascript
   typeof productos
   typeof objetos
   typeof supabase
   document.getElementById('productosGrid')
   document.getElementById('objetosGrid')
   ```

## Archivos de Debug Creados

- `debug.html` - Página de prueba con console visual
- `test.html` - Tests de funcionalidad
- `COMO_DEBUGGEAR.md` - Este archivo

## Cambios Realizados

### js/main.js
- ✅ Agregados logs detallados
- ✅ Validación de que `productos` esté definido
- ✅ Delay de 100ms para asegurar carga
- ✅ Manejo de errores mejorado

### js/tienda.js
- ✅ Agregados logs detallados
- ✅ Validación de que `objetos` esté definido
- ✅ Mejor manejo de errores

## Próximos Pasos

1. Abre `debug.html` primero
2. Si todo está verde (✅), abre `index.html`
3. Si hay errores rojos (❌), copia el mensaje y repórtalo
