import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async healthCheck() {
    const checks: Record<string, string> = {};
    let status = 'healthy';

    // Database check
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = 'ok';
    } catch (error) {
      checks.database = `error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      status = 'unhealthy';
    }

    return {
      status,
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}
