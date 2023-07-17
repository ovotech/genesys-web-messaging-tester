import * as platformClient from 'purecloud-platform-client-v2';

interface GenesysPlatformApiAuth {
  region: string;
  oAuthClientId: string;
  oAuthClientSecret: string;
}

export async function configurePlatformClients(
  auth: GenesysPlatformApiAuth,
): Promise<{ convoApi: platformClient.ConversationsApi }> {
  const apiClient = platformClient.ApiClient.instance;

  apiClient.config.live_reload_config = false;
  apiClient.setEnvironment(auth.region);
  await apiClient.loginClientCredentialsGrant(auth.oAuthClientId, auth.oAuthClientSecret);

  return {
    convoApi: new platformClient.ConversationsApi(),
  };
}
