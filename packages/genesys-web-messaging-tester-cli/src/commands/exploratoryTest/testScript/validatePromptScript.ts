import Joi, { ValidationError } from 'joi';
import { TestPromptFile } from './parsePromptScript';

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
          pass: Joi.array().items(Joi.string()).min(1).required(),
          fail: Joi.array().items(Joi.string()).min(1).required(),
        }).required(),
      }).required(),
    )
    .required(),
});

interface ValidatePromptScriptValidResult {
  validPromptScript: TestPromptFile;
  error?: undefined;
}

interface ValidatePromptScriptInvalidResult {
  validPromptScript?: undefined;
  error: ValidationError;
}

export type ValidatePromptScriptResult =
  | ValidatePromptScriptValidResult
  | ValidatePromptScriptInvalidResult;

export function validatePromptScript(testScript: unknown): ValidatePromptScriptResult {
  const { error, value } = schema.validate(testScript);

  if (error) {
    return { error };
  } else {
    return { validPromptScript: value };
  }
}
