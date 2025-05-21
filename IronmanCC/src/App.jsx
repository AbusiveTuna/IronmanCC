import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/welcome_page/WelcomePage';
import JustenMeme from './pages/justen_meme/JustenMeme';
import BingoBuyIns from './pages/buyins/BingoBuyIns';
import FarmingTimers from './pages/farming_timers/FarmingTimers';
import EverythingBingo from './pages/everything_bingo/EverythingBingo';
import EventHistory from './pages/event_history/EventHistory';
import Header from './components/header/Header';
import Footer from './components/Footer';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import './App.css'

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/justenTbow" element={<JustenMeme />} />
          <Route path="/everythingBingo" element={<EverythingBingo />} />
          <Route path="/bingoBuyIns" element={<BingoBuyIns />} />
          <Route path="/eventHistory" element={<EventHistory />} />
          <Route path="/farmingTimers" element={<FarmingTimers />} />
        </Routes>
        <Footer />
      </Router>
    </DndProvider>
  );
}
export default App