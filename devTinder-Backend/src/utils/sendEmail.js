const nodemailer = require("nodemailer");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // or your SMTP host
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your email address (e.g., 'your@gmail.com')
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

const run = async (subject, body, toEmailId) => {
  const mailOptions = {
    from: '"Akshay from DevTinder" <akshay@devtinder.in>', // sender address
    to: toEmailId, // receiver
    subject: subject, // Subject line
    text: "This is the text format email", // plain text body
    html: `<h1>${body}</h1>`, // HTML body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    return error;
  }
};

module.exports = { run };
