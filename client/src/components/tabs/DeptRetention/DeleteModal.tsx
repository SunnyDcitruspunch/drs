import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from "@material-ui/core";
import { observer } from "mobx-react";

interface IProps {
  open: boolean;
  click: () => void;
  pdelete: () => void;
  msg: string;
  title: string;
}

const DeleteModal = observer((props: IProps) => {
  const { open, click, msg, title, pdelete } = props;

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {msg}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={click} color="primary">
            Close
        </Button>
        <Button onClick={pdelete} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default DeleteModal;
