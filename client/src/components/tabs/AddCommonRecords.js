import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Table from "@material-ui/core/Table";
import Container from "react-bootstrap/Container";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";

/*
  TODO: pass data to EDIT MODAL
*/

const CommonRecords = inject("RecordStore")(
  observer(
    class CommonRecords extends Component {
      componentWillMount() {
        this.props.RecordStore.fetchRecords();
      }

      render() {
        const { RecordStore } = this.props;
        //this.props.RecordStore.allRecords.forEach(e=>console.log(e.code))
        //console.log(this.props.RecordStore.allRecords)

        return (
          <Container style={styles.tableStyle}>
            <Paper style={styles.paperStyle}>
              <Table striped="true" bordered="true" hover="true">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: 10 }}>Select</TableCell>
                    <TableCell style={{ fontSize: 10 }}>Function</TableCell>
                    <TableCell style={{ fontSize: 10 }}>Record Type</TableCell>
                    <TableCell style={{ fontSize: 10 }}>
                      Retention Description
                    </TableCell>
                    <TableCell style={{ fontSize: 10 }}>Archival</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {RecordStore.allRecords.slice().map(record => {
                    return (
                      <TableRow key={record.code} {...record}>
                        <TableCell>
                          <Checkbox style={{ height: 6 }} />
                        </TableCell>
                        <TableCell style={{ fontSize: 10 }}>
                          {record.function}
                        </TableCell>
                        <TableCell style={{ fontSize: 10 }}>
                          {record.recordtype}
                        </TableCell>
                        <TableCell style={{ fontSize: 10 }}>
                          {record.retentiondescription}
                        </TableCell>
                        <TableCell style={{ fontSize: 10 }}>
                          {record.archival}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Container>
        );
      }
    }
  )
);

export default CommonRecords;

const styles = {
  tableStyle: {
    paddingTop: 14
  },
  paperStyle: {
    width: "100%",
    overflowX: "auto"
  }
};
