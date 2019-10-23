import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid
} from "@material-ui/core";
import { IRecord } from "../../stores";
import { observer } from "mobx-react";

// Not useing this modal for now. 

interface IProps {
  open: boolean;
  close: () => void;
  saveedit: (e: any) => void;
  change: (e: any) => void;
  disabled?: boolean
  defaultvalue: string
  key: number
  record: IRecord
}

const EditCommonModal = observer((props: IProps) => {
  const {
    change,
    defaultvalue,
    open,
    close,
    saveedit,
    key,
    record
  } = props;

  return (
    <Dialog
      key={key}
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Edit Record"}</DialogTitle>

      <DialogContent>
        <Grid>
          <TextField
            fullWidth
            multiline
            rows="3"
            id="comments"
            name="comments"
            label="Comments"
            defaultValue={defaultvalue}
            variant="outlined"
            margin="normal"
            onChange={change}
          />
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={saveedit} color="primary" autoFocus>
          Save Changes
        </Button>
        <Button onClick={close} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
})

export default EditCommonModal;
