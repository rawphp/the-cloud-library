import { FTP } from './FTP';
import { SFTP } from './SFTP';

export const createFTPConnection = (config: any) => {
  switch (config.protocol) {
    case 'ftp':
      return new FTP(config);
    case 'sftp':
      return new SFTP();
    default:
      throw new Error(`Unsupported protocol '${config.protocol}'`);
  }
};
