import React, { Component } from "react";
import {
  Button,
  Snackbar,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import { IUniqueStore } from "../../stores/UniqueStore";
import { IDepartmentStore } from "../../stores/DepartmentStore";

/*
  !TODO: submitrecord
*/

interface IProps {
  DepartmentStore: IDepartmentStore;
  UniqueStore: IUniqueStore;
}

interface IState {
  smShow: boolean;
  snackbarShow: boolean;
  shown: boolean;
  open: boolean;
  selectedfunction: string;
  selectedcategory: string;
}

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       flexGrow: 1
//     },
//     paper: {
//       padding: theme.spacing(2),
//       textAlign: "center",
//       color: theme.palette.text.secondary
//     }
//   })
// );

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
        shown: false,
        open: false,
        selectedfunction: "",
        selectedcategory: ""
      };

      handleClose = () => {
        this.setState({
          snackbarShow: false
        });
      };

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
        this.props.UniqueStore.submitRecords(
          this.props.DepartmentStore.selectedDepartment
        );

        console.log(this.state.selectedcategory);
        console.log(this.state.selectedfunction);

        this.props.UniqueStore.uniquerecords.proposedFunction = this.state.selectedfunction;
        this.props.UniqueStore.uniquerecords.proposedCategory = this.state.selectedcategory;

        // if (this.props.DepartmentStore.selectedDepartment === "") {
        //   this.setState({ smShow: true });
        //   console.log("select a department to add an unique record");
        // } else if (this.props.UniqueStore.uniquerecords.recordType === "") {
        //   this.setState({ shown: true });
        // } else {
        //   e.preventDefault();
        //   this.props.UniqueStore.submitRecords(this.state.dept)

        //   console.log(this.props.DepartmentStore.selectedDepartment);
        //   this.props.UniqueStore.submitRecords(
        //     this.props.DepartmentStore.selectedDepartment || ""
        //   );

        //   this.setState({ snackbarShow: true });
        //   window.scrollTo(0, 0);
        //   this.props.UniqueStore.uniquerecords.recordType = "";
        //   this.setState({ shown: false });
        //   window.location.reload();
        // }
      };

      render() {
        let smClose = () => this.setState({ smShow: false });
        const { UniqueStore } = this.props;
        const shown = {
          display: this.state.shown ? "block" : "none",
          color: "#ff0000"
        };
        //console.log(this.props.DepartmentStore.selectedDepartment);

        return (
          <Container style={{ flexGrow: 1 }}>
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
              onClick={e => this.submitRecords(e)}
            >
              <Link
                to="/AddUniqueRecords"
                style={{ fontSize: 10, textDecoration: "none" }}
              >
                Submit
              </Link>
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
          </Container>
        );
      }
    }
  )
);

export default AddUniqueRecords as any;
