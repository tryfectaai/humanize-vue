import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.isConnected = false;
      this.logger.warn('⚠️ Database connection failed. API will run with limited functionality.');
      this.logger.warn(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.logger.warn('Make sure MySQL is running and DATABASE_URL is correct in .env');
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
    }
  }

  isDatabaseConnected(): boolean {
    return this.isConnected;
  }

  async cleanDatabase() {
    // Only for testing - clears all tables
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('cleanDatabase can only be called in test environment');
    }
    
    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === 'string' && !key.startsWith('_') && !key.startsWith('$'),
    );

    for (const model of models) {
      if (typeof this[model as keyof this] === 'object' && this[model as keyof this] !== null) {
        const prismaModel = this[model as keyof this] as { deleteMany?: () => Promise<unknown> };
        if (typeof prismaModel.deleteMany === 'function') {
          await prismaModel.deleteMany();
        }
      }
    }
  }
}
