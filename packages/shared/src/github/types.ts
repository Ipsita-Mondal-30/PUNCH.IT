export type GitHubApiRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  default_branch: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
  updated_at: string;
  language: string | null;
  stargazers_count: number;
};

export type GitHubSearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubApiRepo[];
};

export type ListReposOptions = {
  page?: number;
  perPage?: number;
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  affiliation?: string;
};

export type SearchReposOptions = {
  page?: number;
  perPage?: number;
  sort?: 'stars' | 'forks' | 'updated';
};

export type RateLimitState = {
  limit: number;
  remaining: number;
  resetAt: Date;
};
