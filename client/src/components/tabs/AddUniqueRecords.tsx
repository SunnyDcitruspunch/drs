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

interface IProps {
  DepartmentStore: IDepartmentStore;
  UniqueStore: IUniqueStore;
}

interface IState {
  smShow: boolean;
  snackbarShow: boolean;
  needRecordType: boolean;
  open: boolean;
  selectedfunction: string;
  selectedcategory: string;
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
        snackbarShow: false,
        needRecordType: false,
        open: false,
        selectedfunction: "",
        selectedcategory: "",
        archivalOptions: ["Archival", "Vital", "Highly Confidential"]
      };

      handleClose(
        event: React.SyntheticEvent | React.MouseEvent,
        reason?: string
      ) {
        if (reason === "clickaway") {
          return;
        }

        this.setState({
          snackbarShow: true
        });
      }

      handleFunctionChange: any = (e: MouseEvent) => {
        const { value }: any = e.target;
        this.setState({ selectedfunction: value });
        this.props.UniqueStore.getFunction(value);
      };

      handleCategoryChange: any = (e: MouseEvent) => {
        const { value }: any = e.target;
        this.setState({ selectedcategory: value });
        this.props.UniqueStore.getCategory(value);
      };

      submitRecords = (e: any) => {
        this.setState({ snackbarShow: true });

        e.preventDefault();

        this.props.UniqueStore.submitRecords(
          this.props.DepartmentStore.selectedDepartment
        );

        this.props.UniqueStore.uniquerecords.proposedFunction = this.state.selectedfunction;
        this.props.UniqueStore.uniquerecords.proposedCategory = this.state.selectedcategory;

        if (this.props.DepartmentStore.selectedDepartment === "") {
          this.setState({ smShow: true });
        } else if (this.props.UniqueStore.uniquerecords.recordType === "") {
          this.setState({ needRecordType: true });
        } else {
          e.preventDefault();
          this.props.UniqueStore.submitRecords(
            this.props.DepartmentStore.selectedDepartment
          );

          this.setState({ selectedcategory: "" });
          this.setState({ selectedfunction: "" });

          window.scrollTo(0, 0);
          this.props.UniqueStore.uniquerecords.recordType = "";
          this.setState({ needRecordType: false });
          window.location.reload();
        }
      };

      render() {
        let smClose = () => this.setState({ smShow: false });
        let needRecordType = () => this.setState({ needRecordType: false });
        const { UniqueStore } = this.props;

        return (
          <Container style={{ flexGrow: 1 }}>
            {/* <Formik> */}
            <Grid item sm={12}>
              <TextField
                id="recordType"
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
                id="proposedFunction"
                style={{ width: 500 }}
                value={this.state.selectedfunction}
                onChange={this.handleFunctionChange}
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
                id="proposedCategory"
                style={{ width: 500 }}
                value={this.state.selectedcategory}
                onChange={this.handleCategoryChange}
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
                id="proposedRetention"
                label="Retention Schedule"
                style={{ width: 500 }}
                onChange={UniqueStore.handleChange}
                margin="normal"
              />
            </Grid>

            <FormControl component="fieldset">
              <FormLabel component="legend">Archival</FormLabel>
              <RadioGroup row aria-label="archival" name="archival">
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
                id="Comment"
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
              {/* <Link
                to="/AddUniqueRecords"
                style={{ fontSize: 10, textDecoration: "none" }}
              > */}
              Submit
              {/* </Link> */}
            </Button>
            {/* </Formik> */}

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
          </Container>
        );
      }
    }
  )
);

export default AddUniqueRecords as any;
