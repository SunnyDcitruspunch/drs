import * as React from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import { inject, observer } from "mobx-react";
import { DepartmentStore } from "../../stores/DepartmentStore";
import { Redirect } from "react-router";

/*
  !TODO: how to filter duplicate JSON objects?
*/

interface IProps {
  text: string;
  DepartmentStore: DepartmentStore;
  history: string;
}

const SelectDepartment = inject("DepartmentStore")(
  observer(
    class SelectDepartment extends React.Component<IProps> {
      UNSAFE_componentWillMount() {
        this.props.DepartmentStore.fetchAll();
      }

      onChange = (e: React.FormEvent<HTMLInputElement>) => {
        <Redirect to="/DeptRetention" />;
      };

      render() {
        const { DepartmentStore } = this.props;

        //this.props.DepartmentStore.allDepartments.forEach(e=>console.log(e.id))
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
                  {DepartmentStore.allDepartments.slice().map(dept => (
                    <option key={dept.id} {...dept}>
                      {dept.department}
                    </option>
                  ))}
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
