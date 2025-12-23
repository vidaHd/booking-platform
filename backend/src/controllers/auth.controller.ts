import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { successResponse, asyncHandler } from "../helpers/response.helper";
import { sendSMS } from "../helpers/sms.helper";
import { User } from "../models/User";
import { sendEmail } from "../helpers/email.helper";

//login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { mobileNumber, password } = req.body;

  const { user, token } = await AuthService.login(mobileNumber, password);

  successResponse(res, req.t("auth.login_success"), { user, token });
});

//register user
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, familyName, mobileNumber, password, email } = req.body;

  const user = await AuthService.signup({
    name,
    familyName,
    mobileNumber,
    password,
    email,
  });

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  user.verificationCode = code;
  await user.save();

  // await sendSMS(
  //   mobileNumber,
  //   `سلام ${name} عزیز کد ورود به سایت: ${code}`
  // );

  if (email) {
    await sendEmail(
      email,
      req.t("auth.verification_code_subject"),
      req.t("auth.verification_code_email", { name, code })
    );
  }
  successResponse(res, req.t("auth.signup_success"), { user });
});

//verify code
export const vrifactionCode = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, id } = req.body;
    const user = await User.findOne({ _id: id });
    if (!user) throw new Error("User not found");

    if (user.verificationCode !== code)
      throw new Error("Reset code is invalid");

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    successResponse(res, req.t("auth.signup_success"), { user });
  }
);
