import { prisma } from '@punch-it/shared/db';
import type { ProjectSummary } from '@punch-it/types/github';

const projectSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  repositoryUrl: true,
  githubRepoId: true,
  defaultBranch: true,
  framework: true,
  createdAt: true,
  updatedAt: true,
  team: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} as const;

type SelectedProject = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  repositoryUrl: string | null;
  githubRepoId: string | null;
  defaultBranch: string;
  framework: string | null;
  createdAt: Date;
  updatedAt: Date;
  team: {
    id: string;
    name: string;
    slug: string;
  };
};

function mapProject(project: SelectedProject): ProjectSummary {
  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    description: project.description,
    repositoryUrl: project.repositoryUrl,
    githubRepoId: project.githubRepoId,
    defaultBranch: project.defaultBranch,
    framework: project.framework,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    team: project.team,
  };
}

export class ProjectRepository {
  async findByGithubRepoIdForTeam(teamId: string, githubRepoId: string) {
    return prisma.project.findFirst({
      where: {
        teamId,
        githubRepoId,
        deletedAt: null,
      },
    });
  }

  async slugExistsInTeam(teamId: string, slug: string): Promise<boolean> {
    const existing = await prisma.project.findFirst({
      where: { teamId, slug, deletedAt: null },
      select: { id: true },
    });
    return Boolean(existing);
  }

  async findAccessibleProject(userId: string, projectId: string) {
    return prisma.project.findFirst({
      where: {
        id: projectId,
        deletedAt: null,
        team: {
          deletedAt: null,
          members: {
            some: {
              userId,
              deletedAt: null,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        repositoryUrl: true,
        githubRepoId: true,
        defaultBranch: true,
        githubAccountId: true,
      },
    });
  }

  async create(data: Parameters<typeof prisma.project.create>[0]['data']) {
    const project = await prisma.project.create({
      data,
      select: projectSelect,
    });
    return mapProject(project);
  }

  async listForUser(userId: string, page: number, pageSize: number) {
    const where = {
      deletedAt: null,
      team: {
        deletedAt: null,
        members: {
          some: {
            userId,
            deletedAt: null,
          },
        },
      },
    };

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        select: projectSelect,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      items: items.map(mapProject),
      total,
    };
  }
}

export const projectRepository = new ProjectRepository();
