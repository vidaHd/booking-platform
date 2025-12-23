import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import AddNewService from "./AddNewService";
import { useServices } from "../../../../hooks/useServices";
import type { ServiceItem } from "./type";
import "./service.scss";
import { useApiQuery } from "../../../../api/apiClient";

const Services: React.FC = () => {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    price: "",
    duration: "",
    concurrentCapability: false,
  });
  const [isAddOpen, setIsAddOpen] = useState(false);

  const company = localStorage.getItem("company");
  const companyId = company ? JSON.parse(company)?.data?._id : "";

  const { update, remove } = useServices(companyId);
  const { data: servicesByCompany, refetch } = useApiQuery<any>({
    key: ["all-service", companyId],
    url: `/company-service/${companyId}`,
  });
  const openAdd = () => setIsAddOpen(true);
  const closeAdd = () => setIsAddOpen(false);

  const openEdit = (item: ServiceItem): void => {
    if (editingId === item.serviceId) {
      setEditingId(null);
    } else {
      setEditingId(item.serviceId);
      setEditValues({
        price: item.price && item.price !== "-" ? item.price : "",
        duration: item.duration && item.duration !== "-" ? item.duration : "",
        concurrentCapability: item.concurrentCapability ?? false,
      });
    }
  };

  const saveEdit = (item: ServiceItem): void => {
    update.mutate({
      serviceId: item.serviceId,
      companyId: item.companyId,
      price: editValues.price || "-",
      duration: editValues.duration || "-",
      concurrentCapability: editValues.concurrentCapability ?? false,
    });
    setEditingId(null);
  };

  return (
    <div className="dashboard-services">
      <div className="section-header">
        <h2>{t("dashboard.services.title")}</h2>
        <p>{t("dashboard.services.subtitle")}</p>
      </div>

      <div className="services-list">
        <div
          className="add-service-form"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "var(--space-6)",
          }}
        >
          <button className="btn" onClick={openAdd} type="button">
            {t("dashboard.services.add_new")}
          </button>
        </div>

        <div className="services-grid">
          {Array.isArray(servicesByCompany?.data) && servicesByCompany?.data?.length === 0 ? (
            <p className="empty">{t("dashboard.services.empty")}</p>
          ) : (
            Array.isArray(servicesByCompany?.data) &&
            servicesByCompany?.data.map((s: ServiceItem) => {
              const isEditing = editingId === s.serviceId;

              return (
                <div key={s.serviceId} className="service-card">
                  <div className="service-header">
                    <p className="service-title">{s.title}</p>

                    <div className="service-actions">
                      <FiEdit
                        className="icon edit-icon"
                        onClick={() => openEdit(s)}
                        title={
                          isEditing ? t("dashboard.common.cancel") : t("dashboard.common.edit")
                        }
                      />
                      <FiTrash2
                        className="icon delete-icon"
                        onClick={() => remove(s.serviceId)}
                        title={t("dashboard.common.delete")}
                      />
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="inline-edit">
                      <label>{t("dashboard.services.price")}</label>
                      <input
                        value={editValues.price}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        placeholder={t("dashboard.services.price_ph")}
                      />
                      <label>{t("dashboard.services.duration")}</label>
                      <input
                        value={editValues.duration}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            duration: e.target.value,
                          }))
                        }
                        placeholder={t("dashboard.services.duration_ph")}
                      />
                      <label className="concurrent-capability-label">
                        {t("dashboard.services.concurrentCapability")}

                        <input
                          className="concurrent-capability"
                          type="checkbox"
                          checked={editValues.concurrentCapability}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              concurrentCapability: e.target.checked,
                            }))
                          }
                        />
                      </label>

                      <div className="edit-actions">
                        <button className="btn" onClick={() => saveEdit(s)}>
                          {t("dashboard.common.save")}
                        </button>
                        <button className="btn secondary" onClick={() => setEditingId(null)}>
                          {t("dashboard.common.cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="service-details">
                      <p>
                        <strong>{t("dashboard.services.price")}:</strong> {s.price || "—"}
                      </p>
                      <p>
                        <strong>{t("dashboard.services.duration")}:</strong> {s.duration || "—"}
                      </p>

                      <p>
                        <strong>{t("dashboard.services.concurrentCapability")}:</strong>{" "}
                        {s.concurrentCapability ? t("common.yes") : t("common.no")}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {isAddOpen && (
        <div className="modal-backdrop" onClick={closeAdd}>
          <div onClick={(e) => e.stopPropagation()}>
            <AddNewService
              onclose={closeAdd}
              refetch={refetch}
              selectedService={servicesByCompany.data}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
