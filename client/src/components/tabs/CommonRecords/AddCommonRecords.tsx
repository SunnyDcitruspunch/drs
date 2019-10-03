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
  UniqueStore
} from "../../../stores";
import EnhancedTableHead, { IHeadRow } from "../../common/EnhancedTableHead";
import { EditModal, MessageModal, MsgSnackbar } from "../../common";
import RecordTable from "./RecordTable";
import DeleteModal from "./DeleteModal";

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
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [loadPdf, setLoadPdf] = useState<boolean>(false);
    const [selectRecord, setSelectRecord] = useState<any[]>([]);
    const [selectedclassification, setSelectedClassification] = useState<
      IRecord | any
    >([]);

    const onSelect = (e: any) => {
      const { value } = e.target;
      if (e.target.checked) {
        setSelectRecord([...selectRecord, value]);
      } else {
        let remove = selectRecord.indexOf(value);
        selectRecord.filter((_: IRecord, i: number) => i !== remove);
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
          selectedclassification.filter((_: any, i: any) => i !== remove)
        ]);
      }
    };

    const handleDelete = (deleterecord: ICommonRecord) => {
      //pass clicked record
      CommonStore.getEditRecord(deleterecord);
      setShowDeleteModal(true);
    };

    const makePdf = () => {
      setLoadPdf(true);

      axios
        .post("/create-departments", {CommonStore, DepartmentStore})
        .then(() => axios.get("fetch-pdf", { responseType: "blob" }))
        .then((res: any) => {
          setLoadPdf(false);
          const pdfBlob = new Blob([res.data], { type: "application/pdf" });
          saveAs(pdfBlob, "departments.pdf");
        })
        .catch((error: any) => console.log(error));
    };

    return (
      <Container style={styles.tableStyle}>
        <Paper style={{ width: "100%", overflowX: "auto" }}>
          <Table size="small">
            <EnhancedTableHead id="tablehead" headrows={headrows} />
            <TableBody>
              {CommonStore.commonRecords
                .slice()
                .sort((a: ICommonRecord, b: ICommonRecord) =>
                  a.function < b.function ? -1 : 1
                )
                .map((record: ICommonRecord, index: number) => {
                  return (
                    <RecordTable
                      key={index}
                      record={record}
                      click={() => handleEditRecord(record)}
                      showdelete={() => handleDelete(record)}
                      select={onSelect}
                      disabled={
                        !!DepartmentStore.selectedDepartment.commoncodes.find(
                          (x: string) => x === record.code
                        )
                      }
                    />
                  );
                })}
            </TableBody>
          </Table>
        </Paper>
        {/* <MsgSnackbar /> */}
        <Grid container justify="center" alignItems="center">
          <Button
            variant="outlined"
            color="primary"
            style={{ marginTop: 10, fontSize: 10 }}
            onClick={addRecord}
          >
            Add selected common records
          </Button>
        </Grid>

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
                    //add dele ajax call
                  ondelete={() => setShowDeleteModal(false)}
                />
              </div>
            );
          })}
        <MessageModal
          open={showModal}
          close={() => setShowModal(false)}
          title="Cannot Add this Record"
          msg="Please select a department."
          click={() => setShowModal(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
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
