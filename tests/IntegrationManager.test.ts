import { IntegrationManager } from '../src/IntegrationManager';
import { IS3IntegrationParams, S3Integration } from '../src/integrations/s3/S3Integration';
import { IIntegrationManager } from '../src/types';

describe('IntegrationManager', () => {
  let manager: IIntegrationManager;

  beforeEach(() => {
    manager = new IntegrationManager({
      connections: {
        s3: {
          integrationId: 's3',
          bucket: 'test-bucket-name',
          region: 'ap-southeast-2',
          credentials: {
            aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
            aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
          },
        },
      },
    });
  });

  it('exists', () => {
    expect(manager).toBeInstanceOf(IntegrationManager);
  });

  it('has emit method from', () => {
    expect(typeof manager.emit).toBe('function');
  });

  it('has on method', () => {
    expect(typeof manager.on).toBe('function');
  });

  it('has the following methods', () => {
    expect(typeof manager.registerIntegration).toEqual('function');
    expect(typeof manager.removeIntegration).toEqual('function');
    expect(typeof manager.getIntegration).toEqual('function');
    expect(typeof manager.getIntegrationConfig).toEqual('function');
  });

  describe('addIntegration', () => {
    it('registers an integration successfully', () => {
      const s3Integration = new S3Integration(manager.getIntegrationConfig('s3') as IS3IntegrationParams);

      const result = manager.registerIntegration('s3', (mgr) => {
        return s3Integration;
      });

      expect(result).toEqual(manager);
      expect(result.getIntegration('s3')).toEqual(s3Integration);
    });
  });

  describe('removeIntegration', () => {
    it('removes an integration successfully', () => {
      const s3Integration = new S3Integration(manager.getIntegrationConfig('s3') as IS3IntegrationParams);

      const done = manager.registerIntegration('s3', (mgr) => {
        return s3Integration;
      });

      expect(done.getIntegration('s3')).toEqual(s3Integration);

      expect(manager.removeIntegration('s3')).toEqual(manager);
      expect(done.getIntegration('s3')).toEqual(undefined);
    });
  });
});
