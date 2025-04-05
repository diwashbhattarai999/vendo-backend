export const blockedLoginTemplate = (minutesBlocked: number, resetUrl: string, brandColor: string = '#DC2626') => ({
  subject: 'We’ve Temporarily Paused Login Attempts to Your Account',
  text: `We've noticed multiple unsuccessful login attempts to your Vendo account. For your safety, further login attempts have been paused for the next ${minutesBlocked} minutes. If you forgot your password, you can reset it here: ${resetUrl}`,
  html: `
    <html><head><style>
      body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); }
      .header { background-color: ${brandColor}; font-size: 24px; font-weight: bold; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
      .content { padding: 20px; text-align: center; }
      .content h1 { font-size: 22px; color: #222222; }
      .content p { font-size: 16px; color: #555555; margin: 10px 0 20px; line-height: 1.5; }
      .button { display: inline-block; padding: 12px 20px; font-size: 16px; font-weight: bold; background-color: ${brandColor}; color: #ffffff !important; border-radius: 5px; text-decoration: none; margin-top: 10px; }
      .timer { font-size: 18px; font-weight: bold; color: ${brandColor}; margin: 10px 0; }
      .footer { font-size: 14px; color: #999999; text-align: center; padding: 20px; }
    </style></head><body>
      <div class="container">
        <div class="header">Vendo Login Alert</div>
        <div class="content">
          <h1>Unusual Login Activity Detected</h1>
          <p>We noticed multiple unsuccessful login attempts to your Vendo account.</p>
          <p>As a safety measure, further login attempts have been temporarily paused.</p>
          <p class="timer">Please wait ${minutesBlocked} minute${minutesBlocked > 1 ? 's' : ''} before trying again.</p>
          <p>If you forgot your password, you can reset it below:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>If you weren’t trying to log in, no worries—you can ignore this email. But if this seems suspicious, we recommend updating your password just in case.</p>
        </div>
        <div class="footer">
          <p>Need help? Reach out to us anytime at support@vendo.com</p>
        </div>
      </div>
    </body></html>
  `,
});
