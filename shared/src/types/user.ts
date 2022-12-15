import { DocumentFields } from './common';

export type UserConfig = {
    maximumJobs: number;
    maximumProcessorPerJob: number
}

export type User = {
    name: string;
    spotifyId: string;
    refreshToken: string;
    config: UserConfig;
}

export type UserDocumentFields = User & DocumentFields;
