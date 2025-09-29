import { Logger as NestLogger } from '@nestjs/common';
import { Logger } from 'typeorm';

export class DatabaseLogger implements Logger {
  private readonly logger = new NestLogger('TypeORM');

  logQuery(query: string, parameters?: any[]): void {
    const params = parameters ? JSON.stringify(parameters) : '[]';
    this.logger.log(`Query: ${query} -- Params: ${params}`);
  }

  logQueryError(error: string, query: string, parameters?: any[]): void {
    const params = parameters ? JSON.stringify(parameters) : '[]';
    this.logger.error(`Query Error: ${error}`);
    this.logger.error(`Query: ${query} -- Params: ${params}`);
  }

  logQuerySlow(time: number, query: string, parameters?: any[]): void {
    const params = parameters ? JSON.stringify(parameters) : '[]';
    this.logger.warn(`Slow Query (${time}ms): ${query} -- Params: ${params}`);
  }

  logSchemaBuild(message: string): void {
    this.logger.log(`Schema Build: ${message}`);
  }

  logMigration(message: string): void {
    this.logger.log(`Migration: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any): void {
    switch (level) {
      case 'log':
        this.logger.log(`${message}`);
        break;
      case 'info':
        this.logger.log(`${message}`);
        break;
      case 'warn':
        this.logger.warn(`${message}`);
        break;
    }
  }
}
