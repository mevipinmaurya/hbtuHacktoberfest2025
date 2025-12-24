/**
 * Home Component
 * 
 * The main landing page for the HBTU Hacktoberfest application.
 * Displays a welcome message along with various interactive widgets including
 * time-based greetings, fun facts, and additional home content.
 * 
 * Features:
 * - Focus mode integration for distraction-free viewing
 * - Responsive greeting widget based on user's local time
 * - Random fun facts display
 * - Modular content sections
 * 
 * @component
 * @returns {JSX.Element} The rendered home page
 */

import React from 'react';
import { useFocusMode } from "../components/FocusModeContext";
import GreetingTimeWidget from '../components/GreetingTimeWidget';
import FunFact from "../components/FunFact";
import HomeContent from '../components/HomeContent';
import '../styles/Home.css';

function Home() {
  // Access focus mode state from context to toggle UI styling
  const { focusMode } = useFocusMode();
  
  return (
    <div className={`home-container ${focusMode ? 'focus-mode-main' : ''}`}>
      {/* Main heading */}
      <h1>Welcome to HBTU Hacktoberfest!</h1>
      
      {/* Time-based personalized greeting */}
      <GreetingTimeWidget />
      
      {/* Display random fun fact */}
      <FunFact />
      
      {/* Additional home page content and features */}
      <HomeContent />
    </div>
  );
}

export default Home;
