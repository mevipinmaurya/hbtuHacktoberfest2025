import React, { useEffect, useState, useRef } from 'react';
import '../styles/KeyboardShortcutsOverlay.css';
import shortcuts from './shortcutsConfig.json';

const KeyboardShortcutsOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  // Key press listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus trap (basic)
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="shortcuts-overlay"
      tabIndex="-1"
      ref={modalRef}
      role="dialog"
      aria-modal="true"
    >
      <div className="shortcuts-content">
        <h2>Keyboard Shortcuts</h2>
        <ul>
          {shortcuts.map((shortcut, index) => (
            <li key={index}>
              <kbd>{shortcut.keys}</kbd> - {shortcut.description}
            </li>
          ))}
        </ul>
        <button onClick={() => setIsOpen(false)} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default KeyboardShortcutsOverlay;
