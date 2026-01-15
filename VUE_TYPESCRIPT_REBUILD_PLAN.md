# Humanize Platform - Vue 3 + TypeScript Rebuild Plan

## 📋 Executive Summary

This document provides a comprehensive plan to rebuild the **Humanize** talent management platform using **Vue 3**, **TypeScript**, and a modern backend API. The platform connects **Companies (Humanize accounts)** with **Talents (Human accounts)** in Kuwait/GCC for jobs, contests, and events.

**Repository**: https://github.com/abdrahmanprismamedia/humanize-vue
**Local Path**: `/Users/abdulrahman/Documents/humanize-vue`

---

## 🏗️ Project Architecture Overview

### Original Django Stack (Being Replaced)
- Django 3.x with Wagtail CMS
- Django REST Framework for APIs
- Django Channels for WebSockets (Chat)
- MySQL Database
- KNPay payment gateway integration
- django-allauth for social authentication

### New Stack

#### Frontend (Vue 3 + TypeScript) ✅ IMPLEMENTED
```
├── Vue 3 (Composition API)
├── TypeScript 5.x
├── Pinia (State Management)
├── Vue Router 4
├── Vite (Build Tool)
├── TailwindCSS + HeadlessUI
├── Socket.io-client (Real-time Chat)
├── Vue-i18n (Arabic/English)
├── VeeValidate + Zod (Form Validation)
└── Capacitor (Mobile Apps - existing setup)
```

#### Backend: NestJS + TypeScript ✅ IMPLEMENTED
```
├── NestJS Framework (TypeScript-native)
├── Prisma ORM (type-safe, works with existing MySQL)
├── Socket.io / @nestjs/websockets (Real-time Chat)
├── Passport.js + JWT (Authentication)
├── Bull + Redis (Background Jobs)
├── Multer (File Uploads)
├── Class-validator + Class-transformer (Validation)
├── Swagger/OpenAPI (API Documentation)
├── MPP SMS Gateway (OTP verification)
└── Same MySQL Database (existing data preserved)
```

**Why NestJS over Express/Django:**
- Full TypeScript support (same language as frontend)
- Modular architecture (similar to Angular/Django structure)
- Built-in dependency injection
- First-class WebSocket support
- Excellent testing utilities
- Automatic Swagger documentation
- Prisma provides type-safe database access

---

## 🖥️ BACKEND ARCHITECTURE (NestJS + TypeScript)

### Project Structure
```
humanize-vue/
├── backend/
│   ├── src/
│   │   ├── main.ts                    # Application entry point
│   │   ├── app.module.ts              # Root module
│   │   ├── common/
│   │   │   ├── decorators/            # Custom decorators (@CurrentUser)
│   │   │   ├── filters/               # Exception filters
│   │   │   ├── guards/                # Auth guards (JwtAuthGuard)
│   │   │   ├── interceptors/          # Request/response interceptors
│   │   │   ├── pipes/                 # Validation pipes
│   │   │   └── utils/                 # Utility functions
│   │   ├── prisma/
│   │   │   └── prisma.service.ts      # Prisma client wrapper
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── strategies/        # JWT strategy
│   │   │   │   └── dto/
│   │   │   ├── human/
│   │   │   │   ├── human.module.ts
│   │   │   │   ├── human.controller.ts
│   │   │   │   ├── human.service.ts
│   │   │   │   └── dto/
│   │   │   │       ├── step1-basic-info.dto.ts
│   │   │   │       ├── step2-interests.dto.ts    # NEW (replaced modeling)
│   │   │   │       ├── step3-profile.dto.ts
│   │   │   │       ├── step4-verification.dto.ts
│   │   │   │       └── step5-phone-otp.dto.ts
│   │   │   ├── sms/
│   │   │   │   ├── sms.module.ts
│   │   │   │   └── sms.service.ts     # MPP SMS integration
│   │   │   ├── config/
│   │   │   │   ├── config.module.ts
│   │   │   │   └── config.controller.ts
│   │   │   ├── company/               # PENDING
│   │   │   ├── job/                   # PENDING
│   │   │   ├── contest/               # PENDING
│   │   │   ├── event/                 # PENDING
│   │   │   ├── chat/                  # PENDING
│   │   │   ├── notification/          # PENDING
│   │   │   ├── payment/               # PENDING
│   │   │   └── escrow/                # PENDING
│   ├── prisma/
│   │   └── schema.prisma              # Database schema (introspected from MySQL)
│   ├── .env
│   ├── .env.example
│   ├── nest-cli.json
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   └── ... (Vue 3 application)
├── README.md
├── package.json
└── VUE_TYPESCRIPT_REBUILD_PLAN.md
```

