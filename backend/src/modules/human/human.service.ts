import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';
import {
  Step1BasicInfoDto,
  Step2ModelingDto,
  Step2InterestsDto,
  Step3ProfileDto,
  Step4VerificationDto,
  SendOtpDto,
  VerifyOtpDto,
} from './dto';
import type { User } from '@prisma/client';

@Injectable()
export class HumanService {
  private readonly logger = new Logger(HumanService.name);

  constructor(
    private prisma: PrismaService,
    private smsService: SmsService,
    private configService: ConfigService,
  ) {}

  // ==========================================
  // STEP 1: Basic Information
  // ==========================================
  async createOrUpdateBasicInfo(user: User, dto: Step1BasicInfoDto) {
    // Check if profile name is already taken by another user
    const existingProfile = await this.prisma.humanOfficialRegistration.findFirst({
      where: {
        profileName: dto.profileName,
        NOT: { userId: user.id },
      },
    });

    if (existingProfile) {
      throw new ConflictException('Profile name is already taken');
    }

    // Check if phone is already taken by another user
    if (dto.phone) {
      const existingPhone = await this.prisma.humanOfficialRegistration.findFirst({
        where: {
          phone: dto.phone,
          NOT: { userId: user.id },
        },
      });

      if (existingPhone) {
        throw new ConflictException('Phone number is already registered');
      }
    }

    // Create or update the registration
    const registration = await this.prisma.humanOfficialRegistration.upsert({
      where: { userId: user.id },
      update: {
        name: dto.name,
        profileName: dto.profileName,
        phone: dto.phone,
        gender: dto.gender,
        dob: new Date(dto.dob),
        nationality: dto.nationality,
        placeOfLiving: dto.placeOfLiving,
        address: dto.address || '',
        currentState: 'in_progress',
      },
      create: {
        userId: user.id,
        name: dto.name,
        profileName: dto.profileName,
        phone: dto.phone,
        gender: dto.gender,
        dob: new Date(dto.dob),
        nationality: dto.nationality,
        placeOfLiving: dto.placeOfLiving,
        address: dto.address || '',
        currentState: 'pending',
      },
    });

    return {
      success: true,
      message: 'Basic information saved successfully',
      data: registration,
    };
  }

  async getBasicInfo(user: User) {
    const registration = await this.prisma.humanOfficialRegistration.findUnique({
      where: { userId: user.id },
    });

    if (!registration) {
      return { data: null };
    }

    return { data: registration };
  }

  // ==========================================
  // STEP 2: Interests (NEW - replaces old Modeling)
  // ==========================================
  async createOrUpdateInterests(user: User, dto: Step2InterestsDto) {
    // First, ensure the user has completed Step 1
    const registration = await this.prisma.humanOfficialRegistration.findUnique({
      where: { userId: user.id },
    });

    if (!registration) {
      throw new BadRequestException('Please complete Step 1 (Basic Information) first');
    }

    // Upsert profile with modelBefore, price, otherModeling
    const profile = await this.prisma.humanProfile.upsert({
      where: { userId: user.id },
      update: {
        modelBefore: dto.modelBefore,
        price: dto.price,
        otherModeling: dto.otherModeling || null,
        currentState: 'in_progress',
      },
      create: {
        userId: user.id,
        officialRegistrationId: registration.id,
        profileVisibility: 'public',
        modelBefore: dto.modelBefore,
        price: dto.price,
        otherModeling: dto.otherModeling || null,
        currentState: 'pending',
      },
    });

    // Delete existing interest relations
    await this.prisma.humanProfileInterest.deleteMany({
      where: { profileId: profile.id },
    });

    // Create new interest relations
    if (dto.interests && dto.interests.length > 0) {
      await this.prisma.humanProfileInterest.createMany({
        data: dto.interests.map((interestId) => ({
          profileId: profile.id,
          interestId: interestId,
        })),
        skipDuplicates: true,
      });
    }

    // Fetch the profile with interests
    const profileWithInterests = await this.prisma.humanProfile.findUnique({
      where: { id: profile.id },
      include: {
        interests: {
          include: { interest: true },
        },
      },
    });

    return {
      success: true,
      message: 'Interests saved successfully',
      data: profileWithInterests,
    };
  }

