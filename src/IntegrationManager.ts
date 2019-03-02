import { EventEmitter } from 'events';
import { FTPIntegration } from './integrations/ftp/FTPIntegration';
import { S3Integration } from './integrations/s3/S3Integration';
import {
  IConfig,
  IIntegration,
  IIntegrationConfig,
  IIntegrationManager,
  ILoadedIntegrations,
  IRegisteredIntegrations,
  RegisterIntegrationFunc,
} from './types';

/**
 * Integration Manager.
 */
export class IntegrationManager extends EventEmitter implements IIntegrationManager {
  /** integration config */
  protected config: IConfig;
  /** loaded integrations */
  protected loadedIntegrations: ILoadedIntegrations;
  /** registered integrations */
  protected registeredIntegrations: IRegisteredIntegrations;

  public constructor(config: IConfig) {
    super();

    this.config = config;
    this.loadedIntegrations = {};
    this.registeredIntegrations = {};

    this.init();
  }

  /**
   * Initialises the manager with integrations.
   *
   * @memberof IntegrationManager
   */
  public init() {
    this.registerIntegration('s3', (mgr: IIntegrationManager) => {
      return new S3Integration(mgr.getIntegrationConfig('s3') as any);
    });
    this.registerIntegration('ftp', (mgr: IIntegrationManager) => {
      return new FTPIntegration(mgr.getIntegrationConfig('ftp') as any);
    });
  }

  /**
   * Adds a boot function for an integration.
   *
   * @param integration the integration boot function
   *
   * @returns this manager
   */
  public registerIntegration(integrationId: string, registerIntegrationFunc: RegisterIntegrationFunc): IIntegrationManager {
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
    if (!this.loadedIntegrations[integrationId]) {
      if (!this.registeredIntegrations[integrationId]) {
        return;
      }

      const bootFunc = this.registeredIntegrations[integrationId];

      this.loadedIntegrations[integrationId] = bootFunc(this);
    }

    return this.loadedIntegrations[integrationId];
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
  public getIntegrationConfig(integrationId: string): IIntegrationConfig {
    return this.config.connections[integrationId];
  }
}
