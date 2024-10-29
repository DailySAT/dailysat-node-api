import nodeMailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';
import { ActionType } from '../types/ActionType.js';

// Function to generate the HTML content for the email
export const html = (name: string, token_list: string[], type: ActionType) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      .header-img {
        width: 75px; 
        height: 75px; 
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        font-size: 14px;
        font-weight: 600;
        color: white;
        background-color: #3b82f6; /* blue-500 */
        border-radius: 8px;
        transition-duration: 500ms;
        text-decoration: none;
      }
      .button:hover {
        background-color: #60a5fa; /* lighter blue on hover */
      }
      .code-box {
        display: inline-block;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 24px;
        color: #3b82f6; /* blue-500 */
        border: 2px solid #3b82f6;
        border-radius: 8px;
        margin-right: 8px;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb; color: #1e3a8a;"> <!-- blue-900 text -->
    <section style="padding: 24px; background-color: #ffffff;">
      <main style="margin-top: 16px;">
        <h2 style="color: #1e3a8a;">Hi ${name},</h2> <!-- blue-900 -->
        <p style="margin-top: 8px; line-height: 1.6; color: #3b82f6;"> <!-- blue-500 -->
          This is your code:
        </p>
        <div style="margin-top: 16px;">
          ${token_list.map(token => `<span class="code-box">${token}</span>`).join('')}
        </div>
        <p style="margin-top: 16px; line-height: 1.6; color: #3b82f6;">
          This code will only be valid for the next 5 minutes. It should be used to ${type} ${type === 'verify' ? "an email": "a password"}.
          If the code does not work, kindly regenerate a new code!
        </p>
        <p style="margin-top: 32px; color: #3b82f6;">
          Thanks, <br>
          DailySAT team
        </p>
      </main>
    </section>
  </body>
  </html> 
  `;
};

// Create a Nodemailer transporter using SendGrid (could be changed by simply modifying the createTransport values!)
export const transporter = nodeMailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY || ''
  })
);
