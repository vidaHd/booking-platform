import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ButtonUI } from "../../ui-kit";
import { buttonType, VariantType } from "../../ui-kit/button/button.type";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../context/LanguageContext";
import { useApiMutation } from "../../api/apiClient";
import styles from "./Register.module.scss";
import ModalForSms from "./modal/SmsModal";
import { setItem } from "../../utils/storage";

const Register = () => {
  const navigate = useNavigate();

  const { language } = useAppContext();
  const { t } = useTranslation();

  const [openModalForCode, setOpenModalForCode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    familyName: "",
    mobileNumber: "",
    password: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useApiMutation<
    {
      message: string;
      user: {
        _id: string;
        name: string;
        familyName?: string;
        mobileNumber?: string;
      };
    },
    { name: string; familyName: string; mobileNumber: string; password: string; email?: string }
  >({
    url: "/auth/register",
    method: "POST",
    options: {
      onSuccess: (data) => {
        setItem("user", { id: data.user._id });
        setOpenModalForCode(true);
      },
    },
  });

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const handleMobileChange = (value: string) => {
    setFormData({ ...formData, mobileNumber: value });
    if (errors.mobileNumber) {
      setErrors({ ...errors, mobileNumber: "" });
    }
  };

  return (
    <div className={styles.resgisterPage}>
      {/* Left Side - Visual */}
      <div className={styles.registerVisual}>
        <motion.div
          className={styles.visualContent}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t("register.visual.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {t("register.visual.subtitle")}
          </motion.p>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className={styles.registerFormContainer}>
        <motion.div
          className={styles.registerCard}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ButtonUI
            variant={VariantType.ICON}
            type={buttonType.BUTTON}
            onClick={() => navigate("/")}
          >
            {language === "fa" ? "→" : "←"}
          </ButtonUI>
          <h1 className={styles.title}>{t("register.title")}</h1>

          <form className={styles.registerForm} onSubmit={handleSignIn}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder={t("register.name")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? styles.inputError : ""}
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder={t("register.familyName")}
                value={formData.familyName}
                onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
                className={errors.familyName ? styles.inputError : ""}
              />
              {errors.familyName && <span className={styles.errorText}>{errors.familyName}</span>}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="tel"
                inputMode="numeric"
                placeholder={t("register.mobileNumber")}
                value={formData.mobileNumber}
                onChange={(e) => handleMobileChange(e.target.value)}
                maxLength={11}
                className={errors.mobileNumber ? styles.inputError : ""}
              />
              {errors.mobileNumber && (
                <span className={styles.errorText}>{errors.mobileNumber}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder={t("register.email")}
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? styles.inputError : ""}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder={t("register.password")}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={errors.password ? styles.inputError : ""}
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <ButtonUI
              variant={VariantType.PRIMARY}
              type={buttonType.SUBMIT}
              disabled={
                registerMutation.isPending ||
                !formData.name ||
                !formData.familyName ||
                !formData.mobileNumber ||
                !formData.password
              }
            >
              {registerMutation.isPending ? t("register.submitting") : t("register.submit")}
            </ButtonUI>
          </form>
          <ModalForSms isOpen={openModalForCode} onClose={() => setOpenModalForCode(false)} />
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
