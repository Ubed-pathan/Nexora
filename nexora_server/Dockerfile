# Stage 1: Build the application
FROM maven:3.8.8-eclipse-temurin-17 AS build

WORKDIR /app

# Copy only the pom.xml and download dependencies first (to cache layers)
COPY pom.xml .
RUN mvn dependency:resolve

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built jar file from the builder stage
COPY --from=build /app/target/Nexora-0.0.1-SNAPSHOT.jar .

# Expose port 8080
EXPOSE 8484

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/Nexora-0.0.1-SNAPSHOT.jar"]