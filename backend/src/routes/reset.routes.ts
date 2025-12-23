import { Router } from "express";
import { resetPasswordController } from "../controllers/changePassword.controller";
import { validationMiddleware } from "../middleware";
import { RequestResetPasswordDto } from "../dto/reset-password.dto";

const router = Router();

/**
 * Request a password reset (sends reset code/email)
 */
router.post(
  "/request-reset-password",
  resetPasswordController.requestResetPassword
);

/**
 * Verify reset code and allow password change
 */
router.post(
  "/check-reset-password",
  resetPasswordController.checkResetPassword
);

export default router;
