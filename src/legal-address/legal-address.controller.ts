import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Logger, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { PolicyholderResponse } from '@socotra/api';
import { ApiResponse } from '../entityResponse';
import { Policyholder } from '../policyholder/policyholder';
import { PolicyholderService } from '../policyholder/policyholder.service';
import { AddressDto } from './AddressDto';

@Controller('policyholder/:id/address')
export class LegalAddressController {

    constructor(private readonly service: PolicyholderService) {}

    /**
     * 
     * Returns the legal address for a policyholder
     * 
     */
    @Get()
    async getLegalAddress(@Param('id') id: string): Promise<AddressDto> {

        const result = await this.service.getPolicyholder(id);
        const response = new AddressDto();
        response.scvId = result.entity.values.scv_address_id.toString();
        response.lobId = result.locator;
        response.line1 = result.entity.values.legal_address_line1.toString();
        response.line2 = result.entity.values.legal_address_line2.toString();
        response.line3 = result.entity.values.legal_address_line3.toString();
        response.line4 = result.entity.values.legal_address_line4.toString();
        response.line5 = result.entity.values.legal_address_line5.toString();
        response.postCode = result.entity.values.legal_address_pocode.toString();
        return response;

    }

    /** 
     *
     *  
     */
    @Post()
    async createLegalAddress(@Body() address: AddressDto, @Param('id') locator: string): Promise<ApiResponse> {

        if (address === undefined || null)  throw new BadRequestException('No address provided in request');

        if (locator === undefined || null)  throw new BadRequestException('No policyholder id provided in request');

        let existing;
        try {

            existing = await this.service.getPolicyholder(locator);

        } catch(e) {

            throw new InternalServerErrorException();

        }
    

        if (existing === undefined || null) {

          throw new NotFoundException();
  
        }

        /** ap PersonDto to Policyhoder */
        let policyholder: Policyholder;
        try {

            policyholder = {
              scv_address_id: address.scvId,
              scv_address_modified: 'N',
              legal_address_line1: address.line1,
              legal_address_line2: address.line2,
              legal_address_line3: address.line3,
              legal_address_line4: address.line4,
              legal_address_line5: address.line5,
              legal_address_pocode: address.postCode,
            };
          
        } catch(e) {

            throw new BadRequestException();
        }

        
        try {

            const result: PolicyholderResponse = await this.service.updatePolicyholder(policyholder, locator, existing.version, false);
            const response: ApiResponse = {

                scvId: address.scvId,
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
    @Patch()
    async markLegalAddressUpdateInSCV(@Param('id') locator): Promise<ApiResponse> {

        if (locator === undefined || null)  throw new BadRequestException('No policyholder id provided in request');

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

            const result: PolicyholderResponse = await this.service.markLegalAddressChange(locator, existing.version);
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
     * Update an existing policyholder legal address
     * 
     * @param person 
     * @param policholderId
     * 
     */
    @Put()
    async updateLegalAddress(@Body() address: AddressDto, @Param('id') locator: string): Promise<ApiResponse> {

        return await this.createLegalAddress(address, locator);

    }
}
