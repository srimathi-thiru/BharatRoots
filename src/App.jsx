import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Register from "./pages/Register";
import AddHeritage from "./pages/AddHeritage";
import HeritageList from "./pages/HeritageList";
import Login from "./pages/Login";

function App() {

  return (
    <Router>

      <div style={{ padding: "20px" }}>

        <h1>BharatRoots</h1>

        {/* Navigation */}
        <nav>
          <Link to="/">View Heritage</Link> | {" "}
          <Link to="/register">Register</Link> | {" "}
          <Link to="/login">Login</Link> | {" "}
          <Link to="/add-heritage">Add Heritage</Link>
        </nav>  
        <hr />

        {/* Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<HeritageList />} />

          <Route path="/register" element={<Register />} />

          <Route path="/add-heritage" element={<AddHeritage />} />

        </Routes>

      </div>

    </Router>
  );
}

export default App;
