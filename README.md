# API REST de Servicios y Reservas — CoderHouse Backend 1

API REST desarrollada para la entrega del módulo **Backend 1 de CoderHouse**.

El proyecto implementa la primera versión funcional de un **Sistema Backend de Turnos y Reservas**, utilizando **Node.js, Express y FileSystem** para gestionar dos recursos principales:

- `services`: servicios disponibles para reservar.
- `bookings`: reservas realizadas por los clientes.

La información se persiste en archivos JSON, permitiendo conservar los datos aunque el servidor sea detenido y vuelto a iniciar.

---

## 🎯 Objetivo del proyecto

El objetivo es desarrollar una API REST capaz de administrar los servicios disponibles y las reservas realizadas por los clientes.

La aplicación permite:

- Consultar todos los servicios.
- Consultar un servicio por su ID.
- Crear nuevos servicios.
- Actualizar servicios existentes.
- Eliminar servicios.
- Crear reservas.
- Consultar reservas por ID.
- Asociar servicios a una reserva.
- Incrementar la cantidad de un servicio cuando se agrega nuevamente a una reserva.
- Validar los datos recibidos.
- Persistir la información utilizando archivos JSON.

Esta implementación corresponde a una primera etapa del sistema, utilizando **FileSystem como mecanismo de persistencia**, antes de incorporar posteriormente otras tecnologías de almacenamiento.

---

# 🛠️ Tecnologías utilizadas

- **Node.js** — entorno de ejecución.
- **Express** — framework utilizado para construir la API REST.
- **JavaScript** — lenguaje utilizado para el desarrollo.
- **ES Modules (ESM)** — sistema de módulos utilizado en el proyecto.
- **dotenv** — gestión de variables de entorno.
- **FileSystem (`fs/promises`)** — lectura y escritura asíncrona de archivos.
- **JSON** — formato utilizado para la persistencia de datos.
- **Postman** — utilizado para probar los endpoints de la API.
- **Git / GitHub** — control de versiones y publicación del proyecto.

---

# 📁 Estructura del proyecto

```text
backend1-project-for-coderhouse/
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
│
└── src/
    │
    ├── app.js
    ├── server.js
    │
    ├── config/
    │   └── env.config.js
    │
    ├── data/
    │   ├── services.json
    │   └── bookings.json
    │
    ├── managers/
    │   ├── ServiceManager.js
    │   └── BookingManager.js
    │
    └── routes/
        ├── services.router.js
        └── bookings.routes.js
```

## Responsabilidad de cada parte

| Archivo / carpeta          | Responsabilidad                                                  |
| -------------------------- | ---------------------------------------------------------------- |
| `src/app.js`               | Configuración de Express, middlewares y registro de los routers. |
| `src/server.js`            | Inicialización del servidor y escucha del puerto configurado.    |
| `src/config/env.config.js` | Carga y validación de las variables de entorno.                  |
| `src/routes/`              | Define los endpoints y recibe las peticiones HTTP.               |
| `src/managers/`            | Contiene la lógica de gestión de cada recurso y la persistencia. |
| `src/data/services.json`   | Almacena los servicios.                                          |
| `src/data/bookings.json`   | Almacena las reservas.                                           |
| `.env.example`             | Ejemplo de las variables de entorno necesarias.                  |
| `.gitignore`               | Archivos y carpetas que no deben subirse al repositorio.         |

---

# 🧩 Arquitectura

El proyecto utiliza una separación de responsabilidades entre las rutas, los managers y los archivos de persistencia.

La comunicación principal sigue el siguiente flujo:

```text
Cliente / Postman
       │
       ▼
    Express
       │
       ▼
     Router
       │
       ▼
    Manager
       │
       ▼
 FileSystem
       │
       ▼
 Archivo JSON
```

Por ejemplo, para obtener un servicio:

```text
GET /api/services/1
        │
        ▼
services.router.js
        │
        ▼
ServiceManager
        │
        ▼
services.json
        │
        ▼
Respuesta JSON
```

De esta manera, las rutas se encargan de recibir y responder las peticiones, mientras que los managers concentran la lógica relacionada con los datos y la persistencia.

---

# 💾 Persistencia con FileSystem

La persistencia de la aplicación se realiza mediante archivos JSON.

Los datos se almacenan en:

```text
src/data/services.json
src/data/bookings.json
```

El proyecto utiliza `fs/promises` para realizar operaciones de lectura y escritura de forma asíncrona.

Esto permite que los datos permanezcan almacenados después de reiniciar el servidor.

