import React from 'react';
import WellnessTracker from './WellnessTracker';
import Navbar from './Navbar';
import '../../styles/Footer.css';
import Footer from './Footer';

function Tracker() {
  return (
    <>
      <Navbar />
      <WellnessTracker />
      <Footer />
    </>
  );
}

export default Tracker;