### Backend Dependencies (package.json)
```json
{
  "dependencies": {
    "@nestjs/common": "^10.x",
    "@nestjs/core": "^10.x",
    "@nestjs/platform-express": "^10.x",
    "@nestjs/config": "^3.x",
    "@nestjs/jwt": "^10.x",
    "@nestjs/passport": "^10.x",
    "@nestjs/websockets": "^10.x",
    "@nestjs/platform-socket.io": "^10.x",
    "@nestjs/swagger": "^7.x",
    "@nestjs/bull": "^10.x",
    "@prisma/client": "^5.x",
    "passport": "^0.7.x",
    "passport-jwt": "^4.x",
    "passport-google-oauth20": "^2.x",
    "bcryptjs": "^2.x",
    "class-validator": "^0.14.x",
    "class-transformer": "^0.5.x",
    "multer": "^1.x",
    "sharp": "^0.33.x",
    "bull": "^4.x",
    "ioredis": "^5.x",
    "libphonenumber-js": "^1.x",
    "ibantools": "^4.x",
    "zxcvbn": "^4.x",
    "uuid": "^9.x",
    "dayjs": "^1.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.x",
    "@nestjs/testing": "^10.x",
    "prisma": "^5.x",
    "typescript": "^5.x",
    "@types/node": "^20.x",
    "@types/passport-jwt": "^4.x",
    "@types/bcryptjs": "^2.x",
    "@types/multer": "^1.x",
    "jest": "^29.x",
    "@types/jest": "^29.x"
  }
}
```

### Prisma Schema (Key Models)
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id                  Int       @id @default(autoincrement())
  email               String    @unique @db.VarChar(255)
  password            String    @db.VarChar(128)
  name                String    @db.VarChar(255)
  accountType         String    @default("human") @map("account_type") @db.VarChar(15)
  isActive            Boolean   @default(true) @map("is_active")
  isStaff             Boolean   @default(false) @map("is_staff")
  isSuperuser         Boolean   @default(false) @map("is_superuser")
  dateJoined          DateTime  @default(now()) @map("date_joined")
  lastLogin           DateTime? @map("last_login")
  
  // Relations
  humanRegistration    HumanOfficialRegistration?
  humanProfile         HumanProfile?
  humanVerification    HumanVerification?
  humanPhoneVerification HumanPhoneVerification?
  // ... other relations
  
  @@map("user_user")
}

model HumanOfficialRegistration {
  id            Int       @id @default(autoincrement())
  userId        Int       @unique @map("user_id")
  name          String    @db.VarChar(255)
  profileName   String    @unique @map("profile_name") @db.VarChar(50)
  profileSlug   String    @unique @map("profile_slug") @db.VarChar(100)
  phone         String    @db.VarChar(20)
  gender        String    @db.VarChar(10)
  dob           DateTime  @db.Date
  nationality   String    @db.VarChar(5)
  placeOfLiving String    @map("place_of_living") @db.VarChar(100)
  address       String?   @db.Text
  currentState  String    @default("pending") @map("current_state") @db.VarChar(20)
  created       DateTime  @default(now())
  modified      DateTime  @updatedAt

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("human_officialregistration")
}

