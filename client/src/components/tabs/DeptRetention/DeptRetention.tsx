import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import {
  Paper,
  Table,
  TableBody,
  Button,
  Grid,
  LinearProgress
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import {
  IRecord,
  UserStore,
  DepartmentStore,
  UniqueStore
} from "../../../stores";
import EnhancedTableHead, { IHeadRow } from "../../common/EnhancedTableHead";
import { EditModal, MsgSnackbar, ActionModal } from "../../common";
import { DepartmentTable } from "../DeptRetention";

const headrows: IHeadRow[] = [
  { id: "function", label: "Function" },
  {
    id: "recordtype",
    label: "Record Type"
  },
  {
    id: "description",
    label: "Retention Description"
  },
  { id: "classification", label: "Classification" },
  { id: "comments", label: "Comments" },
  { id: "status", label: "Status" }
];

export const DeptRetention = inject(
  "DepartmentStore",
  "UniqueStore",
  "RecordStore"
)(
  observer(() => {
    const [editComment, setEditComment] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [loadPdf, setLoadPdf] = useState<boolean>(false);
    const [selectedclassification, setSelectedClassification] = useState<any>(
      []
    );

    const showEditModal: (i: IRecord) => void = (postDetail: IRecord) => {
      if (postDetail.recordcategoryid === "common") {
        setEditComment(true);
      } else {
        setEditComment(false);
      }
      setEditModal(true);
      DepartmentStore.updateEditID(postDetail);

      setSelectedClassification(postDetail.classification);
      //something else??
    };

    //make pdf
    //TODO: to landscape
    const makePdf: () => void = () => {
      setLoadPdf(true);
      axios
        .post("/create-schedule", DepartmentStore)
        .then(() => axios.get("fetch-pdf", { responseType: "blob" }))
        .then((res: any) => {
          setLoadPdf(false);
          const pdfBlob = new Blob([res.data], { type: "application/pdf" });
          saveAs(pdfBlob, "retention.pdf");
        })
        .catch((error: any) => console.log(error));
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

    //pass id to store for delete action
    const handleDelete: (i: IRecord) => void = (deleterecord: IRecord) => {
      //show delete modal
      setDeleteModal(true);
      DepartmentStore.updateDeleteID(deleterecord);
    };

    //click delete in delete modal
    const onDelete: () => void = async () => {
      await DepartmentStore.deleteRecord();
      setDeleteModal(false);
    };

    const editRecord: () => void = async () => {
      await DepartmentStore.updateRecord(selectedclassification);
      // await this.props.DepartmentStore.setRecord()
      setEditModal(false);
    };

    return (
      <React.Fragment>
        <Grid justify="center" alignItems="center" container>
          <Button variant="outlined" color="primary" onClick={makePdf}>
            Download as PDF
          </Button>
        </Grid>
        {/* <MsgSnackbar /> */}
        <Paper>
          {loadPdf ? <LinearProgress /> : ""}
          <Table id="schedule" size="small">
            <EnhancedTableHead id="tablehead" headrows={headrows} />
            {UserStore.currentUser.admin ? (
              <TableBody style={{ fontSize: 11 }} id="tablebody">
                {DepartmentStore._allRecords
                  .slice()
                  .sort((a: IRecord, b: IRecord) =>
                    a.recordtype > b.recordtype? -1 : 1 &&
                      a.function > b.function? -1 : 1    
                  )
                  .filter(
                    (x: IRecord) =>
                      x.department ===
                      DepartmentStore.selectedDepartment.department
                  )
                  .map((postDetail: IRecord, index: number) => {
                    return (
                      <DepartmentTable
                        key={index}
                        tablekey={index}
                        onedit={() => showEditModal(postDetail)}
                        ondelete={() => handleDelete(postDetail)}
                        pfunction={postDetail.function}
                        recordtype={postDetail.recordtype}
                        description={postDetail.description}
                        classification={postDetail.classification}
                        comments={postDetail.comments}
                        status={postDetail.status}
                      />
                    );
                  })}
              </TableBody>
            ) : (
              <TableBody style={{ fontSize: 11 }} id="tablebody">
                {DepartmentStore._allRecords
                  .filter(
                    (x: IRecord) =>
                      x.department === UserStore.currentUser.department
                  )
                  .map((postDetail: IRecord, index: number) => {
                    return (
                      <DepartmentTable
                        key={index}
                        tablekey={index}
                        onedit={() => showEditModal(postDetail)}
                        ondelete={() => handleDelete(postDetail)}
                        pfunction={postDetail.function}
                        recordtype={postDetail.recordtype}
                        description={postDetail.description}
                        classification={postDetail.classification}
                        comments={postDetail.comments}
                        status={postDetail.status}
                      />
                    );
                  })}
              </TableBody>
            )}
          </Table>
        </Paper>

        {/* delete record */}
        <ActionModal
          open={deleteModal}
          title={"Delete Record"}
          msg={"Are you sure you want to delete this record?"}
          action={onDelete}
          close={() => setDeleteModal(false)}
          btn={"Delete"}
        />

        {/* edit record */}
        {DepartmentStore.allRecords
          .filter((x: IRecord) => x.id === DepartmentStore.record.id)
          .map((editDetail: IRecord, index: number) => {
            return (
              <EditModal
                title={
                  editDetail.recordcategoryid === "common"
                    ? "Edit Comment Only"
                    : "Edit Record"
                }
                disabled={editComment}
                key={index}
                record={editDetail}
                open={editModal}
                close={() => setEditModal(false)}
                functionList={UniqueStore.functionsDropdown}
                categoryList={UniqueStore.categoryDropdown}
                change={DepartmentStore.handleChange}
                saveedit={editRecord}
                changecheckbox={handleCheck}
                disablecategory={
                  editDetail.recordcategoryid === "common" ? true : false
                }
                ifarchival={
                  !!selectedclassification.find(
                    (x: string) => x === " Archival "
                  )
                }
                ifvital={
                  !!selectedclassification.find((x: string) => x === " Vital ")
                }
                ifconfidential={
                  !!selectedclassification.find(
                    (x: string) => x === " Highly Confidential "
                  )
                }
              />
            );
          })}
      </React.Fragment>
    );
  })
);

export default DeptRetention;
