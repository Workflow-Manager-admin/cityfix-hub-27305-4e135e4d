import React from 'react';
import './App.css';
import HomePage from './HomePage';
import CityFixHubContainer from './CityFixHubContainer';
import ReportIssue from "./ReportIssue";
import Check from "./Check";
import IssueStatus from "./IssueStatus";
import ContactUs from "./ContactUs";
import About from "./About";
import NavigationBar from './NavigationBar';

// Try to import react-router-dom (if installed)
let Routes, Route, BrowserRouter;
try {
  // eslint-disable-next-line
  ({
    BrowserRouter,
    Routes,
    Route
  } = require('react-router-dom'));
} catch (e) {
  // router not available, fallback non-routing
  BrowserRouter = null;
}

// PUBLIC_INTERFACE
function App() {
  // If react-router-dom is present, use routes
  if (BrowserRouter && Routes && Route) {
    return (
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<CityFixHubContainer />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/check" element={<Check />} />
          <Route path="/status" element={<IssueStatus />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // Fallback: just render HomePage (minimal projects or if router not present)
  // Do NOT render NavigationBar, which uses useLocation and expects Router context!
  return (
    <div>
      <HomePage />
    </div>
  );
}

export default App;