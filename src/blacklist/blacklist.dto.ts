/**
 * interface representing a blacklist status update over the API
 */
export interface BlacklistDto {

    underwritingBlacklistStatis: string;

    underwritingBlacklistReason?: string;

    underwritingBlacklistAppliedTime?: Date | string;

}