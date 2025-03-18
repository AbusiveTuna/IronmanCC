import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/welcome_page/WelcomePage';
import JustenMeme from './pages/justen_meme/JustenMeme';
import Battleship from './pages/battleship/Battleship';
import NewGame from './pages/battleship/NewGame';
import BoardSetup from './pages/battleship/BoardSetup';
import BingoBuyIns from './pages/bingo_buyins/BingoBuyIns';
import OSRSTiles from './pages/battleship/tiles/OSRSTiles';
import AdminPanel from './pages/battleship/tiles/AdminPanel';
import FarmingTimers from './pages/farming_timers/FarmingTimers';
import Draft from './pages/bingo_buyins/Draft';
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
        <Route path="/" element={<WelcomePage/>} />
        <Route path="/justenTbow" element={<JustenMeme />} />
        <Route path="/battleshipBingo" element={<Battleship />} />
        <Route path="/bingoBuyIns" element={<BingoBuyIns /> } />
        <Route path="/newBattleshipGame" element={<NewGame />} />
        <Route path="/bingoTiles/:teamId" element={<OSRSTiles />} />
        <Route path="/k6d0zl12ete/:teamId" element={<AdminPanel />} />
        <Route path="/setup/:captainId" element={<BoardSetup />} />
        <Route path="/farmingTimers" element={<FarmingTimers />} />
        <Route path="/draftDay2025" element={<Draft/>} />
      </Routes>
      <Footer />
    </Router>
    </DndProvider>
  );
}
export default App
