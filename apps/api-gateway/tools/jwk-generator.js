const fs = require('fs/promises');
const { resolve } = require('path');
const { JWK } = require('node-jose');

async function main() {
  const keyStore = JWK.createKeyStore();
  await keyStore.generate('RSA', 2048, { alg: 'RS256', use: 'sig' });
  await fs.writeFile(
    resolve(__dirname, '../src/assets/jwks/jwks.json'),
    JSON.stringify(keyStore.toJSON(true), null, 2)
  );
  console.log('JWKs generated successfully');
}

main();
