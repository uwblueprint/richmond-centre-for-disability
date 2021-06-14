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
        subject: 'Sign in to RCD APP Platform',
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
  return `
        <p>Log into RCD APP platform as ${escapedEmail} by clicking the link below:</p>
        <a href=${url}>Log into RCD</a>
    `;
};

/**
 * Render the email as text
 * @param config for text email
 * @returns email to render as text
 */
const text = (config: EmailConfig) => {
  const { url, email } = config;
  return `Sign into RCD as ${email}:\n${url}]\n\n`;
};

export default sendVerificationRequest;
