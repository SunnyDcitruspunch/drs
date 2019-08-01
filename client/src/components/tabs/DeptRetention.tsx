import * as React from "react";
import Container from "react-bootstrap/Container";
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
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { IDepartmentStore } from "../../stores/DepartmentStore";
import { IUniqueStore } from "../../stores/UniqueStore";

/* 
  TODO: able to send email to admin (but not every submission... about one email per week)
  !TODO: edit modal dropdownlist default value
  TODO: snackbar after edit/ delete/ submission
  * TODO: change button colors
*/

interface IProps {
  DepartmentStore: IDepartmentStore;
  UniqueStore: IUniqueStore;
}

interface IState {
  smShow: boolean;
  formShow: boolean;
  pdfShow: boolean;
  confirmDelete: boolean;
}

const DeptRetention = inject("DepartmentStore", "UniqueStore")(
  observer(
    class DeptRetnetion extends React.Component<IProps, IState> {
      constructor(props: IProps) {
        super(props);

        this.state = {
          smShow: false,
          formShow: false,
          pdfShow: false,
          confirmDelete: false
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
        this.setState({ formShow: true });
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
            width: 960,
            height: 1440
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
        console.log(this.props.DepartmentStore.deleteID);
      }

      //click delete in delete modal
      onDelete = () => {
        //this.setState({ confirmDelete: false });
        console.log("ready to delete");
        this.props.DepartmentStore.deleteRecord();
        window.scrollTo(0, 0);
        window.location.reload();
      }

      editRecord() {
        this.setState({ formShow: false });
        this.props.DepartmentStore.updateRecord();
        window.scrollTo(0, 0);
        window.location.reload();
      }

      render() {
        let confirmClose = () => this.setState({ confirmDelete: false });
        const { DepartmentStore } = this.props;
        const department = DepartmentStore.selectedDepartment;
        //const classes = useStyles();

        return (
          <Container style={styles.tableStyle}>
            <ButtonGroup
              // size="sm"
              className="mt-6"
              style={styles.buttongroupStyle}
              color="primary"
              aria-label="Outlined primary button group"
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={this.makePdf}
                style={{ fontSize: 12 }}
              >
                Download as PDF
              </Button>
            </ButtonGroup>
            <br />
            <Paper>
              <Table id="schedule">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: 10 }}>Actions</TableCell>
                    <TableCell style={{ fontSize: 10 }}>Record Type</TableCell>
                    <TableCell style={{ fontSize: 10 }}>
                      Retention Schedule
                    </TableCell>
                    <TableCell style={{ fontSize: 10 }}>Notes</TableCell>
                    <TableCell style={{ fontSize: 10 }}>Status</TableCell>
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
          </Container>
        );
      }
    }
  )
);

// const DeptRetention = withRouter(DeptRetentionImpl as any)

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
  modalButtonStyle: {
    height: 26,
    width: 84,
    fontSize: 10,
    padding: 0
  },
  modalFormStyle: {
    paddingTop: 6,
    fontSize: 10
  },
  modalInputStyle: {
    fontSize: 10
  },
  tableFontStyle: {
    fontSize: 11
  },
  pageStyle: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4"
  },
  sectionStyle: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  buttongroupStyle: {
    height: 28
  },
  paperStyle: {
    width: "100%",
    overflowX: "auto"
  },
  customInputStyle: {
    borderRadius: 5,
    fontSize: 10,
    padding: 6,
    border: "Gainsboro solid 1px"
  }
};
