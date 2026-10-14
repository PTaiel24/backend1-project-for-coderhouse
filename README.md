# API REST de Servicios y Reservas

Proyecto desarrollado para el módulo **Backend 1 de CoderHouse**, correspondiente a la entrega **Organización de la API con Routers y Controllers**.

La aplicación implementa una API REST para administrar servicios y reservas de un sistema de turnos. En esta etapa se reorganizó el código para separar las responsabilidades entre routers, controllers y managers, manteniendo los endpoints y el comportamiento externo de las entregas anteriores.

La persistencia de los datos se realiza mediante archivos JSON utilizando FileSystem.

## Objetivos

- Organizar el código en capas con responsabilidades diferenciadas.
- Mantener las rutas existentes de servicios y reservas.
- Separar el manejo de las solicitudes HTTP de la lógica de datos.
- Gestionar los recursos mediante managers.
- Conservar los datos en archivos JSON.
- Facilitar el mantenimiento y la futura evolución de la API.

## Tecnologías utilizadas

- Node.js
- Express
- JavaScript con ES Modules (ESM)
- dotenv
- FileSystem (`fs/promises`)
- JSON
- Postman para pruebas manuales
- Git y GitHub para el control de versiones

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
    ├── managers/
    │   ├── ServiceManager.js
    │   └── BookingManager.js
    ├── routes/
    │   ├── services.router.js
    │   └── bookings.router.js
    ├── data/
    │   ├── services.json
    │   └── bookings.json
    └── utils/
        └── sendError.js
```

## Arquitectura y responsabilidades

La API se organiza en tres capas principales:

### Routers

Los routers definen los endpoints y conectan cada ruta con el método correspondiente del controller.

- `services.router.js`: registra las rutas de servicios.
- `bookings.router.js`: registra las rutas de reservas.

Los routers no contienen lógica de negocio ni acceden directamente a los archivos JSON.

### Controllers

Los controllers reciben las solicitudes HTTP, obtienen los parámetros, query parameters o datos del body, llaman a los managers y devuelven respuestas mediante `res.status().json()`.

- `services.controller.js`: gestiona las solicitudes relacionadas con servicios.
- `bookings.controller.js`: gestiona las solicitudes relacionadas con reservas y valida la existencia de los servicios al asociarlos a una reserva.

### Managers

Los managers concentran la lógica de datos y las operaciones de persistencia. No utilizan `req` ni `res`.

- `ServiceManager.js`: consulta, crea, actualiza y elimina servicios.
- `BookingManager.js`: crea y consulta reservas, y permite asociar servicios a ellas.

### Archivos de datos

- `src/data/services.json`: almacena los servicios.
- `src/data/bookings.json`: almacena las reservas.

### Manejo de errores

`src/utils/sendError.js` centraliza el formato de las respuestas de error enviadas por los controllers.

## Flujo de una solicitud

```text
Cliente / Postman
       |
       v
     Router
       |
       v
    Controller
       |
       v
     Manager
       |
       v
  Archivo JSON
```

El resultado de la operación vuelve al controller, que responde al cliente con el estado HTTP y el contenido JSON correspondiente.

## Recurso: Services

Cada servicio contiene los siguientes campos:

| Campo         | Descripción                             |
| ------------- | --------------------------------------- |
| `id`          | Identificador generado por el servidor. |
| `name`        | Nombre del servicio.                    |
| `description` | Descripción del servicio.               |
| `duration`    | Duración del servicio.                  |
| `price`       | Precio del servicio.                    |
| `category`    | Categoría del servicio.                 |
| `available`   | Indica si el servicio está disponible.  |

### Endpoints de servicios

| Método | Endpoint             | Descripción                      |
| ------ | -------------------- | -------------------------------- |
| GET    | `/api/services`      | Obtiene todos los servicios.     |
| GET    | `/api/services/:sid` | Obtiene un servicio por ID.      |
| POST   | `/api/services`      | Crea un servicio.                |
| PUT    | `/api/services/:sid` | Actualiza un servicio existente. |
| DELETE | `/api/services/:sid` | Elimina un servicio.             |

La consulta de servicios admite los filtros `category` y `available`.

Ejemplos:

```http
GET /api/services?category=Barberia
GET /api/services?available=true
```

Para crear un servicio, se envía un body JSON sin el campo `id`, ya que lo genera el servidor.

Ejemplo:

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

## Recurso: Bookings

Cada reserva contiene los siguientes campos:

| Campo         | Descripción                                |
| ------------- | ------------------------------------------ |
| `id`          | Identificador generado por el servidor.    |
| `clientName`  | Nombre del cliente.                        |
| `clientEmail` | Correo electrónico del cliente.            |
| `date`        | Fecha de la reserva.                       |
| `time`        | Hora de la reserva.                        |
| `status`      | Estado de la reserva.                      |
| `services`    | Lista de servicios asociados a la reserva. |

Cada servicio asociado a una reserva utiliza la siguiente estructura:

```json
{
  "service": 2,
  "quantity": 1
}
```

Si se agrega nuevamente un servicio que ya está asociado, se incrementa su cantidad.

### Endpoints de reservas

| Método | Endpoint                           | Descripción                       |
| ------ | ---------------------------------- | --------------------------------- |
| POST   | `/api/bookings`                    | Crea una reserva.                 |
| GET    | `/api/bookings/:bid`               | Obtiene una reserva por ID.       |
| POST   | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva. |

Al asociar un servicio, el controller verifica que existan tanto la reserva como el servicio antes de solicitar la modificación al `BookingManager`.

## Instalación y ejecución

### Requisitos

- Node.js instalado.
- npm instalado.

### 1. Clonar el repositorio

```bash
git clone https://github.com/PTaiel24/backend1-project-for-coderhouse.git
cd backend1-project-for-coderhouse
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Variables utilizadas:

```env
PORT=8080
NODE_ENV=development
APP_NAME=Backend de Turnos y Reservas
```

Los valores anteriores son un ejemplo de configuración local.

### 4. Iniciar el servidor

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Si el servidor se inicia correctamente, estará disponible en el puerto configurado.

La ruta raíz `/` devuelve un mensaje de bienvenida.

## Pruebas con Postman

Los endpoints pueden probarse con Postman utilizando la dirección local correspondiente al puerto configurado.

Se recomienda verificar:

- Consulta de todos los servicios.
- Búsqueda de un servicio por ID.
- Creación, actualización y eliminación de servicios.
- Creación y consulta de reservas.
- Asociación de servicios a reservas.
- Incremento de `quantity` al agregar un servicio repetido.
- Respuestas de error para identificadores inexistentes.
- Persistencia de los datos después de reiniciar el servidor.

Las pruebas realizadas con Postman son manuales; el proyecto no incluye actualmente una suite automatizada de tests.

## Persistencia

La API utiliza `fs/promises` para leer y escribir los archivos JSON de datos.

Esto permite conservar los registros entre reinicios del servidor. Los archivos JSON funcionan como mecanismo de persistencia para esta etapa del proyecto.

## Seguridad y archivos excluidos

El archivo `.gitignore` excluye `node_modules` y `.env`.

El repositorio debe incluir `.env.example` para documentar las variables necesarias, sin publicar credenciales ni configuraciones privadas.

## Asistencia durante el desarrollo

Durante el desarrollo de esta entrega se utilizó **ChatGPT como herramienta de apoyo** para comprender conceptos de JavaScript, analizar la separación de responsabilidades entre routers, controllers y managers, revisar posibles errores y orientar la organización de la documentación.

La implementación, las modificaciones y las pruebas del proyecto se realizaron como parte del proceso de aprendizaje del estudiante.
