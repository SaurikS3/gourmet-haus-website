exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS request for CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Parse request body
        const { name, email, phone, message } = JSON.parse(event.body);

        // Basic validation
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Missing required fields' 
                })
            };
        }

        // Secure API token from environment variable
        const mailsendToken = process.env.MAILSEND_API_TOKEN;

        if (!mailsendToken) {
            console.error('MAILSEND_API_TOKEN not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Server configuration error' 
                })
            };
        }

        // Construct email body with HTML formatting
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

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Email sent successfully'
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Failed to send email'
            })
        };
    }
};
