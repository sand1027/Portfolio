export function generateEmailTemplate({
  fullName,
  email,
  message,
}: {
  fullName: string;
  email: string;
  message: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          padding: 20px;
        }
        .container {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 600px;
          margin: auto;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          font-size: 20px;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .field {
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">New message from your portfolio</div>
        <div class="field"><strong>Name:</strong> ${fullName}</div>
        <div class="field"><strong>Email:</strong> ${email}</div>
        <div class="field"><strong>Message:</strong><br/>${message}</div>
      </div>
    </body>
    </html>
  `;
}
