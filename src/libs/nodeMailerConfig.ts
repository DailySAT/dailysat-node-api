import nodeMailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';

type ActionType = "verify" | "reset";

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
          background-color: #14b8a6;
          border-radius: 8px;
          transition-duration: 500ms;
          text-decoration: none;
        }
        .button:hover {
          background-color: #14ebd8;
        }
        .code-box {
          display: inline-block;
          width: 40px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          font-size: 24px;
          color: #14b8a6;
          border: 2px solid #14b8a6;
          border-radius: 8px;
          margin-right: 8px;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb; color: #374151;">
      <section style="padding: 24px; background-color: #ffffff;">
        <header style="text-align: center;">
          <a href="#">
            <img class="header-img" src="https://media.licdn.com/dms/image/D4E0BAQGz_s94H2rYlw/company-logo_200_200/0/1722302677147/cyclevend_logo?e=1730332800&v=beta&t=CtsuMWOysXkXx0VJIrxdCsEU2BoekEm2NWqTmVKZasM" alt="CycleVend Logo">
          </a>
        </header>

        <main style="margin-top: 16px;">
          <h2 style="color: #4b5563;">Hi ${name},</h2>
          <p style="margin-top: 8px; line-height: 1.6; color: #6b7280;">
            This is your code:
          </p>
          <div style="margin-top: 16px;">
            ${token_list.map(token => `<span class="code-box">${token}</span>`).join('')}
          </div>
          <p style="margin-top: 16px; line-height: 1.6; color: #6b7280;">
            This code will only be valid for the next 5 minutes. It should be used to ${type} ${type === 'verify' ? "an email": "a password"}
            If the code does not work, kindly regenerate a new code!
          </p>
          <p style="margin-top: 32px; color: #6b7280;">
            Thanks, <br>
            CycleVend team
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
