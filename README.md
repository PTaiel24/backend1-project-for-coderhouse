# API REST de Servicios — CoderHouse Backend 1

Proyecto desarrollado para la entrega de **Backend 1 de CoderHouse**.

El objetivo de esta etapa es construir una API REST utilizando **Node.js y Express** para gestionar el recurso `services` dentro de un Sistema Backend de Turnos y Reservas.

La aplicación permite consultar, crear, actualizar y eliminar servicios mediante endpoints HTTP, utilizando una arquitectura modular que separa la configuración del servidor, las rutas y la lógica de administración de datos.

La persistencia se realiza mediante un archivo JSON, gestionado por la clase `ServiceManager`.

---

## Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express:** framework para la creación de la API REST.
- **JavaScript:** lenguaje de programación.
- **ES Modules (ESM):** sistema de módulos para organizar las importaciones y exportaciones.
- **dotenv:** gestión de variables de entorno.
- **File System (`fs/promises`):** lectura y escritura asíncrona de archivos.
- **JSON:** formato utilizado para almacenar los servicios.
- **Postman:** herramientas para probar los endpoints HTTP.

---

## Funcionalidades

La API permite realizar las siguientes operaciones sobre el recurso `services`:

- Obtener todos los servicios registrados.
- Filtrar servicios por categoría.
- Filtrar servicios según su disponibilidad.
- Buscar un servicio mediante su identificador.
- Crear nuevos servicios con generación automática de ID.
- Actualizar los datos de un servicio existente.
- Eliminar servicios.
- Validar los datos recibidos en las peticiones.
- Devolver códigos de estado HTTP según el resultado de cada operación.
- Mantener los datos almacenados en un archivo JSON.

---

## Instalación y configuración

### 1. Clonar el repositorio

Clonar el repositorio desde GitHub:

```bash
git clone URL_DEL_REPOSITORIO
```

Ingresar a la carpeta del proyecto:

```bash
cd backend1-project-for-coderhouse
```

### 2. Instalar las dependencias

Ejecutar el siguiente comando:

```bash
npm install
```

### 3. Configurar las variables de entorno

Crear un archivo `.env` a partir del archivo de ejemplo:

```bash
cp .env.example .env
```

Configurar las variables necesarias:

```env
PORT=8080
NODE_ENV=development
```

Las variables son cargadas mediante `dotenv` y gestionadas desde:

```text
src/config/env.config.js
```

El archivo `.env` contiene la configuración local y no debe subirse al repositorio público.

---

## Ejecución del servidor

Para iniciar el servidor:

```bash
npm start
```

Para ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
```

Una vez iniciado, el servidor estará disponible en:

```text
http://localhost:8080
```

El puerto puede modificarse mediante la variable de entorno `PORT`.

---

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
    ├── data/
    │   └── services.json
    ├── managers/
    │   └── ServiceManager.js
    └── routes/
        └── services.router.js
```

### Descripción de los archivos

| Archivo              | Responsabilidad                                              |
| -------------------- | ------------------------------------------------------------ |
| `app.js`             | Configuración de Express, middlewares y registro de rutas.   |
| `server.js`          | Inicio del servidor y escucha del puerto configurado.        |
| `env.config.js`      | Carga y validación de las variables de entorno.              |
| `ServiceManager.js`  | Lógica de gestión de los servicios y persistencia de datos.  |
| `services.router.js` | Definición de los endpoints y manejo de las peticiones HTTP. |
| `services.json`      | Almacenamiento local de los servicios.                       |

La separación de responsabilidades permite mantener organizada la aplicación y facilita su mantenimiento y ampliación.

---

## API REST — Endpoints

La API utiliza la siguiente ruta base:

```text
/api/services
```

### Resumen de endpoints

| Método | Endpoint             | Descripción                       | Respuesta exitosa |
| ------ | -------------------- | --------------------------------- | ----------------- |
| GET    | `/api/services`      | Obtener todos los servicios.      | 200 OK            |
| GET    | `/api/services/:sid` | Obtener un servicio por ID.       | 200 OK            |
| POST   | `/api/services`      | Crear un nuevo servicio.          | 201 Created       |
| PUT    | `/api/services/:sid` | Actualizar un servicio existente. | 200 OK            |
| DELETE | `/api/services/:sid` | Eliminar un servicio existente.   | 200 OK            |

### Códigos de estado HTTP

| Código                      | Descripción                                       |
| --------------------------- | ------------------------------------------------- |
| `200 OK`                    | La petición se procesó correctamente.             |
| `201 Created`               | El servicio fue creado correctamente.             |
| `400 Bad Request`           | La petición contiene datos faltantes o inválidos. |
| `404 Not Found`             | El servicio solicitado no existe.                 |
| `500 Internal Server Error` | Ocurrió un error inesperado en el servidor.       |

---

## Detalle de los endpoints

### 1. Obtener todos los servicios

**GET** `/api/services`

Devuelve un listado de todos los servicios registrados.

Ejemplo de respuesta:

```json
[
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
```

#### Filtros mediante query params

El endpoint permite filtrar los servicios utilizando parámetros de consulta.

**Filtrar por categoría:**

```http
GET /api/services?category=salud
```

Devuelve los servicios pertenecientes a la categoría indicada.

**Filtrar por disponibilidad:**

```http
GET /api/services?available=true
```

Devuelve únicamente los servicios disponibles.

También se puede consultar:

```http
GET /api/services?available=false
```

**Combinar filtros:**

```http
GET /api/services?category=salud&available=true
```

Devuelve los servicios que cumplen ambas condiciones.

El parámetro `available` admite los valores `true` y `false`. Si se envía un valor diferente, la API responde con un error 400.

---

### 2. Obtener un servicio por ID

