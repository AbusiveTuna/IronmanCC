import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/welcome_page/WelcomePage';
import JustenMeme from './pages/justen_meme/JustenMeme';
import Battleship from './pages/battleship/Battleship';
import Progress from './pages/Progress';
import FarmingTimers from './pages/farming_timers/FarmingTimers';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<WelcomePage/>} />
        <Route path="/justenTbow" element={<JustenMeme />} />
        <Route path="/battleshipBingo" element={<Battleship />} />
        <Route path="/inProgress" element={<Progress />} />
        <Route path="/farmingTimers" element={<FarmingTimers />} />
      </Routes>
      <Footer />
    </Router>
  );
}
export default App
