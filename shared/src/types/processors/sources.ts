export type GetPlaylistSource = {
    playlist: string;
}

export type GetAlbumSource = {
    album: string;
}

export type GetArtistRadioSource = {
    artist: string;
}

export type GetArtistTopTracksSource = {
    artist: string;
    market?: string;
}

export type GetFollowedArtistsTopTracksSource = {
    market?: string;
}

export enum SpotifyMyTopOptions {
    LongTerm = 'long_term',
    MediumTerm = 'medium_term',
    ShortTerm = 'short_term'
}

export type GetMyTopTracksSource = {
    timeRange?: SpotifyMyTopOptions
}

export type GetTrackRadio = {
    track: string
}

export enum Sources {
    GetPlaylist = 'GET_PLAYLIST',
    GetAlbum = 'GET_ALBUM',
    GetArtistRadio = 'GET_ARTIST_RADIO',
    GetArtistTopTracks = 'GET_ARTIST_TOP_TRACKS',
    GetFollowedArtistsTopTracks = 'GET_FOLLOWED_ARTISTS_TOP_TRACKS',
    GetMySavedAlbums = 'GET_MY_SAVED_ALBUMS',
    GetMySavedTracks = 'GET_MY_SAVED_TRACKS',
    GetMyTopTracks = 'GET_MY_TOP_TRACKS',
    GetTrackRadio = 'GET_TRACK_RADIO',
}
