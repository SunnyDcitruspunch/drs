import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { inject, observer } from "mobx-react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { saveAs } from "file-saver";

/* 
  ! TODO: fix PDF style!!!
  TODO: able to send email to admin
*/

const DeptRetention = inject("DepartmentStore")(
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

      componentWillMount(){
        this.props.DepartmentStore.fetchAll()        
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

      render() {
        const { DepartmentStore } = this.props;
        let smClose = () => this.setState({ smShow: false });
        let formClose = () => this.setState({ formShow: false });
        const department = DepartmentStore.selectedDepartment;

        return (
          <Container style={styles.tableStyle}>
            <Col md={{ span: 8, offset: 6 }}>
              <ButtonGroup
                size="sm"
                className="mt-6"
                style={styles.buttongroupStyle}
              >
                <Button
                  variant="outline-primary"
                  onClick={this.createAndDownloadPdf}
                  style={{fontSize: 12}}
                >
                  Download as PDF
                </Button>
                <Button variant="outline-primary" style={{fontSize: 12}}>Email this page</Button>
              </ButtonGroup>
            </Col>
            <br />
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Record Type</th>
                  <th>Retention Schedule</th>
                  <th>Notes</th>
                  <th colSpan="2">Actions</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody style={styles.tableFontStyle}>
                {this.props.DepartmentStore.allDepartments.slice().filter(x => x.department === department).map(
                  (postDetail, index) => {
                    return (
                      <tr key={index}>
                        <td>{postDetail.recordtype}</td>
                        <td>{postDetail.description}</td>
                        <td>{postDetail.note}</td>
                        <td>
                          <Button
                            name="edit"
                            onClick={() => this.setState({ formShow: true })}
                            variant="outline-warning"
                            style={styles.buttonStyle}
                          >
                            Edit
                          </Button>
                        </td>
                        <td>
                          <Button
                            name="delete"
                            onClick={() => this.setState({ smShow: true })}
                            variant="outline-danger"
                            style={styles.buttonStyle}
                          >
                            Delete
                          </Button>
                        </td>
                        <td>{postDetail.status}</td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </Table>

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
                    <Form.Control as="select" style={styles.modalInputStyle}>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Record Category</Form.Label>
                    <Form.Control as="select" style={styles.modalInputStyle}>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
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
                  variant="outline-secondary"
                  onClick={() => this.setState({ formShow: false })}
                >
                  Discard
                </Button>
                <Button
                  style={styles.modalButtonStyle}
                  variant="outline-danger"
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
                  variant="outline-secondary"
                  onClick={() => this.setState({ smShow: false })}
                >
                  Close
                </Button>
                <Button
                  style={styles.modalButtonStyle}
                  variant="outline-danger"
                  onClick={() => this.setState({ smShow: false })}
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
                  variant="outline-secondary"
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
    height: 20,
    width: 60,
    padding: 0,
    fontSize: 12
  },
  modalButtonStyle: {
    height: 26,
    width: 84,
    fontSize: 12,
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
    height: 26
  }
};
