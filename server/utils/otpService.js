import otpGenerator from "otp-generator"
import nodemailer from "nodemailer"
import dotenv from 'dotenv';
dotenv.config();
export const generateOtp=()=>{
    //   const otp= otpGenerator.generate(4, { digits: true, alphabets: false, upperCase: false, specialChars: false }, '0123456789');
     let otp = '';
    for (let i = 0; i < 4; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    console.log("otp", otp);
    return otp;
}

export const otpTransporter=()=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_PASSWORD,
        },
    });
    return transporter;
}