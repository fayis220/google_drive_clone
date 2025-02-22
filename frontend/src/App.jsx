import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Drive from "./pages/drive";
import axios from "axios";

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/drive" element={<Drive />} />
      </Routes>
    </Router>
  );
};

export default App;
