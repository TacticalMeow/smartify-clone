// eslint-disable-next-line no-shadow
export enum Endpoints {
  login = '/api/auth/login',
  logout= '/api/auth/logout',
  refreshAccessToken= '/api/auth/refresh-access-token',
  getCsrf='/api/auth/csrf',
  createJob= '/api/job/create',
  getJob='/api/job/get',
  getMyJobs='/api/job/my-jobs',
  testJob = '/api/job/test',
  saveJob = '/api/job/save',
  setJobScheduler = '/api/job/set-scheduler',
  getJobScheduler = '/api/job/get-scheduler',
  deleteJob = '/api/job/delete',
  renameJob= '/api/job/rename',
}
