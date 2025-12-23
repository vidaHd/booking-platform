import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ButtonUI } from "../../ui-kit";
import { useTranslation } from "react-i18next";
import { useApiMutation } from "../../api/apiClient";
import "./AddCompanyService.module.scss";
import { buttonType, VariantType } from "../../ui-kit/button/button.type";

const AddCompanyService: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const service = localStorage.getItem("service")
    ? JSON.parse(localStorage.getItem("service")!)
    : null;

  const [formData, setFormData] = useState({
    duration: "",
    price: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const companyMutation = useApiMutation<
    any,
    { duration: string; serviceId?: string; price?: string }
  >({
    url: "/company-service",
    method: "POST",
    options: {
      onSuccess: (data) => {
        localStorage.setItem("userService", JSON.stringify(data));
        navigate("/available-time");
      },
      onError: (error: any) => {
        setErrors({ general: error.message });
      },
    },
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.price.trim()) {
      newErrors.price = "قیمت سرویس الزامی است";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "قیمت باید یک عدد مثبت باشد";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "مدت سرویس الزامی است";
    } else if (isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
      newErrors.duration = "مدت زمان باید یک عدد مثبت باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDetailService = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const finalData = {
      ...formData,
      serviceId: service ? service?._id : "",
      duration: formData.duration,
      price: formData.price,
    };

    companyMutation.mutate(finalData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="add-service-page">
      <div className="container">
        <motion.div
          className="service-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="service-header">
            <ButtonUI variant={VariantType.ICON} onClick={() => navigate(-1)}>
              {t("add-new-company.back")}
            </ButtonUI>

            <div className="service-title">
              <h1>{t("add-company-service.title")}</h1>
              <p>{t("add-company-service.subtitle")}</p>
            </div>
          </div>

          {/* Service Info */}
          <div className="service-info">
            <div className="service-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>
                {t("add-company-service.selected_service")}:{" "}
                {service?.title ?? t("add-company-service.service_name_placeholder")}
              </span>
            </div>
          </div>

          {/* Form */}
          <motion.form
            className="service-form"
            onSubmit={handleAddDetailService}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="form-grid">
              <label>{t("add-company-service.price_label")}</label>
              <input
                placeholder={t("add-company-service.price_placeholder")}
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
              />

              <label>{t("add-company-service.duration_label")}</label>
              <input
                placeholder={t("add-company-service.duration_placeholder")}
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
              />
            </div>

            {errors.general && (
              <div className="form-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {errors.general}
              </div>
            )}

            <div className="form-actions">
              <ButtonUI variant={VariantType.ICON} onClick={() => navigate("/")}>
                {t("add-company-service.cancel")}
              </ButtonUI>

              <ButtonUI variant={VariantType.PRIMARY} type={buttonType.SUBMIT}>
                {t("add-company-service.submit")}
              </ButtonUI>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddCompanyService;
