# API REST de Servicios y Reservas

Proyecto del módulo **Backend 1 de Coderhouse**. La API administra servicios y reservas para un sistema de turnos mediante Node.js, Express y archivos JSON.

Esta etapa reorganiza la API para separar las responsabilidades en capas: **Router → Controller → Service → Repository → DAO → archivo JSON**. El objetivo es conservar las URLs públicas de la API y preparar el proyecto para una futura migración de persistencia a MongoDB Atlas con Mongoose.

## Tecnologías

- Node.js y JavaScript con ES Modules (ESM).
- Express para exponer los endpoints HTTP.
- dotenv para cargar variables de entorno.
- `node:fs/promises` para leer y escribir los archivos JSON.
- JSON como persistencia de esta entrega.
- Postman para pruebas manuales.

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
    │   └── env.config.js
    ├── controllers/
    │   ├── services.controller.js
    │   └── bookings.controller.js
    ├── services/
    │   ├── services.service.js
    │   └── bookings.service.js
    ├── repositories/
    │   ├── services.repository.js
    │   └── bookings.repository.js
    ├── dao/
    │   ├── services.dao.js
    │   └── bookings.dao.js
    ├── routes/
    │   ├── services.router.js
    │   └── bookings.router.js
    ├── data/
    │   ├── services.json
    │   └── bookings.json
    └── utils/
        ├── createError.js
        └── sendError.js
```

## Arquitectura en capas

### Router

Define los endpoints y dirige cada solicitud al método correspondiente del controller. Las rutas de servicios se encuentran en `src/routes/services.router.js` y las de reservas en `src/routes/bookings.router.js`.

### Controller

Recibe la solicitud HTTP, extrae parámetros, query parameters y datos del body; llama al Service y devuelve una respuesta con el estado HTTP y un objeto JSON. Los controllers son `services.controller.js` y `bookings.controller.js`.

### Service

Contiene las validaciones y reglas de negocio. No debe acceder directamente a archivos JSON ni depender de `req` o `res`.

- `services.service.js`: expone `getServices`, `getServiceById`, `createService`, `updateService` y `deleteService`.
- `bookings.service.js`: expone `createBooking`, `getBookingById` y `addServiceToBooking`.

En las reservas, la regla para agregar servicios se gestiona desde `bookings.service.js`: cuando un servicio ya está incluido en una reserva, se incrementa `quantity`; de lo contrario, se agrega una entrada con `quantity: 1`.

### Repository

Ofrece métodos de acceso a los datos de cada recurso y mantiene al Service desacoplado de los detalles del almacenamiento.

- `services.repository.js`: `getAll`, `getById`, `create`, `update` y `delete`.
- `bookings.repository.js`: `create`, `getById` y `update`.

### DAO

Es la capa que lee y escribe directamente los archivos JSON mediante `fs/promises`.

- `services.dao.js`: trabaja con `src/data/services.json`.
- `bookings.dao.js`: trabaja con `src/data/bookings.json`.

El DAO no debería contener reglas de negocio como decidir cómo se acumulan los servicios de una reserva; esa regla corresponde al Service.

### Configuración y persistencia

- `src/config/env.config.js` carga y valida variables de entorno.
- `src/app.js` configura Express y registra los routers.
- `src/server.js` inicia el servidor.
- `src/data/services.json` y `src/data/bookings.json` contienen los datos persistidos en esta etapa.
- `src/utils/createError.js` crea errores con un `statusCode`.
- `src/utils/sendError.js` forma las respuestas de error utilizadas por los controllers.

## Endpoints

Las URLs de la API se mantienen sin cambios.

### Servicios (`/api/services`)

| Método   | Endpoint             | Descripción                                     |
| -------- | -------------------- | ----------------------------------------------- |
| `GET`    | `/api/services`      | Obtiene todos los servicios.                    |
| `GET`    | `/api/services/:sid` | Busca un servicio por su ID.                    |
| `POST`   | `/api/services`      | Crea un servicio y genera su ID en el servidor. |
| `PUT`    | `/api/services/:sid` | Actualiza un servicio existente.                |
| `DELETE` | `/api/services/:sid` | Elimina un servicio.                            |

La consulta permite filtrar por `category` y `available`:

```http
GET /api/services?category=Barberia
GET /api/services?available=true
GET /api/services?category=Barberia&available=true
```

Ejemplo de cuerpo JSON para crear un servicio (sin `id`):

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

Campos del servicio:

| Campo         | Tipo esperado | Descripción                                                   |
| ------------- | ------------- | ------------------------------------------------------------- |
| `id`          | number        | Identificador generado por el servidor. No se envía al crear. |
| `name`        | string        | Nombre del servicio.                                          |
| `description` | string        | Descripción del servicio.                                     |
| `duration`    | number        | Duración del servicio.                                        |
| `price`       | number        | Precio del servicio.                                          |
| `category`    | string        | Categoría del servicio.                                       |
| `available`   | boolean       | Indica si el servicio está disponible.                        |

### Reservas (`/api/bookings`)

| Método | Endpoint                           | Descripción                       |
| ------ | ---------------------------------- | --------------------------------- |
| `POST` | `/api/bookings`                    | Crea una reserva.                 |
| `GET`  | `/api/bookings/:bid`               | Obtiene una reserva por su ID.    |
| `POST` | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva. |

Ejemplo de cuerpo JSON para crear una reserva:

```json
{
  "clientName": "Ana Pérez",
  "clientEmail": "ana@example.com",
  "date": "2026-11-15",
  "time": "10:30"
}
```

La API espera una fecha con formato `YYYY-MM-DD` y una hora con formato `HH:mm`. El `id` se genera en el servidor, el estado inicial es `success` y la lista `services` comienza vacía.

Cada servicio asociado a una reserva utiliza esta estructura:

```json
{
  "service": 2,
  "quantity": 1
}
```

Al agregar nuevamente el mismo servicio, la regla prevista es incrementar `quantity` en la entrada existente en lugar de duplicar la entrada.

## Instalación y ejecución

### Requisitos

- Node.js.
- npm.

### 1. Clonar el repositorio

```bash
git clone https://github.com/PTaiel24/backend1-project-for-coderhouse.git
cd backend1-project-for-coderhouse
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear el archivo `.env`

