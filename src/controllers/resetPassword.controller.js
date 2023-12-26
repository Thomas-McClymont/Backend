import nodemailer from "nodemailer";
import crypto from "crypto";
import { userModel } from "../dao/models/user.model.js";
import { GMAIL_PASSWORD, GMAIL_USER } from "../config/config.js";

const sendResetPasswordEmail = async (userEmail) => {
  const user = await userModel.findOne({ email: userEmail });
  if (!user) {
    throw new Error("User not found.");
  }
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; 
  await user.save();
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  const resetUrl = `http://localhost:8080/reset-password/${resetToken}`;
  let mailOptions = {
    from: "tommy.mcclymont@gmail.com",
    to: userEmail,
    subject: "Restore password",
    text: `Restore password: ${resetUrl}`,
    html: `<p>To restore password go to: <a href="${resetUrl}"></a></p>`,
  };
  await transporter.sendMail(mailOptions);
};

export default sendResetPasswordEmail;
