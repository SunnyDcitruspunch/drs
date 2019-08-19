import React, { Component } from "react";
import {
  Button,
  Container,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormLabel,
  FormControl
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { IUniqueStore, IDepartmentStore, IRecordStore } from "../../../stores";
import Snackbar from "../../common/Snackbar";
import MessageModal from "../../common/MessageModal";
import FunctionDropdown from "../../common/FunctionDropdown";
import ClassificationCheckboxes from "../../common/ClassificationCheckboxes";

interface IProps {
  DepartmentStore: IDepartmentStore;
  UniqueStore: IUniqueStore;
  RecordStore: IRecordStore
}

interface IState {
  smShow: boolean;
  snackbarShow: boolean;
  needRecordType: boolean;
  open: boolean;
  archivalOptions: Array<string>;
}

const AddUniqueRecords = inject("UniqueStore", "DepartmentStore", "RecordStore")(
  observer(
    class AddUniqueRecords extends Component<IProps, IState> {

      state: IState = {
        smShow: false,
        snackbarShow: true,
        needRecordType: false,
        open: false,
        archivalOptions: ["Archival", "Vital", "Highly Confidential"]
      };

      submitRecords =(e: any) => {
        if (this.props.DepartmentStore.selectedDepartment.department === "") {
          this.setState({ smShow: true });
        } else if (this.props.UniqueStore.uniquerecords.recordtype === "") {
          this.setState({ needRecordType: true });
        } else {
          this.props.UniqueStore.submitRecords(this.props.DepartmentStore.selectedDepartment.department);
          this.setState({ snackbarShow: true });
          this.setState({ needRecordType: false });
          this.props.DepartmentStore.fetchAllRecords();
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
                value={UniqueStore.uniquerecords.recordtype}
                margin="normal"
              />
            </Grid>

            <FunctionDropdown
              title="Function Type"
              id="function"
              name="function"
              disabled={false}
              value={UniqueStore.uniquerecords.function}
              change={UniqueStore.handleChange}
              dropdown={this.props.UniqueStore.functionsDropdown}
            />

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
                label="Retention Description"
                style={{ width: 500 }}
                onChange={UniqueStore.handleChange}
                value={UniqueStore.uniquerecords.description}
                margin="normal"
              />
            </Grid>

            <FormControl component="fieldset">
              <FormLabel component="legend">Classification</FormLabel>
              <ClassificationCheckboxes 
                changecheckbox={UniqueStore.changeArchival} 
                disabled={false}
              />
            </FormControl>

            <Grid item sm={12}>
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

            <Button
              variant="outlined"
              color="primary"
              style={{ marginTop: 10, fontSize: 10 }}
              onClick={this.submitRecords}
            >
              Submit
            </Button>

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
