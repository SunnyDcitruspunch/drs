import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

/*
  TODO: pass data to EDIT MODAL
*/

const CommonRecords = inject("RecordStore")(
  observer(
    class CommonRecords extends Component {
      componentWillMount(){
        this.props.RecordStore.fetchRecords()
      }

      render() {
        const { RecordStore } = this.props
        //this.props.RecordStore.allRecords.forEach(e=>console.log(e.code))   
        //console.log(this.props.RecordStore.allRecords) 
        
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
            {RecordStore.allRecords.slice().map(record => {
              return (
                <tr key={record.code} {...record}>
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
