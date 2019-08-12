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
  open: boolean,
  click:() => void,
  close:() => void,
  msg: string,
  title: string
}

const MessageModal = observer((props: IProps) => {
  const { open, close, click, msg, title } = props;

  return (
    <Dialog
      open={open}
      onClose={close}
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
        <Button onClick={click} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
})

export default MessageModal;
