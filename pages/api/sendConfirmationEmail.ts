import nodemailer from 'nodemailer'; // Nodemailer

/**
 * Send email to user to confirm appliction was received
 */
const sendConfirmationEmail = (to: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    nodemailer
      .createTransport({
        host: process.env.NA_EMAIL_HOST as string,
        port: parseInt(process.env.NA_EMAIL_PORT as string, 10),
        auth: {
          user: process.env.NA_EMAIL_USER as string,
          pass: process.env.NA_EMAIL_PASSWORD as string,
        },
      })
      .sendMail(
        {
          to,
          // TODO: Use different email
          from: process.env.NA_EMAIL_FROM,
          subject: 'RCD Application Received',
          text: text,
          html: html,
        },
        error => {
          return error ? reject(error) : resolve();
        }
      );
  });
};

// TODO: Update email content
const text = 'Your parking permit application has been received';

// TODO: Update email content
const html = `
    <body
      style="
        background-color: #ffffff;
        text-align: center;
        font-family: Arial, sans-serif;
      "
    >
      <div
        style="
          height: 8px;
          width: 100%;
          background-color: #0B64CC;
        "
      />
      <div
        style="
          padding: 32px 32px 40px;
        "
      >
        <img
          src="https://dev.rcdrichmondapp.ca/assets/logo.png"
          style="
            height: 65px;
            width: 59px;
            margin: 0 0 20px;
          "
          alt="Richmond Centre for Disability logo"
        />
        <div>
          <h1
            style="
              color: #1A1A1A;
              font-weight: bold;
              font-size: 24px;
              line-height: 150%;
              margin: 0 0 20px;
            "
          >
            Confirmation Email
          </h1>
        </div>
      </div>
    </body>
    `;

export default sendConfirmationEmail;
