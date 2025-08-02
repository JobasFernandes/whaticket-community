import { useContext } from "react";
import { I18nContext } from "../../context/I18n/context";

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n deve ser usado dentro de um I18nProvider");
  }
  return context;
};
