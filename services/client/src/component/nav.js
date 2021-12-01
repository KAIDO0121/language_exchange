import React, { useEffect, useState, useContext } from "react";
import { LoginCxt } from "../component/contexts";
import { useLocation } from "react-router-dom";
import { Container, Navbar } from "react-bootstrap";
import { userLogout } from "../api";

const Nav = () => {
  const location = useLocation();
  const [title, setTitle] = useState("");
  const { isLogin, setLogin } = useContext(LoginCxt);

  useEffect(() => {
    let str = location.pathname.split("/");
    if (str[1]) {
      setTitle(str[1]);
    } else {
      setTitle("home");
    }
  }, [location]);

  const handleLogOut = async () => {
    try {
      const res = await userLogout();
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setLogin(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Navbar className="nav" bg="light" expand="lg">
      <Container>
        <span style={{ width: "3rem" }}>{"    "}</span>
        <Navbar.Brand>{title.toUpperCase()}</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          {isLogin && (
            <Navbar.Text onClick={handleLogOut} style={{ cursor: "pointer" }}>
              Log out
            </Navbar.Text>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Nav;
