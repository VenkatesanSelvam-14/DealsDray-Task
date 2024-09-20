import React,{ useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContextProvider from "./Components/Context/ContextProvider";
import LoginPage from "./Components/Pages/Login/Index";
import HomePage from "./Components/Pages/Home/Index";

function App() {
  return (
    <>
      <ContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/home" element={<HomePage/>} />
          </Routes>
        </Router>
      </ContextProvider>
    </>
  );
}

export default App;
