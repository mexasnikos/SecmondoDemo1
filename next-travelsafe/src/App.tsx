import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Quote from './pages/Quote';
import About from './pages/About';
import Contact from './pages/Contact';
import LearnMore from './pages/LearnMore';
import Privacy from './pages/Privacy';
import RegularStay from './pages/RegularStay';
import AnnualMultiTrip from './pages/AnnualMultiTrip';
import Comprehensive from './pages/Comprehensive';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/regular-stay" element={<RegularStay />} />
            <Route path="/annual-multi-trip" element={<AnnualMultiTrip />} />
            <Route path="/comprehensive" element={<Comprehensive />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
