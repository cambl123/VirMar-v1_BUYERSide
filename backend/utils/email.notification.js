import nodemailer from 'nodemailer';
// 
import dotenv from 'dotenv';  

dotenv.config();

// Accept a Notification object and send an email using its data
export async function sendEmailNotification(title, message, recipientEmail) {
  console.log('EMAIL:', process.env.EMAIL, 'PASSWORD:', process.env.PASSWORD); // don't push this to production logs

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
  

  const mailOptions = {
    from: process.env.EMAIL,
    to: recipientEmail,          // expects email field
    replyTo: process.env.EMAIL,               // optional
    subject: title,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}
