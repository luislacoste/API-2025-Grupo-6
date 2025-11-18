# Build stage - Using specific Java version
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copiamos solo pom.xml para cachear dependencias
COPY pom.xml .

# Descargamos dependencias (se cachea mientras no cambie el pom)
RUN mvn dependency:go-offline -B

# Copiamos el código
COPY src ./src

# Build del jar
RUN mvn clean package -DskipTests

# ====== RUNTIME STAGE ======
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copiamos el jar generado desde la stage anterior
COPY --from=build /app/target/*.jar app.jar

# Expone el puerto por si querés
EXPOSE 3000

# Comando de inicio
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
