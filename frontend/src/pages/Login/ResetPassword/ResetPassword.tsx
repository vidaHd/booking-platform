import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ButtonUI } from "../../../ui-kit";
import { buttonType, VariantType } from "../../../ui-kit/button/button.type";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../../context/LanguageContext";
import { useApiMutation } from "../../../api/apiClient";
import styles from "./ResetPassword.module.scss";
import { showNotification } from "../../../utils/showNotification";

const ForgetPasswordModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const { theme, language } = useAppContext();

  const [step, setStep] = useState<"mobile" | "verify" | "reset">("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep("mobile");
      setMobileNumber("");
      setCode(["", "", "", ""]);
      setNewPassword("");
    }
  }, [isOpen]);

  const sendCodeMutation = useApiMutation<{ message: string }, { mobileNumber: string }>({
    url: "/auth/forgot-password",
    method: "POST",
    options: {
      onSuccess: (data) => {
        showNotification("success", data.message);
        setStep("verify");
      },
    },
  });

  const verifyCodeMutation = useApiMutation<
    { message: string },
    { mobileNumber: string; code: string }
  >({
    url: "/auth/verify-reset-code",
    method: "POST",
    options: {
      onSuccess: (data) => {
        showNotification("success", data.message);
        setStep("reset");
      },
    },
  });

  const resetPasswordMutation = useApiMutation<
    { message: string },
    { mobileNumber: string; newPassword: string }
  >({
    url: "/auth/reset-password",
    method: "POST",
    options: {
      onSuccess: (data) => {
        showNotification("success", data.message);
        onClose();
      },
    },
  });

  const handleSendCode = () => {
    sendCodeMutation.mutate({ mobileNumber });
  };

  const handleVerify = () => {
    verifyCodeMutation.mutate({ mobileNumber, code: code.join("") });
  };

  const handleResetPassword = () => {
    resetPasswordMutation.mutate({ mobileNumber, newPassword });
  };

  const handleCodeChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) inputRefs.current[index + 1]?.focus();
      if (!value && index > 0) inputRefs.current[index - 1]?.focus();
    }
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

            <div className={styles.modalContent}>
              {step === "mobile" && (
                <>
                  <span>{t("forgetPassword.enterMobileText")}</span>
                  <input
                    type="text"
                    placeholder={t("forgetPassword.mobilePlaceholder")}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className={styles.input}
                  />
                  <ButtonUI
                    onClick={handleSendCode}
                    variant={VariantType.PRIMARY}
                    type={buttonType.BUTTON}
                    disabled={sendCodeMutation.isPending || !mobileNumber}
                  >
                    {sendCodeMutation.isPending
                      ? t("forgetPassword.submitting")
                      : t("forgetPassword.sendCode")}
                  </ButtonUI>
                </>
              )}

              {step === "verify" && (
                <>
                  <span>{t("forgetPassword.enterCodeText")}</span>
                  <div className={styles.codeInputsContainer}>
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el: any) => (inputRefs.current[index] = el)}
                        value={digit}
                        onChange={(e) => handleCodeChange(e.target.value, index)}
                        maxLength={1}
                        className={styles.codeInput}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    ))}
                  </div>
                  <ButtonUI
                    onClick={handleVerify}
                    variant={VariantType.PRIMARY}
                    type={buttonType.BUTTON}
                  >
                    {t("forgetPassword.verifyCode")}
                  </ButtonUI>
                </>
              )}

              {step === "reset" && (
                <>
                  <span>{t("forgetPassword.newPasswordTitle")}</span>
                  <input
                    type="password"
                    placeholder={t("forgetPassword.newPasswordPlaceholder")}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.input}
                  />
                  <ButtonUI
                    onClick={handleResetPassword}
                    variant={VariantType.PRIMARY}
                    type={buttonType.BUTTON}
                  >
                    {t("forgetPassword.resetPassword")}
                  </ButtonUI>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgetPasswordModal;
