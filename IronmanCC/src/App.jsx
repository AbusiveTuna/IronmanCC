
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from 'pages/landing/LandingPage';
import JustenTbow from 'pages/justenTbow/JustenTbow';
import EventHistory from 'pages/eventHistory/EventHistory';
import BingoBuyIns from 'pages/buyins/BingoBuyIns';

import Header from 'components/header/Header';
import './App.css'

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/justenTbow" element={<JustenTbow />} />
        <Route path="/eventHistory" element={<EventHistory />} />
        <Route path="/bingoBuyIns" element={<BingoBuyIns />} />
      </Routes>
    </Router>
  )
}

export default App
