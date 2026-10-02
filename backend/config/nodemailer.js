import nodemailer from "nodemailer";

// ============================================================
// Created SMTP transporter -> to established connection

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ============================================================
// Send Email

const sendEmail = async (to, subject, body) => {
  const response = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html: body,
  });

  return response;
};

export default sendEmail;