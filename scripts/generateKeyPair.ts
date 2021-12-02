import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const keyPair = crypto.generateKeyPairSync('ed448', {
  privateKeyEncoding: {
    format: 'jwk',
  },
});

fs.writeFileSync(
  `${path.join(__dirname, '..', 'keys')}/privateKey.json`,
  JSON.stringify(keyPair.privateKey),
);
