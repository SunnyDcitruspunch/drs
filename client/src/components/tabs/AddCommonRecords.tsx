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
  Container,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
  TableSortLabel
} from "@material-ui/core";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import { IRecordStore } from "../../stores/RecordStore";
import { IDepartmentStore } from "../../stores/DepartmentStore";
import { IUniqueStore } from "../../stores/UniqueStore";

type Order = "asc" | "desc";

interface Data {
  recordtype: string;
  description: string;
  function: string;
  archival: string;
  notes: string;
}

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
  order: Order;
  orderBy: string;
  rowCount?: number;
}

interface HeadRow {
  id: string;
  label: string;
}

const headRows: HeadRow[] = [
  {
    id: "recordtype",
    label: "Record Type"
  },
  {
    id: "description",
    label: "Description"
  },
  { id: "function", label: "Function" },
  { id: "archival", label: "Archival" },
  { id: "notes", label: "Notes" }
];

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: any) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headRows.map(row => (
          <TableCell
            key={row.id}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function desc<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

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
  selectedfunction: string;
  selectedcategory: string;
  archivalOptions: Array<string>;
  order: Order;
  orderBy: string;
  sortDirection: string;
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
          selectrecord: [],
          selectedfunction: "",
          selectedcategory: "",
          archivalOptions: ["Archival", "Vital", "Highly Confidential"],
          order: "asc",
          orderBy: "recordtype",
          sortDirection: "asc"
        };
      }

      componentDidMount() {
        this.props.RecordStore.fetchCommonRecords();
      }

      onSelect = (e: any) => {
        if (e.target.checked) {
          this.setState({
            selectrecord: [...this.state.selectrecord, e.target.value]
          });
        } else {
          let remove = this.state.selectrecord.indexOf(e.target.value);
          this.setState({
            selectrecord: this.state.selectrecord.filter(
              (_: any, i: any) => i !== remove
            )
          });
        }
      };

      handleEditRecord(
        cid: string,
        ccode: string,
        cfunction: string,
        ccategory: string,
        ctype: string,
        cdescription: string,
        carchival: string,
        cnotes: string
      ) {
        this.setState({ editShow: true });
        this.props.RecordStore.getEditRecord(
          cid,
          ccode,
          cfunction,
          ccategory,
          ctype,
          cdescription,
          carchival,
          cnotes
        );
      }

      saveEdit = (e: any) => {
        this.setState({ editShow: false });
        this.props.RecordStore.updateCommonRecord();
      };

      addRecord = (e: any) => {
        if (this.props.DepartmentStore.selectedDepartment === "") {
          this.setState({ modalShow: true });
        } else {
          this.props.RecordStore.addCommonRecord(this.state.selectrecord);
          window.location.reload();
        }
      };

      getSorting<K extends keyof any>(
        order: Order,
        orderBy: K
      ): (
        a: { [key in K]: number | string },
        b: { [key in K]: number | string }
      ) => number {
        return order === "desc"
          ? (a, b) => desc(a, b, orderBy)
          : (a, b) => -desc(a, b, orderBy);
      }

      stableSort<T>(array: T[], cmp: (a: T, b: T) => number) {
        const stabilizedThis = array.map(
          (el: any, index: any) => [el, index] as [T, number]
        );
        stabilizedThis.sort((a: any, b: any) => {
          const order = cmp(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
        return stabilizedThis.map((el: any) => el[0]);
      }

      handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data
      ) => {
        const isDesc =
          this.state.orderBy === property && this.state.order === "desc";
        if (isDesc === true) {
          this.setState({ order: "asc" });
        } else {
          this.setState({ order: "desc" });
        }
        this.setState({ orderBy: property });
      };

      render() {
        let modalClose = () => this.setState({ modalShow: false });
        let editClose = () => this.setState({ editShow: false });
        const { RecordStore } = this.props;

        return (
          <Container style={styles.tableStyle}>
            <Paper style={{ width: "100%", overflowX: "auto" }}>
              <Table>
                <EnhancedTableHead
                  order={this.state.order}
                  orderBy={this.state.orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {this.stableSort(
                    RecordStore.allRecords,
                    this.getSorting(this.state.order, this.state.orderBy)
                  )
                    .slice()
                    .map((record: any) => {
                      return (
                        <TableRow key={record.id} {...record}>
                          <TableCell>
                            <CreateOutlinedIcon
                              style={styles.buttonStyle}
                              name="edit"
                              onClick={() =>
                                this.handleEditRecord(
                                  record.id,
                                  record.code,
                                  record.function,
                                  record.recordcategoryid,
                                  record.recordtype,
                                  record.description,
                                  record.archival,
                                  record.notes
                                )
                              }
                            />
                            <Checkbox
                              id={record.id}
                              value={record.id}
                              onClick={this.onSelect}
                              color="primary"
                            />
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {record.recordtype}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {record.description}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {record.function}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {record.archival}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {record.notes}
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

            {/* edit common records */}
            {this.props.RecordStore.allRecords
              .slice()
              .filter(
                (x: any) =>
                  x.id === this.props.RecordStore.editcommonrecords.editID
              )
              .map((postDetail: any) => {
                return (
                  <Dialog
                    key={postDetail.id}
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
                    <DialogContent>
                      <Grid>
                        <TextField
                          fullWidth
                          multiline
                          rows="2"
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
                          value={this.state.selectedfunction}
                          id="editFunction"
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
                          value={this.state.selectedcategory}
                          id="editCategory"
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
                          rows="4"
                          id="editDescription"
                          label="Description"
                          defaultValue={postDetail.description}
                          variant="outlined"
                          margin="normal"
                          onChange={RecordStore.handleChange}
                        />
                      </Grid>

                      <FormControl component="fieldset">
                        <FormLabel component="legend">Archival</FormLabel>
                        <RadioGroup row aria-label="archival" name="archival">
                          {this.state.archivalOptions.map((x: string) => {
                            return (
                              <FormControlLabel
                                key={x}
                                value={x}
                                control={<Radio color="primary" />}
                                label={x}
                                labelPlacement="end"
                                onChange={RecordStore.changeArchival}
                              />
                            );
                          })}
                        </RadioGroup>
                      </FormControl>

                      <Grid>
                        <TextField
                          fullWidth
                          multiline
                          rows="3"
                          id="editNotes"
                          label="Notes"
                          defaultValue={postDetail.notes}
                          variant="outlined"
                          margin="normal"
                          onChange={RecordStore.handleChange}
                        />
                      </Grid>
                    </DialogContent>

                    <DialogActions>
                      <Button color="primary" onClick={this.saveEdit}>
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => this.setState({ editShow: false })}
                      >
                        Discard Changes
                      </Button>
                    </DialogActions>
                  </Dialog>
                );
              })}

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
  buttonStyle: {
    width: 20,
    height: 16,
    fontSize: 10
  }
};
