import { Module, Global } from '@nestjs/common';
import { SmsService } from './sms.service';

@Global() // Make available throughout the app without importing
@Module({
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
