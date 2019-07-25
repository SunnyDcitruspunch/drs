import * as React from "react";
import { Table, Button, ButtonGroup, TextField } from "@material-ui/core";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { inject, observer } from "mobx-react";
import Col from "react-bootstrap/Col";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import { DepartmentStore, UniqueStore } from "../../stores";
//import { UniqueStore } from "../../stores/UniqueStore";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
// import SvgIcon from "@material-ui/core/SvgIcon";

/* 
  TODO: able to send email to admin (but not every submission... about one email per week)
  !TODO: edit modal dropdownlist default value
  TODO: snackbar after edit/ delete/ submission
  * TODO: change button colors
*/

// interface IntrinsicElements {
//   Button: { variant: string };
// }

interface IProps {
  DepartmentStore: DepartmentStore;
  UniqueStore: UniqueStore;
  props: any;
  context: any;
  Button: { variant: string };
  componentWillMount: () => void;
  showEditModal: () => void;
  makePdf: () => void;
}

interface IState {
  smShow: boolean;
  formShow: boolean;
  pdfShow: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "100%",
      overflowX: "auto"
    },
    customInput: {
      borderRadius: 5,
      fontSize: 10,
      padding: 6,
      border: "Gainsboro solid 1px"
    },
    dense: {
      marginTop: theme.spacing(2)
    }
  })
);

