import Joi, { ValidationError } from 'joi';

const schema = Joi.object()
  .keys({
    GENESYS_REGION: Joi.string().required(),
    GENESYSCLOUD_OAUTHCLIENT_ID: Joi.string().required(),
    GENESYSCLOUD_OAUTHCLIENT_SECRET: Joi.string().required(),
  })
  .unknown();

export function validateGenesysEnvVariables(env: NodeJS.ProcessEnv): {
  genesysVariables?: {
    region: string;
    oAuthClientId: string;
    oAuthClientSecret: string;
  };
  error?: ValidationError;
} {
  const { error, value } = schema.validate(env);

  if (error) {
    return { error };
  } else {
    return {
      genesysVariables: {
        region: value.GENESYS_REGION,
        oAuthClientId: value.GENESYSCLOUD_OAUTHCLIENT_ID,
        oAuthClientSecret: value.GENESYSCLOUD_OAUTHCLIENT_SECRET,
      },
    };
  }
}
