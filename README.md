# Administrador de Servicios — CoderHouse Backend 1

Proyecto desarrollado para la entrega de **Backend 1 de CoderHouse**.

El objetivo es desarrollar un administrador de servicios utilizando **Node.js**, con persistencia de datos mediante un archivo JSON y una clase `ServiceManager` encargada de gestionar las operaciones sobre los servicios.

---

## Tecnologías

- **Node.js**
- **JavaScript**
- **ES Modules (ESM)**
- **dotenv**
- **File System (`fs/promises`)**
- Persistencia mediante archivo **JSON**

---

## Funcionalidades

El proyecto permite administrar servicios mediante las siguientes operaciones:

- Obtener todos los servicios.
- Obtener un servicio mediante su ID.
- Agregar un nuevo servicio.
- Actualizar un servicio existente.
- Eliminar un servicio.
- Generar automáticamente el ID de los nuevos servicios.
- Validar los campos obligatorios al crear un servicio.
- Mantener la información almacenada en `services.json`.

---

## Instalación

### 1. Clonar o descargar el repositorio

Una vez descargado el proyecto, ingresar a la carpeta desde la terminal.

### 2. Instalar las dependencias

```bash
npm install
```

La única dependencia externa utilizada actualmente es `dotenv`.

### 3. Configurar las variables de entorno

Crear un archivo `.env` a partir del archivo `.env.example`:

```bash
cp .env.example .env
```

Luego completar las variables necesarias.

---

## Variables de entorno

El proyecto utiliza variables de entorno para configurar la aplicación.

Archivo `.env`:

```env
PORT=8080
NODE_ENV=development
```

Estas variables son cargadas y validadas desde:

```text
src/config/env.config.js
```

Si alguna de las variables obligatorias no está definida, la aplicación genera un error y detiene su ejecución.

El archivo `.env` no debe subirse al repositorio. Para ello se encuentra incluido en `.gitignore`.

---

## Ejecución

Para iniciar la aplicación:

```bash
npm start
```

También existe un script de desarrollo que permite reiniciar automáticamente la aplicación cuando se detectan cambios:

```bash
npm run dev
```

El punto de entrada de la aplicación es:

```text
src/app.js
```

---

## Estructura del proyecto

```text
backend1-project-for-coderhouse/
├── .env                  # Variables de entorno locales
├── .env.example          # Ejemplo de variables de entorno
├── .gitignore            # Archivos excluidos del repositorio
├── package.json          # Configuración y dependencias
├── package-lock.json     # Versiones de dependencias
├── README.md             # Documentación del proyecto
└── src/
    ├── app.js
    ├── config/
    │   └── env.config.js
    ├── data/
    │   └── services.json
    └── managers/
        └── ServiceManager.js
```

### Descripción de las carpetas

- **`src/app.js`**: punto de entrada de la aplicación.
- **`src/config/`**: configuración y validación de variables de entorno.
- **`src/data/`**: almacenamiento local de los servicios.
- **`src/managers/`**: contiene la lógica para administrar los servicios.

---

## Recurso `services.json`

Los servicios se almacenan en:

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

### Campos

| Campo         | Tipo    | Descripción                           |
| ------------- | ------- | ------------------------------------- |
| `id`          | Number  | Identificador único del servicio      |
| `name`        | String  | Nombre del servicio                   |
| `description` | String  | Descripción del servicio              |
| `duration`    | Number  | Duración del servicio                 |
| `price`       | Number  | Precio del servicio                   |
| `category`    | String  | Categoría del servicio                |
| `available`   | Boolean | Indica si el servicio está disponible |

---

## `ServiceManager`

`ServiceManager` es una clase encargada de administrar los servicios almacenados en `services.json`.

La clase utiliza `fs/promises` para leer y modificar el archivo JSON.

### Crear una instancia

```js
import { ServiceManager } from "./managers/ServiceManager.js";

const serviceManager = new ServiceManager();
```

---

### `getServices()`

Obtiene todos los servicios almacenados.

```js
const services = await serviceManager.getServices();

console.log(services);
```

---

### `getServiceById(id)`

Busca un servicio mediante su identificador.

```js
const service = await serviceManager.getServiceById(2);

console.log(service);
```

Si el servicio no existe, se genera un error.

---

### `addService(serviceData)`

Agrega un nuevo servicio.

El ID es generado automáticamente por `ServiceManager`, por lo que no es necesario enviarlo.

```js
const newService = await serviceManager.addService({
  name: "Masaje",
  description: "Masaje relajante",
  duration: 60,
  price: 8000,
  category: "bienestar",
  available: true,
});

console.log(newService);
```

El método valida que todos los campos obligatorios estén presentes antes de guardar el servicio.

---

### `updateService(id, updatedData)`

Actualiza los datos de un servicio existente.

```js
const updatedService = await serviceManager.updateService(2, {
  price: 7500,
  available: true,
});

console.log(updatedService);
```

El ID del servicio no puede ser modificado mediante esta operación.

---

### `deleteService(id)`

Elimina un servicio existente mediante su ID.

```js
await serviceManager.deleteService(2);
```

Si el servicio no existe, se genera un error.

---

## Persistencia de datos

Las operaciones realizadas mediante `ServiceManager` se guardan directamente en:

```text
src/data/services.json
```

Cada modificación del contenido vuelve a escribir el archivo JSON para conservar los cambios.

---

## Decisiones de implementación

Se utilizó una clase `ServiceManager` para centralizar las operaciones relacionadas con los servicios y mantener separada la lógica de gestión de datos del punto de entrada de la aplicación.

Se eligió un archivo JSON como sistema de persistencia debido a que el objetivo de esta etapa del proyecto es trabajar con operaciones de lectura y escritura de archivos utilizando Node.js.

También se utilizó `dotenv` para manejar las variables de entorno y mantener separada la configuración de la aplicación de la lógica del administrador de servicios.

---

## Observaciones

Durante el desarrollo se trabajó con operaciones asíncronas utilizando `async/await`, debido a que la lectura y escritura del archivo JSON mediante `fs/promises` son operaciones asíncronas.

También se contemplaron situaciones como:

- Archivo `services.json` inexistente.
- Servicio buscado mediante un ID inexistente.
- Intento de crear un servicio sin completar los campos obligatorios.
- Actualización de servicios manteniendo su ID original.
- Eliminación de servicios existentes.
- Generación automática de IDs para nuevos servicios.
