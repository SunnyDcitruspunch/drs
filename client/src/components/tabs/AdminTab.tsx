import React, { Component } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Checkbox,
  Button,
  FormLabel
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { IRecordStore } from "../../stores/RecordStore";
import { IRecord, IDepartmentStore, DepartmentStore } from "../../stores/DepartmentStore";
import { IData, IOrder, IHeadRow } from "../common/EnhancedTableHead";
import Snackbar from "../common/Snackbar";
import EnhancedTableHead from "../common/EnhancedTableHead";

interface IProps {
  RecordStore: IRecordStore;
  DepartmentStore: IDepartmentStore
}

interface IState {
  approvedrecords: Array<Object>;
  snackbar: boolean;
  order: IOrder;
  orderBy: string;
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
  { id: "notes", label: "Comments" }
];

const AdminTab = inject("RecordStore", "DepartmentStore")(
  observer(
    class AdminTab extends Component<IProps, IState> {
      constructor(props: IProps) {
        super(props);
        this.onSelect = this.onSelect.bind(this);

        this.state = {
          approvedrecords: [],
          snackbar: false,
          order: "asc",
          orderBy: "recordtype"
        };
      }

      componentDidMount() {
        this.props.DepartmentStore.fetchAllRecords()
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

      render() {
        const { RecordStore, DepartmentStore }: IProps = this.props;

        return (
          <Container>
            <Paper style={{ width: "100%", overflowX: "auto" }}>
              <FormLabel style={{ marginTop: 5 }}>Pending Records</FormLabel>
              <Table>
                <EnhancedTableHead
                  id="tablehead"
                  headrows={headrows}
                  order={this.state.order}
                  orderBy={this.state.orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {DepartmentStore._allRecords
                    // .slice()
                    .filter((x: IRecord) => x.status === "Pending")
                    .map((pendings: IRecord) => (
                      <TableRow hover key={pendings.id}>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ fontSize: 10 }}
                        >
                          <Checkbox
                            color="primary"
                            style={{ height: 1, width: 1, marginRight: 5 }}
                            onChange={this.onSelect}
                            value={pendings.id}
                          />
                        </TableCell>
                        <TableCell style={styles.tableStyle}>
                          {pendings.department}
                        </TableCell>
                        <TableCell style={styles.tableStyle}>
                          {pendings.recordtype}
                        </TableCell>
                        <TableCell style={styles.tableStyle}>
                          {pendings.description}
                        </TableCell>
                        <TableCell style={styles.tableStyle}>
                          {pendings.comments}
                        </TableCell>
                      </TableRow>
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
          </Container>
        );
      }
    }
  )
);

export default AdminTab as any;

const styles = {
  tableStyle: {
    fontSize: 10
  }
};
