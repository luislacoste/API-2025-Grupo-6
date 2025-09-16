# 🛒 E-Commerce React App - Grupo 6

Aplicación de e-commerce desarrollada con React (Vite) que permite a los usuarios registrarse, explorar productos por categorías, ver detalles, agregar al carrito y gestionar su sesión. Ahora los productos y categorías se obtienen dinámicamente desde `json-server` utilizando el archivo `db.json`, eliminando los arrays hardcodeados del contexto.

## 🚀 Tecnologías
- React 19 + Hooks (useState, useEffect, useContext)
- React Router DOM 7
- Context API (Auth, Products, Cart)
- Vite 7 (dev server / build)
- json-server (mock API REST)
- CSS moderno (Flexbox / Grid)

## 📂 Estructura Relevante
```
tpo1/
├── db.json                # Fuente de datos para json-server
├── package.json           # Scripts y dependencias
└── src/
    ├── services/
    │   └── api.js        # Helpers de fetch (products, categories, product by id)
    ├── context/
    │   ├── ProductContext.jsx  # Carga inicial desde API + helpers
    │   ├── AuthContext.jsx     # Registro / login (localStorage)
    │   └── CartContext.jsx     # Carrito (persistencia local)
    ├── components/      # UI reutilizable (Products, Categories, Navbar, etc.)
    └── pages/           # Vistas: Home, ProductDetail, Cart, etc.
```

## 🔄 Cambio Importante (Refactor ProductContext)
Antes: `ProductContext.jsx` contenía arrays `initialProducts` e `initialCategories`, además de lógica con `localStorage`.

Ahora:
- Usa `useEffect` con array de dependencias `[]` para hacer una sola carga inicial.
- Llama a helpers de `src/services/api.js` (`fetchProducts`, `fetchCategories`).
- Ordena productos alfabéticamente en memoria.
- Calcula `productCount` por categoría dinámicamente.
- Expone `getProductByIdAsync` que, si no encuentra el producto en cache, lo busca en el servidor.
- Incluye stubs para futuras operaciones (crear, eliminar, actualizar stock) que se implementarán cuando se activen métodos POST/PUT/DELETE sobre json-server.

## 📋 Prerrequisitos
- Node.js >= 16
- npm (incluido con Node)

## ⚙️ Instalación
```bash
# 1. Clonar el repo
git clone https://github.com/luislacoste/API-2025-Grupo-6.git
cd API-2025-Grupo-6/tpo1

# 2. Instalar dependencias
npm install
```

## ▶️ Ejecución en Desarrollo
En dos terminales (o usando un proceso en background):

```bash
# Terminal 1: iniciar API mock
npm run json-server
# Servirá endpoints:
#  - http://localhost:3000/products
#  - http://localhost:3000/categories

# Terminal 2: iniciar React (alias también disponible: npm start)
npm run dev
# o
npm start
```
Abrir: http://localhost:5173

## 🧪 Verificar Funcionamiento del Detalle de Producto
1. Levantar json-server (debe mostrar endpoints en consola).
2. Abrir la app y hacer clic sobre cualquier tarjeta de producto.
3. Debe navegar a `/product/:id` y mostrar:
   - Imagen principal (y galería si existieran múltiples imágenes en el dato).
   - Nombre, precio formateado, descripción, stock y fecha.
4. Si el producto NO existe (por ejemplo `/product/9999`): muestra mensaje “Producto no encontrado”.
5. Si hay un error real de red / servidor: muestra mensaje “Error al cargar el producto” + detalle.

## 📦 Scripts Disponibles
| Comando                | Descripción |
|------------------------|-------------|
| `npm run dev` / `npm start` | Inicia servidor de desarrollo Vite (React) |
| `npm run json-server`  | Inicia API mock leyendo `db.json` en puerto 3000 |
| `npm run build`        | Build de producción |
| `npm run preview`      | Previsualiza build |
| `npm run lint`         | Ejecuta ESLint |

## 🛠️ Helpers Principales (`services/api.js`)
```js
fetchProducts();          // GET /products
fetchCategories();        // GET /categories
fetchProductById(id);     // GET /products/:id
fetchProductsByCategory(name); // GET /products?category=...
```
Todos siguen el patrón: `fetch -> verificar response.ok -> .json() -> try/catch/throw`. Estilo alineado al ejemplo de clase (`UseEffectExample.jsx`).

## 🧠 Contextos Clave
- `ProductContext`: datos de productos/categorías y utilidades (búsqueda, filtrado, getProductByIdAsync).
- `AuthContext`: registro/login con persistencia básica en `localStorage` (prototipo académico).
- `CartContext`: manejo de items, validación de stock y persistencia local.

## 🔒 Limitaciones Actuales / Próximos Pasos
- Aún no se implementan operaciones POST/PUT/DELETE reales sobre json-server (crear/editar/eliminar producto, modificar stock).
- Las funciones `createProductListing`, `updateProductStock` y `deleteProduct` son stubs y mostrarán avisos en consola.
- Próxima etapa: integrar mutaciones y sincronización contra API.

## ❓ Troubleshooting
| Problema | Causa Común | Solución |
|----------|-------------|----------|
| Productos no cargan | json-server no iniciado | Ejecutar `npm run json-server` antes que React |
| Error CORS | Puerto incorrecto o server caído | Verificar que endpoints respondan en navegador |
| Detalle muestra “Producto no encontrado” | ID inexistente | Confirmar que el ID está en `db.json` |
| “Error al cargar el producto” | JSON inválido o server caído | Revisar consola de json-server |

## 👥 Equipo
Proyecto desarrollado para la materia **API 2025 - Grupo 6**.

---
**¡Listo! La app ahora consume datos reales desde json-server y el detalle de producto funciona correctamente.** 🎉
