import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/welcome_page/WelcomePage';
import JustenMeme from './pages/justen_meme/JustenMeme';
import RaidBingo from './pages/raid_bingo/RaidBingo';
import RaidBingoAdmin from './pages/raid_bingo/RaidBingoAdmin';
import BingoBuyIns from './pages/buyins/BingoBuyIns';
import FarmingTimers from './pages/farming_timers/FarmingTimers';
import EventHistory from './pages/event_history/EventHistory';
import Draft from './pages/draft/Draft';
import Header from './components/Header';
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
          <Route path="/raidBingo" element={<RaidBingo />} />
          <Route path="/gja92plq/raidBingoAdmin" element={<RaidBingoAdmin />} />
          <Route path="/draft" element={<Draft />} />
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