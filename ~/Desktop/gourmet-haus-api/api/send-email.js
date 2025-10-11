// Vercel Serverless Function for Gourmet Haus Contact Form
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, subject, and message are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Send email using Brevo API
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'Gourmet Haus Contact Form',
          email: process.env.CONTACT_EMAIL || 'noreply@gourmethaus.com'
        },
        to: [{
          email: process.env.CONTACT_EMAIL,
          name: 'Gourmet Haus'
        }],
        subject: `Contact Form: ${subject}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #e5e4e2;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #d4af37; margin: 0;">Gourmet Haus</h1>
              <p style="color: #e5e4e2; margin-top: 10px;">New Contact Form Submission</p>
            </div>
            
            <div style="background: #2a2520; border: 1px solid #d4af37; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
              <h2 style="color: #d4af37; margin-top: 0; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Contact Details</h2>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 5px 0; color: #d4af37; font-weight: bold;">Name:</p>
                <p style="margin: 5px 0 15px 0; color: #e5e4e2;">${name}</p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 5px 0; color: #d4af37; font-weight: bold;">Email:</p>
                <p style="margin: 5px 0 15px 0; color: #e5e4e2;">${email}</p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 5px 0; color: #d4af37; font-weight: bold;">Phone:</p>
                <p style="margin: 5px 0 15px 0; color: #e5e4e2;">${phone || 'Not provided'}</p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 5px 0; color: #d4af37; font-weight: bold;">Subject:</p>
                <p style="margin: 5px 0 15px 0; color: #e5e4e2;">${subject}</p>
              </div>
              
              <div>
                <p style="margin: 5px 0; color: #d4af37; font-weight: bold;">Message:</p>
                <p style="margin: 5px 0; color: #e5e4e2; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            
            <div style="text-align: center; color: #888; font-size: 12px;">
              <p>This email was sent from the Gourmet Haus contact form</p>
              <p>© ${new Date().getFullYear()} Gourmet Haus. All rights reserved.</p>
            </div>
          </div>
        `,
        replyTo: {
          email: email,
          name: name
        }
      })
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json();
      console.error('Brevo API Error:', errorData);
      throw new Error('Failed to send email via Brevo');
    }

    return res.status(200).json({ 
      success: true,
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Error in send-email function:', error);
    return res.status(500).json({ 
      error: 'Failed to send email. Please try again later.' 
    });
  }
};
