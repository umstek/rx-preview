import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

// reaflow fix https://github.com/kieler/elkjs/issues/127
(window as any).g = null;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
