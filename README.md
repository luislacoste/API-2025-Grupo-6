# 🛒 E-Commerce Full-Stack App - Grupo 6

Aplicación de e-commerce full-stack desarrollada con React (Vite) como frontend y Spring Boot como backend, conectada a una base de datos MySQL. Permite a los usuarios registrarse, explorar productos por categorías, ver detalles, agregar al carrito y gestionar su sesión.

## 🚀 Tecnologías

### Frontend
- React 19 + Hooks (useState, useEffect, useContext)
- React Router DOM 7
- Context API (Auth, Products, Cart)
- Vite 7 (dev server / build)
- CSS moderno (Flexbox / Grid)

### Backend
- Spring Boot 3.1.4
- Spring Data JPA
- Spring Security
- Lombok
- MySQL 8.0
- Maven (gestión de dependencias)

### Base de Datos
- MySQL 8.0 (Docker o XAMPP)
- JPA/Hibernate para ORM

## 📂 Estructura del Proyecto
```
API-2025-Grupo-6/
├── tpo1/
│   ├── src/                          # Frontend React
│   │   ├── services/
│   │   │   └── api.js                # API calls to Spring Boot backend
│   │   ├── context/                  # React Context (Auth, Products, Cart)
│   │   ├── components/               # UI Components
│   │   └── pages/                    # React Pages
│   ├── spring-backend/               # Backend Spring Boot
│   │   ├── src/main/java/com/example/springbackend/
│   │   │   ├── SpringBackendApplication.java  # Main Spring Boot class
│   │   │   ├── controller/           # REST Controllers
│   │   │   ├── model/                # JPA Entities
│   │   │   └── repository/           # JPA Repositories
│   │   │   └── config/               # Spring Security and application 
│   │   │   └── dto/                  # Data Transfer Objects
│   │   │   └── exception/            # Custom exception classes
│   │   │   └── service/              # Services
│   │   ├── src/main/resources/
│   │   │   ├── application.properties # Database configuration
│   │   │   └── data.sql              # Initial data seeding
│   │   └── pom.xml                   # Maven dependencies
│   ├── package.json                  # Frontend dependencies
│   └── db.json                       # Legacy json-server data (not used)
```

## 📋 Prerrequisitos

### Software Requerido
- **Node.js >= 16** (para el frontend React)
- **Java 17** (para Spring Boot)
- **Maven 3.6+** (gestión de dependencias Java)
- **Docker** (recomendado para MySQL) o **XAMPP** (alternativa)
- **Git** (para clonar el repositorio)

### Verificar Instalaciones
```bash
# Verificar Node.js
node --version

# Verificar Java
java --version

# Verificar Maven
mvn --version

# Verificar Docker (opcional)
docker --version
```

## ⚙️ Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/luislacoste/API-2025-Grupo-6.git
cd API-2025-Grupo-6/tpo1
```

### 2. Configurar Base de Datos MySQL

#### Opción A: Docker (Recomendado)
```bash
# Ejecutar contenedor MySQL
docker run -d \
  --name mysql-ecommerce \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=ecommerce_db \
  -e MYSQL_USER=ecomuser \
  -e MYSQL_PASSWORD=ecompass \
  -p 3306:3306 \
  mysql:8.0

# Verificar que el contenedor esté corriendo
docker ps
```

#### Opción B: XAMPP
1. Instalar XAMPP
2. Iniciar Apache y MySQL desde el panel de control
3. Crear base de datos `ecommerce_db`
4. Crear usuario `ecomuser` con contraseña `ecompass`

### 3. Instalar Dependencias del Frontend
```bash
# Instalar dependencias de React
npm install
```

### 4. Configurar Backend Spring Boot
```bash
# Navegar al directorio del backend
cd spring-backend

```

## ▶️ Ejecución en Desarrollo

### Paso 1: Iniciar Base de Datos
```bash
# Si usas Docker, verificar que el contenedor esté corriendo
docker ps | grep mysql-ecommerce

# Si no está corriendo, iniciarlo
docker start mysql-ecommerce
```

### Paso 2: Iniciar Backend Spring Boot
```bash
# Desde el directorio tpo1/spring-backend
cd spring-backend
mvn spring-boot:run

# O ejecutar directamente la clase principal
mvn exec:java -Dexec.mainClass="com.example.springbackend.SpringBackendApplication"
```

**El backend estará disponible en:** `http://localhost:3000`

### Paso 3: Iniciar Frontend React
```bash
# En una nueva terminal, desde el directorio tpo1
npm run dev
# o
npm start
```

**El frontend estará disponible en:** `http://localhost:5173`

## 🌐 URLs de Acceso
- **Frontend React:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Base de Datos:** localhost:3306 (MySQL)

