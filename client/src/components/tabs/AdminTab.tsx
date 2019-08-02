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

/*
 *TODO:  clikcable table for pending records (editable table??)
 !TODO: change data to pending records
 */

interface IProps {
  RecordStore: IRecordStore;
}

interface IState {
  approvedrecords: any;
}

const AdminTab = inject("RecordStore")(
  observer(
    class AdminTab extends Component<IProps, IState> {
      constructor(props: IProps) {
        super(props);
        this.onSelect = this.onSelect.bind(this);

        this.state = {
          approvedrecords: []
        };
      }

      componentDidMount() {
        this.props.RecordStore.fetchPendings();
      }

      onSelect = (e: any) => {
        const { value } = e.target;
        if (e.target.checked) {
          this.setState(
            {
              approvedrecords: [...this.state.approvedrecords, value]
            },
            () => {
              console.log(this.state.approvedrecords);
            }
          );
        } else {
          let remove = this.state.approvedrecords.indexOf(e.target.value);
          this.setState(
            {
              approvedrecords: this.state.approvedrecords.filter(
                (_: any, i: any) => i !== remove
              )
            },
            () => {
              console.log(this.state.approvedrecords);
            }
          );
        }
      };

      approveSelect = (e: any) => {
        this.props.RecordStore.approveSelectedRecords(
          this.state.approvedrecords
        );
        window.location.reload()
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
                    <TableCell
                      style={{ fontSize: 10, width: 250 }}
                      align="center"
                    >
                      Department
                    </TableCell>
                    <TableCell style={{ fontSize: 10, width: 100 }}>
                      Retention Type
                    </TableCell>
                    <TableCell style={{ fontSize: 10, width: 300 }}>
                      Retention Schedule
                    </TableCell>
                    <TableCell style={styles.tableStyle}>Function</TableCell>
                    <TableCell style={styles.tableStyle}>Category</TableCell>
                    <TableCell style={styles.tableStyle}>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {RecordStore.pendingRecords
                    .slice()
                    .filter((x: any) => x.status === "Pending")
                    .map((pendings: any) => (
                      <TableRow key={pendings.id}>
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
