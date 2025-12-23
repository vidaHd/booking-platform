import { AnimatePresence, motion } from "framer-motion";
import { ButtonUI } from "../../../ui-kit";
import { buttonType, VariantType } from "../../../ui-kit/button/button.type";
import { useApiMutation } from "../../../api/apiClient";
import { useState, useEffect, useRef } from "react";
import styles from "./smsmModal.module.scss";
import { useAppContext } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/userSlice";
import { showNotification } from "../../../utils/showNotification";
import { getItem, removeItem } from "../../../utils/storage";

const ModalForSms = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { theme, language } = useAppContext();
  const { t } = useTranslation("");
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const userId = (getItem<{ id: string }>("user") as any)?.id;

  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCode(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const verifyCodedMutation = useApiMutation<
    {
      user: { name: string; familyName: string; mobileNumber: string; _id: string };
      message: string;
    },
    { code: string; id: string }
  >({
    url: "/auth/check-verification-code",
    method: "POST",
    options: {
      onSuccess: (data) => {
        dispatch(
          setUser({
            name: data.user.name,
            familyName: data.user.familyName,
            mobileNumber: data.user.mobileNumber,
            id: data.user._id,
          })
        );
        showNotification(data.message, "success");
        const redirect = getItem("redirectAfterLogin");

        if (redirect) {
          navigator(redirect);
          removeItem("redirectAfterLogin");
        } else {
          navigator("/");
        }
        onClose();
      },
      onError: (error: any) => {
        showNotification(error.response?.data?.message || "Verification failed", "error");
      },
    },
  });

  const verifyCode = (): void => {
    verifyCodedMutation.mutate({
      code: code.join(""),
      id: userId,
    });
  };

  // handle digit typing
  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 3) inputRefs.current[index + 1]?.focus();
      if (!value && index > 0) inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <AnimatePresence key="verify">
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
              <h2>{t("reset_password.sms_verification")}</h2>

              <div className={styles.codeInputsContainer}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el: any) => (inputRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    maxLength={1}
                    className={styles.codeInput}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                ))}
              </div>

              <ButtonUI
                type={buttonType.BUTTON}
                variant={VariantType.SECONDARY}
                onClick={verifyCode}
                disabled={code.join("").length < 4}
              >
                {t("reset_password.verify")}
              </ButtonUI>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalForSms;
