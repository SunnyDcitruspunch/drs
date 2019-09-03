import React, { Component } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  Button,
  FormLabel,
  Grid
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import {
  IRecord,
  IRecordStore,
  IDepartmentStore,
  IUniqueStore
} from "../../../stores";
import EnhancedTableHead, {
  IOrder,
  IHeadRow
} from "../../common/EnhancedTableHead";
import AdminTable from "./AdminTable";
import EditModal from '../../common/EditModal'

interface IProps {
  RecordStore: IRecordStore;
  UniqueStore: IUniqueStore;
  DepartmentStore: IDepartmentStore;
}

interface IState {
  approvedrecords: Array<Object>;
  snackbar: boolean;
  order: IOrder;
  orderBy: string;
  openEdit: boolean;
  selectedclassification: string[];
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
          openEdit: false,
          selectedclassification: []
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

      approveSelect = async (e: any) => {
        this.props.RecordStore.approveSelectedRecords(
          this.state.approvedrecords
        );

        await this.props.DepartmentStore.fetchAllRecords();
      };

      handleEdit = (record: IRecord) => {
        this.setState({ selectedclassification: record.classification });
        this.setState({ openEdit: true });
        this.props.DepartmentStore.updateEditID(record);
      };

      editRecord: any = async () => {
        await this.props.DepartmentStore.updateRecord(
          this.state.selectedclassification
        );
        this.setState({ openEdit: false });
      };

      handleCheck = (e: any) => {
        if (e.target.checked) {
          this.setState({
            selectedclassification: [
              ...this.state.selectedclassification,
              e.target.value
            ]
          });
        } else {
          let remove = this.state.selectedclassification.indexOf(
            e.target.value
          );
          this.setState({
            selectedclassification: this.state.selectedclassification.filter(
              (_: any, i: any) => i !== remove
            )
          });
        }
        console.log(this.state.selectedclassification);
      };

      render() {
        let editClose = () => this.setState({ openEdit: false });
        const { DepartmentStore, UniqueStore }: IProps = this.props;

        return (
          <Container>
            <Paper style={{ width: "100%", overflowX: "auto" }}>
              <Grid container justify="center" alignItems="center">
                <FormLabel style={{ marginTop: 5 }}>Pending Records</FormLabel>
              </Grid>
              <Table size="small">
                <EnhancedTableHead
                  id="tablehead"
                  headrows={headrows}
                  order={this.state.order}
                  orderBy={this.state.orderBy}
                />
                <TableBody style={{ fontSize: 11 }}>
                  {DepartmentStore._allRecords
                    .slice()
                    .filter((x: IRecord) => x.status === "Pending")
                    .map((pending: IRecord, index) => (
                      <AdminTable
                        key={index}
                        tablekey={index}
                        record={pending}
                        onedit={() => this.handleEdit(pending)}
                        onselect={this.onSelect}
                      />
                    ))}
                </TableBody>
              </Table>
            </Paper>
            <Grid container justify="center" alignItems="center">
              <Button
                variant="outlined"
                color="primary"
                style={{ marginTop: 10, fontSize: 10 }}
                onClick={this.approveSelect}
              >
                Approve selected records
              </Button>
            </Grid>
           
            {/* edit record */}
            {this.props.DepartmentStore.allRecords
              .filter(
                (x: IRecord) =>
                  x.id === this.props.DepartmentStore.editrecord.id
              )
              .map((editDetail: IRecord, index) => {
                return (
                  <EditModal
                    title={"Edit Record"}
                    disabled={false}
                    key={index}
                    record={editDetail}
                    open={this.state.openEdit}
                    close={editClose}
                    functionList={UniqueStore.functionsDropdown}
                    categoryList={UniqueStore.categoryDropdown}
                    change={DepartmentStore.handleChange}
                    saveedit={this.editRecord}
                    changecheckbox={this.handleCheck}
                    disablecategory={
                      editDetail.recordcategoryid === "common" ? true : false
                    }
                    ifarchival={
                      !!this.state.selectedclassification.find(
                        (x: string) => x === " Archival "
                      )
                    }
                    ifvital={
                      !!this.state.selectedclassification.find(
                        (x: string) => x === " Vital "
                      )
                    }
                    ifconfidential={
                      !!this.state.selectedclassification.find(
                        (x: string) => x === " Highly Confidential "
                      )
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
