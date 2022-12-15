import { lngCodeToLanguage } from '@smarter/shared';

export const languages = Object.keys(lngCodeToLanguage).reduce(
  (prev, current) => ([lngCodeToLanguage[current], ...prev]),
 [] as string[],
).sort();
