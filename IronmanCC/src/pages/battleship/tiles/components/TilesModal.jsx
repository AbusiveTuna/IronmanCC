import React from "react";
import './TilesModal.css';

const TilesModal = ({ onClose, children }) => {
    return (
        <div className="tiles-modal-overlay" onClick={onClose}>
            <div className="tiles-modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export default TilesModal;
