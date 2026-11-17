# Sistema Backend de Turnos y Reservas

Proyecto desarrollado para **Backend 1 de Coderhouse**. Consiste en una API REST para administrar servicios, reservas y mensajes, con persistencia en **MongoDB mediante Mongoose**, arquitectura en capas, vistas renderizadas en el servidor con **Handlebars** y actualizaciones en tiempo real con **Socket.io**.

La API REST de las entregas anteriores se mantiene intacta: las vistas y los eventos en tiempo real se agregan por encima, reutilizando las mismas capas.

## Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express:** framework para desarrollar el servidor y la API REST.
- **MongoDB Atlas:** base de datos NoSQL.
- **Mongoose:** ODM para definir esquemas, modelos y realizar operaciones sobre MongoDB.
- **Express Handlebars:** motor de plantillas para renderizar vistas HTML desde el servidor.
- **Socket.io:** comunicación en tiempo real entre el servidor y los clientes conectados.
- **dotenv:** carga de variables de entorno desde el archivo `.env`.
- **node:test:** ejecutor de pruebas incluido en Node.js (no requiere dependencias adicionales).
- **JavaScript ES Modules (ESM):** sistema de módulos utilizado por el proyecto.
- **Postman:** herramienta para probar manualmente los endpoints de la API.

## Funcionalidades

### API REST

- **Servicios:** listar (con filtros por categoría y disponibilidad), obtener por id, crear, modificar y eliminar.
- **Reservas:** listar, obtener por id, crear, modificar, eliminar y agregar servicios a una reserva. Las lecturas devuelven los servicios de la reserva completos mediante `populate`.
- **Mensajes:** listar (con filtro por usuario), obtener por id, crear, modificar y eliminar.

### Vistas con Handlebars

- Listado de servicios obtenidos desde MongoDB.
- Vista con el detalle de un servicio.
- Formulario para crear un servicio.
- Formulario para modificar un servicio.
- Listado de reservas obtenidas desde MongoDB, con el nombre de cada servicio reservado.
- Vista de mensajes con formulario para enviar y botón para eliminar.
- Página de error para rutas de vistas con id inexistente o inválido.

Las vistas utilizan los Services de la aplicación para obtener los datos. No consultan directamente los modelos ni la base de datos, y no contienen datos hardcodeados.

### Socket.io

El servidor HTTP se crea a partir de Express y se integra con Socket.io. Cada acción real del sistema (crear, modificar o eliminar un servicio, una reserva o un mensaje) emite un evento desde el controller correspondiente, **después** de que la operación se completó correctamente. El archivo `src/public/js/socket.js` escucha esos eventos en el navegador y actualiza el DOM sin recargar la página.

No se emite ningún evento genérico al conectarse un cliente: todos los eventos responden a una acción del sistema.

## Arquitectura del proyecto

Se mantiene la arquitectura en capas implementada en los módulos anteriores:

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
MODELS
   ↓
MONGODB
```

### Responsabilidades

- **Routes:** definen los endpoints y conectan cada ruta con el controller correspondiente.
- **Controllers:** reciben los datos de la solicitud HTTP, invocan los Services y construyen la respuesta HTTP o renderizan una vista. Los controllers de la API también emiten los eventos de Socket.io.
- **Services:** contienen las validaciones y reglas de negocio. No dependen de `req` ni de `res`, ni realizan consultas directas a MongoDB.
- **Repositories:** desacoplan la lógica de negocio de la implementación de persistencia y delegan las operaciones al DAO.
- **DAO:** implementan las operaciones de acceso a datos utilizando Mongoose.
- **Models:** definen los esquemas y modelos que representan las colecciones de MongoDB.

Las dependencias se crean mediante instancias e inyección por constructor. Los routers conectan las capas para que los controllers trabajen con Services y no accedan directamente a los DAO o modelos. El controller de vistas usa los mismos Services que los controllers de la API.

## Estructura del proyecto

```text
backend1-project-for-coderhouse/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── test/
│   ├── bookings.service.test.js
│   └── messages.service.test.js
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   ├── database.config.js
    │   └── env.config.js
    ├── controllers/
    │   ├── bookings.controller.js
    │   ├── messages.controller.js
    │   ├── services.controller.js
    │   └── views.controller.js
    ├── dao/
    │   ├── bookings.mongo.dao.js
    │   ├── messages.mongo.dao.js
    │   ├── services.mongo.dao.js
    │   └── models/
    │       ├── booking.model.js
    │       ├── message.model.js
    │       └── service.model.js
    ├── public/
    │   ├── css/
    │   │   └── styles.css
    │   └── js/
    │       └── socket.js
    ├── repositories/
    │   ├── bookings.repository.js
    │   ├── messages.repository.js
    │   └── services.repository.js
    ├── routes/
    │   ├── bookings.router.js
    │   ├── messages.router.js
    │   ├── services.router.js
    │   └── views.router.js
    ├── services/
    │   ├── bookings.service.js
    │   ├── messages.service.js
    │   └── services.service.js
    ├── utils/
    │   ├── createError.js
    │   ├── emitEvent.js
    │   ├── formatDate.js
    │   ├── sendError.js
    │   └── sendViewError.js
    └── views/
        ├── layouts/
        │   └── main.handlebars
        ├── bookings.handlebars
        ├── create-service.handlebars
        ├── edit-service.handlebars
        ├── error.handlebars
        ├── messages.handlebars
        ├── service-details.handlebars
        └── services.handlebars
