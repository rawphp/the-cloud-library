import { Dropbox, files as DropboxFiles } from 'dropbox';
import * as fs from 'fs-extra';
import * as fetch from 'node-fetch';
import * as Path from 'path';
import { IIntegration } from '../../types';
import { getDebug } from '../../util/getDebug';
import { Integration } from '../Integration';

const debug = getDebug();

/**
 * Dropbox Integration
 */
export class DropboxIntegration extends Integration {
  /** access token */
  protected accessToken: string;
  /** app key */
  protected appKey: string;
  /** app secret */
  protected appSecret: string;
  /** max upload bytes */
  protected maxUploadBytes: number;
  /** dropbox connection */
  protected dropbox: Dropbox;

  constructor(params: any = {}) {
    super();

    this.id = 'dropbox';
    this.name = 'Dropbox';
    this.connected = false;

    this.accessToken = params.accessToken || process.env.DROPBOX_ACCESS_TOKEN;
    this.appKey = process.env.DROPBOX_APP_KEY;
    this.appSecret = process.env.DROPBOX_APP_SECRET;
    this.maxUploadBytes = 157286400;
  }

  /**
   * Connects to Dropbox.
   *
   * @param options connect options
   *
   * @returns void
   */
  public async connect(options: any = {}): Promise<IIntegration> {
    debug('[Dropbox Integration] connect');

    try {
      this.dropbox = new Dropbox({
        clientId: this.appKey,
        accessToken: this.accessToken,
        fetch,
      } as any);

      this.connected = true;

      this.emit('DropboxConnected', {
        status: this.connected,
        dropbox: this.dropbox,
      });

      return this;
    } catch (error) {
      console.error('[Dropbox Integration] connect.error', error);

      throw error;
    }
  }

  /**
   * Disconnects the Dropbox client.
   *
   * @param options disconnect options
   *
   * @returns Integration
   */
  public async disconnect(options: any = {}): Promise<IIntegration> {
    debug('[Dropbox Integration] disconnect');

    try {
      if (this.connected) {
        if (this.dropbox) {
          this.dropbox = undefined;
        }

        this.connected = false;
      }

      return this;
    } catch (error) {
      console.error('[Dropbox Integration] disconnect.error', error);

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
  public async list(path: string = '', options: any = {}): Promise<string[]> {
    debug('[Dropbox Integration] list', {
      path,
    });

    try {
      const files: string[] = [];
      let notFinished = true;

      do {
        const data = await this.dropbox.filesListFolder({
          path,
        });

        data.entries.forEach((file) => {
          if (file.name !== '.' && file.name !== '..') {
            let name = file['.tag'] === 'folder' ? `${file.name}/` : file.name;

            if (path !== '') {
              name = Path.join(path, name);
            }

            files.push(name);
          }
        });

        if (false === data.has_more) {
          notFinished = false;
        }
      } while (notFinished);

      return files;
    } catch (error) {
      console.error('[Dropbox Integration] list.error', error);

      throw error;
    }
  }

  /**
   * Downloads a file from Dropbox.
   *
   * @param path the file path to get
   * @param options get options
   *
   * @returns the downloaded file
   */
  public async get(path: string = '', options: any = {}): Promise<string> {
    debug('[Dropbox Integration] get', {
      path,
    });

    try {
      const response = await this.dropbox.filesDownload({
        path,
      });

      const data = (response as any).fileBinary;

      if (options.downloadPath) {
        await fs.writeFile(options.downloadPath, data);
      }

      return data;
    } catch (error) {
      console.error('[Dropbox Integration] get.error', error);

      throw error;
    }
  }

  /**
   * Uploads a file to Dropbox.
   *
   * @param path the path to upload to
   * @param options upload options
   * @param options.data the stringified data to upload
   *
   * @returns true on success, false on failure
   */
  public async put(path: string, options: any = {}): Promise<boolean> {
    debug('[Dropbox Integration] put', {
      path,
    });

    try {
      // if (totalSize >= this.maxUploadBytes) {
      const buffer = Buffer.isBuffer(options.data) ? options.data : Buffer.from(options.data, 'utf-8');
      const totalSize = buffer.byteLength;

      console.log('total buffer size', totalSize);

      let start = 0;
      const size = 128;
      let total = 0;
      let session;

      while (total < options.data.length) {
        const buff = buffer.slice(start, size);

        console.log('current buffer Size =>>>>', buff.length);

        if (!session) {
          console.log('Start upload session');

          const startSessionRequest = {
            contents: buff,
            close: false,
          };

          console.log(startSessionRequest);

          session = await this.dropbox.filesUploadSessionStart(startSessionRequest);

          console.log('start sesion', session); // { session_id: 'AAAAAAAA4oGcsu5rL7gVXw' }

          total += size;
          start = total + 1;

          continue;
        }

        const appendRequest: DropboxFiles.UploadSessionAppendArg = {
          contents: buff,
          cursor: {
            contents: buff,
            session_id: session.session_id,
            offset: total,
          },
          close: total >= options.data.length,
        };

        console.log(appendRequest);

        await this.dropbox.filesUploadSessionAppendV2(appendRequest);

        total += size;
        start = total + 1;
      }
      // } else {
      //   const result = await this.dropbox.filesUpload({
      //     contents: options.data,
      //     path,
      //     mode: options.mode,
      //     autorename: options.autorename,
      //   });

      //   console.log(result);
      // }

      return true;
    } catch (error) {
      console.error('[Dropbox Integration] put.error', error);

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
    debug('[Dropbox Integration] remove', {
      path,
    });

    try {
      // const result = await this.dropbox.deleteObject({
      //   Bucket: this.bucket,
      //   Key: path,
      // }).promise();

      return true;
    } catch (error) {
      console.error('[Dropbox Integration] remove.error', error);

      throw error;
    }
  }
}
