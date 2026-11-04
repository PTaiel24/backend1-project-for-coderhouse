# Sistema Backend de Turnos y Reservas

API REST desarrollada como proyecto del módulo **Backend 1 de Coderhouse**. Permite administrar servicios y reservas, utilizando **Node.js, Express, MongoDB Atlas y Mongoose**.

Esta versión migra la persistencia de archivos JSON a MongoDB, manteniendo los endpoints principales de servicios y reservas y la arquitectura en capas desarrollada en las entregas anteriores.

## Tecnologías utilizadas

- **Node.js**: entorno de ejecución de JavaScript.
- **Express**: framework para construir la API REST.
- **MongoDB Atlas**: base de datos NoSQL alojada en la nube.
- **Mongoose**: ODM para definir esquemas, modelos y operaciones sobre MongoDB.
- **dotenv**: carga de variables de entorno.
- **JavaScript ES Modules (ESM)**: sistema de módulos utilizado por el proyecto.
- **Postman**: herramienta sugerida para realizar pruebas manuales de los endpoints.

## Arquitectura

El proyecto mantiene separación de responsabilidades mediante el siguiente flujo:

```text
ROUTES
  ↓
CONTROLLERS
  ↓
SERVICES
  ↓
REPOSITORIES
  ↓
DAO
  ↓
MONGODB ATLAS
```

### Responsabilidad de cada capa

- **Routes:** declaran los endpoints y vinculan cada ruta con el método correspondiente del controller.
- **Controllers:** reciben la solicitud HTTP, obtienen parámetros, query parameters y datos del body; invocan al Service y construyen la respuesta HTTP.
- **Services:** contienen las validaciones y reglas de negocio. No acceden directamente a MongoDB ni dependen de `req` o `res`.
- **Repositories:** desacoplan los Services de la tecnología de persistencia y delegan las operaciones al DAO.
- **DAO:** implementa las operaciones de persistencia utilizando los modelos de Mongoose.
- **Models:** definen los esquemas y modelos que representan las colecciones de MongoDB.

Las dependencias se conectan mediante inyección por constructor: los routers instancian los DAO, los entregan a los Repository y luego estos se inyectan en los Services y Controllers.

## Estructura del proyecto

```text
backend1-project-for-coderhouse/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   ├── database.config.js
    │   └── env.config.js
    ├── controllers/
    │   ├── bookings.controller.js
    │   └── services.controller.js
    ├── dao/
    │   ├── bookings.mongo.dao.js
    │   ├── services.mongo.dao.js
    │   └── models/
    │       ├── booking.model.js
    │       ├── message.model.js
    │       └── service.model.js
    ├── repositories/
    │   ├── bookings.repository.js
    │   └── services.repository.js
    ├── routes/
    │   ├── bookings.router.js
    │   └── services.router.js
    ├── services/
    │   ├── bookings.service.js
    │   └── services.service.js
    └── utils/
        ├── createError.js
        └── sendError.js
```

## Configuración de MongoDB Atlas

La aplicación utiliza una URI de conexión almacenada en la variable de entorno `MONGO_URI`.

La conexión se encuentra centralizada en `src/config/database.config.js` y se ejecuta antes de iniciar el servidor.

### Variables de entorno

El proyecto incluye `.env.example` como plantilla. Las variables utilizadas son:

| Variable    | Descripción                                                                 |
| ----------- | --------------------------------------------------------------------------- |
| `PORT`      | Puerto en el que se inicia el servidor. Si no se define, se utiliza `8080`. |
| `NODE_ENV`  | Entorno de ejecución. Por defecto, `development`.                           |
| `APP_NAME`  | Nombre de la aplicación mostrado al iniciar el servidor.                    |
| `MONGO_URI` | URI de conexión a MongoDB Atlas.                                            |

Crear un archivo `.env` en la raíz del proyecto y completar los valores:

```env
PORT=8080
NODE_ENV=development
APP_NAME=Sistema Backend de Turnos y Reservas
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>/<database>?retryWrites=true&w=majority
```

Reemplazar los valores de ejemplo de `MONGO_URI` por los datos de conexión del propio clúster de MongoDB Atlas. No publicar credenciales reales.

En MongoDB Atlas también se debe configurar el acceso de red y disponer de un usuario de base de datos con permisos adecuados.

## Modelos de Mongoose

Los modelos se encuentran en `src/dao/models/` y representan las colecciones utilizadas por la aplicación.

### Service

Archivo: `src/dao/models/service.model.js`

Representa los servicios disponibles para reservar.

