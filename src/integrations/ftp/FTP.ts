import * as BPromise from 'bluebird';
import * as fs from 'fs-extra';
import * as PromiseFTP from 'promise-ftp';
import streamToPromise from 'stream-to-promise';
import { getDebug } from '../../util/getDebug';

const debug = getDebug();

/**
 * FTP Provider.
 */
export class FTP {
  /** ftp host */
  protected host: string;
  /** ftp port */
  protected port: number;
  /** ftp credentials */
  protected credentials: any;
  /** ftp connection */
  protected connection: any;
  /** auto-disconnect flag */
  protected autoDisconnect: boolean;
  /** timer */
  protected timeoutId: NodeJS.Timer;
  /** connected flag */
  protected connected: boolean;

  constructor(params) {
    this.host = params.host;
    this.port = params.port;

    this.credentials = params.credentials;

    if (params.connection) {
      this.connection = params.connection;
    } else {
      this.connection = new PromiseFTP();
    }

    this.autoDisconnect = params.autoDisconnect || false;
  }

  /**
   * Disconnects the ftp connection.
   */
  public disconnect() {
    debug('[FTP] disconnect');

    this.timeoutId = setTimeout(async () => {
      try {
        if (this.connected) {
          await this.connection.end();
        }
      } catch (error) {
        console.error('[FTP] disconnect.error', error);

        throw error;
      }
    }, 5000);
  }

  /**
   * Lists a directory files.
   *
   * @param {string} path directory path
   *
   * @returns list of files
   */
  public async listDir(path: string): Promise<string[]> {
    debug('[FTP] listDir', { path });

    try {
      await this.establish();

      /*
        Folder path must have / at the end.
        Any path that doesn't have / after the last . is considered as a file.
      */
      const directoryList = /^.*\.[^/]+$/.test(path) ?
        await this.connection.size(path) :
        await this.connection.list(path);

      if (this.autoDisconnect) { this.disconnect(); }

      return directoryList;
    } catch (error) {
      console.error('[FTP] listDir.error', error);

      throw error;
    }
  }

  /**
   * Uploads a file to ftp.
   *
   * @param fileList list of files
   */
  public async upload(fileList) {
    debug('[FTP] download', { fileList });

    try {
      await this.establish();

      let results;

      try {
        const sizes = await BPromise.map(fileList, (file) => this.connection.size(file[1]));

        if (sizes.filter((element) => element).length > 0) {
          throw new EvalError('File already exists.');
        }
      } catch (err) {
        if (err instanceof EvalError) { throw err; }

        results = await BPromise.map(fileList, (file) => this.connection.put(file[0], file[1]));
      }

      if (this.autoDisconnect) { this.disconnect(); }

      return results.length;
    } catch (error) {
      console.error('[FTP] download.error', error);

      throw error;
    }
  }

  /**
   * Downloads a file from ftp.
   *
   * @param fileList list of files
   */
  public async download(fileList) {
    debug('[FTP] download', { fileList });

    try {
      await this.establish();

      await BPromise.map(fileList, (file) => this.connection.get(file[0]))
        .map((stream) => streamToPromise(stream))
        .each(async (stream, index) => await fs.writeFile(fileList[index][1], stream));

      if (this.autoDisconnect) { this.disconnect(); }
    } catch (error) {
      console.error('[FTP] download.error', error);

      throw error;
    }
  }

  /**
   * Remove a file from ftp.
   *
   * @param fileList list of files
   */
  public async remove(fileList) {
    debug('[FTP] remove', { fileList });

    try {
      await this.establish();

      await BPromise.map(fileList, async (file) => await this.connection.delete(file));

      if (this.autoDisconnect) { this.disconnect(); }
    } catch (error) {
      console.error('[FTP] remove.error', error);

      throw error;
    }
  }

  /**
   * Establishes a new connection to ftp server.
   */
  private async establish() {
    try {
      clearTimeout(this.timeoutId);

      if (!this.connected) {
        await this.connection.connect({
          host: this.host,
          port: this.port,
          user: this.credentials.username,
          password: this.credentials.password,
        });

        this.connected = true;
      }
    } catch (error) {
      console.error('error', error);

      throw error;
    }
  }
}
