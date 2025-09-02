
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

// Pages
import LandingPage from 'pages/landing/LandingPage';
import JustenTbow from 'pages/justenTbow/JustenTbow';
import EventHistory from 'pages/eventHistory/EventHistory';
import BingoBuyIns from 'pages/buyins/BingoBuyIns';
import FarmingTimers from 'pages/farmingTimers/FarmingTimers';
import Header from 'components/header/Header';

import WinterBingo from './pages/winterBingo/WinterBingo';
import WinterBingoAdmin from './pages/winterBingo/adminPanel/WinterBingoAdmin';
import PlaceHolder from './pages/winterBingo/PlaceHolder';

import './App.css'
import BingoBuyInsAdmin from './pages/buyins/BingoBuyInsAdmin';

function App() {

  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/justen-tbow" element={<JustenTbow />} />
          <Route path="/farming-timers" element={<FarmingTimers />} />
          <Route path="/event-history" element={<EventHistory />} />

          <Route path="/winter-bingo" element={<PlaceHolder />} />
          <Route path="/winter-bingo-test-8012" element={<WinterBingo />} />
          <Route path="/winter-bingo-admin" element={<WinterBingoAdmin />} />

          <Route path="/buy-ins" element={<BingoBuyIns />} />
          <Route path="/buy-ins-admin-82699" element={<BingoBuyInsAdmin />} />
        </Routes>
      </Router>
    </DndProvider>
  )
}

export default App