Por ejemplo:

```text
POST /api/services
        │
        ▼
Se crea el servicio
        │
        ▼
ServiceManager
        │
        ▼
services.json
```

Si posteriormente se detiene y vuelve a iniciar el servidor, el servicio continúa almacenado en el archivo JSON.

---

# 🧰 Managers

## ServiceManager

`ServiceManager` es responsable de administrar el archivo `services.json`.

Cuenta con los siguientes métodos:

```text
getServices()
getServiceById()
addService()
updateService()
deleteService()
```

Sus responsabilidades principales son:

- Obtener todos los servicios.
- Buscar un servicio por ID.
- Crear nuevos servicios.
- Generar automáticamente los IDs.
- Actualizar servicios existentes.
- Mantener el ID original durante una actualización.
- Eliminar servicios.
- Persistir los cambios en `services.json`.

---

## BookingManager

`BookingManager` administra el archivo `bookings.json`.

Cuenta con los siguientes métodos:

```text
createBooking()
getBookingById()
addServiceToBooking()
```

Sus responsabilidades son:

- Crear nuevas reservas.
- Generar automáticamente el ID de cada reserva.
- Obtener una reserva por ID.
- Agregar servicios a una reserva.
- Incrementar la cantidad cuando un mismo servicio se agrega más de una vez.
- Persistir las modificaciones en `bookings.json`.

---

# 📦 Recurso `services`

Cada servicio posee la siguiente estructura:

```json
{
  "id": 1,
  "name": "Corte de cabello",
  "description": "Corte de cabello masculino",
  "duration": 45,
  "price": 5000,
  "category": "cabello",
  "available": true
}
```

Los campos son:

| Campo         | Descripción                             |
| ------------- | --------------------------------------- |
| `id`          | Identificador generado automáticamente. |
| `name`        | Nombre del servicio.                    |
| `description` | Descripción del servicio.               |
| `duration`    | Duración del servicio.                  |
| `price`       | Precio del servicio.                    |
| `category`    | Categoría a la que pertenece.           |
| `available`   | Indica si el servicio está disponible.  |

El `id` no se envía al crear un servicio, ya que es generado automáticamente por el servidor.

---

# 🌐 Endpoints de Services

Ruta base:

```text
/api/services
```

| Método   | Endpoint             | Descripción                      |
| -------- | -------------------- | -------------------------------- |
| `GET`    | `/api/services`      | Obtiene todos los servicios.     |
| `GET`    | `/api/services/:sid` | Obtiene un servicio por ID.      |
| `POST`   | `/api/services`      | Crea un nuevo servicio.          |
| `PUT`    | `/api/services/:sid` | Actualiza un servicio existente. |
| `DELETE` | `/api/services/:sid` | Elimina un servicio.             |

---

## GET `/api/services`

Obtiene todos los servicios registrados.

Ejemplo:

```http
GET http://localhost:8080/api/services
```

Respuesta:

```json
{
  "status": "success",
  "payload": [
    {
      "id": 1,
      "name": "Corte de cabello",
      "description": "Corte masculino",
      "duration": 45,
      "price": 5000,
      "category": "cabello",
      "available": true
    }
  ]
}
```

---

## GET `/api/services/:sid`

Obtiene un servicio específico mediante su ID.

Ejemplo:

```http
GET http://localhost:8080/api/services/1
```

---

## POST `/api/services`

Crea un nuevo servicio.

El `id` no debe enviarse en el body.

Ejemplo de body:

```json
{
  "name": "Masaje relajante",
  "description": "Masaje corporal de relajación",
  "duration": 60,
  "price": 8000,
  "category": "bienestar",
  "available": true
}
```

El servidor genera automáticamente el ID.

Respuesta:

```json
{
  "status": "success",
  "payload": {
    "id": 2,
    "name": "Masaje relajante",
    "description": "Masaje corporal de relajación",
    "duration": 60,
    "price": 8000,
    "category": "bienestar",
    "available": true
  }
}
```

---

## PUT `/api/services/:sid`

Actualiza un servicio existente.

Ejemplo:

```http
PUT http://localhost:8080/api/services/1
```

Body:

```json
{
  "name": "Corte de cabello premium",
  "price": 6500,
  "available": true
}
```

El ID del servicio no se modifica.

---

## DELETE `/api/services/:sid`

Elimina un servicio existente.

Ejemplo:

```http
DELETE http://localhost:8080/api/services/1
```

---

# 🔎 Filtros de Services

