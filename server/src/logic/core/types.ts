import { UserDocument } from 'models/user/types';
import { SpotifyClient } from 'services/spotifyClient';

type JobOptions = {
    isTest: boolean,
}

export type JobResources = {
    spotifyClient?: SpotifyClient,
    user?: UserDocument & {_id: any} | null,
    options: JobOptions
}
