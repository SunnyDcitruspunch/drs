import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Table,
  Container
} from "@material-ui/core";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import { IRecordStore, IDepartment } from "../../stores/RecordStore";
import { IDepartmentStore, IRecord } from "../../stores/DepartmentStore";
import { IUniqueStore } from "../../stores/UniqueStore";
import { IData, IOrder, IHeadRow } from "../common/EnhancedTableHead";
import EnhancedTableHead from "../common/EnhancedTableHead";
import EditModal from "../common/EditModal";
import MessageModal from "../common/MessageModal";
import CommonRecordsCheck from "../common/CommonRecordsCheck";

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
  order: IOrder;
  orderBy: string;
  sortDirection: string;
  selectedCommonRecords: IRecord[];
  disabled: boolean;
  commonRecords: ICommonRecord[];
  // commonRecords: any[]
}

interface ICommonRecord {
  id?: string;
  recordtype: string;
  code: string;
  function: string;
  description: string;
  classification: string;
  checked?: boolean;
  disabled?: boolean;
}

interface Document {
  createElement(tagName: "input"): HTMLInputElement;
}

const headrows: IHeadRow[] = [
  { id: "function", label: "Function" },
  {
    id: "recordtype",
    label: "Record Type"
  },
  {
    id: "description",
    label: "Retention Description"
  },
  { id: "classification", label: "Classification" }
  // { id: "comments", label: "Comments" }
];

function desc<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
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
          order: "asc",
          orderBy: "recordtype",
          sortDirection: "asc",
          selectedCommonRecords: [],
          disabled: false,
          commonRecords: []
        };
      }

      componentDidMount() {
        this.props.DepartmentStore.fetchCommonRecords();
        this.props.RecordStore.fetchCommonRecords();
        this.props.DepartmentStore.fetchAllRecords();
        this.setState({
          commonRecords: this.props.DepartmentStore.CommonRecords
        });        
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

      handleEditRecord(editRecord: IRecord) {
        this.props.RecordStore.getEditRecord(editRecord);
        this.setState({ editShow: true });
        console.log(this.state.editShow);
      }

      saveEdit = (e: any) => {
        this.setState({ editShow: false });
        this.props.RecordStore.updateCommonRecord();
      };

      addRecord = (e: any) => {
        if (this.props.DepartmentStore.selectedDepartment.department === "") {
          this.setState({ modalShow: true });
        } else {
          this.props.RecordStore.addCommonRecord(this.state.selectrecord);
          // window.location.reload();
        }
      };

      getSorting<K extends keyof any>(
        order: IOrder,
        orderBy: K
      ): (
        a: { [key in K]: number | string },
        b: { [key in K]: number | string }
      ) => number {
        return order === "desc"
          ? (a, b) => desc(a, b, orderBy)
          : (a, b) => -desc(a, b, orderBy);
      }

      //array = all common records
      //dept = commoncodes array
      stableSort<T>(
        array: ICommonRecord[],
        cmp: (a: T, b: T) => number
      ) {
        
        for (let i = 0; i < this.state.commonRecords.length; i++) {
          for (let x = 0; x < this.props.DepartmentStore.selectedDepartment.department.length; x++) {
            if (
              array[i].code === this.props.DepartmentStore.selectedDepartment.department[x]
            ) {
              array[i].checked = true
              array[i].disabled = true
              // this.setState(prevState => ({
              //   commonRecords: {
              //     ...prevState.commonRecords,
              //     checked: true,
              //     disabled: true
              //   }
              // }));
              console.log(this.state.commonRecords[i].checked)
            }
            console.log('hello')
          }
        }

        console.log('hi')

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
        property: keyof IData
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
              <Table size="small">
                <EnhancedTableHead
                  id="tablehead"
                  headrows={headrows}
                  order={this.state.order}
                  orderBy={this.state.orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {
                    // this.stableSort(
                   
                  //   this.getSorting(this.state.order, this.state.orderBy)
                  // )
                  // .map((x: ICommonRecord) => )
                  this.props.DepartmentStore.CommonRecords.map((record: ICommonRecord) => {
                    return (
                      <TableRow key={record.id} {...record}>
                        <TableCell>
                          <CreateOutlinedIcon
                            style={styles.buttonStyle}
                            name="edit"
                            // onClick={() => this.handleEditRecord(record)}
                          />
                          <Checkbox
                            id={record.id}
                            value={record.id}
                            onClick={this.onSelect}
                            color="primary"
                            disabled={!!this.props.DepartmentStore.selectedDepartment.commoncodes.find((x: string) => x === record.code)}
                            checked={!!this.props.DepartmentStore.selectedDepartment.commoncodes.find((x: string) => x === record.code)}
                          />
                          {/* <CommonRecordsCheck
                            id={record.id}
                            value={record.code}
                            onclick={this.onSelect}
                          /> */}
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
                          {record.classification}
                        </TableCell>
                        {/* <TableCell style={{ fontSize: 10 }}>
                          {record.comments}
                        </TableCell> */}
                      </TableRow>
                    );
                  })}

                  {/* just testing... */}
                  {this.stableSort(
                    this.props.DepartmentStore.CommonRecords,
                    this.getSorting(this.state.order, this.state.orderBy)
                  ).map((record: IRecord) => {
                    return (
                      <TableRow key={record.id} {...record}>
                        <TableCell>
                          <CreateOutlinedIcon
                            style={styles.buttonStyle}
                            name="edit"
                            onClick={() => this.handleEditRecord(record)}
                          />
                          <Checkbox
                            id={record.id}
                            value={record.id}
                            onClick={this.onSelect}
                            color="primary"
                            disabled={false}
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
                          {record.classification}
                        </TableCell>
                        {/* <TableCell style={{ fontSize: 10 }}>
                          {record.comments}
                        </TableCell> */}
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
            {this.props.DepartmentStore.CommonRecords.filter(
              (x: IRecord) => x.code === this.props.RecordStore.record.code
            ).map((postDetail: IRecord) => {
              return (
                <EditModal
                  title="Edit Comment Record"
                  record={postDetail}
                  key={postDetail.id}
                  open={this.state.editShow}
                  functionList={this.props.UniqueStore.functionsDropdown}
                  categoryList={this.props.UniqueStore.categoryDropdown}
                  close={editClose}
                  saveedit={this.saveEdit}
                  disabled={false}
                  disablecomment={true}
                  change={RecordStore.handleChange}
                />
              );
            })}

            <MessageModal
              open={this.state.modalShow}
              close={modalClose}
              title="Cannot Add this Record"
              msg="Please select a department."
              click={() => this.setState({ modalShow: false })}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            />
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
