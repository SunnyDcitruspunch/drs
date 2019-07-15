import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { inject, observer } from "mobx-react";
import Container from "react-bootstrap/Container";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

/*
 *TODO:  clikcable table for pending records (editable table??)
 !TODO: change data to pending records
 */
const AdminTab = inject("DepartmentStore", "RecordStore")(
  observer(
    class AdminTab extends Component {
      componentWillMount() {
        this.props.RecordStore.fetchPendings();
      }

      render() {
        const { RecordStore } = this.props;
        //this.props.RecordStore.pendingRecords.forEach(e=>console.log(e.recordtype))

        return (
          <Container>
            <Paper style={styles.paperStyle}>
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
                  {RecordStore.pendingRecords.slice()
                  .filter(x => x.status === "Pending")
                  .map(pendings => (
                    <TableRow key={pendings.id}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ fontSize: 10}}
                      >
                        <Checkbox style={{ height: 6 }} />
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
            >
              Approve selected records
            </Button>
          </Container>
        );
      }
    }
  )
);

export default AdminTab;

const styles = {
  tableStyle: {
    fontSize: 10
  },
  paperStyle: {
    width: "100%",
    overflowX: "auto"
  }
};
