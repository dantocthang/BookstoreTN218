import nodeMailer from "nodemailer";

function SMail(to, subject, htmlContent) {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "dien060620010@gmail.com",
      pass: "wdzfwrtdpyzdolij",
    },
  });

  const mailOptions = {
    from: "dien060620010@gmail.com",
    to: to,
    subject: subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

export default SMail;