import * as React from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  FormLabel
} from "@material-ui/core";
import { IRecord } from "../../stores";
import ClassificationCheckboxes from "./ClassificationCheckboxes";
import FunctionDropdown from "./FunctionDropdown";
import { observer } from "mobx-react";

interface IProps {
  record: IRecord;
  open: boolean;
  close: () => void;
  saveedit: (e: any) => void;
  functionList: Array<Object>;
  categoryList: Array<Object>;
  change: (e: any) => void;
  disabled: boolean;
  title: any
}

const EditModal = observer((props: IProps) => {
  const {
    change,
    record,
    open,
    close,
    functionList,
    categoryList,
    saveedit,
    disabled,
    title
  } = props;

  return (
    <Dialog
      key={record.id}
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>

      <DialogContent>
        <Grid>
          <TextField
            disabled={disabled}
            fullWidth
            id="recordtype"
            name="recordtype"
            label="Record Type"
            defaultValue={record.recordtype}
            variant="outlined"
            onChange={change}
            margin="normal"
          />
        </Grid>

        <Grid item style={{ marginBottom: 10 }}>
          <FunctionDropdown
            disabled={disabled}
            title={"Record Function"}
            id={"function"}
            name={"function"}
            value={record.function}
            change={change}
            dropdown={functionList}
          />
        </Grid>

        <Grid item style={{ marginTop: 10 }}>
          <InputLabel shrink>Record Category</InputLabel>
          <Select
            disabled={disabled}
            id="recordcategoryid"
            name="recordcategoryid"
            style={{ width: 400 }}
            value={record.recordcategoryid}
            onChange={change}
          >
            <MenuItem>Choose...</MenuItem>
            {categoryList.map((category: any) => (
              <MenuItem key={category.id} value={category.recordcategoryid}>
                {category.recordcategoryid}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid>
          <TextField
            fullWidth
            multiline
            rows="3"
            id="description"
            name="description"
            label="Retention Description"
            defaultValue={record.description}
            variant="outlined"
            margin="normal"
            disabled={disabled}
            onChange={change}
          />
        </Grid>

        <Grid>
          <TextField
            fullWidth
            multiline
            rows="3"
            id="comments"
            name="comments"
            label="Comments"
            defaultValue={record.comments}
            variant="outlined"
            margin="normal"
            onChange={change}
          />
        </Grid>

        <Grid>
          <FormControl component="fieldset">
            <FormLabel component="legend">Classification</FormLabel>
            <ClassificationCheckboxes 
            disabled={disabled}
            change={change} 
              />
          </FormControl>
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
});

export default EditModal;
