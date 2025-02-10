# Proyecto de Administración de Adopciones

Este es un proyecto de administración de adopciones que incluye un sistema de inicio de sesión implementado con JWT (JSON Web Token).

## Instrucciones para Iniciar el Proyecto

Para iniciar el proyecto, sigue estos pasos:

1. **Instalar Dependencias**: 
   Primero, necesitas instalar todas las dependencias necesarias. Ejecuta el siguiente comando en la terminal:

   ```bash
   npm install
   ```
2. **Iniciar la Aplicación**:
    Una vez que las dependencias estén instaladas, puedes iniciar la aplicación de dos maneras:

    Usando el comando npm start

    O ejecutando directamente el archivo app.js con Node.js:

    ```bash
    node src/app.js
    ```
## env
Estructura del Archivo
El archivo .env debe contener las siguientes variables:

    PORT=
    MONGO_URL=

### Descripción de las Variables
* PORT: Esta variable define el puerto en el que la aplicación escuchará las solicitudes.
* MONGO_URL: Esta variable contiene la URL de conexión a la base de datos MongoDB. Debe incluir el protocolo (mongodb:// o mongodb+srv://), el nombre de usuario, la contraseña, y la dirección del servidor de la base de datos. Por ejemplo:
    ```
    MONGO_URL=mongodb://username:password@localhost:27017/mydatabase
    ```
## Instrucciones para Correr en Docker
1. **Construir la Imagen**: Ejecuta el siguiente comando para crear la imagen:
   ```bash
   docker build -t entrega02 .
   ```
2. **Correr el Contenedor**: Una vez que la imagen esté construida, puedes correr el contenedor con el siguiente comando:
    ```bash
    docker run -e "MONGO_URL=mongodb://172.17.0.1/nombredebasededatos" -p 8080:8080 entrega02
    ```
    donde -e es la variable de etorno donde se cuentra MongoDB (mongodb:// o mongodb+srv://).

Nota: Si estás usando otro contenedor con MongoDB o una instalacion local de MongoDB, ten cuidado con la IP que se especifica, ya que Docker utiliza un bridge por defecto.
## Imagen de Dockerhub
La imagen del proyecto está disponible en Docker Hub. Puedes descargarla usando el siguiente comando:
```bash
docker pull gmaldo/entrega02
```
O accediendo a la siguiente URL:
https://hub.docker.com/r/gmaldo/entrega02
## Deploy en Railway
De puede acceder a un deploy en railway en al siguiente URL:
https://railway.com/