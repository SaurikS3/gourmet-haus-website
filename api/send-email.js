// Serverless function to send emails via Brevo SMTP
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { name, email, phone, message } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'All fields are required' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid email format' 
            });
        }

        // Create transporter using Brevo SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: `"Gourmet Haus Website" <${process.env.SMTP_USER}>`,
            to: process.env.RECIPIENT_EMAIL || 'haidarihammad@gmail.com',
            replyTo: email,
            subject: 'New Contact Form Submission from Gourmet Haus',
            html: `
                <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f6f0; border: 2px solid #d4af37; border-radius: 10px;">
                    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1a1a1a 0%, #2a2520 100%); border-radius: 8px; margin-bottom: 20px;">
                        <h1 style="color: #d4af37; font-size: 28px; margin: 0; letter-spacing: 0.2em;">GOURMET HAUS</h1>
                        <p style="color: #e5e4e2; font-size: 14px; letter-spacing: 0.3em; margin: 10px 0 0 0;">NEW CONTACT INQUIRY</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #d4af37; font-size: 20px; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top: 0;">Contact Details</h2>
                        
                        <div style="margin: 20px 0;">
                            <p style="margin: 10px 0;">
                                <strong style="color: #2a2520; display: inline-block; width: 100px;">Name:</strong>
                                <span style="color: #1a1a1a;">${name}</span>
                            </p>
                            <p style="margin: 10px 0;">
                                <strong style="color: #2a2520; display: inline-block; width: 100px;">Email:</strong>
                                <a href="mailto:${email}" style="color: #d4af37; text-decoration: none;">${email}</a>
                            </p>
                            <p style="margin: 10px 0;">
                                <strong style="color: #2a2520; display: inline-block; width: 100px;">Phone:</strong>
                                <a href="tel:${phone}" style="color: #d4af37; text-decoration: none;">${phone}</a>
                            </p>
                        </div>
                        
                        <h3 style="color: #d4af37; font-size: 18px; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top: 30px;">Message</h3>
                        <div style="background: #f8f6f0; padding: 20px; border-radius: 6px; border-left: 4px solid #d4af37; margin-top: 15px;">
                            <p style="color: #1a1a1a; line-height: 1.8; margin: 0; white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; padding: 15px; color: #666; font-size: 12px;">
                        <p style="margin: 5px 0;">This email was sent from the Gourmet Haus contact form</p>
                        <p style="margin: 5px 0; color: #d4af37;">◆ GOURMET HAUS ◆</p>
                    </div>
                </div>
            `,
            text: `
New Contact Form Submission from Gourmet Haus

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}

---
This email was sent from the Gourmet Haus contact form
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ 
            success: true, 
            message: 'Email sent successfully' 
        });

    } catch (error) {
        console.error('Email sending error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to send email. Please try again later.' 
        });
    }
}
