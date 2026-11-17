import createError from "../utils/createError.js";
import { EMPTY_PATH } from "../validations/shared.validation.js";

// Valida una parte de la solicitud (body, query o params) contra un esquema
// de Zod. Si los datos son inválidos corta el flujo con un error 400, de modo
// que la solicitud nunca llega al controller ni a la base de datos.
const validate = (source, schema) => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const issues = result.error.issues;
    const isEmptyIssue = (issue) => issue.path.includes(EMPTY_PATH);
    // "No se envió ningún campo" solo se muestra si no hay errores más específicos
    const relevant = issues.every(isEmptyIssue)
      ? issues
      : issues.filter((issue) => !isEmptyIssue(issue));
    const message = relevant.map((issue) => issue.message).join(" - ");
    return next(createError(message, 400));
  }

  if (source === "body") {
    req.body = result.data;
  } else if (source === "query") {
    // En Express 5 req.query es de solo lectura, por eso se guarda aparte.
    req.validatedQuery = result.data;
  }

  next();
};

export const validateBody = (schema) => validate("body", schema);
export const validateQuery = (schema) => validate("query", schema);
export const validateParams = (schema) => validate("params", schema);