  async getInterests(user: User) {
    const profile = await this.prisma.humanProfile.findUnique({
      where: { userId: user.id },
      include: {
        interests: {
          include: { interest: true },
        },
      },
    });

    if (!profile) {
      return { data: null };
    }

    // Return interests and modeling preferences
    return {
      data: {
        interests: profile.interests.map((pi) => pi.interestId),
        interestDetails: profile.interests.map((pi) => pi.interest),
        modelBefore: profile.modelBefore,
        price: profile.price,
        otherModeling: profile.otherModeling,
      },
    };
  }

  // ==========================================
  // STEP 2 (LEGACY): Modeling Preferences
  // Kept for backwards compatibility with existing data
  // ==========================================
  async createOrUpdateModeling(user: User, dto: Step2ModelingDto) {
    // First, ensure the user has completed Step 1
    const registration = await this.prisma.humanOfficialRegistration.findUnique({
      where: { userId: user.id },
    });

    if (!registration) {
      throw new BadRequestException('Please complete Step 1 (Basic Information) first');
    }

    // Create or get existing modeling record
    let modeling = await this.prisma.humanModeling.findUnique({
      where: { userId: user.id },
    });

    if (modeling) {
      // Delete existing M2M relations
      await this.prisma.humanModelingType.deleteMany({
        where: { humanModelingId: modeling.id },
      });
      await this.prisma.humanProductionType.deleteMany({
        where: { humanModelingId: modeling.id },
      });
      await this.prisma.humanPreference.deleteMany({
        where: { humanModelingId: modeling.id },
      });

      // Update existing record
      modeling = await this.prisma.humanModeling.update({
        where: { id: modeling.id },
        data: {
          modelBefore: dto.modelBefore,
          price: dto.price,
          otherModeling: dto.otherModeling || null,
          otherProduction: dto.otherProduction || null,
          otherPreference: dto.otherPreference || null,
          currentStatus: 'in_progress',
        },
      });
    } else {
      // Create new record
      modeling = await this.prisma.humanModeling.create({
        data: {
          userId: user.id,
          officialRegistrationId: registration.id,
          modelBefore: dto.modelBefore,
          price: dto.price,
          otherModeling: dto.otherModeling || null,
          otherProduction: dto.otherProduction || null,
          otherPreference: dto.otherPreference || null,
          currentStatus: 'pending',
        },
      });
    }

    // Create M2M relations for modeling types
    if (dto.modelingTypes && dto.modelingTypes.length > 0) {
      await this.prisma.humanModelingType.createMany({
        data: dto.modelingTypes.map((typeId) => ({
          humanModelingId: modeling!.id,
          modelingTypeId: typeId,
        })),
        skipDuplicates: true,
      });
    }

    // Create M2M relations for production types
    if (dto.productionTypes && dto.productionTypes.length > 0) {
      await this.prisma.humanProductionType.createMany({
        data: dto.productionTypes.map((typeId) => ({
          humanModelingId: modeling!.id,
          productionTypeId: typeId,
        })),
        skipDuplicates: true,
      });
    }

    // Create M2M relations for preferences
    if (dto.preferences && dto.preferences.length > 0) {
      await this.prisma.humanPreference.createMany({
        data: dto.preferences.map((prefId) => ({
          humanModelingId: modeling!.id,
          preferenceId: prefId,
        })),
        skipDuplicates: true,
      });
    }

    // Also update or create profile with height
    if (dto.heightId) {
      await this.prisma.humanProfile.upsert({
        where: { userId: user.id },
        update: {
          heightId: dto.heightId,
        },
        create: {
          userId: user.id,
          officialRegistrationId: registration.id,
          heightId: dto.heightId,
          profileVisibility: 'public',
          currentState: 'pending',
        },
      });
    }

    // Fetch the complete modeling data with relations
    const modelingWithRelations = await this.prisma.humanModeling.findUnique({
      where: { id: modeling.id },
      include: {
        modelingTypes: {
          include: { modelingType: true },
        },
        productionTypes: {
          include: { productionType: true },
        },
        preferences: {
          include: { preference: true },
        },
      },
    });

    return {
      success: true,
      message: 'Modeling preferences saved successfully',
      data: modelingWithRelations,
    };
  }

  async getModeling(user: User) {
    const modeling = await this.prisma.humanModeling.findUnique({
      where: { userId: user.id },
      include: {
        modelingTypes: {
          include: { modelingType: true },
        },
        productionTypes: {
          include: { productionType: true },
        },
        preferences: {
          include: { preference: true },
        },
      },
    });

    return { data: modeling };
  }

