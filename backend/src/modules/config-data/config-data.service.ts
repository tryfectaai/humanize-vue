import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConfigDataService {
  constructor(private prisma: PrismaService) {}

  // Helper to transform camelCase to snake_case for frontend compatibility
  private transformToSnakeCase(items: any[]) {
    return items.map(item => ({
      ...item,
      name_en: item.nameEn,
      name_ar: item.nameAr,
    }));
  }

  async getModelingTypes() {
    const items = await this.prisma.modelingType.findMany({
      where: { status: 1 },
      orderBy: { order: 'asc' },
    });
    return this.transformToSnakeCase(items);
  }

  async getProductionTypes() {
    const items = await this.prisma.productionType.findMany({
      where: { status: 1 },
    });
    return this.transformToSnakeCase(items);
  }

  async getPreferences() {
    const items = await this.prisma.preference.findMany({
      where: { status: 1 },
    });
    return this.transformToSnakeCase(items);
  }

  async getInterests() {
    const items = await this.prisma.interest.findMany({
      where: { status: 1 },
    });
    return this.transformToSnakeCase(items);
  }

  async getJobSectors() {
    const items = await this.prisma.jobSector.findMany({
      where: { status: 1 },
    });
    return this.transformToSnakeCase(items);
  }

  async getAgeGroups() {
    const items = await this.prisma.ageGroup.findMany({
      where: { status: 1 },
      orderBy: { minAge: 'asc' },
    });
    return items.map(item => ({
      ...item,
      name_en: item.nameEn,
      name_ar: item.nameAr,
      min_age: item.minAge,
      max_age: item.maxAge,
    }));
  }

  async getContestCategories() {
    const items = await this.prisma.contestCategory.findMany();
    return items.map(item => ({
      ...item,
      category_en: item.categoryEn,
      category_ar: item.categoryAr,
    }));
  }

  async getEventCategories() {
    const items = await this.prisma.eventCategory.findMany({
      where: { isActive: true },
    });
    return items.map(item => ({
      ...item,
      category_en: item.categoryEn,
      category_ar: item.categoryAr,
      is_active: item.isActive,
    }));
  }

  async getNumberOfPeopleOptions() {
    return this.prisma.numberOfPeople.findMany({
      orderBy: { numberOfPeople: 'asc' },
    });
  }

  async getNumberOfHoursOptions() {
    return this.prisma.numberOfHour.findMany({
      orderBy: { numberOfHour: 'asc' },
    });
  }

  // Countries (static for now - GCC focused)
  getCountries() {
    return [
      { code: 'KW', name_en: 'Kuwait', name_ar: 'الكويت', phone_code: '+965', flag: '🇰🇼' },
      { code: 'SA', name_en: 'Saudi Arabia', name_ar: 'السعودية', phone_code: '+966', flag: '🇸🇦' },
      { code: 'AE', name_en: 'United Arab Emirates', name_ar: 'الإمارات', phone_code: '+971', flag: '🇦🇪' },
      { code: 'BH', name_en: 'Bahrain', name_ar: 'البحرين', phone_code: '+973', flag: '🇧🇭' },
      { code: 'OM', name_en: 'Oman', name_ar: 'عمان', phone_code: '+968', flag: '🇴🇲' },
      { code: 'QA', name_en: 'Qatar', name_ar: 'قطر', phone_code: '+974', flag: '🇶🇦' },
      { code: 'EG', name_en: 'Egypt', name_ar: 'مصر', phone_code: '+20', flag: '🇪🇬' },
      { code: 'JO', name_en: 'Jordan', name_ar: 'الأردن', phone_code: '+962', flag: '🇯🇴' },
      { code: 'LB', name_en: 'Lebanon', name_ar: 'لبنان', phone_code: '+961', flag: '🇱🇧' },
      { code: 'IQ', name_en: 'Iraq', name_ar: 'العراق', phone_code: '+964', flag: '🇮🇶' },
    ];
  }

  // Banks in Kuwait (static list)
  getBanks() {
    return [
      { id: 1, name: 'National Bank of Kuwait (NBK)' },
      { id: 2, name: 'Kuwait Finance House (KFH)' },
      { id: 3, name: 'Gulf Bank' },
      { id: 4, name: 'Commercial Bank of Kuwait' },
      { id: 5, name: 'Al Ahli Bank of Kuwait' },
      { id: 6, name: 'Burgan Bank' },
      { id: 7, name: 'Boubyan Bank' },
      { id: 8, name: 'Warba Bank' },
      { id: 9, name: 'Industrial Bank of Kuwait' },
      { id: 10, name: 'Kuwait International Bank (KIB)' },
    ];
  }

  // Heights from conf_height table
  async getHeights() {
    return this.prisma.height.findMany({
      orderBy: { id: 'asc' },
    });
  }
}
