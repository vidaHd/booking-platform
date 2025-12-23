import { Request, Response } from "express";
import { User } from "../models/User";
import { sendEmail } from "../helpers/email.helper";
import bcrypt from "bcrypt";

const verificationCodes: Record<string, string> = {};

export const sendResetCode = async (req: Request, res: Response) => {
  const { mobileNumber } = req.body;
  const user = await User.findOne({ mobileNumber });
  if (!user)
    return res.status(404).json({ message: req.t("auth.user_not_found") });

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  verificationCodes[mobileNumber] = code;

  // await sendSMS(mobileNumber, req.t("auth.sms_code_message", { code }));
    await sendEmail(
      user.email,
      req.t("auth.verification_code_subject"),
      req.t("auth.verification_code_email", { code })
    );
  res.json({ message: req.t("auth.verification_code_sent") });
};

export const verifyResetCode = async (req: Request, res: Response) => {
  const { mobileNumber, code } = req.body;
  if (verificationCodes[mobileNumber] === code) {
    res.json({ message: req.t("auth.code_verified") });
  } else {
    res.status(400).json({ message: req.t("auth.invalid_code") });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { mobileNumber, newPassword } = req.body;
  const user = await User.findOne({ mobileNumber });
  if (!user)
    return res.status(404).json({ message: req.t("auth.user_not_found") });

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  delete verificationCodes[mobileNumber];
  res.json({ message: req.t("auth.password_reset_success") });
};