  // ==========================================
  // STEP 3: Profile (Updated with job_sector, job_title, height)
  // ==========================================
  async createOrUpdateProfile(user: User, dto: Step3ProfileDto) {
    // First, ensure the user has completed Step 1
    const registration = await this.prisma.humanOfficialRegistration.findUnique({
      where: { userId: user.id },
    });

    if (!registration) {
      throw new BadRequestException('Please complete Step 1 (Basic Information) first');
    }

    const profile = await this.prisma.humanProfile.upsert({
      where: { userId: user.id },
      update: {
        briefIntro: dto.briefIntro || null,
        profileVisibility: dto.profileVisibility || 'public',
        twitterLink: dto.twitterLink || '',
        instagramLink: dto.instagramLink || '',
        facebookLink: dto.facebookLink || '',
        snapchatLink: dto.snapchatLink || '',
        tiktokLink: dto.tiktokLink || '',
        youtubeLink: dto.youtubeLink || '',
        jobSectorId: dto.jobSectorId || null,
        jobTitle: dto.jobTitle || null,
        heightId: dto.heightId || null,
        currentState: 'in_progress',
      },
      create: {
        userId: user.id,
        officialRegistrationId: registration.id,
        briefIntro: dto.briefIntro || null,
        profileVisibility: dto.profileVisibility || 'public',
        twitterLink: dto.twitterLink || '',
        instagramLink: dto.instagramLink || '',
        facebookLink: dto.facebookLink || '',
        snapchatLink: dto.snapchatLink || '',
        tiktokLink: dto.tiktokLink || '',
        youtubeLink: dto.youtubeLink || '',
        jobSectorId: dto.jobSectorId || null,
        jobTitle: dto.jobTitle || null,
        heightId: dto.heightId || null,
        currentState: 'pending',
      },
      include: {
        jobSector: true,
        height: true,
      },
    });

    return {
      success: true,
      message: 'Profile saved successfully',
      data: profile,
    };
  }

  async getProfile(user: User) {
    const profile = await this.prisma.humanProfile.findUnique({
      where: { userId: user.id },
      include: {
        height: true,
        jobSector: true,
        interests: {
          include: { interest: true },
        },
      },
    });

    return { data: profile };
  }

  // ==========================================
  // STEP 4: Verification
  // ==========================================
  async createOrUpdateVerification(user: User, dto: Step4VerificationDto) {
    // First, ensure the user has completed Step 1
    const registration = await this.prisma.humanOfficialRegistration.findUnique({
      where: { userId: user.id },
    });

    if (!registration) {
      throw new BadRequestException('Please complete Step 1 (Basic Information) first');
    }

    const verification = await this.prisma.humanVerification.upsert({
      where: { userId: user.id },
      update: {
        civilId: dto.civilId,
        passportId: dto.passportId || '',
        countryList: dto.countryList,
        bankName: dto.bankName,
        bankAddress: dto.bankAddress,
        accountHolderName: dto.accountHolderName,
        accountHolderAddress: dto.accountHolderAddress,
        accountNumberIBAN: dto.accountNumberIBAN,
        swiftNumber: dto.swiftNumber,
        status: 'pending',
      },
      create: {
        userId: user.id,
        officialRegistrationId: registration.id,
        civilId: dto.civilId,
        passportId: dto.passportId || '',
        countryList: dto.countryList,
        bankName: dto.bankName,
        bankAddress: dto.bankAddress,
        accountHolderName: dto.accountHolderName,
        accountHolderAddress: dto.accountHolderAddress,
        accountNumberIBAN: dto.accountNumberIBAN,
        swiftNumber: dto.swiftNumber,
        status: 'pending',
      },
    });

    return {
      success: true,
      message: 'Verification details saved successfully',
      data: verification,
    };
  }

  async getVerification(user: User) {
    const verification = await this.prisma.humanVerification.findUnique({
      where: { userId: user.id },
    });

    return { data: verification };
  }

