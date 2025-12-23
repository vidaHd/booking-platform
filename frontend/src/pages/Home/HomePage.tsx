import React from "react";
import { motion } from "framer-motion";
import { ButtonUI } from "../../ui-kit";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { VariantType } from "../../ui-kit/button/button.type";
import styles from "./Home.module.scss";
import { FiCalendar, FiClock, FiStar } from "react-icons/fi";
import ContactSection from "./ContactSection";
import { getItem } from "../../utils/storage";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const company = getItem<any>("company");

  const handleBookAppointment = () => {
    if (company?.data?.url) {
      navigate(`/${company.data.url}`);
    }
  };

  const features = [
    {
      icon: <FiCalendar size={32} />,
      title: t("features.online_booking"),
      description: t("features.online_booking_desc"),
      color: "var(--primary-500)",
    },
    {
      icon: <FiClock size={32} />,
      title: t("features.various_services"),
      description: t("features.various_services_desc"),
      color: "var(--secondary-500)",
    },
    {
      icon: <FiStar size={32} />,
      title: t("features.fair_price"),
      description: t("features.fair_price_desc"),
      color: "var(--warning-500)",
    },
  ];

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroPattern} />
        </div>
      </section>

      {/* Stats Section */}
      <ContactSection />

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.div
                className={styles.featureIcon}
                style={{ color: feature.color }}
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>{t("cta.title")}</h2>
          <p>{t("cta.subtitle")}</p>
          <ButtonUI variant={VariantType.PRIMARY} onClick={handleBookAppointment}>
            {t("cta.button")}
          </ButtonUI>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
