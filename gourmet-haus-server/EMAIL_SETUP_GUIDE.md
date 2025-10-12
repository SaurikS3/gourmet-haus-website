# Email Setup Guide: SMTP vs API on Vercel

## Overview

There are two main approaches to sending emails from a Vercel serverless function:

1. **SMTP (Simple Mail Transfer Protocol)** - Direct email server connection
2. **API (Application Programming Interface)** - Using third-party email service APIs

## Comparison

### SMTP Approach

**Pros:**
- Direct control over email sending
- Works with any email provider that supports SMTP
- No API rate limits from third parties
- Can use your own email server

**Cons:**
- Slower (establishes connection each time)
- More complex authentication
- May require additional npm packages (`nodemailer`)
- SMTP ports often blocked in serverless environments
- Less reliable in Vercel's serverless context

### API Approach (RECOMMENDED)

**Pros:**
- ✅ Faster execution
- ✅ Built for serverless environments
- ✅ Better deliverability and analytics
- ✅ Uses native `fetch` (no extra packages needed)
- ✅ More reliable in Vercel

**Cons:**
- Depends on third-party service
- May have API rate limits (usually generous on free tier)
- Requires API key management

## Current Implementation (API Approach with Brevo)

Your current setup uses **Brevo's API**, which is the recommended approach for Vercel.

### How It Works

```
User fills form → React app → Vercel Function → Brevo API → Email sent
```

### File Structure

```
gourmet-haus-server/
├── api/
│   └── send-email.js          # Vercel serverless function
├── src/
│   └── components/
│       └── ContactPage.js      # React form component
├── vercel.json                 # Vercel configuration
└── package.json                # Project dependencies
```

## Setup Instructions for Vercel

### Step 1: Verify API Function File

Your current `api/send-email.js` should look like this:

```javascript
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;
  
  // Call Brevo API
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { email: process.env.CONTACT_EMAIL },
      to: [{ email: process.env.CONTACT_EMAIL }],
      subject: `Contact: ${subject}`,
      htmlContent: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`
    })
  });
  
  if (response.ok) {
    return res.status(200).json({ success: true });
  }
  
  return res.status(500).json({ error: 'Failed to send' });
};
```

### Step 2: Configure Environment Variables in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project: `gourmet-haus-production`
3. Click **Settings** → **Environment Variables**
4. Add these variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `BREVO_API_KEY` | `xkeysib-your-api-key-here` | Production |
| `CONTACT_EMAIL` | `your-email@domain.com` | Production |

5. Click **Save**

### Step 3: Verify vercel.json Configuration

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Step 4: Ensure Proper Framework Settings

In Vercel Dashboard:
1. **Settings** → **General** → **Build & Development Settings**
2. **Framework Preset**: Select **"Other"** (not Create React App)
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`
5. **Install Command**: `npm install`

### Step 5: Deploy

After making changes:
1. Commit and push to GitHub
2. Or click **Redeploy** in Vercel Dashboard → Deployments

## Troubleshooting

### Issue: API Returns 404

**Possible Causes:**
1. Vercel isn't detecting the `/api` folder
2. Framework preset set to "Create React App" (treats as static only)
3. File naming issue (must be `/api/send-email.js` not `/api/send-email/index.js`)

**Solutions:**
- Change Framework Preset to "Other"
- Ensure `/api` folder is at project root
- Check deployment logs in Vercel dashboard
- Verify `vercel.json` exists and is committed

### Issue: CORS Errors

**Solution:**
Add CORS headers in the function:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

### Issue: Environment Variables Not Working

**Solutions:**
1. Verify variables are set in Vercel Dashboard
2. Ensure they're assigned to "Production" environment
3. Redeploy after adding variables
4. Check for typos in variable names (case-sensitive)

## Alternative: SMTP Setup (Not Recommended for Vercel)

If you want to use SMTP instead:

### Install Nodemailer

```bash
npm install nodemailer
```

### Create SMTP Function

```javascript
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: req.body.subject,
      html: `<p>${req.body.message}</p>`
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
```

### Environment Variables for SMTP

```
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=recipient@domain.com
```

**Note:** Gmail requires an "App Password" if using 2FA.

## Testing the API

### Using curl

```bash
curl -X POST https://your-project.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Test message"
  }'
```

### Expected Response

Success:
```json
{"success": true, "message": "Email sent successfully"}
```

Error:
```json
{"error": "Failed to send email. Please try again later."}
```

## Recommended Email Services for API Approach

1. **Brevo (formerly Sendinblue)** ✅ Current choice
   - Free tier: 300 emails/day
   - Great API documentation
   - Good deliverability

2. **SendGrid**
   - Free tier: 100 emails/day
   - Very reliable

3. **Mailgun**
   - Free tier: 5,000 emails/month
   - Developer-friendly

4. **Amazon SES**
   - Pay-as-you-go
   - $0.10 per 1,000 emails
   - Requires AWS account

## Summary

✅ **Use API Approach (Brevo)** - Currently implemented  
❌ **Avoid SMTP** - Not ideal for Vercel serverless functions

Your current setup is correct in principle. The issue is with Vercel deployment configuration, not the email approach itself.
