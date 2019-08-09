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
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel
} from "@material-ui/core";
import { IPostDetail } from "../../stores";

interface IProps {
  record: IPostDetail;
  open: boolean;
  close: () => void;
  saveedit: () => void;
  functionList: Array<string>;
  categoryList: Array<string>;
  archivalList: Array<string>;
  change: (e: any) => void;
}

function EditModal(props: IProps) {
  const {
    change,
    record,
    open,
    close,
    functionList,
    categoryList,
    archivalList,
    saveedit
  } = props;

  return (
    <Dialog
      key={record.id}
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Edit Record"}</DialogTitle>

      <DialogContent>
        <Grid>
          <TextField
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
          <InputLabel shrink htmlFor="age-label-placeholder">
            Record Function
          </InputLabel>

          <Select
            id="function"
            name="function"
            style={{ width: 400 }}
            value={record.function}
            onChange={change}
          >
            <MenuItem>Choose...</MenuItem>
            {functionList.slice().map((func: any) => (
              <MenuItem key={func.id} value={func.functiontype}>
                {func.functiontype}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item style={{ marginTop: 10 }}>
          <InputLabel shrink htmlFor="age-label-placeholder">
            Record Category
          </InputLabel>
          <Select
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
            label="Description"
            defaultValue={record.description}
            variant="outlined"
            margin="normal"
            onChange={change}
          />
        </Grid>

        <FormControl component="fieldset">
          <FormLabel component="legend">Archival</FormLabel>
          <RadioGroup
            row
            aria-label="archival"
            name="archival"
            defaultValue={record.archival}
          >
            {archivalList.map((x: any) => {
              return (
                <FormControlLabel
                  key={x.id}
                  value={x.archive}
                  control={<Radio color="primary" />}
                  label={x.archive}
                  labelPlacement="end"
                  id="archival"
                  name="archival"
                  onClick={change}
                />
              );
            })}
          </RadioGroup>
        </FormControl>

        <Grid>
          <TextField
            fullWidth
            multiline
            rows="3"
            id="notes"
            name="notes"
            label="Notes"
            defaultValue={record.notes}
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
}

export default EditModal;
