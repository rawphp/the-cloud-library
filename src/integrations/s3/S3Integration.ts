import * as AWS from 'aws-sdk';
import { IIntegration, IIntegrationConfig } from '../../types';
import { getDebug } from '../../util/getDebug';
import { Integration } from '../Integration';

const debug = getDebug();

export interface IS3IntegrationParams extends IIntegrationConfig {
  /** bucket name */
  bucket: string;
  /** aws region */
  region: string;
  /** aws credentials */
  credentials: {
    /** aws credential key */
    aws_access_key_id: string;
    /** aws credential secret */
    aws_secret_access_key: string
  };
  /** s3 sdk version */
  version?: string;
}

/**
 * S3 Integration.
 */
export class S3Integration extends Integration {
  /** s3 client instance */
  public s3Client: AWS.S3;
  /** aws s3 sdk version */
  protected version: string;
  /** bucket name */
  protected bucket: string;
  /** aws region name */
  protected region: string;
  /** credentials */
  protected credentials: any;

  public constructor(params: IS3IntegrationParams) {
    super();

    this.id = 's3';
    this.name = 'S3';
    this.connected = false;
    this.version = 'latest';

    if (!params.bucket && !process.env.S3_BUCKET) {
      throw new Error('bucket not defined in params');
    }
    if (!params.region && !process.env.S3_REGION) {
      throw new Error('region not defined in params');
    }
    if (!params.credentials) {
      if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        params.credentials = {
          aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
          aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
        };
      } else {
        throw new Error('credentials not defined in params');
      }
    }

    this.bucket = params.bucket || process.env.S3_BUCKET;
    this.region = params.region || process.env.S3_REGION;
    this.credentials = params.credentials;
  }

  /**
   * Connects the integration to the cloud.
   *
   * @param options connection options
   *
   * @returns the integration instance
   */
  public async connect(options: any = {}): Promise<IIntegration> {
    debug('[S3 Integration] connect');

    try {
      this.s3Client = new AWS.S3({
        region: this.region,
      });

      this.connected = true;

      return this;
    } catch (error) {
      console.error('[S3 Integration] connect.error', error);

      throw error;
    }
  }

  /**
   * Disconnects the integration from the cloud.
   *
   * @param options disconnection options
   *
   * @returns the integration
   */
  public async disconnect(options: any = {}): Promise<IIntegration> {
    debug('[S3 Integration] disconnect');

    try {
      if (this.connected) {
        if (this.s3Client) {
          this.s3Client = undefined;
        }

        this.connected = false;
      }

      return this;
    } catch (error) {
      console.error('[S3 Integration] disconnect.error', error);

      throw error;
    }
  }

  /**
   * Lists files in a directory.
   *
   * @param path directory path
   *
   * @returns list of files and directories
   */
  public async list(path: string = '', options: any = {}): Promise<string[]> {
    debug('[S3 Integration] list', { path });

    try {
      const files = [];
      let notFinished = true;

      do {
        const results = await this.s3Client.listObjects({
          Bucket: this.bucket,
          Prefix: path !== '/' ? path : undefined,
          Delimiter: '/',
        }).promise();

        results.CommonPrefixes.forEach((prefix) => files.push(prefix.Prefix));
        results.Contents.forEach((item) => files.push(item.Key));

        if (false === results.IsTruncated) {
          notFinished = false;
        }
      } while (notFinished);

      return files;
    } catch (error) {
      console.error('[S3 Integration] list.error', error);

      throw error;
    }
  }

  /**
   * Uploads a file to the cloud.
   *
   * @param path file path
   * @param data file content
   *
   * @returns true on success
   */
  public async put(path: string, data: string, options: any = {}): Promise<boolean> {
    debug('[S3 Integration] put', { path });

    try {
      const result = await this.s3Client.upload({
        Bucket: this.bucket,
        Key: path,
        Body: data,
      }).promise();

      if (!result.Location) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('[S3 Integration] put.error', error);

      throw error;
    }
  }

  /**
   * Downloads a file from the cloud.
   *
   * @param path file path
   *
   * @returns file contents
   */
  public async get(path: string, options: any = {}): Promise<string> {
    debug('[S3 Integration] get', { path });

    try {
      const result = await this.s3Client.getObject({
        Bucket: this.bucket,
        Key: path,
      }).promise();

      const body = result.Body.toString();

      return body;
    } catch (error) {
      console.error('[S3 Integration] get.error', error);

      throw error;
    }
  }

  /**
   * Deletes a file in the cloud.
   *
   * @param path file path
   *
   * @returns true on success
   */
  public async remove(path: string, options: any = {}): Promise<boolean> {
    debug('[S3 Integration] remove', { path });

    try {
      await this.s3Client.deleteObject({
        Bucket: this.bucket,
        Key: path,
      }).promise();

      return true;
    } catch (error) {
      console.error('[S3 Integration] remove.error', error);

      throw error;
    }
  }
}