Además de las rutas principales solicitadas, la API permite realizar filtros mediante query parameters.

## Filtrar por categoría

```http
GET /api/services?category=cabello
```

Devuelve los servicios pertenecientes a la categoría indicada.

## Filtrar por disponibilidad

```http
GET /api/services?available=true
```

También puede utilizarse:

```http
GET /api/services?available=false
```

El parámetro `available` debe recibir `true` o `false`.

---

# 📅 Recurso `bookings`

Cada reserva posee la siguiente estructura:

```json
{
  "id": 1,
  "clientName": "Juan Pérez",
  "clientEmail": "juan@email.com",
  "date": "2026-10-10",
  "time": "15:00",
  "status": "success",
  "services": []
}
```

Los campos son:

| Campo         | Descripción                                |
| ------------- | ------------------------------------------ |
| `id`          | Identificador generado automáticamente.    |
| `clientName`  | Nombre del cliente.                        |
| `clientEmail` | Email del cliente.                         |
| `date`        | Fecha de la reserva.                       |
| `time`        | Hora de la reserva.                        |
| `status`      | Estado de la reserva.                      |
| `services`    | Array de servicios asociados a la reserva. |

Una reserva puede crearse inicialmente sin servicios:

```json
"services": []
```

---

# 🔗 Servicios dentro de una reserva

Los servicios asociados a una reserva se almacenan de la siguiente manera:

```json
{
  "service": 1,
  "quantity": 1
}
```

El campo `service` contiene el ID del servicio correspondiente.

Si se agrega nuevamente el mismo servicio, no se crea un nuevo objeto. Se incrementa `quantity`.

Por ejemplo, después de agregar dos veces el servicio con ID `1`:

```json
"services": [
  {
    "service": 1,
    "quantity": 2
  }
]
```

De esta forma se evita duplicar el mismo servicio dentro de la reserva.

---

# 🌐 Endpoints de Bookings

Ruta base:

```text
/api/bookings
```

| Método | Endpoint                           | Descripción                       |
| ------ | ---------------------------------- | --------------------------------- |
| `POST` | `/api/bookings`                    | Crea una nueva reserva.           |
| `GET`  | `/api/bookings/:bid`               | Obtiene una reserva por ID.       |
| `POST` | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva. |

---

## POST `/api/bookings`

Crea una nueva reserva.

Ejemplo:

```http
POST http://localhost:8080/api/bookings
```

Body:

```json
{
  "clientName": "Juan Pérez",
  "clientEmail": "juan@email.com",
  "date": "2026-10-10",
  "time": "15:00"
}
```

El servidor genera automáticamente el ID y crea la reserva con el array de servicios vacío.

Resultado:

```json
{
  "id": 1,
  "clientName": "Juan Pérez",
  "clientEmail": "juan@email.com",
  "date": "2026-10-10",
  "time": "15:00",
  "status": "success",
  "services": []
}
```

---

## GET `/api/bookings/:bid`

Obtiene una reserva específica mediante su ID.

Ejemplo:

```http
GET http://localhost:8080/api/bookings/1
```

---

## POST `/api/bookings/:bid/services/:sid`

Agrega un servicio existente a una reserva existente.

Ejemplo:

```http
POST http://localhost:8080/api/bookings/1/services/2
```

Antes de realizar la asociación se valida que:

1. La reserva exista.
2. El servicio exista.

Si el servicio todavía no está asociado a la reserva, se agrega:

```json
{
  "service": 2,
  "quantity": 1
}
```

Si el servicio ya existe dentro de la reserva, se incrementa su cantidad:

```json
{
  "service": 2,
  "quantity": 2
}
```

---

# 🧪 Pruebas con Postman

Los endpoints fueron probados utilizando **Postman**.

Se realizaron pruebas sobre las operaciones principales de ambos recursos.

### Services

- Obtener todos los servicios.
- Obtener un servicio por ID.
- Crear un servicio.
- Actualizar un servicio.
- Eliminar un servicio.
- Filtrar por categoría.
- Filtrar por disponibilidad.
- Validar datos incorrectos.
- Verificar respuestas ante IDs inexistentes.

### Bookings

- Crear una reserva.
- Obtener una reserva por ID.
- Crear una reserva inicialmente sin servicios.
- Agregar un servicio existente.
- Agregar nuevamente el mismo servicio.
- Verificar el incremento de `quantity`.
- Intentar utilizar una reserva inexistente.
- Intentar agregar un servicio inexistente.

También se verificó que las modificaciones realizadas sobre los recursos se persistan en los respectivos archivos JSON.