```

## Configuración e instalación

### Requisitos previos

- Node.js instalado.
- Una instancia de MongoDB Atlas o una instancia de MongoDB accesible.
- Una base de datos y un usuario con permisos de conexión.

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

Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`:

```env
PORT=8080
NODE_ENV=development
APP_NAME=Sistema Backend de Turnos y Reservas
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>/<database>?retryWrites=true&w=majority
```

Reemplazar los valores de ejemplo de `MONGO_URI` por las credenciales y los datos del propio clúster. No subir el archivo `.env` ni publicar credenciales reales.

En MongoDB Atlas también se debe configurar el acceso de red y contar con un usuario de base de datos con los permisos necesarios.

### 4. Iniciar la aplicación

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

Por defecto, la aplicación utiliza el puerto `8080`.

Al iniciar, el servidor establece la conexión con MongoDB antes de comenzar a escuchar solicitudes HTTP.

## Variables de entorno

| Variable    | Descripción                                              |
| ----------- | -------------------------------------------------------- |
| `PORT`      | Puerto del servidor. Por defecto, `8080`.                |
| `NODE_ENV`  | Entorno de ejecución. Por defecto, `development`.        |
| `APP_NAME`  | Nombre de la aplicación mostrado al iniciar el servidor. |
| `MONGO_URI` | URI de conexión a MongoDB. Es obligatoria.               |

## Modelos de datos

Los modelos de Mongoose se encuentran en `src/dao/models/`.

### Service

Archivo: `src/dao/models/service.model.js`

Representa los servicios que se pueden reservar.

| Campo         | Tipo    | Descripción                                   |
| ------------- | ------- | --------------------------------------------- |
| `name`        | String  | Nombre del servicio. Obligatorio.             |
| `description` | String  | Descripción. Obligatoria.                     |
| `duration`    | Number  | Duración del servicio. Obligatoria, mínimo 1. |
| `price`       | Number  | Precio. Obligatorio, mínimo 0.                |
| `category`    | String  | Categoría. Obligatoria.                       |
| `available`   | Boolean | Disponibilidad. Por defecto `true`.           |

El esquema utiliza `timestamps: true` para generar `createdAt` y `updatedAt`, y `versionKey: false` para omitir el campo `__v`.

### Booking

Archivo: `src/dao/models/booking.model.js`

Representa las reservas realizadas por los clientes.

| Campo         | Tipo   | Descripción                                        |
| ------------- | ------ | -------------------------------------------------- |
| `clientName`  | String | Nombre del cliente. Obligatorio.                   |
| `clientEmail` | String | Correo electrónico del cliente. Obligatorio.       |
| `date`        | String | Fecha con formato `YYYY-MM-DD`.                    |
| `time`        | String | Hora con formato `HH:mm`.                          |
| `status`      | String | Estado de la reserva.                              |
| `services`    | Array  | Servicios asociados a la reserva y sus cantidades. |

Cada elemento del array `services` contiene:

```javascript
{
  service: ObjectId,
  quantity: Number
}
```

El campo `service` almacena el identificador de un documento de la colección de servicios mediante una referencia de Mongoose (`ref: "services"`). `quantity` representa la cantidad del servicio y tiene un mínimo de `1`.

**Uso de `populate`:** el DAO de reservas aplica `populate("services.service")` en las lecturas (`getAll`, `getById` desde `getBookingById`) y en la actualización. Por eso `GET /api/bookings`, `GET /api/bookings/:bid`, `PUT /api/bookings/:bid`, `POST /api/bookings/:bid/services/:sid` y la vista de reservas devuelven cada servicio con sus datos completos (nombre, precio, duración, etc.) en lugar de solo el `ObjectId`. Si un servicio referenciado fue eliminado, `service` queda en `null` y la vista muestra "Servicio eliminado".

