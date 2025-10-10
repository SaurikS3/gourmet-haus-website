# Gourmet Haus Email Proxy Server

## Quick Deploy to Render.com (FREE - 5 minutes)

### Step 1: Push to GitHub
```bash
cd backend-proxy
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gourmet-haus-email-proxy.git
git push -u origin main
```

### Step 2: Deploy on Render.com
1. Go to [render.com](https://render.com) and sign up (free)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo `gourmet-haus-email-proxy`
4. Configure:
   - **Name:** gourmet-haus-email-proxy
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
5. Click "Advanced" → Add Environment Variable:
   - **Key:** `MAILSEND_API_TOKEN`
   - **Value:** `mlsn.5b094bbb05af9aae7484105d7260b00dc0dd906351b0f57e7f88bff36bf19112`
6. Click "Create Web Service"

### Step 3: Get Your Proxy URL
After deployment (2-3 minutes), Render will give you a URL like:
```
https://gourmet-haus-email-proxy.onrender.com
```

### Step 4: Update Your Website
In your main website's `script.js`, update the contact form to use:
```javascript
const response = await fetch('https://YOUR-PROXY-URL.onrender.com/send-email', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, phone, message })
});
```

## Alternative: Deploy to Railway.app (FREE)

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your `gourmet-haus-email-proxy` repo
4. Add environment variable:
   - `MAILSEND_API_TOKEN` = `mlsn.5b094bbb05af9aae7484105d7260b00dc0dd906351b0f57e7f88bff36bf19112`
5. Railway will auto-deploy and give you a URL

## Why This Works

✅ **API Token Secure:** Stored in environment variables on the server
✅ **Works with GitHub Pages:** Your static site calls this proxy
✅ **Free Forever:** Render/Railway free tiers are permanent
✅ **No Code Changes Needed:** Just update the fetch URL

## Testing

Test your proxy:
```bash
curl -X POST https://YOUR-PROXY-URL.onrender.com/send-email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test message"}'
```

Expected response:
```json
{"success":true,"message":"Email sent successfully"}
