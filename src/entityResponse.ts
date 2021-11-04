/**
 * The API response when a Socotra entity is created or updated
 */
export class ApiResponse {

    /** The ID of the entity in the SCV as provided in the inbound call */
    scvId?: string;

    /** The Socotra locator */
    locator: string;

    /** version */
    version: number;

    completed: boolean;

    flags: string[];

}