**GET** `/api/services/:sid`

Busca un servicio mediante su identificador.

Ejemplo:

```http
GET /api/services/1
```

Si el servicio existe, devuelve sus datos con estado `200 OK`.

Si el identificador no corresponde a ningún servicio registrado, responde con `404 Not Found`.

---

### 3. Crear un servicio

**POST** `/api/services`

Permite registrar un nuevo servicio mediante los datos enviados en el body de la petición.

Ejemplo de body:

```json
{
  "name": "Masaje",
  "description": "Masaje relajante",
  "duration": 60,
  "price": 8000,
  "category": "bienestar",
  "available": true
}
```

El identificador se genera automáticamente desde `ServiceManager`, por lo que **no debe enviarse el campo `id` en el body**.

Si la creación es exitosa, la API devuelve el servicio creado con estado `201 Created`.

Si faltan campos obligatorios o los datos no cumplen las validaciones, responde con `400 Bad Request`.

---

### 4. Actualizar un servicio

**PUT** `/api/services/:sid`

Permite actualizar los datos de un servicio existente.

Ejemplo:

```http
PUT /api/services/1
```

Body:

```json
{
  "price": 7500,
  "available": false
}
```

La actualización conserva el identificador original del servicio.

Si la operación se realiza correctamente, devuelve `200 OK`.

Si el servicio no existe, responde con `404 Not Found`.

---

### 5. Eliminar un servicio

**DELETE** `/api/services/:sid`

Elimina un servicio mediante su identificador.

Ejemplo:

```http
DELETE /api/services/1
```

Si el servicio existe, se elimina del archivo de almacenamiento y la API responde con `200 OK`.

Si el identificador no corresponde a un servicio registrado, devuelve `404 Not Found`.

---

## Modelo de datos

Los servicios se almacenan en el archivo:

```text
src/data/services.json
```

Cada servicio posee la siguiente estructura:

```json
{
  "id": 1,
  "name": "Corte de cabello",
  "description": "Corte masculino",
  "duration": 45,
  "price": 5000,
  "category": "cabello",
  "available": true
}
```

### Descripción de los campos

| Campo         | Tipo    | Descripción                                   |
| ------------- | ------- | --------------------------------------------- |
| `id`          | Number  | Identificador único generado automáticamente. |
| `name`        | String  | Nombre del servicio.                          |
| `description` | String  | Descripción del servicio.                     |
| `duration`    | Number  | Duración estimada del servicio.               |
| `price`       | Number  | Precio del servicio.                          |
| `category`    | String  | Categoría a la que pertenece.                 |
| `available`   | Boolean | Indica si el servicio está disponible.        |

---

## Arquitectura y responsabilidades

### ServiceManager

La clase `ServiceManager` centraliza las operaciones relacionadas con los servicios y se encarga de la persistencia de datos.

Sus principales métodos son:

- `getServices()`: obtiene todos los servicios y aplica los filtros correspondientes.
- `getServiceById(id)`: busca un servicio por su identificador.
- `addService(serviceData)`: valida y registra un nuevo servicio.
- `updateService(id, updatedData)`: actualiza un servicio existente sin modificar su ID.
- `deleteService(id)`: elimina un servicio y actualiza el archivo JSON.

### Router de servicios

El archivo `services.router.js` utiliza `express.Router()` para definir los endpoints.

Se encarga de recibir los datos de las peticiones mediante:

- `req.params`: parámetros dinámicos, como el identificador del servicio.
- `req.query`: filtros enviados mediante la URL.
- `req.body`: información enviada para crear o actualizar servicios.

El router delega las operaciones al `ServiceManager` y devuelve las respuestas HTTP correspondientes.

### Aplicación y servidor

La configuración de Express se encuentra separada del inicio del servidor.

`app.js` se encarga de configurar la aplicación y registrar las rutas, mientras que `server.js` inicia el servidor utilizando el puerto definido en las variables de entorno.

---

## Persistencia de datos

La aplicación utiliza un archivo JSON como mecanismo de almacenamiento local.

Las operaciones de lectura y escritura se realizan de manera asíncrona mediante `fs/promises`, utilizando `async/await`.

Cada creación, actualización o eliminación modifica el contenido de `services.json`, conservando los cambios realizados.

Si el archivo no existe, el administrador contempla su creación con un array vacío.

---

## Decisiones de implementación

Se utilizó Express para construir una API REST que permita administrar servicios mediante peticiones HTTP.

Se mantuvo `ServiceManager` como responsable de la lógica de negocio y del acceso a los datos, evitando concentrar estas operaciones en las rutas o en la configuración principal de Express.

Se eligió un archivo JSON como sistema de persistencia para continuar trabajando con las operaciones de lectura y escritura de archivos desarrolladas en la etapa anterior.

También se incorporó `dotenv` para separar la configuración del servidor del código fuente y permitir definir el puerto mediante variables de entorno.

Finalmente, se implementaron códigos de estado HTTP para comunicar de manera clara el resultado de las operaciones y los posibles errores.

---

## Observaciones finales

Durante el desarrollo se trabajó con los conceptos fundamentales de una API REST, incluyendo el diseño de rutas, los métodos HTTP y el intercambio de información entre cliente y servidor.

Se incorporó el uso de parámetros dinámicos, query params y body para recibir diferentes tipos de información desde las peticiones.

También se trabajó en la validación de datos y el manejo de errores para evitar operaciones incorrectas y proporcionar respuestas adecuadas.

Esta entrega constituye una primera etapa del Sistema Backend de Turnos y Reservas, estableciendo la base para futuras funcionalidades relacionadas con la gestión de reservas y turnos.

---

## Autor

Proyecto realizado como parte de la cursada de **Backend 1 — CoderHouse**.
