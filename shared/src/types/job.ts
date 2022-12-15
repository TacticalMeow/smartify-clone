import { AxiosResponse } from 'axios';
import { DocumentFields } from './common';
import { BaseProcessorData, ProcessorTypes } from './processors';
import { User } from './user';

export type Edge = {
    id: string;
    source: string;
    target: string;
}

export type Node = {
    id: string;
    type: ProcessorTypes
    data: BaseProcessorData<object>;
}

export type Flow = {
    edges: Edge[];
    nodes: Node[];
    viewport: object;
}

export type JobHistory = {
    results: JobResults;
    lastRunAt: Date;
}

export type Job = {
    user: User;
    name: string;
    flow: Flow;
    history: JobHistory[];
}

export type JobDocumentFields = Job & DocumentFields;

export type CreateJobRequest = {
    name: string
}

export type CreateJob = {
    id: string
}

export type CreateJobResponse = AxiosResponse<CreateJob>

export type GetJobRequest = {
    jobId: string;
}

export type GetJob = JobDocumentFields

export type GetJobResponse = AxiosResponse<JobDocumentFields>

export type GetMyJobs = JobDocumentFields[]

export type GetMyJobsResponse = AxiosResponse<JobDocumentFields[]>

export type TestJobRequest = {
    id: string,
    flow: Flow
}

export type JobProcessorsHistory = {
    nodeId: string,
    processorId: string,
    processorName: string,
}

export type ProcessorResult = {
    id: string,
    name: string
    link: string,
    artists: string[],
    length: number,
    releaseDate: string,
    uri: string,
    processorsHistory: JobProcessorsHistory[]
}

export type JobResults = ProcessorResult[][]

export type TestJobResult = {
    results: ProcessorResult[][]
    errors?: {
        processorName?: string
        message: string
    }[]
}

export type TestJobResponse = AxiosResponse<TestJobResult>

export type SaveJobRequest = {
    jobId: string
    flow: Flow
}

export type SaveJobResult = {
    result: boolean
    errors?:{
        message: string
    }[]
}

export type SaveJobResponse = AxiosResponse<SaveJobResult>

export type SaveTracksRequest = {
    trackIds: string[],
    playlistName: string
}

export type SetJobSchedulerRequest ={
    jobId: string
    interval?: string
    startDate?: string
    endDate?: string
    timezone?: string
}

export type GetJobSchedulerRequest = {
    jobId: string
}

export type GetJobScheduler = {
    nextRun: string | null
    endDate: string | null
    interval: string | null
}

export type GetJobSchedulerResponse = AxiosResponse<GetJobScheduler>

export type DeleteJobRequest = {
    jobId: string
}

export type DeleteJobResult = {
    result: boolean
    err?: string
}

export type DeleteJobResponse = AxiosResponse<DeleteJobResult>

export type RenameJobRequest = {
    jobId: string
    newJobName: string
}

export type RenameJobResult = {
    result: boolean
    err?: string
}

export type RenameJobResponse = AxiosResponse<RenameJobResult>
