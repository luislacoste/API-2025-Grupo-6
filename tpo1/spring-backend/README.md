Spring Boot backend for TPO API

Run with Maven:

```bash
cd tpo1/spring-backend
mvn spring-boot:run
```

The app starts on port 3000 and exposes endpoints:
- GET /products
- GET /products/{id}
- GET /products?category=...
- POST /products
- PUT /products/{id}
- DELETE /products/{id}

- GET /categories
- GET /categories/{id}
- POST /categories
- PUT /categories/{id}
- DELETE /categories/{id}

H2 console available at http://localhost:3000/h2-console (jdbc url: jdbc:h2:mem:testdb)
