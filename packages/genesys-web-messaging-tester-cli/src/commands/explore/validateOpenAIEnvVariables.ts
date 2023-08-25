import Joi, { ValidationError } from 'joi';

const schema = Joi.object()
  .keys({
    OPENAI_API_KEY: Joi.string().required(),
  })
  .unknown();

export function validateOpenAiEnvVariables(env: NodeJS.ProcessEnv): {
  openAikey?: string;
  error?: ValidationError;
} {
  const { error, value } = schema.validate(env);

  if (error) {
    return { error };
  } else {
    return {
      openAikey: value.OPENAI_API_KEY,
    };
  }
}
