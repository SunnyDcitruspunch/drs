import React, { Component } from "react";
import {
  Button,
  Snackbar,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  FormGroup,
  FormLabel,
  TextField,
  Grid,
  MenuItem
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";
import { IUniqueStore } from "../../stores/UniqueStore";
import { IDepartmentStore } from "../../stores/DepartmentStore";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

interface IProps {
  DepartmentStore: IDepartmentStore;
  UniqueStore: IUniqueStore;
}

interface IState {
  smShow: boolean;
  snackbarShow: boolean;
  shown: boolean;
  open: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary
    }
  })
);

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
        open: false
      };

      handleClose = () => {
        this.setState({
          snackbarShow: false
        });
      };

      submitRecords = (e: any) => {
        if (this.props.DepartmentStore.selectedDepartment === "") {
          this.setState({ smShow: true });
          console.log("select a department to add an unique record");
        } else if (this.props.UniqueStore.uniquerecords.recordType === "") {
          this.setState({ shown: true });
        } else {
          e.preventDefault();

          console.log(this.props.DepartmentStore.selectedDepartment);
          this.props.UniqueStore.submitRecords(
            this.props.DepartmentStore.selectedDepartment || ""
          );

          // this.refs.recordtype.value = "";
          // this.refs.proposedfunction.value = "Choose...";
          // this.refs.proposedcategory.value = "Choose...";
          // this.refs.proposedretention.value = "";
          // this.refs.notes.value = "";
          this.setState({ snackbarShow: true });
          window.scrollTo(0, 0);
          this.props.UniqueStore.uniquerecords.recordType = "";
          this.setState({ shown: false });
          window.location.reload();
        }
      };

      render() {
        let smClose = () => this.setState({ smShow: false });
        const { UniqueStore } = this.props;
        const shown = {
          display: this.state.shown ? "block" : "none",
          color: "#ff0000"
        };

        return (
          <Container style={{ flexGrow: 1 }}>
            <Grid item sm={12}>
              <TextField
                id="recordType"
                label="Record Type"
                style={{ width: 400 }}
                value={UniqueStore.uniquerecords.recordType}
                onChange={UniqueStore.handleChange}
                margin="normal"
              />
            </Grid>

            <Grid item>
              <TextField
                select
                id="recordFunction"
                label="Proposed Function"
                style={{ width: 400 }}
                value={UniqueStore.uniquerecords.proposedFunction}
                onChange={UniqueStore.handleChange}
                margin="normal"
              >
                <MenuItem>Choose...</MenuItem>
                {this.props.UniqueStore.functionsDropdown
                  .slice()
                  .map((func: any) => (
                    <MenuItem key={func.id} value={func.functiontype}>
                      {func.functiontype}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>

            <Grid item>
              <TextField
                select
                id="recordCategory"
                label="Proposed Category"
                style={{ width: 400 }}
                value={UniqueStore.uniquerecords.proposedCategory}
                onChange={UniqueStore.handleChange}
                margin="normal"
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
              </TextField>
            </Grid>

            <Grid item sm={12}>
              <TextField
                id="proposedRetention"
                label="Proposed Retention"
                style={{ width: 400 }}
                value={UniqueStore.uniquerecords.proposedRetention}
                onChange={UniqueStore.handleChange}
                margin="normal"
              />
            </Grid>

            <Grid item sm={12}>
              <TextField
                id="Comment"
                label="Notes"
                style={{ width: 400 }}
                value={UniqueStore.uniquerecords.recordType}
                onChange={UniqueStore.handleChange}
                margin="normal"
              />
            </Grid>

            <Button
              variant="outlined"
              color="primary"
              style={styles.buttonStyle}
              onClick={e => this.submitRecords(e)}
            >
              <Link to="/AddUniqueRecords">Submit</Link>
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

const styles = {
  buttonStyle: {
    height: 26,
    width: 60,
    fontSize: 12,
    padding: 0
  },
  formStyle: {
    height: 32,
    fontSize: 11,
    paddingTop: 18
  },
  inputStyle: {
    height: 28,
    fontSize: 11
  },
  titleStyle: {
    textAlign: "left"
  },
  errorStyle: {
    color: "red"
  },
  footerStyle: {
    height: 60
  },
  modalButtonStyle: {
    height: 26,
    width: 84,
    fontSize: 12,
    padding: 0
  }
};
