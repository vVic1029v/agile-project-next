import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, body: string) {
  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    const response = await resend.emails.send({
      from: 'email@calendar.ex.com', 
      to,
      subject,
      text: body,
    });

    console.log("✅ Email sent successfully:", response);

    console.log("Full response:", response);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}