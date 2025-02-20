import { Resend } from 'resend';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: EmailOptions) {
  console.log('Starting email send process...');
  console.log('Email configuration:', {
    to,
    subject,
    apiKeyExists: !!process.env.RESEND_API_KEY,
  });

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing from environment variables');
    throw new Error('Missing RESEND_API_KEY environment variable');
  }

  try {
    console.log('Attempting to send email via Resend...');
    const data = await resend.emails.send({
      from: 'Boma Link <onboarding@resend.dev>',
      to,
      subject,
      html,
      // Add these optional fields for better deliverability
      reply_to: 'support@bomalink.com',
      text: 'This email contains important information about your password reset request.', // Plain text version
    });

    console.log('Email sent successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Failed to send email via Resend:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    // Throw a more descriptive error
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
