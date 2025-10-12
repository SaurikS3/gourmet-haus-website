# MailerSend Setup Guide for Vercel

## Overview

This guide will help you set up MailerSend as your email service provider for the Gourmet Haus contact form, deployed on Vercel.

## Why MailerSend?

- ✅ Free tier: 12,000 emails/month (400 emails/day)
- ✅ Excellent deliverability rates
- ✅ Simple API integration
- ✅ No credit card required for free tier
- ✅ Email templates and analytics
- ✅ Domain verification for better deliverability

---

## Step 1: Create MailerSend Account

1. Go to [MailerSend.com](https://www.mailersend.com/)
2. Click **"Start Free"** or **"Sign Up"**
3. Create an account using:
   - Email address
   - OR GitHub/Google login
4. Verify your email address

---

## Step 2: Get Your API Token

### 2.1 Create API Token

1. Log in to your MailerSend dashboard
2. Go to **Settings** → **API Tokens** (or click your profile icon)
3. Click **"Generate new token"**
4. Give it a name: `Gourmet Haus Contact Form`
5. Select scopes:
   - ✅ **Email** → **Full access** (allows sending emails)
6. Click **"Create token"**
7. **IMPORTANT:** Copy the token immediately - it won't be shown again!
   - Format: `mlsn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2.2 Keep Your Token Safe

```
Your API Token: mlsn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Never commit this to GitHub or share it publicly!**

---

## Step 3: Verify Your Domain (Optional but Recommended)

Verifying your domain improves email deliverability and removes the "via mailersend.net" label.

### 3.1 Add Domain

1. In MailerSend dashboard, go to **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `gourmetnhaus.com`
4. Click **"Add domain"**

### 3.2 Add DNS Records

MailerSend will provide DNS records. Add these to your domain provider (e.g., Namecheap, GoDaddy, Cloudflare):

**Example DNS Records:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | `@` or `gourmetnhaus.com` | `v=spf1 include:mailersend.net ~all` | 3600 |
| CNAME | `_mailersend` | `mailersend.verification-key.com` | 3600 |
| TXT | `_dmarc.gourmetnhaus.com` | `v=DMARC1; p=none;` | 3600 |
| CNAME | `mse1._domainkey` | `mse1.gourmetnhaus.com.dkim.mailersend.net` | 3600 |

### 3.3 Verify

1. Wait 10-30 minutes for DNS propagation
2. Go back to MailerSend → **Domains**
3. Click **"Verify domain"**
4. Status should change to **"Verified"** ✅

**Note:** You can skip domain verification and use MailerSend's default sending domain initially.

---

## Step 4: Update Vercel Serverless Function

### 4.1 Check Current API Function

Your current file: `~/Desktop/gourmet-haus-server/api/send-email.js`

Replace the entire content with this MailerSend version:

```javascript
// MailerSend API endpoint
const MAILERSEND_API = 'https://api.mailersend.com/v1/email';

module.exports = async (req, res) => {
  // Handle CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Prepare email data for MailerSend
    const emailData = {
      from: {
        email: process.env.FROM_EMAIL,
        name: 'Gourmet Haus Website'
      },
      to: [
        {
          email: process.env.TO_EMAIL,
          name: 'Gourmet Haus Team'
        }
      ],
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #d4af37;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="margin-top: 20px;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        From: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
      `
    };

    // Send email via MailerSend API
    const response = await fetch(MAILERSEND_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MAILERSEND_API_KEY}`
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('MailerSend API Error:', errorData);
      return res.status(500).json({ 
        error: 'Failed to send email',
        details: errorData.message 
      });
    }

    return res.status(200).json({ 
      success: true,
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
```

---

## Step 5: Configure Environment Variables in Vercel

### 5.1 Go to Vercel Dashboard

1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**

### 5.2 Add These Variables

Click **"Add New"** for each:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `MAILERSEND_API_KEY` | `mlsn_your_token_here` | Your MailerSend API token |
| `FROM_EMAIL` | `noreply@gourmetnhaus.com` | Sender email (use verified domain) |
| `TO_EMAIL` | `contact@gourmetnhaus.com` | Where to receive form submissions |

**Important Notes:**

- For `FROM_EMAIL`: 
  - If you verified your domain: use `noreply@gourmetnhaus.com`
  - If not verified: use `MS_xxxxxx@trial-xxxxx.mlsender.net` (MailerSend will provide this in your dashboard under **Sending Domains**)

- For `TO_EMAIL`: Use the email where you want to receive contact form messages

### 5.3 Select Environment

For each variable:
1. Enter the **Name** and **Value**
2. Check the environments:
   - ✅ **Production**
   - ✅ **Preview** (optional, for testing)
   - ✅ **Development** (optional, for local testing)
3. Click **Save**

---

## Step 6: Update the API File

### 6.1 Open Your API File

1. Open Terminal or your code editor
2. Navigate to your project:
```bash
cd ~/Desktop/gourmet-haus-server
```

