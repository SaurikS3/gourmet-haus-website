# Gourmet Haus Website

Luxury restaurant website with serverless contact form integration.

## Quick Start

### For Local Development (Testing Contact Form)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Local Dev Server**
   ```bash
   vercel dev
   ```
   
   The site will be available at `http://localhost:3000` with full contact form functionality.

### Just Viewing the Site

Simply open `index.html` in your browser. Note: The contact form will not work without running `vercel dev` or deploying to Vercel.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions to Vercel.

## Features

- Responsive luxury design
- Animated particle system
- Interactive menu sections
- Serverless contact form with Brevo SMTP
- Mobile-optimized performance

## Tech Stack

- HTML5, CSS3, JavaScript (ES6+)
- Vercel Serverless Functions
- Nodemailer for email
- Brevo SMTP service

## Environment Variables

The contact form requires environment variables to be set. See `.env.example` for required variables.

**For local development:** Copy `.env.example` to `.env` and add your credentials.

**For production:** Set environment variables in Vercel dashboard.
