import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('mail_settings')
      .select('gmail_user, gmail_app_password, gmail_enabled')
      .eq('id', 1)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch settings', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      gmailUser: data?.gmail_user || '',
      gmailAppPassword: data?.gmail_app_password || '',
      gmailEnabled: data?.gmail_enabled || false,
    });
  } catch (error) {
    console.error('Get mail settings error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gmail_user, gmail_app_password, gmail_enabled } = body;

    const supabase = createServerClient();

    // Ensure record exists
    const { data: existing } = await supabase
      .from('mail_settings')
      .select('id')
      .eq('id', 1)
      .maybeSingle();

    const settingsData = {
      id: 1,
      gmail_user: gmail_user || '',
      gmail_app_password: gmail_app_password || '',
      gmail_enabled: gmail_enabled || false,
    };

    let result;
    if (!existing) {
      // Insert new record
      const { data, error } = await supabase
        .from('mail_settings')
        .insert(settingsData)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: 'Failed to save settings', details: error.message },
          { status: 500 }
        );
      }
      result = data;
    } else {
      // Update existing record
      const { data, error } = await supabase
        .from('mail_settings')
        .update({
          gmail_user: gmail_user,
          gmail_app_password: gmail_app_password,
          gmail_enabled: gmail_enabled,
        })
        .eq('id', 1)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: 'Failed to update settings', details: error.message },
          { status: 500 }
        );
      }
      result = data;
    }

    return NextResponse.json({
      success: true,
      gmailUser: result?.gmail_user || '',
      gmailEnabled: result?.gmail_enabled || false,
    });
  } catch (error) {
    console.error('Save mail settings error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
