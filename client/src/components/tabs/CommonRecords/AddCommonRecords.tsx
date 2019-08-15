import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  TableBody,
  Paper,
  Button,
  Table,
  Container
} from "@material-ui/core";
import { IRecordStore } from "../../../stores/RecordStore";
import { IDepartmentStore, IRecord } from "../../../stores/DepartmentStore";
import { IUniqueStore } from "../../../stores/UniqueStore";
import { IData, IOrder, IHeadRow } from "../../common/EnhancedTableHead";
import EnhancedTableHead from "../../common/EnhancedTableHead";
import EditModal from "../../common/EditModal";
import MessageModal from "../../common/MessageModal";
import RecordTable from './RecordTable'

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
  order: IOrder;
  orderBy: string;
  sortDirection: string;
  selectedCommonRecords: IRecord[];
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

const CommonRecords = inject("RecordStore", "DepartmentStore", "UniqueStore")(
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
        };
      }

      componentDidMount() {
        this.props.DepartmentStore.fetchCommonRecords();
        this.props.RecordStore.fetchCommonRecords();
      }

      onSelect = (e: any) => {
        // this.setState({ selectrecord:  })
        console.log(e.target.value)
        if (e.target.checked) {
          this.setState({
            selectrecord: [...this.state.selectrecord, e.target.value]
          });
          console.log(this.state.selectrecord)
        } else {
          let remove = this.state.selectrecord.indexOf(e.target.value);
          this.setState({
            selectrecord: this.state.selectrecord.filter(
              (_: any, i: any) => i !== remove
            )
          });
        }
        console.log(this.state.selectrecord)
      };

      handleEditRecord = (editRecord: IRecord) => {
        this.props.RecordStore.getEditRecord(editRecord);
        this.setState({ editShow: true });
        console.log(this.state.editShow);
      }

      saveEdit = (e: any) => {
        this.setState({ editShow: false });
        this.props.RecordStore.updateCommonRecord();
      };

      addRecord = (e: any) => {
        console.log(this.state.selectrecord)
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

      stableSort<T>(
        array: IRecord[],
        cmp: (a: T, b: T) => number
      ) {
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
                  this.stableSort(
                   this.props.DepartmentStore.CommonRecords,
                    this.getSorting(this.state.order, this.state.orderBy)
                  ).map((record: IRecord, index) => {
                    return (
                      <RecordTable 
                        key={index}
                        record={record}
                        click={() => this.handleEditRecord(record)}
                        select={this.onSelect}
                        disabled={!!this.props.DepartmentStore.selectedDepartment.commoncodes.find((x: string) => x === record.code)}
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
                  changecheckbox={RecordStore.handleCheckbox}
                  disablecategory={true}
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
