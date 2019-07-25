import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Button, createStyles, Theme, makeStyles, Snackbar } from "@material-ui/core";
import Container from "react-bootstrap/Container";
import { inject, observer } from "mobx-react";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "100%",
      overflowX: "auto"
    },
    title: {
      textAlign: "left"
    }
  })
);

export interface IUniqueRecords {
  recordType: string;
  department: string;
  proposedFunction: string;
  proposedCategory: string;
  proposedRetention: string;
  Comment: string
}

export interface IUniqueStore {
  fetchFunctions: () => void;
  fetchCategory: () => void;
  uniquerecords: IUniqueRecords
  functionsDropdown: Array<string>;
  categoryDropdown: any;
  submitRecords: (dept: string) => void;
  handleChange: (e: any) => void;
}

interface DepartmentStore {
  selectedDepartment?: string;
}

interface IProps {
  DepartmentStore: DepartmentStore;
  UniqueStore: IUniqueStore;
}

interface IState {
  smShow: boolean;
  snackbarShow: boolean;
  shown: boolean;
}

const AddUniqueRecords = inject("UniqueStore", "DepartmentStore")(
  observer(
    class AddUniqueRecords extends Component<IProps, IState> {
      UNSAFE_componentWillMount() {
        this.props.UniqueStore.fetchFunctions();
        this.props.UniqueStore.fetchCategory();
      }

      state: IState = {
        smShow: false,
        snackbarShow: false,
        shown: false
      };

      handleClose = () => {
        this.setState({
          snackbarShow: false
        });
      };

      submitRecords = (e: any) => {
        if (this.props.DepartmentStore.selectedDepartment === "") {
          this.setState({ smShow: true });
          console.log("select a department to add an unique record");
        } else if (this.props.UniqueStore.uniquerecords.recordType === "") {
          this.setState({ shown: true });
        } else {
          e.preventDefault();

          console.log(this.props.DepartmentStore.selectedDepartment);
          this.props.UniqueStore.submitRecords(
            this.props.DepartmentStore.selectedDepartment || ""
          );

          // this.refs.recordtype.value = "";
          // this.refs.proposedfunction.value = "Choose...";
          // this.refs.proposedcategory.value = "Choose...";
          // this.refs.proposedretention.value = "";
          // this.refs.notes.value = "";
          this.setState({ snackbarShow: true });
          window.scrollTo(0, 0);
          this.props.UniqueStore.uniquerecords.recordType = "";
          this.setState({ shown: false });
          window.location.reload();
        }
      };

      render() {
        let smClose = () => this.setState({ smShow: false });
        const { UniqueStore } = this.props;
        const shown = {
          display: this.state.shown ? "block" : "none",
          color: "#ff0000"
        };
        let classes = useStyles();
        const [open, setOpen] = React.useState(false);

        return (
          <Container>
            <Col md={{ span: 8, offset: 2 }}>
              <Form
                noValidate
                onSubmit={this.submitRecords}
                style={styles.formStyle}
              >
                <Form.Group className={classes.title}>
                  <Form.Label>Record Type</Form.Label>
                  <Form.Control
                    type="text"
                    id="recordType"
                    ref="recordtype"
                    style={styles.inputStyle}
                    value={UniqueStore.uniquerecords.recordType}
                    onChange={UniqueStore.handleChange}
                  />
                  <span style={shown}>*Please fill out a record type</span>
                </Form.Group>

                <Form.Group className={classes.title}>
                  <Form.Label>Proposed Function</Form.Label>
                  <Form.Control
                    as="select"
                    type="text"
                    id="proposedFunction"
                    ref="proposedfunction"
                    style={{ fontSize: 12 }}
                    value={UniqueStore.uniquerecords.proposedFunction}
                    onChange={UniqueStore.handleChange}
                  >
                    <option>Choose...</option>
                    {this.props.UniqueStore.functionsDropdown
                      .slice()
                      .map((func: any) => (
                        <option key={func.id} {...func}>
                          {func.functiontype}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className={classes.title}>
                  <Form.Label>Proposed Category</Form.Label>
                  <Form.Control
                    as="select"
                    type="text"
                    id="proposedCategory"
                    ref="proposedcategory"
                    style={{ fontSize: 12 }}
                    value={UniqueStore.uniquerecords.proposedCategory}
                    onChange={UniqueStore.handleChange}
                  >
                    <option>Choose...</option>
                    {this.props.UniqueStore.categoryDropdown
                      .slice()
                      .map((category: any) => (
                        <option key={category.id} {...category}>
                          {category.recordcategoryid}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className={classes.title}>
                  <Form.Label>Proposed Retention</Form.Label>
                  <Form.Control
                    type="text"
                    style={styles.inputStyle}
                    value={UniqueStore.uniquerecords.proposedRetention}
                    onChange={UniqueStore.handleChange}
                    id="proposedRetention"
                    ref="proposedretention"
                  />
                </Form.Group>

                <Form.Group className={classes.title}>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    id="Comment"
                    style={{ fontSize: 12 }}
                    value={UniqueStore.uniquerecords.Comment}
                    onChange={UniqueStore.handleChange}
                    type="text"
                    ref="notes"
                  />
                </Form.Group>

                <div style={styles.footerStyle}>
                  <Button
                    variant="outlined"
                    //label="submit form"
                    style={styles.buttonStyle}
                    onClick={e => this.submitRecords(e)}
                  >
                    <Link to="/AddUniqueRecords">Submit</Link>
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
                  variant="outlined"
                  onClick={() => this.setState({ smShow: false })}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            <Snackbar
              open={open}
              //show={this.state.snackbarShow}
              style={{ backgroundColor: "#4BB543" }}
              onClose={this.handleClose}
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
