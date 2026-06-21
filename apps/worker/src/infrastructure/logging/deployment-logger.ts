import type { LogLevel, LogSource } from '../../domain/deployment/index.js';

import type { DeploymentLogRepository, DeploymentLogger } from '../../domain/deployment/index.js';

export class DatabaseDeploymentLogger implements DeploymentLogger {
  constructor(
    private readonly deploymentId: string,
    private readonly logRepository: DeploymentLogRepository,
  ) {}

  async info(source: LogSource, message: string): Promise<void> {
    await this.write('INFO', source, message);
  }

  async warn(source: LogSource, message: string): Promise<void> {
    await this.write('WARN', source, message);
  }

  async error(source: LogSource, message: string): Promise<void> {
    await this.write('ERROR', source, message);
  }

  async debug(source: LogSource, message: string): Promise<void> {
    await this.write('DEBUG', source, message);
  }

  private async write(level: LogLevel, source: LogSource, message: string): Promise<void> {
    await this.logRepository.append(this.deploymentId, { level, source, message });
  }
}

export function createDeploymentLogger(
  deploymentId: string,
  logRepository: DeploymentLogRepository,
): DeploymentLogger {
  return new DatabaseDeploymentLogger(deploymentId, logRepository);
}
