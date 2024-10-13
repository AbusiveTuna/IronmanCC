import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Runerdle from './pages/runerdle/Runerdle';
import WelcomePage from './pages/welcome_page/WelcomePage';
import JustenMeme from './pages/justen_meme/JustenMeme';
import PreviousEvents from './pages/previous_events/PreviousEvents';
import OsrsQuiz from './pages/osrs_quiz/OsrsQuiz';
import Header from './components/Header';
import Footer from './components/Footer';
import LukasBingo from './pages/lukas_bingo/LukasBingo';
import BingoAdmin from './pages/lukas_bingo/BingoAdmin';
import './App.css'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<WelcomePage/>} />
        <Route path="/quizMaster" element={<OsrsQuiz/>} />
        <Route path="/justenTbow" element={<JustenMeme />} />
        <Route path="/previousEvents" element={<PreviousEvents/>} />
        <Route path="/runerdle" element={<Runerdle />} />
        <Route path="/lukasBingo" element={<LukasBingo />} />
        <Route path="/bingoAdmin28889" element={<BingoAdmin /> } />
      </Routes>

      <Footer />
    </Router>
  );
}
export default App