model HumanProfile {
  id                Int       @id @default(autoincrement())
  userId            Int       @unique @map("user_id")
  profileVisibility String    @default("public") @map("profile_visibility") @db.VarChar(20)
  briefIntro        String?   @map("brief_intro") @db.Text
  profilePhoto      String?   @map("profile_photo") @db.VarChar(500)
  selfieImage       String?   @map("selfie_image") @db.VarChar(500)
  coverImage        String?   @map("cover_image") @db.VarChar(500)
  selfieDate        DateTime? @map("selfie_date")
  twitterLink       String?   @map("twitter_link") @db.VarChar(255)
  instagramLink     String?   @map("instagram_link") @db.VarChar(255)
  facebookLink      String?   @map("facebook_link") @db.VarChar(255)
  snapchatLink      String?   @map("snapchat_link") @db.VarChar(255)
  tiktokLink        String?   @map("tiktok_link") @db.VarChar(255)
  youtubeLink       String?   @map("youtube_link") @db.VarChar(255)
  ratingAverage     Float     @default(0) @map("rating_average")
  ratingCount       Int       @default(0) @map("rating_count")
  jobSectorId       Int?      @map("job_sector_id")        // NEW - Required in Step 3
  jobTitle          String?   @map("job_title") @db.VarChar(100)  // NEW - Optional in Step 3
  heightId          Int?      @map("height_id")            // Moved from old Step 2
  modelBefore       Boolean   @default(false) @map("model_before")  // From Step 2
  price             Decimal   @default(0) @db.Decimal(10, 3)        // From Step 2
  otherModeling     String?   @map("other_modeling") @db.VarChar(100) // From Step 2
  currentState      String    @default("pending") @map("current_state") @db.VarChar(20)
  created           DateTime  @default(now())
  modified          DateTime  @updatedAt

  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  jobSector         JobSector? @relation(fields: [jobSectorId], references: [id])
  height            Height?   @relation(fields: [heightId], references: [id])
  interests         HumanProfileInterest[]

  @@map("human_profile")
}

model HumanProfileInterest {
  id              Int           @id @default(autoincrement())
  humanProfileId  Int           @map("humanprofile_id")
  interestId      Int           @map("interest_id")

  humanProfile    HumanProfile  @relation(fields: [humanProfileId], references: [id], onDelete: Cascade)
  interest        Interest      @relation(fields: [interestId], references: [id], onDelete: Cascade)

  @@unique([humanProfileId, interestId])
  @@map("human_profile_interests")
}

model Interest {
  id         Int       @id @default(autoincrement())
  nameEn     String    @map("name_en") @db.VarChar(100)
  nameAr     String    @map("name_ar") @db.VarChar(100)
  slug       String    @unique @db.VarChar(100)
  status     Int       @default(1)

  humanProfiles HumanProfileInterest[]

  @@map("conf_interest")
}

model JobSector {
  id         Int       @id @default(autoincrement())
  nameEn     String    @map("name_en") @db.VarChar(100)
  nameAr     String    @map("name_ar") @db.VarChar(100)
  status     Int       @default(1)

  humanProfiles   HumanProfile[]

  @@map("conf_jobsector")
}