| Campo         | Tipo    | Características                                     |
| ------------- | ------- | --------------------------------------------------- |
| `name`        | String  | Obligatorio, elimina espacios al inicio y al final. |
| `description` | String  | Obligatorio, elimina espacios al inicio y al final. |
| `duration`    | Number  | Obligatorio, mínimo 1.                              |
| `price`       | Number  | Obligatorio, mínimo 0.                              |
| `category`    | String  | Obligatorio, elimina espacios al inicio y al final. |
| `available`   | Boolean | Por defecto `true`.                                 |

El esquema utiliza `timestamps: true` para generar `createdAt` y `updatedAt`, y `versionKey: false` para omitir `__v`.

### Booking

Archivo: `src/dao/models/booking.model.js`

Representa las reservas realizadas por los clientes.

| Campo         | Tipo   | Características                                           |
| ------------- | ------ | --------------------------------------------------------- |
| `clientName`  | String | Obligatorio.                                              |
| `clientEmail` | String | Obligatorio.                                              |
| `date`        | String | Obligatorio, formato `YYYY-MM-DD` validado en el Service. |
| `time`        | String | Obligatorio, formato `HH:mm` validado en el Service.      |
| `status`      | String | Obligatorio.                                              |
| `services`    | Array  | Lista de servicios asociados a la reserva.                |

Los servicios no se guardan como objetos completos. Cada elemento del array tiene la siguiente estructura:

```javascript
{
  service: ObjectId,
  quantity: Number
}
```

El campo `service` referencia un documento de la colección de servicios mediante `ref: "services"`. El campo `quantity` es obligatorio y tiene un mínimo de `1`.

Al crear una reserva, el array `services` comienza vacío y el estado inicial se establece en `success` desde `BookingsService`.

### Message

Archivo: `src/dao/models/message.model.js`

Define el modelo para los mensajes, con los siguientes campos:

| Campo     | Tipo   | Características |
| --------- | ------ | --------------- |
| `user`    | String | Obligatorio.    |
| `message` | String | Obligatorio.    |

También utiliza timestamps y desactiva `__v`.

**Alcance actual:** el modelo Message está definido, pero esta versión no incluye DAO, Repository, Service, Controller ni endpoints para administrar mensajes. La consigna de esta entrega especifica los endpoints obligatorios de `services` y `bookings`.

## Endpoints de la API

La URL base local es:

```text
http://localhost:8080
```

### Servicios

Prefijo: `/api/services`

| Método   | Endpoint             | Descripción                          |
| -------- | -------------------- | ------------------------------------ |
| `GET`    | `/api/services`      | Obtiene todos los servicios.         |
| `GET`    | `/api/services/:sid` | Obtiene un servicio por su ObjectId. |
| `POST`   | `/api/services`      | Crea un servicio.                    |
| `PUT`    | `/api/services/:sid` | Actualiza un servicio existente.     |
| `DELETE` | `/api/services/:sid` | Elimina un servicio.                 |

#### Crear un servicio

`POST /api/services`

Body:

```json
{
  "name": "Corte de cabello",
  "description": "Corte personalizado",
  "duration": 45,
  "price": 8500,
  "category": "Barberia",
  "available": true
}
```

El identificador lo genera MongoDB. No se debe enviar un `id` numérico en el body.

#### Actualizar un servicio

`PUT /api/services/:sid`

Body de ejemplo:

```json
{
  "price": 9500,
  "available": false
}
```

La actualización permite enviar los campos que se desean modificar. El identificador se recibe mediante el parámetro `sid`.

#### Filtrar servicios

El endpoint `GET /api/services` permite combinar los filtros `category` y `available`.

Ejemplos:

```http
GET /api/services?category=Barberia
```

```http
GET /api/services?available=true
```

```http
GET /api/services?available=false
```

```http
GET /api/services?category=Barberia&available=true
```

`available` se recibe como texto en la query string y el Service valida que su valor sea exactamente `true` o `false`. El DAO convierte ese valor a booleano y construye el filtro que utiliza `ServiceModel.find()`.

Cuando se envían ambos filtros, MongoDB devuelve los servicios que cumplen simultáneamente las dos condiciones.

### Reservas

Prefijo: `/api/bookings`

| Método | Endpoint                           | Descripción                          |
| ------ | ---------------------------------- | ------------------------------------ |
| `POST` | `/api/bookings`                    | Crea una reserva.                    |
| `GET`  | `/api/bookings/:bid`               | Obtiene una reserva por su ObjectId. |
| `POST` | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva.    |

#### Crear una reserva

`POST /api/bookings`

Body:

