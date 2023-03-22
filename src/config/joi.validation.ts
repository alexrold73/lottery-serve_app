import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODBURL: Joi.string().required(),
  PORT: Joi.number().default(3001),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES: Joi.string().required(),
});
