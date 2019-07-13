import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { inject, observer } from "mobx-react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { saveAs } from "file-saver";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* 
  ! TODO: fix PDF style!!!
  TODO: able to send email to admin (but not every submission... about one email per week)
  !TODO: DELETE REQUEST
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
        this.props.DepartmentStore.fetchAll();
      }

      createAndDownloadPdf = () => {
        if (this.props.DepartmentStore.selectedDepartment !== "") {
          axios
            .post("/create-pdf", this.props.DepartmentStore)
            .then(() => axios.get("fetch-pdf", { responseType: "blob" }))
            .then(res => {
              const pdfBlob = new Blob([res.data], { type: "application/pdf" });

              saveAs(pdfBlob, "retention.pdf");
            });
        } else {
          this.setState({
            pdfShow: true
          });
        }
      };

      //html2canvas + jsPDF
      makePdf = () => {
        if (this.props.DepartmentStore.selectedDepartment !== "") {
          html2canvas(document.getElementById("schedule")).then(function(canvas) {
            var img = canvas.toDataURL("image/png");
            var doc = new jsPDF({
              orientation: "landscape"
            });
            doc.addImage(img, "JPEG", 10, 50);
            doc.save("retention.pdf");
          });
        } else {
          this.setState({
            pdfShow: true
          });
        }
      };

      onDelete() {
        this.setState({ smShow: false });
        this.props.DepartmentStore.deleteRecord();
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
                  {this.props.DepartmentStore.allDepartments
                    .slice()
                    .filter(x => x.department === department)
                    .map((postDetail, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell style={{ width: 100 }}>
                            <CreateOutlinedIcon
                              name="edit"
                              onClick={() => this.setState({ formShow: true })}
                              variant="outline-warning"
                              style={styles.buttonStyle}
                            />
                            &nbsp;
                            <DeleteOutlinedIcon
                              name="delete"
                              onClick={() => this.setState({ smShow: true })}
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
                            {postDetail.note}
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
              <Modal.Body>
                <Form style={styles.modalFormStyle}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Record Type</Form.Label>
                    <Form.Control style={styles.modalInputStyle} type="text" />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Function</Form.Label>
                    <Form.Control
                      as="select"
                      type="text"
                      id="proposedFunction"
                      ref="proposedfunction"
                      style={styles.modalInputStyle}
                      value={this.props.UniqueStore.proposedFunction}
                      onChange={this.props.UniqueStore.handleChange}
                    >
                      <option>Choose...</option>
                      {this.props.UniqueStore.functionsDropdown
                        .slice()
                        .map(func => (
                          <option key={func.id} {...func}>
                            {func.functiontype}
                          </option>
                        ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Record Category</Form.Label>
                    <Form.Control
                      as="select"
                      id="proposedCategory"
                      ref="proposedcategory"
                      style={styles.modalInputStyle}
                      value={this.props.UniqueStore.proposedCategory}
                      onChange={this.props.UniqueStore.handleChange}
                    >
                      <option>Choose...</option>
                      {this.props.UniqueStore.categoryDropdown
                        .slice()
                        .map(category => (
                          <option key={category.id} {...category}>
                            {category.recordcategoryid}
                          </option>
                        ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Retention</Form.Label>
                    <Form.Control as="textarea" rows="3" />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlTextarea2">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" rows="3" />
                  </Form.Group>
                </Form>
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
                  onClick={() => this.setState({ formShow: false })}
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
    fontSize: 12
  },
  modalInputStyle: {
    height: 28,
    fontSize: 12
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
