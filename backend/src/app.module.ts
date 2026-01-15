import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigDataModule } from './modules/config-data/config-data.module';
import { HumanModule } from './modules/human/human.module';
import { SmsModule } from './modules/sms/sms.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database
    PrismaModule,
    
    // Global services
    SmsModule,         // SMS service (MPP provider)
    
    // Feature modules
    AuthModule,
    ConfigDataModule,
    HumanModule,       // Human registration and profile
    // CompanyModule,    // Coming soon
    // JobModule,        // Coming soon
    // ContestModule,    // Coming soon
    // EventModule,      // Coming soon
    // ChatModule,       // Coming soon
    // NotificationModule, // Coming soon
    // PaymentModule,    // Coming soon
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
