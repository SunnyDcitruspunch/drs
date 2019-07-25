import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import { inject, observer } from "mobx-react";
import { DepartmentStore } from "../../stores/DepartmentStore";
import { RecordStore } from '../../stores/RecordStore'

/*
  !TODO: how to filter duplicate JSON objects?
*/

interface IDepartmentProps {
  DepartmentStore: DepartmentStore;
  history: any;
  RecordStore: RecordStore
}

interface IState {
  selecteddept: string;
}

const SelectDepartment = inject("DepartmentStore", "RecordStore")(
  observer(
    class SelectDepartment extends Component<IDepartmentProps, IState> {
      constructor(props: IDepartmentProps) {
        super(props)     
      }

      state: IState = {
        selecteddept: ""
      }

      componentWillMount() {
        this.props.DepartmentStore.fetchAll() 
      }

      onSelect: any = (e: MouseEvent) => {
        const { value }: any = e.target
        this.state.selecteddept = value;
        this.props.DepartmentStore.handleSelected(this.state.selecteddept);
        this.props.RecordStore.handleSelected(this.state.selecteddept);
      };

      onChange = (e: MouseEvent) => {
        this.props.history.push(`/DeptRetention`);
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
                  onChange={this.onSelect}
                >
                  <option>Please Select a Department...</option>
                  {DepartmentStore.allDepartments.slice().map((dept: any) => (
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
