
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from 'pages/landing/LandingPage';
import JustenTbow from 'pages/justenTbow/JustenTbow';
import EventHistory from 'pages/eventHistory/EventHistory';
import BingoBuyIns from 'pages/buyins/BingoBuyIns';
import FarmingTimers from 'pages/farmingTimers/FarmingTimers';
import Header from 'components/header/Header';
import './App.css'

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/justen-tbow" element={<JustenTbow />} />
        <Route path="/farming-timers" element={<FarmingTimers />} />
        <Route path="/event-history" element={<EventHistory />} />
        <Route path="/buy-ins" element={<BingoBuyIns />} />
      </Routes>
    </Router>
  )
}

export default App