Internamente, `addServiceToBooking` lee la reserva **sin** `populate`, porque necesita los `ObjectId` originales para comparar y reescribir el array de servicios.

### Message

Archivo: `src/dao/models/message.model.js`

| Campo     | Tipo   | Descripción                                    |
| --------- | ------ | ---------------------------------------------- |
| `user`    | String | Nombre de quien envía el mensaje. Obligatorio. |
| `message` | String | Texto del mensaje. Obligatorio, máximo 500.    |

El esquema utiliza `timestamps: true` y `versionKey: false`. Cuenta con toda su capa funcional: DAO, repository, service, controller, router y vista.

## Endpoints de la API REST

URL base local:

```text
http://localhost:8080
```

Todas las respuestas tienen el formato `{ "status": "success", "payload": ... }` o, en caso de error, `{ "status": "error", "message": "..." }` (generado por `sendError`).

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

Body JSON de ejemplo:

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

El identificador es generado por MongoDB. No se debe enviar un `id` numérico en el body.

#### Actualizar un servicio

`PUT /api/services/:sid`

Body JSON de ejemplo:

```json
{
  "price": 9500,
  "available": false
}
```

Se pueden enviar los campos que se desean modificar. El identificador se recibe mediante el parámetro `sid`.

#### Filtrar servicios

El endpoint `GET /api/services` permite combinar los filtros `category` y `available`.

```http
GET /api/services?category=Barberia
GET /api/services?available=true
GET /api/services?available=false
GET /api/services?category=Barberia&available=true
```

El valor de `available` llega como texto desde la query string. El Service valida que sea `true` o `false`, y el DAO lo convierte a booleano para construir el filtro de MongoDB.

### Reservas

Prefijo: `/api/bookings`

| Método   | Endpoint                           | Descripción                                          |
| -------- | ---------------------------------- | ---------------------------------------------------- |
| `GET`    | `/api/bookings`                    | Obtiene todas las reservas (con servicios populados). |
| `POST`   | `/api/bookings`                    | Crea una reserva.                                    |
| `GET`    | `/api/bookings/:bid`               | Obtiene una reserva por su ObjectId.                 |
| `PUT`    | `/api/bookings/:bid`               | Modifica los datos de una reserva.                   |
| `DELETE` | `/api/bookings/:bid`               | Elimina una reserva.                                 |
| `POST`   | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva.                    |

#### Crear una reserva

`POST /api/bookings`

Body JSON de ejemplo:

```json
{
  "clientName": "Juan Pérez",
  "clientEmail": "juan@example.com",
  "date": "2026-12-15",
  "time": "14:30"
}
```

El estado inicial se establece desde `BookingsService` y el array `services` comienza vacío.

#### Modificar una reserva

`PUT /api/bookings/:bid`

Body JSON de ejemplo:

```json
{
  "time": "16:00",
  "status": "confirmed"
}
```

Se pueden enviar uno o más de estos campos: `clientName`, `clientEmail`, `date`, `time` y `status`. Se aplican las mismas validaciones de formato que al crear (fecha `YYYY-MM-DD` válida y hora `HH:mm`). El array `services` no se modifica desde este endpoint: para eso se usa `POST /api/bookings/:bid/services/:sid`. Los campos que no pertenecen a la lista se ignoran; si no se envía ninguno válido, la respuesta es `400`.

#### Eliminar una reserva

`DELETE /api/bookings/:bid` elimina la reserva y devuelve el documento eliminado.

#### Agregar un servicio a una reserva

`POST /api/bookings/:bid/services/:sid`

Los identificadores de la reserva y del servicio se envían como parámetros de la URL. Si el servicio ya está asociado a la reserva, se incrementa su cantidad; si no está asociado, se agrega con cantidad inicial `1`. La respuesta devuelve la reserva actualizada con los servicios populados.

### Mensajes

Prefijo: `/api/messages`

| Método   | Endpoint             | Descripción                          |
| -------- | -------------------- | ------------------------------------ |
| `GET`    | `/api/messages`      | Obtiene todos los mensajes.          |
| `GET`    | `/api/messages/:mid` | Obtiene un mensaje por su ObjectId.  |
| `POST`   | `/api/messages`      | Crea un mensaje.                     |
| `PUT`    | `/api/messages/:mid` | Modifica un mensaje existente.       |
| `DELETE` | `/api/messages/:mid` | Elimina un mensaje.                  |

Los mensajes se devuelven ordenados del más antiguo al más reciente. `GET /api/messages?user=Ana` filtra por usuario.

