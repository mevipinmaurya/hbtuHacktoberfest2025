import React, { lazy, Suspense } from 'react';
import { Routes, Route } from "react-router-dom";
import { FocusModeProvider, useFocusMode } from "../components/FocusModeContext";
import Navbar from "../components/Navbar";
import ScrollToTopButton from "../scroll_to_top_component/ScrollToTopButton";

// Lazy load pages for better code splitting and performance
const Home = lazy(() => import('./Home'));
const NotFound = lazy(() => import('./NotFound'));

// Move navLinks outside component to prevent recreation on every render
const NAV_LINKS = [
  { label: "Home", href: "/" },
  // Add more links as needed
];

function MainAppRoutes() {
  const { focusMode } = useFocusMode();
  
  return (
    <div className={focusMode ? 'focus-mode-active' : ''}>
      <Navbar links={NAV_LINKS} />
      <Suspense fallback={<div className="loading-container">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
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
