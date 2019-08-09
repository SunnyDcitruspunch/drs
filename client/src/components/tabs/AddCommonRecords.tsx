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
  Container,
} from "@material-ui/core";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import { IRecordStore } from "../../stores/RecordStore";
import { IDepartmentStore, IPostDetail } from "../../stores/DepartmentStore";
import { IUniqueStore } from "../../stores/UniqueStore";
import { IData, IOrder } from "../common/EnhancedTableHead";
import EnhancedTableHead from "../common/EnhancedTableHead";
import EditModal from '../common/EditModal'
import MessageModal from '../common/MessageModal'

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
  order: IOrder;
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

      handleEditRecord(editRecord: IPostDetail) {
        this.props.RecordStore.getEditRecord(editRecord);
        this.setState({ editShow: true });
        console.log(editRecord.function);
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
                    .map((record: IPostDetail) => {
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
                            {record.recordcategoryid}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {record.archival}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {record.notes}
                          </TableCell>
                          <TableCell style={{ fontSize: 10 }}>
                            {record.status}
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
                (x: any) => x.id === this.props.RecordStore.editcommonrecords.id
              )
              .map((postDetail: any) => {
                return (
                  <EditModal
                    record={postDetail}
                    key={postDetail.id}
                    open={this.state.editShow}
                    functionList={this.props.UniqueStore.functionsDropdown}
                    categoryList={this.props.UniqueStore.categoryDropdown}
                    archivalList={this.props.UniqueStore.archivalDropdown}
                    close={editClose}
                    saveedit={this.saveEdit}
                    disabled={true}
                    change={RecordStore.handleChange}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
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
