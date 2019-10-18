import * as React from "react";
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
  IDepartmentStore,
  IUniqueStore,
  IRecord,
  IRecordStore,
  UserStore,
  IUserStore
} from "../../../stores";
import EnhancedTableHead, {
  IOrder,
  IHeadRow
} from "../../common/EnhancedTableHead";
import { EditModal } from "../../common";
import { DepartmentTable, DeleteModal } from "../DeptRetention";

interface IProps {
  DepartmentStore: IDepartmentStore;
  UniqueStore: IUniqueStore;
  RecordStore: IRecordStore;
  UserStore: IUserStore;
}

interface IState {
  openEdit: boolean;
  confirmDelete: boolean;
  order: IOrder;
  orderBy: string;
  sortDirection: string;
  snackbar: boolean;
  // disable: boolean;
  onlycommentEdit: boolean;
  selectedclassification: string[];
  loadingPdf: boolean;
}

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
  "UserStore",
  "DepartmentStore",
  "UniqueStore",
  "RecordStore"
)(
  observer(
    class DeptRetnetion extends React.Component<IProps, IState> {
      constructor(props: IProps) {
        super(props);

        this.showEditModal = this.showEditModal.bind(this);

        this.state = {
          onlycommentEdit: false,
          openEdit: false,
          confirmDelete: false,
          order: "asc",
          orderBy: "recordtype",
          sortDirection: "asc",
          snackbar: false,
          // disable: false, //can only edit comments if is common record
          selectedclassification: [],
          loadingPdf: false
        };
      }

      showEditModal(postDetail: IRecord) {
        if (postDetail.recordcategoryid === "common") {
          this.setState({ onlycommentEdit: true });
        } else {
          this.setState({ onlycommentEdit: false });
        }
        this.setState({ openEdit: true });
        this.props.DepartmentStore.updateEditID(postDetail);

        this.setState({ selectedclassification: postDetail.classification });
      }

      //FIXME: prevent user download empty pdf
      //make pdf
      makePdf = () => {
        this.setState({ loadingPdf: true });

        axios
          .post("/create-retention", this.props.DepartmentStore)
          .then(() => axios.get("fetch-retention", { responseType: "blob" }))
          .then((res: any) => {
            this.setState({ loadingPdf: false });
            const pdfBlob = new Blob([res.data], { type: "application/pdf" });
            saveAs(pdfBlob, "retention.pdf");
          })
          .catch((error: any) => console.log(error));
      };

      //pass id to store for delete action
      handleDelete = (deleterecord: IRecord) => {
        //show delete modal
        this.setState({ confirmDelete: true });
        this.props.DepartmentStore.updateDeleteID(deleterecord);
      };

      //click delete in delete modal
      onDelete: any = async () => {
        await this.props.DepartmentStore.deleteRecord();
        this.setState({ confirmDelete: false });
      };

      editRecord: any = async () => {
        await this.props.DepartmentStore.updateRecord(
          this.state.selectedclassification
        );
        // await this.props.DepartmentStore.setRecord()
        this.setState({ openEdit: false });
        this.setState({ snackbar: true });

        this.props.DepartmentStore.fetchAllRecords();
      };

      handleCheck = (e: any) => {
        if (e.target.checked) {
          this.setState({
            selectedclassification: [
              ...this.state.selectedclassification,
              e.target.value
            ]
          });
        } else {
          let remove = this.state.selectedclassification.indexOf(
            e.target.value
          );
          this.setState({
            selectedclassification: this.state.selectedclassification.filter(
              (_: string, i: number) => i !== remove
            )
          });
        }
        console.log(this.state.selectedclassification);
      };

      //FIXME: show instruction if no records for a department
      render() {
        let editClose = () => this.setState({ openEdit: false });
        const { DepartmentStore, UserStore, UniqueStore } = this.props;
        //admin select department(will only have one)
        const department = DepartmentStore.selectedDepartment;
        const functions = UniqueStore.functionsDropdown;
        const categories = UniqueStore.categoryDropdown;
        let records = DepartmentStore.allRecords.filter(
          (x: IRecord) =>
            UserStore.currentUser.department.indexOf(x.department) !== -1
        );

        return (
          <React.Fragment>
            <Grid justify="center" alignItems="center" container>
              <Button variant="outlined" color="primary" onClick={this.makePdf}>
                Download as PDF
              </Button>
            </Grid>

            <Paper>
              {this.state.loadingPdf ? <LinearProgress /> : ""}
              <Table id="schedule" size="small">
                <EnhancedTableHead
                  id="tablehead"
                  headrows={headrows}
                  order={this.state.order}
                  orderBy={this.state.orderBy}
                />
                <TableBody style={{ fontSize: 11 }} id="tablebody">
                  {records.map((postDetail: IRecord, index) => {
                    return (
                      <DepartmentTable
                        key={index}
                        tablekey={index}
                        onedit={this.showEditModal.bind(this, postDetail)}
                        ondelete={() => this.handleDelete(postDetail)}
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
              </Table>
            </Paper>

            {/* delete record */}
            <DeleteModal
              open={this.state.confirmDelete}
              title={"Delete Record"}
              msg={"Are you sure you want to delete this record?"}
              pdelete={this.onDelete}
              click={() => this.setState({ confirmDelete: false })}
            />

            {/* edit record */}
            {this.props.DepartmentStore.allRecords
              .filter(
                (x: IRecord) => x.id === this.props.DepartmentStore.record.id
              )
              .map((editDetail: IRecord, index) => {
                return (
                  <EditModal
                    title={
                      editDetail.recordcategoryid === "common"
                        ? "Edit Comment Only"
                        : "Edit Record"
                    }
                    disabled={this.state.onlycommentEdit}
                    key={index}
                    record={editDetail}
                    open={this.state.openEdit}
                    close={editClose}
                    functionList={functions}
                    categoryList={categories}
                    change={DepartmentStore.handleChange}
                    saveedit={this.editRecord}
                    changecheckbox={this.handleCheck}
                    disablecategory={
                      editDetail.recordcategoryid === "common" ? true : false
                    }
                    ifarchival={
                      !!this.state.selectedclassification.find(
                        (x: string) => x === " Archival "
                      )
                    }
                    ifvital={
                      !!this.state.selectedclassification.find(
                        (x: string) => x === " Vital "
                      )
                    }
                    ifconfidential={
                      !!this.state.selectedclassification.find(
                        (x: string) => x === " Highly Confidential "
                      )
                    }
                  />
                );
              })}
          </React.Fragment>
        );
      }
    }
  )
);

//FIXME: fix cast as any type
export default DeptRetention as any;
