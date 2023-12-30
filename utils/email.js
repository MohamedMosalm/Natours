const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

const sendEmail = async (options) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sender = {
    name: process.env.SENDER_NAME,
    email: process.env.SENDER_EMAIL,
  };

  const receivers = [
    {
      email: options.email,
    },
  ];

  try {
    const sendEmail = await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject: options.subject,
      textContent: options.message,
    });
    console.log('email sent', sendEmail);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;
