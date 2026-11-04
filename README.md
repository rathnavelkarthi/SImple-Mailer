# Simple Bulk Mail

Email sending service with Gmail SMTP integration.

**Branding:** simple bulk mail  
**Developer:** reathanvelkarthi

## Live Demo

https://simple-mailer-setup.vercel.app

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000 to use the app.

## Setup Gmail

1. Login with Google at `/login`
2. Go to `/admin/mail/settings`
3. Enter your Gmail address and app password
4. Save settings

### Getting Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. Generate a 16-digit app password
4. Use that password in the settings

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/mail | GET | Health check |
| /api/mail | POST | Send emails |
| /api/admin/mail-settings | GET | Get Gmail settings |
| /api/admin/mail-settings | POST | Update Gmail settings |

## GitHub

https://github.com/rathnavelkarthi/SImple-Mailer
