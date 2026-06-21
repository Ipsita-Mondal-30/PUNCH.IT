import { z } from 'zod';

export const importProjectBodySchema = z.object({
  githubRepoId: z.string().trim().min(1).max(64),
  teamId: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().max(5000).optional(),
  defaultBranch: z.string().trim().min(1).max(255).optional(),
  framework: z.string().trim().min(1).max(64).optional(),
  rootDirectory: z.string().trim().max(512).optional(),
  buildCommand: z.string().trim().max(512).optional(),
  installCommand: z.string().trim().max(512).optional(),
  outputDirectory: z.string().trim().max(512).optional(),
});

export const listProjectsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ImportProjectBody = z.infer<typeof importProjectBodySchema>;
export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;