model Height {
  id         Int       @id @default(autoincrement())
  height     String    @db.VarChar(20)
  created    DateTime  @default(now())
  modified   DateTime  @updatedAt

  humanProfiles HumanProfile[]

  @@map("conf_height")
}
```

---

## 📋 Implementation Progress

### Backend Phase 1: Foundation ✅ COMPLETE
- [x] Initialize NestJS project with TypeScript
- [x] Configure Prisma ORM with existing MySQL
- [x] Introspect database schema from MySQL
- [x] Set up environment configuration (.env)
- [x] Create Prisma service wrapper
- [x] Set up Swagger/OpenAPI documentation
- [x] Configure CORS for frontend

### Backend Phase 2: Authentication ✅ COMPLETE
- [x] POST /api/auth/register - User registration
- [x] POST /api/auth/login - Login (returns JWT)
- [x] POST /api/auth/token/refresh - Refresh access token
- [x] POST /api/auth/password/reset - Request password reset
- [x] POST /api/auth/password/reset/confirm - Confirm reset
- [x] POST /api/auth/password/change - Change password
- [x] GET /api/auth/profile - Get current user
- [ ] POST /api/auth/social/google - Google OAuth (PENDING)
- [ ] POST /api/auth/social/apple - Apple Sign In (PENDING)

### Backend Phase 3: Human Module ✅ COMPLETE
- [x] POST /api/human/registration - Step 1: Basic info
- [x] GET /api/human/registration - Get Step 1 data
- [x] POST /api/human/interests - Step 2: Interests (NEW - replaced modeling)
- [x] GET /api/human/interests - Get Step 2 data
- [x] POST /api/human/profile - Step 3: Profile (with job_sector, job_title, height)
- [x] GET /api/human/profile - Get Step 3 data
- [x] POST /api/human/verification - Step 4: ID docs
- [x] GET /api/human/verification - Get Step 4 data
- [x] POST /api/human/phone-verification - Step 5: Send OTP
- [x] POST /api/human/phone-verification/verify - Verify OTP
- [x] GET /api/human/phone-verification - Get Step 5 status
- [x] GET /api/human/registration-status - Get overall progress
- [x] MPP SMS Gateway integration for OTP

### Backend Phase 4: Company Module (PENDING)
- [ ] Company registration endpoints (Steps 1-5)
- [ ] Company profile endpoints
- [ ] Connection request endpoints
- [ ] Talent search/filter endpoints

### Backend Phase 5: Jobs Module (PENDING)
- [ ] Job CRUD for companies
- [ ] Job wall (public listing)
- [ ] Interest request endpoints
- [ ] Job invitation endpoints
- [ ] Job completion flow

### Backend Phase 6: Contests & Events (PENDING)
- [ ] Contest CRUD and participation
- [ ] Winner selection
- [ ] Event CRUD and registration

### Backend Phase 7: Real-time & Payments (PENDING)
- [ ] WebSocket gateway for chat
- [ ] Notification system
- [ ] KNPay payment integration
- [ ] Escrow management

---

## 📊 Database Schema (Keep Existing)

### Core Models

#### 1. User System
```typescript
interface User {
  id: number;
  email: string;
  name: string;
  password: string; // hashed
  account_type: 'human' | 'humanize' | 'agency';
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: Date;
  last_login: Date;
}
```

#### 2. Human (Talent) Models
```typescript
// human/OfficialRegistration - Step 1
interface HumanOfficialRegistration {
  id: number;
  user_id: number;
  name: string;
  profile_name: string; // unique, English only [A-Za-z0-9_]
  profile_slug: string;
  phone: string;
  gender: 'male' | 'female';
  dob: Date;
  nationality: string; // country code
  place_of_living: string;
  address: string;
  current_state: 'pending' | 'in_progress' | 'completed' | 'rejected';
  created: Date;
  modified: Date;
}

// human/Profile - Steps 2 & 3 combined
interface HumanProfile {
  id: number;
  user_id: number;
  profile_visibility: 'public' | 'private';
  brief_intro: string;
  profile_photo: string;
  selfie_image: string;
  cover_image: string;
  selfie_date: Date;
  twitter_link: string;
  instagram_link: string;
  facebook_link: string;
  snapchat_link: string;
  tiktok_link: string;
  youtube_link: string;
  rating_average: number;
  rating_count: number;
  
  // NEW FIELDS (Step 2 - Interests)
  interests: number[];     // M2M Interest IDs
  model_before: boolean;   // Has modeled before?
  price: number;           // Hourly rate KWD
  other_modeling: string;  // Other experience
  
  // NEW FIELDS (Step 3 - Profile)
  job_sector_id: number;   // Required dropdown
  job_title: string;       // Optional text
  height_id: number;       // Moved from old Step 2
  
