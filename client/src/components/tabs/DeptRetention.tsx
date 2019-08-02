import * as React from "react";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
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
  Container
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { IDepartmentStore } from "../../stores/DepartmentStore";
import { IUniqueStore } from "../../stores/UniqueStore";

/* 
  TODO: snackbar after edit/ delete/ submission
  !TODO: sort records by function and record type
*/

interface IProps {
  DepartmentStore: IDepartmentStore;
  UniqueStore: IUniqueStore;
}

interface IState {
  smShow: boolean;
  openEdit: boolean;
  pdfShow: boolean;
  confirmDelete: boolean;
  selectedFunction: string;
  selectedCategory: string;
}

const DeptRetention = inject("DepartmentStore", "UniqueStore")(
  observer(
    class DeptRetnetion extends React.Component<IProps, IState> {
      constructor(props: IProps) {
        super(props);

        this.state = {
          smShow: false,
          openEdit: false,
          pdfShow: false,
          confirmDelete: false,
          selectedCategory: "",
          selectedFunction: ""
        };
      }

      componentWillMount() {
        this.props.DepartmentStore.fetchAllRecords();

        window.scrollTo(0, 0);
      }

      showEditModal(
        pid: string,
        dept: string,
        drecordtype: string,
        dfunction: string,
        dcategory: string,
        ddesc: string,
        dnotes: string
      ) {
        this.setState({ openEdit: true });
        this.setState({ selectedFunction: dfunction });
        this.setState({ selectedCategory: dcategory });
        this.props.DepartmentStore.updateEditID(
          pid,
          dept,
          drecordtype,
          dfunction,
          dcategory,
          ddesc,
          dnotes
        );
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
        window.location.reload();
      };

      handleFunctionChange: any = (e: MouseEvent) => {
        const { value }: any = e.target;
        this.setState({ selectedFunction: value });
        this.props.DepartmentStore.handleChange(e);
      };

      handleCategoryChange: any = (e: MouseEvent) => {
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

      render() {
        let confirmClose = () => this.setState({ confirmDelete: false });
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
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: 10 }}>Actions</TableCell>
                    <TableCell style={{ fontSize: 10, width: 150 }}>
                      Record Type
                    </TableCell>
                    <TableCell style={{ fontSize: 10, width: 300 }}>
                      Retention Schedule
                    </TableCell>
                    <TableCell style={{ fontSize: 10, width: 20 }}>
                      Function
                    </TableCell>
                    <TableCell style={{ fontSize: 10, width: 150 }}>
                      Notes
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={styles.tableFontStyle}>
                  {this.props.DepartmentStore.allRecords
                    .slice()
                    .filter((x: any) => x.department === department)
                    .map((postDetail: any) => {
                      return (
                        <TableRow key={postDetail.id}>
                          <TableCell style={{ width: 100 }}>
                            <CreateOutlinedIcon
                              name="edit"
                              onClick={() =>
                                this.showEditModal(
                                  postDetail.id,
                                  postDetail.department,
                                  postDetail.recordtype,
                                  postDetail.function,
                                  postDetail.recordcategoryid,
                                  postDetail.description,
                                  postDetail.notes
                                )
                              }
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
                            {postDetail.notes}
                          </TableCell>
                          {/* <TableCell style={{ fontSize: 10 }}>
                            {postDetail.status}
                          </TableCell> */}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Paper>

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

            {/* edit record */}
            {this.props.DepartmentStore.allRecords
              .slice()
              .filter(
                (x: any) => x.id === this.props.DepartmentStore.editRecordid
              )
              .map((postDetail: any) => {
                return (
                  <Dialog
                    key={postDetail.id}
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
                          id="editrecordtype"
                          label="Record Type"
                          defaultValue={postDetail.recordtype}
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
                          id="editfunction"
                          style={{ width: 400 }}
                          value={this.state.selectedFunction}
                          onChange={this.handleFunctionChange}
                        >
                          <MenuItem>Choose...</MenuItem>
                          {this.props.UniqueStore.functionsDropdown
                            .slice()
                            .map((func: any) => (
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
                          id="editrecordcategoryid"
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
                          id="editdescription"
                          label="Description"
                          defaultValue={postDetail.description}
                          variant="outlined"
                          margin="normal"
                          onChange={DepartmentStore.handleChange}
                        />
                      </Grid>

                      <Grid>
                        <TextField
                          fullWidth
                          multiline
                          rows="3"
                          id="editnotes"
                          label="Notes"
                          defaultValue={postDetail.notes}
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
  },
  tableFontStyle: {
    fontSize: 11
  }
};
