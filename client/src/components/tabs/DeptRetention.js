import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { inject, observer } from "mobx-react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
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
import TextField from "@material-ui/core/TextField";

/* 
  TODO: able to send email to admin (but not every submission... about one email per week)
  !TODO: refresh after delete (but stay in the same department?)
  !TODO: edit modal dropdownlist default value
  TODO: snackbar after edit/ delete/ submission
  * TODO: change button colors
*/

const DeptRetention = inject("DepartmentStore", "UniqueStore")(
  observer(
    class DeptRetnetion extends Component {
      constructor(props, context) {
        super(props, context);

        this.state = {
          smShow: false,
          formShow: false,
          pdfShow: false
        };
      }

      componentWillMount() {
        this.props.DepartmentStore.fetchAllRecords();
      }

      showEditModal(pid, dept) {
        this.setState({ formShow: true });
        this.props.DepartmentStore.updateEditID(pid)
        this.props.DepartmentStore.updateDepartment(dept)
        console.log(dept)
      }

      //html2canvas + jsPDF
      makePdf = () => {
        const dept = this.props.DepartmentStore.selectedDepartment;
        if (this.props.DepartmentStore.selectedDepartment !== "") {
          html2canvas(document.getElementById("schedule"), {
            width: 960,
            height: 1440
          }).then(function(canvas) {
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
      handleDelete(value) {
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
        window.location.reload();
        window.scrollTo(0, 0);
      }

      editRecord() {
        this.setState({ formShow: false });
        this.props.DepartmentStore.updateRecord();
        window.location.reload()
      }

      render() {
        const { DepartmentStore } = this.props;
        let smClose = () => this.setState({ smShow: false });
        let formClose = () => this.setState({ formShow: false });
        const department = DepartmentStore.selectedDepartment;

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
                  variant="outline-primary"
                  onClick={this.makePdf}
                  style={{ fontSize: 12 }}
                >
                  Download as PDF
                </Button>
                <Button variant="outline-primary" style={{ fontSize: 12 }}>
                  Email this page
                </Button>
              </ButtonGroup>
            </Col>
            <br />
            <Paper style={styles.paperStyle}>
              <Table striped="true" bordered="true" hover="true" id="schedule">
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
                    .filter(x => x.department === department)
                    .map((postDetail, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell style={{ width: 100 }}>
                            <CreateOutlinedIcon
                              name="edit"
                              onClick={() => this.showEditModal(postDetail.id, postDetail.department)}
                              variant="outline-warning"
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
              size="md"
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
                  Edit
                </Modal.Title>
              </Modal.Header>
              {/* 
              ! TODO: change default value to place holder
                change record type textfield style 
                pass data to edit record object in store 
                clean unnecessary code this 
            */}
              <Modal.Body>
                {this.props.DepartmentStore.allRecords
                  .slice()
                  .filter(x => x.id === DepartmentStore.editRecordid)
                  .map((postDetail, index) => {
                    return (
                      <Form style={styles.modalFormStyle} key={index}>
                        <FormGroup>
                          <TextField
                            id="editrecordtype"
                            label="Record Type"
                            placeholder={postDetail.recordtype}
                            variant="outlined"
                            onChange={DepartmentStore.handleChange}
                            margin="normal"
                            style={{ height: 10, fontSize: 8 }}
                          />
                        </FormGroup>
                        <Form.Group style={{ marginTop: 50 }}>
                          <Form.Label>Function</Form.Label>
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
                              .map(func => (
                                <option key={func.id} {...func}>
                                  {func.functiontype}
                                </option>
                              ))}
                          </Form.Control>
                        </Form.Group>
                        <FormGroup>
                          <Form.Label>Record Category</Form.Label>
                          <Form.Control
                            as="select"
                            id="editrecordcategoryid"
                            ref="proposedcategory"
                            style={styles.modalInputStyle}
                            onChange={DepartmentStore.handleChange}
                            placeholder={postDetail.recordcategoryid}
                          >
                            {this.props.UniqueStore.categoryDropdown
                              .slice()
                              .map(category => (
                                <option key={category.id} {...category}>
                                  {category.recordcategoryid}
                                </option>
                              ))}
                          </Form.Control>
                        </FormGroup>
                        <FormGroup>
                          <TextField
                            id="editdescription"
                            label="Retention Description"
                            placeholder={postDetail.description}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                        </FormGroup>
                        <FormGroup>
                          <TextField
                            id="editnotes"
                            label="Notes"
                            placeholder={postDetail.notes}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            style={{ fontSize: 10 }}
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
    height: 30,
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
  }
};
