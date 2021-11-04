import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Logger, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { PolicyholderResponse } from '@socotra/api';
import { ApiResponse } from 'src/entityResponse';
import { PersonDto } from './person.dto';
import { Policyholder } from './policyholder';
import { PolicyholderService } from './policyholder.service';

@Controller('policyholder')
export class PolicyholderController {

    constructor(private readonly service: PolicyholderService) {}

    @Get(':id')
    getPolicyholder(@Param('id') id: string) {

        return this.service.getPolicyholder(id);

    }

    @Post()
    async createPolicyholder(@Body() person: PersonDto): Promise<ApiResponse> {

        if (person === undefined || null)  throw new BadRequestException('No policyholder provided in request');

        /** ap PersonDto to Policyhoder */
        let policyholder: Policyholder;
        try {

          policyholder = {
          scv_person_id: person.uid,
          scv_person_modified: 'N',
          underwriting_blacklist: 'N',
          first_name: person.firstName,
          last_name: person.secondName,
          date_of_birth: new Date(person.dob),
          // gender: ,
          // marital_status,
          // residential_status,
          // occupation,
          };
          
        } catch(e) {

            throw new BadRequestException();
        }

        try {

            const result: PolicyholderResponse = await this.service.createPolicyholder(policyholder, false);
            const response: ApiResponse = {

                scvId: person.uid,
                locator: result.locator,
                version: result.version,
                completed: result.entity.completed,
                flags: undefined
            }
            return response;

        } catch(e) {

            throw new InternalServerErrorException();
    
        }
        

    }

    /**
     * Marks the policyholder as having changed in SCV but does not update the Socotra details
     * 
     * @param id policyholder locator in Socotra 
     * 
     */
    @Patch(':id')
    async markPolicyholderUpdateInSCV(@Param('id') locator): Promise<ApiResponse> {

        if (locator === undefined || null)  throw new BadRequestException('No policyholder provided in request');

        let existing;
        try {

            existing = await this.service.getPolicyholder(locator);

        } catch(e) {

            throw new InternalServerErrorException();

        }
    

        if (existing === undefined || null) {

          throw new NotFoundException();
  
        }

        try {

            const result: PolicyholderResponse = await this.service.markPolicyholderChange(locator, existing.version);
            const response: ApiResponse = {

                locator: result.locator,
                version: result.version,
                completed: result.entity.completed,
                flags: undefined
            }
            return response;

        } catch(e) {

            throw new InternalServerErrorException();
    
        }
    }

    /**
     * Update an existing policyholder
     * 
     * @param person 
     * @param policholderId
     * 
     */
    @Put(':id')
    async updatePolicyholder(@Body() person: PersonDto, @Param('id') locator: string) {

        if (locator === undefined || null)  throw new BadRequestException('No policyholder provided in request');

        let existing;
        try {

            existing = await this.service.getPolicyholder(locator);

        } catch(e) {

            throw new InternalServerErrorException();

        }
    

        if (existing === undefined || null) {

          throw new NotFoundException();
  
        }

        if (person === undefined || null)  throw new BadRequestException('No policyholder provided in request');

        /** ap PersonDto to Policyhoder */
        let policyholder: Policyholder;
        try {

          policyholder = {
          scv_person_id: person.uid,
          scv_person_modified: 'N',
          underwriting_blacklist: 'N',
          first_name: person.firstName,
          last_name: person.secondName,
          date_of_birth: new Date(person.dob),
          // gender: , - not currently in PersonDto, must be added
          // marital_status, - not currently in PersonDto, must be added
          // residential_status, - not currently in PersonDto, must be added
          // occupation, - not currently in PersonDto, must be added
          };
          
        } catch(e) {

            throw new BadRequestException();
        }

        try {

            const result: PolicyholderResponse = await this.service.updatePolicyholder(policyholder, locator, existing.version, false);
            const response: ApiResponse = {

                scvId: person.uid,
                locator: result.locator,
                version: result.version,
                completed: result.entity.completed,
                flags: undefined
            }
            return response;

        } catch(e) {

            throw new InternalServerErrorException();
    
        }
    }
}
