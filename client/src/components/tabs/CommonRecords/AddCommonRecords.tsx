import React, { useState } from "react";
import { saveAs } from "file-saver";
import axios from "axios";
import { inject, observer } from "mobx-react";
import {
  TableBody,
  Paper,
  Button,
  Table,
  Container,
  Grid,
  Snackbar
} from "@material-ui/core";
import {
  IRecord,
  ICommonRecord,
  CommonStore,
  DepartmentStore,
  UniqueStore,
  RecordStore
} from "../../../stores";
import EnhancedTableHead, { IHeadRow } from "../../common/EnhancedTableHead";
import { EditModal, MessageModal, MsgSnackbar } from "../../common";
import RecordTable from "./RecordTable";
import { DeleteMsgModal } from "../DeptRetention";
import DeleteModal from "../CommonRecords/DeleteModal";

const headrows: IHeadRow[] = [
  { id: "deptnum", label: "Used Department" },
  { id: "function", label: "Function" },
  {
    id: "recordtype",
    label: "Record Type"
  },
  {
    id: "description",
    label: "Retention Description"
  },
  { id: "classification", label: "Classification" }
];

const CommonRecords = inject(
  "RecordStore",
  "DepartmentStore",
  "UniqueStore",
  "CommonStore"
)(
  observer(() => {
    const [title, setTitle] = useState<string>("")
    const [msg, setMsg] = useState<string>("")
    const [snackbar, showSnackbar] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showDeleteMsgModal, setShowDeleteMsgModal] = useState<boolean>(
      false
    );
    const [loadPdf, setLoadPdf] = useState<boolean>(false);
    const [selectRecord, setSelectRecord] = useState<any[]>([]);
    const [selectedclassification, setSelectedClassification] = useState<
      IRecord | any
    >([]);

    /*FIXME: when click => see if target is already checked 
      => add common record if e.target.checked !== true
      => remove common record if (e.target.checked) */
    const onSelect = (e: any) => {
      const { value } = e.target;

      if (e.target.checked) {
        //show modal ask if remove common record
        setShowModal(true)
      } else {
        //show modal ask if add common record
        setShowModal(true)
      }
    };

    const handleEditRecord = (editRecord: ICommonRecord) => {
      setSelectedClassification([editRecord.classification]);
      setShowEditModal(true);
      CommonStore.getEditRecord(editRecord);
    };

    const saveEdit = (e: any) => {
      setShowEditModal(false);
      CommonStore.updateCommonRecord(selectedclassification);
    };

    const addRecord = (e: any) => {
      if (DepartmentStore.selectedDepartment.department === "") {
        setShowModal(true);
        setTitle("Cannot Add this Record")
        setMsg("Please select a department.")
      } else {
        CommonStore.addCommonRecords(
          selectRecord,
          DepartmentStore.selectedDepartment
        );
        setSelectRecord([]);
      }
    };

    const handleCheck = (e: any) => {
      if (e.target.checked) {
        setSelectedClassification([...selectedclassification, e.target.value]);
      } else {
        let remove = selectedclassification.indexOf(e.target.value);
        selectedclassification([
          ...selectedclassification,
          selectedclassification.filter((_: string, i: number) => i !== remove)
        ]);
      }
    };

    const handleDelete = (deleterecord: ICommonRecord) => {
      //pass clicked record
      CommonStore.getEditRecord(deleterecord);
      setShowDeleteModal(true);
    };

    const onDelete = () => {
      setShowDeleteModal(false);
      setShowDeleteMsgModal(false);
      CommonStore.deleteCommonRecord();
    };

    const confirmDelete = () => {
      setShowDeleteModal(false);
      setShowDeleteMsgModal(true);
    };

    const makePdf = () => {
      setLoadPdf(true);
      axios
        .post("/create-departments", {
          CommonStore,
          DepartmentStore,
          RecordStore
        })
        .then(() => axios.get("fetch-pdf", { responseType: "blob" }))
        .then((res: any) => {
          setLoadPdf(false);
          const pdfBlob = new Blob([res.data], { type: "application/pdf" });
          saveAs(pdfBlob, "departments.pdf");
        })
        .catch((error: any) => console.log(error));
    };

    const CommonRecordList: JSX.Element[] = CommonStore.commonRecords.map(
      (record: ICommonRecord, index: number) => {
        return (
          <RecordTable
            key={index}
            record={record}
            click={() => handleEditRecord(record)}
            showdelete={() => handleDelete(record)}
            change={onChange}
            checked={
              !!DepartmentStore.selectedDepartment.commoncodes.find(
                (x: string) => x === record.code
              )
            }
          />
        );
      }
    );

    //TODO: disabled to checked

    return (
      <Container style={styles.tableStyle}>
        <Paper style={{ width: "100%", overflowX: "auto" }}>
          <Table size="small">
            <EnhancedTableHead id="tablehead" headrows={headrows} />
            <TableBody>{CommonRecordList}</TableBody>
          </Table>
        </Paper>
<<<<<<< HEAD
        {/* <MsgSnackbar /> */}
        {/* TODO: might not need this button => just click on checkbox */}
        <Grid container justify="center" alignItems="center">
=======

        {/* TODO: show snackbar  */}
        {/* FIXME: remove logic in button to every checkbox onChange  */}

        {/* <Grid container justify="center" alignItems="center">
>>>>>>> 1e9a4c815359eb704fb4698eaa37aa96bd213ebc
          <Button
            variant="outlined"
            color="primary"
            style={{ marginTop: 10, fontSize: 10 }}
            onClick={addRecord}
          >
            Add selected common records
          </Button>
        </Grid> */}

        {/* edit common records */}
        {CommonStore.commonRecords
          .filter((x: ICommonRecord) => x.code === CommonStore.record.code)
          .map((postDetail: ICommonRecord) => {
            return (
              <div key={postDetail.id}>
                <EditModal
                  title="Edit Comment Record"
                  record={postDetail}
                  open={showEditModal}
                  functionList={UniqueStore.functionsDropdown}
                  categoryList={UniqueStore.categoryDropdown}
                  close={() => setShowEditModal(false)}
                  saveedit={saveEdit}
                  disabled={false}
                  disablecomment={true}
                  change={CommonStore.handleChange}
                  changecheckbox={handleCheck}
                  disablecategory={true}
                  ifarchival={
                    !!selectedclassification.find(
                      (x: string) => x === " Archival "
                    )
                  }
                  ifvital={
                    !!selectedclassification.find(
                      (x: string) => x === " Vital "
                    )
                  }
                  ifconfidential={
                    !!selectedclassification.find(
                      (x: string) => x === " Highly Confidential "
                    )
                  }
                />

                {/* show depts using this common record */}
                <DeleteModal
                  deptpdf={makePdf}
                  open={showDeleteModal}
                  close={() => setShowDeleteModal(false)}
                  msg={"Total Departments: " + postDetail.useddepartment}
                  depts={DepartmentStore._allRecords
                    .filter((r: IRecord) => r.code === CommonStore.record.code)
                    .map((r: IRecord, index: number) => {
                      return (
                        <span key={index}>
                          {r.department} <br />
                        </span>
                      );
                    })}
                  //add delete request
                  ondelete={confirmDelete}
                />
              </div>
            );
          })}
        <MessageModal
          open={showModal}
          close={() => setShowModal(false)}
          title={title}
          msg={msg}
          click={() => setShowModal(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        />

        {/* delete record */}
        <DeleteMsgModal
          open={showDeleteMsgModal}
          title={"Delete Record"}
          msg={"Are you sure you want to delete this record?"}
          pdelete={onDelete}
          close={() => setShowDeleteMsgModal(false)}
        />
      </Container>
    );
  })
);

export default CommonRecords;

const styles = {
  tableStyle: {
    paddingTop: 14
  },
  modalButtonStyle: {
    height: 26,
    width: 84,
    fontSize: 8,
    padding: 0
  },
  buttonStyle: {
    width: 20,
    height: 16,
    fontSize: 10
  }
};
