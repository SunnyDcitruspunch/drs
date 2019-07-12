import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { inject, observer } from "mobx-react";
import Container from "react-bootstrap/Container";

/*
 *TODO:  clikcable table for pending records (editable table??)
 !TODO: change data to pending records
 */

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const AdminTab = inject("UniqueStore", "DepartmentStore")(
  observer(
    class AdminTab extends Component {
      render() {
        const rows = [
          createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
          createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
          createData("Eclair", 262, 16.0, 24, 6.0),
          createData("Cupcake", 305, 3.7, 67, 4.3)
        ];

        return (
          <Container>
            <Paper style={styles.paperStyle}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={styles.tableStyle}>Record Type</TableCell>
                    <TableCell style={styles.tableStyle}>
                      Retention Schedule
                    </TableCell>
                    <TableCell style={styles.tableStyle}>Notes</TableCell>
                    <TableCell style={styles.tableStyle}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.name}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={styles.tableStyle}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell style={styles.tableStyle}>
                        {row.calories}
                      </TableCell>
                      <TableCell style={styles.tableStyle}>{row.fat}</TableCell>
                      <TableCell style={styles.tableStyle}>
                        {row.carbs}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
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
