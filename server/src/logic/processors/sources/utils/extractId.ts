/* eslint-disable no-useless-escape */
export const extractId = (id: string, resource: string) => {
  const hrefRegexPattern = `https://open.spotify.com/${resource}/([A-Za-z0-9]+)`;
  const uriRegexPattern = `spotify:${resource}:(.*)`;

  const hrefRegex = new RegExp(hrefRegexPattern);
  const hrefId = id.match(hrefRegex);
  if (hrefId) {
    return hrefId[1];
  }

  const uriRegex = new RegExp(uriRegexPattern);
  const uriId = id.match(uriRegex);
  if (uriId) {
    return uriId[1];
  }

  return id;
};
