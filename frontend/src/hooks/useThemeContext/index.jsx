import { useContext } from "react";
import { ThemeContext } from "../../context/DarkMode/context";

export const useThemeContext = () => useContext(ThemeContext);
