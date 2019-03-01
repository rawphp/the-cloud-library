import { EventEmitter } from 'events';
import { IIntegration } from '../types';

/**
 * Abstract Integration base.
 *
 * @abstract
 */
export abstract class Integration extends EventEmitter implements IIntegration {
  /** integration id */
  public id: string;
  /** integration name */
  public name: string;
  /** connected flag */
  public connected: boolean;
  /** integration icon path */
  public icon: string;

  public constructor() {
    super();

    this.id = 'core';
    this.name = 'Base';
    this.icon = '';
  }

  /**
   * Connects the integration to the cloud.
   *
   * @param options options
   *
   * @returns the integration instance
   */
  public abstract connect(options: any): Promise<IIntegration>;

  /**
   * Disconnects the integration from the cloud.
   *
   * @param options disconnection options
   *
   * @returns the integration
   */
  public abstract async disconnect(options: any): Promise<IIntegration>;

  /**
   * Lists files in a directory.
   *
   * @param path directory path
   *
   * @returns list of files and directories
   */
  public abstract async list(path: string, options: any): Promise<string[]>;

  /**
   * Downloads a file from the cloud.
   *
   * @param path file path
   *
   * @returns file contents
   */
  public abstract async get(path: string, options: any): Promise<string>;

  /**
   * Uploads a file to the cloud.
   *
   * @param path file path
   * @param data file content
   *
   * @returns true on success
   */
  public abstract async put(path: string, options: any): Promise<boolean>;

  /**
   * Deletes a file in the cloud.
   *
   * @param path file path
   * @param options remove options
   *
   * @returns true on success
   */
  public abstract async remove(path: string, options: any): Promise<boolean>;

  // public abstract async search(query, options: any): Promise<string[]>;

  // public abstract async index(options: any): Promise<boolean>;
}
