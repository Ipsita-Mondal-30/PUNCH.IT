import { spawn } from 'node:child_process';

import type { BuildImageResult, ContainerBuilder } from '../../domain/deployment/index.js';

function runCommand(
  command: string,
  args: string[],
  options: { cwd?: string; onOutput: (line: string) => void },
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const handleLine = (chunk: Buffer) => {
      for (const line of chunk.toString().split('\n')) {
        const trimmed = line.trim();
        if (trimmed) options.onOutput(trimmed);
      }
    };

    child.stdout.on('data', handleLine);
    child.stderr.on('data', handleLine);

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

export class DockerContainerBuilder implements ContainerBuilder {
  async build(input: {
    sourceDir: string;
    imageTag: string;
    onOutput: (line: string) => void;
  }): Promise<BuildImageResult> {
    input.onOutput(`Building Docker image: ${input.imageTag}`);

    await runCommand('docker', ['build', '-t', input.imageTag, '.'], {
      cwd: input.sourceDir,
      onOutput: input.onOutput,
    });

    return { localImageTag: input.imageTag };
  }
}

export const containerBuilder = new DockerContainerBuilder();
