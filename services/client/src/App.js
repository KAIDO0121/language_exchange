import "./style/App.css";
import "./style/Burger.css";
import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import UserProfile from "./pages/userProfile";
import React, { useState } from "react";
import { PopBoxCxt } from "./component/contexts";
import PopBox from "./component/popBox";
import UploadAvatar from "./pages/uploadAvatar";
import { tokenRefresh } from "./api";
import Dashboard from "./pages/dashboard";
import { slide as Menu } from "react-burger-menu";
import Search from "./pages/search";
import Nav from "./component/nav";

const App = () => {
  const [popbox, setPopbox] = useState({
    isShow: false,
    content: "",
  });
  if (localStorage.getItem("access_token")) {
    setInterval(() => {
      tokenRefresh()
        .then((res) => {
          localStorage.setItem("access_token", res.data.access_token);
        })
        .catch((err) => console.error(err));
    }, 240000);
  }
  return (
    <>
      <PopBoxCxt.Provider value={{ setPopbox }}>
        <PopBox isShow={popbox.isShow} content={popbox.content} />

        <Router>
          <Menu>
            <Link className="menu-item" to="/">
              Home
            </Link>
            <Link className="menu-item" to="/dashboard">
              Dashboard
            </Link>
          </Menu>
          <Nav />
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/uploadAvatar" element={<UploadAvatar />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/search" element={<Search />}></Route>
            <Route path="/userProfile/:id" element={<UserProfile />}></Route>
          </Routes>
        </Router>
      </PopBoxCxt.Provider>
    </>
  );
};

export default App;
