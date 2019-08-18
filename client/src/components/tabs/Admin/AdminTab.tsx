import React, { Component } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  Button,
  FormLabel
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { IRecord, IRecordStore, IDepartmentStore, IUniqueStore } from "../../../stores";
import EnhancedTableHead, {
  IData,
  IOrder,
  IHeadRow
} from "../../common/EnhancedTableHead";
import Snackbar from "../../common/Snackbar";
import AdminTable from './AdminTable'
import EditModal from '../../common/EditModal'

interface IProps {
  RecordStore: IRecordStore;
  UniqueStore: IUniqueStore
  DepartmentStore: IDepartmentStore;
}

interface IState {
  approvedrecords: Array<Object>;
  snackbar: boolean;
  order: IOrder;
  orderBy: string;
  openEdit: boolean
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

const headrows: IHeadRow[] = [
  {
    id: "department",
    label: "Department"
  },
  {
    id: "recordtype",
    label: "Record Type"
  },
  {
    id: "description",
    label: "Retention Description"
  },
  { id: "comments", label: "Comments" }
];

const AdminTab = inject("RecordStore", "DepartmentStore", "UniqueStore")(
  observer(
    class AdminTab extends Component<IProps, IState> {
      constructor(props: IProps) {
        super(props);

        this.state = {
          approvedrecords: [],
          snackbar: false,
          order: "asc",
          orderBy: "recordtype",
          openEdit: false
        };
      }

      onSelect = (e: any) => {
        const { value } = e.target;
        if (e.target.checked) {
          this.setState({
            approvedrecords: [...this.state.approvedrecords, value]
          });
        } else {
          let remove = this.state.approvedrecords.indexOf(e.target.value);
          this.setState({
            approvedrecords: this.state.approvedrecords.filter(
              (_: any, i: any) => i !== remove
            )
          });
        }
      };

      approveSelect = (e: any) => {
        this.props.RecordStore.approveSelectedRecords(
          this.state.approvedrecords
        );

        this.setState({ snackbar: true });
        console.log("should show the snackbar");
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

      handleEdit = (record: IRecord) => {
        this.setState({ openEdit: true })
        this.props.DepartmentStore.updateEditID(record)
      }

      editRecord: any = async () => {
        await this.props.DepartmentStore.updateRecord();
        this.setState({ openEdit: false })
      }

      render() {
        let editClose = () => this.setState({ openEdit: false })
        const { DepartmentStore, RecordStore, UniqueStore }: IProps = this.props;

        return (
          <Container>
            <Paper style={{ width: "100%", overflowX: "auto" }}>
              <FormLabel style={{ marginTop: 5 }}>Pending Records</FormLabel>
              <Table size="small">
                <EnhancedTableHead
                  id="tablehead"
                  headrows={headrows}
                  order={this.state.order}
                  orderBy={this.state.orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody style={{ fontSize: 11 }}>
                  {DepartmentStore._allRecords
                    // .slice()
                    .filter((x: IRecord) => x.status === "Pending")
                    .map((pending: IRecord, index) => (
                      <AdminTable
                        key={index}
                        record={pending}
                        onedit={() => this.handleEdit(pending)}
                        onselect={this.onSelect}
                      />
                    ))}
                </TableBody>
              </Table>
            </Paper>
            <Button
              variant="outlined"
              color="primary"
              style={{ marginTop: 10, fontSize: 10 }}
              onClick={this.approveSelect}
            >
              Approve selected records
            </Button>
            <Snackbar
              _open={this.state.snackbar}
              msg="Records has been approved."
            />

            {/* edit record */}
            {this.props.DepartmentStore.allRecords
              .filter(
                (x: IRecord) =>
                  x.id === this.props.DepartmentStore.editrecord.id
              )
              .map((editDetail: IRecord) => {
                return (
                  <EditModal
                    title={
                      editDetail.recordcategoryid === "common"
                        ? "Edit Comment Only"
                        : "Edit Record"
                    }
                    disabled={false}
                    key={editDetail.id}
                    record={editDetail}
                    open={this.state.openEdit}
                    close={editClose}
                    functionList={UniqueStore.functionsDropdown}
                    categoryList={UniqueStore.categoryDropdown}
                    change={DepartmentStore.handleChange}
                    saveedit={this.editRecord}
                    changecheckbox={RecordStore.handleCheckbox}
                    disablecategory={
                      editDetail.recordcategoryid === "common" ? true : false
                    }
                  />
                );
              })}
          </Container>
        );
      }
    }
  )
);

export default AdminTab as any;

