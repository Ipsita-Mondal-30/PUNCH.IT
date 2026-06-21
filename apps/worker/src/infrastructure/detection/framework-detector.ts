import { access, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { FrameworkDetectionResult, FrameworkDetector } from '../../domain/deployment/index.js';

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile(path: string): Promise<Record<string, unknown> | null> {
  try {
    const content = await readFile(path, 'utf8');
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function hasDependency(packageJson: Record<string, unknown>, names: string[]): boolean {
  const sections = ['dependencies', 'devDependencies'] as const;

  for (const section of sections) {
    const deps = packageJson[section];
    if (typeof deps !== 'object' || deps === null) continue;

    for (const name of names) {
      if (name in deps) return true;
    }
  }

  return false;
}

const DOCKERFILE_TEMPLATES: Record<
  FrameworkDetectionResult['framework'],
  (detection: FrameworkDetectionResult) => string
> = {
  nextjs: (detection) => `FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN ${detection.installCommand ?? 'npm ci'}
COPY . .
RUN ${detection.buildCommand ?? 'npm run build'}
EXPOSE ${detection.port}
CMD ["npm", "start"]
`,
  vite: (detection) => `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN ${detection.installCommand ?? 'npm ci'}
COPY . .
RUN ${detection.buildCommand ?? 'npm run build'}
FROM nginx:alpine
COPY --from=builder /app/${detection.outputDirectory ?? 'dist'} /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`,
  react: (detection) => DOCKERFILE_TEMPLATES.vite(detection),
  node: (detection) => `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN ${detection.installCommand ?? 'npm ci --omit=dev'}
COPY . .
EXPOSE ${detection.port}
CMD ["node", "index.js"]
`,
  python: () => `FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["python", "main.py"]
`,
  go: () => `FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o server .
FROM alpine:3.20
WORKDIR /app
COPY --from=builder /app/server .
EXPOSE 8080
CMD ["./server"]
`,
  static: () => `FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`,
  docker: () => '',
  unknown: (detection) => DOCKERFILE_TEMPLATES.node(detection),
};

export class SourceFrameworkDetector implements FrameworkDetector {
  async detect(sourceDir: string): Promise<FrameworkDetectionResult> {
    if (await fileExists(join(sourceDir, 'Dockerfile'))) {
      return {
        framework: 'docker',
        buildCommand: null,
        installCommand: null,
        outputDirectory: null,
        port: 8080,
      };
    }

    const packageJsonPath = join(sourceDir, 'package.json');
    if (await fileExists(packageJsonPath)) {
      const packageJson = await readJsonFile(packageJsonPath);
      if (packageJson) {
        if (hasDependency(packageJson, ['next'])) {
          return {
            framework: 'nextjs',
            buildCommand: 'npm run build',
            installCommand: 'npm ci',
            outputDirectory: '.next',
            port: 3000,
          };
        }

        if (hasDependency(packageJson, ['vite'])) {
          return {
            framework: 'vite',
            buildCommand: 'npm run build',
            installCommand: 'npm ci',
            outputDirectory: 'dist',
            port: 4173,
          };
        }

        if (hasDependency(packageJson, ['react', 'react-dom'])) {
          return {
            framework: 'react',
            buildCommand: 'npm run build',
            installCommand: 'npm ci',
            outputDirectory: 'build',
            port: 3000,
          };
        }

        if (hasDependency(packageJson, ['express', 'fastify', '@hono/node-server'])) {
          return {
            framework: 'node',
            buildCommand: null,
            installCommand: 'npm ci --omit=dev',
            outputDirectory: null,
            port: 8080,
          };
        }

        return {
          framework: 'node',
          buildCommand: 'npm run build',
          installCommand: 'npm ci',
          outputDirectory: null,
          port: 8080,
        };
      }
    }

    if (await fileExists(join(sourceDir, 'requirements.txt'))) {
      return {
        framework: 'python',
        buildCommand: null,
        installCommand: 'pip install -r requirements.txt',
        outputDirectory: null,
        port: 8080,
      };
    }

    if (await fileExists(join(sourceDir, 'go.mod'))) {
      return {
        framework: 'go',
        buildCommand: 'go build -o server .',
        installCommand: null,
        outputDirectory: null,
        port: 8080,
      };
    }

    if (await fileExists(join(sourceDir, 'index.html'))) {
      return {
        framework: 'static',
        buildCommand: null,
        installCommand: null,
        outputDirectory: null,
        port: 80,
      };
    }

    return {
      framework: 'unknown',
      buildCommand: null,
      installCommand: null,
      outputDirectory: null,
      port: 8080,
    };
  }

  async ensureDockerfile(sourceDir: string, detection: FrameworkDetectionResult): Promise<void> {
    if (detection.framework === 'docker') {
      return;
    }

    const dockerfilePath = join(sourceDir, 'Dockerfile');
    if (await fileExists(dockerfilePath)) {
      return;
    }

    const template = DOCKERFILE_TEMPLATES[detection.framework](detection);
    if (!template) {
      throw new Error(`No Dockerfile template available for framework: ${detection.framework}`);
    }

    await writeFile(dockerfilePath, template, 'utf8');
  }
}

export const frameworkDetector = new SourceFrameworkDetector();
