import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "../../Dashboard.module.scss";
import { useServices } from "../../../../hooks/useServices";
import { QRCodeCanvas } from "qrcode.react";
import { fetcher, useApiQuery } from "../../../../api/apiClient";
import type { CompanyApiResponse } from "../Services";
import { FiCheckCircle, FiClock, FiXCircle, FiCopy } from "react-icons/fi";
import { showNotification } from "../../../../utils/showNotification";

const Overview: React.FC = () => {
  const { t } = useTranslation();
  const company = localStorage.getItem("company");
  const companyId = company ? JSON.parse(company)?.data?._id : "";

  const { data } = useApiQuery<CompanyApiResponse>({
    key: ["uniq-company"],
    url: `/companies/${companyId}`,
    enabled: !!companyId,
  });

  const { data: bookingsData, refetch } = useApiQuery<any>({
    key: ["bookings"],
    url: `/bookings/${companyId}`,
    enabled: !!companyId,
  });

  const { servicesByCompany } = useServices(companyId);
  const fullUrl =
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:5173") +
    `/${data?.data?.url}`;

  const [bookingStatuses, setBookingStatuses] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (bookingsData?.data) {
      const map: Record<string, string> = {};
      bookingsData.data.forEach((b: any) => (map[b._id] = b.status));
      setBookingStatuses(map);
    }
  }, [bookingsData]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setBookingStatuses((prev) => ({ ...prev, [bookingId]: newStatus }));
    await fetcher({
      url: `/bookings/bookingId/${bookingId}`,
      method: "PUT",
      body: { status: newStatus },
    }).then((res) => {
      showNotification("success", res.message);
    });
    refetch();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <FiCheckCircle color="#10b981" size={18} />;
      case "pending":
        return <FiClock color="#f59e0b" size={18} />;
      case "rejected":
        return <FiXCircle color="#ef4444" size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboardOverview}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>{t("dashboard.overview.today_bookings")}</h3>
          <p className={styles.statNumber}>{bookingsData?.data?.length ?? 0}</p>
        </div>

        <div className={styles.statCard}>
          <h3>{t("dashboard.overview.active_services")}</h3>
          <p className={styles.statNumber}>{servicesByCompany?.data?.length ?? 0}</p>
        </div>

        <div className={styles.statCard}>
          <h3>{t("dashboard.overview.working_hours")}</h3>
          <p className={styles.statNumber}>9–12</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.companyLinkBox}>
            <span>
              {t("dashboard.overview.link")}
              <button
                className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
                onClick={handleCopy}
              >
                <FiCopy />
                {copied ? "Copied!" : "Copy"}
              </button>
            </span>
            <div className={styles.qrWrapper}>
              <QRCodeCanvas value={fullUrl} size={90} />
            </div>
          </div>
        </div>
      </div>

      {Array.isArray(bookingsData?.data) && bookingsData.data.length > 0 && (
        <div className={styles.bookingsSection}>
          <h2>{t("dashboard.bookings.title")}</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.bookingTable}>
              <thead>
                <tr>
                  <th>{t("dashboard.bookings.customer")}</th>
                  <th>{t("dashboard.bookings.service")}</th>
                  <th>{t("dashboard.bookings.time")}</th>
                  <th>{t("dashboard.bookings.date")}</th>
                  <th>{t("dashboard.bookings.status")}</th>
                </tr>
              </thead>
              <tbody>
                {bookingsData.data.map((b: any) => {
                  const status = bookingStatuses[b._id] || b.status;
                  return (
                    <tr key={b._id}>
                      <td>
                        <div className={styles.userCell}>
                          {getStatusIcon(status)}
                          <div>
                            <strong style={{ textAlign: "start" }}>{b.userId.name}</strong>
                            <div style={{ textAlign: "start" }} className={styles.phone}>
                              {b.userId.mobileNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{b.serviceId.title}</td>
                      <td>{b.selectedTimes?.join(" - ")}</td>
                      <td>{b.selectedDate}</td>
                      <td>
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                          className={styles.statusSelect}
                        >
                          <option value="pending">{t("dashboard.bookings.status_pending")}</option>
                          <option value="confirmed">
                            {t("dashboard.bookings.status_confirmed")}
                          </option>
                          <option value="rejected">
                            {t("dashboard.bookings.status_rejected")}
                          </option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
