# Usage

[Home](index.md)

```typescript
const manager = new IntegrationManager({
  s3: {
    bucket: 'my-bucket-name',
    region: 'ap-southeast-2',
    credentials: {
      aws_access_key_id: 'key',
      aws_secret_access_key: 'secret',
    },
  },
});

manager.list()
```
