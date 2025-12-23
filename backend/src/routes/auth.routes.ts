import { Router } from "express";
import { login, signup, vrifactionCode } from "../controllers/auth.controller";
import {
  LoginUserDto,
  RegisterUserDto,
  VerfifacationCodeDto,
} from "../dto/auth.dto";
import { validationMiddleware } from "../middleware";
import { resetPassword, sendResetCode, verifyResetCode } from "../controllers/resetPassword.controller";

const router = Router();

/**
 * Authenticate user and return access token
 */
router.post("/login", validationMiddleware(LoginUserDto), login);

/**
 * Register a new user account
 */
router.post("/register", validationMiddleware(RegisterUserDto), signup);

/**
 * verify a code
 */
router.post(
  "/check-verification-code",
  validationMiddleware(VerfifacationCodeDto),
  vrifactionCode
);

router.post("/forgot-password", sendResetCode);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

export default router;
