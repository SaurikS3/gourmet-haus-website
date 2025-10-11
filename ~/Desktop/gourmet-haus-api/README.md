# Gourmet Haus API

Serverless API for Gourmet Haus contact form using Vercel and Brevo.

## Structure

```
gourmet-haus-api/
├── api/
│   └── send-email.js    # Serverless function
├── package.json         # Project metadata
├── vercel.json          # Vercel configuration
└── README.md            # This file
```

## Deployment

### 1. Create GitHub Repository

```bash
gh repo create gourmet-haus-api --public --source=. --remote=origin --push
```

Or manually:
1. Go to https://github.com/new
2. Create repository: `gourmet-haus-api`
3. Push this code

### 2. Deploy to Vercel

1. Go to https://vercel.com/new
2. Import from GitHub: `gourmet-haus-api`
3. Leave all settings as default
4. Click **Deploy**

### 3. Add Environment Variables

After deployment:
1. Go to Project Settings → Environment Variables
2. Add these variables:
   - `BREVO_API_KEY`: Your Brevo API key
   - `CONTACT_EMAIL`: Email to receive contact form submissions
3. Redeploy

## API Endpoint

Once deployed, the API will be available at:

```
https://your-project.vercel.app/api/send-email
```

## Testing

```bash
curl -X POST https://your-project.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "555-1234",
    "subject": "Test",
    "message": "Test message"
  }'
```

## Usage in React App

Update your React app's `.env` file:

```
REACT_APP_API_URL=https://your-project.vercel.app/api/send-email
```

## Environment Variables Required

- `BREVO_API_KEY`: Your Brevo API key (get from https://app.brevo.com/settings/keys/api)
- `CONTACT_EMAIL`: Email address to receive contact form submissions
