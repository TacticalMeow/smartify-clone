import { lngCodeToLanguage, ProcessorResult } from '@smarter/shared';
import franc from 'franc';
import _ from 'lodash';
import { cache, CacheOptions } from 'services/cache';
import { lyricsClient } from 'services/geniusClient';

type LanguageRecord = {
  language: string
};

const getLyrics = async (songName: string, songArtist: string) => {
  try {
    const songsRes = await lyricsClient.songs.search(songName);

    if (songsRes) {
      const bestMatchedSong = _.find(songsRes, (song) => song.artist.name.includes(songArtist));

      if (bestMatchedSong) {
        const lyrics = await bestMatchedSong.lyrics();

        if (lyrics) {
          return lyrics;
        }
      }
    }
    return null;
  } catch (err: any) {
    return null;
  }
};

const cacheNotFoundTrackLangs = (trackLangs : {id:string, language:string}[]) => {
  cache.mset(trackLangs.map(
    (datum) => ({ key: datum.id, val: { language: datum.language } }),
  ), CacheOptions.Language);
};

export const getTracksLanguage = async (tracks : ProcessorResult[]) :
Promise<{[trackId:string]: string}> => {
  const {
    found,
    notFound,
  } = cache.mgetDiff<LanguageRecord>(tracks.map((track) => track.id), CacheOptions.Language);

  const languagesFromGenius = (await Promise.all((notFound.map(async (trackId: string) => {
    const trackData = tracks.find((track) => track.id === trackId);
    if (trackData) {
      const response = await getLyrics(trackData.name, trackData.artists[0]);

      if (response) {
        return { id: trackId, language: lngCodeToLanguage[franc(response)] };
      }
    }
    return null;
  })))).filter((item): item is {id:string, language:string} => item != null);

  cacheNotFoundTrackLangs(languagesFromGenius);

  const languagesFromGeniusById = languagesFromGenius.reduce((acc, item) => ({
    ...acc,
    [item.id]: item.language,
  }), {});

  return { ...languagesFromGeniusById, ...found };
};
