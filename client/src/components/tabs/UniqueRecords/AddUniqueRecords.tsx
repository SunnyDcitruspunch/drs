import React, { Component } from "react";
import {
  Button,
  Container,
  TextField,
  Grid,
  FormLabel,
  FormControl
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { IUniqueStore, IDepartmentStore, IRecordStore } from "../../../stores";
import MessageModal from "../../common/MessageModal";
import FunctionDropdown from "../../common/FunctionDropdown";
import CategoryDropdown from '../../common/CategoryDropdown'
import ClassificationCheckboxes from "../../common/ClassificationCheckboxes";

interface IProps {
  DepartmentStore: IDepartmentStore;
  UniqueStore: IUniqueStore;
  RecordStore: IRecordStore;
}

interface IState {
  smShow: boolean;
  snackbarShow: boolean;
  needRecordType: boolean;
  open: boolean;
  selectedclassification: string[];
}

const AddUniqueRecords = inject(
  "UniqueStore",
  "DepartmentStore",
  "RecordStore"
)(
  observer(
    class AddUniqueRecords extends Component<IProps, IState> {
      state: IState = {
        smShow: false,
        snackbarShow: true,
        needRecordType: false,
        open: false,
        selectedclassification: []
      };

      submitRecords = (e: any) => {
        if (this.props.DepartmentStore.selectedDepartment.department === "") {
          this.setState({ smShow: true });
        } else if (this.props.UniqueStore.uniquerecords.recordtype === "") {
          this.setState({ needRecordType: true });
        } else {
          this.props.UniqueStore.submitRecords(
            this.props.DepartmentStore.selectedDepartment.department,
            this.state.selectedclassification
          );
          this.props.DepartmentStore.fetchAllRecords();
          this.setState({ snackbarShow: true });
          this.setState({ needRecordType: false });
          this.props.DepartmentStore.fetchAllRecords();
        }
      };

      handleCheck = (e: any) => {
        if (e.target.checked) {
          // e.target.checked = false
          this.setState({
            selectedclassification: [
              ...this.state.selectedclassification,
              e.target.value
            ]
          });
        } else {
          // e.target.checke3d = true
          let remove = this.state.selectedclassification.indexOf(
            e.target.value
          );
          this.setState({
            selectedclassification: this.state.selectedclassification.filter(
              (_: any, i: any) => i !== remove
            )
          });
        }
        console.log(this.state.selectedclassification);
      };

      render() {
        let smClose = () => this.setState({ smShow: false });
        let needRecordType = () => this.setState({ needRecordType: false });
        const { UniqueStore } = this.props;

        return (
          <Container style={{ flexGrow: 1 }}>
            <Grid container justify="center" alignItems="center">
              <TextField
                id="recordtype"
                name="recordtype"
                label="Record Type"
                style={{ width: 500 }}
                onChange={UniqueStore.handleChange}
                value={UniqueStore.uniquerecords.recordtype}
                margin="normal"
              />
            </Grid>
            <Grid container justify="center" alignItems="center">
              <FunctionDropdown
                title="Function Type"
                id="function"
                name="function"
                disabled={false}
                value={UniqueStore.uniquerecords.function}
                change={UniqueStore.handleChange}
                dropdown={UniqueStore.functionsDropdown}
              />
            </Grid>

            <Grid justify="center" alignItems="center" container style={{ height: 30 }}>
            <CategoryDropdown
                title="Category Type"
                id="recordcategoryid"
                name="recordcategoryid"
                disabled={false}
                value={UniqueStore.uniquerecords.recordcategoryid}
                change={UniqueStore.handleChange}
                dropdown={UniqueStore.categoryDropdown}
              />
            </Grid>

            <Grid container justify="center" alignItems="center" style={{ marginTop: 20 }}>
              <TextField
                multiline
                rows="2"
                id="description"
                name="description"
                label="Retention Description"
                style={{ width: 500 }}
                onChange={UniqueStore.handleChange}
                value={UniqueStore.uniquerecords.description}
                margin="normal"
              />
            </Grid>

            <Grid container justify="center" alignItems="center" style={{ marginTop: 20 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Classification</FormLabel>
                <ClassificationCheckboxes
                  changecheckbox={this.handleCheck}
                  disabled={false}
                />
              </FormControl>
            </Grid>

            <Grid container justify="center" alignItems="center">
              <TextField
                multiline
                rows="4"
                id="comments"
                name="comments"
                label="Notes"
                style={{ width: 500 }}
                value={UniqueStore.uniquerecords.comments}
                onChange={UniqueStore.handleChange}
                margin="normal"
              />
            </Grid>

            <Grid container justify="center" alignItems="center">
              <Button
                variant="outlined"
                color="primary"
                style={{ marginTop: 10, fontSize: 10 }}
                onClick={this.submitRecords}
              >
                Submit
              </Button>
            </Grid>

            <MessageModal
              open={this.state.smShow}
              close={smClose}
              title="Cannot Add this Record"
              msg="Please select a department."
              click={() => this.setState({ smShow: false })}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            />

            <MessageModal
              open={this.state.needRecordType}
              close={needRecordType}
              title="Cannot Add this Record"
              msg="Please enter a record type."
              click={() => this.setState({ needRecordType: false })}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            />
          </Container>
        );
      }
    }
  )
);

export default AddUniqueRecords as any;
