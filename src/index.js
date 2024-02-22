import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { AppProvider } from "./context/AppContext";
import SiteLayout from "./SiteLayout";
import Contracts from "./pages/Contracts";
import Jobs from "./pages/Jobs";
import Balances from "./pages/Balances";
import Admin from "./pages/Admin";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Contracts />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/balances" element={<Balances />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AppProvider>
);

reportWebVitals();
