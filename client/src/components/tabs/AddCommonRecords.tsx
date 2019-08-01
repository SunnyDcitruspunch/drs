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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import Form from "react-bootstrap/Form";
import { IRecordStore } from "../../stores/RecordStore";
import { IDepartmentStore } from "../../stores/DepartmentStore";
import { IUniqueStore } from "../../stores/UniqueStore";

/*
  !TODO: refactor modal to material ui compnent
*/

interface IProps {
  RecordStore: IRecordStore;
  DepartmentStore: IDepartmentStore;
  UniqueStore: IUniqueStore;
  Document: Document;
}

interface IState {
  modalShow: boolean;
  editShow: boolean;
  selectrecord: any
}

interface Document {
  createElement(tagName: "input"): HTMLInputElement;
}

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

      componentDidMount() {
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
                (_: any, i: any) => i !== remove
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
        const { RecordStore } = this.props;

        return (
          <Container style={styles.tableStyle}>
            <Paper style={{ width: "100%", overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: 10, width: 150}}>Actions</TableCell>
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
                          {record.description}
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

            <Dialog
              open={this.state.editShow}
              onClose={editClose}
              aria-labelledby="example-modal-sizes-title-sm"
            >
              <DialogTitle
                id="example-modal-sizes-title-sm"
                style={{ fontSize: 16 }}
              >
                Edit Common Record
              </DialogTitle>
              <DialogContent style={{ fontSize: 12 }}>
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
                            style={{
                              borderRadius: 5,
                              fontSize: 10,
                              padding: 6,
                              border: "Gainsboro solid 1px"
                            }}
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
                                <option key={func.id} value={func.functiontype}>
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
                                <option
                                  key={category.id}
                                  value={category.recordcategoryid}
                                >
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
                            style={{
                              borderRadius: 5,
                              fontSize: 10,
                              padding: 6,
                              border: "Gainsboro solid 1px"
                            }}
                          />
                        </FormGroup>
                      </Form>
                    );
                  })}
              </DialogContent>
              <DialogActions style={{ height: 20 }}>
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
              </DialogActions>
            </Dialog>

            <Dialog
              open={this.state.modalShow}
              onClose={modalClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Please select a department."}
              </DialogTitle>
              <DialogActions>
                <Button
                  color="primary"
                  onClick={() => this.setState({ modalShow: false })}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        );
      }
    }
  )
);

export default CommonRecords as any;

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
