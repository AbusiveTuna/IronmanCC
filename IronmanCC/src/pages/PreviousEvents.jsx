import React from 'react';
import gooseCox from '../resources/gooseCox.png';
import tunaBingo from '../resources/tunaBingo.png';

import './css/PreviousEvents.css';

const PreviousEvents = () => {
    return (
        <div className="PreviousEvents">
            <div className="event">
                <h2>In October of 2023 Goose's Gringos defeated MX and the Arcanes in a bloody war that saw both teams competing to see who could get all 12 purples from CoX first.</h2>
                <img src={gooseCox} alt="Goose CoX Bingo 2023" className="event-image" />
                <h3>Goose CoX Bingo 2023</h3>
            </div>
            <div className="event">
                <h2>In Feburary of 2024 Team Nsync defeated Team TunaPhish in a brutal race to see who can complete all three raids first.</h2>
                <img src={tunaBingo} alt="Tuna Bingo 2024" className="event-image" />
                <h3>Tuna Bingo 2024</h3>
            </div>
        </div>
    );
}

export default PreviousEvents;