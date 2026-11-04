'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MailSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [gmailUser, setGmailUser] = useState('');
  const [gmailAppPassword, setGmailAppPassword] = useState('');
  const [gmailEnabled, setGmailEnabled] = useState(false);

  useEffect(() => {
    fetchMailSettings();
  }, []);

  const fetchMailSettings = async () => {
    try {
      const res = await fetch('/api/admin/mail-settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setGmailUser(data.gmailUser || '');
      setGmailEnabled(data.gmailEnabled || false);
    } catch {
      setError('Failed to load settings. Please ensure Supabase is configured.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/mail-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gmail_user: gmailUser,
          gmail_app_password: gmailAppPassword,
          gmail_enabled: gmailEnabled,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Mail Settings</h1>
          <button
            onClick={() => router.push('/admin')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Back to Admin
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="font-medium text-blue-900">Gmail SMTP Configuration</h2>
          <p className="text-sm text-blue-700 mt-1">
            Configure your Gmail account to send emails through the application.
            You can update these settings at any time after logging in.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enable Gmail SMTP
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Turn on to enable email sending via Gmail
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGmailEnabled(!gmailEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${gmailEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${gmailEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>

            <div>
              <label htmlFor="gmailUser" className="block text-sm font-medium text-gray-700">
                Gmail Address
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Your Gmail email address (e.g., yourname@gmail.com)
              </p>
              <input
                id="gmailUser"
                type="email"
                value={gmailUser}
                onChange={(e) => setGmailUser(e.target.value)}
                disabled={!gmailEnabled}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="yourname@gmail.com"
              />
            </div>

            <div>
              <label htmlFor="gmailAppPassword" className="block text-sm font-medium text-gray-700">
                Gmail App Password
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Your 16-digit Gmail app password (not your regular password)
              </p>
              <div className="relative mt-1">
                <input
                  id="gmailAppPassword"
                  type={gmailAppPassword ? 'password' : 'text'}
                  value={gmailAppPassword}
                  onChange={(e) => setGmailAppPassword(e.target.value)}
                  disabled={!gmailEnabled}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed pr-10"
                  placeholder="xxxx xxxx xxxx xxxx"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (gmailAppPassword) {
                      setGmailAppPassword('');
                    }
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title={gmailAppPassword ? 'Hide password' : 'Show password'}
                >
                  {gmailAppPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3.636 3.636m5.242 5.242L21.242 3.636" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                To get an app password, go to&nbsp;
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google App Passwords
                </a>&nbsp;
                and generate one. Requires 2FA enabled on your account.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={fetchMailSettings}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving || (!gmailEnabled && (!gmailUser || !gmailAppPassword))}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900">How to set up Gmail App Password</h3>
          <ol className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                1
              </span>
              <span>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">myaccount.google.com/apppasswords</a></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                2
              </span>
              <span>Sign in with your Gmail account</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                3
              </span>
              <span>Generate a new app password (select &quot;Mail&quot; as the app and &quot;Other&quot; as the device)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                4
              </span>
              <span>Copy the 16-digit password and paste it above</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                5
              </span>
              <span>Save the settings and you&apos;re done!</span>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
}
