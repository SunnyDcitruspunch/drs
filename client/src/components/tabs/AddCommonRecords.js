import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Records from "../../../src/commonRecords.json";

class DeptRetnetion extends Component {
  render() {
    return (
      <Container style={styles.tableStyle}>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Select</th>
              <th>Function</th>
              <th>Record Type</th>
              <th>Retention Description</th>
              <th>Archival</th>
            </tr>
          </thead>
          <tbody style={styles.textStyle}>
            {Records.map((record, index) => {
              return (
                <tr>
                  <td>
                    <Form.Check type="checkbox" />
                  </td>
                  <td>{record.function}</td>
                  <td>{record.recordtype}</td>
                  <td>{record.retentiondescription}</td>
                  <td>{record.archival}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default DeptRetnetion;

const styles = {
  tableStyle: {
    paddingTop: 14
  },
  textStyle: {
    fontSize: 11
  }
};
