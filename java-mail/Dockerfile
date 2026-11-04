# Etapa 1: Build (Maven com OpenJDK 21)
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Copia as definições do Maven e o código-fonte
COPY pom.xml .
COPY src ./src

# Compila e empacota o fat/uber JAR ignorando os testes unitários
RUN mvn clean package -DskipTests

# Etapa 2: Runtime (Apenas o JRE 21 para uma imagem mais leve e segura)
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copia o JAR gerado no estágio anterior
# (Substitua servico-javamail.jar pelo nome definido na tag <finalName> do seu pom.xml)
COPY --from=builder /app/jar/servico-javamail.jar app.jar

# Executa o fat JAR diretamente
ENTRYPOINT ["java", "-jar", "app.jar"]