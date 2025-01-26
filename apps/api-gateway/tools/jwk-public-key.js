const fs = require('fs/promises');
const { resolve } = require('path');
const { JWK } = require('node-jose');

async function main() {
  const source = await fs.readFile(
    resolve(__dirname, '../src/assets/jwks/jwks.json'),
    'utf8'
  );
  const keyStore = await JWK.asKeyStore(source);
  await fs.writeFile(
    resolve(__dirname, '../src/assets/jwks/public.json'),
    JSON.stringify(keyStore.toJSON(false), null, 2)
  );
  console.log('Public JWKs generated successfully');
}

main();
