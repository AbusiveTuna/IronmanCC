import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Runerdle from './runerdle/Runerdle';
import WelcomePage from './pages/WelcomePage';
import JustenMeme from './pages/JustenMeme';
import PreviousEvents from './pages/PreviousEvents';
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
        <Route path="/previousEvents" element={<PreviousEvents/>} />
        <Route path="/runerdle" element={<Runerdle />} />
      </Routes>

      <Footer />
    </Router>
  );
}
export default App
