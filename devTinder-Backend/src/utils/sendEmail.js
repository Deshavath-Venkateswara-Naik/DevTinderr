const nodemailer = require("nodemailer");

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // From .env -> deshavathvenkateswaranaik0193@gmail.com
    pass: process.env.EMAIL_PASS, // From .env -> your app password
  },
});

const run = async (subject, body, toEmailId) => {
  const mailOptions = {
    from: `"Deshavath from DevTinder" <${process.env.EMAIL_USER}>`, // dynamic sender using your email
    to: toEmailId, // receiver
    subject: subject,
    text: "This is the plain text version of the email",
    html: `<h3>${body}</h3>`, // formatted HTML body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return error;
  }
};

module.exports = { run };
