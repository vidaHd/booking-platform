import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ButtonUI } from "../../ui-kit";
import { useTranslation } from "react-i18next";
import { useApiMutation, useApiQuery } from "../../api/apiClient";
import styles from "./AddNewCompany.module.scss";
import { buttonType, VariantType } from "../../ui-kit/button/button.type";

const AddNewCompany: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    companyName: "",
    jobId: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;

  const companyMutation = useApiMutation<any, { companyName: string; jobId: string }>({
    url: `/companies/${userId}`,
    method: "POST",
    options: {
      onSuccess: (data) => {
        localStorage.setItem("company", JSON.stringify(data));
        navigate("/add-new-service");
      },
      onError: (error: any) => setErrors({ general: error.message }),
    },
  });

  const { data: jobs, isLoading: jobsLoading } = useApiQuery<any>({
    key: "jobs",
    url: "/jobs",
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.companyName.trim())
      newErrors.companyName = t("add-new-company.company_name_required");
    if (!formData.jobId.trim()) newErrors.jobId = t("add-new-company.job_required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    companyMutation.mutate({ ...formData });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className={styles.addCompanyPage}>
      <div className={styles.container}>
        <motion.div
          className={styles.companyCard}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className={styles.companyHeader}>
            <ButtonUI variant={VariantType.ICON} onClick={() => navigate("/")}>
              {t("add-new-company.back")}
            </ButtonUI>

            <div className={styles.companyTitle}>
              <h1>{t("add-new-company.create_company_account")} </h1>
              <p>{t("add-new-company.enter_company_info")}</p>
            </div>
          </div>

          {/* Form */}
          <motion.form
            className={styles.companyForm}
            onSubmit={handleAddCompany}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className={styles.formGrid}>
              <input
                className={styles.inputNewCompany}
                type="text"
                placeholder={t("add-new-company.company_name_placeholder")}
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
              />

              <div className={styles.formGroup}>
                <div className={styles.selectWrapper}>
                  <select
                    value={formData.jobId}
                    onChange={(e) => handleInputChange("jobId", e.target.value)}
                    className={`${styles.input} ${errors.jobId ? styles.error : ""}`}
                    disabled={jobsLoading}
                  >
                    <option value="" className={styles.optionInput}>
                      {jobsLoading
                        ? t("add-new-company.job_label")
                        : t("add-new-company.select_job")}
                    </option>
                    {Array.isArray(jobs?.data) &&
                      jobs?.data.map((item: any) => (
                        <option key={item.jobCode} value={item.jobCode}>
                          {item.name}
                        </option>
                      ))}
                  </select>

                  {errors.general && <span className={styles.error}>{errors.general}</span>}

                  <div className={styles.selectIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6,9 12,15 18,9" />
                    </svg>
                  </div>
                </div>
                {errors.jobId && <div className={styles.inputError}>{errors.jobId}</div>}
              </div>
            </div>

            <div className={styles.formActions}>
              <ButtonUI variant={VariantType.SECONDARY} type={buttonType.SUBMIT}>
                {t("add-new-company.create")}
              </ButtonUI>
              <ButtonUI
                variant={VariantType.PRIMARY}
                onClick={() => navigate("/")}
                type={buttonType.BUTTON}
              >
                {t("add-new-company.cancel")}
              </ButtonUI>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddNewCompany;
