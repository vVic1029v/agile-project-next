import nodemailer from "nodemailer";

export async function sendEmail(to: string[], subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Setează în `.env`
      pass: process.env.EMAIL_PASS, // Setează în `.env`
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to, // Lista de emailuri
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
}
