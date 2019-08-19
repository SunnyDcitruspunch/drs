import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { TableBody, Paper, Button, Table, Container } from "@material-ui/core";
import {
  IRecordStore,
  IRecord,
  IDepartmentStore,
  IUniqueStore,
  ICommonStore,
  ICommonRecord
} from "../../../stores";
import EnhancedTableHead, {
  IData,
  IOrder,
  IHeadRow
} from "../../common/EnhancedTableHead";
import EditModal from "../../common/EditModal";
import MessageModal from "../../common/MessageModal";
import RecordTable from "./RecordTable";

interface IProps {
  RecordStore: IRecordStore;
  DepartmentStore: IDepartmentStore;
  UniqueStore: IUniqueStore;
  CommonStore: ICommonStore;
  Document: Document;
}

interface IState {
  modalShow: boolean;
  editShow: boolean;
  selectrecord: string[];
  order: IOrder;
  orderBy: string;
  sortDirection: string;
  selectedCommonRecords: IRecord[];
  selectedclassification: string[]
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

const CommonRecords = inject(
  "RecordStore",
  "DepartmentStore",
  "UniqueStore",
  "CommonStore"
)(
  observer(
    class CommonRecords extends Component<IProps, IState> {
      constructor(props: IProps) {
        super(props);
        // this.onSelect = this.onSelect.bind(this);

        this.state = {
          modalShow: false, //if not select a department
          editShow: false,
          selectrecord: [],
          order: "asc",
          orderBy: "recordtype",
          sortDirection: "asc",
          selectedCommonRecords: [],
          selectedclassification:[]
        };
      }

      onSelect = (e: any) => {
        console.log(e.target.value);
        if (e.target.checked) {
          this.setState({
            selectrecord: [...this.state.selectrecord, e.target.value]
          });
          console.log(this.state.selectrecord);
        } else {
          let remove = this.state.selectrecord.indexOf(e.target.value);
          console.log(remove)
          this.setState({
            selectrecord: this.state.selectrecord.filter(
              (_: any, i: any) => i !== remove
            )
          });
        }
        console.log(this.state.selectrecord);
      };

      handleEditRecord = (editRecord: ICommonRecord) => {
        this.setState({ selectedclassification: editRecord.classification })
        this.setState({ editShow: true });
        this.props.CommonStore.getEditRecord(editRecord);
        console.log(this.state.editShow);
      };

      saveEdit = (e: any) => {
        this.setState({ editShow: false });
        this.props.CommonStore.updateCommonRecord(this.state.selectedclassification);
      };

      addRecord = (e: any) => {
        console.log(this.state.selectrecord);
        if (this.props.DepartmentStore.selectedDepartment.department === "") {
          this.setState({ modalShow: true });
        } else {
          this.props.CommonStore.addCommonRecord(
            this.state.selectrecord,
            this.props.DepartmentStore.selectedDepartment
          );
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

      stableSort<T>(array: ICommonRecord[], cmp: (a: T, b: T) => number) {
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

      handleRequestSort = () => (
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

      handleCheck = (e: any) => {
        if(e.target.checked) {
          // e.target.checked = false
          this.setState({
            selectedclassification: [...this.state.selectedclassification, e.target.value]
          })
        } else {
          // e.target.checke3d = true
          let remove = this.state.selectedclassification.indexOf(e.target.value)
          this.setState({
            selectedclassification: this.state.selectedclassification.filter(
              (_: any, i: any) => i !== remove
            )
          })
        }
        console.log(this.state.selectedclassification)
      }

      render() {
        let modalClose = () => this.setState({ modalShow: false });
        let editClose = () => this.setState({ editShow: false });
        const { RecordStore, CommonStore } = this.props;

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
                  {this.stableSort(
                    CommonStore.commonRecords,
                    this.getSorting(this.state.order, this.state.orderBy)
                  ).map((record: ICommonRecord, index: number) => {
                    return (
                      <RecordTable
                        key={index}
                        record={record}
                        click={() => this.handleEditRecord(record)}
                        select={this.onSelect}
                        disabled={
                          !!this.props.DepartmentStore.selectedDepartment.commoncodes.find(
                            (x: string) => x === record.code
                          )
                        }
                      />
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
            {this.props.CommonStore.commonRecords
              .filter(
                (x: ICommonRecord) =>
                  x.code === this.props.CommonStore.record.code
              )
              .map((postDetail: ICommonRecord) => {
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
                    change={CommonStore.handleChange}
                    changecheckbox={this.handleCheck}
                    disablecategory={true}
                    ifarchival={!!this.state.selectedclassification.find((x: string) => x === ' Archival ')}
                    ifvital={!!this.state.selectedclassification.find((x: string) => x === ' Vital ')}
                    ifconfidential={!!this.state.selectedclassification.find((x: string) => x === ' Highly Confidential ')}                                 
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
