import React, { Component } from "react";
import Form from "react-bootstrap/Form";
// import * as yup from "yup";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { inject, observer } from "mobx-react";
import Modal from "react-bootstrap/Modal";

const AddUniqueRecords = inject("UniqueStore", "DepartmentStore")(
  observer(
    class AddUniqueRecords extends Component {
      componentWillMount() {
        this.props.UniqueStore.fetchFunctions();
        this.props.UniqueStore.fetchCategory();
      }

      state = {
        modalShow: false
      };

      submitRecords = e => {
        if (this.props.DepartmentStore.selectedDepartment === "") {
          this.setState({ smShow: true });
          console.log("select a department to add an unique record");
        } else {
          e.preventDefault();

          // this.props.UniqueStore.addRecords({
          //     id: Math.floor(Math.random()*10),
          //     recordType: this.recordtypevalue,
          //     proposedFunction: this.refs.proposedfunction,
          //     poroposedCategory: this.refs.proposedcategory,
          //     proposedRetention: this.refs.proposedretention,
          //     Comment: this.refs.notes
          // });

          // this.refs.recordtype.value = null;
          // this.refs.proposedfunction.value = "Choose...";
          // this.refs.proposedcategory.value = "Choose...";
          // this.refs.proposedretention.value = null;
          // this.refs.notes.value = null;
          //console.log("submitted");
        }
      };

      render() {
        // const schema = yup.object({
        //   RecordType: yup.string().required(),
        //   ProposedFunction: yup.string(),
        //   ProposedCategory: yup.string(),
        //   Notes: yup.string()
        // });
        //console.log(this.props.DepartmentStore.selectedDepartment)
        let smClose = () => this.setState({ smShow: false });
        const { UniqueStore } = this.props

        return (
          <Container>
            <Col md={{ span: 8, offset: 2 }}>
              <Form
                noValidate
                onSubmit={this.submitRecords}
                style={styles.formStyle}
              >
                <Form.Group style={styles.titleStyle}>
                  <Form.Label>Record Type</Form.Label>
                  <Form.Control
                    type="text"
                    id="recordType"
                    ref="recordtype"
                    style={styles.inputStyle}
                    value={UniqueStore.recordType}
                    onChange={UniqueStore.handleChange}
                  />
                </Form.Group>

                <Form.Group
                  controlId="proposedfunction"
                  style={styles.titleStyle}
                >
                  <Form.Label>Proposed Function</Form.Label>
                  <Form.Control
                    as="select"
                    type="text"
                    ref="proposedfunction"
                    style={{ fontSize: 12 }}
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

                <Form.Group
                  controlId="proposedcategory"
                  style={styles.titleStyle}
                >
                  <Form.Label>Proposed Category</Form.Label>
                  <Form.Control
                    as="select"
                    type="text"
                    ref="proposedcategory"
                    style={{ fontSize: 12 }}
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

                <Form.Group
                  style={styles.titleStyle}
                  controlId="proposedretention"
                >
                  <Form.Label>Proposed Retention</Form.Label>
                  <Form.Control
                    type="text"
                    style={styles.inputStyle}
                    ref="proposedretention"
                  />
                </Form.Group>

                <Form.Group style={styles.titleStyle} controlId="notes">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    ref="notes"
                    style={{ fontSize: 12 }}
                    type="text"
                  />
                </Form.Group>

                <div style={styles.footerStyle}>
                  <Button
                    variant="outline-primary"
                    type="button"
                    label="submit form"
                    style={styles.buttonStyle}
                    onClick={e => this.submitRecords(e)}
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </Col>

            <Modal
              size="sm"
              show={this.state.smShow}
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
                  onClick={() => this.setState({ smShow: false })}
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

export default AddUniqueRecords;

const styles = {
  buttonStyle: {
    height: 26,
    width: 60,
    fontSize: 12,
    padding: 0
  },
  formStyle: {
    height: 32,
    fontSize: 11,
    paddingTop: 18
  },
  inputStyle: {
    height: 28,
    fontSize: 11
  },
  titleStyle: {
    textAlign: "left"
  },
  errorStyle: {
    color: "red"
  },
  footerStyle: {
    height: 60
  },
  modalButtonStyle: {
    height: 26,
    width: 84,
    fontSize: 12,
    padding: 0
  }
};
