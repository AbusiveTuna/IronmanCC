import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Runerdle from './runerdle/Runerdle';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/runerdle" element={<Runerdle />} />
      </Routes>
    </Router>
  );
}
export default App
