import React from 'react';
import './App.css';
import HomePage from './HomePage';
import CityFixHubContainer from './CityFixHubContainer';

// Try to import react-router-dom (if installed)
let Router, Routes, Route, BrowserRouter;
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
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add other routes as needed, e.g., /app for main CityFixHubContainer */}
          <Route path="/app" element={<CityFixHubContainer />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // Fallback: just render HomePage (minimal projects or if router not present)
  return (
    <div>
      <HomePage />
    </div>
  );
}

export default App;