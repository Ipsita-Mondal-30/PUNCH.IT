import { spawn } from 'node:child_process';

import type { ContainerRegistry, PushImageResult } from '../../domain/deployment/index.js';

function runCommand(
  command: string,
  args: string[],
  options: { onOutput: (line: string) => void },
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
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

export class GoogleArtifactRegistry implements ContainerRegistry {
  async push(input: {
    localImageTag: string;
    remoteImageUri: string;
    onOutput: (line: string) => void;
  }): Promise<PushImageResult> {
    input.onOutput(`Tagging image as ${input.remoteImageUri}`);
    await runCommand('docker', ['tag', input.localImageTag, input.remoteImageUri], {
      onOutput: input.onOutput,
    });

    input.onOutput(`Pushing image to Artifact Registry`);
    await runCommand('docker', ['push', input.remoteImageUri], {
      onOutput: input.onOutput,
    });

    return { remoteImageUri: input.remoteImageUri };
  }
}

export const containerRegistry = new GoogleArtifactRegistry();
