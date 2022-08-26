const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name, address, age) => {

  sgMail
    .send({
      to: email,
      from: 'amar123@gmail.com',
      subject: 'Sending with SendGrid is Fun',
      text: `Welcome to the app, ${name}. Let me know you get along with the app. Your Age is ${age}, and your address is ${address}`,
    })
}
const sendCancellationEmail = (email, name) => {

  sgMail
    .send({
      to: email,
      from: 'ataurr123@gmail.com',
      subject: 'Sending with SendGrid is Fun',
      text: ` ${name} What is the reason behind cancellation of your email`
    })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}