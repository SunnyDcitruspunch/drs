import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Table from "@material-ui/core/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

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
            <Table striped bordered hover size="sm">
              <TableHead>
                <TableRow style={{ fontSize: 12 }}>
                  <TableCell>Select</TableCell>
                  <TableCell>Function</TableCell>
                  <TableCell>Record Type</TableCell>
                  <TableCell>Retention Description</TableCell>
                  <TableCell>Archival</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={styles.textStyle}>
                {RecordStore.allRecords.slice().map(record => {
                  return (
                    <TableRow key={record.code} {...record}>
                      <TableCell>
                        <Form.Check type="checkbox" />
                      </TableCell>
                      <TableCell>{record.function}</TableCell>
                      <TableCell>{record.recordtype}</TableCell>
                      <TableCell>{record.retentiondescription}</TableCell>
                      <TableCell>{record.archival}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
  textStyle: {
    fontSize: 11
  }
};
