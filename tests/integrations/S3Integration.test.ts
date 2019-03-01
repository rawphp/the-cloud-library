import { S3Integration } from '../../src/integrations/S3Integration';
import { IIntegration } from '../../src/types';
import * as listBucketResponseJson from '../fixtures/list-bucket-response.json';
import * as listDevelopmentProjectsResponseJson from '../fixtures/list-development-projects-response.json';
import * as packageLockJson from '../fixtures/package-lock.json';
import * as putFileResponseJson from '../fixtures/put-file-response.json';

describe('S3Integration', () => {
  let integration: IIntegration;

  beforeEach(() => {
    integration = new S3Integration({
      bucket: 'tdk-backup',
      region: 'ap-southeast-2',
      credentials: {
        aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
        aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  });

  it('is created successfully', () => {
    expect(integration).toBeInstanceOf(S3Integration);
  });

  it('is an object', () => {
    expect(typeof integration).toEqual('object');
  });

  it('has the correct id', () => {
    expect(integration.id).toEqual('s3');
  });

  it('has the correct name', () => {
    expect(integration.name).toEqual('S3');
  });

  it('has connected property', () => {
    expect(integration.connected).toEqual(false);
  });

  describe('handler has methods', () => {
    describe('connect', () => {
      it('has connect method', () => {
        expect(typeof integration.connect).toEqual('function');
      });

      it('connects to AWS S3 successfully', async () => {
        await integration.connect();

        expect(integration.connected).toEqual(true);
      });

      it('has s3Client', async () => {
        await integration.connect();

        expect((integration as any).s3Client).toBeTruthy();
      });
    });

    describe('disconnect', () => {
      it('has disconnect method', () => {
        expect(typeof integration.disconnect).toEqual('function');
      });

      it('disconnects from S3 successfully', async () => {
        await integration.connect();
        await integration.disconnect();

        expect(integration.connected).toEqual(false);
        expect((integration as any).s3Client).toBe(undefined);
      });
    });

    describe('list', () => {
      it('has list method', () => {
        expect(typeof integration.list).toEqual('function');
      });

      it('lists files and directories in the bucket successfully', async () => {
        const expected = ['.aws/', '.ssh/', 'Development/', 'Downloads/', '.gitconfig', '.npmrc', '.yarnrc'];

        await integration.connect();

        (integration as any).s3Client.listObjects = jest.fn().mockReturnValueOnce({
          promise: () => listBucketResponseJson,
        });

        const results = await integration.list('');

        expect(results).toEqual(expected);
      });

      it('lists files and directories at path successfully', async () => {
        const expected = [
          'Development/Projects/12-factor-demo/',
          'Development/Projects/@types/',
          'Development/Projects/Advanced-React/',
          'Development/Projects/Angular/',
          'Development/Projects/DocumentBoxAutomation/',
          'Development/Projects/Homestead/',
          'Development/Projects/JavaScript30/',
          'Development/Projects/Python Machine Learning Tute/',
          'Development/Projects/R/',
          'Development/Projects/aws-cleanup/',
          'Development/Projects/bats/',
          'Development/Projects/bit-explorer/',
          'Development/Projects/blockchain/',
          'Development/Projects/bodybuilder/',
          'Development/Projects/chrome-extensions/',
          'Development/Projects/clean-aws/',
          'Development/Projects/docker/',
          'Development/Projects/document-box/',
          'Development/Projects/document-store/',
          'Development/Projects/electron/',
          'Development/Projects/express/',
          'Development/Projects/gatsby-site/',
          'Development/Projects/geolocation/',
          'Development/Projects/hooks/',
          'Development/Projects/hygen-generators/',
          'Development/Projects/java/',
          'Development/Projects/layerganza/',
          'Development/Projects/mobx/',
          'Development/Projects/newman-environment-writer/',
          'Development/Projects/onedrive/',
          'Development/Projects/php/',
          'Development/Projects/python/',
          'Development/Projects/racing/',
          'Development/Projects/react-native/',
          'Development/Projects/security-validator/',
          'Development/Projects/serverless-plugins/',
          'Development/Projects/setenv/',
          'Development/Projects/sites/',
          'Development/Projects/tdk-documents/',
          'Development/Projects/temando/',
          'Development/Projects/tensorflow-js/',
          'Development/Projects/test-framework/',
          'Development/Projects/traffic/',
          'Development/Projects/vue/',
          'Development/Projects/watchman/',
          'Development/Projects/webpack/',
          'Development/Projects/x-cloud/',
          'Development/Projects/yo/',
          'Development/Projects/create-app.sh',
          'Development/Projects/package-lock.json',
          'Development/Projects/yarn.lock',
        ];

        await integration.connect();

        (integration as any).s3Client.listObjects = jest.fn().mockReturnValueOnce({
          promise: () => listDevelopmentProjectsResponseJson,
        });

        const results = await integration.list('Development/Projects/');

        expect(results).toEqual(expected);
      });
    });

    describe('get', () => {
      it('has get method', () => {
        expect(typeof integration.get).toEqual('function');
      });

      it('successfully gets a file from path', async () => {
        await integration.connect();

        (integration as any).s3Client.getObject = jest.fn().mockReturnValueOnce({
          promise: () =>
            Promise.resolve({
              Body: JSON.stringify(packageLockJson),
            }),
        });

        const result = await integration.get('Development/Projects/package-lock.json');

        expect(result).toEqual(JSON.stringify(packageLockJson));
      });
    });

    describe('put', () => {
      it('has put method', () => {
        expect(typeof integration.put).toEqual('function');
      });

      it('puts a file to a path successfully', async () => {
        await integration.connect();

        (integration as any).s3Client.upload = jest.fn().mockReturnValueOnce({
          promise: () => Promise.resolve(putFileResponseJson),
        });

        const result = await integration.put(
          'test/integration/file.json',
          JSON.stringify({
            message: 'success',
          }),
        );

        expect(result).toEqual(true);
      });
    });

    describe('remove', () => {
      it('has remove method', () => {
        expect(typeof integration.remove).toEqual('function');
      });

      it('removes a file successfully from s3', async () => {
        await integration.connect();

        (integration as any).s3Client.deleteObject = jest.fn().mockReturnValueOnce({
          promise: () => Promise.resolve({}),
        });

        const result = await integration.remove('test/integration/file.json');

        expect(result).toEqual(true);
      });
    });
  });
});
