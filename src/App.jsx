import "./App.css";
import FirstNavbar from "./FirstNavbar";
import Footer from "./Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CarouselPage from "./CarouselPage";
import React from "react"; // Removed useEffect and useState since they're not used
import { collection, getDocs } from "firebase/firestore"; // Correct imports for Firestore
import { db } from "./firebase_setup/firebase"; // Ensure this path is correct

import LandingPage from "./LandingPage";
import Admin from "./Admin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Admin />} />
        {
          <Route path="/store" element={<LandingPage />} />
          /*
          <Route path="/Update/:MacbookId" element={<Update />} />
          <Route path="/addMacbook" element={<AddMacbook />} />
        */
        }
        <></>
      </Routes>
    </Router>
  );
}

export default App;
