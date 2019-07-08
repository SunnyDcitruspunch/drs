import React, { Component } from "react";
import Button from "react-bootstrap/Button";

class EditButton extends Component {
  render() {
    return <Button variant="outline-warning" style={ styles.buttonStyle }>Edit</Button>;
  }
}

export default EditButton;

const styles = {
  buttonStyle: {
    height: 26,
    width: 60,
    fontSize: 10,
    padding: 0
  }
};
