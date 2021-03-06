import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import UserProfile from "./pages/userProfile";
import React, { useState, useEffect } from "react";
import { PopBoxCxt, LoginCxt } from "./component/contexts";
import PopBox from "./component/popBox";
import { tokenRefresh } from "./api";
import Dashboard from "./pages/dashboard";
import { slide as Menu } from "react-burger-menu";
import Search from "./pages/search";
import Nav from "./component/nav";
import "./style/App.css";
import "./style/Burger.css";

const defBtns = {
  loginBtns: [
    {
      path: "/dashboard",
      text: "Dashboard",
    },
    {
      path: "/",
      text: "Home",
    },
    {
      path: "/search",
      text: "Search",
    },
  ],
  notLoginBtns: [
    {
      path: "/",
      text: "Home",
    },
    {
      path: "/search",
      text: "Search",
    },
  ],
};

const App = () => {
  const [popbox, setPopbox] = useState({
    isShow: false,
    content: "",
  });

  const [isLogin, setLogin] = useState(false);
  const token = localStorage.getItem("access_token");

  if (isLogin && token) {
    setInterval(() => {
      tokenRefresh()
        .then((res) => {
          localStorage.setItem("access_token", res.data.access_token);
        })
        .catch((err) => console.error(err));
    }, 295000);
  }

  useEffect(() => {
    if (token) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, [token]);

  return (
    <>
      <PopBoxCxt.Provider value={{ setPopbox }}>
        <PopBox {...popbox} />
        <LoginCxt.Provider value={{ setLogin, isLogin }}>
          <Router>
            <Menu>
              {isLogin &&
                defBtns.loginBtns.map((el) => (
                  <Link key={el.text} to={el.path}>
                    {el.text}
                  </Link>
                ))}
              {!isLogin &&
                defBtns.notLoginBtns.map((el) => (
                  <Link key={el.text} to={el.path}>
                    {el.text}
                  </Link>
                ))}
            </Menu>
            <Nav />
            <Routes>
              <Route exact path="/" element={<Home />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/dashboard" element={<Dashboard />}></Route>
              <Route path="/search" element={<Search />}></Route>
              <Route path="/userProfile/:id" element={<UserProfile />}></Route>
            </Routes>
          </Router>
        </LoginCxt.Provider>
      </PopBoxCxt.Provider>
    </>
  );
};

export default App;
