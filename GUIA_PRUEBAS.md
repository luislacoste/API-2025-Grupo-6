# Guía de Pruebas - API E-commerce

## 📋 Contenido
1. [Pruebas de Autenticación](#pruebas-de-autenticación)
2. [Pruebas de Productos](#pruebas-de-productos)
3. [Pruebas de Categorías](#pruebas-de-categorías)
4. [Pruebas de Pedidos](#pruebas-de-pedidos)
5. [Pruebas de Autorización por Roles](#pruebas-de-autorización-por-roles)

---

## Pruebas de Autenticación

### 1. Registrar un nuevo usuario

```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Perez",
  "email": "juan.perez@example.com",
  "password": "password123"
}
```

**Respuesta Esperada (201 Created):**
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Perez",
  "email": "juan.perez@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJST0xFX1VTRVIiXSwic3ViIjoianVhbi5wZXJlekBleGFtcGxlLmNvbSIsImlhdCI6MTcwOTU5MjAwMCwiZXhwIjoxNzA5Njc4NDAwfQ..."
}
```

### 2. Login de usuario existente

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "juan.perez@example.com",
  "password": "password123"
}
```

**Respuesta Esperada (200 OK):**
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Perez",
  "email": "juan.perez@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Login con credenciales incorrectas

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "juan.perez@example.com",
  "password": "wrongpassword"
}
```

**Respuesta Esperada (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

### 4. Registrar con email duplicado

```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nombre": "Pedro",
  "apellido": "Lopez",
  "email": "juan.perez@example.com",
  "password": "password123"
}
```

**Respuesta Esperada (409 Conflict):**
```json
{
  "error": "There is already a registered user with the email: juan.perez@example.com"
}
```

---

## Pruebas de Productos

### 1. Listar todos los productos (Público)

```bash
GET http://localhost:3000/products
```

**Respuesta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 89990,
    "category": "Electronics",
    "description": "High performance laptop",
    "image": "data:image/png;base64,...",
    "stock": 10,
    "createdAt": "2024-03-15T10:30:00Z",
    "userId": 1
  }
]
```

### 2. Obtener producto por ID (Público)

```bash
GET http://localhost:3000/products/1
```

### 3. Filtrar productos por categoría (Público)

```bash
GET http://localhost:3000/products?category=Electronics
```

### 4. Crear producto (Requiere Autenticación)

```bash
POST http://localhost:3000/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Smartphone",
  "price": 59990,
  "category": "Electronics",
  "description": "Latest model smartphone",
  "image": "data:image/png;base64,iVBORw0KG...",
  "stock": 25,
  "userId": 1
}
```

**Respuesta Esperada (201 Created):**
```json
{
  "id": 2,
  "name": "Smartphone",
  "price": 59990,
  "category": "Electronics",
  "description": "Latest model smartphone",
  "image": "data:image/png;base64,iVBORw0KG...",
  "stock": 25,
  "createdAt": "2024-03-15T11:00:00Z",
  "userId": 1
}
```

### 5. Crear producto sin token (Debe Fallar)

```bash
POST http://localhost:3000/products
Content-Type: application/json

{
  "name": "Test Product",
  "price": 1000,
  "category": "Test",
  "stock": 5
}
```

**Respuesta Esperada (403 Forbidden):**
```json
{
  "error": "Authentication failed"
}
```

### 6. Actualizar producto (Requiere Autenticación)

```bash
PUT http://localhost:3000/products/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Laptop Updated",
  "price": 79990,
  "category": "Electronics",
  "description": "Updated description",
  "image": "data:image/png;base64,...",
  "stock": 8,
  "userId": 1
}
```

**Respuesta Esperada (200 OK):**
```json
{
  "id": 1,
  "name": "Laptop Updated",
  "price": 79990,
  ...
}
```

### 7. Eliminar producto (Requiere Rol ADMIN)

```bash
DELETE http://localhost:3000/products/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta Esperada (204 No Content)** si es ADMIN
**Respuesta Esperada (403 Forbidden)** si es USER

---

## Pruebas de Categorías

### 1. Listar todas las categorías (Público)

```bash
GET http://localhost:3000/categories
```

**Respuesta Esperada (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices",
    "icon": "devices",
    "productCount": 15
  },
  {
    "id": 2,
    "name": "Clothing",
    "description": "Clothes and accessories",
    "icon": "shirt",
    "productCount": 30
  }
]
```

### 2. Obtener categoría por ID (Público)

```bash
GET http://localhost:3000/categories/1
```

### 3. Crear categoría (Solo ADMIN)

```bash
POST http://localhost:3000/categories
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (token de ADMIN)
Content-Type: application/json

{
  "name": "Books",
  "description": "All kinds of books",
  "icon": "book",
  "productCount": 0
}
```

**Respuesta Esperada (201 Created) si es ADMIN:**
```json
{
  "id": 3,
  "name": "Books",
  "description": "All kinds of books",
  "icon": "book",
  "productCount": 0
}
```

**Respuesta Esperada (403 Forbidden) si es USER:**
```json
{
  "error": "Access denied"
}
```

### 4. Actualizar categoría (Solo ADMIN)

```bash
PUT http://localhost:3000/categories/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (token de ADMIN)
Content-Type: application/json

{
  "name": "Electronics & Gadgets",
  "description": "Updated description",
  "icon": "devices",
  "productCount": 20
}
```

### 5. Eliminar categoría (Solo ADMIN)

```bash
DELETE http://localhost:3000/categories/3
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (token de ADMIN)
```

---

## Pruebas de Pedidos

### 1. Listar todos los pedidos (Público)

```bash
GET http://localhost:3000/orders
```

### 2. Obtener pedido por ID (Público)

```bash
GET http://localhost:3000/orders/1
```

### 3. Crear pedido (Requiere Autenticación)

```bash
POST http://localhost:3000/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "userId": 1,
  "total": 149980.0,
  "status": "PENDIENTE"
}
```

**Respuesta Esperada (201 Created):**
```json
{
  "id": 1,
  "userId": 1,
  "createdAt": "2024-03-15T12:00:00Z",
  "total": 149980.0,
  "status": "PENDIENTE"
}
```

### 4. Actualizar pedido (Requiere Autenticación)

```bash
PUT http://localhost:3000/orders/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "userId": 1,
  "total": 149980.0,
  "status": "COMPLETADO"
}
```

### 5. Eliminar pedido (Requiere Autenticación)

```bash
DELETE http://localhost:3000/orders/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Pruebas de Autorización por Roles

### Crear un Usuario con Rol ADMIN

Para probar los endpoints que requieren rol ADMIN, primero necesitas crear un usuario con ese rol. Puedes hacerlo de dos formas:

#### Opción 1: Actualizar manualmente en la base de datos

```sql
-- Conectarse a MySQL
docker exec -it tpo1-db-1 mysql -u ecomuser -pecompass ecommerce_db

-- Actualizar el rol de un usuario existente
UPDATE usuarios SET role = 'ADMIN' WHERE email = 'juan.perez@example.com';
```

#### Opción 2: Crear endpoint temporal para crear admins (solo en desarrollo)

Agregar este endpoint temporalmente en `AuthenticationController.java`:

```java
@PostMapping("/register/admin")
public ResponseEntity<AuthResponse> registerAdmin(@RequestBody RegisterRequest request) {
    // Similar a register() pero asigna rol ADMIN
    // IMPORTANTE: Eliminar este endpoint en producción
}
```

### Ejemplos de Pruebas con Diferentes Roles

#### USER intenta eliminar producto (Debe Fallar)

```bash
DELETE http://localhost:3000/products/1
Authorization: Bearer [TOKEN_DE_USER]
```

**Respuesta Esperada (403 Forbidden):**
```json
{
  "error": "Access denied"
}
```

#### ADMIN elimina producto (Debe Funcionar)

```bash
DELETE http://localhost:3000/products/1
Authorization: Bearer [TOKEN_DE_ADMIN]
```

**Respuesta Esperada (204 No Content)**

#### USER intenta crear categoría (Debe Fallar)

```bash
POST http://localhost:3000/categories
Authorization: Bearer [TOKEN_DE_USER]
Content-Type: application/json

{
  "name": "Test Category",
  "description": "Test",
  "icon": "test"
}
```

**Respuesta Esperada (403 Forbidden)**

---

## Pruebas de Validación

### 1. Crear producto con datos inválidos

```bash
POST http://localhost:3000/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "AB",
  "price": -100,
  "stock": -5
}
```

**Respuesta Esperada (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "fields": {
    "name": "Product name must be between 3 and 100 characters",
    "price": "Price must be greater than or equal to 0",
    "category": "Category is required",
    "stock": "Stock must be greater than or equal to 0"
  }
}
```

### 2. Registrar usuario con email inválido

```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nombre": "Test",
  "apellido": "User",
  "email": "invalid-email",
  "password": "123"
}
```

**Respuesta Esperada (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "fields": {
    "email": "Email must be valid",
    "password": "Password must be at least 6 characters"
  }
}
```

---

## 🔧 Herramientas Recomendadas para Pruebas

1. **Postman** - https://www.postman.com/
2. **Thunder Client** (extensión de VS Code)
3. **cURL** (línea de comandos)
4. **REST Client** (extensión de VS Code)

### Importar en Postman

Puedes crear una colección en Postman con todas estas pruebas y usar variables de entorno para el token JWT:

```
// Variable de entorno en Postman
TOKEN = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Usar en headers
Authorization: Bearer {{TOKEN}}
```

---

## ✅ Checklist de Pruebas

- [ ] Registrar usuario USER
- [ ] Login con usuario USER
- [ ] Crear usuario ADMIN (manual en DB)
- [ ] Login con usuario ADMIN
- [ ] Listar productos (público)
- [ ] Crear producto con token USER
- [ ] Actualizar producto con token USER
- [ ] Intentar eliminar producto con token USER (debe fallar)
- [ ] Eliminar producto con token ADMIN (debe funcionar)
- [ ] Listar categorías (público)
- [ ] Intentar crear categoría con token USER (debe fallar)
- [ ] Crear categoría con token ADMIN (debe funcionar)
- [ ] Crear pedido con token USER
- [ ] Actualizar pedido con token USER
- [ ] Probar validaciones con datos inválidos
- [ ] Probar sin token en endpoint protegido (debe fallar)
- [ ] Probar con token expirado (debe fallar después de 24h)

---

## 📝 Notas

- Los tokens JWT expiran en 24 horas
- Todos los precios están en centavos (ej: 89990 = $899.90)
- Los endpoints GET son públicos para facilitar la navegación del catálogo
- Los endpoints de modificación requieren autenticación o rol ADMIN según el caso
