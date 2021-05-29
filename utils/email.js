const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  //1) Create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });
  //2) Define the email options
  const mailOptions = {
    from: "Haseeb Khan <mhk@shooz.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3)Actually send the email
  await transporter.sendMail(mailOptions);
};
module.exports=sendEmail