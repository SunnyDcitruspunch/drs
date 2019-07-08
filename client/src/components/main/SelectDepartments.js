import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import SampleData from "../../drs.json";
import { inject, observer } from "mobx-react";

const SelectDepartment = inject("DepartmentStore")(
  observer(
    class SelectDepartment extends Component {

      onChange = (e) => {
        this.props.history.push(`/DeptRetention`);
      };

      render() {
        const { DepartmentStore } = this.props;

        return (
          <Container>
            <Col md={{ span: 6, offset: 3 }} style={styles.dropdownStyle}>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Control
                  as="select"
                  style={styles.optionStyle}
                  onChange={DepartmentStore.handleSelected}
                >
                  <option>Please Select a Department...</option>
                  {SampleData.map((deptDetail, index) => {
                    return (
                      <option
                        onClick={this.onChange}
                        value={deptDetail.department}
                        key={index}
                      >
                        {deptDetail.departmentnumber +
                          " - " +
                          deptDetail.department}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            </Col>
          </Container>
        );
      }
    }
  )
);

const styles = {
  dropdownStyle: {
    paddingTop: 80
  },
  optionStyle: {
    fontSize: 12
  },
  buttongroupStyle: {
    fontSize: 12,
    paddingBottom: 20
  }
};

export default SelectDepartment;
