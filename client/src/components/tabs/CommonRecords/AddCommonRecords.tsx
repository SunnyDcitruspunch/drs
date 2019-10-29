import React, { useState } from "react";
import { saveAs } from "file-saver";
import axios from "axios";
import { inject, observer } from "mobx-react";
import { TableBody, Paper, Table, Container } from "@material-ui/core";
import {
  IRecord,
  ICommonRecord,
  CommonStore,
  DepartmentStore,
  UniqueStore,
  RecordStore
} from "../../../stores";
import EnhancedTableHead, { IHeadRow } from "../../common/EnhancedTableHead";
import { EditModal, MessageModal } from "../../common";
import RecordTable from "./RecordTable";
import { ActionModal } from "../../common/ActionModal";
import DeleteModal from "../CommonRecords/DeleteModal";
import { Redirect } from "react-router-dom";

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
    const [title, setTitle] = useState<string>("");
    const [msg, setMsg] = useState<string>("");
    const [btn, setBtn] = useState<string>("Remove");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showDeleteMsgModal, setShowDeleteMsgModal] = useState<boolean>(
      false
    );
    const [, setLoadPdf] = useState<boolean>(false);
    const [selectedclassification, setSelectedClassification] = useState<
      IRecord | any
    >([]);

    const onChange = (record: ICommonRecord, e: any) => {
      CommonStore.getRecord(record);
      const index: number = DepartmentStore._allRecords.findIndex(
        (x: IRecord) => x.code === record.code
      );

      if (index > 0) {
        DepartmentStore.updateDeleteID(DepartmentStore._allRecords[index]);
      }

      if (!e.target.checked) {
        //show modal ask if remove common record
        setShowDeleteMsgModal(true);
        setTitle("Remove Common Record");
        setMsg("Are you sure you want to remove this common record?");
      } else {
        //show modal ask if add common record
        setShowDeleteMsgModal(true);
        setTitle("Add Common Record");
        setMsg("Are you sure you want to add this common record?");
        setBtn("Add");
      }
    };

    const handleEditRecord: (ic: ICommonRecord) => void = (
      editRecord: ICommonRecord
    ) => {
      setSelectedClassification([editRecord.classification]);
      setShowEditModal(true);
      CommonStore.getRecord(editRecord);
    };

    const saveEdit: () => void = () => {
      setShowEditModal(false);
      CommonStore.updateCommonRecord(selectedclassification);
    };

    const handleCheck: (e: any) => void = (e: any) => {
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

    const handleDelete: (ic: ICommonRecord) => void = (
      deleterecord: ICommonRecord
    ) => {
      //pass clicked record
      CommonStore.getRecord(deleterecord);
      setShowDeleteModal(true);
    };

    const onAction: () => void = () => {
      if (title == "Delete Record") {
        setShowDeleteModal(false);
        setShowDeleteMsgModal(false);
        CommonStore.deleteCommonRecord();
      } else {
        if (title === "Remove Common Record") {
          DepartmentStore.deleteRecord();
        } else if (title === "Add Common Record") {
          CommonStore.addCommonRecords();
        }
      }
      setShowDeleteMsgModal(false);
      return <Redirect to="/deptretention" />;
    };

    const confirmDelete = () => {
      setShowDeleteModal(false);
      setShowDeleteMsgModal(true);
      setTitle("Delete Record");
      setMsg("Are you sure you want to delete this record?");
      setBtn("Delete");
    };

    //make a pdf file of a list of departments
    const makePdf: () => void = () => {
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

    let CommonRecordList: JSX.Element[] = CommonStore.commonRecords.map(
      (record: ICommonRecord, index: number) => {
        return (
          <RecordTable
            key={index}
            record={record}
            click={() => handleEditRecord(record)}
            showdelete={() => handleDelete(record)}
            change={e => onChange(record, e)}
            checked={
              !!DepartmentStore.selectedDepartment.commoncodes.find(
                (x: string) => x === record.code
              )
            }
          />
        );
      }
    );

    return (
      <Container style={styles.tableStyle}>
        <Paper style={{ width: "100%", overflowX: "auto" }}>
          <Table size="small">
            <EnhancedTableHead id="tablehead" headrows={headrows} />
            <TableBody>{CommonRecordList}</TableBody>
          </Table>
        </Paper>

        {/* TODO: show snackbar  */}

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
          title="Cannot Add this Record"
          msg="Please select a department."
          click={() => setShowModal(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        />

        <ActionModal
          open={showDeleteMsgModal}
          title={title}
          msg={msg}
          action={onAction}
          close={() => setShowDeleteMsgModal(false)}
          btn={btn}
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
