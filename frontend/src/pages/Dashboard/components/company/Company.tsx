import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ButtonUI } from "../../../../ui-kit";
import { buttonType, VariantType } from "../../../../ui-kit/button/button.type";
import styles from "../../Dashboard.module.scss";
import { useApiMutation, useApiQuery } from "../../../../api/apiClient";
import type { CompanyApiResponse, CompanyData } from "../Services";
import { FiCopy } from "react-icons/fi";
import { showNotification } from "../../../../utils/showNotification";
import { toPersianNumber } from "../../../../utils/bookingHelpers";

const Company: React.FC = () => {
  const { t } = useTranslation();
  const company = localStorage.getItem("company");

  const { data } = useApiQuery<CompanyApiResponse>({
    key: ["uniq-company"],
    url: `/companies/${company ? JSON.parse(company).data._id : ""}`,
  });

  const companyData = data?.data ?? "";

  const [form, setForm] = useState<CompanyData>(companyData);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!form.url) return;
    navigator.clipboard.writeText(form.url);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setForm(companyData);
  }, [companyData]);

  const changeInformationAboutCompany = useApiMutation<
    any,
    {
      companyName: string;
      url: string;
      mobileNumber?: string;
      address?: string;
      email?: string;
      description?: string;
    }
  >({
    url: `/companies/${company ? JSON.parse(company).data._id : ""}`,
    method: "PUT",
    options: {
      onSuccess: (data) => {
        localStorage.setItem("company", JSON.stringify(data));
        setForm(data.data);
        showNotification(t("notification.updateSuccess"), "success");
      },
    },
  });

  const save = () => {
    changeInformationAboutCompany.mutate({
      companyName: form.companyName,
      url: form.url ?? "",
      mobileNumber: form.mobileNumber,
      address: form.address,
      email: form.email,
      description: form.description,
    });
  };

  return (
    <div className={styles.dashboardCompany}>
      <div className={styles.sectionHeader}>
        <h2>{t("dashboard.company.title")}</h2>
        <p>{t("dashboard.company.subtitle")}</p>
      </div>

      <div className={styles.companyForm}>
        <label>{t("dashboard.company.name")}</label>
        <input
          value={form?.companyName ?? ""}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          placeholder={t("dashboard.company.name_ph")}
        />
        <label>{t("dashboard.company.phone")}</label>
        <input
          value={toPersianNumber(form.mobileNumber ?? "") || ""}
          onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
          placeholder={t("dashboard.company.phone_ph")}
        />
        <label>{t("dashboard.company.address")}</label>
        <input
          value={form.address || ""}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder={t("dashboard.company.address_ph")}
        />
        <label>{t("dashboard.company.email")}</label>
        <input
          value={form.email || ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder={t("dashboard.company.email_ph")}
        />
        <label>{t("dashboard.company.description")}</label>
        <input
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder={t("dashboard.company.description_ph")}
        />
        <label>{t("dashboard.company.url")}</label>

        <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
          <input
            value={form.url || ""}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder={t("dashboard.company.url")}
            style={{
              width: "100%",
              padding: "8px 36px 8px 8px",
              boxSizing: "border-box",
            }}
          />
          <FiCopy
            onClick={handleCopy}
            size={20}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: copied ? "green" : "none",
            }}
            title="کپی"
          />
          {copied && (
            <span
              style={{
                position: "absolute",
                right: 36,
                top: "50%",
                transform: "translateY(-50%)",
                color: "green",
                fontSize: 12,
              }}
            >
              کپی شد!
            </span>
          )}
        </div>
        <div className={styles.actions}>
          <ButtonUI variant={VariantType.SECONDARY} type={buttonType.BUTTON} onClick={save}>
            {t("dashboard.common.save")}
          </ButtonUI>
        </div>
      </div>
    </div>
  );
};

export default Company;
