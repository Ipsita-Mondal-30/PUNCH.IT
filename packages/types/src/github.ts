export type GithubRepositorySummary = {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  cloneUrl: string;
  defaultBranch: string;
  isPrivate: boolean;
  owner: {
    login: string;
    avatarUrl: string | null;
  };
  updatedAt: string;
  language: string | null;
  stargazersCount: number;
};

export type ProjectSummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  repositoryUrl: string | null;
  githubRepoId: string | null;
  defaultBranch: string;
  framework: string | null;
  createdAt: string;
  updatedAt: string;
  team: {
    id: string;
    name: string;
    slug: string;
  };
};

export type ImportProjectInput = {
  githubRepoId: string;
  teamId?: string;
  name?: string;
  description?: string;
  defaultBranch?: string;
  framework?: string;
  rootDirectory?: string;
  buildCommand?: string;
  installCommand?: string;
  outputDirectory?: string;
};
