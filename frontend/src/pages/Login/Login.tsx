import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/userSlice";
import styles from "./Login.module.scss";
import { ButtonUI } from "../../ui-kit";
import { buttonType, VariantType } from "../../ui-kit/button/button.type";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../context/LanguageContext";
import { useApiMutation } from "../../api/apiClient";
import ForgetPasswordModal from "./ResetPassword/ResetPassword";
import { getItem, removeItem, setItem } from "../../utils/storage";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showResetModal, setShowResetModal] = useState(false);
  const { t } = useTranslation();
  const { language } = useAppContext();

  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });
  const [error, setError] = useState("");

  const setUserInformation = (data: any) => {
    const user = {
      name: data.user.name,
      familyName: data.user.familyName,
      mobileNumber: data.user.mobileNumber,
      profile: data.user.profile,
      id: data.user._id,
    };
    dispatch(setUser({ ...user, token: data.token }));
    setItem("token", data.token);

    const redirect = getItem("redirectAfterLogin");
    
    if (redirect) {
      navigate(redirect);
      removeItem("redirectAfterLogin");
    } else {
      navigate("/");
    }
  };

  const loginMutation = useApiMutation<
    { message: string; user: any; token: string },
    { mobileNumber: string; password: string }
  >({
    url: "/auth/login",
    method: "POST",
    options: {
      onSuccess: (data) => setUserInformation(data),
      onError: (error: any) => setError(error.message),
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className={styles.loginPage}>
      <motion.div
        className={styles.loginCard}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ButtonUI
          variant={VariantType.ICON}
          type={buttonType.BUTTON}
          onClick={() => (window.location.href = "/")}
        >
          {language === "fa" ? "→" : "←"}
        </ButtonUI>

        <h2 className={styles.back}>{t("login.welcomeBack")}</h2>
        <p className={styles.subtitle}>{t("login.subtitle")}</p>

        <motion.form
          className={styles.loginForm}
          onSubmit={handleLogin}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <input
            type="text"
            placeholder={t("login.mobileNumber")}
            value={formData.mobileNumber}
            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
          />
          <input
            type="password"
            placeholder={t("login.password")}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {error && <span className={styles.error}>{error}</span>}

          <ButtonUI variant={VariantType.PRIMARY} type={buttonType.SUBMIT}>
            {t("login.login")}
          </ButtonUI>
        </motion.form>

        <p className={styles.forgotPassword} onClick={() => setShowResetModal(true)}>
          {t("login.forgotPassword")}
        </p>

        <ButtonUI
          variant={VariantType.SECONDARY}
          onClick={() => (window.location.href = "/register")}
          type={buttonType.SUBMIT}
        >
          {t("login.register")}
        </ButtonUI>

        {showResetModal && (
          <ForgetPasswordModal isOpen={showResetModal} onClose={() => setShowResetModal(false)} />
        )}
      </motion.div>
    </div>
  );
};

export default Login;