Body JSON de ejemplo para `POST /api/messages`:

```json
{
  "user": "Ana",
  "message": "Hola, quiero consultar por un turno"
}
```

`PUT /api/messages/:mid` acepta `user`, `message` o ambos.

## Vistas con Handlebars

Handlebars se configura como motor de plantillas en `src/app.js`. Las vistas se encuentran en `src/views/` y se renderizan a través de `ViewsController`.

Prefijo de las rutas: `/views`

| Método | Ruta                      | Descripción                                                    |
| ------ | ------------------------- | -------------------------------------------------------------- |
| `GET`  | `/views/services`         | Renderiza el listado de servicios consultados desde MongoDB.   |
| `GET`  | `/views/services/:id`     | Renderiza el detalle de un servicio.                           |
| `GET`  | `/views/create-service`   | Renderiza el formulario de creación.                           |
| `GET`  | `/views/edit-service/:id` | Renderiza el formulario de edición con los datos del servicio. |
| `GET`  | `/views/bookings`         | Renderiza el listado de reservas con sus servicios.            |
| `GET`  | `/views/messages`         | Renderiza los mensajes y el formulario para enviar uno nuevo.  |

### Archivos principales de las vistas

- `src/views/layouts/main.handlebars`: layout principal compartido (navegación y scripts de Socket.io).
- `src/views/services.handlebars`: listado de servicios. Presenta nombre, descripción, duración, precio, categoría y disponibilidad.
- `src/views/service-details.handlebars`: detalle de un servicio y acciones para modificarlo o eliminarlo.
- `src/views/create-service.handlebars`: formulario para crear un servicio mediante la API REST.
- `src/views/edit-service.handlebars`: formulario para modificar un servicio mediante la API REST.
- `src/views/bookings.handlebars`: listado de reservas con cliente, fecha, hora, estado y servicios.
- `src/views/messages.handlebars`: listado de mensajes y formulario de envío (usa `POST /api/messages`).
- `src/views/error.handlebars`: página que se muestra cuando una vista falla (por ejemplo, un servicio inexistente).
- `src/controllers/views.controller.js`: obtiene la información a través de los Services y la envía a las vistas. No contiene lógica de negocio.

Las vistas no implementan lógica de persistencia: las operaciones de lectura pasan por la arquitectura de Services, Repositories y DAO. Los formularios de creación, edición y eliminación consumen los endpoints REST existentes.

## Recursos estáticos

Express sirve los recursos estáticos desde `src/public/`.

- `src/public/css/styles.css`: estilos de las vistas.
- `src/public/js/socket.js`: cliente que establece la conexión con Socket.io, escucha los eventos emitidos por el servidor y actualiza el DOM.

## Integración de Socket.io

La configuración se encuentra en `src/server.js`.

1. Se establece la conexión con MongoDB.
2. Se crea un servidor HTTP a partir de la aplicación Express mediante `createServer(app)`.
3. Se instancia Socket.io sobre ese servidor HTTP.
4. Se guarda la instancia de Socket.io en Express mediante `app.set("io", io)`, para que los controllers puedan emitir eventos.
5. Se escucha la conexión y desconexión de clientes (solo para registrarlas en consola).

Los controllers emiten los eventos mediante la utilidad `src/utils/emitEvent.js`, que obtiene `io` desde la aplicación Express. Si no hay un servidor Socket.io configurado, simplemente no emite nada y la API sigue funcionando.

### Eventos implementados

| Evento           | Se emite cuando...                                  | Payload                          | Efecto en el navegador                                  |
| ---------------- | --------------------------------------------------- | -------------------------------- | ------------------------------------------------------- |
| `serviceCreated` | se crea un servicio (`POST /api/services`)          | servicio creado                  | agrega la tarjeta al listado de servicios               |
| `serviceUpdated` | se modifica un servicio (`PUT /api/services/:sid`)  | servicio actualizado             | actualiza la tarjeta y la vista de detalle              |
| `serviceDeleted` | se elimina un servicio (`DELETE /api/services/:sid`)| id del servicio                  | quita la tarjeta; avisa en la vista de detalle          |
| `bookingCreated` | se crea una reserva (`POST /api/bookings`)          | reserva creada                   | agrega la reserva al listado                            |
| `bookingUpdated` | se modifica una reserva o se le agrega un servicio  | reserva con servicios populados  | reemplaza la reserva en el listado                      |
| `bookingDeleted` | se elimina una reserva (`DELETE /api/bookings/:bid`)| id de la reserva                 | quita la reserva del listado                            |
| `messageCreated` | se crea un mensaje (`POST /api/messages`)           | mensaje creado                   | agrega el mensaje a la lista                            |
| `messageUpdated` | se modifica un mensaje (`PUT /api/messages/:mid`)   | mensaje actualizado              | actualiza el mensaje en la lista                        |
| `messageDeleted` | se elimina un mensaje (`DELETE /api/messages/:mid`) | id del mensaje                   | quita el mensaje de la lista                            |

