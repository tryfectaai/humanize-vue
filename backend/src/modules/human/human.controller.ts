import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HumanService } from './human.service';
import {
  Step1BasicInfoDto,
  Step2ModelingDto,
  Step2InterestsDto,
  Step3ProfileDto,
  Step4VerificationDto,
  SendOtpDto,
  VerifyOtpDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Human Registration')
@ApiBearerAuth()
@Controller('human')
@UseGuards(JwtAuthGuard)
export class HumanController {
  constructor(private readonly humanService: HumanService) {}

  // ==========================================
  // STEP 1: Basic Information
  // ==========================================
  @Post('registration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Step 1: Save basic information' })
  async createBasicInfo(
    @CurrentUser() user: User,
    @Body() dto: Step1BasicInfoDto,
  ) {
    return this.humanService.createOrUpdateBasicInfo(user, dto);
  }

  @Get('registration')
  @ApiOperation({ summary: 'Get basic information' })
  async getBasicInfo(@CurrentUser() user: User) {
    return this.humanService.getBasicInfo(user);
  }

  // ==========================================
  // STEP 2: Interests (NEW - replaces modeling)
  // ==========================================
  @Post('interests')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Step 2: Save interests' })
  async createInterests(@CurrentUser() user: User, @Body() dto: Step2InterestsDto) {
    return this.humanService.createOrUpdateInterests(user, dto);
  }

  @Get('interests')
  @ApiOperation({ summary: 'Get interests' })
  async getInterests(@CurrentUser() user: User) {
    return this.humanService.getInterests(user);
  }

  // ==========================================
  // STEP 2 (LEGACY): Modeling Preferences
  // Kept for backwards compatibility
  // ==========================================
  @Post('modeling')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Step 2 (Legacy): Save modeling preferences' })
  async createModeling(@CurrentUser() user: User, @Body() dto: Step2ModelingDto) {
    return this.humanService.createOrUpdateModeling(user, dto);
  }

  @Get('modeling')
  @ApiOperation({ summary: 'Get modeling preferences (Legacy)' })
  async getModeling(@CurrentUser() user: User) {
    return this.humanService.getModeling(user);
  }

  // ==========================================
  // STEP 3: Profile (with job sector, job title, height)
  // ==========================================
  @Post('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Step 3: Save profile information' })
  async createProfile(@CurrentUser() user: User, @Body() dto: Step3ProfileDto) {
    return this.humanService.createOrUpdateProfile(user, dto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get profile information' })
  async getProfile(@CurrentUser() user: User) {
    return this.humanService.getProfile(user);
  }

  // ==========================================
  // STEP 4: Verification
  // ==========================================
  @Post('verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Step 4: Save verification details' })
  async createVerification(
    @CurrentUser() user: User,
    @Body() dto: Step4VerificationDto,
  ) {
    return this.humanService.createOrUpdateVerification(user, dto);
  }

  @Get('verification')
  @ApiOperation({ summary: 'Get verification details' })
  async getVerification(@CurrentUser() user: User) {
    return this.humanService.getVerification(user);
  }

  // ==========================================
  // STEP 5: Phone OTP Verification
  // ==========================================
  @Post('phone-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Step 5: Send OTP to phone' })
  async sendOtp(@CurrentUser() user: User, @Body() dto: SendOtpDto) {
    return this.humanService.sendOtp(user, dto);
  }

  @Post('phone-verification/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Step 5: Verify OTP code' })
  async verifyOtp(@CurrentUser() user: User, @Body() dto: VerifyOtpDto) {
    return this.humanService.verifyOtp(user, dto);
  }

  @Get('phone-verification')
  @ApiOperation({ summary: 'Get phone verification status' })
  async getPhoneVerification(@CurrentUser() user: User) {
    return this.humanService.getPhoneVerification(user);
  }

  // ==========================================
  // REGISTRATION STATUS
  // ==========================================
  @Get('registration-status')
  @ApiOperation({ summary: 'Get overall registration status' })
  async getRegistrationStatus(@CurrentUser() user: User) {
    return this.humanService.getRegistrationStatus(user);
  }
}
