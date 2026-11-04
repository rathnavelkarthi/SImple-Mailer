import nodemailer from 'nodemailer';

interface MailSettings {
  gmailUser: string;
  gmailAppPassword: string;
  gmailEnabled: boolean;
}

export async function sendEmail(
  settings: MailSettings,
  options: {
    from_name?: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!settings.gmailEnabled || !settings.gmailUser || !settings.gmailAppPassword) {
    return { success: false, error: 'Gmail not configured or disabled' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: settings.gmailUser,
        pass: settings.gmailAppPassword,
      },
    });

    const mailOptions = {
      from: `"simple bulk mail" <${settings.gmailUser}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || options.html?.replace(/<[^>]*>/g, '') || '',
      html: options.html || `<p>${options.text || ''}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}