## 🧪 Verificar Funcionamiento

### 1. Verificar Backend Spring Boot
```bash
# Probar endpoints de la API
curl http://localhost:3000/products
curl http://localhost:3000/categories
```

### 2. Verificar Frontend React
1. Abrir http://localhost:5173
2. Verificar que se carguen los productos desde la API
3. Hacer clic en cualquier producto para ver el detalle
4. Probar navegación entre categorías

### 3. Verificar Base de Datos
```bash
# Conectar a MySQL (Docker)
docker exec -it mysql-ecommerce mysql -u ecomuser -p ecommerce_db

# Verificar tablas
SHOW TABLES;
SELECT * FROM products;
SELECT * FROM categories;
```

## 📦 Scripts Disponibles

### Frontend (React)
| Comando | Descripción |
|---------|-------------|
| `npm run dev` / `npm start` | Inicia servidor de desarrollo Vite |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualiza build |
| `npm run lint` | Ejecuta ESLint |

### Backend (Spring Boot)
| Comando | Descripción |
|---------|-------------|
| `mvn spring-boot:run` | Inicia aplicación Spring Boot |
| `mvn clean install` | Limpia y compila el proyecto |
| `mvn test` | Ejecuta tests unitarios |

## 🛠️ API Endpoints Disponibles

### Productos
- `GET /products` - Obtener todos los productos
- `GET /products/{id}` - Obtener producto por ID
- `GET /products?category={name}` - Filtrar por categoría
- `POST /products` - Crear nuevo producto
- `PUT /products/{id}` - Actualizar producto
- `DELETE /products/{id}` - Eliminar producto

### Categorías
- `GET /categories` - Obtener todas las categorías
- `GET /categories/{id}` - Obtener categoría por ID
- `POST /categories` - Crear nueva categoría
- `PUT /categories/{id}` - Actualizar categoría
- `DELETE /categories/{id}` - Eliminar categoría

## 🧠 Arquitectura de la Aplicación

### Frontend (React)
- **Context API**: Gestión de estado global (Auth, Products, Cart)
- **Services**: Comunicación con API REST (`src/services/api.js`)
- **Components**: UI reutilizable y páginas
- **Routing**: Navegación con React Router DOM

### Backend (Spring Boot)
- **Controllers**: REST endpoints (`ProductController`, `CategoryController`)
- **Models**: Entidades JPA (`Product`, `Category`)
- **Repositories**: Acceso a datos con Spring Data JPA
- **Database**: MySQL con Hibernate ORM

## 🔒 Características Implementadas
- ✅ CRUD completo de productos y categorías
- ✅ Autenticación básica con localStorage
- ✅ Carrito de compras persistente
- ✅ Búsqueda y filtrado por categorías
- ✅ Gestión de stock en tiempo real
- ✅ Interfaz responsive y moderna

## ❓ Troubleshooting

### Problemas Comunes

| Problema | Causa Común | Solución |
|----------|-------------|----------|
| **Frontend no carga productos** | Backend no iniciado | Ejecutar `mvn spring-boot:run` en spring-backend |
| **Error de conexión a BD** | MySQL no iniciado | Verificar Docker: `docker ps \| grep mysql` |
| **Error CORS** | Puerto incorrecto | Verificar que backend esté en puerto 3000 |
| **"Producto no encontrado"** | ID inexistente | Verificar datos en BD: `SELECT * FROM products` |
| **Error de autenticación BD** | Credenciales incorrectas | Verificar usuario/contraseña en application.properties |
| **Puerto 3000 ocupado** | Otro servicio usando el puerto | Cambiar puerto en application.properties o matar proceso |

### Comandos de Diagnóstico

```bash
# Verificar que MySQL esté corriendo
docker ps | grep mysql-ecommerce

# Verificar logs de Spring Boot
tail -f logs/spring.log

# Probar conexión a la API
curl -v http://localhost:3000/products

# Verificar puertos en uso
lsof -i :3000
lsof -i :5173
lsof -i :3306
```

### Soluciones Rápidas

```bash
# Reiniciar MySQL (Docker)
docker restart mysql-ecommerce

# Limpiar y recompilar Spring Boot
cd spring-backend
mvn clean install
mvn spring-boot:run

# Limpiar cache de npm
npm cache clean --force
npm install
```

## 🚀 Despliegue en Producción

### Backend
```bash
# Compilar JAR
cd spring-backend
mvn clean package

# Ejecutar JAR
java -jar target/spring-backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
# Build de producción
npm run build

# Servir archivos estáticos
npm run preview
```

## 👥 Equipo
Proyecto desarrollado para la materia **API 2025 - Grupo 6**.

---
**¡Listo! La aplicación full-stack está funcionando con React + Spring Boot + MySQL.** 🎉