```json
{
  "clientName": "Ana Pérez",
  "clientEmail": "ana@example.com",
  "date": "2026-11-15",
  "time": "10:30"
}
```

Validaciones implementadas:

- El body debe ser un objeto JSON.
- `clientName` y `clientEmail` deben ser strings no vacíos.
- La fecha debe respetar el formato `YYYY-MM-DD` y representar una fecha válida.
- La hora debe respetar el formato `HH:mm`.
- El estado inicial se asigna como `success`.
- El array `services` se inicializa vacío.

#### Agregar un servicio a una reserva

`POST /api/bookings/:bid/services/:sid`

Los parámetros son:

- `bid`: ObjectId de la reserva.
- `sid`: ObjectId del servicio que se desea agregar.

La operación comprueba que los identificadores tengan un formato válido y que existan la reserva y el servicio.

Si el servicio todavía no está asociado a la reserva, se agrega con `quantity: 1`. Si ya existe, se incrementa su cantidad en una unidad.

Ejemplo conceptual de la estructura almacenada:

```json
{
  "services": [
    {
      "service": "65f1a8c9d4e7b123456789ab",
      "quantity": 2
    }
  ]
}
```

El valor de `service` debe corresponder al ObjectId de un documento existente en la colección de servicios.

**Nota:** el endpoint `GET /api/bookings/:bid` devuelve las referencias almacenadas como ObjectId; actualmente no utiliza `populate()` para reemplazarlas por documentos completos.

## Respuestas y manejo de errores

Las respuestas exitosas utilizan una estructura JSON con `status` y `payload`.

Ejemplo:

```json
{
  "status": "success",
  "payload": {}
}
```

Los errores se procesan mediante `createError.js` y `sendError.js`. Las respuestas de error tienen esta estructura:

```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

Entre los casos contemplados por los Services se encuentran los datos inválidos, los identificadores con formato incorrecto y los recursos inexistentes.

## Instalación y ejecución

### Requisitos previos

- Node.js instalado.
- npm instalado.
- Una cuenta y un clúster configurado en MongoDB Atlas.
- Acceso de red habilitado en Atlas para el entorno desde el que se ejecuta la aplicación.

### 1. Clonar el repositorio

```bash
git clone https://github.com/PTaiel24/backend1-project-for-coderhouse.git
cd backend1-project-for-coderhouse
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

Crear el archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`, y completar `MONGO_URI` junto con las demás variables.

### 4. Iniciar el servidor

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

El servidor intenta establecer la conexión con MongoDB antes de comenzar a escuchar solicitudes. Si la conexión falla, la aplicación no inicia.

Con `PORT=8080`, la API queda disponible en:

```text
http://localhost:8080
```

La ruta raíz `GET /` devuelve un mensaje de bienvenida.

## Pruebas manuales recomendadas

Se pueden realizar pruebas con Postman. Se recomienda verificar:

1. Crear un servicio con datos válidos.
2. Consultar todos los servicios.
3. Consultar un servicio mediante su ObjectId.
4. Filtrar por `category`.
5. Filtrar por `available=true` y `available=false`.
6. Combinar ambos filtros.
7. Enviar un valor inválido para `available` y comprobar la respuesta de error.
8. Actualizar un servicio y verificar que los cambios persistan.
9. Eliminar un servicio.
10. Crear una reserva.
11. Consultar una reserva mediante su ObjectId.
12. Agregar un servicio existente a una reserva.
13. Agregar nuevamente el mismo servicio y comprobar que aumente `quantity`.
14. Probar identificadores con formato incorrecto y recursos inexistentes.
15. Reiniciar el servidor y verificar que los datos continúen almacenados en MongoDB.

El script `npm test` todavía es un marcador de posición: no hay una suite de pruebas automatizadas configurada en esta versión.

## Seguridad y archivos excluidos

El repositorio debe incluir `.env.example`, pero no debe publicar:

- `.env` ni credenciales reales de MongoDB Atlas.
- `node_modules/`.

El archivo `.gitignore` contempla `.env` y `node_modules`. Antes de publicar, verificar que ningún secreto haya sido agregado previamente al historial de Git.

## Alcance de esta entrega

Esta etapa reemplaza la persistencia activa basada en archivos JSON por MongoDB Atlas mediante Mongoose. Se mantienen los endpoints de servicios y reservas indicados en la consigna y se conserva la separación por capas.

Los modelos `Service`, `Booking` y `Message` están definidos. La funcionalidad HTTP implementada en esta versión corresponde a `services` y `bookings`; el modelo `Message` queda preparado para una futura implementación de su flujo completo.
