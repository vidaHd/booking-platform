import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "../../context/LanguageContext";
import styles from "./Notification.module.scss";

const Toast = ({ message }: { message: string }) => {
  const { theme, language } = useAppContext();

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className={`${styles.toast} ${theme === "dark" ? styles.dark : styles.light}`}
          style={{ direction: language === "fa" ? "rtl" : "ltr" }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
