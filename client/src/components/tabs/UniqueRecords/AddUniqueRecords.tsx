import React, { useState } from "react";
import {
  Button,
  Container,
  TextField,
  Grid,
  FormLabel,
  FormControl,
  Snackbar
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { DepartmentStore, UniqueStore, ICategory } from "../../../stores";
import {
  MessageModal,
  FunctionDropdown,
  CategoryDropdown,
  ClassificationCheckboxes,
  MsgSnackbar
} from "../../common";

const AddUniqueRecords = inject(
  "UniqueStore",
  "DepartmentStore",
  "RecordStore"
)(
  observer(() => {
    const [msgModal, setMsgModal] = useState<boolean>(false); //smshow
    const [snackbar, setSnackbar] = useState<boolean>(false);
    const [needRecord, setNeedRecord] = useState<boolean>(false);
    const [vital, setVital] = useState<boolean>(false);
    const [archival, setArchival] = useState<boolean>(false);
    const [confidential, setConfidential] = useState<boolean>(false);
    const [selectedclassification, setSelectedClassification] = useState<any>(
      []
    );

    const submitRecords = (e: any) => {
      if (DepartmentStore.selectedDepartment.department === "") {
        setMsgModal(true);
      } else if (UniqueStore.uniquerecords.recordtype === "") {
        setNeedRecord(true);
      } else {
        UniqueStore.submitRecords(
          DepartmentStore.selectedDepartment.department,
          selectedclassification
        );
        setSnackbar(true);
        setNeedRecord(false);
        setSelectedClassification([]);
        setVital(false)
        setArchival(false)
        setConfidential(false)
      }
      DepartmentStore.fetchAllRecords();
    };

    //something wrong with the console output...
    const handleCheck = (e: any) => {
      console.log(selectedclassification);
      if (e.target.checked) {
        // e.target.checked = false
        // e.target.name
        setSelectedClassification([...selectedclassification, e.target.value]);
      } else {
        // e.target.checke3d = true
        let remove = selectedclassification.indexOf(e.target.value);
        setSelectedClassification([
          ...selectedclassification,
          selectedclassification.filter((_: any, i: any) => i !== remove)
        ]);
      }
    };

    const categorydropdown = UniqueStore.categoryDropdown.filter(
      (c: ICategory) => c.functiontypeid === UniqueStore.uniquerecords.id
    );

    return (
      <Container style={{ flexGrow: 1 }}>
        {/* <MsgSnackbar /> */}
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
            title="Function"
            id="function"
            name="function"
            disabled={false}
            value={UniqueStore.uniquerecords.function}
            change={UniqueStore.handleChange}
            dropdown={UniqueStore.functionsDropdown}
          />
        </Grid>

        <Grid
          justify="center"
          alignItems="center"
          container
          style={{ height: 30 }}
        >
          <CategoryDropdown
            title="Record Category"
            id="recordcategoryid"
            name="recordcategoryid"
            disabled={false}
            value={UniqueStore.uniquerecords.recordcategoryid}
            change={UniqueStore.handleChange}
            dropdown={categorydropdown}
          />
        </Grid>

        <Grid
          container
          justify="center"
          alignItems="center"
          style={{ marginTop: 20 }}
        >
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

        <Grid
          container
          justify="center"
          alignItems="center"
          style={{ marginTop: 20 }}
        >
          <FormControl component="fieldset">
            <FormLabel component="legend">Classification</FormLabel>
            <ClassificationCheckboxes
              changecheckbox={handleCheck}
              disabled={false}
              ifvital={vital}
              ifarchival={archival}
              ifconfidential={confidential}
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
            onClick={submitRecords}
          >
            Submit
          </Button>
        </Grid>

        <MessageModal
          open={msgModal}
          close={() => setMsgModal(false)}
          title="Cannot Add this Record"
          msg="Please select a department."
          click={() => setMsgModal(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        />

        <MessageModal
          open={needRecord}
          close={() => setNeedRecord(false)}
          title="Cannot Add this Record"
          msg="Please enter a record type."
          click={() => setNeedRecord(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={true}
          autoHideDuration={6000}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">Note archived</span>}
        />
      </Container>
    );
  })
);

export default AddUniqueRecords as any;
