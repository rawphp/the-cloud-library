import { FTP } from '../../../src/integrations/ftp/FTP';

describe('FTP', () => {
  let instance;
  const config = {
    // protocol: 'ftp',
    host: 'ftp.dlptest.com',
    port: 21,
    credentials: {
      username: 'dlpuser@dlptest.com',
      password: 'puTeT3Yei1IJ4UYT7q0r',
    },
  };

  it('instantiates successfully', () => {
    instance = new FTP(config);

    expect(instance).toBeInstanceOf(FTP);
  });
});
