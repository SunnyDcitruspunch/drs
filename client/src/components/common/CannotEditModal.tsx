import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from "@material-ui/core";

function CannotEditModal(props: any) {
  const { open, close, click } = props;

  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Cannot Edit Record"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Cannot edit common records.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={click} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CannotEditModal;
