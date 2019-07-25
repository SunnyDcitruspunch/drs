import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Container from "react-bootstrap/Container";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  FormGroup,
  FormLabel,
  TextField,
  Table,
  createStyles,
  Theme,
  makeStyles
} from "@material-ui/core";
import Modal from "react-bootstrap/Modal";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import Form from "react-bootstrap/Form";
import { RecordStore, DepartmentStore, UniqueStore } from "../../stores";

/*
  !TODO: refactor modal to material ui compnent
*/

interface IProps {
  RecordStore: RecordStore;
  DepartmentStore: DepartmentStore;
  UniqueStore: UniqueStore;
  Document: Document;
}

interface IState {
  modalShow: boolean;
  editShow: boolean;
  selectrecord: Array<string>;
}

interface Document {
  createElement(tagName: "input"): HTMLInputElement;
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
    }
  })
);

const CommonRecords = inject("RecordStore", "DepartmentStore", "UniqueStore")(
  observer(
    class CommonRecords extends Component<IProps, IState> {
      constructor(props: IProps) {
        super(props);
        this.onSelect = this.onSelect.bind(this);

        this.state = {
          modalShow: false, //if not select a department
          editShow: false,
          selectrecord: []
        };
      }

      UNSAFE_componentWillMount() {
        this.props.RecordStore.fetchRecords();
      }

      onSelect = (e: any) => {
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
        cid: string,
        ccode: string,
        cfunction: string,
        ccategory: string,
        ctype: string,
        cdescription: string,
        carchival: string
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
      saveEdit = (e: any) => {
        this.setState({ editShow: false });
        this.props.RecordStore.updateRecord();
      };

      addRecord = (e: any) => {
        if (this.props.DepartmentStore.selectedDepartment === "") {
          this.setState({ modalShow: true });
        } else {
          this.props.RecordStore.addCommonRecord(this.state.selectrecord);
          window.location.reload();
        }
      };

      render() {
        let modalClose = () => this.setState({ modalShow: false });
        let editClose = () => this.setState({ editShow: false });
        //let Table = document.createElement("Table")
        const { RecordStore } = this.props;
        const classes = useStyles();
        //this.props.RecordStore.allRecords.forEach(e=>console.log(e.code))
        // console.log(this.props.DepartmentStore.selectedDepartment)

        return (
          <Container style={styles.tableStyle}>
            <Paper className={classes.paper}>
              <Table>
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
                  {RecordStore.allRecords.slice().map((record: any) => {
                    return (
                      <TableRow key={record.id} {...record}>
                        <TableCell>
                          <CreateOutlinedIcon
                            name="edit"
                            style={styles.iconStyle}
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
                            style={{ height: 4 }}
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
                    (x: any) =>
                      x.id === this.props.RecordStore.editcommonrecords.editID
                  )
                  .map((postDetail: any) => {
                    return (
                      <Form key={postDetail.id}>
                        <FormGroup>
                          <FormLabel style={{ fontSize: 10 }}>
                            Record Type
                          </FormLabel>
                          <TextField
                            id="editType"
                            defaultValue={postDetail.recordtype}
                            variant="outlined"
                            onChange={RecordStore.handleChange}
                            margin="normal"
                            className={classes.customInput}
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
                            style={{ fontSize: 10 }}
                            onChange={RecordStore.handleChange}
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
                            onChange={RecordStore.handleChange}
                            margin="normal"
                            variant="outlined"
                            className={classes.customInput}
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

/** @type {{search: React.CSSProperties}} */
const styles = {
  tableStyle: {
    paddingTop: 14
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
  },
  iconStyle: {
    width: 20,
    height: 16,
    padding: 0,
    fontSize: 10
  }
};
