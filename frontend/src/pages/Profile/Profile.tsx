import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ResetPasswordModal from "../../components/ResetPassword/ResetPassword";
import { ButtonUI } from "../../ui-kit";
import { buttonType, VariantType } from "../../ui-kit/button/button.type";
import { useApiMutation, useApiQuery } from "../../api/apiClient";
import { showNotification } from "../../utils/showNotification";
import styles from "./Profile.module.scss";
import { getItem } from "../../utils/storage";

type ProfileFormData = {
  name: string;
  familyName: string;
  email: string;
  mobileNumber: string;
  profile: { description: string; age: string; gender: string; avatar: File | string | null };
};

const ProfileForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const userId = (getItem<{ id: string }>("user") as any)?.id || "";

  const [showResetModal, setShowResetModal] = useState(false);

  const [data, setData] = useState<any>({
    name: "",
    familyName: "",
    email: "",
    mobileNumber: "",
    profile: { description: "", age: "", gender: "", avatar: null },
  });

  const { data: profile } = useApiQuery<ProfileFormData>({
    key: "profile",
    url: `/profile/${userId}`,
  });

  const updateProfile = useApiMutation<{ message: string }, FormData>({
    url: `/updateProfile/${userId}`,
    method: "POST",
    options: {
      onSuccess: (data) => {
        showNotification(data.message);
      },
      onError: (error: any) => showNotification(error.message),
    },
  });

  useEffect(() => {
    if (profile) {
      setData({
        name: profile.name || "",
        familyName: profile.familyName || "",
        email: profile.email || "",
        mobileNumber: profile.mobileNumber || "",
        description: profile.profile.description || "",
        age: String(profile.profile.age) || "",
        gender: profile.profile.gender || "",
        avatar: profile.profile.avatar ?? null,
      });

      if (profile.profile.avatar) {
        // setPreview(`${profile.profile.avatar}`);
      }
    }
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setData((prev: any) => ({ ...prev, avatar: file }));
      // setPreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("familyName", data.familyName);
    formData.append("email", data.email);
    formData.append("mobileNumber", data.mobileNumber);
    formData.append("description", data.description);
    formData.append("age", data.age);
    formData.append("gender", data.gender);
    if (data.avatar && data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    }

    updateProfile.mutate(formData);
  };
  console.log(data, "data");

  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileContainer}>
        <div className={styles.profileLeft}>
          <div className={styles.avatarGroup}>
            {/* <div className={styles.avatarUpload} onClick={openFileDialog}>
              {preview ? (
                <img
                  src={
                    typeof data.avatar === "string"
                      ? `http://localhost:5000/uploads/${data.avatar}`
                      : preview
                  }
                  alt={t("profile.avatarAlt")}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>+</div>
              )}
            </div> */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>

          <ButtonUI
            type={buttonType.BUTTON}
            variant={VariantType.SECONDARY}
            onClick={() => setShowResetModal(true)}
          >
            {t("profile.changePassword")}
          </ButtonUI>

          <ButtonUI
            type={buttonType.BUTTON}
            variant={VariantType.PRIMARY}
            onClick={() => navigate("/add-new-company")}
          >
            {t("profile.add_new_company")}
          </ButtonUI>
        </div>

        <div className={styles.profileRight}>
          <h2 className={styles.formTitle}>{t("profile.editProfile")}</h2>

          <div className={styles.formGroup}>
            <label>{t("profile.firstName")}</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder={t("profile.firstNamePlaceholder")}
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("profile.lastName")}</label>
            <input
              type="text"
              value={data.familyName}
              onChange={(e) => setData({ ...data, familyName: e.target.value })}
              placeholder={t("profile.lastNamePlaceholder")}
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("profile.email")}</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder={t("profile.emailPlaceholder")}
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("profile.mobileNumber")}</label>
            <input
              type="text"
              value={data.mobileNumber}
              onChange={(e) => setData({ ...data, mobileNumber: e.target.value })}
              placeholder={t("profile.mobileNumberPlaceholder")}
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("profile.age")}</label>
            <input
              type="number"
              value={data.age}
              onChange={(e) => setData({ ...data, age: e.target.value })}
              placeholder={t("profile.agePlaceholder")}
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("profile.gender")}</label>
            <select
              value={data.gender}
              onChange={(e) => setData({ ...data, gender: e.target.value })}
            >
              <option value="">{t("profile.selectOption")}</option>
              <option value="male">{t("profile.male")}</option>
              <option value="female">{t("profile.female")}</option>
              <option value="other">{t("profile.other")}</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>{t("profile.aboutMe")}</label>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder={t("profile.aboutPlaceholder")}
            />
          </div>

          <ButtonUI type={buttonType.BUTTON} variant={VariantType.PRIMARY} onClick={handleSubmit}>
            {t("profile.saveProfile")}
          </ButtonUI>
        </div>
      </div>

      {/* مودال تغییر رمز عبور */}
      {showResetModal && (
        <ResetPasswordModal isOpen={showResetModal} onClose={() => setShowResetModal(false)} />
      )}
    </div>
  );
};

export default ProfileForm;
