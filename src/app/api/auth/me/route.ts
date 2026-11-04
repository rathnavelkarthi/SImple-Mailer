import { NextResponse } from 'next/server';
import { createAnonClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createAnonClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: { email: user.email } });
  } catch {
    return NextResponse.json({ user: null });
  }
}