  current_state: string;
}

// human/VerificationId - Step 4
interface VerificationId {
  id: number;
  user_id: number;
  civil_id: string;
  passport_id: string;
  civil_id_copy: string;
  country_list: string;
  bank_name: string;
  bank_address: string;
  account_holder_name: string;
  account_holder_address: string;
  account_number_IBAN: string;
  SWIFT_number: string;
  status: 'pending' | 'in_progress' | 'completed' | 're_upload' | 'admin_verified' | 'rejected';
}

// human/PhoneVerification - Step 5
interface PhoneVerification {
  id: number;
  user_id: number;
  mobile_number: string;
  code: string;
  status: string;
}
```

#### 3. Configuration Models
```typescript
// conf/Interest - NEW (replaces ModelingType for human profiles)
interface Interest {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  status: number;
}

// conf/JobSector - NEW (for Step 3)
interface JobSector {
  id: number;
  name_en: string;
  name_ar: string;
  status: number;
}

// conf/Height - Moved to Step 3
interface Height {
  id: number;
  height: string;  // e.g., "170 cm"
}

// conf/ModelingType - Still used for Jobs/Companies, NOT for human profiles
interface ModelingType {
  id: number;
  name_en: string;
  name_ar: string;
  order: number;
  image: string;
  status: number;
}

// conf/ProductionType - Still used for Jobs/Companies
interface ProductionType {
  id: number;
  name_en: string;
  name_ar: string;
  status: number;
}

// conf/Preference - Still used for Jobs
interface Preference {
  id: number;
  name_en: string;
  name_ar: string;
  status: number;
}

// conf/AgeGroup - For Jobs
interface AgeGroup {
  id: number;
  name_en: string;
  name_ar: string;
  min_age: number;
  max_age: number | null;
  status: number;
}
```

---

## 🔌 API Endpoints Design

### Authentication
```
POST   /api/auth/register/                    # Register new user ✅
POST   /api/auth/login/                       # Login (JWT tokens) ✅
POST   /api/auth/token/refresh/               # Refresh access token ✅
POST   /api/auth/password/reset/              # Request password reset ✅
POST   /api/auth/password/reset/confirm/      # Confirm password reset ✅
POST   /api/auth/password/change/             # Change password ✅
GET    /api/auth/profile/                     # Get current user ✅
POST   /api/auth/social/google/               # Google OAuth (PENDING)
POST   /api/auth/social/apple/                # Apple OAuth (PENDING)
```

### Human (Talent) Endpoints
```
# Registration Flow
POST   /api/human/registration/               # Step 1: Basic info ✅
GET    /api/human/registration/               # Get registration data ✅

POST   /api/human/interests/                  # Step 2: Interests selection ✅ NEW
GET    /api/human/interests/                  # Get interests data ✅ NEW

POST   /api/human/profile/                    # Step 3: Profile info ✅
GET    /api/human/profile/                    # Get profile data ✅

POST   /api/human/verification/               # Step 4: ID verification ✅
GET    /api/human/verification/               # Get verification data ✅

POST   /api/human/phone-verification/         # Step 5: Send OTP ✅
POST   /api/human/phone-verification/verify/  # Verify OTP code ✅
GET    /api/human/phone-verification/         # Get status ✅

GET    /api/human/registration-status/        # Get overall status ✅

# Gallery (PENDING)
GET    /api/human/gallery/                    # Get gallery images
POST   /api/human/gallery/                    # Upload images
DELETE /api/human/gallery/{id}/               # Delete image

# Children (PENDING)
GET    /api/human/children/                   # List children
POST   /api/human/children/                   # Add child

