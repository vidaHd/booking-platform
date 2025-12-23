import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useTranslation } from "react-i18next";

import { useApiMutation, useApiQuery } from "../../../../api/apiClient";
import { ButtonUI } from "../../../../ui-kit";
import { buttonType, VariantType } from "../../../../ui-kit/button/button.type";

import "./service.scss";
import type { SelectService } from "./type";

const AddNewService = ({
  onclose,
  refetch,
  selectedService,
}: {
  onclose: () => void;
  refetch: () => void;
  selectedService: SelectService[];
}): any => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({ title: "" });
  const [error, setError] = useState("");

  const company = localStorage.getItem("company");

  const { data: servicesData, isLoading: servicesLoading } = useApiQuery<any>({
    key: ["all-service", company ? JSON.parse(company).data.jobId : ""],
    url: `/services/job/${company ? JSON.parse(company).data.jobId : ""}`,
  });

  const [servicesList, setServicesList] = useState<any>([]);

  useEffect(() => {
    if (Array.isArray(servicesData?.data)) {
      setServicesList(servicesData?.data);
    }
  }, [servicesData]);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleCheckboxChange = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((serviceId) => serviceId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (Array.isArray(selectedService) && selectedService.length > 0) {
      const ids = selectedService.map((s) => s.serviceId);
      setSelectedServices(ids);
    }
  }, [selectedService]);

  const createServiceMutation = useApiMutation<
    any,
    {
      title: string;
      jobId?: string;
      companyId?: string;
    }
  >({
    url: "/services",
    method: "POST",
    options: {
      onSuccess: (data) => {
        if (data && data._id) {
          setServicesList((prev:any) => [{ ...data }, ...prev]);
          setSelectedServices((prev) => (prev.includes(data._id) ? prev : [data._id, ...prev]));
          setFormData({ title: "" });
        }
      },
      onError: (error: any) => {
        setError(error.message);
      },
    },
  });

  const companyId = company ? JSON.parse(company)?.data?._id : "";

  const selectServicesMutation = useApiMutation<
    any,
    {
      companyId: string;
      serviceIds: string[];
    }
  >({
    url: `/company-service/bulk/${companyId}`,
    method: "PUT",
    options: {
      onSuccess: (data) => {
        const firstSelected = selectedServices[0];
        const matched = servicesList.find((s:any) => s._id === firstSelected) || data;
        if (matched) {
          localStorage.setItem("service", JSON.stringify(matched));
        }
        refetch();
        onclose();
      },
      onError: (error: any) => {
        setError(error.message);
      },
    },
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const payload = {
      title: formData.title.trim(),
      companyId: company ? JSON.parse(company).data._id : "",
      jobId: company ? JSON.parse(company).data.jobId : "",
    };
    createServiceMutation.mutate(payload);
  };

  const handleNext = () => {
    if (selectedServices.length === 0) return;
    const payload = {
      companyId: company ? JSON.parse(company).data._id : "",
      serviceIds: selectedServices,
    };
    selectServicesMutation.mutate(payload);
  };

  return (
    <div className="modal-add-service">
      <div className="container">
        <AiOutlineClose style={{ cursor: "pointer" }} onClick={() => onclose()} />
        <motion.div
          className="service-card"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="services-section">
            <div className="services-list" aria-busy={servicesLoading}>
              {servicesList && servicesList.length > 0 ? (
                servicesList?.map((item: any) => {
                  const isSelected =
                    selectedServices.includes(item._id) ||
                    selectedService?.some((s: any) => s.serviceId === item._id);
                  return (
                    <button
                      key={item._id}
                      type="button"
                      className={`service-item ${isSelected ? "selected" : ""}`}
                      onClick={() => !isSelected && handleCheckboxChange(item._id)}
                      aria-pressed={isSelected}
                    >
                      <span className="title">{item.title}</span>
                    </button>
                  );
                })
              ) : (
                <p className="empty">{t("added-service.no_services")}</p>
              )}
            </div>

            <div className="services-footer">
              <span className="selected-count">
                {t("added-service.selected_count", {
                  count: selectedServices.length,
                })}
              </span>
            </div>
          </div>

          <div className="create-service">
            <h3>{t("added-service.create_new_service")}</h3>

            <motion.form
              className="service-form"
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

              {error && <span className="form-error">{error}</span>}

              <div className="form-actions">
                <ButtonUI variant={VariantType.PRIMARY} type={buttonType.SUBMIT}>
                  {t("added-service.add_service")}
                </ButtonUI>
                <ButtonUI
                  variant={VariantType.SECONDARY}
                  type={buttonType.BUTTON}
                  onClick={handleNext}
                  disabled={selectedServices.length === 0}
                >
                  {t("added-service.cancel_and_close")}
                </ButtonUI>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddNewService;
