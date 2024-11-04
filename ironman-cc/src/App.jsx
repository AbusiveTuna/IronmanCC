import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import Header from './components/Header';

function App() {

  return (
    <Router>
      <Header />
      <div className="page-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      </div>
    </Router>
  )
}

export default App;
