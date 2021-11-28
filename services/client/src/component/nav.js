import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Navbar } from "react-bootstrap";

const Nav = () => {
  const location = useLocation();
  const [title, setTitle] = useState("");

  useEffect(() => {
    let str = location.pathname.split("/");
    if (str[1]) {
      setTitle(str[1]);
    } else {
      setTitle("home");
    }
  }, [location]);

  return (
    <Navbar bg="light" expand="lg" style={{ height: "4rem" }}>
      <Container>
        <span style={{ width: "3rem" }}>{"    "}</span>
        <Navbar.Brand>{title.toUpperCase()}</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>Log out</Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Nav;
