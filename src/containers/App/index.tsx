import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ErrorBoundary from "../../components/ErrorBoundary";
import { MarketplaceAppProvider } from "../../common/providers/MarketplaceAppProvider";
import { CustomFieldExtensionProvider } from "../../common/providers/CustomFieldExtensionProvider";
import CustomField from "../CustomField";
import "./styles.scss";

const HomeRedirectHandler = function () {
  if (window?.location?.pathname !== "/") {
    return <Navigate to={{ pathname: window.location.pathname }} />;
  }
  return null;
};

const App: React.FC = function () {
  return (
    <div className="app">
      <ErrorBoundary>
        <MarketplaceAppProvider>
          <Routes>
            <Route path="/" element={<HomeRedirectHandler />} />
            <Route
              path="/custom-field"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <CustomFieldExtensionProvider>
                    <CustomField />
                  </CustomFieldExtensionProvider>
                </Suspense>
              }
            />
          </Routes>
        </MarketplaceAppProvider>
      </ErrorBoundary>
    </div>
  );
};

export default App;
