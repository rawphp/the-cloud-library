import * as fs from 'fs-extra';
import * as OS from 'os';
import * as Path from 'path';
import { v4 as uuid } from 'uuid';
import { IIntegration, IIntegrationConfig } from '../../types';
import { getDebug } from '../../util/getDebug';
import { Integration } from '../Integration';
import { createFTPConnection } from './createFTPConnection';

const debug = getDebug();

export interface IFTPIntegrationParams extends IIntegrationConfig {
  /** protocol */
  protocol: string;
  /** ftp host */
  host: string;
  /** ftp port */
  port: number;
  /** aws credentials */
  credentials: {
    /** aws credential key */
    username: string;
    /** aws credential secret */
    password: string
  };
}

/**
 * FTP Integration
 */
export class FTPIntegration extends Integration {
  /** ftp protocol */
  protected protocol: string;
  /** ftp host */
  protected host: string;
  /** ftp port */
  protected port: number;
  /** ftp credentials */
  protected credentials: any;
  /** ftp connection */
  protected connection: any;

  constructor(params: IFTPIntegrationParams) {
    super();

    this.id = 'ftp';
    this.name = 'FTP';
    this.connected = false;

    if (!params.protocol && !process.env.FTP_PROTOCOL) {
      throw new Error('protocol not defined in params');
    }
    if (!params.host && !process.env.FTP_HOST) {
      throw new Error('host not defined in params');
    }
    if (!params.port && !process.env.FTP_PORT) {
      throw new Error('port not defined in params');
    }
    if (!params.credentials) {
      if (process.env.FTP_USERNAME && process.env.FTP_PASSWORD) {
        params.credentials = {
          username: process.env.FTP_USERNAME,
          password: process.env.FTP_PASSWORD,
        };
      } else {
        throw new Error('credentials not defined in params');
      }
    }

    this.protocol = params.protocol || process.env.FTP_PROTOCOL;
    this.host = params.host;
    this.port = params.port;
    this.credentials = params.credentials;
  }

  /**
   * Connects to the FTP library.
   *
   * @param options connect options
   *
   * @returns FTPIntegration
   */
  public async connect(options: any = {}): Promise<IIntegration> {
    debug('[FTP Integration] connect');

    try {
      this.connection = createFTPConnection({
        protocol: this.protocol,
        host: this.host,
        port: this.port,
        credentials: this.credentials,
      });

      this.connected = true;

      return this;
    } catch (error) {
      console.error('[FTP Integration] connect.error', error);

      throw error;
    }
  }

  /**
   * Disconnects the integration.
   *
   * @param options disconnect options
   *
   * @returns FTPIntegration
   */
  public async disconnect(options: any = {}): Promise<IIntegration> {
    debug('[FTP Integration] disconnect');

    try {
      if (this.connected) {
        if (this.connection) {
          await this.connection.disconnect();

          this.connection = undefined;
        }

        this.connected = false;
      }

      return this;
    } catch (error) {
      console.error('[FTP Integration] disconnect.error', error);

      throw error;
    }
  }

  /**
   * Lists files and directories at a bucket path.
   *
   * @param path directory path
   * @param options
   *
   * @returns list of files and directories
   */
  public async list(path = '', options = {}) {
    debug('[FTP Integration] list', { path });

    try {
      const files = [];

      const list = await this.connection.listDir(path);

      list.forEach((file) => {
        if (file.name !== '.' && file.name !== '..') {
          let name = file.type === 'd' ? `${file.name}/` : file.name;

          if (path !== '') {
            name = Path.join(path, name);
          }

          files.push(name);
        }
      });

      return files;
    } catch (error) {
      console.error('[FTP Integration] list.error', error);

      throw error;
    }
  }

  /**
   * Downloads a file from S3.
   *
   * @param path the file path to get
   * @param options get options
   *
   * @returns the downloaded file
   */
  public async get(path: string = '', options: any = {}): Promise<string> {
    debug('[FTP Integration] get', { path });

    try {
      const tmpFile = Path.join(OS.tmpdir(), uuid());

      await this.connection.download([[path, tmpFile]]);

      return fs.readFile(tmpFile, 'UTF-8');
    } catch (error) {
      console.error('[FTP Integration] get.error', error);

      throw error;
    }
  }

  /**
   * Uploads a file to S3.
   *
   * @param path the path to upload to
   * @param options upload options
   * @param options.data the stringified data to upload
   *
   * @returns true on success, false on failure
   */
  public async put(path: string = '', options: any = {}): Promise<boolean> {
    debug('[FTP Integration] put', { path });

    try {
      if (!options.uploadPath) {
        throw new Error('uploadPath has not been defined');
      }

      const result = await this.connection.upload([[path, options.uploadPath]]);

      return result === 1;
    } catch (error) {
      console.error('[FTP Integration] put.error', error);

      throw error;
    }
  }

  /**
   * Removes a file from FTP.
   *
   * @param path file path to remove
   * @param options remove options
   *
   * @returns true on success
   */
  public async remove(path: string, options: any = {}): Promise<boolean> {
    debug('[FTP Integration] remove', { path });

    try {
      await this.connection.remove([path]);

      return true;
    } catch (error) {
      console.error('[FTP Integration] remove.error', error);

      throw error;
    }
  }
}
