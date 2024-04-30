import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    //create a hased token
    const hashedToken = bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(
        userId,
        {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
        { new: true, runValidators: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          verifyPasswordToken: hashedToken,
          verifyPasswordTokenExpiry: Date.now() + 3600000,
        },
        { new: true, runValidators: true }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.USER_ID!,
        pass: process.env.PASS!,
      },
    });

    const mailOptions = {
      from: "ashutosh@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset your Password",
      html: '<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY"?"Verify your Email":"Reset Your Password"}</p>',
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
