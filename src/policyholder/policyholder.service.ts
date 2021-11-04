import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {
  HttpClientFactory,
  HttpClient,
  PolicyApiClient,
  HttpClientConfig,
  AccountHttpAuthenticator,
  AuthenticateRequest,
  PolicyholderApiClient,
  PolicyholderApi,
  HttpRequest,
  AdminAccountHttpAuthenticator,
  PolicyholderCreateRequest,
  FieldValues,
  FieldValueType,
  PolicyholderUpdateRequest,
} from '@socotra/api';
import { Policyholder } from './policyholder';

@Injectable()
export class PolicyholderService {
  private policyholderApi: PolicyholderApi;
  private authenticator: AccountHttpAuthenticator;

  constructor() {
    const api = 'https://api.sandbox.socotra.com';
    const creds: AuthenticateRequest = {
      username: 'nick.parker',
      password: 'groovie!99',
      hostName: 'nparker-esppr-configeditor.co.sandbox.socotra.com',
    };
    this.authenticator = new AccountHttpAuthenticator(api, creds);
    const config: HttpClientConfig = {
      uri: api,
      authenticator: this.authenticator,
    };

    const httpClient = new HttpClient(config);

    this.policyholderApi = new PolicyholderApiClient(httpClient);
  }

  /**
   * Return a policyholder by their Socotra locator.
   * It is only possible to retrieve a policyholder by their locator
   * 
   * @param locator 
   */
  async getPolicyholder(locator: string) {

    return await this.policyholderApi.get(locator);

  }

  /**
   * Create a new policyholder
   * 
   * @param ph a Socotra policyholder class
   * @param completed flag to mark if the creation is complete or will be followed by further updates
   *  
   */
  async createPolicyholder(ph: unknown, completed: boolean = true) {

    const req: PolicyholderCreateRequest = {
      values: ph as FieldValues<FieldValueType>,
      completed: completed
    };
  
    return await this.policyholderApi.create(req);
  
  }

  /**
   * 
   * Mark a policyholder as having been updated in SCV.
   * Does not change the policyholder
   * Used to indicate name, dob, occupation, marital status or residential status change
   *
   * @param locator the internal policyholder reference in Socotra
   * @param version the version number to update, must be the latest version
   *  
   */
  async markPolicyholderChange(locator: string, version: number) {

    const req: PolicyholderUpdateRequest = {
      completed: true,
      locator: locator,
      addSubEntities: undefined,
      version: version,
      values: {
        scv_person_modified: 'Y',
        scv_person_modified_time: new Date().toISOString()
      }
    };
    return await this.policyholderApi.update(req);

  }

  /**
   * 
   * Mark a policyholder legal address as having been updated in SCV.
   * Does not change the policyholder
   * Used to indicate name, dob, occupation, marital status or residential status change
   *
   * @param locator the internal policyholder reference in Socotra
   * @param version the version number to update, must be the latest version
   *  
   */
  async markLegalAddressChange(locator: string, version: number) {

    const req: PolicyholderUpdateRequest = {
      completed: true,
      locator: locator,
      addSubEntities: undefined,
      version: version,
      values: {
        scv_address_modified: 'Y',
        scv_address_modified_time: new Date().toISOString()
      }
    };
    return await this.policyholderApi.update(req);

  }

  /**
   * Update an existing policyholder
   * 
   * @param ph a Socotra policyholder class
   * @param locator the Socotra id for the policyholder
   * @param version the version of the policyholder to update, must be the latest version
   * @param completed flag to mark if the creation is complete or will be followed by further updates
   *  
   */
  async updatePolicyholder(ph: unknown, locator: string, version: number, completed: boolean = true) {

    const req: PolicyholderUpdateRequest = {
      completed: true,
      locator: locator,
      addSubEntities: undefined,
      version: version,
      values: ph as FieldValues<FieldValueType>
    };
    return await this.policyholderApi.update(req);

  }

  /**
   * 
   * Set the policyholders credit score.
   *
   * @param locator the internal policyholder reference in Socotra
   * @param version the version number to update, must be the latest version
   *  
   */
  async setCreditScore(locator: string, version: number, score: number) {

    const req: PolicyholderUpdateRequest = {
      completed: true,
      locator: locator,
      addSubEntities: undefined,
      version: version,
      values: {
        credit_rating_score: score,
        credit_rating_modified_time: new Date().toISOString()
      }
    };
    return await this.policyholderApi.update(req);

  }

  /**
   * 
   * Set the policyholders credit score.
   *
   * @param locator the internal policyholder reference in Socotra
   * @param version the version number to update, must be the latest version
   *  
   */
  async setBlacklistStatus(locator: string, version: number, status: string, reason: string) {

    const req: PolicyholderUpdateRequest = {
      completed: true,
      locator: locator,
      addSubEntities: undefined,
      version: version,
      values: {
        underwriting_blacklist: status,
        underwriting_blacklist_reason: reason,
        underwriting_blacklist_modified_time: new Date().toISOString()
      }
    };
    return await this.policyholderApi.update(req);

  }

}
