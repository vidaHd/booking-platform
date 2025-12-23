import React from "react";
import styles from "./ConfirmModal.module.scss";
import { useTranslation } from "react-i18next";
import type { ConfirmModalProps } from "./ConfirmModal.type";

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  closeOnBackdrop = true,
}) => {
  const { t } = useTranslation("");

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop) onCancel?.();
  };

  return (
    <div className={styles["confirm-modal-backdrop"]} onClick={handleBackdropClick}>
      <div
        className={styles["confirm-modal"]}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles["cm-header"]}>
          <h3 id="confirm-modal-title" className={styles["cm-title"]}>
            {title}
          </h3>
        </header>

        {message && <div className={styles["cm-message"]}>{message}</div>}

        <footer className={styles["cm-actions"]}>
          <button
            className={`${styles["cm-btn"]} ${styles["cm-btn-cancel"]}`}
            type="button"
            onClick={onCancel}
          >
            {cancelText || t("modal.cancel")}
          </button>
          {onConfirm && (
            <button
              className={`${styles["cm-btn"]} ${styles["cm-btn-confirm"]}`}
              type="button"
              onClick={onConfirm}
            >
              {confirmText || t("modal.confirm")}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default ConfirmModal;
