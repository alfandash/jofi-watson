'use strict';
const nodemailer = require('nodemailer');


var sendEmail = (email, listJob, cb) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "jofisijobfinder@gmail.com", // generated ethereal user
        pass: "hackersejati"  // generated ethereal password
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: 'jofisijobfinder@gmail.com', // sender address
      to: email.toLowerCase(), // list of receivers
      subject: 'Lowongan Pekerjaan Hasil Pencarian', // Subject line
      // text: 'Hello world?', // plain text body
      html: `
      <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <meta charset="utf-8">
  <!-- utf-8 works for most cases -->
  <meta name="viewport" content="width=device-width">
  <!-- Forcing initial-scale shouldn't be necessary -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!-- Use the latest (edge) version of IE rendering engine -->
  <meta name="x-apple-disable-message-reformatting">
  <!-- Disable auto-scale in iOS 10 Mail entirely -->
  <title></title>
  <style>
    /* What it does: Remove spaces around the email design added by some email clients. */
    /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */

    html,
    body {
      margin: 0 auto !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
    }
    /* What it does: Stops email clients resizing small text. */

    * {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    /* What it does: Centers email on Android 4.4 */

    div[style*="margin: 16px 0"] {
      margin: 0 !important;
    }
    /* What it does: Stops Outlook from adding extra spacing to tables. */

    table,
    td {
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
    }
    /* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */

    table {
      border-spacing: 0 !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      margin: 0 auto !important;
    }

    table table table {
      table-layout: auto;
    }
    /* What it does: Uses a better rendering method when resizing images in IE. */

    img {
      -ms-interpolation-mode: bicubic;
    }
    /* What it does: A work-around for email clients meddling in triggered links. */

    *[x-apple-data-detectors],
    /* iOS */

    .x-gmail-data-detectors,
    /* Gmail */

    .x-gmail-data-detectors *,
    .aBn {
      border-bottom: 0 !important;
      cursor: default !important;
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
    /* What it does: Prevents Gmail from displaying an download button on large, non-linked images. */

    .a6S {
      display: none !important;
      opacity: 0.01 !important;
    }
    /* If the above doesn't work, add a .g-img class to any image in question. */

    img.g-img+div {
      display: none !important;
    }
    /* What it does: Prevents underlining the button text in Windows 10 */

    .button-link {
      text-decoration: none !important;
    }
    /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
    /* Create one of these media queries for each additional viewport size you'd like to fix */
    /* Thanks to Eric Lepetit (@ericlepetitsf) for help troubleshooting */

    @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
      /* iPhone 6 and 6+ */
      .email-container {
        min-width: 375px !important;
      }
    }
  </style>
  <!-- CSS Reset : END -->

  <!-- Progressive Enhancements : BEGIN -->
  <style>
    /* What it does: Hover styles for buttons */

    .button-td,
    .button-a {
      transition: all 100ms ease-in;
    }

    .button-td:hover,
    .button-a:hover {
      background: #555555 !important;
      border-color: #555555 !important;
    }
    /* Media Queries */

    @media screen and (max-width: 600px) {

      /* What it does: Adjust typography on small screens to improve readability */
      .email-container p {
        font-size: 17px !important;
        line-height: 22px !important;
      }
    }
  </style>
  <!-- Progressive Enhancements : END -->

</head>

<body width="100%" bgcolor="#222222" style="margin: 0; mso-line-height-rule: exactly;">
  <center style="width: 100%; background: #222222; text-align: left;">
    <div style="max-width: 600px; margin: auto;" class="email-container">


      <!-- Email Body : BEGIN -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
        <!-- 1 Column Text + Button : BEGIN -->
        <tr>
          <td bgcolor="#ffffff">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              ${listJob.map((job) => {
                return `
                <tr>
                <td style="padding: 40px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;">
                  <p style="margin: 0;">${job.title}</p>
                  <p style="margin: 0;">Lokasi: ${job.location}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 40px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;">
                  <!-- Button : BEGIN -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: auto;">
                    <tr>
                      <td style="border-radius: 3px; background: #222222; text-align: center;" class="button-td">
                        <a href="${job.link}" style="background: #222222; border: 15px solid #222222; font-family: sans-serif; font-size: 13px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;"
                          class="button-a">
                                                    <span style="color:#ffffff;" class="button-link">&nbsp;&nbsp;&nbsp;&nbsp;Apply Job&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                </a>
                      </td>
                    </tr>
                  </table>
                  <!-- Button : END -->
                </td>
              </tr>
                `
              })}
              <tr>
                <td style="padding: 40px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;">
                  
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- 1 Column Text + Button : END -->

      <!-- Email Footer : BEGIN -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px; font-family: sans-serif; color: #888888; line-height:18px;">
        <tr>
          <td style="padding: 40px 10px;width: 100%;font-size: 12px; font-family: sans-serif; line-height:18px; text-align: center; color: #888888;"
            class="x-gmail-data-detectors">
            <br><br> JoFi: Si Job Finder <br> <br>Hacktiv8 Jakarta
            <br><br>
          </td>
        </tr>
      </table>
      <!-- Email Footer : END -->

      <!--[if mso]>
            </td>
            </tr>
            </table>
            <![endif]-->
    </div>

  </center>
</body>

</html>


      ` // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        cb(error)
        return console.log(error);
      }

      cb ({
        success: 'email landing',
        messageId: info.messageId
      })

      console.log('Message sent: %s', info.messageId);
      
    });
  });

}


module.exports = sendEmail