# Public Profiles (PENDING)
GET    /api/human/talents/                    # List all talents
GET    /api/human/talents/{id}/               # Get talent profile
```

### Configuration Endpoints
```
GET    /api/config/interests/                 # List interests ✅
GET    /api/config/job-sectors/               # List job sectors ✅
GET    /api/config/heights/                   # List heights ✅
GET    /api/config/modeling-types/            # List modeling types (for jobs)
GET    /api/config/production-types/          # List production types
GET    /api/config/preferences/               # List preferences
GET    /api/config/age-groups/                # List age groups
GET    /api/config/countries/                 # List supported countries
```

---

## 🎯 DETAILED FUNCTIONALITY BREAKDOWN

### 1. User Authentication System

#### What It Does:
- **Account Types**: Three distinct user roles:
  - **Human (Talent)**: Individuals seeking work
  - **Humanize (Company)**: Businesses hiring talents
  - **Agency**: (Future) Talent management agencies
- **Registration Flow**: Email + password → Redirect to registration wizard
- **Social Login**: Google, Facebook, Twitter, Instagram OAuth (PENDING)
- **Password Requirements**: 
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 special character
  - At least 1 number
- **Session Management**: JWT tokens with refresh mechanism
- **Password Reset**: Email-based reset with verification

---

### 2. Human (Talent) Registration - 5-Step Wizard ✅ IMPLEMENTED

#### Step 1: Basic Information ✅
**What It Does**: Collects personal identity data
- Full name
- Profile name (unique, English only: `[A-Za-z0-9_]`)
- Date of birth (calculates age, must be 18+ or parent mode)
- Gender (Male/Female)
- Nationality (dropdown with country flags)
- Phone number (with country code, GCC focused)
- Place of living
- Address

**Validation**:
- Profile name: 3-50 chars, alphanumeric + underscore only
- DOB: Must be valid date
- Phone: Valid format, unique in system

#### Step 2: Interests & Modeling Preferences ✅ (UPDATED)
**What It Does**: Defines talent's areas of participation and modeling details

**Fields**:
- **Interests** (multi-select chips): Product Testing, Volunteering, Photography, Events, Fashion, Fitness, Acting, Modeling, Social Media, Marketing, etc.
- **Model Before** (Yes/No): Has previous modeling experience
- **Price** (number): Hourly rate in KWD
- **Other Modeling** (optional text): Other experience not covered by interests

**Note**: The old complex system (modeling_types, production_types, preferences) has been **simplified** to use Interests for talent profiles. The old modeling types are still used for Jobs and Companies.

**UI Pattern**: Chip-style multi-select with price input

#### Step 3: Profile Setup ✅ (UPDATED)
**What It Does**: Creates public-facing profile

**Fields**:
- **Job Sector** (required dropdown): Selection from JobSector model
- **Job Title** (optional text): Free-form job title
- **Height** (dropdown): Moved from old Step 2
- Profile photo upload (with cropper)
- Cover image upload
- Selfie image (for verification)
- Brief introduction (bio)
- Social media links: Twitter, Instagram, Facebook, Snapchat, TikTok, YouTube
- Profile visibility (Public/Private)

**Validation**:
- Job Sector: Required (must select one)
- Social links: Must be valid URLs
- Profile photo: Validated dimensions

#### Step 4: Identity Verification ✅
**What It Does**: KYC compliance for payments
- Civil ID number (optional)
- Civil ID copy upload (image/PDF)
- Passport ID (optional, for non-Kuwaiti)
- Bank details:
  - Bank name
  - Bank address
  - Account holder name
  - Account holder address
  - IBAN (validated format)
  - SWIFT code

**Status Flow**: `pending` → `in_progress` → `admin_verified` / `rejected` / `re_upload`

#### Step 5: Phone Verification ✅
**What It Does**: OTP verification via SMS
- Sends SMS OTP to provided number via **MPP SMS Gateway**
- 6-digit code entry
- Resend option with cooldown
- Marks registration as complete when verified

**SMS Integration**: Uses MPP Provider (same as old Django backend)

---

### 3. Company (Humanize) Registration - 5-Step Wizard (PENDING)

#### Step 1: Basic Information
- Company name
- Profile name (unique identifier)
- Phone number
- Location (city/area)
- Website URL
- Address

#### Step 2: Hiring Preferences
- Modeling types interested in (multi-select)
- Production types (multi-select)
- Assist on location (Yes/No)

#### Step 3: Company Profile
- Logo upload
- Cover image
- Company brief (description)
- Profile visibility

#### Step 4: ID Verification
- Civil ID copy (representative)
- Bank details for receiving payments

#### Step 5: Phone Verification
- Same OTP flow as talents

---

## 🎨 Vue 3 Frontend Structure

```
frontend/
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css (Tailwind)
│   │   └── fonts/
│   ├── components/
│   │   ├── common/
│   │   │   ├── LoadingSpinner.vue
│   │   │   ├── Modal.vue
│   │   │   ├── FileUpload.vue
│   │   │   ├── MultiSelect.vue
│   │   │   ├── PhoneInput.vue
│   │   │   ├── CountrySelect.vue
│   │   │   └── ...
│   │   ├── auth/
│   │   │   ├── LoginForm.vue
│   │   │   ├── RegisterForm.vue
│   │   │   └── ...
│   │   └── human/
│   │       └── registration/
│   │           ├── Step1BasicInfo.vue      ✅
│   │           ├── Step2Interests.vue      ✅ (NEW - replaced Step2Modeling)
│   │           ├── Step3Profile.vue        ✅ (Updated with job_sector, height)
│   │           ├── Step4Verification.vue   ✅
│   │           └── Step5PhoneOTP.vue       ✅
│   ├── layouts/
│   │   ├── AuthLayout.vue
│   │   ├── DashboardLayout.vue
│   │   └── RegistrationLayout.vue
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   └── ...
│   │   └── human/
│   │       └── Registration.vue
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   ├── auth.ts
│   │   └── config.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── human.ts
│   ├── types/
│   │   └── api.ts
│   └── locales/
│       ├── en.json
│       └── ar.json
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 📋 Migration Checklist

