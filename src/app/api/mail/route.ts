import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { sendEmail } from '@/lib/mail';

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'simple bulk mail' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, subject, text, html } = body;

    // Get mail settings from Supabase
    const supabase = createServerClient();
    const { data: settings, error: settingsError } = await supabase
      .from('mail_settings')
      .select('gmail_user, gmail_app_password, gmail_enabled')
      .eq('id', 1)
      .single();

    if (settingsError) {
      return NextResponse.json(
        { error: 'Failed to fetch mail settings', details: settingsError.message },
        { status: 500 }
      );
    }

    if (!settings) {
      return NextResponse.json(
        { error: 'Mail settings not found. Please configure Gmail in /admin/mail/settings' },
        { status: 400 }
      );
    }

    const result = await sendEmail(
      {
        gmailUser: settings.gmail_user,
        gmailAppPassword: settings.gmail_app_password,
        gmailEnabled: settings.gmail_enabled,
      },
      {
        to: to || '',
        subject: subject || 'No Subject',
        text: text || '',
        html: html || `<p>${text || ''}</p>`,
      }
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Mail API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