3. Open the file `api/send-email.js` in your editor

### 6.2 Replace the Code

Replace the ENTIRE content of `api/send-email.js` with the MailerSend code from Step 4.1 above.

Save the file.

---

## Step 7: Deploy to Vercel

You have TWO options to deploy:

### Option A: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI (if not already installed):
```bash
npm install -g vercel
```

2. Navigate to your project:
```bash
cd ~/Desktop/gourmet-haus-server
```

3. Deploy:
```bash
vercel --prod
```

4. Follow the prompts (press Enter to accept defaults)

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your project
3. Click **"Redeploy"** button
4. Or upload your project folder if not connected

**Note:** You do NOT need GitHub. Vercel CLI can deploy directly from your computer.

---

## Step 8: Test Your Setup

### 7.1 Test from Your Website

1. Go to your deployed site: `https://gourmetnhaus.com/contact`
2. Fill out the contact form
3. Submit
4. Check for success message

### 7.2 Check Email Delivery

1. Check the `TO_EMAIL` inbox
2. You should receive the contact form submission

### 7.3 Check MailerSend Dashboard

1. Go to MailerSend → **Analytics**
2. You should see the sent email in the activity log

### 7.4 Test with cURL (Optional)

```bash
curl -X POST https://gourmetnhaus.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Submission",
    "message": "This is a test message from the contact form."
  }'
```

Expected response:
```json
{"success":true,"message":"Email sent successfully"}
```

---

## Troubleshooting

### Issue 1: "Failed to send email"

**Possible Causes:**
- Invalid API token
- FROM_EMAIL not verified
- API token doesn't have "Email" permissions

**Solutions:**
1. Verify API token is correct in Vercel environment variables
2. Check token permissions in MailerSend dashboard
3. If using custom domain, ensure it's verified
4. Try using MailerSend's trial domain instead

### Issue 2: "401 Unauthorized"

**Cause:** Invalid or missing API token

**Solution:**
1. Check `MAILERSEND_API_KEY` in Vercel
2. Regenerate token in MailerSend if needed
3. Update token in Vercel
4. Redeploy

### Issue 3: Email sent but not received

**Possible Causes:**
- Email in spam folder
- Invalid TO_EMAIL address
- Domain not verified

**Solutions:**
1. Check spam/junk folder
2. Verify TO_EMAIL in environment variables
3. Verify domain in MailerSend
4. Check MailerSend analytics for delivery status

### Issue 4: CORS Errors

**Solution:**
Ensure CORS headers are in the function (already included in code above)

### Issue 5: 404 - API Not Found

**Solutions:**
1. Ensure `api/send-email.js` is in the correct location
2. Check `vercel.json` configuration
3. Verify framework preset is **NOT** set to "Create React App"
4. Go to Settings → General → Framework Preset → Select **"Other"**

---

## Monitoring and Limits

### Free Tier Limits

- 12,000 emails per month
- 400 emails per day
- Email analytics
- Domain verification
- API access

### Check Usage

1. Go to MailerSend Dashboard
2. Click on **Billing** or **Usage**
3. Monitor your email quota

### Upgrade Options

If you exceed the free tier:
- **Growth**: $25/month for 50,000 emails
- **Premium**: $80/month for 100,000 emails
- Custom plans available

---

## Local Development

### Create .env File

Create `~/Desktop/gourmet-haus-server/.env`:

```env
MAILERSEND_API_KEY=mlsn_your_token_here
FROM_EMAIL=noreply@gourmetnhaus.com
TO_EMAIL=your-email@gmail.com
```

### Test Locally

```bash
cd ~/Desktop/gourmet-haus-server
npm install -g vercel
vercel dev
```

Then visit `http://localhost:3000/contact` to test

---

## Security Best Practices

1. ✅ Never commit `.env` file (already in `.gitignore`)
2. ✅ Use environment variables in Vercel
3. ✅ Rotate API tokens regularly
4. ✅ Use separate tokens for dev/production
5. ✅ Monitor API usage in MailerSend dashboard

---

## Summary Checklist

- [ ] Created MailerSend account
- [ ] Generated API token
- [ ] (Optional) Verified domain
- [ ] Updated `api/send-email.js` file
- [ ] Added environment variables in Vercel
- [ ] Deployed to Vercel
- [ ] Tested contact form
- [ ] Received test email

---

## Support

- **MailerSend Docs**: https://developers.mailersend.com/
- **MailerSend Support**: https://www.mailersend.com/help
- **API Reference**: https://developers.mailersend.com/api/v1/email.html

---

## Next Steps

After successful setup:

1. **Customize Email Template**: Edit the HTML in `api/send-email.js`
2. **Add Auto-Reply**: Send a confirmation email back to the user
3. **Set Up Email Templates**: Create templates in MailerSend dashboard
4. **Monitor Analytics**: Track email performance
5. **Configure Webhooks**: Get notified about delivery, opens, clicks

Your contact form is now powered by MailerSend! 🚀
