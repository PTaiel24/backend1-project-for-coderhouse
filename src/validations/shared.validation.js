import { z } from "zod";

// Mensajes personalizados para los errores de tipo (invalidMessage) y de campo
// faltante (requiredMessage). Se declaran las claves de Zod 3 y de Zod 4 para
// que se apliquen igual con cualquiera de las dos versiones.
export const withMessage = (invalidMessage, requiredMessage = invalidMessage) => ({
  error: (issue) =>
    issue.input === undefined ? requiredMessage : invalidMessage,
  invalid_type_error: invalidMessage,
  required_error: requiredMessage,
});

// Los enum de Zod 3 no usan las claves anteriores para el valor inválido,
// por eso se detecta la versión (z.toJSONSchema solo existe en Zod 4).
export const enumMessage = (message) =>
  typeof z.toJSONSchema === "function"
    ? withMessage(message)
    : { message };

export const requiredString = (field) =>
  z
    .string(withMessage(`${field} debe ser un texto`, `${field} es obligatorio`))
    .trim()
    .min(1, `${field} no puede estar vacío`);

export const objectIdString = (label) =>
  z
    .string(
      withMessage(`${label} debe ser un texto`, `${label} es obligatorio`),
    )
    .regex(/^[0-9a-fA-F]{24}$/, `${label} no es un id válido`);

export const atLeastOneField = (data) => Object.keys(data).length > 0;

// Ruta interna del error "no se envió ningún campo". Permite que el middleware
// lo omita cuando ya hay errores más específicos para mostrar.
export const EMPTY_PATH = "__empty";

export const atLeastOne = (message) => ({ message, path: [EMPTY_PATH] });

export const BODY_MESSAGE = "El cuerpo de la solicitud debe ser un objeto JSON";
