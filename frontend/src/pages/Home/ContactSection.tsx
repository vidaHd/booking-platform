import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiInstagram, FiSend, FiX, FiPhone, FiMapPin } from "react-icons/fi";
import styles from "./Contact.module.scss";
import { useTranslation } from "react-i18next";
import { getItem } from "../../utils/storage";

const ContactSection: React.FC = () => {
  const { t } = useTranslation();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const company = getItem<any>("company");
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(company?.data?.address ?? "")}&z=12&output=embed`;

  return (
    <section className={styles.contactSection}>
      {/* Header */}
      <motion.div
        className={styles.sectionHeader}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>{t("contact.title")}</h2>
        <span>{company?.data?.description || t("contact.subtitle")}</span>
      </motion.div>

      {/* Grid */}
      <div className={styles.contactGrid}>
        {/* Contact Card */}
        {company?.data?.mobileNumber || company?.data?.email || company?.data?.address ? (
          <motion.div
            className={styles.contactCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h3>{t("contact.info_title")}</h3>
            {company?.data?.mobileNumber && (
              <div className={styles.infoRow}>
                <FiPhone /> <span>{company?.data?.mobileNumber}</span>
              </div>
            )}
            {company?.data?.email && (
              <div className={styles.infoRow}>
                <FiMail /> <span>{company?.data?.email}</span>
              </div>
            )}
            {company?.data?.address && (
              <div className={styles.infoRow}>
                <FiMapPin /> <span>{company?.data?.address}</span>
              </div>
            )}
          </motion.div>
        ) : (
          <></>
        )}

        {/* Social Card */}
        <motion.div
          className={styles.contactCard}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3>{t("contact.follow_us")}</h3>
          <div className={styles.socialLinks}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FiInstagram /> Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FiMail /> Facebook
            </a>
            <a href="https://t.me" target="_blank" rel="noopener noreferrer">
              <FiSend /> Telegram
            </a>
          </div>
        </motion.div>

        {/* Map Card */}
        <motion.div
          className={styles.mapCard}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onClick={() => setIsMapModalOpen(true)}
        >
          <iframe
            title="company-location"
            src={mapUrl}
            width="100%"
            height="200"
            style={{ borderRadius: "1rem" }}
          />
          <button className={styles.viewMapBtn}>نمایش در نقشه</button>
        </motion.div>
      </div>

      {/* Modal */}
      {isMapModalOpen && (
        <div className={styles.mapModal}>
          <div className={styles.mapModalContent}>
            <button className={styles.closeButton} onClick={() => setIsMapModalOpen(false)}>
              <FiX size={20} />
            </button>
            <iframe
              title="full-map"
              src={mapUrl}
              width="100%"
              height="400"
              style={{ borderRadius: "1rem" }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactSection;
