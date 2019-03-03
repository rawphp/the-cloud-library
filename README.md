# The Cloud Library

[![Build Status](https://travis-ci.org/rawphp/the-cloud-library.svg?branch=master)](https://travis-ci.org/rawphp/the-cloud-library)

The goal of this project is to support all the major cloud storage providers in a common interface.

[Read the Docs](https://rawphp.github.io/the-cloud-library)

## Common Interface

We'd like to provide the following common functionality:

```typescript
/**
 * Connects the integration to the cloud.
 *
 * @param options connection options
 *
 * @returns the integration instance
 */
connect(options?: any): Promise<IIntegration>;
/**
 * Disconnects the integration from the cloud.
 *
 * @param options disconnection options
 *
 * @returns the integration
 */
disconnect(options?: any): Promise<IIntegration>;
/**
 * Lists files in a directory.
 *
 * @param path directory path
 *
 * @returns list of files and directories
 */
list(path: string, options?: any): Promise<string[]>;
/**
 * Uploads a file to the cloud.
 *
 * @param path file path
 * @param data file content
 *
 * @returns true on success
 */
put(path: string, data: string, options?: any): Promise<boolean>;
/**
 * Downloads a file from the cloud.
 *
 * @param path file path
 *
 * @returns file contents
 */
get(path: string, options?: any): Promise<string>;
/**
 * Deletes a file in the cloud.
 *
 * @param path file path
 *
 * @returns true on success
 */
remove(path: string, options?: any): Promise<boolean>;
```

## Plan

    - [x] S3
    - [x] Dropbox
    - [x] FTP
    - [ ] Amazon Drive
    - [ ] Box
    - [ ] Google Drive

## License

MIT
