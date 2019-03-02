import { SFTP } from '../../../src/integrations/ftp/SFTP';

describe('SFTP', () => {
  let instance;
  // const config = {
  //   protocol: 'sftp',
  //   host: process.env.SFTP_HOST,
  //   port: process.env.SFTP_PORT,
  //   credentials: {
  //     username: process.env.SFTP_USERNAME,
  //     password: process.env.SFTP_PASSWORD,
  //   },
  // };

  it('instantiates successfully', () => {
    instance = new SFTP();

    expect(instance).toBeInstanceOf(SFTP);
  });
});
