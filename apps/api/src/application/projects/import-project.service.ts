import { getGithubAccountForUser } from '@punch-it/shared/auth/github';
import { resolveUniqueSlug } from '@punch-it/shared/utils';
import type { ImportProjectInput, ProjectSummary } from '@punch-it/types/github';

import { githubReposService } from '../github/github-repos.service.js';
import { projectRepository } from '../../infrastructure/repositories/project.repository.js';
import { teamRepository } from '../../infrastructure/repositories/team.repository.js';

export class ImportProjectError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(code: string, message: string, statusCode: number) {
    super(message);
    this.name = 'ImportProjectError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class ImportProjectService {
  async importRepository(
    userId: string,
    userDisplayName: string,
    input: ImportProjectInput,
  ): Promise<ProjectSummary> {
    const githubAccount = await getGithubAccountForUser(userId);
    if (!githubAccount) {
      throw new ImportProjectError(
        'GITHUB_NOT_LINKED',
        'No linked GitHub account. Sign in with GitHub first.',
        400,
      );
    }

    const repo = await githubReposService.getRepository(userId, input.githubRepoId);

    const team = input.teamId
      ? await teamRepository.findAccessibleTeam(userId, input.teamId)
      : await teamRepository.getOrCreateDefaultTeam(userId, userDisplayName);

    if (!team) {
      throw new ImportProjectError('TEAM_NOT_FOUND', 'Team not found or access denied.', 404);
    }

    const existing = await projectRepository.findByGithubRepoIdForTeam(team.id, repo.id);
    if (existing) {
      throw new ImportProjectError(
        'PROJECT_ALREADY_IMPORTED',
        'This repository is already imported for this team.',
        409,
      );
    }

    const baseSlug = input.name ?? repo.name;
    const slug = await resolveUniqueSlug(baseSlug, (candidate) =>
      projectRepository.slugExistsInTeam(team.id, candidate),
    );

    return projectRepository.create({
      name: input.name ?? repo.name,
      slug,
      description: input.description ?? repo.description,
      repositoryUrl: repo.htmlUrl,
      githubRepoId: repo.id,
      defaultBranch: input.defaultBranch ?? repo.defaultBranch,
      framework: input.framework ?? repo.language,
      rootDirectory: input.rootDirectory,
      buildCommand: input.buildCommand,
      installCommand: input.installCommand,
      outputDirectory: input.outputDirectory,
      team: { connect: { id: team.id } },
      creator: { connect: { id: userId } },
      githubAccount: { connect: { id: githubAccount.id } },
    });
  }

  async listProjects(userId: string, page: number, pageSize: number) {
    return projectRepository.listForUser(userId, page, pageSize);
  }
}

export const importProjectService = new ImportProjectService();
