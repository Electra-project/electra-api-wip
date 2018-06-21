const config = require('../../../configs/config.js');
const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: config.email.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.username, // generated ethereal user
    pass: config.email.password, // generated ethereal password
  },
});


function sendemail(recipient, subject, message) {
  // setup email data with unicode symbols
  const mailOptions = {
    from: config.email.from, // sender address
    to: recipient, // list of receivers
    subject, // Subject line
    text: message, // plain text body
  };


  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    }
    return info;
  });
}

module.exports = { sendemail };
