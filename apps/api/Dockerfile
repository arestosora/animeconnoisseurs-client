# Usa una imagen base de Node.js
FROM node:latest

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Construye el proyecto
RUN npm run build

# Expone el puerto de la API
EXPOSE 3000

# Comando para correr la aplicación
CMD ["npm", "run", "start:prod"]
