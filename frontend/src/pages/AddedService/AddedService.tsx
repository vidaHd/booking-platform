import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddedService.module.scss";
import { ButtonUI } from "../../ui-kit";
import { buttonType, VariantType } from "../../ui-kit/button/button.type";
import { useTranslation } from "react-i18next";
import { useApiMutation, useApiQuery } from "../../api/apiClient";

const AddedService = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({ title: "" });
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const company = localStorage.getItem("company");

  const { data: serviceses, isLoading: servicesLoading } = useApiQuery<any>({
    key: ["all-service", company ? JSON.parse(company).data.jobId : ""],
    url: `/services/job/${company ? JSON.parse(company).data.jobId : ""}`,
  });
  
  const servicesData = serviceses?.data;
  const [servicesList, setServicesList] = useState<any[]>([]);

  useEffect(() => {
    if (Array.isArray(servicesData)) setServicesList(servicesData);
  }, [servicesData]);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleCheckboxChange = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((serviceId) => serviceId !== id) : [...prev, id]
    );
  };

  const createServiceMutation = useApiMutation<
    any,
    { title: string; jobId?: string; companyId?: string }
  >({
    url: "/services",
    method: "POST",
    options: {
      onSuccess: (data) => {
        if (data && data._id) {
          setServicesList((prev) => [{ ...data }, ...prev]);
          setSelectedServices((prev) => (prev.includes(data._id) ? prev : [data._id, ...prev]));
          setFormData({ title: "" });
        }
      },
      onError: (error: any) => setError(error.message),
    },
  });

  const companyId = company ? JSON.parse(company)?.data?._id : "";

  const selectServicesMutation = useApiMutation<any, { companyId: string; serviceIds: string[] }>({
    url: `/company-service/bulk/${companyId}`,
    method: "PUT",
    options: {
      onSuccess: (data) => {
        const firstSelected = selectedServices[0];
        const matched = servicesList.find((s) => s._id === firstSelected) || data;
        if (matched) localStorage.setItem("service", JSON.stringify(matched));
        navigate("/available-time");
      },
      onError: (error: any) => setError(error.message),
    },
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    createServiceMutation.mutate({
      title: formData.title.trim(),
      companyId: company ? JSON.parse(company).data._id : "",
      jobId: company ? JSON.parse(company).data.jobId : "",
    });
  };

  const handleNext = () => {
    if (selectedServices.length === 0) return;
    selectServicesMutation.mutate({
      companyId: company ? JSON.parse(company)._id : "",
      serviceIds: selectedServices,
    });
  };

  const filteredServices = useMemo(() => {
    if (!search.trim()) return servicesList;
    const q = search.trim().toLowerCase();
    return servicesList.filter((s) => (s.title || "").toLowerCase().includes(q));
  }, [servicesList, search]);

  return (
    <div className={styles.addServicePage}>
      <div className={styles.container}>
        <motion.div
          className={styles.serviceCard}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.serviceHeader}>
            <ButtonUI
              variant={VariantType.ICON}
              type={buttonType.BUTTON}
              onClick={() => navigate(-1)}
            >
              {t("add-new-company.back")}
            </ButtonUI>

            <div className={styles.serviceTitle}>
              <h1>{t("added-service.title")}</h1>
              <p>{t("added-service.subtitle")}</p>
            </div>
          </div>

          <div className={styles.servicesSection}>
            <div className={styles.servicesHeader}>
              <h3>{t("added-service.existing_services")}</h3>
              <div className={styles.searchWrapper}>
                <input
                  type="text"
                  placeholder={t("added-service.search_placeholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.servicesList} aria-busy={servicesLoading}>
              {filteredServices && filteredServices.length > 0 ? (
                filteredServices.map((item: any) => {
                  const isSelected = selectedServices.includes(item._id);
                  return (
                    <button
                      key={item._id}
                      type="button"
                      className={`${styles.serviceItem} ${isSelected ? styles.selected : ""}`}
                      onClick={() => handleCheckboxChange(item._id)}
                      aria-pressed={isSelected}
                    >
                      <span className={styles.title}>{item.title}</span>
                    </button>
                  );
                })
              ) : (
                <p className={styles.empty}>{t("added-service.no_services")}</p>
              )}
            </div>

            <div className={styles.servicesFooter}>
              <span className={styles.selectedCount}>
                {t("added-service.selected_count", {
                  count: selectedServices.length,
                })}
              </span>
            </div>
          </div>

          <div className={styles.createService}>
            <h3>{t("added-service.create_new_service")}</h3>

            <motion.form
              className={styles.serviceForm}
              onSubmit={handleCreateService}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <input
                type="text"
                placeholder={t("added-service.service_name_placeholder")}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              {error && <span className={styles.formError}>{error}</span>}

              <div className={styles.formActions}>
                <ButtonUI variant={VariantType.PRIMARY} type={buttonType.SUBMIT}>
                  {t("added-service.add_service")}
                </ButtonUI>
                <ButtonUI
                  variant={VariantType.SECONDARY}
                  type={buttonType.BUTTON}
                  onClick={handleNext}
                  disabled={selectedServices.length === 0}
                >
                  {t("added-service.next_step")}
                </ButtonUI>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddedService;
