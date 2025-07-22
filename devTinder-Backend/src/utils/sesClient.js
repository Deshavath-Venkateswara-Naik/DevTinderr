const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // use the Gmail service
  auth: {
    user: process.env.EMAIL_USER,      // your Gmail address
    pass: process.env.EMAIL_PASS,      // your App Password (not your regular Gmail password)
  },
});

module.exports = { transporter };
