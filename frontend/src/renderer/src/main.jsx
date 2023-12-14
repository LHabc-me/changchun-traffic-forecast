import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import "./assets/index.css";
import "./appConfig";

ReactDOM.createRoot(document.getElementById("root")).render(
  <FluentProvider theme={webLightTheme}>
    <App />
  </FluentProvider>
);
