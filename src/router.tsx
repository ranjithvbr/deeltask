import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InvoiceList from "./InvoiceList";
import InvoiceDetail from "./InvoiceDetail";
import { ReactComponent as DeelLogo } from "./assert/deel-logo-blue.svg";
import "./index.css";

const AppRouter = () => {
  return (
    <Router>
      <header className="header">
        <DeelLogo />
      </header>
      <main className="app-container">
        <Routes>
          <Route path="/" Component={InvoiceList} />
          <Route path="/invoice-detail/:id" Component={InvoiceDetail} />
        </Routes>
      </main>
    </Router>
  );
};

export default AppRouter;
