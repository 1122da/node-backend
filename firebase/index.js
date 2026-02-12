const firebase = require('firebase-admin');

const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

if (base64) {
  const serviceAccount = JSON.parse(
    Buffer.from(base64, 'base64').toString('utf8')
  );
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
  });
  module.exports = firebase;
} else {
  // Firebase not configured (e.g. server has no FIREBASE_SERVICE_ACCOUNT_BASE64 in config.env).
  // Push notifications will be skipped; add the env var to enable them.
  console.warn(
    'Firebase: FIREBASE_SERVICE_ACCOUNT_BASE64 not set in config.env — push notifications disabled. ' +
      'To enable: add base64-encoded service account JSON (see config.env.example).'
  );
  module.exports = {
    messaging: () => ({
      send: async () => {
        console.warn('Firebase not configured; push notification skipped.');
      },
    }),
  };
}
