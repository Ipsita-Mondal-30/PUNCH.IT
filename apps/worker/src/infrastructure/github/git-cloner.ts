import { execFile } from 'node:child_process';
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

import type { GitCloner } from '../../domain/deployment/index.js';

const execFileAsync = promisify(execFile);

function buildAuthenticatedCloneUrl(repositoryUrl: string, accessToken: string): string {
  const url = new URL(repositoryUrl);
  url.username = 'x-access-token';
  url.password = accessToken;
  return url.toString();
}

export class GitHubGitCloner implements GitCloner {
  async clone(input: {
    repositoryUrl: string;
    branch: string;
    accessToken: string;
    workDir: string;
    rootDirectory: string | null;
    onOutput: (line: string) => void;
  }): Promise<{
    commitSha: string;
    commitMessage: string;
    authorName: string;
    authorEmail: string;
  }> {
    await rm(input.workDir, { recursive: true, force: true });
    await mkdir(input.workDir, { recursive: true });

    const cloneUrl = buildAuthenticatedCloneUrl(input.repositoryUrl, input.accessToken);
    input.onOutput(`Cloning ${input.repositoryUrl} (branch: ${input.branch})`);

    await execFileAsync(
      'git',
      ['clone', '--depth', '1', '--branch', input.branch, cloneUrl, input.workDir],
      { maxBuffer: 10 * 1024 * 1024 },
    );

    const repoDir = input.rootDirectory ? join(input.workDir, input.rootDirectory) : input.workDir;

    const { stdout: commitSha } = await execFileAsync('git', ['rev-parse', 'HEAD'], {
      cwd: repoDir,
      maxBuffer: 1024 * 1024,
    });

    const { stdout: logOutput } = await execFileAsync(
      'git',
      ['log', '-1', '--format=%B%n---META---%n%an%n%ae'],
      { cwd: repoDir, maxBuffer: 1024 * 1024 },
    );

    const [commitMessage = '', metaBlock = ''] = logOutput.split('\n---META---\n');
    const metaLines = metaBlock?.trim().split('\n') ?? [];

    return {
      commitSha: commitSha.trim(),
      commitMessage: commitMessage.trim(),
      authorName: metaLines[0]?.trim() ?? 'unknown',
      authorEmail: metaLines[1]?.trim() ?? 'unknown',
    };
  }
}

export const gitCloner = new GitHubGitCloner();
