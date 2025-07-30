import { createContext, useState, useContext, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider
} from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("whaticket-darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    localStorage.setItem("whaticket-darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const theme = useMemo(
    () =>
      createTheme({
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
      }),
    [darkMode]
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
