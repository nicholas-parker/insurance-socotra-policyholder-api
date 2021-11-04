import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Logger, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { PolicyholderResponse } from '@socotra/api';
import { ApiResponse } from '../entityResponse';
import { PolicyholderService } from '../policyholder/policyholder.service';
import { BlacklistDto } from './blacklist.dto';

@Controller('policyholder/:id/blacklist')
export class BlacklistController {

    constructor(private readonly service: PolicyholderService) {}

    /**
     * 
     * Returns the legal address for a policyholder
     * 
     */
    @Get()
    async getBlacklist(@Param('id') id: string): Promise<BlacklistDto> {

        const result = await this.service.getPolicyholder(id);
        const response: BlacklistDto = {
            underwritingBlacklistStatis: result.entity.values.underwriting_blacklist?.toString(),
            underwritingBlacklistReason: result.entity.values.underwriting_blacklist_reason?.toString(),
            underwritingBlacklistAppliedTime: result.entity.values.underwriting_blacklist_applied_time?.toString()
        }
        return response;

    }

    /** 
     *
     *  
     */
    @Post()
    async updateCreditRating(@Body() blacklist: BlacklistDto, @Param('id') locator: string): Promise<ApiResponse> {

        if (blacklist === undefined || null)  throw new BadRequestException('No blacklist provided in request');

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

            const result: PolicyholderResponse = await this.service.setBlacklistStatus(locator, existing.version, blacklist.underwritingBlacklistStatis, blacklist.underwritingBlacklistReason);
            const response: ApiResponse = {

                scvId: existing.entity.values.scvId,
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
