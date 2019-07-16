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
import Button from "@material-ui/core/Button";
import Modal from "react-bootstrap/Modal";

/*
  !TODO: refactor modal to material ui compnent
*/

const CommonRecords = inject("RecordStore", "DepartmentStore")(
  observer(
    class CommonRecords extends Component {
      componentWillMount() {
        this.props.RecordStore.fetchRecords();
      }

      state = {
        modalShow: false,
        selectrecord: true
      };

      onselect = () => {
        this.setState({ selectrecord: !this.state.selectrecord })
        console.log(this.state.selectrecord)
      }

      addRecord = e => {
        if (this.props.DepartmentStore.selectedDepartment === "") {
          this.setState({ modalShow: true });
        } else {
          this.props.RecordStore.addCommonRecord();
        }
      };

      selectRecord(code){
        this.props.RecordStore.getSelectedCommonRecords(code)
        //console.log(this.props.RecordStore.selectedCommonRecords)
      }

      render() {
        let smClose = () => this.setState({ modalShow: false });
        const { RecordStore } = this.props;
        //this.props.RecordStore.allRecords.forEach(e=>console.log(e.code))
        // console.log(this.props.DepartmentStore.selectedDepartment)

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
                      <TableRow key={record.id} {...record}>
                        <TableCell>
                          <Checkbox
                            id={record.id}
                            value={record.code}
                            onClick={this.onselect}
                            color="primary"
                            style={{ height: 6 }}
                          />
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
            <Button
              variant="outlined"
              color="primary"
              style={{ marginTop: 10, fontSize: 10 }}
              onClick={this.addRecord}
            >
              Add selected common records
            </Button>

            <Modal
              size="sm"
              show={this.state.modalShow}
              onHide={smClose}
              aria-labelledby="example-modal-sizes-title-sm"
            >
              <Modal.Body style={{ fontSize: 12 }}>
                Please select a department.
              </Modal.Body>
              <Modal.Footer style={{ height: 20 }}>
                <Button
                  style={styles.modalButtonStyle}
                  variant="outlined"
                  onClick={() => this.setState({ modalShow: false })}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
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