---

# ⚠️ Validaciones y respuestas HTTP

La API utiliza códigos de estado HTTP para indicar el resultado de las operaciones.

| Código | Significado                                   |
| ------ | --------------------------------------------- |
| `200`  | Operación realizada correctamente.            |
| `201`  | Recurso creado correctamente.                 |
| `400`  | Datos enviados incorrectamente o incompletos. |
| `404`  | Recurso no encontrado.                        |
| `500`  | Error interno del servidor.                   |

Las respuestas utilizan una estructura similar a:

```json
{
  "status": "success",
  "payload": {}
}
```

En caso de error:

```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

---

# ⚙️ Instalación

## Requisitos

Para ejecutar el proyecto se necesita tener instalado:

- Node.js
- npm
- Git

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/PTaiel24/backend1-project-for-coderhouse.git
```

Ingresar a la carpeta:

```bash
cd backend1-project-for-coderhouse
```

---

## 2. Instalar dependencias

Ejecutar:

```bash
npm install
```

Esto instalará las dependencias definidas en `package.json`.

---

## 3. Configurar variables de entorno

El proyecto utiliza variables de entorno para configurar el servidor.

Crear un archivo `.env` tomando como referencia `.env.example`.

Ejemplo:

```env
PORT=8080
NODE_ENV=development
APP_NAME=Backend1-CoderHouse
```

El archivo `.env` se encuentra incluido en `.gitignore` para evitar publicar información de configuración local.

---

# ▶️ Ejecución

## Modo normal

Para iniciar el servidor:

```bash
npm start
```

## Modo desarrollo

Para iniciar el servidor utilizando el modo `watch`:

```bash
npm run dev
```

Una vez iniciado, la API estará disponible en:

```text
http://localhost:8080
```

El puerto puede modificarse desde la variable:

```env
PORT=8080
```

---

# 🏠 Ruta principal

La aplicación cuenta también con una ruta principal:

```http
GET /
```

Devuelve un mensaje de bienvenida indicando que el servidor está funcionando.

---

# 📌 Persistencia y reinicio del servidor

Uno de los objetivos principales de esta actividad es que la información no se pierda al reiniciar el servidor.

Para lograrlo, los recursos se almacenan en:

```text
src/data/services.json
src/data/bookings.json
```

Por ejemplo:

```text
Crear servicio
      ↓
services.json
      ↓
Detener servidor
      ↓
Iniciar servidor nuevamente
      ↓
GET /api/services
      ↓
El servicio continúa disponible
```

La misma lógica se aplica a las reservas.

---

# 🔐 Archivos ignorados

El proyecto incluye un `.gitignore` para evitar subir archivos que no deben formar parte del repositorio.

Actualmente se ignoran:

```text
node_modules
.env
```

El archivo `.env.example` sí se incluye para indicar qué variables de entorno necesita el proyecto.

---

# 📚 Decisiones de implementación

Durante el desarrollo se buscó mantener una separación clara de responsabilidades.

### Routers

Los routers se encargan de:

- Recibir las peticiones HTTP.
- Obtener parámetros y datos del request.
- Invocar los métodos correspondientes de los managers.
- Devolver las respuestas HTTP.

### Managers

Los managers concentran:

- La lógica de cada recurso.
- La lectura de los archivos JSON.
- La modificación de los datos.
- La persistencia mediante FileSystem.
- La búsqueda y validación de los recursos.

### JSON

Los archivos JSON funcionan como mecanismo de persistencia en esta primera etapa del proyecto.

Esta estructura permite que posteriormente el sistema pueda evolucionar hacia una solución con una base de datos sin tener que concentrar toda la lógica dentro de los routers.

---

# 🚧 Dificultades y aprendizajes

Uno de los principales desafíos fue organizar correctamente la comunicación entre los routers, los managers y los archivos de persistencia.

También fue necesario trabajar con:

- Lectura y escritura asíncrona de archivos.
- Generación automática de IDs.
- Validación de datos recibidos mediante requests.
- Manejo de parámetros dinámicos en las rutas.
- Relación entre los recursos `services` y `bookings`.
- Control de cantidades de servicios dentro de una reserva.
- Manejo de errores y códigos de estado HTTP.
- Persistencia de información luego de reiniciar el servidor.

La implementación de `bookings` requirió especialmente tener en cuenta la relación entre una reserva y los servicios asociados, evitando duplicar servicios y utilizando el campo `quantity` para representar la cantidad solicitada.

---
