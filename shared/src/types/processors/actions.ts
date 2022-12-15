import { SpotifyAudioFeaturesFullObject } from '../common';

export type Sample = {
    count: number;
}

export type SpotifyAudioFeatures = keyof Pick<SpotifyAudioFeaturesFullObject,
 'acousticness' | 'danceability' | 'energy' | 'instrumentalness' | 'liveness'
 | 'loudness' | 'speechiness' | 'valence' | 'tempo'
 >

export type FilterByAudioFeatures = {
    [key in SpotifyAudioFeatures]: number[]
}

export type GenerateMoreTracksLike = {
    limit: number
}

export type NoLongerThan = {
    limit: string
}

export type NoShorterThan = {
    limit: string
}

export type LanguageFilter = {
    languages: string[]
}

export enum Actions {
    Sample = 'SAMPLE',
    FilterByAudioFeatures = 'FILTER_BY_AUDIO_FEATURES',
    Dedup = 'DEDUP',
    SeparateArtists = 'SEPARATE_ARTISTS',
    NoLongerThan = 'NO_LONGER_THAN',
    NoShorterThan = 'NO_SHORTER_THAN',
    GenerateMoreTracksLike = 'GENERATE_MORE_TRACKS_LIKE',
    FilterByLanguage = 'FILTER_BY_LANGUAGE'
}
