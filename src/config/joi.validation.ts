import * as Joi from 'joi';
/**
 * Objeto de esquema de validación de Joi para las variables de entorno.
 * @type {Object}
 * @description Este objeto define las reglas de validación para las variables
 *              de entorno utilizadas en la aplicación.
 */
export const JoiValidationSchema = Joi.object({
  MONGODBURL: Joi.string().required(),
  PORT: Joi.number().default(3001),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES: Joi.string().required(),
});
