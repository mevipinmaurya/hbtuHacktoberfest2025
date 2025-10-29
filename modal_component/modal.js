const openBtn = document.getElementById("openModalBtn");
const modalOverlay = document.getElementById("modalOverlay");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeModalBtn");
let lastFocusedElement = null;


function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ));
}

function openModal() {
  lastFocusedElement = document.activeElement;
  modalOverlay.style.display = "flex";
  modalOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const focusables = getFocusableElements(modal);
  if (focusables.length) focusables[0].focus();
  else modal.focus();
}


function closeModal() {
  modalOverlay.style.display = "none";
  modalOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusedElement) lastFocusedElement.focus();
}


openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});


window.addEventListener("keydown", (e) => {
  if (modalOverlay.style.display !== "flex") return;

  
  if (e.key === "Escape") {
    closeModal();
  }

  
  if (e.key === "Tab") {
    const focusables = getFocusableElements(modal);
    if (!focusables.length) {
      e.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
});
