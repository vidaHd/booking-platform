import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import { clearUser } from "../../slices/userSlice";
import { ButtonUI } from "../../ui-kit";
import { VariantType } from "../../ui-kit/button/button.type";
import { useAppContext } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import styles from "./Header.module.scss";
import { useApiQuery } from "../../api/apiClient";
import { FiUser, FiLogOut, FiSettings, FiSun, FiMoon, FiGlobe } from "react-icons/fi";
import { getItem, removeItem, setItem } from "../../utils/storage";

const Header = () => {
  const { t } = useTranslation();
  const name = useSelector((state: RootState) => state.user);
  const { language, changeLanguage, theme, toggleTheme } = useAppContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = (getItem<{ id: string }>("user") as any)?.id || "";

  const { data: company } = useApiQuery<any>({
    key: ["get-company", userId],
    url: userId ? `/companies/user/${userId}` : "",
    enabled: !!userId,
  });

  const { data: profile, refetch } = useApiQuery<any>({
    key: ["get-profile", userId],
    url: userId ? `/profile/${userId}` : "",
  });

  const savedCompany = (getItem<string>("selectedCompany") as string) || "";
  const [selectedCompany, setSelectedCompany] = useState(savedCompany);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setMenuOpen(false);
    window.addEventListener("resize", handleResize);
    refetch();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (company?.data?.length > 0 && !savedCompany) {
      const firstCompanyId = String(company.data[0]._id);
      setSelectedCompany(firstCompanyId);
      setItem("selectedCompany", firstCompanyId);
    }
  }, [company]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logOut = () => {
    removeItem("token");
    removeItem("user");
    removeItem("company");
    removeItem("selectedCompany");
    dispatch(clearUser());
    navigate("/login");
    setMenuOpen(false);
  };
  useEffect(() => {
    if (!savedCompany) {
      setSelectedCompany(String(company?.data[0]?._id));
    }
  }, []);
  const handleSelectCompany = (companyId: string) => {
    setSelectedCompany(companyId);
    setItem("selectedCompany", companyId);
    setMenuOpen(false);
    goToDashboard();
  };

  const goToDashboard = () => {
    if (selectedCompany) navigate(`/dashboard/${selectedCompany}`);
    setMenuOpen(false);
  };

  const hasCompanies = Array.isArray(company?.data) && company.data.length > 0;
  const selectedCompanyName =
    company?.data?.find((c: any) => c._id === selectedCompany)?.companyName || "";

  return (
    <motion.header
      className={`${styles.header} ${theme === "dark" ? styles.dark : styles.light} ${
        language === "fa" ? styles.rtl : ""
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles.companyName} onClick={() => navigate("/")}>
        {selectedCompanyName ?? company?.data?.companyName}
      </h2>

      <div className={styles.nav}>
        {!name.name ? (
          <>
            <ButtonUI variant={VariantType.PRIMARY} onClick={() => navigate("/login")}>
              {t("header.login")}
            </ButtonUI>
            <ButtonUI variant={VariantType.SECONDARY} onClick={() => navigate("/register")}>
              {t("header.register")}
            </ButtonUI>
          </>
        ) : (
          <div className={styles.userMenu}>
            <div className={styles.userAvatarWrapper}>
              <div
                className={styles.userAvatar}
                ref={avatarRef}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {name.profile?.avatar ? <FiUser size={22} /> : <FiUser size={22} />}
              </div>
              <div className={styles.userAvatarWrapper}>
                <span className={styles.userNameText}>
                  {profile?.name} {profile?.familyName}
                </span>
              </div>
            </div>
            {menuOpen && (
              <div
                ref={menuRef}
                className={styles.dropdown}
                style={{
                  textAlign: language === "fa" ? "right" : "left",
                  right: language === "fa" ? "unset" : "30%",
                  left: language === "fa" ? "30%" : "unset",
                }}
              >
                <div className={styles.userHeader}>
                  <div>
                    <strong>
                      {profile?.name} {profile?.familyName}
                    </strong>
                  </div>
                </div>

                {hasCompanies && (
                  <div className={styles.companySection}>
                    <hr />

                    <span className={styles.sectionTitle}>{t("header.companies")}</span>
                    <div className={styles.companyList}>
                      {hasCompanies &&
                        company.data.map((c: any) => (
                          <button
                            key={c._id}
                            onClick={() => handleSelectCompany(c._id)}
                            className={`${styles.companyItem} ${
                              selectedCompany === c._id ? styles.active : ""
                            }`}
                          >
                            {c.companyName}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <hr />

                <button
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                >
                  <FiSettings /> {t("header.profile")}
                </button>

                <button
                  onClick={() => {
                    toggleTheme();
                    setMenuOpen(false);
                  }}
                >
                  {theme === "dark" ? <FiSun /> : <FiMoon />} {t("header.theme")}
                </button>

                <button
                  onClick={() => {
                    changeLanguage(language === "en" ? "fa" : "en");
                    setMenuOpen(false);
                  }}
                >
                  <FiGlobe /> {t("header.language")}
                </button>

                <hr />

                <button onClick={logOut}>
                  <FiLogOut /> {t("header.logout")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
