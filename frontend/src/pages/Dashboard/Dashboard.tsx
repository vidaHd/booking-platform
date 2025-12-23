import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useApiQuery } from "../../api/apiClient";
import styles from "./Dashboard.module.scss";
import { getItem, setItem } from "../../utils/storage";

import Overview from "./components/Overview/Overview";
import Schedule from "./components/manageTime/Schedule";
import Services from "./components/Services";
import Company from "./components/company/Company";
import Bookings from "./components/users/Bookings";

type TabType = "overview" | "schedule" | "services" | "company" | "bookings";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const saved = getItem<TabType>("dashboardActiveTab") as TabType | null;
    return (saved as TabType) || "services";
  });
  const { url } = useParams();

  const { data: company, isLoading } = useApiQuery<any>({
    key: ["get-company", url],
    url: url ? `/companies/${url}` : "",
    enabled: !!url,
  });

  useEffect(() => {
    if (company?.data) {
      setItem("company", company);
    }
  }, [company]);

  useEffect(() => {
    setItem("dashboardActiveTab", activeTab);
  }, [activeTab]);

  const tabs = useMemo(
    () => [
      { id: "overview", label: t("dashboard.tabs.overview") },
      { id: "schedule", label: t("dashboard.tabs.schedule") },
      { id: "services", label: t("dashboard.tabs.services") },
      { id: "company", label: t("dashboard.tabs.company") },
      { id: "bookings", label: t("dashboard.tabs.bookings") },
    ],
    [t]
  );

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (!company?.data)
    return (
      <div className={styles.emptyCompany}>
        <p>{t("dashboard.no_company_found")}</p>
        <button className={styles.addCompanyButton}>{t("dashboard.add_company")}</button>
      </div>
    );

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <h1>{t("dashboard.title")}</h1>
        <p>{t("dashboard.subtitle")}</p>
      </div>

      <div className={styles.dashboardLayout}>
        <div className={styles.dashboardSidebar}>
          <nav className={styles.dashboardNav}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ""}`}
                onClick={() => setActiveTab(tab.id as TabType)}
              >
                <span className={styles.navLabel}>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className={styles.dashboardContent}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={styles.tabContent}
            >
              {activeTab === "overview" && <Overview />}
              {activeTab === "schedule" && <Schedule />}
              {activeTab === "services" && <Services />}
              {activeTab === "company" && <Company />}
              {activeTab === "bookings" && <Bookings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
