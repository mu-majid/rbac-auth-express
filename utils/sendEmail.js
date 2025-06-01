const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async (to, subject, html) => {
  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    subject,
    html,
  };
  await sgMail.send(msg);
};