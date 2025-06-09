import React from 'react';
import './App.css';
import CityFixHubContainer from './CityFixHubContainer';
import UserSignUp from './UserSignUp';

// PUBLIC_INTERFACE
function App() {
  // Toggle between SignUp and main app screen here as needed
  // For this task, show sign-up form above the main app as a demo
  // In real production, use React Router for proper routes ("/signup", "/dashboard", etc.)
  return (
    <div>
      {/* --- USER SIGN UP DEMO --- */}
      <UserSignUp />
      {/* --- MAIN APP --- */}
      <CityFixHubContainer />
    </div>
  );
}

export default App;