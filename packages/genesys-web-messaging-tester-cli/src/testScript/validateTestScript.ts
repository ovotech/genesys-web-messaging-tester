import Joi, { ValidationError } from 'joi';
import { TestScriptFile } from './parseTestScript';

const schema = Joi.object({
  config: Joi.object({
    deploymentId: Joi.string(),
    region: Joi.string(),
    origin: Joi.string(),
  }).optional(),
  scenarios: Joi.object()
    .min(1)
    .pattern(
      /./,
      Joi.array().items(
        Joi.object({
          say: Joi.string(),
          waitForReplyContaining: Joi.string(),
        }).length(1),
      ),
    )
    .required(),
});

export function validateTestScript(testScript: unknown): {
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
