import React, { useState } from 'react';
import eventHistoryData from './eventHistory.json';
import './EventHistory.css';

const EventHistory = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  //TODO: Add previous teams, captains, etc.
  
  return (
    <main className="event-history-container">
      <h1 className="event-history-title">Event History</h1>

      {eventHistoryData.map((item, index) => (
        <article key={index} className="event-card">
          {item.image && (
            <div className="event-image-wrapper" onClick={() => handleImageClick(item.image)}>
              <img
                src={item.image}
                alt={`Poster for ${item.event}`}
                className="event-image"
              />
            </div>
          )}

          <div className="event-details">
            <h2 className="event-name">{item.event}</h2>
            <p className="event-date">{item.date}</p>
            <p className="event-description">{item.description}</p>
            <div className="event-teams">
              <p>
                <strong>Winning Team:</strong> {item.winningTeam}
              </p>
              <p>
                <strong>Losing Team:</strong> {item.losingTeam}
              </p>
            </div>
          </div>
        </article>
      ))}

      {selectedImage && (
        <div className="event-history-modal-overlay" onClick={closeModal}>
          <img src={selectedImage} alt="Full size" className="event-history-modal-image" />
        </div>
      )}
    </main>
  );
};

export default EventHistory;