Los eventos se emiten después de que el Service completa la operación y devuelve el resultado, de manera que no se notifica una acción que haya fallado. El listado de servicios respeta los filtros de la URL (`?category=...&available=...`): un servicio que no cumple el filtro no se agrega a la vista.

## Pruebas

### Pruebas automáticas

```bash
npm test
```

Ejecuta con `node --test` las pruebas de `test/`. Verifican las validaciones y los códigos de error de `BookingsService` y `MessagesService` usando repositorios en memoria. Estas pruebas no requieren conexión a MongoDB gracias a la inyección de dependencias por constructor.

### Validación manual de los endpoints (Postman)

1. Iniciar el servidor con `npm run dev`.
2. Enviar las siguientes solicitudes y comparar con los códigos esperados:

| Solicitud                                                    | Código esperado |
| ------------------------------------------------------------ | --------------- |
| `POST /api/services` con body válido                         | `201`           |
| `POST /api/services` con `name` vacío                        | `400`           |
| `GET /api/services/abc`                                      | `400`           |
| `POST /api/bookings` con body válido                         | `201`           |
| `POST /api/bookings` con `time` `"25:00"` o `date` inexistente | `400`         |
| `GET /api/bookings`                                          | `200`           |
| `GET /api/bookings/:bid` (existente)                         | `200`           |
| `GET /api/bookings/<id inexistente>`                         | `404`           |
| `GET /api/bookings/abc`                                      | `400`           |
| `POST /api/bookings/:bid/services/:sid`                      | `201`           |
| `PUT /api/bookings/:bid` con `{ "time": "16:00" }`           | `200`           |
| `PUT /api/bookings/:bid` con `{}`                            | `400`           |
| `PUT /api/bookings/<id inexistente>`                         | `404`           |
| `DELETE /api/bookings/:bid` (existente)                      | `200`           |
| `DELETE /api/bookings/:bid` (repetido)                       | `404`           |
| `POST /api/messages` con `user` y `message`                  | `201`           |
| `POST /api/messages` sin `message`                           | `400`           |
| `GET /api/messages`                                          | `200`           |
| `GET /api/messages/<id inexistente>`                         | `404`           |
| `PUT /api/messages/:mid` con `{ "message": "nuevo texto" }`  | `200`           |
| `DELETE /api/messages/:mid`                                  | `200`           |
| `GET /api/ruta-inexistente`                                  | `404`           |

### Probar las vistas

1. Abrir `http://localhost:8080/views/services` y comprobar que se muestran los servicios almacenados en MongoDB.
2. Abrir el detalle de un servicio y probar los formularios de creación y edición.
3. Abrir `http://localhost:8080/views/bookings` y comprobar que cada reserva muestra el nombre de sus servicios.
4. Abrir `http://localhost:8080/views/messages`.
5. Abrir `http://localhost:8080/views/services/abc` y comprobar que se muestra la página de error.

### Probar Socket.io

1. Abrir `http://localhost:8080/views/services` en dos ventanas o navegadores.
2. Crear un servicio desde el formulario (o con Postman): debe aparecer en la otra ventana sin recargar.
3. Modificarlo o eliminarlo y comprobar que la otra ventana se actualiza.
4. Abrir `http://localhost:8080/views/bookings` y crear una reserva o agregarle un servicio con Postman: la vista se actualiza sola.
5. Abrir `http://localhost:8080/views/messages` en dos ventanas y enviar un mensaje desde una de ellas: aparece en ambas.

## Consideraciones

- La persistencia se realiza en MongoDB mediante Mongoose; no se utiliza FileSystem para almacenar servicios, reservas o mensajes.
- Los identificadores de los documentos son ObjectId generados por MongoDB.
- La API REST se conserva y funciona de manera independiente de las vistas.
- Las vistas consumen los Services existentes y no consultan directamente los modelos.
- `populate()` se utiliza en las reservas para devolver los servicios completos. La base queda preparada para sumar filtros, paginación y ordenamiento en una próxima etapa.
- Las reservas conservan la referencia a un servicio aunque este se elimine; en ese caso la vista indica "Servicio eliminado".