### Frontend Phase 1: Setup & Authentication ✅ COMPLETE
- [x] Set up Vue 3 + Vite project
- [x] Configure TypeScript
- [x] Install TailwindCSS
- [x] Set up Vue Router
- [x] Set up Pinia stores
- [x] Configure Axios with interceptors
- [x] Implement JWT authentication flow
- [x] Build Login page
- [x] Build Register page (account type selection)
- [x] Social login buttons (Google, Apple) - UI only
- [x] Build forgot/reset password flow - UI only
- [x] Set up i18n with Arabic/English

### Frontend Phase 2: Human Registration ✅ COMPLETE
- [x] Build registration step wizard
- [x] Step 1: Basic info form
- [x] Step 2: Interests selection (chip-style multi-select)
- [x] Step 3: Profile info with job_sector, job_title, height
- [x] Step 4: ID verification with file upload
- [x] Step 5: Phone OTP verification
- [ ] Profile gallery management - UI (PENDING)
- [ ] Child management (for parents) - UI (PENDING)
- [ ] Talent public profile page - UI (PENDING)
- [ ] Talent dashboard - UI (PENDING)

### Frontend Phase 3: Company Registration (PENDING)
- [ ] Build company registration wizard
- [ ] Step 1: Company basic info
- [ ] Step 2: Hiring preferences
- [ ] Step 3: Company profile
- [ ] Step 4: ID verification
- [ ] Step 5: Phone OTP
- [ ] Company public profile page
- [ ] Company dashboard
- [ ] Connection management
- [ ] Talent browsing/search

### Phase 4: Jobs Module (PENDING)
- [ ] Job wall (talent view)
- [ ] Job details page
- [ ] Apply for job flow
- [ ] Job creation form (company)
- [ ] Job management

### Phase 5: Contests Module (PENDING)
- [ ] Contest list page
- [ ] Contest details page
- [ ] Submit participation
- [ ] Create contest form (company)

### Phase 6: Events Module (PENDING)
- [ ] Event calendar view
- [ ] Event details page
- [ ] Register for event flow
- [ ] Create event form (company)

