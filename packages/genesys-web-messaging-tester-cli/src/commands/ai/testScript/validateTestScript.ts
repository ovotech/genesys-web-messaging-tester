import Joi, { ValidationError } from 'joi';
import { TestScriptFile } from './parseTestScript';

const schema = Joi.object({
  config: Joi.object({
    deploymentId: Joi.string(),
    region: Joi.string(),
    origin: Joi.string(),
  }).optional(),
  prompts: Joi.object()
    .min(1)
    .pattern(
      /./,
      Joi.object({
        prompt: Joi.string().required(),
        terminatingResponses: Joi.object({
          passing: Joi.array().items(Joi.string()).min(1).required(),
          failing: Joi.array().items(Joi.string()).min(1).required(),
        }).required(),
      }).required(),
    )
    .required(),
});

export function validatePromptScript(testScript: unknown): {
  validTestScript?: TestScriptFile;
  error?: ValidationError;
} {
  const { error, value } = schema.validate(testScript);

  if (error) {
    return { error };
  } else {
    return { validTestScript: value };
  }
}
