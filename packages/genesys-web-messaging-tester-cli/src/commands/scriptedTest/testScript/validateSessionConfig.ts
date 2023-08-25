import { SessionConfig } from '@ovotech/genesys-web-messaging-tester';
import Joi, { ValidationError } from 'joi';

const schema = Joi.object({
  deploymentId: Joi.string().required(),
  region: Joi.string().required(),
  origin: Joi.string(),
});

export function validateSessionConfig(sessionConfig: Partial<SessionConfig>): {
  validSessionConfig?: SessionConfig;
  error?: ValidationError;
} {
  const { error, value } = schema.validate(sessionConfig);

  if (error) {
    return { error };
  } else {
    return { validSessionConfig: value };
  }
}
