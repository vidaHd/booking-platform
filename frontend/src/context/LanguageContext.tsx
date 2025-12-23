import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import i18n from "../i18n";
import { getItem, setItem } from "../utils/storage";

type Language = "en" | "fa";
type Theme = "light" | "dark";

interface AppContextProps {
  language: Language;
  changeLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => (getItem<Language>("language") as Language) || "fa");
  const [theme, setTheme] = useState<Theme>(() => (getItem<Theme>("theme") as Theme) || "light");

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      setItem("theme", next);
      return next;
    });
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setItem("language", lang);
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      "dir",
      language === "fa" ? "ltr" : "rtl",
    );
    document.documentElement.setAttribute("data-theme", theme);
    i18n.changeLanguage(language);
  }, [language, theme]);
console.log(document.documentElement,'language');

  return (
    <AppContext.Provider
      value={{ language, changeLanguage, theme, toggleTheme }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
};
