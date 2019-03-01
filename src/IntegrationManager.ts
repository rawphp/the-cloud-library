import { EventEmitter } from 'events';
import { IIntegration, IIntegrationManager, IObject, RegisterIntegrationFunc } from './types';

export interface ILoadedIntegrations {
  [integrationId: string]: IIntegration;
}

export interface IRegisteredIntegrations {
  [integrationId: string]: RegisterIntegrationFunc;
}

/**
 * Integration Manager.
 */
export class IntegrationManager extends EventEmitter implements IIntegrationManager {
  /** integration config */
  protected config: IObject;
  /** loaded integrations */
  protected loadedIntegrations: ILoadedIntegrations;
  /** registered integrations */
  protected registeredIntegrations: IRegisteredIntegrations;

  public constructor(config: any) {
    super();

    this.config = config;
    this.loadedIntegrations = {};
    this.registeredIntegrations = {};
  }

  /**
   * Adds a boot function for an integration.
   *
   * @param integration the integration boot function
   *
   * @returns this manager
   */
  public addIntegration(integrationId: string, registerIntegrationFunc: RegisterIntegrationFunc): IIntegrationManager {
    this.registeredIntegrations[integrationId] = registerIntegrationFunc;

    return this;
  }

  /**
   * Removes an integration from the manager.
   *
   * @param integrationId integration id
   *
   * @returns this manager
   */
  public removeIntegration(integrationId: string): IIntegrationManager {
    delete this.loadedIntegrations[integrationId];
    delete this.registeredIntegrations[integrationId];

    return this;
  }

  /**
   * Get integration by id.
   *
   * @param integrationId integration id
   *
   * @returns the integration instance
   */
  public getIntegration(integrationId: string): IIntegration {
    if (this.loadedIntegrations[integrationId]) {
      return this.loadedIntegrations[integrationId];
    } else if (this.registeredIntegrations[integrationId]) {
      const boot = this.registeredIntegrations[integrationId];
      return boot(this);
    }

    return;
  }

  /**
   * Lists files in a directory.
   *
   * @param path directory path
   *
   * @returns list of files and directories
   */
  public async list(path: string, options: any): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  /**
   * Uploads a file to the cloud.
   *
   * @param path file path
   * @param data file content
   *
   * @returns true on success
   */
  public async put(path: string, data: string, options: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * Downloads a file from the cloud.
   *
   * @param path file path
   *
   * @returns file contents
   */
  public async get(path: string, options: any): Promise<string> {
    throw new Error('Method not implemented.');
  }

  /**
   * Deletes a file in the cloud.
   *
   * @param path file path
   *
   * @returns true on success
   */
  public async remove(path: string, options: any): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * Gets config for an integration.
   *
   * @param integrationId
   *
   * @returns integration config object
   */
  public getConfig(integrationId: string): IObject {
    return this.config[integrationId];
  }
}
