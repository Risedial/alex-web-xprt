import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { formName, fields, paymentIntentId, uploadedFiles } = await request.json();

  const fieldLines = Object.entries(fields as Record<string, any>)
    .map(([key, value]) =>
      `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
    )
    .join('\n');

  const fileLines =
    uploadedFiles && Object.keys(uploadedFiles).length > 0
      ? '\n\nUploaded Files:\n' +
        Object.entries(uploadedFiles as Record<string, string>)
          .map(([key, url]) => `${key}: ${url}`)
          .join('\n')
      : '';

  const paymentLine = paymentIntentId
    ? `\n\nStripe Payment Intent ID: ${paymentIntentId}`
    : '';

  const emailBody = `New ${formName} submission received.\n\n${fieldLines}${paymentLine}${fileLines}`;

  await resend.emails.send({
    from: 'Alex Web Xprt Forms <forms@alex-web-xprt.vercel.app>',
    to: process.env.NOTIFICATION_EMAIL!,
    subject: `New ${formName} submission`,
    text: emailBody,
  });

  return NextResponse.json({ success: true });
}
