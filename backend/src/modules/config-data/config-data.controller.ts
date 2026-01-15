import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigDataService } from './config-data.service';

@ApiTags('Configuration')
@Controller('config')
export class ConfigDataController {
  constructor(private configDataService: ConfigDataService) {}

  @Get('modeling-types')
  @ApiOperation({ summary: 'Get all active modeling types' })
  @ApiResponse({ status: 200, description: 'List of modeling types' })
  async getModelingTypes() {
    return this.configDataService.getModelingTypes();
  }

  @Get('production-types')
  @ApiOperation({ summary: 'Get all active production types' })
  @ApiResponse({ status: 200, description: 'List of production types' })
  async getProductionTypes() {
    return this.configDataService.getProductionTypes();
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get all active preferences' })
  @ApiResponse({ status: 200, description: 'List of preferences' })
  async getPreferences() {
    return this.configDataService.getPreferences();
  }

  @Get('interests')
  @ApiOperation({ summary: 'Get all active interests' })
  @ApiResponse({ status: 200, description: 'List of interests' })
  async getInterests() {
    return this.configDataService.getInterests();
  }

  @Get('job-sectors')
  @ApiOperation({ summary: 'Get all active job sectors' })
  @ApiResponse({ status: 200, description: 'List of job sectors' })
  async getJobSectors() {
    return this.configDataService.getJobSectors();
  }

  @Get('age-groups')
  @ApiOperation({ summary: 'Get all active age groups' })
  @ApiResponse({ status: 200, description: 'List of age groups' })
  async getAgeGroups() {
    return this.configDataService.getAgeGroups();
  }

  @Get('contest-categories')
  @ApiOperation({ summary: 'Get all contest categories' })
  @ApiResponse({ status: 200, description: 'List of contest categories' })
  async getContestCategories() {
    return this.configDataService.getContestCategories();
  }

  @Get('event-categories')
  @ApiOperation({ summary: 'Get all active event categories' })
  @ApiResponse({ status: 200, description: 'List of event categories' })
  async getEventCategories() {
    return this.configDataService.getEventCategories();
  }

  @Get('number-of-people')
  @ApiOperation({ summary: 'Get number of people options for jobs' })
  @ApiResponse({ status: 200, description: 'List of number of people options' })
  async getNumberOfPeopleOptions() {
    return this.configDataService.getNumberOfPeopleOptions();
  }

  @Get('number-of-hours')
  @ApiOperation({ summary: 'Get number of hours options for jobs' })
  @ApiResponse({ status: 200, description: 'List of number of hours options' })
  async getNumberOfHoursOptions() {
    return this.configDataService.getNumberOfHoursOptions();
  }

  @Get('countries')
  @ApiOperation({ summary: 'Get supported countries (GCC + MENA)' })
  @ApiResponse({ status: 200, description: 'List of countries' })
  getCountries() {
    return this.configDataService.getCountries();
  }

  @Get('banks')
  @ApiOperation({ summary: 'Get list of banks in Kuwait' })
  @ApiResponse({ status: 200, description: 'List of banks' })
  getBanks() {
    return this.configDataService.getBanks();
  }

  @Get('heights')
  @ApiOperation({ summary: 'Get list of heights' })
  @ApiResponse({ status: 200, description: 'List of heights' })
  async getHeights() {
    return this.configDataService.getHeights();
  }
}
