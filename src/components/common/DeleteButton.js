import React, { Component } from "react";
import Button from "react-bootstrap/Button";

class DeleteButton extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      smShow: false,
      lgShow: false,
    };
  }

  render() {
    let smClose = () => this.setState({ smShow: false });

    return (
      <Button
        onClick={() => this.setState({ smShow: true })}
        variant="outline-danger"
        style={styles.buttonStyle}
      >
        Delete
      </Button>
    );
  }
}

export default DeleteButton;

const styles = {
  buttonStyle: {
    height: 26,
    width: 60,
    fontSize: 10,
    padding: 0
  }
};
