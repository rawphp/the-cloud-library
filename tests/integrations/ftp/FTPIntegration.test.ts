import * as fs from 'fs-extra';
import * as Path from 'path';
import { FTPIntegration } from '.../../../src/integrations/ftp/FTPIntegration';
import { FTP } from '../../../src/integrations/ftp/FTP';
import * as listDeepPathResponseJson from '../../fixtures/list-deep-path-response.json';
import * as listDefaultResponseJson from '../../fixtures/list-default-response.json';

describe('ftp integration', () => {
  let integration;

  beforeEach(() => {
    integration = new FTPIntegration({
      integrationId: 'ftp',
      protocol: 'ftp',
      host: 'ftp.dlptest.com',
      port: 21,
      credentials: {
        username: 'dlpuser@dlptest.com',
        password: 'puTeT3Yei1IJ4UYT7q0r',
      },
    });
  });

  afterEach(async () => {
    if (integration.connected) {
      await integration.disconnect();
    }

    jest.resetAllMocks();
  });

  it('is an object', () => {
    expect(typeof integration).toEqual('object');
  });

  it('has the correct id', () => {
    expect(integration.id).toEqual('ftp');
  });

  it('has the correct name', () => {
    expect(integration.name).toEqual('FTP');
  });

  it('has connected property', () => {
    expect(integration.connected).toEqual(false);
  });

  describe('handler has methods', () => {
    describe('connect', () => {
      it('has connect method', () => {
        expect(typeof integration.connect).toEqual('function');
      });

      it('connects to FTP successfully', () => {
        integration.connect();

        expect(integration.connected).toEqual(true);
      });

      it('has connection', () => {
        integration.connect();

        expect(integration.connection).toBeTruthy();
        expect(integration.connection).toBeInstanceOf(FTP);
      });
    });

    describe('disconnect', () => {
      it('has disconnect method', () => {
        expect(typeof integration.disconnect).toEqual('function');
      });

      it('disconnects from FTP successfully', async () => {
        integration.connect();

        await integration.disconnect();

        expect(integration.connected).toEqual(false);
        expect(integration.connection).toBe(undefined);
      });
    });

    describe('list', () => {
      it('has list method', () => {
        expect(typeof integration.list).toEqual('function');
      });

      it('returns an array of files', async () => {
        const expected = [
          '.ftpquota_190208_160851_190208_161432',
          '28b3e136-d883-4102-b35a-9672582c76e3.txt',
          '5b8b7c31-bc9d-41e4-8280-94f1f6c0c472.txt',
          '5db4a46f-d00b-4fb7-8a62-27a790fff204.txt',
          '7326b125-d696-435a-9940-00af20802241/',
          'a06491c2-8a4b-4a82-b025-6dc743d69116/',
          'd1f30493-6914-42d8-8313-2f1f79fd83ec.txt',
          'd647f99a-3485-4451-9e31-183585a89781.txt',
        ];

        await integration.connect();

        integration.connection.listDir = jest.fn().mockResolvedValueOnce(listDefaultResponseJson);

        const result = await integration.list('');

        expect(Array.isArray(result)).toEqual(true);
        expect(result).toEqual(expected);
      });

      it('successfully returns a listing for deep path', async () => {
        const expected = [
          '9eb3243b-43dc-41b9-b27c-a920010f311d/test1.txt',
          '9eb3243b-43dc-41b9-b27c-a920010f311d/tester-2/',
        ];
        const path = '9eb3243b-43dc-41b9-b27c-a920010f311d/';

        await integration.connect();

        integration.connection.listDir = jest.fn().mockResolvedValueOnce(listDeepPathResponseJson);

        const result = await integration.list(path);

        expect(result).toEqual(expected);
      });
    });

    describe('get', () => {
      it('has get method', () => {
        expect(typeof integration.get).toEqual('function');
      });

      it('successfully downloads a file', async () => {
        const expected = 'kKOdVJrJObhSor/UmVBipOT47uoN2U8g31CSe5OMZRNN1jEILhXjTLQcJmZQfvU/9BXAgEldqRBc0bwFuEQHmF/nNwsUoPQHlucGgbc0jPjiRstaIAfxyjdcNKH1eNeOBz2GUA==';
        const file = '09329063-b938-4dee-87e0-4b40a9553640.txt';

        await integration.connect();

        (fs as any).readFile = jest.fn().mockResolvedValueOnce(expected);
        integration.connection.download = jest.fn().mockResolvedValueOnce(expected);

        const data = await integration.get(file);

        expect(data).toEqual(expected);
      });

      it('throws error when file does not exist', async () => {
        const file = '09329063-b938-4dee-87e0-4b40a9553641.txt';
        const errorMessage = `Can't open 09329063-b938-4dee-87e0-4b40a9553641.txt: No such file or directory`;

        await integration.connect();

        integration.connection.download = jest.fn().mockRejectedValue(new Error(errorMessage));

        let result;

        try {
          result = await integration.get(file);
        } catch (error) {
          result = error;
        }

        expect(result.message).toEqual(errorMessage);
      });
    });

    describe('put', () => {
      it('has put method', () => {
        expect(typeof integration.put).toEqual('function');
      });

      it('throws error when uploadPath has not been defined', async () => {
        const errorMessage = 'uploadPath has not been defined';
        const file = './fixtures/list-deep-path-response.json';

        await integration.connect();

        let result;

        try {
          result = await integration.put(file);
        } catch (error) {
          result = error;
        }

        expect(result.message).toEqual(errorMessage);
      });

      it('uploads a file successfully', async () => {
        const file = Path.join(__dirname, 'fixtures/list-deep-path-response.json');

        await integration.connect();

        integration.connection.upload = jest.fn().mockResolvedValueOnce(1);

        const result = await integration.put(file, { uploadPath: `/list-deep-path-response.json`});

        expect(result).toEqual(true);
      });

      it('throws error if upload fails becuase file already exists', async () => {
        const file = Path.join(__dirname, 'fixtures/list-deep-path-response.json');

        await integration.connect();

        integration.connection.upload = jest.fn().mockRejectedValueOnce(new EvalError('File already exists.'));

        let result;

        try {
          result = await integration.put(file, { uploadPath: `/list-deep-path-response.json`});
        } catch (error) {
          result = error;
        }

        expect(result.message).toEqual('File already exists.');
      });
    });

    describe('remove', () => {
      it('has remove method', () => {
        expect(typeof integration.remove).toEqual('function');
      });

      it('deletes a file successfully', async () => {
        const file = '/list-deep-path-response.json';

        await integration.connect();

        integration.connection.remove = jest.fn().mockResolvedValueOnce(1);

        const result = await integration.remove(file);

        expect(result).toEqual(true);
      });

      it('throws error if file does not exist', async () => {
        const file = '/list-deep-path-response.json';
        const errorMessage = 'Could not delete /list-deep-path-response.json: No such file or directory';

        await integration.connect();

        integration.connection.remove = jest.fn().mockRejectedValueOnce(new Error(errorMessage));

        let result;

        try {
          result = await integration.remove(file);
        } catch (error) {
          result = error;
        }

        expect(result.message).toEqual(errorMessage);
      });
    });
  });
});
