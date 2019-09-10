import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Typography
} from "@material-ui/core";
import { observer } from "mobx-react";

interface IProps {
  open: boolean;
  close: () => void;
  ondelete: () => void;
  msg: string;
  depts: any;
}

const DeleteModal = observer((props: IProps) => {
  const { open, close, msg, ondelete, depts } = props;

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Delete Record"}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description">
          {msg}
        </DialogContentText>
        <Button
          variant="outlined"
          color="primary"
          style={{ marginTop: 10, fontSize: 10, marginBottom: 10 }}
        >
          Download Department List
        </Button>
        <Typography style={{ textAlign: "center" }} gutterBottom>
          {depts}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Close
        </Button>
        <Button onClick={ondelete} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default DeleteModal;
