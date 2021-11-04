import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Logger, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { PolicyholderResponse } from '@socotra/api';
import { ApiResponse } from '../entityResponse';
import { Policyholder } from '../policyholder/policyholder';
import { PolicyholderService } from '../policyholder/policyholder.service';
import { CreditStatusDto } from './credit-status-dto';

@Controller('policyholder/:id/credit')
export class CreditStatusController {

    constructor(private readonly service: PolicyholderService) {}

    /**
     * 
     * Returns the legal address for a policyholder
     * 
     */
    @Get()
    async getCreditRating(@Param('id') id: string): Promise<CreditStatusDto> {

        const result = await this.service.getPolicyholder(id);
        const response: CreditStatusDto = {
            score: result.entity.values.credit_rating_score
        }
        return response;

    }

    /** 
     *
     *  
     */
    @Post()
    async updateCreditRating(@Body() credit: CreditStatusDto, @Param('id') locator: string): Promise<ApiResponse> {

        if (credit === undefined || null)  throw new BadRequestException('No credit score provided in request');

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

            const result: PolicyholderResponse = await this.service.setCreditScore(locator, existing.version, credit.score);
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
