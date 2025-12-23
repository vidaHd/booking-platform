import fs from "fs";
import { Router } from "express";
import multer from "multer";
import { profileController } from "../controllers/profile.controller";

const router = Router();

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/profile/:id", profileController.getProfile);

router.post(
  "/updateProfile/:id",
  upload.single("avatar"),
  profileController.updateProfile
);

export default router;
