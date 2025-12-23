import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "h.vida4471@gmail.com",
    pass: "gnxn adaz ldgt rqhv",
  },
});

export const sendEmail = async (to?: string, subject?: string, text?: string) => {
  const mailOptions = {
    from: '"Bookit App" <h.vida4471@gmail.com>',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(" Email sent successfully to:", to);
  } catch (err) {
    console.error(" Email sending failed:", err);
    throw new Error("Email sending failed");
  }
};
