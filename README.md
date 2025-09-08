# 🛒 E-Commerce React App - Grupo 6

Una aplicación de e-commerce completa desarrollada con React que permite a los usuarios comprar y vender productos online con funcionalidades avanzadas de búsqueda y navegación.

## ✨ Características

### 🔐 **Autenticación y Usuarios**
- **Registro e inicio de sesión** - Sistema completo de autenticación
- **Persistencia de sesión** - Mantiene la sesión activa con localStorage
- **Rutas protegidas** - Acceso controlado a funcionalidades premium

### 🛍️ **Catálogo y Navegación**
- **Listado de productos** - Visualización ordenada alfabéticamente
- **Navegación por categorías** - Exploración intuitiva por tipo de producto
- **Buscador inteligente** - Búsqueda en tiempo real con sugerencias
- **Páginas de detalle** - Vista completa con galería de imágenes múltiples
- **Filtros avanzados** - Por precio, categoría y disponibilidad

### 🛒 **Carrito de Compras Avanzado**
- **Gestión completa** - Agregar, quitar y modificar cantidades
- **Validación de stock en tiempo real** - Control automático de disponibilidad
- **Descuento automático** - Actualización de inventario al finalizar compra
- **Alertas visuales** - Notificaciones para problemas de stock
- **Persistencia** - Carrito guardado entre sesiones

### 📝 **Gestión de Productos**
- **Publicación de productos** - Formulario completo para vendedores
- **Múltiples imágenes** - Subida de hasta 5 fotos por producto
- **Gestión de categorías** - Selección existente o creación nueva
- **Validaciones exhaustivas** - Control de datos y formatos
- **Vista "Mis Productos"** - Panel de control personal

### 🔧 **Administración de Inventario**
- **Control de stock** - Agregar, quitar o establecer cantidades exactas
- **Eliminación de productos** - Gestión completa del catálogo personal
- **Actualizaciones en tiempo real** - Sincronización instantánea
- **Interfaz moderna** - Modales y confirmaciones intuitivas

### 🔍 **Búsqueda y Filtros**
- **Buscador global** - Disponible en toda la aplicación
- **Búsqueda predictiva** - Sugerencias mientras escribes
- **Resultados categorizados** - Organización inteligente
- **Filtros por precio** - Rangos personalizables
- **Ordenamiento múltiple** - Por relevancia, precio, nombre

### 📱 **Experiencia de Usuario**
- **Diseño responsivo** - Adaptado a todos los dispositivos
- **Navegación intuitiva** - Breadcrumbs y navegación clara
- **Estados informativos** - Mensajes para situaciones vacías
- **Animaciones suaves** - Transiciones y efectos modernos

## 🚀 Tecnologías

- **React 19.1.1** - Framework principal con hooks modernos
- **React Router DOM** - Navegación SPA avanzada
- **Vite 7.1.2** - Build tool y servidor de desarrollo rápido
- **CSS3 Moderno** - Grid, Flexbox, animaciones y responsive design
- **Context API** - Gestión de estado global sin librerías externas
- **localStorage** - Persistencia de datos local

## 📋 Prerequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Navegador moderno con soporte ES6+

## 🔧 Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/luislacoste/API-2025-Grupo-6.git
   cd API-2025-Grupo-6/tpo1
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   - La aplicación estará disponible en `http://localhost:5173`

## 👤 Cómo Usar la Aplicación

### **Para Compradores:**
1. **Registrarse/Iniciar sesión** - Crear cuenta o acceder
2. **Explorar catálogo** - Navegar por productos y categorías
3. **Buscar productos** - Usar el buscador global
4. **Ver detalles** - Revisar fotos y especificaciones
5. **Gestionar carrito** - Agregar productos y revisar stock
6. **Finalizar compra** - Proceso automatizado con validaciones

### **Para Vendedores:**
1. **Crear productos** - Usar el botón "Vender" en la navbar
2. **Subir imágenes** - Hasta 5 fotos por producto
3. **Gestionar inventario** - Desde "Mis Productos"
4. **Controlar stock** - Agregar/quitar/establecer cantidades
5. **Eliminar productos** - Gestión completa del catálogo

### **Navegación Avanzada:**
- **Búsqueda global** - Barra superior siempre disponible
- **Filtros por categoría** - Click en cualquier categoría
- **Navegación por breadcrumbs** - Ubicación clara
- **Enlaces directos** - URLs amigables y compartibles

## 📁 Estructura del Proyecto

```
src/
├── components/              # Componentes reutilizables
│   ├── Auth/               # Login y Register
│   ├── Navbar/             # Navegación con buscador
│   ├── Products/           # Lista y tarjetas de productos
│   ├── Categories/         # Lista de categorías
│   └── ProtectedRoute.jsx  # Protección de rutas
├── context/                # Context API para estado global
│   ├── AuthContext.jsx     # Autenticación de usuarios
│   ├── ProductContext.jsx  # Gestión de productos
│   └── CartContext.jsx     # Carrito de compras
├── pages/                  # Páginas principales
│   ├── Home.jsx           # Página principal
│   ├── ProductDetail.jsx  # Detalle de producto
│   ├── Cart.jsx           # Carrito de compras
│   ├── CreateListing.jsx  # Crear producto
│   ├── MyProducts.jsx     # Gestión de productos
│   ├── SearchResults.jsx  # Resultados de búsqueda
│   └── CategoryProducts.jsx # Productos por categoría
└── assets/                # Recursos estáticos
```

## 🌐 Rutas de la Aplicación

- `/` - Página principal con productos destacados
- `/search?q=término` - Resultados de búsqueda
- `/category/:categoryName` - Productos por categoría
- `/product/:id` - Detalle de producto específico
- `/cart` - Carrito de compras (protegida)
- `/create-listing` - Crear nuevo producto (protegida)
- `/my-products` - Gestionar mis productos (protegida)
- `/login` - Iniciar sesión
- `/register` - Crear cuenta

## 🎯 Funcionalidades Destacadas

### **Búsqueda Inteligente**
- Búsqueda en tiempo real mientras escribes
- Sugerencias con imágenes y precios
- Búsqueda por nombre, descripción y categoría
- Navegación directa desde sugerencias

### **Gestión de Stock Automática**
- Validación en tiempo real antes de agregar al carrito
- Descuento automático al finalizar compra
- Alertas visuales para productos sin stock
- Sincronización entre todos los contextos

### **Navegación por Categorías**
- Click en cualquier categoría para ver productos
- Filtros avanzados por precio y ordenamiento
- Breadcrumbs para navegación clara
- Sugerencias de categorías relacionadas

## 👥 Equipo

Proyecto desarrollado para la materia **API 2025 - Grupo 6**

---

**¡Una experiencia de e-commerce completa y moderna! 🎉**
