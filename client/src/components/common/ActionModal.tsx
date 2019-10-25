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
  close: () => void;
  action: () => void;
  msg: string;
  title: string;
  btn: string;
}

export const ActionModal = observer((props: IProps) => {
  const { open, close, msg, title, action, btn } = props;

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
        <Button onClick={close} color="primary">
            Close
        </Button>
        <Button onClick={action} color="primary">
          {btn}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

