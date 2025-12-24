import React from 'react';
import { Routes, Route } from "react-router-dom";
import NotFound from "./NotFound";
import FunFact from "../components/FunFact";
import { FocusModeProvider, useFocusMode } from "../components/FocusModeContext";
import Navbar from "../components/Navbar";
import GreetingTimeWidget from '../components/GreetingTimeWidget';
import ScrollToTopButton from "../scroll_to_top_component/ScrollToTopButton";
import HomeContent from '../components/HomeContent';

function MainAppRoutes() {
  const { focusMode } = useFocusMode();
  const navLinks = [
    { label: "Home", href: "/" },
    // Add more links as needed
  ];
  return (
    <div className={focusMode ? 'focus-mode-active' : ''}>
      <Navbar links={navLinks} />
      <Routes>
        {/* 👇 Home route */}
        <Route
          path="/"
          element={
            <div className={focusMode ? 'focus-mode-main' : ''} style={{ textAlign: "center", marginTop: "2rem", paddingBottom: "4rem" }}>
              <h1>Welcome to HBTU Hacktoberfest!</h1>
              <GreetingTimeWidget />
              <FunFact />
              {/* Sample Home Page Content */}
              <HomeContent />
            </div>
          }
        />
        {/* 👇 Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ScrollToTopButton />
    </div>
  );
}

function App() {
  return (
    <FocusModeProvider>
      <MainAppRoutes />
    </FocusModeProvider>
  );
}

export default App;