const DeptRetention = inject("DepartmentStore", "UniqueStore")(
  observer(
    class DeptRetnetion extends React.Component<IProps, IState> {
      constructor(props: IProps, context: IProps) {
        super(props, context);

        this.state = {
          smShow: false,
          formShow: false,
          pdfShow: false
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
        // this.props.DepartmentStore.updateDepartment(dept);
        //console.log(this.props.DepartmentStore.editRecordid);
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
        this.setState({ smShow: true });
        this.props.DepartmentStore.deleteID = value;
        console.log(this.props.DepartmentStore.deleteID);
      }

      //click delete in delete modal
      onDelete() {
        this.setState({ smShow: false });
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
        const { DepartmentStore } = this.props;
        let smClose = () => this.setState({ smShow: false });
        let formClose = () => this.setState({ formShow: false });
        const department = DepartmentStore.selectedDepartment;
        const classes = useStyles();
        // let CreateOutlinedIcon: React.ComponentType<any>;
        let DeleteOutlinedIcon: React.ComponentType<any>;
        // let Table: React.ComponentType<any>;
        //console.log(this.props.DepartmentStore.selectedDepartment)

        return (
          <Container style={styles.tableStyle}>
            <Col md={{ span: 8, offset: 6 }}>
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
            </Col>
            <br />
            <Paper className={classes.paper}>
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
                              // variant="outline-warning"
                              style={styles.buttonStyle}
                            />
                            &nbsp;
                            <DeleteOutlinedIcon
                              name="delete"
                              onClick={() => this.handleDelete(postDetail.id)}
                              variant="outline-danger"
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

            <Modal
              //size="md"
              show={this.state.formShow}
              onHide={formClose}
              aria-labelledby="example-modal-sizes-title-sm"
              backdrop="static"
            >
              <Modal.Header closeButton>
                <Modal.Title
                  id="example-modal-sizes-title-sm"
                  style={{ fontSize: 16 }}
                >
                  Edit: {DepartmentStore.editDepartment}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {this.props.DepartmentStore.allRecords
                  .slice()
                  .filter(
                    (x: any) => x.id === this.props.DepartmentStore.editRecordid
                  )
                  .map((postDetail: any) => {
                    return (
                      <Form key={postDetail.id}>
                        <FormGroup>
                          {/* <FormLabel style={{ fontSize: 10 }}>
                            Record Type
                          </FormLabel> */}
                          <TextField
                            label="Record Type"
                            id="editrecordtype"
                            defaultValue={postDetail.recordtype}
                            variant="outlined"
                            onChange={DepartmentStore.handleChange}
                            margin="normal"
                            style={styles.customInputStyle}
                          />
                        </FormGroup>
                        <FormGroup style={{ marginTop: 10 }}>
                          <FormLabel style={{ fontSize: 10 }}>
                            Function
                          </FormLabel>
                          <Form.Control
                            as="select"
                            type="text"
                            id="editfunction"
                            ref="proposedfunction"
                            style={styles.modalInputStyle}
                            onChange={DepartmentStore.handleChange}
                          >
                            <option>{postDetail.function}</option>
                            {this.props.UniqueStore.functionsDropdown
                              .slice()
                              .map((func: any) => (
                                <option key={func.id} {...func}>
                                  {func.functiontype}
                                </option>
                              ))}
                          </Form.Control>
                        </FormGroup>
                        <FormGroup style={{ marginTop: 10 }}>
                          <FormLabel style={{ fontSize: 10 }}>
                            Record Category
                          </FormLabel>
                          <Form.Control
                            as="select"
                            id="editrecordcategoryid"
                            ref="proposedcategory"
                            style={styles.modalInputStyle}
                            onChange={DepartmentStore.handleChange}
                            defaultValue={postDetail.recordcategoryid}
                          >
                            {this.props.UniqueStore.categoryDropdown
                              .slice()
                              .map((category: any) => (
                                <option key={category.id} {...category}>
                                  {category.recordcategoryid}
                                </option>
                              ))}
                          </Form.Control>
                        </FormGroup>
                        <FormGroup style={{ marginTop: 10 }}>
                          <FormLabel style={{ fontSize: 10 }}>
                            Retention Description
                          </FormLabel>
                          <TextField
                            id="editdescription"
                            defaultValue={postDetail.description}
                            onChange={DepartmentStore.handleChange}
                            margin="normal"
                            variant="outlined"
                            //style={styles.customInputStyle}
                            className={classes.dense}
                          />
                        </FormGroup>
                        <FormGroup style={{ marginTop: 10 }}>
                          <FormLabel style={{ fontSize: 10 }}>Notes</FormLabel>
                          <TextField
                            id="editnotes"
                            defaultValue={postDetail.notes}
                            onChange={DepartmentStore.handleChange}
                            margin="normal"
                            variant="outlined"
                            //style={styles.customInputStyle}
                            className={classes.dense}
                          />
                        </FormGroup>
                      </Form>
                    );
                  })}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  style={styles.modalButtonStyle}
                  variant="outlined"
                  color="primary"
                  onClick={() => this.setState({ formShow: false })}
                >
                  Discard
                </Button>
                <Button
                  style={styles.modalButtonStyle}
                  variant="outlined"
                  color="primary"
                  onClick={() => this.editRecord()}
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal
              size="sm"
              show={this.state.smShow}
              onHide={smClose}
              aria-labelledby="example-modal-sizes-title-sm"
              backdrop="static"
            >
              <Modal.Header closeButton>
                <Modal.Title
                  id="example-modal-sizes-title-sm"
                  style={{ fontSize: 16 }}
                >
                  Delete Record
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ fontSize: 12 }}>
                Are you sure you want to delete this record?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  style={styles.modalButtonStyle}
                  variant="outlined"
                  color="primary"
                  onClick={() => this.setState({ smShow: false })}
                >
                  Close
                </Button>
                <Button
                  style={styles.modalButtonStyle}
                  variant="outlined"
                  color="primary"
                  onClick={() => this.onDelete()}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal
              size="sm"
              show={this.state.pdfShow}
              onHide={smClose}
              aria-labelledby="example-modal-sizes-title-sm"
            >
              <Modal.Body style={{ fontSize: 12 }}>
                Please select a department.
              </Modal.Body>
              <Modal.Footer style={{ height: 20 }}>
                <Button
                  style={styles.modalButtonStyle}
                  variant="outlined"
                  color="primary"
                  onClick={() => this.setState({ pdfShow: false })}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Container>
        );
      }
    }
  )
);

export default DeptRetention;

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
