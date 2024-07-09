import React, { useState } from "react";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/Login";
import GameApp from "./games/GameApp";
import NotFound from "./pages/NotFound";
import Board from "./components/UI/Bottom.jsx";
import Main from "./pages/Main.jsx";
import ProductCreate from "./components/Boards/ProductCreate.jsx";
import ProductDetail from "./components/Boards/ProductCreate.jsx";
import ProductList from "./components/Boards/ProductList.jsx";
import "./static/css/App.css";

function App() {
  const [isListOpen, setIsListOpen] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/main"
          element={
            <Main isListOpen={isListOpen} setIsListOpen={setIsListOpen}
            />
          }
        />
        {/* <Route path="/board" element={<Board />} /> */}
        {/* <Route path="/game" element={<GameApp />} /> */}
        <Route path="/PC" element={<ProductCreate />} />
        <Route path="/PD" element={<ProductDetail />} />
        <Route path="/PL" element={<ProductList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
