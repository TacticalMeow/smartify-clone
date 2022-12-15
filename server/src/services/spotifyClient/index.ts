import SpotifyWebApi from 'spotify-web-api-node';
import { logger } from 'logger';
import { SPOTIFY_MAX_RETRY } from 'env';
import { decorateAll } from 'services/spotifyClient/decorateAll';

const retry = async <T>(
  functionCall: () => Promise<T>, retries = 0,
): Promise<T> => {
  try {
    if (typeof functionCall === 'function') {
      return await functionCall();
    }

    return functionCall;
  } catch (e: any) {
    if (retries <= SPOTIFY_MAX_RETRY) {
      if (e && e.statusCode === 429) {
        const retryAfter = (parseInt(e.headers['retry-after'] as string, 10) + 1) * 1000;
        logger.debug(`sleeping for: ${retryAfter.toString()}`);
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((r) => setTimeout(r, retryAfter));
      }
      return retry<T>(functionCall, retries + 1);
    }

    logger.error(e.stack);
    throw e;
  }
};

const SPOTIFY_WEB_API_SYNC_METHODS = [
  'getCredentials', 'setCredentials', 'resetCredentials',
  'getClientId', 'setClientId', 'resetClientId',
  'getClientSecret', 'setClientSecret', 'resetClientSecret',
  'getRedirectURI', 'setRedirectURI', 'resetRedirectURI',
  'getAccessToken', 'setAccessToken', 'resetAccessToken',
  'getRefreshToken', 'setRefreshToken', 'resetRefreshToken',
];

const retryDecorator = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  const original = descriptor.value;
  if (!SPOTIFY_WEB_API_SYNC_METHODS.includes(original.name) && original.name[0] !== '_') {
    // eslint-disable-next-line no-param-reassign
    descriptor.value = async function (...args: any[]) {
      const result = await retry(() => original.apply(this, args));

      return result;
    };
  }
  return descriptor;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@decorateAll(retryDecorator, { deep: true })
export class SpotifyClient extends SpotifyWebApi {}
