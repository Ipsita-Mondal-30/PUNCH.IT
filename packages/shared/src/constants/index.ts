export const APP_NAME = 'PUNCH.IT';

export const QUEUE_NAMES = {
  DEPLOYMENT: 'deployment',
  BUILD: 'build',
  CLEANUP: 'cleanup',
} as const;

export const JOB_NAMES = {
  PROCESS_DEPLOYMENT: 'process-deployment',
  RUN_BUILD: 'run-build',
  UPLOAD_ARTIFACTS: 'upload-artifacts',
  CLEANUP_OLD_BUILDS: 'cleanup-old-builds',
} as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const API_VERSION = 'v1';
