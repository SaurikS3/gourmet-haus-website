# Gourmet Haus - Deployment Instructions

## Overview
This website uses Vercel serverless functions to handle contact form submissions via Brevo SMTP.

## Prerequisites
- Node.js 18.x or higher
- Vercel CLI (optional, for local testing)
- GitHub account (for version control)
- Vercel account (for deployment)

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Then edit `.env` and add your actual Brevo credentials:
- `SMTP_HOST`: smtp-relay.brevo.com
- `SMTP_PORT`: 587
- `SMTP_USER`: Your Brevo SMTP user
- `SMTP_PASS`: Your Brevo SMTP password
- `RECIPIENT_EMAIL`: Email where form submissions should be sent
- `BREVO_API_KEY`: Your Brevo API key (optional)

**IMPORTANT**: The `.env` file is excluded from git via `.gitignore` for security.

### 3. Test Locally (Optional)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Run local development server
vercel dev
```

This will start a local server at `http://localhost:3000` where you can test the contact form.

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. **Login to Vercel**
```bash
vercel login
```

2. **Deploy to Production**
```bash
vercel --prod
```

3. **Set Environment Variables**
After deployment, add environment variables in Vercel dashboard:
- Go to your project settings
- Navigate to "Environment Variables"
- Add each variable from `.env` file:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `RECIPIENT_EMAIL`
  - `BREVO_API_KEY`

### Option 2: Deploy via GitHub Integration

1. **Push to GitHub**
```bash
git add .
git commit -m "Setup Brevo SMTP integration"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Configure Environment Variables**
   - In project settings, add all environment variables from `.env`
   - Deploy the project

4. **Custom Domain (Optional)**
   - In project settings, go to "Domains"
   - Add your custom domain: `gourmethaus.com`
   - Update DNS records as instructed by Vercel

## Testing the Deployment

1. Visit your deployed website
2. Navigate to the contact form section
3. Fill out all fields:
   - Name
   - Email
   - Phone
   - Message
4. Click "Send Message"
5. You should see a success message
6. Check `haidarihammad@gmail.com` for the email

## Troubleshooting

### Form Not Submitting
- Check browser console for errors
- Verify environment variables are set in Vercel
- Check Vercel function logs for errors

### Emails Not Received
- Verify Brevo SMTP credentials are correct
- Check Brevo account status and sending limits
- Look for errors in Vercel function logs
- Verify `RECIPIENT_EMAIL` is set correctly

### CORS Errors
- The API endpoint already has CORS headers configured
- Ensure you're accessing via the correct domain

## File Structure

```
Gourmet Haus/
├── api/
│   └── send-email.js       # Serverless function for email
├── .env                     # Environment variables (not in git)
├── .env.example            # Template for environment variables
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
├── vercel.json             # Vercel configuration
├── index.html              # Main website
├── script.js               # Frontend JavaScript
├── styles.css              # Styling
└── DEPLOYMENT.md           # This file
```

## Security Notes

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Environment variables in Vercel** - Always use Vercel's environment variable system for production
3. **API Key rotation** - Consider rotating Brevo API keys periodically
4. **Rate limiting** - Consider implementing rate limiting on the API endpoint

## Support

For issues or questions:
- Check Vercel function logs
- Review Brevo account dashboard
- Verify all environment variables are set correctly

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Brevo API Documentation](https://developers.brevo.com/)
- [Nodemailer Documentation](https://nodemailer.com/)
