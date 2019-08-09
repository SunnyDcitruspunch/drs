import React, { Component } from "react";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
  FormControl
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { IUniqueStore } from "../../stores/UniqueStore";
import { IDepartmentStore } from "../../stores/DepartmentStore";
import Snackbar from "../common/Snackbar";

interface IProps {
  DepartmentStore: IDepartmentStore;
  UniqueStore: IUniqueStore;
}

interface IState {
  smShow: boolean;
  snackbarShow: boolean;
  needRecordType: boolean;
  open: boolean;
  archivalOptions: Array<string>;
}

const AddUniqueRecords = inject("UniqueStore", "DepartmentStore")(
  observer(
    class AddUniqueRecords extends Component<IProps, IState> {
      componentDidMount() {
        this.props.UniqueStore.fetchFunctions();
        this.props.UniqueStore.fetchCategory();
      }

      state: IState = {
        smShow: false,
        snackbarShow: true,
        needRecordType: false,
        open: false,
        archivalOptions: ["Archival", "Vital", "Highly Confidential"]
      };

      submitRecords = (e: any) => {
        if (this.props.DepartmentStore.selectedDepartment === "") {
          this.setState({ smShow: true });
        } else if (this.props.UniqueStore.uniquerecords.recordtype === "") {
          this.setState({ needRecordType: true });
        } else {
          this.props.UniqueStore.getDepartmentName(
            this.props.DepartmentStore.selectedDepartment
          );
          this.props.UniqueStore.submitRecords();
          this.setState({ snackbarShow: true });
          this.setState({ needRecordType: false });
          this.setState({
            snackbarShow: true
          });

          setInterval(() => {
            this.setState({ snackbarShow: false });
          }, 3000);
        }
      };

      render() {
        let smClose = () => this.setState({ smShow: false });
        let needRecordType = () => this.setState({ needRecordType: false });
        const { UniqueStore } = this.props;

        return (
          <Container style={{ flexGrow: 1 }}>
            <Grid item sm={12}>
              <TextField
                id="recordtype"
                name="recordtype"
                label="Record Type"
                style={{ width: 500 }}
                onChange={UniqueStore.handleChange}
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
                style={{ width: 500 }}
                value={UniqueStore.uniquerecords.function}
                onChange={UniqueStore.handleChange}
              >
                <MenuItem>Choose...</MenuItem>
                {this.props.UniqueStore.functionsDropdown
                  .slice()
                  .map((func: any) => (
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
                style={{ width: 500 }}
                value={UniqueStore.uniquerecords.recordcategoryid}
                onChange={UniqueStore.handleChange}
              >
                <MenuItem>Choose...</MenuItem>
                {this.props.UniqueStore.categoryDropdown
                  .slice()
                  .map((category: any) => (
                    <MenuItem
                      key={category.id}
                      value={category.recordcategoryid}
                    >
                      {category.recordcategoryid}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>

            <Grid item sm={12}>
              <TextField
                multiline
                rows="2"
                id="description"
                name="description"
                label="Retention Schedule"
                style={{ width: 500 }}
                onChange={UniqueStore.handleChange}
                margin="normal"
              />
            </Grid>

            <FormControl component="fieldset">
              <FormLabel component="legend">Archival</FormLabel>
              <RadioGroup
                row
                aria-label="archival"
                name="archival"
                id="archival"
              >
                {this.state.archivalOptions.map((x: string) => {
                  return (
                    <FormControlLabel
                      key={x}
                      value={x}
                      control={<Radio color="primary" />}
                      label={x}
                      labelPlacement="end"
                      onChange={UniqueStore.changeArchival}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>

            <Grid item sm={12}>
              <TextField
                multiline
                rows="4"
                id="notes"
                name="notes"
                label="Notes"
                style={{ width: 500 }}
                onChange={UniqueStore.handleChange}
                margin="normal"
              />
            </Grid>

            <Button
              variant="outlined"
              color="primary"
              style={{ marginTop: 10, fontSize: 10 }}
              onClick={this.submitRecords}
            >
              Submit
            </Button>

            <Dialog
              open={this.state.smShow}
              onClose={smClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Please select a department."}
              </DialogTitle>
              <DialogActions>
                <Button
                  color="primary"
                  onClick={() => this.setState({ smShow: false })}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={this.state.needRecordType}
              onClose={needRecordType}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Please enter a record type."}
              </DialogTitle>
              <DialogActions>
                <Button
                  color="primary"
                  onClick={() => this.setState({ needRecordType: false })}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <Snackbar
              _open={this.state.snackbarShow}
              msg="Successfully submitted the record."
            />
          </Container>
        );
      }
    }
  )
);

export default AddUniqueRecords as any;
