import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import "./index.css";
import App from "./App";

// Remove loading screen when React renders
const removeLoadingScreen = () => {
  const loadingElement = document.getElementById("initial-loading");
  if (loadingElement) {
    setTimeout(() => {
      loadingElement.classList.add("loading-hidden");
      setTimeout(() => {
        loadingElement.remove();
      }, 500);
    }, 500);
  }
};

ReactDOM.render(
  <CssBaseline>
    <App />
  </CssBaseline>,
  document.getElementById("root"),
  removeLoadingScreen
);

// ReactDOM.render(
// 	<React.StrictMode>
// 		<CssBaseline>
// 			<App />
// 		</CssBaseline>,
//   </React.StrictMode>

// 	document.getElementById("root")
// );