Crear un archivo `.env` en la raíz del proyecto a partir de `.env.example` y asignar valores locales, por ejemplo:

```env
PORT=8080
NODE_ENV=development
APP_NAME=Backend de Turnos y Reservas
```

`PORT` y `NODE_ENV` son requeridas por `env.config.js`. `APP_NAME` se utiliza en el mensaje de inicio del servidor.

### 4. Iniciar el servidor

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Con la configuración anterior, la API queda disponible en `http://localhost:8080`.

## Pruebas manuales

Se puede usar Postman para probar los endpoints. Se recomienda comprobar:

- Listado y búsqueda de servicios.
- Creación, actualización y eliminación de servicios.
- Filtros `category` y `available`.
- Creación y consulta de reservas.
- Asociación de servicios a una reserva.
- Incremento de `quantity` cuando se repite un servicio.
- Respuestas para IDs inexistentes y cuerpos con datos inválidos.
- Persistencia de cambios en los archivos JSON después de reiniciar el servidor.

El script `npm test` todavía está configurado como marcador de posición en `package.json`; no hay una suite de pruebas automatizadas configurada en esta versión.

## Variables y archivos que no deben publicarse

El archivo `.gitignore` excluye `.env` y `node_modules`. El repositorio debe incluir `.env.example`, pero nunca credenciales reales ni valores privados. Los archivos JSON de `src/data/` forman parte de la persistencia de desarrollo de esta entrega.

## Alcance de esta etapa

Esta versión mantiene FileSystem y JSON como persistencia. La separación entre Service, Repository y DAO prepara el proyecto para una futura migración a MongoDB Atlas con Mongoose, sin necesidad de cambiar las URLs públicas de los endpoints.
