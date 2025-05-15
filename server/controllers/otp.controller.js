import { Otp } from "../models/otp.model.js";
import { generateOtp } from "../utils/otpService.js";
import { otpTransporter } from "../utils/otpService.js";

export const SendOtpMail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingOtp = await Otp.findOne({ email });
    if (existingOtp) {
      const timeElapsed = (Date.now() - new Date(existingOtp.createdAt)) / 1000;

      if (timeElapsed < 300) {
        const remaining = Math.ceil(300 - timeElapsed);
        return res.status(429).json({
          message: `Please wait ${remaining} seconds before requesting a new OTP.`,
        });
      }
    }
    const otp = generateOtp();

    const dbresponse = await Otp.create({ email, otp });

    const transporter = otpTransporter();
    await transporter.sendMail({
      from: `"Admin" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: "OTP Verification for SkillSync",
      html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px;">
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) for verifying your account on <strong>SkillSync LMS</strong> is:</p>
        <h2 style="color: #2c3e50;">${otp}</h2>
        <p>Please enter this OTP in the verification screen to continue. It is valid for the next <strong>5 minutes</strong>.</p>
        <p style="color: red;"><strong>Note:</strong> Do not share this OTP with anyone.</p>
        <br/>
        <p>Thank you for choosing SkillSync — where learning meets innovation!</p>
        <p>Best regards,<br/>Team SkillSync</p>
      </div>
`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP Mail Error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!otp || !email) {
      return res.status(400).json({ message: "Otp and Email is required" });
    }

    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return res.status(404).json({ message: "OTP not found or expired" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
