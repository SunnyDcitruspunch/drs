import React, { Component } from "react";
import Form from "react-bootstrap/Form";
// import * as yup from "yup";
import Col from "react-bootstrap/Col";
import Button from '@material-ui/core/Button';
import Container from "react-bootstrap/Container";
import { inject, observer } from "mobx-react";
import Modal from "react-bootstrap/Modal";
import Snackbar from "@material-ui/core/Snackbar";

/*
  ! TODO: form validation: record type
  ! TODO: need to put the newly added record to pending records.
  TODO:  after submitting a unique record, the record goes to both pending record list and drs tab
 */

const AddUniqueRecords = inject("UniqueStore", "DepartmentStore")(
  observer(
    class AddUniqueRecords extends Component {
      componentWillMount() {
        this.props.UniqueStore.fetchFunctions();
        this.props.UniqueStore.fetchCategory();
      }

      state = {
        modalShow: false,
        open: false
      };
    
      handleClose = () => {
        this.setState({ open: false });
      };

      submitRecords = e => {
        if (this.props.DepartmentStore.selectedDepartment === "") {
          this.setState({ smShow: true });
          console.log("select a department to add an unique record");
        } else {
          e.preventDefault();

          console.log(this.props.DepartmentStore.selectedDepartment)
          this.props.UniqueStore.submitRecords(this.props.DepartmentStore.selectedDepartment)

          this.refs.recordtype.value = "";
          this.refs.proposedfunction.value = "Choose...";
          this.refs.proposedcategory.value = "Choose...";
          this.refs.proposedretention.value = "";
          this.refs.notes.value = "";
          this.setState({ open: true });
          window.scrollTo(0, 0)
        }
      };

      render() {
        let smClose = () => this.setState({ smShow: false });
        const { UniqueStore } = this.props;

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

                <Form.Group style={styles.titleStyle}>
                  <Form.Label>Proposed Function</Form.Label>
                  <Form.Control
                    as="select"
                    type="text"
                    id="proposedFunction"
                    ref="proposedfunction"
                    style={{ fontSize: 12 }}
                    value={UniqueStore.proposedFunction}
                    onChange={UniqueStore.handleChange}
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

                <Form.Group style={styles.titleStyle}>
                  <Form.Label>Proposed Category</Form.Label>
                  <Form.Control
                    as="select"
                    type="text"
                    id="proposedCategory"
                    ref="proposedcategory"
                    style={{ fontSize: 12 }}
                    value={UniqueStore.proposedCategory}
                    onChange={UniqueStore.handleChange}
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

                <Form.Group style={styles.titleStyle}>
                  <Form.Label>Proposed Retention</Form.Label>
                  <Form.Control
                    type="text"
                    style={styles.inputStyle}
                    value={UniqueStore.proposedRetention}
                    onChange={UniqueStore.handleChange}
                    id="proposedRetention"
                    ref="proposedretention"
                  />
                </Form.Group>

                <Form.Group style={styles.titleStyle}>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    id="Comment"
                    style={{ fontSize: 12 }}
                    value={UniqueStore.Comment}
                    onChange={UniqueStore.handleChange}
                    type="text"
                    ref="notes"
                  />
                </Form.Group>

                <div style={styles.footerStyle}>
                  <Button
                    variant="outlined"
                    color="primary"
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

            <Snackbar
              open={this.state.open}
              onClose={this.handleClose}
              // TransitionComponent={this.state.Transition}
              autoHideDuration={2000}
              ContentProps={{
                "aria-describedby": "message-id"
              }}
              message={
                <span id="message-id">
                  Your record is succesffuly sent to pending queue.
                </span>
              }
            />
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
