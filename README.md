# Iniciando el proyecto
# Instrucciones para Iniciar el Proyecto

Para iniciar el proyecto, sigue estos pasos:

1. **Instalar Dependencias**: 
   Primero, necesitas instalar todas las dependencias necesarias. Ejecuta el siguiente comando en la terminal:

   ```bash
   npm install
   ```
2. **Iniciar la Aplicación**: Una vez que las dependencias estén instaladas, puedes iniciar la aplicación de dos maneras:

* Usando el comando ```npm start```

* O ejecutando directamente el archivo app.js con Node.js:
```bash
node src/app.js
```
# .env
## Estructura del Archivo

El archivo `.env` debe contener las siguientes variables:

```plaintext
PORT=
MONGO_URL=
```
## Descripción de las Variables
* PORT:

Esta variable define el puerto en el que la aplicación escuchará las solicitudes.
* MONGO_URL:

Esta variable contiene la URL de conexión a la base de datos MongoDB. Debe incluir el protocolo (mongodb:// o mongodb+srv://), el nombre de usuario, la contraseña, y la dirección del servidor de la base de datos. Por ejemplo:
```
MONGO_URL=mongodb://username:password@localhost:27017/mydatabase
```
## Ubicación del Archivo
El archivo .env debe ubicarse en la siguiente ruta dentro:
```
src/config/.env
```
# Documentación del Endpoints

## Endpoint
`GET /api/mocks/mockingpets?count=XX`

### Descripción
Este endpoint genera un conjunto de datos ficticios (mocks) de mascotas que cumplen con las siguientes características:
- **adopted**: false (no adoptadas)
- **owner**: no asignado (sin propietario)

### Parámetros
- **count**: (opcional) Un número entero que indica cuántas mascotas se desean generar. Reemplaza `XX` con el número deseado.

### Respuesta
La respuesta del endpoint será un objeto JSON con el siguiente formato:

```json
{
    "status": "success",
    "payload": [
        {
            "_id": "c5c87ee3dd6e6348a9569a9b",
            "name": "Cookie",
            "specie": "turtle",
            "birthDate": "2023-02-15",
            "adopted": false,
            "image": "https://loremflickr.com/771/3204/pets?lock=3078595576055952"
        },
        ...
    ]
}
```

## Endpoint
`GET /api/mocks/mockingusers?count=XX`

### Descripción
Este endpoint genera un conjunto de datos ficticios (mocks) de usuarios. Si no se especifica el parámetro `count`, se generarán 50 usuarios por defecto.

### Parámetros
- **count**: (opcional) Un número entero que indica cuántos usuarios se desean generar. Reemplaza `XX` con el número deseado. Si no se proporciona, se generarán 50 usuarios por defecto.

### Respuesta
La respuesta del endpoint será un objeto JSON con el siguiente formato:

```json
{
    "status": "success",
    "payload": [
        {
            "_id": "2c47b6fb767ad2c5bdcf52c8",
            "first_name": "Zoe",
            "last_name": "Garza Sevilla",
            "email": "Susana43@yahoo.com",
            "age": 46,
            "password": "$2b$10$EgDO12XjD1O88dIlfQi72.MfANk0BUaTEhO2k3oCp4EzSQQJ9Qxw6",
            "role": "admin",
            "pets": []
        },
        ...
    ]
} 
```

## Endpoint
`POST /api/mocks/generateData?users=XX&pets=YY`

### Descripción
Este endpoint genera y almacena en MongoDB un conjunto de datos ficticios (mocks) de usuarios y mascotas. Los parámetros `users` y `pets` son obligatorios.

### Parámetros
- **users**: (obligatorio) Un número entero positivo que indica cuántos usuarios se desean generar.
- **pets**: (obligatorio) Un número entero positivo que indica cuántas mascotas se desean generar.

### Respuesta
La respuesta del endpoint será un objeto JSON con el siguiente formato:

```json
{
    "status": "success",
    "payload": "ok"
}
```
o error si hubo algun problema al insertar en MongoDB