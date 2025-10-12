# Vercel Deployment Guide - Step by Step

## What You're Deploying
A serverless API function that securely handles email sending for your contact form.

---

## Step 1: Create Vercel Account (if you don't have one)

1. Go to: **https://vercel.com/signup**
2. Click "Continue with GitHub" (easiest option)
3. Authorize Vercel to access your GitHub account
4. Complete the signup process

---

## Step 2: Import Your Repository

1. Go to: **https://vercel.com/new**
2. Click "Add GitHub Account" if not already connected
3. In the search box, find: **gourmet-haus-server-production**
4. Click "Import" next to your repository

---

## Step 3: Configure Project Settings

On the configuration screen:

1. **Project Name**: `gourmet-haus-server` (or whatever you prefer)
2. **Framework Preset**: Leave as "Other" or select "Create React App"
3. **Root Directory**: `./` (leave as default)
4. **Build Command**: Leave empty or use `npm run build`
5. **Output Directory**: `build`
6. **Install Command**: Leave default

**DO NOT CLICK DEPLOY YET** - we need to add environment variables first!

---

## Step 4: Add Environment Variables

Still on the same configuration page:

1. Scroll down to **"Environment Variables"** section
2. Click to expand it

### Add First Variable:
- **Name**: `BREVO_API_KEY`
- **Value**: Your new Brevo API key (paste it here)
- Click "Add"

### Add Second Variable:
- **Name**: `CONTACT_EMAIL`
- **Value**: `haidarihammad@gmail.com`
- Click "Add"

---

## Step 5: Deploy

1. Now click the big **"Deploy"** button
2. Wait 2-3 minutes for deployment to complete
3. You'll see a success screen with confetti 🎉

---

## Step 6: Get Your API URL

1. On the success screen, you'll see your deployment URL
2. It will look like: `https://gourmet-haus-server-xxx.vercel.app`
3. **COPY THIS URL** - you'll need it

Your API endpoint will be: `https://your-url.vercel.app/api/send-email`

---

## Step 7: Test Your API (Optional but Recommended)

1. Go to your Vercel project dashboard
2. Click on your deployment
3. Click "Functions" tab
4. You should see `api/send-email.js` listed
5. Click on it to see logs and test it

---

## Step 8: Update Your React App

Now you need to tell your React app where the API is:

### Option A: Add to .env file
Open `~/Desktop/gourmet-haus-server/.env` and add:
```
REACT_APP_API_URL=https://your-vercel-url.vercel.app/api/send-email
```
(Replace with your actual URL)

### Option B: I can do this for you
Just tell me your Vercel URL and I'll update the files.

---

## Step 9: Rebuild and Redeploy Website

After updating the .env file:

1. Rebuild: `cd ~/Desktop/gourmet-haus-server && npm run build`
2. Copy build files to website repo
3. Push to GitHub
4. Wait for GitHub Pages to update (1-2 minutes)

---

## Step 10: Test the Contact Form

1. Go to your live website
2. Navigate to the Contact page
3. Fill out the form
4. Submit
5. Check your email at haidarihammad@gmail.com

---

## Troubleshooting

### If email doesn't send:
1. Check Vercel function logs (in Vercel dashboard)
2. Verify environment variables are set correctly
3. Make sure your Brevo API key is valid
4. Check browser console for errors

### If you get CORS errors:
1. Go to Vercel dashboard
2. Click on your project
3. Go to Settings > Environment Variables
4. Verify both variables are there

---

## Need Help?

Tell me:
1. What step you're on
2. What error you're seeing (if any)
3. Your Vercel deployment URL (once you have it)

And I'll help you fix it!
