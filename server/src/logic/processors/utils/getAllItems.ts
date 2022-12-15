import SpotifyApi from 'spotify-web-api-node';

type CallbackArgs = {
    offset: number,
    limit: number
}
type GetAllItemsCallback = (args: CallbackArgs) => Promise<any> | undefined;

export const getAllItems = async <T>(
  body: SpotifyApi.PagingObject<T>,
  callback: GetAllItemsCallback,
  limit = 50,
) => {
  let data = body.items;
  const length = Math.ceil(body.total / limit);

  if (body.total > limit) {
    for (let i = 1; i < length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const nextData = await callback({ offset: limit * i, limit });

      if (nextData) {
        data = [
          ...data,
          ...nextData.body.items];
      }
    }
  }

  return data;
};
