import { EventEmitter } from 'events';

export type RegisterIntegrationFunc = (manager: IIntegrationManager) => IIntegration;

export interface IObject {
  [name: string]: any;
}

export interface IIntegrationBase extends EventEmitter {
  /**
   * Lists files in a directory.
   *
   * @param path directory path
   *
   * @returns list of files and directories
   */
  list(path: string, options?: any): Promise<string[]>;
  /**
   * Uploads a file to the cloud.
   *
   * @param path file path
   * @param data file content
   *
   * @returns true on success
   */
  put(path: string, data: string, options?: any): Promise<boolean>;
  /**
   * Downloads a file from the cloud.
   *
   * @param path file path
   *
   * @returns file contents
   */
  get(path: string, options?: any): Promise<string>;
  /**
   * Deletes a file in the cloud.
   *
   * @param path file path
   *
   * @returns true on success
   */
  remove(path: string, options?: any): Promise<boolean>;
}

export interface IIntegration extends IIntegrationBase {
  /** integration id */
  id: string;
  /** integration name */
  name: string;
  /** connected flag */
  connected: boolean;

  /**
   * Connects the integration to the cloud.
   *
   * @param options connection options
   *
   * @returns the integration instance
   */
  connect(options?: any): Promise<IIntegration>;
  /**
   * Disconnects the integration from the cloud.
   *
   * @param options disconnection options
   *
   * @returns the integration
   */
  disconnect(options?: any): Promise<IIntegration>;
}

export interface IIntegrationManager extends IIntegrationBase {
  /**
   * Adds a boot function for an integration.
   *
   * @param integration the integration boot function
   *
   * @returns this manager
   */
  addIntegration(integrationId: string, registerIntegrationFunc: RegisterIntegrationFunc): IIntegrationManager;
  /**
   * Removes an integration from the manager.
   *
   * @param integrationId integration id
   *
   * @returns this manager
   */
  removeIntegration(integrationId: string): IIntegrationManager;
  /**
   * Get integration by id.
   *
   * @param integrationId integration id
   *
   * @returns the integration instance
   */
  getIntegration(integrationId: string): IIntegration | undefined;
  /**
   * Gets config for an integration.
   *
   * @param integrationId
   *
   * @returns integration config object
   */
  getConfig(integrationId: string): IObject;
}
