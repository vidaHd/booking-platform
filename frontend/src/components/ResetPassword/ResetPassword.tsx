import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import { useAppContext } from "../../context/LanguageContext";
import { ButtonUI } from "../../ui-kit";
import { buttonType, VariantType } from "../../ui-kit/button/button.type";
import { useApiMutation } from "../../api/apiClient";
import { showNotification } from "../../utils/showNotification"; // فرض بر این است که دارید از این تابع برای نوتیفیکیشن استفاده می‌کنید
import styles from "./ResetPassword.module.scss";

type ResetPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ResetPasswordModal = ({ isOpen, onClose }: ResetPasswordModalProps) => {
  const [step, setStep] = useState<"password" | "sms">("password");
  const { theme, language } = useAppContext();
  const { t } = useTranslation("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState("");

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : { name: "", mobileNumber: "" };

  const changePasswordMutation = useApiMutation<
    { message: string },
    { oldPassword: string; newPassword: string; mobileNumber: string }
  >({
    url: "/request-reset-password",
    method: "POST",
    options: {
      onSuccess: () => {
        setStep("sms");
        showNotification(t("reset_password.sms_sent"), "success");
      },
      onError: (error: any) => {
        showNotification(error?.message || t("reset_password.error"), "error");
      },
    },
  });

  const verifyPasswordMutation = useApiMutation<
    { message: string },
    { code: string; name: string }
  >({
    url: "/check-reset-password",
    method: "POST",
    options: {
      onSuccess: () => {
        showNotification(t("reset_password.success"), "success");
        onClose();
      },
      onError: (error: any) => {
        showNotification(error?.message || t("reset_password.invalid_code"), "error");
      },
    },
  });

  const handleChangePassword = () => {
    changePasswordMutation.mutate({
      oldPassword,
      newPassword,
      mobileNumber: user.mobileNumber,
    });
  };

  const verifyPassword = (): void => {
    verifyPasswordMutation.mutate({
      code,
      name: user.name,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`${styles.modalOverlay} ${theme === "dark" ? styles.dark : styles.light}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ direction: language === "fa" ? "rtl" : "ltr" }}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button className={styles.closeBtn} onClick={onClose}>
              ✖
            </button>

            {step === "password" && (
              <div className={styles.modalContent}>
                <h2>{t("reset_password.change_password")}</h2>
                <input
                  type="password"
                  placeholder={t("reset_password.current_password")}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={styles.input}
                />
                <input
                  type="password"
                  placeholder={t("reset_password.new_password")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.input}
                />
                <ButtonUI
                  type={buttonType.BUTTON}
                  variant={changePasswordMutation.isPending ? VariantType.PRIMARY : VariantType.SECONDARY}
                  onClick={handleChangePassword}
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending
                    ? t("reset_password.sending")
                    : t("reset_password.continue")}
                </ButtonUI>
              </div>
            )}

            {step === "sms" && (
              <div className={styles.modalContent}>
                <h2>{t("reset_password.sms_verification")}</h2>
                <p>{t("reset_password.sms_instruction")}</p>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  type="text"
                  placeholder={t("reset_password.verification_code")}
                  className={styles.input}
                />
                <ButtonUI
                  type={buttonType.BUTTON}
                  variant={verifyPasswordMutation.isPending ? VariantType.PRIMARY : VariantType.SECONDARY}
                  onClick={verifyPassword}
                  disabled={verifyPasswordMutation.isPending}
                >
                  {verifyPasswordMutation.isPending
                    ? t("reset_password.verifying")
                    : t("reset_password.verify")}
                </ButtonUI>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResetPasswordModal;
