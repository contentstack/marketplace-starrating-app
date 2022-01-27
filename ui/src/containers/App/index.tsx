import React from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import ErrorBoundary from "../../components/ErrorBoundary";
import CustomField from "../CustomField";
import "@contentstack/venus-components/build/main.css";
import "./styles.scss";

/** HomeRedirectHandler - component to nandle redirect based on the window location pathname,
    as react Router does not identifies pathname if the app is rendered in an iframe.
*/
const HomeRedirectHandler = function () {
  if (window?.location?.pathname !== "/") {
    return <Navigate to={{ pathname: window.location.pathname }} />;
  }
  return null;
};

/* App - The main app component that should be rendered */
const App: React.FC = function () {
  return (
    <div className="app">
      <ErrorBoundary>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomeRedirectHandler />} />
            <Route path="/custom-field" element={<CustomField />} />
          </Routes>
        </HashRouter>
      </ErrorBoundary>
    </div>
  );
};

export default App;
