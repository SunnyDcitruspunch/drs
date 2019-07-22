import * as React from "react";
import Navbar from "react-bootstrap/Navbar";

export class Nav extends React.Component {
  render() {
    return (
      <Navbar bg="light" style={{height: 28}}>
        <Navbar.Brand style={{fontSize: 16}}>Department Retention Schedule</Navbar.Brand>
      </Navbar>
    );
  }
}

// export default Nav;
