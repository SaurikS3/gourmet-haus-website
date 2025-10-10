// Simple Express server to proxy Mailsend API requests
// This keeps your API token secure on the server side
// Deploy this to Render.com or Railway.app (both free tier available)

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your domain
app.use(cors({
    origin: ['https://gourmetnhaus.com', 'https://sauriks3.github.io', 'http://localhost:3000'],
    methods: ['POST'],
    credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'Email proxy server running' });
});

// Email sending endpoint
app.post('/send-email', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Get secure API token from environment variable
        const mailsendToken = process.env.MAILSEND_API_TOKEN;

        if (!mailsendToken) {
            console.error('MAILSEND_API_TOKEN not configured');
            return res.status(500).json({
                success: false,
                error: 'Server configuration error'
            });
        }

        // Construct email body
        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
                    New Contact Form Submission - Gourmet Haus
                </h2>
                <div style="margin: 20px 0;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <div style="background: #f8f6f0; padding: 15px; border-left: 4px solid #d4af37; margin: 20px 0;">
                    <h3 style="color: #2a2520; margin-top: 0;">Message:</h3>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #666; font-size: 12px;">
                    This email was sent from the Gourmet Haus contact form.
                </p>
            </div>
        `;

        // Call Mailsend API
        const response = await fetch('https://api.mailsend.app/v1/email', {
            method: 'POST',
            headers: {
                'X-API-Key': mailsendToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: {
                    email: 'haidarihammad@gmail.com',
                    name: 'Gourmet Haus'
                },
                from: {
                    email: 'contact@gourmethaus.com',
                    name: 'Gourmet Haus Website'
                },
                reply_to: {
                    email: email,
                    name: name
                },
                subject: `New Contact Form Message from ${name}`,
                html: emailBody,
                text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Mailsend API error:', errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        res.json({
            success: true,
            message: 'Email sent successfully'
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send email'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Email proxy server running on port ${PORT}`);
});
