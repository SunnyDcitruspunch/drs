import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Table from "@material-ui/core/Table";
import Container from "react-bootstrap/Container";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Modal from "react-bootstrap/Modal";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import Form from "react-bootstrap/Form";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";

/*
  !TODO: refactor modal to material ui compnent
*/

const CommonRecords = inject("RecordStore", "DepartmentStore", "UniqueStore")(
  observer(
    class CommonRecords extends Component {
      constructor(props) {
        super(props);
        this.state = {
          modalShow: false, //if not select a department
          editShow: false,
          selectrecord: []
        };
        this.onSelect = this.onSelect.bind(this);
      }

      UNSAFE_componentWillMount() {
        this.props.RecordStore.fetchRecords();
      }

      onSelect = e => {
        if (e.target.checked) {
          this.setState(
            {
              selectrecord: [...this.state.selectrecord, e.target.value]
            },
            () => {
              console.log(this.state.selectrecord);
            }
          );
        } else {
          let remove = this.state.selectrecord.indexOf(e.target.value);
          this.setState(
            {
              selectrecord: this.state.selectrecord.filter(
                (_, i) => i !== remove
              )
            },
            () => {
              console.log(this.state.selectrecord);
            }
          );
        }
      };

      handleEditRecord(
        cid,
        ccode,
        cfunction,
        ccategory,
        ctype,
        cdescription,
        carchival
      ) {
        this.setState({ editShow: true });
        this.props.RecordStore.getEditRecord(
          cid,
          ccode,
          cfunction,
          ccategory,
          ctype,
          cdescription,
          carchival
        );
      }

      // defference between () and e??
      saveEdit = e => {
        this.setState({ editShow: false });
        this.props.RecordStore.updateRecord();
      }

      addRecord = e => {
        if (this.props.DepartmentStore.selectedDepartment === "") {
          this.setState({ modalShow: true });
        } else {
          this.props.RecordStore.addCommonRecord(this.state.selectrecord);
          //window.location.reload();
        }
      };

      render() {
        let modalClose = () => this.setState({ modalShow: false });
        let editClose = () => this.setState({ editShow: false });
        const { RecordStore } = this.props;
        //this.props.RecordStore.allRecords.forEach(e=>console.log(e.code))
        // console.log(this.props.DepartmentStore.selectedDepartment)

        return (
          <Container style={styles.tableStyle}>
            <Paper style={styles.paperStyle}>
              <Table striped="true" bordered="true" hover="true">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: 10 }}>Actions</TableCell>
                    <TableCell style={{ fontSize: 10 }}>Function</TableCell>
                    <TableCell style={{ fontSize: 10 }}>Record Type</TableCell>
                    <TableCell style={{ fontSize: 10 }}>
                      Retention Schedule
                    </TableCell>
                    <TableCell style={{ fontSize: 10 }}>Archival</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {RecordStore.allRecords.slice().map(record => {
                    return (
                      <TableRow key={record.id} {...record}>
                        <TableCell>
                          <CreateOutlinedIcon
                            name="edit"
                            onClick={() =>
                              this.handleEditRecord(
                                record.id,
                                record.code,
                                record.function,
                                record.recordcategoryid,
                                record.recordtype,
                                record.description,
                                record.archival
                              )
                            }
                          />
                          <Checkbox
                            id={record.id}
                            value={record.id}
                            onClick={this.onSelect}
                            color="primary"
                            style={{ height: 6 }}
                          />
                        </TableCell>
                        <TableCell style={{ fontSize: 10 }}>
                          {record.function}
                        </TableCell>
                        <TableCell style={{ fontSize: 10 }}>
                          {record.recordtype}
                        </TableCell>
                        <TableCell style={{ fontSize: 10 }}>
                          {record.retentiondescription}
                        </TableCell>
                        <TableCell style={{ fontSize: 10 }}>
                          {record.archival}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
            <Button
              variant="outlined"
              color="primary"
              style={{ marginTop: 10, fontSize: 10 }}
              onClick={this.addRecord}
            >
              Add selected common records
            </Button>

            <Modal
              size="sm"
              show={this.state.editShow}
              onHide={editClose}
              aria-labelledby="example-modal-sizes-title-sm"
            >
              <Modal.Header>
                <Modal.Title
                  id="example-modal-sizes-title-sm"
                  style={{ fontSize: 16 }}
                >
                  Edit Common Record
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ fontSize: 12 }}>
                {this.props.RecordStore.allRecords
                  .slice()
                  .filter(
                    x =>
                      x.id === this.props.RecordStore.editcommonrecords.editID
                  )
                  .map(postDetail => {
                    return (
                      <Form key={postDetail.id}>
                        <FormGroup>
                          <FormLabel style={{ fontSize: 10 }}>
                            Record Type
                          </FormLabel>
                          <input
                            id="editType"
                            defaultValue={postDetail.recordtype}
                            variant="outlined"
                            onChange={RecordStore.handleChange}
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
                            style={{ fontSize: 10 }}
                            onChange={RecordStore.handleChange}
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
                        </FormGroup>
                        <FormGroup style={{ marginTop: 10 }}>
                          <FormLabel style={{ fontSize: 10 }}>
                            Record Category
                          </FormLabel>
                          <Form.Control
                            as="select"
                            id="editrecordcategoryid"
                            ref="proposedcategory"
                            style={{ fontSize: 10 }}
                            onChange={RecordStore.handleChange}
                            defaultValue={postDetail.recordcategoryid}
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
                        <FormGroup style={{ marginTop: 10 }}>
                          <FormLabel style={{ fontSize: 10 }}>
                            Retention Description
                          </FormLabel>
                          <input
                            id="editdescription"
                            defaultValue={postDetail.description}
                            onChange={RecordStore.handleChange}
                            margin="normal"
                            variant="outlined"
                            style={styles.customInputStyle}
                          />
                        </FormGroup>
                      </Form>
                    );
                  })}
              </Modal.Body>
              <Modal.Footer style={{ height: 20 }}>
                <Button
                  style={styles.modalButtonStyle}
                  variant="outlined"
                  color="primary"
                  onClick={this.saveEdit}
                >
                  Save Changes
                </Button>
                <Button
                  style={styles.modalButtonStyle}
                  variant="outlined"
                  onClick={() => this.setState({ editShow: false })}
                >
                  Discard Changes
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal
              size="sm"
              show={this.state.modalShow}
              onHide={modalClose}
              aria-labelledby="example-modal-sizes-title-sm"
            >
              <Modal.Body style={{ fontSize: 12 }}>
                Please select a department.
              </Modal.Body>
              <Modal.Footer style={{ height: 20 }}>
                <Button
                  style={styles.modalButtonStyle}
                  variant="outlined"
                  onClick={() => this.setState({ modalShow: false })}
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

export default CommonRecords;

const styles = {
  tableStyle: {
    paddingTop: 14
  },
  paperStyle: {
    width: "100%",
    overflowX: "auto"
  },
  modalButtonStyle: {
    height: 26,
    width: 84,
    fontSize: 8,
    padding: 0
  },
  customInputStyle: {
    borderRadius: 5,
    fontSize: 10,
    padding: 6,
    border: "Gainsboro solid 1px"
  }
};
