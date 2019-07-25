import * as React from "react";
import Navbar from "react-bootstrap/Navbar";

function Nav(): JSX.Element {
  return (
    <Navbar bg="light" style={{ height: 28 }}>
      <Navbar.Brand style={{ fontSize: 16 }}>
        Department Retention Schedule
      </Navbar.Brand>
    </Navbar>
  );
}

export default Nav;
