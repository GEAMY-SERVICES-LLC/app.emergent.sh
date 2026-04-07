export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !service || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email, service, message' });
  }

  const tenantId     = process.env.MS_TENANT_ID;
  const clientId     = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  const fromEmail    = process.env.MS_FROM_EMAIL  || 'bot@geamyservices.com';
  const toEmail      = process.env.RECIPIENT_EMAIL || 'bot@geamyservices.com';

  if (!tenantId || !clientId || !clientSecret) {
    console.warn('Microsoft Graph credentials not configured — email skipped');
    return res.status(202).json({
      message: "Thank you for contacting us. We'll get back to you soon.",
      status: 'received',
      email_sent: false,
    });
  }

  try {
    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          scope: 'https://graph.microsoft.com/.default',
        }),
      }
    );

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error('MS Graph token error:', tokenData.error_description || tokenData);
      return res.status(202).json({
        message: "Thank you for contacting us. We'll get back to you soon.",
        status: 'received',
        email_sent: false,
      });
    }

    const htmlBody = `
      <html><body style="font-family:monospace;background:#f5f5f5;padding:20px">
      <div style="max-width:600px;margin:0 auto;background:#fff;padding:20px;border-radius:4px">
        <div style="background:#040810;color:#00d4ff;padding:20px;text-align:center;margin-bottom:20px">
          <h2 style="margin:0">New Contact Form Submission</h2>
          <p style="margin:4px 0 0">Geamy Services LLC</p>
        </div>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <p style="background:#f9f9f9;padding:12px">${message.replace(/\n/g, '<br>')}</p>
        <div style="margin-top:20px;font-size:11px;color:#999;text-align:center">
          Sent automatically from geamyservices.com
        </div>
      </div></body></html>
    `;

    const emailRes = await fetch(
      `https://graph.microsoft.com/v1.0/users/${fromEmail}/sendMail`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            subject: `New Contact: ${service} — ${name}`,
            body: { contentType: 'HTML', content: htmlBody },
            toRecipients: [{ emailAddress: { address: toEmail } }],
            replyTo: [{ emailAddress: { address: email, name } }],
          },
          saveToSentItems: true,
        }),
      }
    );

    if (emailRes.status === 202) {
      return res.status(202).json({
        message: "Thank you for contacting us. We'll get back to you soon.",
        status: 'received',
        email_sent: true,
      });
    } else {
      const errData = await emailRes.json().catch(() => ({}));
      console.error('Graph sendMail error:', JSON.stringify(errData));
      return res.status(202).json({
        message: "Thank you for contacting us. We'll get back to you soon.",
        status: 'received',
        email_sent: false,
      });
    }
  } catch (err) {
    console.error('Unexpected error sending email:', err);
    return res.status(202).json({
      message: "Thank you for contacting us. We'll get back to you soon.",
      status: 'received',
      email_sent: false,
    });
  }
}
