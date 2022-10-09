import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="m-auto">
            <Link className="nav-link" to="/dataset">
              Dataset
            </Link>
            <Link className="nav-link" to="/sensor">
              Sensor
            </Link>
            <Link className="nav-link" to="/form">
              Form
            </Link>
            <Link className="nav-link" to="/get-data">
              Get data
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
