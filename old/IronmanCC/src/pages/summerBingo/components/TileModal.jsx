import { useEffect } from "react";
import "./TileModal.css";

const TileModal = ({ open, title, children, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    if (open) document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sb-modalOverlay" onClick={onClose}>
      <div
        className="sb-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sb-modalHeader">
          <div className="sb-modalTitle">{title}</div>
          <button type="button" className="sb-modalClose" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="sb-modalBody">{children}</div>
      </div>
    </div>
  );
};

export default TileModal;
