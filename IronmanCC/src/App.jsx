import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Runerdle from './runerdle/Runerdle';
import Header from './Components/Header';
import Footer from './Components/Footer';
import './App.css'

function App() {
  return (
    <Router>
      <Header />
    
      <Routes>
        <Route path="/runerdle" element={<Runerdle />} />
      </Routes>

      <Footer />
    </Router>
  );
}
export default App
