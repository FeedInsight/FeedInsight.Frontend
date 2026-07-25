/**
 * src/index.js
 * ----------------------------------------------------------------------------
 * Application bootstrap. Responsibilities ONLY:
 *   1. Mount the React tree into #root.
 *   2. Wrap the app with global providers, in this exact order (outer -> inner):
 *        Redux <Provider store>
 *          -> BrowserRouter
 *            -> AuthProvider (src/context/AuthContext.jsx)
 *              -> TenantProvider (src/context/TenantContext.jsx)
 *                -> ToastProvider (src/context/ToastContext.jsx)
 *                  -> App (src/App.jsx)
 *   3. Import global stylesheets (reset -> variables -> global), in that order.
 *
 * Do NOT put routing logic, layout, or business logic here. That belongs in
 * src/App.jsx and src/routes/AppRoutes.jsx.
 * ----------------------------------------------------------------------------
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import store from "./store/store";
import { AuthProvider } from "./context/AuthContext";
import { TenantProvider } from "./context/TenantContext";
import { ToastProvider } from "./context/ToastContext";
import App from "./App";

import "./assets/styles/reset.css";
import "./assets/styles/variables.css";
import "./assets/styles/global.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <TenantProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </TenantProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
