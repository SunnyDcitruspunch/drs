import React, { Component } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  FormLabel
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { IRecordStore } from "../../stores/RecordStore";
import { IPostDetail } from "../../stores/DepartmentStore";
import { IHeadRow } from "../common/EnhancedTableHead";
import Snackbar from "../common/Snackbar";

interface IProps {
  RecordStore: IRecordStore;
}

interface IState {
  approvedrecords: Array<Object>;
  snackbar: boolean
}

const headRows: IHeadRow[] = [
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
    label: "Description"
  },
  { id: "function", label: "Function" },
  { id: "category", label: "Category" },
  { id: "archival", label: "Archival" },
  { id: "notes", label: "Notes" }
];

const AdminTab = inject("RecordStore")(
  observer(
    class AdminTab extends Component<IProps, IState> {
      constructor(props: IProps) {
        super(props);
        this.onSelect = this.onSelect.bind(this);

        this.state = {
          approvedrecords: [],
          snackbar: false
        };
      }

      componentDidMount() {
        this.props.RecordStore.fetchPendings();
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

        this.setState({ snackbar: true })
        console.log('should show the snackbar')
      };

      render() {
        const { RecordStore }: IProps = this.props;

        return (
          <Container>
            <Paper style={{ width: "100%", overflowX: "auto" }}>
              <FormLabel style={{ marginTop: 5 }}>Pending Records</FormLabel>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" />
                    {headRows.map(row => (
                      <TableCell key={row.id}>{row.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {RecordStore.pendingRecords
                    // .slice()
                    .filter((x: IPostDetail) => x.status === "Pending")
                    .map((pendings: IPostDetail) => (
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
                          {pendings.function}
                        </TableCell>
                        <TableCell style={styles.tableStyle}>
                          {pendings.recordcategoryid}
                        </TableCell>
                        <TableCell style={styles.tableStyle}>
                          {pendings.notes}
                        </TableCell>
                        <TableCell style={styles.tableStyle}>
                          {pendings.archival}
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
