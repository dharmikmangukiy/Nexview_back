const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const generateOTP = require("./otpGenrator");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'joelle.parisian1@ethereal.email',
      pass: 'BwH8sPjEXySpG487yN'
  }
});

const sendEmail = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log(email);

  const otp = generateOTP();

  var mailOptions = {
    from: 'nexview@gmail.com', // your Gmail address
    to: email,
    subject: "OTP from Callback Coding",
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send({ message: 'Email sending failed' });
    } else {
      console.log("Email sent successfully!");
      res.status(200).send({ message: 'Email sent successfully' });
    }
  });
});

module.exports = { sendEmail };
