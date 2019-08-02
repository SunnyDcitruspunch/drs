import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  TextField,
  Table,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Container
} from "@material-ui/core";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import { IRecordStore } from "../../stores/RecordStore";
import { IDepartmentStore } from "../../stores/DepartmentStore";
import { IUniqueStore } from "../../stores/UniqueStore";

interface IProps {
  RecordStore: IRecordStore;
  DepartmentStore: IDepartmentStore;
  UniqueStore: IUniqueStore;
  Document: Document;
}

interface IState {
  modalShow: boolean;
  editShow: boolean;
  selectrecord: any;
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
                    <TableCell style={{ fontSize: 10, width: 150 }}>
                      Actions
                    </TableCell>
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
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle
                id="example-modal-sizes-title-sm"
                style={{ fontSize: 16 }}
              >
                Edit Common Record
              </DialogTitle>
              {this.props.RecordStore.allRecords
                .slice()
                .filter(
                  (x: any) =>
                    x.id === this.props.RecordStore.editcommonrecords.editID
                )
                .map((postDetail: any) => {
                  return (
                    <DialogContent key={postDetail.id}>
                      <Grid>
                        <TextField
                          fullWidth
                          id="editType"
                          label="Record Type"
                          defaultValue={postDetail.recordtype}
                          variant="outlined"
                          onChange={RecordStore.handleChange}
                          margin="normal"
                        />
                      </Grid>

                      <Grid item style={{ marginBottom: 10 }}>
                        <InputLabel shrink htmlFor="age-label-placeholder">
                          Record Function
                        </InputLabel>
                        <Select
                          id="editfunction"
                          style={{ width: 400 }}
                          onChange={RecordStore.handleChange}
                        >
                          <MenuItem>Choose...</MenuItem>
                          {this.props.UniqueStore.functionsDropdown
                            .slice()
                            .map((func: any) => (
                              <MenuItem key={func.id} value={func.functiontype}>
                                {func.functiontype}
                              </MenuItem>
                            ))}
                        </Select>
                      </Grid>

                      <Grid item style={{ marginTop: 10 }}>
                        <InputLabel shrink htmlFor="age-label-placeholder">
                          Record Category
                        </InputLabel>
                        <Select
                          id="editrecordcategoryid"
                          style={{ width: 400 }}
                          onChange={RecordStore.handleChange}
                        >
                          <MenuItem>Choose...</MenuItem>
                          {this.props.UniqueStore.categoryDropdown
                            .slice()
                            .map((category: any) => (
                              <MenuItem
                                key={category.id}
                                value={category.recordcategoryid}
                              >
                                {category.recordcategoryid}
                              </MenuItem>
                            ))}
                        </Select>
                      </Grid>

                      <Grid>
                        <TextField
                          fullWidth
                          multiline
                          rows="3"
                          id="editdescription"
                          label="Description"
                          defaultValue={postDetail.description}
                          variant="outlined"
                          margin="normal"
                          onChange={RecordStore.handleChange}
                        />
                      </Grid>
                    </DialogContent>
                  );
                })}
              <DialogActions>
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
