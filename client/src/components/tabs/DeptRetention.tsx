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
  TextField,
  Select,
  Grid,
  MenuItem,
  InputLabel,
  Container,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { IDepartmentStore, IPostDetail } from "../../stores/DepartmentStore";
import { IUniqueStore } from "../../stores/UniqueStore";
import { IData, IOrder } from "../common/EnhancedTableHead";
import EnhancedTableHead from "../common/EnhancedTableHead";

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
  selectedFunction: string;
  selectedCategory: string;
  archivalOptions: Array<string>;
  order: IOrder;
  orderBy: string;
  sortDirection: any;
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
          selectedCategory: "",
          selectedFunction: "",
          archivalOptions: ["Archival", "Vital", "Highly Confidential"],
          order: "asc",
          orderBy: "recordtype",
          sortDirection: "asc"
        };
      }

      componentDidMount() {
        this.props.DepartmentStore.fetchAllRecords();
      }

      showEditModal(postDetail: IPostDetail) {
        if (postDetail.recordcategoryid === "common") {
          this.setState({ cannotEdit: true });
        } else {
          this.setState({ openEdit: true });
          this.setState({ selectedFunction: postDetail.function });
          this.setState({ selectedCategory: postDetail.recordcategoryid });
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
      handleDelete(value: string) {
        //show delete modal
        this.setState({ confirmDelete: true });
        this.props.DepartmentStore.deleteID = value;
      }

      //click delete in delete modal
      onDelete = () => {
        this.setState({ confirmDelete: false });
        this.props.DepartmentStore.deleteRecord();
        window.scrollTo(0, 0);
        window.location.reload();
      };

      editRecord: any = () => {
        this.setState({ openEdit: false });
        this.props.DepartmentStore.updateRecord();
        window.scrollTo(0, 0);
      };

      handleCategoryChange: any = (e: any) => {
        const { value }: any = e.target;
        this.setState({ selectedCategory: value });
        this.props.DepartmentStore.handleChange(e);
      };

      closeEdit: any = () => {
        this.setState({
          openEdit: false,
          selectedCategory: "",
          selectedFunction: ""
        });
      };

      stableSort<T>(array: T[], cmp: (a: T, b: T) => number) {
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

      render() {
        let confirmClose = () => this.setState({ confirmDelete: false });
        let cannoteditClose = () => this.setState({ cannotEdit: false });
        const { DepartmentStore } = this.props;
        const department = DepartmentStore.selectedDepartment;

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
            <Paper>
              <Table id="schedule">
                <EnhancedTableHead
                  order={this.state.order}
                  orderBy={this.state.orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody style={{ fontSize: 11 }}>
                  {this.stableSort(
                    DepartmentStore.allRecords,
                    this.getSorting(this.state.order, this.state.orderBy)
                  )
                    .slice()
                    .filter((x: any) => x.department === department)
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
              onClose={confirmClose}
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
            <Dialog
              open={this.state.cannotEdit}
              onClose={confirmClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Cannot Edit Record"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Cannot edit common records.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => this.setState({ cannotEdit: false })}
                  color="primary"
                  autoFocus
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            {/* edit record */}
            {this.props.DepartmentStore.allRecords
              .slice()
              .filter(
                (x: any) => x.id === this.props.DepartmentStore.editrecord.id
              )
              .map((editDetail: IPostDetail) => {
                const functions = this.props.UniqueStore.functionsDropdown;
                console.log(functions);
                return (
                  <Dialog
                    key={editDetail.id}
                    open={this.state.openEdit}
                    onClose={confirmClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Edit Record"}
                    </DialogTitle>

                    <DialogContent>
                      <Grid>
                        <TextField
                          fullWidth
                          id="recordtype"
                          name="recordtype"
                          label="Record Type"
                          defaultValue={editDetail.recordtype}
                          variant="outlined"
                          onChange={DepartmentStore.handleChange}
                          margin="normal"
                        />
                      </Grid>

                      <Grid item style={{ marginBottom: 10 }}>
                        <InputLabel shrink htmlFor="age-label-placeholder">
                          Record Function
                        </InputLabel>

                        <Select
                          id="function"
                          name="function"
                          style={{ width: 400 }}
                          value={this.state.selectedFunction}
                          onChange={DepartmentStore.handleChange}
                        >
                          <MenuItem>Choose...</MenuItem>
                          {functions.slice().map((func: any) => (
                            <MenuItem key={func.id} value={func.functiontype}>
                              {func.functiontype}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>

                      <Grid item style={{ marginTop: 10 }}>
                        <InputLabel shrink htmlFor="age-label-placeholder">
                          Record Category
                        </InputLabel>
                        <Select
                          id="recordcategoryid"
                          name="recordcategoryid"
                          style={{ width: 400 }}
                          value={this.state.selectedCategory}
                          onChange={this.handleCategoryChange}
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

                      <Grid>
                        <TextField
                          fullWidth
                          multiline
                          rows="3"
                          id="description"
                          name="description"
                          label="Description"
                          defaultValue={editDetail.description}
                          variant="outlined"
                          margin="normal"
                          onChange={DepartmentStore.handleChange}
                        />
                      </Grid>

                      <FormControl component="fieldset">
                        <FormLabel component="legend">Archival</FormLabel>
                        <RadioGroup row aria-label="archival" name="archival">
                          {this.state.archivalOptions.map((x: string) => {
                            return (
                              <FormControlLabel
                                key={x}
                                value={x}
                                control={<Radio color="primary" />}
                                label={x}
                                labelPlacement="end"
                                id="archival"
                                name="archival"
                                onClick={DepartmentStore.handleChange}
                              />
                            );
                          })}
                        </RadioGroup>
                      </FormControl>

                      <Grid>
                        <TextField
                          fullWidth
                          multiline
                          rows="3"
                          id="notes"
                          name="notes"
                          label="Notes"
                          defaultValue={editDetail.notes}
                          variant="outlined"
                          margin="normal"
                          onChange={DepartmentStore.handleChange}
                        />
                      </Grid>
                    </DialogContent>

                    <DialogActions>
                      <Button
                        onClick={this.editRecord}
                        color="primary"
                        autoFocus
                      >
                        Edit this record
                      </Button>
                      <Button onClick={this.closeEdit} color="primary">
                        Cancel
                      </Button>
                    </DialogActions>
                  </Dialog>
                );
              })}
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
