import { createContext, useState, useContext, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider
} from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { ptBR } from "@material-ui/core/locale";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("whaticket-darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("whaticket-darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const [locale, setLocale] = useState();

  useEffect(() => {
    const i18nlocale = localStorage.getItem("i18nextLng");
    if (i18nlocale) {
      const browserLocale =
        i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

      if (browserLocale === "ptBR") {
        setLocale(ptBR);
      }
    }
  }, []);

  const theme = useMemo(
    () =>
      createTheme(
        {
          palette: {
            type: darkMode ? "dark" : "light",
            primary: {
              main: darkMode ? "#90caf9" : "#1976d2"
            },
            secondary: {
              main: darkMode ? "#f48fb1" : "#dc004e"
            },
            background: {
              default: darkMode ? "#121212" : "#f5f5f5",
              paper: darkMode ? "#1e1e1e" : "#ffffff"
            },
            text: {
              primary: darkMode ? "#ffffff" : "rgba(0, 0, 0, 0.87)",
              secondary: darkMode ? "#b3b3b3" : "rgba(0, 0, 0, 0.6)"
            },
            divider: darkMode
              ? "rgba(255, 255, 255, 0.12)"
              : "rgba(0, 0, 0, 0.12)"
          },
          scrollbarStyles: {
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px"
            },
            "&::-webkit-scrollbar-thumb": {
              boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
              backgroundColor: "#e8e8e8"
            }
          },
          overrides: {
            MuiCssBaseline: {
              "@global": {
                "*::-webkit-scrollbar": {
                  width: "8px",
                  height: "8px"
                },
                "*::-webkit-scrollbar-track": {
                  backgroundColor: darkMode ? "#2c2c2c" : "#f1f1f1"
                },
                "*::-webkit-scrollbar-thumb": {
                  backgroundColor: darkMode ? "#555" : "#c1c1c1",
                  borderRadius: "4px"
                },
                "*::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: darkMode ? "#777" : "#a8a8a8"
                }
              }
            }
          }
        },
        locale
      ),
    [darkMode, locale]
  );

  const contextValue = useMemo(() => ({ darkMode, toggleTheme }), [darkMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useThemeContext = () => useContext(ThemeContext);
