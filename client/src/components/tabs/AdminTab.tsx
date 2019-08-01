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

const AdminTab = inject("RecordStore")(
  observer(
    class AdminTab extends Component<IProps, {}> {
      componentDidMount() {
        this.props.RecordStore.fetchPendings();
      }

      // handleSelect() {
      //   this.props.RecordStore.addCommonRecord();
      // }

      render() {
        const { RecordStore }: IProps = this.props;
        //this.props.RecordStore.pendingRecords.forEach(e=>console.log(e.recordtype))

        return (
          <Container>
            <Paper style={{ width: "100%", overflowX: "auto" }}>
              <FormLabel style={{ marginTop: 5 }}>Pending Records</FormLabel>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ fontSize: 10, width: 200 }}
                      align="center"
                    >
                      Record Type
                    </TableCell>
                    <TableCell style={styles.tableStyle}>
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
                          />
                          {pendings.department}
                        </TableCell>
                        <TableCell style={styles.tableStyle}>
                          {pendings.recordtype}
                        </TableCell>
                        <TableCell style={styles.tableStyle}>
                          {pendings.proposedfunction}
                        </TableCell>
                        <TableCell style={styles.tableStyle}>
                          {pendings.proposedcategory}
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
              //onClick={() => this.handleSelect()}
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
