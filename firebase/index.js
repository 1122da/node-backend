const firebase = require('firebase-admin');

const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
if (!base64) {
  throw new Error(
    'Missing FIREBASE_SERVICE_ACCOUNT_BASE64 in config.env. ' +
      'Add the base64-encoded content of your service account JSON (run: node -e "console.log(require(\'fs\').readFileSync(\'./firebase/serviceAccountKey.json\').toString(\'base64\'))")'
  );
}

const serviceAccount = JSON.parse(
  Buffer.from(base64, 'base64').toString('utf8')
);

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

module.exports = firebase;
