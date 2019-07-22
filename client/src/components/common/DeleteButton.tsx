import * as React from "react";
import Button from "react-bootstrap/Button";

export interface IDeleteButtonState {
  smShow: boolean;
}

export class DeleteButton extends React.Component<IDeleteButtonState> {
  constructor(props, context) {
    super(props, context);
  }

  state: IDeleteButtonState = {
    smShow: false
  };

  render() {
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

//export default DeleteButton;

const styles = {
  buttonStyle: {
    height: 26,
    width: 60,
    fontSize: 10,
    padding: 0
  }
};
