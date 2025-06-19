const nodemailer = require('nodemailer');

/**
 * Send an email using Gmail SMTP.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 */
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,     // e.g. your Gmail like suriyawan@gmail.com
        pass: process.env.EMAIL_PASS      // App password (not your Gmail login password!)
      }
    });

    const mailOptions = {
      from: `"Suriyawan Saffari" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent: ", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return { success: false, error };
  }
};

module.exports = sendEmail;
