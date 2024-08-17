const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const SCOPES = [
  'https://www.googleapis.com/auth/cloud-platform', // Required for Google Cloud services
  'https://www.googleapis.com/auth/cloud-platform.read-only', // Optional for read-only access
];

// Replace with your service account credentials
const CREDENTIALS = {
  "type": "service_account",
  "project_id": "gen-lang-client-0623712492",
  "private_key_id": "d2e601034323925369807b900b26abf3ef4cd546",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC8YJcHz1AOuCW6\nodQmUzx47iqID17gtHHkZN99UdbnkfrbBV3gxz45tb0r+J/WnihrNPE2e4s/kdXp\n3C9YlHR2heGiXnFLp9yLEI0yKn8Z656UWdMVgeeGiR4UbRYMGKeTuNPTa/bCNOG4\nAVSAmHU/FL3cZe4rruRqZV9o37lXwAANbJu5fGU+xaGvi22tinjL1BjHFo6xwN+R\nKtGP/aWScHkXIbvfulXUeCnS0N8O1oh0l4I1X9nvuntBp1bI8HqE3ShsNije3FzW\nteByWcT7jySPbkTXjuZDRveYQPREECFmMuzEAvYu0Dqxo0MiAbqg7XGK2Ce+jVHz\nIz3VElNRAgMBAAECggEARnjmF4RdoVwPtU3URZAvF9iVrbf+WRb4YqbAGyxyNsic\nbbKIx84R/9n3Dsug1FPvsAeq06SNV/dRbP8z8TH8jdiRLEKjpNeEALxs7h8K1KIa\nfcpK1wl1mZWTXLXgoR7aFj/3cuk5c7b/2Gwa9k7S0goK6zhwzQPNLOaGtn+34VTr\n6jZP8San8wTfSGjvCTakMwJS+ShAxk1sG67yDuJFC9bDj4VW7aTEQmNLtqCPc2YI\ns3Z7rLiph9By75BHOpLX8sJrSsjH5h27hi8LcFkdFN+pPimIRHZd9v+KpcV2cqvI\n/qofWoHYYvffSbit7DSMbVlN1Z0i8tMB8+s2mFPTpwKBgQD2YrsJoccRvap8LQi2\ngBbd9QRp1FEQMiZjLEM29m5xzR7ccySADOsuzR4+ye9ig+Yh3z8g+qXeRwLu325P\n3JcYIaQ3vEDHTjfNQ4zusoGb5N00ghQ6G5MAUjKIUVMXO8rJQXrSs/e96FjcK74w\ngOfd9fcmo0jfUdyjRfj7XDXrpwKBgQDDumKG2PQoMOlrvI2B5ezg+SXg2pDOkusQ\nZtCf8/FnzLv4YyNQf3PWTxV7upe3YZHmEF7begJQZcAg8g1vlIUA6OFoix688e9/\niEYgifncerY9B2WuA38eGP4SmEh6VRo1aluO9EMX8Jeu3UUSE70hI6CKKP3mVQUK\nrWykOFFIRwKBgA+f2zSVKcaaPIF7aZ4JKWoR66G6cRmR1JVdbTXDEuXsmBRqyNnF\n9/QT1eMtcxzQOHvVaG9y9anO3wS+7oPp/TruhzdxnLoG38sIiZtpfoagUNbPmPDG\nZuASVloGrjo+9HEm0d8iwocsgNYVgA4bXpjYzD+LA0gGLPO9sDhgdJrpAoGAJVo9\nkVR4C++BrGDYdJDHiwuhMe8kMXgSShgE+nGYgWGuAbIRvDwGhEClbe5nI8UIDerT\n33jCVkuExgTLkZ67XzgSRFxAaniVZzY/g9gxCeWVP8JYokPij4Dfg/bx5f61uLnq\nbTaqUzhECkgJ9XA06M0exx8ZjUpuYuJD2Hcy8+MCgYA7bFJsEId91G+iMnGhqSIQ\n6H42YhKkpgQyJJ3Drvsac37t8AhHjhQT9KNJmmhb3rbws/JlcXxeYjI8h+ZgYYJu\nsHhMa/ZrE1PvnuCiSgY6bLJAESXiiR/s2cqbfwOrg/CbhmRygoQYDrbRXM/Zf7/E\nBh8AJ+bhD3rGDyLN0pl8UQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "translation-app@gen-lang-client-0623712492.iam.gserviceaccount.com",
  "client_id": "112115092481493230968",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/translation-app%40gen-lang-client-0623712492.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Function to get an authenticated client
async function getClient() {
  const authClient = new google.auth.GoogleAuth({
    scopes: SCOPES,
    credentials: CREDENTIALS,
  });

  return authClient;
}

module.exports = { getClient };