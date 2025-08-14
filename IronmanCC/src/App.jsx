
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
import Draft from 'pages/draft/Draft';
import Header from 'components/header/Header';

import './App.css'
import BingoBuyInsAdmin from './pages/buyins/BingoBuyInsAdmin';
import AdminBingo from './pages/summerBingo/AdminBingo';

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
          <Route path="/team-tuna-h92812" element={<TeamBoard teamName="Team Tuna"/>} />
          <Route path="/team-chkn-m02919" element={<TeamBoard teamName="Team Chkn"/>} />
          <Route path="/draft-1239090109872389a929830120398" element={<Draft></Draft>} />
          <Route path="/classic-bingo-admin-a4102932" element={<AdminBingo/>}/>

        </Routes>
      </Router>
    </DndProvider>
  )
}

export default App
