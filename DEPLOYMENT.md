# Gourmet Haus - Secure Deployment Guide

## Overview
The contact form now uses a secure serverless backend to protect the Mailsend API token. The API key is **never exposed** to the client-side code.

## Deployment Steps

### 1. Deploy to Netlify (Recommended)

#### A. Via Netlify CLI (Easiest)
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy from project directory
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Build command: (leave empty)
# - Publish directory: . (current directory)

# Deploy
netlify deploy --prod
```

#### B. Via Netlify Dashboard (Manual)
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `.` (root)
   - **Functions directory:** `netlify/functions` (auto-detected)
5. Click "Deploy site"

### 2. Configure Environment Variable

⚠️ **CRITICAL STEP** - Set the API token securely:

#### In Netlify Dashboard:
1. Go to your site → **Site settings** → **Environment variables**
2. Click "Add a variable"
3. Add:
   - **Key:** `MAILSEND_API_TOKEN`
   - **Value:** `mlsn.524a11408a6d9fa2c4be88a6785ce746c2a75bedbfdac0fa0dd7930a85ce2e46`
4. Click "Save"

#### Via Netlify CLI:
```bash
netlify env:set MAILSEND_API_TOKEN "mlsn.524a11408a6d9fa2c4be88a6785ce746c2a75bedbfdac0fa0dd7930a85ce2e46"
```

### 3. Trigger Redeploy
After setting the environment variable, trigger a new deployment:
- **Dashboard:** Site overview → Deploys → "Trigger deploy" → "Deploy site"
- **CLI:** `netlify deploy --prod`

## Security Features

### ✅ What's Secure:
- API token stored in Netlify environment variables (encrypted at rest)
- Token never exposed in client-side JavaScript
- Token never visible in browser DevTools or Network tab
- Token never committed to Git repository
- Backend validates and processes all email requests

### 🔒 How It Works:
1. User submits contact form
2. Frontend sends data to `/.netlify/functions/send-email` (serverless function)
3. Backend securely retrieves API token from environment variable
4. Backend calls Mailsend API with token
5. Backend returns success/failure to frontend (without exposing token)

## Architecture

```
Client Browser
     ↓ (form data only)
Netlify Function (/.netlify/functions/send-email)
     ↓ (API token from env + form data)
Mailsend API (https://api.mailsend.app/v1/email)
     ↓ (email sent)
Recipient Email
```

## Testing

### Local Testing (Before Deploy):
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Set local environment variable
netlify env:set MAILSEND_API_TOKEN "mlsn.524a11408a6d9fa2c4be88a6785ce746c2a75bedbfdac0fa0dd7930a85ce2e46"

# Run local dev server with functions
netlify dev

# Test form at http://localhost:8888
```

### Production Testing:
1. Visit your deployed Netlify site
2. Scroll to contact form
3. Fill in all required fields
4. Submit form
5. Verify success message appears
6. Check email at haidarihammad@gmail.com

## Files Created/Modified

### New Files:
- `netlify/functions/send-email.js` - Serverless function handling email
- `netlify.toml` - Netlify configuration
- `DEPLOYMENT.md` - This file

### Modified Files:
- `script.js` - Updated ContactFormHandler to call secure endpoint

## Troubleshooting

### Form shows "error sending message":
1. Check Netlify function logs: Site → Functions → send-email → Logs
2. Verify environment variable is set correctly
3. Ensure API token is valid
4. Check Mailsend API status

### "Server configuration error":
- Environment variable `MAILSEND_API_TOKEN` not set or misspelled

### Function not found (404):
- Ensure `netlify.toml` exists in root directory
- Check functions are deployed: Site → Functions tab

## Important Notes

1. **Never commit the API token to Git**
2. **Only set token via Netlify environment variables**
3. **Rotate token if accidentally exposed**
4. **Keep this deployment guide secure**

## Alternative: Other Serverless Platforms

If you prefer not to use Netlify, you can adapt the function for:
- **Vercel:** Convert to `/api/send-email.js` (Vercel Serverless Functions)
- **AWS Lambda:** Package as Lambda function
- **Cloudflare Workers:** Adapt to Workers syntax
- **Custom backend:** Create Node.js/Python Express/Flask API

All require setting `MAILSEND_API_TOKEN` environment variable.

## Support

For issues:
1. Check Netlify function logs
2. Verify environment variables are set
3. Test with Netlify CLI locally first
4. Contact Mailsend support if API issues persist
