
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

// Pages
import LandingPage from 'pages/landing/LandingPage';
import JustenTbow from 'pages/justenTbow/JustenTbow';
import EventHistory from 'pages/eventHistory/EventHistory';
import BingoBuyIns from 'pages/buyins/BingoBuyIns';
import FarmingTimers from 'pages/farmingTimers/FarmingTimers';
import SummerBingo from 'pages/summerBingo/SummerBingo';
import SummerBingoTimer from 'pages/summerBingo/SummerBingoTimer';
import TeamBoard from 'pages/summerBingo/TeamBoard';

import Header from 'components/header/Header';

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
          <Route path="/summer-bingo" element={<SummerBingoTimer />} />
          <Route path="/event-history" element={<EventHistory />} />
          <Route path="/buy-ins" element={<BingoBuyIns />} />
          <Route path="/buy-ins-admin-82699" element={<BingoBuyInsAdmin />} />


          <Route path="/summer-bingo-testing" element={<SummerBingo/>} />
          <Route path="/teamA" element={<TeamBoard teamName="Team A"/>} />
          <Route path="/teamB" element={<TeamBoard teamName="Team B"/>} />

        </Routes>
      </Router>
    </DndProvider>
  )
}

export default App
