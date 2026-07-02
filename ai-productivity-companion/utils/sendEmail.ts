import { transporter } from "@/lib/mail";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  await transporter.sendMail({
    from: `"AI Productivity Companion" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}