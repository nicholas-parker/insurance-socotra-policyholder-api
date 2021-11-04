/**
 * 
 * Class which represents the Socotra policyholder model.
 * 
 * 
 */
export interface Policyholder {

    scv_person_id?: string;

    scv_person_modified?: string;

    scv_person_modified_time?: string;

    underwriting_blacklist?: string;

    underwriting_blacklist_applied_time?: Date;

    underwriting_blacklist_reason?: string;

    first_name?: string;

    last_name?: string;

    date_of_birth?: Date;

    gender?: string;

    marital_status?: string;

    residential_status?: string;

    occupation?: string;

    scv_address_id?: string;

    scv_address_modified?: string;

    scv_address_modified_time?: string;

    legal_address_line1?: string;

    legal_address_line2?: string;
    
    legal_address_line3?: string;

    legal_address_line4?: string;

    legal_address_line5?: string;

    legal_address_pocode?: string;

    credit_rating_score?: number;

    credit_rating_modified_time?: Date;

}