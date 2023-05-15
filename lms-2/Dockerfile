# Используем базовый образ с Java 11 и Maven
FROM maven:3.8.3-jdk-11-slim AS build
WORKDIR /app

# Копируем исходный код приложения
COPY src /app/src
COPY pom.xml /app

# Загружаем зависимости и собираем приложение
RUN mvn clean package -DskipTests

# Используем базовый образ с Java 11
FROM openjdk:11-jre-slim
WORKDIR /app

# Копируем собранные файлы из предыдущего этапа
COPY --from=build /app/target/LMS-system-2-0.0.1-SNAPSHOT.jar /app/app.jar

# Запускаем приложение при запуске контейнера
ENTRYPOINT ["java", "-jar", "app.jar"]