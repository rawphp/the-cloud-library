import { createFTPConnection } from '../../../src/integrations/ftp/createFTPConnection';
import { FTP } from '../../../src/integrations/ftp/FTP';
import { SFTP } from '../../../src/integrations/ftp/SFTP';

describe('createFTPConnection', () => {
  const config = {
    protocol: 'ftp',
    host: 'ftp.dlptest.com',
    port: 21,
    credentials: {
      username: 'dlpuser@dlptest.com',
      password: 'puTeT3Yei1IJ4UYT7q0r',
    },
  };

  it('is a function', () => {
    expect(typeof createFTPConnection).toEqual('function');
  });

  it('returns ftp connection for ftp protocol', () => {
    const connection = createFTPConnection(config);

    expect(connection).toBeInstanceOf(FTP);
  });

  it('returns sftp connection for sftp protocol', () => {
    const connection = createFTPConnection({...config, ...{ protocol: 'sftp' }});

    expect(connection).toBeInstanceOf(SFTP);
  });

  it('throws error on unsupported protocol', () => {
    expect(() => {
      createFTPConnection({...config, ...{ protocol: 'test' }});
    }).toThrowError(`Unsupported protocol 'test'`);
  });
});
