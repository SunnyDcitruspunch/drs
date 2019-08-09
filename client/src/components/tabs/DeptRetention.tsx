import * as React from "react";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
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
  Select,
  MenuItem,
  InputLabel,
  Container
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { IDepartmentStore, IPostDetail } from "../../stores/DepartmentStore";
import { IUniqueStore } from "../../stores/UniqueStore";
import { IData, IOrder } from "../common/EnhancedTableHead";
import EnhancedTableHead from "../common/EnhancedTableHead";
import CannotEditModal from "../common/CannotEditModal";
import Snackbar from "../common/Snackbar";
import EditModal from '../common/EditModal'

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
  snackbar: boolean
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

const DeptRetention = inject("DepartmentStore", "UniqueStore")(
  observer(
    class DeptRetnetion extends React.Component<IProps, IState> {
      constructor(props: IProps) {
        super(props);

        this.state = {
          smShow: false,
          openEdit: false,
          cannotEdit: false,
          pdfShow: false,
          confirmDelete: false,
          order: "asc",
          orderBy: "recordtype",
          sortDirection: "asc",
          filterbyFunction: "",
          snackbar: false
          // allRecords: this.props.DepartmentStore._allRecords
        };
      }

      componentDidMount = () => {
        this.props.DepartmentStore.fetchAllRecords();
        this.props.UniqueStore.fetchArchival();
        // this.setState({ allRecords: this.props.DepartmentStore._allRecords });
      };

      showEditModal(postDetail: IPostDetail) {
        if (postDetail.recordcategoryid === "common") {
          this.setState({ cannotEdit: true });
        } else {
          this.setState({ openEdit: true });
          this.props.DepartmentStore.updateEditID(postDetail);
        }
      }

      //html2canvas + jsPDF
      makePdf = () => {
        const dept = this.props.DepartmentStore.selectedDepartment;
        const el: any = document.getElementById("schedule");

        if (this.props.DepartmentStore.selectedDepartment !== "") {
          html2canvas(el, {
            width: 1200,
            height: 1200
          }).then(function(canvas: any) {
            var img = canvas.toDataURL("image/png");
            var doc = new jsPDF({
              orientation: "landscape"
            });
            doc.text("Department Retention Schedule: " + dept, 10, 10);
            doc.addImage(img, "JPEG", -50, 15);
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
        setInterval(() => {
          this.setState({ snackbar: false })
        }, 3000)
      };

      closeEdit: any = () => {
        this.setState({
          openEdit: false
        });
      };

      stableSort<T>(array: IPostDetail[], cmp: (a: T, b: T) => number) {
        if (this.state.filterbyFunction === "") {
          const stabilizedThis = array.map(
            (el: any, index: any) => [el, index] as [T, number]
          );
          stabilizedThis.sort((a: any, b: any) => {
            const order = cmp(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
          });
          return stabilizedThis.map((el: any) => el[0]);
        } else {
          const stabilizedThis = array
            .filter(r => r.function === this.state.filterbyFunction)
            .map((el: any, index: any) => [el, index] as [T, number]);
          stabilizedThis.sort((a: any, b: any) => {
            const order = cmp(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
          });
          return stabilizedThis.map((el: any) => el[0]);
        }
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
        const { DepartmentStore, UniqueStore } = this.props;
        const department = DepartmentStore.selectedDepartment;
        const functions = this.props.UniqueStore.functionsDropdown;
        return (
          <Container style={styles.tableStyle}>
            <InputLabel shrink htmlFor="age-label-placeholder">
              Filter by Record Function
            </InputLabel>
            <Select
              id="function"
              name="function"
              style={{ width: 100 }}
              value={this.state.filterbyFunction}
              onChange={this.handlefilterfunction}
            >
              <MenuItem value="">Show all records</MenuItem>
              {functions.slice().map((func: any) => (
                <MenuItem key={func.id} value={func.functiontype}>
                  {func.functiontype}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="outlined"
              color="primary"
              onClick={this.makePdf}
              style={{ fontSize: 12, marginBottom: 10 }}
            >
              Download as PDF
            </Button>
            <Paper>
              <Table id="schedule">
                <EnhancedTableHead
                  order={this.state.order}
                  orderBy={this.state.orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody style={{ fontSize: 11 }}>
                  {this.stableSort(
                    DepartmentStore._allRecords,
                    this.getSorting(this.state.order, this.state.orderBy)
                  )
                    .slice()
                    .filter((x: IPostDetail) => x.department === department)
                    .map((postDetail: IPostDetail) => {
                      return (
                        <TableRow hover key={postDetail.id}>
                          <TableCell style={{ width: 100 }}>
                            <CreateOutlinedIcon
                              name="edit"
                              onClick={() => this.showEditModal(postDetail)}
                              style={styles.buttonStyle}
                            />
                            &nbsp;
                            <DeleteOutlinedIcon
                              name="delete"
                              onClick={() => this.handleDelete(postDetail.id)}
                              style={styles.buttonStyle}
                            />
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {postDetail.recordtype}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {postDetail.description}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {postDetail.function}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {postDetail.recordcategoryid}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {postDetail.archival}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {postDetail.notes}
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
            <CannotEditModal
              open={this.state.cannotEdit}
              close={cannoteditClose}
              click={() => this.setState({ cannotEdit: false })}
            />

            {/* edit record */}
            {this.props.DepartmentStore.allRecords
              .filter(
                (x: any) => x.id === this.props.DepartmentStore.editrecord.id
              )
              .map((editDetail: IPostDetail) => {
                return (
                  <EditModal 
                    record={editDetail}
                    open={this.state.openEdit}
                    close={this.closeEdit}
                    functionList={functions}
                    categoryList={this.props.UniqueStore.categoryDropdown}
                    archivalList={this.props.UniqueStore.archivalDropdown}
                    change={DepartmentStore.handleChange}
                    saveedit={this.editRecord}
                  />
                );
              })}
            <Snackbar _open={this.state.snackbar}  msg="Successfully edited the record." />
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
