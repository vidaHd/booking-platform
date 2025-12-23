import React from "react";
import { useTranslation } from "react-i18next";
import AvailableTimeForm from "../../../AddAvailableTime/AddAvailableTime";
import styles from "../../Dashboard.module.scss";

const Schedule: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.schedule}>
      <div className={styles.sectionHeader}>
        <h2>{t("dashboard.schedule.title")}</h2>
        <p>{t("dashboard.schedule.subtitle")}</p>
      </div>

      <div className={styles.formWrapper}>
        <AvailableTimeForm />
      </div>
    </div>
  );
};

export default Schedule;
