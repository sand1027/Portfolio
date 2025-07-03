import { config } from "@/data/config";
import { z } from "zod";
import nodemailer from "nodemailer";

const Email = z.object({
  fullName: z.string().min(2, "Full name is invalid!"),
  email: z.string().email({ message: "Email is invalid!" }),
  message: z.string().min(10, "Message is too short!"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = Email.safeParse(body);
    if (!parsed.success) {
      const errorMessages = parsed.error.errors.map((e) => e.message);
      return Response.json({ error: errorMessages }, { status: 400 });
    }

    const { fullName, email, message } = parsed.data;

    // HTML template embedded here
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>New Contact Message</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f9fafb; font-family:Inter, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 2rem 1rem;">
            <tr>
              <td align="center">
                <table width="100%" style="max-width:600px; background-color:#ffffff; border-radius:8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background-color:#4f46e5; color:#ffffff; padding:1.5rem; text-align:center;">
                      <h1 style="margin:0; font-size:1.5rem; font-weight:700;">📬 New Message from Portfolio</h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:2rem; color:#111827;">
                      <h2 style="margin-top:0; margin-bottom:1rem; font-size:1.25rem; font-weight:600; color:#1f2937;">Contact Details</h2>
                      
                      <p style="margin:0.5rem 0; font-size:1rem;">
                        <strong style="color:#374151;">Full Name:</strong><br/>
                        ${fullName}
                      </p>

                      <p style="margin:0.5rem 0; font-size:1rem;">
                        <strong style="color:#374151;">Email:</strong><br/>
                        ${email}
                      </p>

                      <p style="margin:0.5rem 0; font-size:1rem;">
                        <strong style="color:#374151;">Message:</strong><br/>
                        ${message.replace(/\n/g, "<br/>")}
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#f3f4f6; padding:1rem; text-align:center; font-size:0.75rem; color:#6b7280;">
                      This message was sent from your portfolio contact form.
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // use true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: config.email || process.env.RECEIVER_EMAIL,
      subject: "New Contact Message from Portfolio",
      html: htmlTemplate,
    });

    return Response.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Email send error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
