const config = require("config");
const admin = require("firebase-admin");

/**
 * @description setup class
 */
class Setup {
  /**
   * @description constructor
   */
  constructor() {}

  /**
   * setUpFirebase
   */
  setUpFirebase() {
    const credential = config.get("firebaseCredentialClient");
    admin.initializeApp({ credential: admin.credential.cert(credential) });
  }
}

module.exports = new Setup();
