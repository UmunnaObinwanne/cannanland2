import { NextResponse, NextRequest } from 'next/server';
import { EmailTemplate } from '../../../components/email-template';
import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { firstname, email } = await request.json();
    const { data, error } = await resend.emails.send({
      from: 'Fr Franco <welcome@cannanland.com>',
      to: email,
      subject: "Welcome to Cannanland",
      react: EmailTemplate({ firstName: firstname }) as React.ReactElement,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to send email',
        error: error,
      });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