### Phase 7: Chat Module (PENDING)
- [ ] WebSocket connection
- [ ] Chat room list
- [ ] Chat room UI
- [ ] Message sending/receiving

### Phase 8: Notifications & Payments (PENDING)
- [ ] Notification system
- [ ] Payment gateway integration
- [ ] Escrow display

---

## 🎨 UI/UX SPECIFICATIONS

### Color Palette

```scss
// Light Theme (Default)
--st-Tropaz: #24598c;        // Primary blue
--white: #fff;                // Background
--Black-Haze: #eaebeb;        // Light grey
--daintree-color: #0d2229;    // Dark text
--halfBaked-color: #92bbd1;   // Accent blue
--border-color: #d7e5ee;      // Borders
--Amaranth: #e63f4f;          // Error/danger red
--green-color: #0fae4e;       // Success green
--yellow-color: #fba209;      // Warning yellow

// Dark Theme
--white: #0d2229;             // Background
--st-Tropaz: #fff;            // Primary (inverted)
--scampi-color: #13333d;      // Card backgrounds
--border-color: #24598c;      // Borders
```

### Typography

```scss
// English - Using DM Sans (fallback for Bw Modelica)
font-family: 'DM Sans', sans-serif;

// Arabic - Using IBM Plex Sans Arabic (fallback for Almarai)
font-family: 'IBM Plex Sans Arabic', sans-serif;
```

### Responsive Breakpoints
- Mobile: < 768px (sidebar hidden, hamburger menu)
- Tablet: 768px - 1024px
- Desktop: > 1024px

### RTL Support
- `dir="rtl"` on `<html>` for Arabic
- TailwindCSS RTL plugin for automatic flipping
- Manual overrides for icons (arrows)

### Dark Mode
- Toggle in navbar
- CSS variables switch via `data-theme="dark"` attribute
- Smooth transition (0.3s)

---

## 🔧 Development Commands

```bash
# Navigate to project
cd /Users/abdulrahman/Documents/humanize-vue

# Backend Development
cd backend
npm install
npm run start:dev         # Start dev server
npm run build             # Build for production
npm run test              # Run tests

# Frontend Development
cd frontend
npm install
npm run dev               # Start dev server
npm run build             # Build for production
npm run lint              # Run ESLint
npm run type-check        # TypeScript check

# Database
cd backend
npx prisma generate       # Generate Prisma client
npx prisma db pull        # Introspect existing DB
npx prisma studio         # Open Prisma Studio
```

---

## 📌 Important Notes

1. **Database Preservation**: This plan uses the **existing MySQL database**. All models are mapped to existing tables.

2. **API-First**: The new frontend communicates with the backend entirely via REST API and WebSockets.

3. **Step 2 Change**: The old "Modeling" step has been **replaced** with "Interests" for human profiles. Modeling types are still used for Jobs and Company hiring preferences.

4. **Step 3 Update**: Added `job_sector` (required), `job_title` (optional), and `height` (moved from old Step 2).

5. **SMS Provider**: OTP uses MPP SMS Gateway (same as old Django backend).

6. **Bilingual Support**: All text content supports English and Arabic with RTL layout support.

7. **Payment Gateway**: KNPay integration will remain the same; only the frontend payment flow changes.

---

## 📞 Support Resources

- **Vue 3 Docs**: https://vuejs.org/guide/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **NestJS Docs**: https://docs.nestjs.com/
- **Prisma Docs**: https://www.prisma.io/docs/
- **Pinia Docs**: https://pinia.vuejs.org/
- **Vue Router**: https://router.vuejs.org/
- **TailwindCSS**: https://tailwindcss.com/docs
- **Vue-i18n**: https://vue-i18n.intlify.dev/
- **Socket.io**: https://socket.io/docs/

---

*Last Updated: January 15, 2026*
*Version: 3.0 - Updated with NestJS backend, Interests system, and implementation progress*
