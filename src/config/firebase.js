var FirebaseAdmin = require("firebase-admin");

var serviceAccount = require("./firebase.json");


FirebaseAdmin.initializeApp({
    credential: FirebaseAdmin.credential.cert(serviceAccount)
  });
module.exports.FirebaseAdmin = FirebaseAdmin