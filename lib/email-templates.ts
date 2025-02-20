export function getPasswordResetEmailHtml(resetUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <style>
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eaeaea;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Reset Your Password</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to choose a new password. This link will expire in 24 hours.</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.</p>
          <div class="footer">
            <p>This email was sent from Boma Link. If you have any questions, please contact support.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
