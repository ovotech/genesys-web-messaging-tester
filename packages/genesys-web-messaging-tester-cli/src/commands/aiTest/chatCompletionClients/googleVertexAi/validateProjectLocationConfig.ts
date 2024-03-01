import Joi, { ValidationError } from 'joi';
import { GoogleVertexAiConfig } from '../../testScript/modelTypes';

const schema = Joi.object()
  .keys({
    location: Joi.string().required().messages({
      'any.required': 'GCP Vertex AI location not defined in config or environment variable',
    }),
    project: Joi.string().required().messages({
      'any.required': 'GCP Vertex AI project not defined in config or environment variable',
    }),
  })
  .required();

export function validateProjectLocationConfig(config: Partial<GoogleVertexAiConfig>): {
  value?: { location: string; project: string };
  error?: ValidationError;
} {
  const { error, value } = schema.validate(config);

  if (error) {
    return { error };
  } else {
    return { value };
  }
}
