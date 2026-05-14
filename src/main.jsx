// 
//
// Bootstrap: create the React root, wrap the app in BrowserRouter so
// any descendant can use routing primitives, and render <App />.
//
// StrictMode is React's development-only consistency checker. It runs
// some effects twice intentionally to catch subtle bugs (impure renders,
// effects that should be idempotent). It has no effect in production
// builds — the production bundle removes it entirely.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);