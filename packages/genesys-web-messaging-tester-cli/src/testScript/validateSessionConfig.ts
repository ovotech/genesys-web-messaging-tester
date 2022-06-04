import Joi, { ValidationError } from 'joi';
import { TestScriptFile } from './parseTestScript';

const schema = Joi.object<TestScriptFile['config']>({
  deploymentId: Joi.string().required(),
  region: Joi.string().required(),
  origin: Joi.string(),
  stepTimeoutInSeconds: Joi.number(),
});

export function validateSessionConfig(sessionConfig: NonNullable<TestScriptFile['config']>): {
  validSessionConfig?: NonNullable<TestScriptFile['config']>;
  error?: ValidationError;
} {
  const { error, value } = schema.validate(sessionConfig);

  if (error) {
    return { error };
  } else {
    return { validSessionConfig: value };
  }
}
