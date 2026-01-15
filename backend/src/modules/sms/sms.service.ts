import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface SendSmsOptions {
  phoneNumber: string;
  message: string;
  language?: 'en' | 'ar';
}

export interface SendOtpOptions {
  phoneNumber: string;
  code: string;
  language?: 'en' | 'ar';
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiKey: string;
  private readonly senderName: string;
  private readonly apiUrl = 'https://api.mpp-sms.com/api/send.aspx/';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('MPP_API_KEY') || '';
    this.senderName = this.configService.get<string>('MPP_SENDER_NAME') || 'humanize';
  }

  /**
   * Send OTP code via SMS
   * Uses MPP SMS provider (Kuwait-based SMS gateway)
   */
  async sendOtp(options: SendOtpOptions): Promise<boolean> {
    const { phoneNumber, code, language = 'en' } = options;

    // Generate bilingual message
    const message =
      language === 'ar'
        ? `${code} كود التحقق من رقم الهاتف`
        : `OTP Code is ${code}`;

    return this.sendSms({
      phoneNumber,
      message,
      language,
    });
  }

  /**
   * Send SMS via MPP SMS API
   * API Documentation: https://mpp-sms.com/
   */
  async sendSms(options: SendSmsOptions): Promise<boolean> {
    const { phoneNumber, message, language = 'en' } = options;

    // Check if API key is configured
    if (!this.apiKey) {
      this.logger.warn('MPP_API_KEY not configured - SMS will not be sent');
      this.logger.log(`[DEV MODE] Would send SMS to ${phoneNumber}: ${message}`);
      return true; // Return true in dev mode to not block the flow
    }

    // Format phone number (remove + prefix if present)
    const formattedPhone = phoneNumber.startsWith('+')
      ? phoneNumber.substring(1)
      : phoneNumber;

    // Language code: 1 = English, 2 = Arabic
    const langCode = language === 'ar' ? 2 : 1;

    try {
      const params = {
        apikey: this.apiKey,
        language: langCode,
        message: message,
        sender: this.senderName,
        mobile: formattedPhone,
      };

      this.logger.log(`Sending SMS to ${formattedPhone} (lang: ${language})`);

      const response = await axios.get(this.apiUrl, { params });

      this.logger.debug(`MPP SMS Response: ${JSON.stringify(response.data)}`);

      // Check if response contains OK (success indicator)
      const responseText = String(response.data);
      if (responseText.includes('OK') || response.status === 200) {
        this.logger.log(`SMS sent successfully to ${formattedPhone}`);
        return true;
      }

      this.logger.error(`SMS send failed: ${responseText}`);
      return false;
    } catch (error: any) {
      this.logger.error(`Failed to send SMS to ${formattedPhone}`, error.message);
      
      // In development, don't fail the request if SMS fails
      const isDev = this.configService.get<string>('NODE_ENV') !== 'production';
      if (isDev) {
        this.logger.warn('[DEV MODE] SMS failed but continuing flow');
        return true;
      }
      
      return false;
    }
  }

  /**
   * Generate a random OTP code
   */
  generateOtp(length: number = 6): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }
}
