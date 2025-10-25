import { useEffect, useState } from "react";

/**
 * ScrollToTopButton Component
 * 
 * A floating button that appears when the user scrolls down the page.
 * Clicking it smoothly scrolls the page back to the top.
 * 
 * Features:
 * - Only visible after scrolling 300px
 * - Smooth scroll animation
 * - Hover effects with color change and lift
 * - Accessible with aria-label
 */
const ScrollToTopButton = () => {
  // State to control button visibility
  const [isVisible, setIsVisible] = useState(false);

  // Effect to listen for scroll events and toggle button visibility
  useEffect(() => {
    //Button appears when user scrolls more than 300px down
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    // Add scroll event listener when component mounts
    window.addEventListener("scroll", toggleVisibility);

    // Cleanup: Remove event listener when component unmounts
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  /**
   * Scrolls the page to the top with smooth animation
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      // Dynamic classes: button fades in/out and slides up/down based on visibility
      className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Scroll to top"
      style={{
        background: "#6e6ef2ff",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(110, 113, 246, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease", 
      }}
      //Mouse enter handler: Darkens color, lifts button, enhances shadow
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#4040a5ff"; 
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.5)"; 
      }}
      //Mouse leave handler: Resets to original style
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#6e6ef2";
        e.currentTarget.style.transform = "translateY(0)"; 
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)"; 
      }}
    >
      {/* Arrow Up Icon - SVG */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Path draws an upward arrow: vertical line with chevron pointing up */}
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;