import _ from 'lodash';
import NodeCache from 'node-cache';

export enum CacheOptions {
  AudioFeatures = 'AUD_FEAT',
  Language = 'LANG',
}

export type GetCachedItemsResult<T = unknown> = {
    found: {[key: string]: T}
    notFound: string[]
}

export type MSetData = {
    key: string;
    val: unknown;
}

class Cache {
  // eslint-disable-next-line no-use-before-define
  private static _instance: Cache = new Cache();

  private _client: NodeCache = new NodeCache({ stdTTL: 300 });

  constructor() {
    if (Cache._instance) {
      throw new Error('Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.');
    }
    Cache._instance = this;
  }

  public static getInstance(): Cache {
    return Cache._instance;
  }

  public mget(keys: string[], cacheOption : CacheOptions) {
    const cachedData = this._client.mget(keys.map((key) => `${key}_${cacheOption}`));
    return _.reduce(
      Object.keys(cachedData),
      (acc :{[key:string]: unknown}, currKey) => {
        const keyRegexPattern = `(?<=.*)_${cacheOption}`;
        const newKey = currKey.replace(new RegExp(keyRegexPattern), '');
        acc[newKey] = cachedData[currKey];
        return acc;
      },
      {},
    );
  }

  public mgetDiff<T>(keys: string[], cacheOption: CacheOptions): GetCachedItemsResult<T> {
    const found = this.mget(keys, cacheOption) as any;
    const notFound = _.difference(keys, Object.keys(found));

    return { found, notFound };
  }

  public mset(data: MSetData[], cacheOption: CacheOptions) {
    this._client.mset(data.map((datum) => ({ key: `${datum.key}_${cacheOption}`, val: datum.val })));
  }
}

export const cache: Cache = Cache.getInstance();
