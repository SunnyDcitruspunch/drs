import * as React from "react";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import DeleteForeverSharpIcon from "@material-ui/icons/DeleteForeverSharp";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Container
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { IDepartmentStore, IRecord } from "../../stores/DepartmentStore";
import { IUniqueStore } from "../../stores/UniqueStore";
import { IData, IOrder, IHeadRow } from "../common/EnhancedTableHead";
import EnhancedTableHead from "../common/EnhancedTableHead";
import MessageModal from "../common/MessageModal";
// import Snackbar from "../common/Snackbar";
import EditModal from "../common/EditModal";
// import Progress from "../common/Progress";

/* 
  TODO: snackbar after edit/ delete/ submission
*/

interface IProps {
  DepartmentStore: IDepartmentStore;
  UniqueStore: IUniqueStore;
}

interface IState {
  smShow: boolean;
  openEdit: boolean;
  cannotEdit: boolean;
  pdfShow: boolean;
  confirmDelete: boolean;
  order: IOrder;
  orderBy: string;
  sortDirection: any;
  filterbyFunction: string;
  snackbar: boolean;
  disable: boolean,
  onlycommentEdit: boolean
}

function desc<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
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

const DeptRetention = inject("DepartmentStore", "UniqueStore")(
  observer(
    class DeptRetnetion extends React.Component<IProps, IState> {
      constructor(props: IProps) {
        super(props);

        this.state = {
          onlycommentEdit: false,
          smShow: false,
          openEdit: false,
          cannotEdit: false,
          pdfShow: false,
          confirmDelete: false,
          order: "asc",
          orderBy: "recordtype",
          sortDirection: "asc",
          filterbyFunction: "",
          snackbar: false,
          disable: false //can only edit comments if is common record
        };
      }

      componentDidMount = () => {
        this.props.DepartmentStore.fetchAllRecords();
        this.props.DepartmentStore.fetchCommonRecords();
        this.props.UniqueStore.fetchArchival();
        
      };

      showEditModal(postDetail: IRecord) {
        if (postDetail.recordcategoryid === "common") {
          this.setState({ onlycommentEdit: true });
          // console.log('only edit comment')
        } else {
          this.setState({ onlycommentEdit: false });          
        }
        this.setState({ openEdit: true });
        this.props.DepartmentStore.updateEditID(postDetail);
      }

      //html2canvas + jsPDF
      makePdf = () => {
        const dept = this.props.DepartmentStore.selectedDepartment;
        const schedule: any = document.getElementById("schedule");

        if (this.props.DepartmentStore.selectedDepartment.department !== "") {
          html2canvas(schedule, {
            width: 2400,
            height: 2000,
            x: 120
          }).then(function(canvas: any) {
            var img = canvas.toDataURL("image/png");
            var doc = new jsPDF({
              orientation: "landscape"
            });
            doc.text("Department Retention Schedule: " + dept, 10, 10);
            doc.addImage(img, "JPEG", -20, 15);
            doc.save("retention.pdf");
          });
        } else {
          this.setState({
            pdfShow: true
          });
        }
      };

      //pass id to store for delete action
      handleDelete(value: any) {
        //show delete modal
        this.setState({ confirmDelete: true });
        this.props.DepartmentStore.deleteID = value;
      }

      //click delete in delete modal
      onDelete: any = async () => {
        await this.props.DepartmentStore.deleteRecord();
        this.setState({ confirmDelete: false });
      };

      editRecord: any = async () => {
        await this.props.DepartmentStore.updateRecord();
        this.setState({ openEdit: false });
        this.setState({ snackbar: true });
      };

      closeEdit: any = () => {
        this.setState({
          openEdit: false
        });
      };

      stableSort<T>(array: IRecord[], cmp: (a: T, b: T) => number) {
        const stabilizedThis = array.map(
          (el: any, index: any) => [el, index] as [T, number]
        );
        stabilizedThis.sort((a: any, b: any) => {
          const order = cmp(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
        return stabilizedThis.map((el: any) => el[0]);
      }

      getSorting<K extends keyof any>(
        order: IOrder,
        orderBy: K
      ): (
        a: { [key in K]: number | string },
        b: { [key in K]: number | string }
      ) => number {
        return order === "desc"
          ? (a, b) => desc(a, b, orderBy)
          : (a, b) => -desc(a, b, orderBy);
      }

      handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof IData
      ) => {
        const isDesc =
          this.state.orderBy === property && this.state.order === "desc";
        if (isDesc === true) {
          this.setState({ order: "asc" });
        } else {
          this.setState({ order: "desc" });
        }
        this.setState({ orderBy: property });
      };

      handlefilterfunction = (e: any) => {
        const { value } = e.target;
        this.setState({ filterbyFunction: value });
      };

      render() {
        // let confirmClose = () => this.setState({ confirmDelete: false });
        let cannoteditClose = () => this.setState({ cannotEdit: false });
        const { DepartmentStore } = this.props;
        const department = DepartmentStore.selectedDepartment;
        const functions = this.props.UniqueStore.functionsDropdown;
        const categories = this.props.UniqueStore.categoryDropdown;

        return (
          <Container style={styles.tableStyle}>

            <Button
              variant="outlined"
              color="primary"
              onClick={this.makePdf}
              style={{ fontSize: 12, marginBottom: 10 }}
            >
              Download as PDF
            </Button>
            {/* <Progress /> */}

            <Paper>
              <Table id="schedule" size="small">
                <EnhancedTableHead
                  id="tablehead"
                  headrows={headrows}
                  order={this.state.order}
                  orderBy={this.state.orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody style={{ fontSize: 11 }} id="tablebody">
                  {this.stableSort(
                    DepartmentStore.allRecords,
                    this.getSorting(this.state.order, this.state.orderBy)
                  )
                    .slice()
                    .filter((x: IRecord) => x.department === department.department)
                    .map((postDetail: IRecord) => {
                      return (
                        <TableRow hover key={postDetail.id}>
                          <TableCell style={{ width: 100 }}>
                            <CreateOutlinedIcon
                              name="edit"
                              onClick={() => this.showEditModal(postDetail)}
                              style={styles.buttonStyle}
                            />
                            &nbsp;
                            <DeleteForeverSharpIcon
                              name="delete"
                              onClick={() => this.handleDelete(postDetail.id)}
                              style={styles.buttonStyle}
                            />
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {postDetail.function}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {postDetail.recordtype}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {postDetail.description}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {postDetail.classification}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {postDetail.comments}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {postDetail.status}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Paper>

            {/* delete record */}
            <Dialog
              open={this.state.confirmDelete}
              // onClose={confirmClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Delete Record"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this record?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.onDelete} color="primary" autoFocus>
                  Delete this record
                </Button>
                <Button
                  onClick={() => this.setState({ confirmDelete: false })}
                  color="primary"
                  autoFocus
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

            {/* cannot edit record */}
            <MessageModal
              open={this.state.cannotEdit}
              close={cannoteditClose}
              click={() => this.setState({ cannotEdit: false })}
              title="Cannot Edit this Record"
              msg="Cannot edit common records"
            />

            {/* edit record */}
            {this.props.DepartmentStore.allRecords
              .filter(
                (x: IRecord) => x.id === this.props.DepartmentStore.editrecord.id
              )
              .map((editDetail: IRecord) => {
                return (
                  <EditModal
                    title={editDetail.recordcategoryid === 'common'? "Edit Comment Only" : "Edit Record"}
                    disabled={this.state.onlycommentEdit}
                    key={editDetail.id}
                    record={editDetail}
                    open={this.state.openEdit}
                    close={this.closeEdit}
                    functionList={functions}
                    categoryList={categories}
                    change={DepartmentStore.handleChange}
                    saveedit={this.editRecord}
                  />
                );
              })}
            {/* <Snackbar
              _open={this.state.snackbar}
              msg="Successfully edited the record."
            /> */}
          </Container>
        );
      }
    }
  )
);

export default DeptRetention as any;

const styles = {
  tableStyle: {
    paddingTop: 14
  },
  buttonStyle: {
    width: 20,
    height: 16,
    padding: 0,
    fontSize: 10
  }
};