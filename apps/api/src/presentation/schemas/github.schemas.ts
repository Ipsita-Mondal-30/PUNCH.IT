import { z } from 'zod';

export const listGithubReposQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(30),
  sort: z.enum(['created', 'updated', 'pushed', 'full_name']).default('updated'),
});

export const searchGithubReposQuerySchema = z.object({
  q: z.string().trim().min(1).max(256),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(30),
  sort: z.enum(['stars', 'forks', 'updated']).default('updated'),
});

export type ListGithubReposQuery = z.infer<typeof listGithubReposQuerySchema>;
export type SearchGithubReposQuery = z.infer<typeof searchGithubReposQuerySchema>;
