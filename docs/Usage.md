# Usage

[Home](index.md)

<hr />

```typescript
const config = require('../config.json');

const manager = new IntegrationManager(config);

manager.list()
```

## Debug

You can enable debug mode by declaring `DEBUG=cloud` environment variable.

```bash
export DEBUG=cloud
```
