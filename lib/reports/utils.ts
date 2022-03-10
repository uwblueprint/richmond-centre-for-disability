/* eslint-disable no-console */
import nodemailer from 'nodemailer'; // Nodemailer

/**
 * Send email to user to confirm appliction was received
 * @param to Receiver's email
 * @param firstName Receiver's first name
 */
const sendConfirmationEmail = (to: string, firstName: string): Promise<void> => {
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
          from: process.env.CONFIRMATION_EMAIL_FROM,
          subject: 'RCD Parking Permit Application Submitted',
          text: text(firstName),
          html: html(firstName),
        },
        error => {
          console.log('OTHER ERROR: ');
          console.log(error);
          return error ? reject(error) : resolve();
        }
      );
  });
};

const text = (firstName: string) => {
  return `Your Parking Permit Renewal Application was Successfully Submitted.

  Hi ${firstName},
  We’re currently reviewing your Parking Permit Renewal Application.
  We will notify you when your application has been approved and your new Parking Permit has been sent.

  If you have any questions about your application, please contact us via phone at 604-232-2404 or via email at parkingpermit@rcdrichmond.org
`;
};

const html = (firstName: string) => {
  return `
    <body
      style="
        background-color: #ffffff;
        text-align: left;
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
            display: block;
            margin-bottom: 20px;
            margin-left: auto;
            margin-right: auto;
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
              text-align: center;
            "
          >
          Your Parking Permit Renewal Application was Successfully Submitted
          </h1>
          <p
            style="
              font-size: 18px;
              line-height: 150%;
              margin: 0 0 32px;
            "
          >
          Hi ${firstName},
          <br /><br />
          We’re currently reviewing your Parking Permit Renewal Application.
          <br/>
          We will notify you when your application has been approved and your new Parking Permit has been sent.
          </p>
          <p
            style="
              color: #718096;
              font-size: 18px;
              line-height: 150%;
              margin: 32px 0 40px;
            "
          >
           If you have any questions about your application, please contact us via phone at <a href="tel:604-232-2404">604-232-2404</a> or via email at <a href="mailto:parkingpermit@rcdrichmond.org">parkingpermit@rcdrichmond.org</a>
          </p>
        </div>
      </div>
    </body>
    `;
};

export default sendConfirmationEmail;