  // ==========================================
  // STEP 5: Phone OTP Verification
  // ==========================================
  async sendOtp(user: User, dto: SendOtpDto) {
    // First, ensure the user has completed Step 1
    const registration = await this.prisma.humanOfficialRegistration.findUnique({
      where: { userId: user.id },
    });

    if (!registration) {
      throw new BadRequestException('Please complete Step 1 (Basic Information) first');
    }

    // Generate a random 6-digit OTP using SMS service
    const otp = this.smsService.generateOtp(6);

    this.logger.log(`Generated OTP for ${dto.mobileNumber}: ${otp}`);

    // Save OTP to database first
    await this.prisma.humanPhoneVerification.upsert({
      where: { userId: user.id },
      update: {
        mobileNumber: dto.mobileNumber,
        code: otp,
        status: 'pending',
      },
      create: {
        userId: user.id,
        officialRegistrationId: registration.id,
        mobileNumber: dto.mobileNumber,
        code: otp,
        status: 'pending',
      },
    });

    // Send OTP via SMS (MPP provider)
    // Detect language from request or default to English
    const language = dto.language || 'en';
    
    try {
      await this.smsService.sendOtp({
        phoneNumber: dto.mobileNumber,
        code: otp,
        language: language as 'en' | 'ar',
      });
    } catch (error: any) {
      this.logger.error(`Failed to send SMS: ${error.message}`);
      // Don't fail the request if SMS fails - OTP is still saved
    }

    const isDev = this.configService.get<string>('NODE_ENV') !== 'production';

    return {
      success: true,
      message: 'OTP sent successfully',
      // In development, return the OTP for testing
      otp: isDev ? otp : undefined,
    };
  }

  async verifyOtp(user: User, dto: VerifyOtpDto) {
    this.logger.log(`verifyOtp called for user ${user.id}, phone: ${dto.mobileNumber}, code: ${dto.code}`);
    
    const phoneVerification = await this.prisma.humanPhoneVerification.findUnique({
      where: { userId: user.id },
    });

    this.logger.log(`Phone verification found: ${JSON.stringify(phoneVerification)}`);

    if (!phoneVerification) {
      throw new NotFoundException(`No OTP request found for user ${user.id}. Please request a new OTP.`);
    }

    if (phoneVerification.mobileNumber !== dto.mobileNumber) {
      throw new BadRequestException('Phone number does not match');
    }

    if (phoneVerification.code !== dto.code) {
      throw new BadRequestException('Invalid OTP code');
    }

    // Update status to verified
    await this.prisma.humanPhoneVerification.update({
      where: { id: phoneVerification.id },
      data: { status: 'verified' },
    });

    // Update the registration state to completed
    const registration = await this.prisma.humanOfficialRegistration.findUnique({
      where: { userId: user.id },
    });

    if (registration) {
      await this.prisma.humanOfficialRegistration.update({
        where: { id: registration.id },
        data: { currentState: 'completed' },
      });
    }

    return {
      success: true,
      message: 'Phone number verified successfully. Registration complete!',
    };
  }

  async getPhoneVerification(user: User) {
    const phoneVerification = await this.prisma.humanPhoneVerification.findUnique({
      where: { userId: user.id },
    });

    return { data: phoneVerification };
  }

  // ==========================================
  // GET REGISTRATION STATUS
  // ==========================================
  async getRegistrationStatus(user: User) {
    const [registration, profile, verification, phoneVerification] =
      await Promise.all([
        this.prisma.humanOfficialRegistration.findUnique({
          where: { userId: user.id },
        }),
        this.prisma.humanProfile.findUnique({
          where: { userId: user.id },
          include: {
            interests: true,
          },
        }),
        this.prisma.humanVerification.findUnique({
          where: { userId: user.id },
        }),
        this.prisma.humanPhoneVerification.findUnique({
          where: { userId: user.id },
        }),
      ]);

    // Step 2 is completed if user has selected interests
    const hasInterests = profile && profile.interests && profile.interests.length > 0;
    
    // Step 3 is completed if profile has some details filled (brief intro, job sector, etc.)
    const hasProfileDetails = profile && (
      profile.briefIntro ||
      profile.jobSectorId ||
      profile.jobTitle ||
      profile.twitterLink ||
      profile.instagramLink
    );

    const steps = {
      step1: registration ? 'completed' : 'pending',
      step2: hasInterests ? 'completed' : 'pending',
      step3: hasProfileDetails ? 'completed' : 'pending',
      step4: verification ? 'completed' : 'pending',
      step5: phoneVerification?.status === 'verified' ? 'completed' : 'pending',
    };

    const completedSteps = Object.values(steps).filter((s) => s === 'completed').length;
    const totalSteps = 5;
    const progress = Math.round((completedSteps / totalSteps) * 100);

    return {
      steps,
      completedSteps,
      totalSteps,
      progress,
      isComplete: completedSteps === totalSteps,
      currentState: registration?.currentState || 'not_started',
    };
  }
}
