import nodemailer from 'nodemailer'; // Nodemailer
import { SendVerificationRequest } from 'next-auth/providers'; // Send verification request type

/**
 * Send email to user for verifying login request
 */
const sendVerificationRequest: SendVerificationRequest = ({
  identifier: email,
  url,
  provider: { server, from },
}) => {
  return new Promise((resolve, reject) => {
    nodemailer.createTransport(server).sendMail(
      {
        to: email,
        from,
        subject: 'Your temporary RCD APP Administration Portal login',
        text: text({ email, url }),
        html: html({ email, url }),
      },
      error => {
        return error ? reject(error) : resolve();
      }
    );
  });
};

/**
 * Input type definition for HTML and text email rendering
 */
type EmailConfig = {
  readonly url: string;
  readonly email: string;
};

/**
 * Render the email as HTML
 * @param config for HTML email
 * @returns email to render as HTML
 */
const html = (config: EmailConfig) => {
  const { url, email } = config;

  // Escape email hyperlink formatting
  const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`;

  // HTML email template
  // TODO: Replace logo URL with production URL
  return `
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
            Login
          </h1>
          <p
            style="
              font-size: 18px;
              line-height: 150%;
              margin: 0 0 32px;
            "
          >
            Click the button below to authenticate as ${escapedEmail}
            <br />
            and sign into RCD APP Administration Portal.
          </p>
          <a
            href="${url}"
            style="
              background-color: #0B64CC;
              color: #ffffff;
              padding: 12px 24px;
              border-radius: 6px;
              font-size: 18px;
              font-weight: 600;
              line-height: 150%;
              text-decoration: none;
            "
          >
            Log into RCD APP Administration Portal
          </a>
          <p
            style="
              color: #718096;
              font-size: 18px;
              line-height: 150%;
              margin: 32px 0 40px;
            "
          >
            If you did not try to log in, you can safely ignore this email.
          </p>
        </div>
      </div>
    </body>
    `;
};

/**
 * Render the email as text
 * @param config for text email
 * @returns email to render as text
 */
const text = (config: EmailConfig) => {
  const { url, email } = config;
  return `Log into RCD APP Administration Portal as ${email}:\n${url}]\n\n`;
};

export default sendVerificationRequest;
