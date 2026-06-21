import { spawn } from 'node:child_process';

import type { CloudRunDeployer, DeployResult } from '../../domain/deployment/index.js';
import { env } from '../../config/env.js';

function runCommand(
  command: string,
  args: string[],
  options: { onOutput: (line: string) => void },
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let output = '';

    const handleLine = (chunk: Buffer) => {
      const text = chunk.toString();
      output += text;
      for (const line of text.split('\n')) {
        const trimmed = line.trim();
        if (trimmed) options.onOutput(trimmed);
      }
    };

    child.stdout.on('data', handleLine);
    child.stderr.on('data', handleLine);

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve(output);
        return;
      }
      reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

function extractServiceUrl(output: string): string | null {
  const urlMatch = output.match(/https:\/\/[^\s]+/);
  return urlMatch?.[0] ?? null;
}

export class GcloudCloudRunDeployer implements CloudRunDeployer {
  async deploy(input: {
    serviceName: string;
    imageUri: string;
    port: number;
    onOutput: (line: string) => void;
  }): Promise<DeployResult> {
    input.onOutput(`Deploying ${input.serviceName} to Cloud Run`);

    const output = await runCommand(
      'gcloud',
      [
        'run',
        'deploy',
        input.serviceName,
        '--image',
        input.imageUri,
        '--region',
        env.GCP_REGION,
        '--project',
        env.GCP_PROJECT_ID,
        '--port',
        String(input.port),
        '--allow-unauthenticated',
        '--platform',
        'managed',
        '--quiet',
      ],
      { onOutput: input.onOutput },
    );

    const serviceUrl = extractServiceUrl(output);
    if (!serviceUrl) {
      throw new Error('Cloud Run deployment succeeded but service URL was not found');
    }

    return {
      serviceName: input.serviceName,
      serviceUrl,
    };
  }
}

export const cloudRunDeployer = new GcloudCloudRunDeployer();
