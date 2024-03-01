import Joi, { ValidationError } from 'joi';

const schema = Joi.object()
  .keys({
    OPENAI_API_KEY: Joi.string().required(),
  })
  .unknown();

export function validateOpenAiEnvVariables(env: NodeJS.ProcessEnv): {
  openAiKey?: string;
  error?: ValidationError;
} {
  const { error, value } = schema.validate(env);

  if (error) {
    return { error };
  } else {
    return {
      openAiKey: value.OPENAI_API_KEY,
    };
  }
}
