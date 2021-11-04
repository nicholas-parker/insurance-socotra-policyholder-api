import { IsDateString, IsNotEmpty, IsOptional, isString } from "class-validator";
/**
 * 
 * A class which represents an Address over the API
 * 
 */
export class AddressDto {
    
    @IsNotEmpty()
    scvId: string;

    @IsOptional()
    lobId: string;

    @IsNotEmpty()
    line1: string;

    @IsOptional()
    line2?: string;

    @IsOptional()
    line3?: string;

    @IsOptional()
    line4?: string;

    @IsOptional()
    line5?: string;

    @IsNotEmpty()
    postCode: string;

}