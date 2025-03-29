interface VerifyEmailTemplateParams {
  url: string;
  name: string;
  brandColor?: string;
}

export const verifyEmailTemplate = ({ url, name, brandColor = '#2563eb' }: VerifyEmailTemplateParams) => ({
  subject: 'Action Required: Verify Your Email for Vendo',
  text: `Welcome to Vendo! Please verify your email address by clicking the following link: ${url}`,
  html: `
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email - Vendo</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            font-family: "Arial", sans-serif;
            background-color: #f9f9f9;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            background-color: ${brandColor};
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
          .header img {
            max-width: 50px;
            margin-bottom: 10px;
          }
          .header h1 {
            color: #fff;
            font-size: 24px;
            margin: 0;
            font-weight: 600;
          }
          .content {
            text-align: center;
            padding: 20px;
            background-color:#f8f8f8;
          }
          .content h2 {
            font-size: 22px;
            color: #333;
            margin-bottom: 10px;
          }
          .content p {
            font-size: 16px;
            color: #555;
            margin: 10px 0 20px;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: bold;
            background-color: ${brandColor};
            color: #fff !important;
            border-radius: 6px;
            text-decoration: none;
            margin-top: 20px;
            transition: background 0.3s ease;
          }
          .button:hover {
            background-color: darken(${brandColor}, 10%);
          }
          .footer {
            font-size: 14px;
            color: #888;
            text-align: center;
            padding: 15px;
            border-top: 1px solid #eee;
          }
          .social-links a {
            margin: 0 10px;
            text-decoration: none;
            color: ${brandColor};
            font-size: 14px;
          }
          @media (max-width: 600px) {
            .container {
              width: 90%;
              margin: 20px auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header with Logo -->
          <div class="header">
            <h1>Vendo</h1>
          </div>

          <!-- Email Content -->
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Hello, ${name}!</p>
            <p>Welcome to Vendo! To complete your registration and start using our platform, please confirm your email address by clicking the button below:</p>
            <a href="${url}" class="button">Verify Email</a>
            <p>If you didn’t create this account, please ignore this email. No further action is required.</p>
          </div>

          <!-- Footer Section -->
          <div class="footer">
            <p>Need help? <a href="https://support.diwashb.me" style="color:${brandColor};">Contact Support</a></p>
            <p class="social-links">
              <a href="https://www.linkedin.com/company/vendo">LinkedIn</a> | 
              <a href="https://twitter.com/vendo">Twitter</a> | 
              <a href="https://facebook.com/vendo">Facebook</a>
            </p>
            <p>&copy; 2025 Vendo Inc. All Rights Reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,
});
