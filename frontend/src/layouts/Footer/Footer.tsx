import { useAppContext } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import styles from "./Footer.module.scss";

const Footer = () => {
  const { t } = useTranslation();
  const { theme } = useAppContext();

  return (
    <footer className={`${styles.footer} ${theme === "dark" ? styles.dark : styles.light}`}>
      <p>probookit {t("footer.all_rights_reserved")}</p>
    </footer>
  );
};

export default Footer;
