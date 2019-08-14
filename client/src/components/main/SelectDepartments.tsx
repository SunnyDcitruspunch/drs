import React, { Component } from "react";
import {
  TextField,
  FormGroup,
  Container,
  Grid,
  MenuItem,
  Select
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { IDepartmentStore } from "../../stores/DepartmentStore";
import { IDepartment } from "../../stores/RecordStore";

interface IProps {
  DepartmentStore: IDepartmentStore;
  history: any;
  RecordStore: IRecordStore;
  selecteddept: string;
}

interface IState {
  selecteddept: string;
}

export interface IRecordStore {
  handleSelected: (dept: IDepartment) => void;
}

const SelectDepartment = inject("DepartmentStore", "RecordStore")(
  observer(
    class SelectDepartment extends Component<IProps, IState> {
      componentWillMount() {
        this.props.DepartmentStore.fetchAll();

        this.setState({ selecteddept: "" });
      }

      onSelect: any = (e: MouseEvent) => {
        const { value }: any = e.target;
        console.log(value)
        const dept: IDepartment = this.props.DepartmentStore.allDepartments.find(
          (x: IDepartment) => x.department === value
        );
        this.setState({ selecteddept: value });
        this.props.DepartmentStore.handleSelected(dept);
        this.props.RecordStore.handleSelected(dept);
        this.props.DepartmentStore.handleSelectedCommonRecords(value);
        console.log(dept);
      };

      onChange = (e: MouseEvent) => {
        this.props.history.push(`/DeptRetention`);
      };

      render() {
        const { DepartmentStore } = this.props;

        return (
          <Container>
            <Grid item style={{ marginBottom: 50 }}>
              <FormGroup>
                <Select
                  id="selectdept"
                  style={styles.optionStyle}
                  onChange={this.onSelect}
                  value={this.state.selecteddept}
                >
                  {/* <MenuItem style={{ height: 30 }} value="">
                    Please Select a Department...
                  </MenuItem> */}
                  {DepartmentStore.allDepartments.slice().map((dept: any) => (
                    <MenuItem
                      style={{ height: 30 }}
                      key={dept.id}
                      value={dept.department}
                    >
                      {dept.department}
                    </MenuItem>
                  ))}
                </Select>
              </FormGroup>
            </Grid>
          </Container>
        );
      }
    }
  )
);

const styles = {
  optionStyle: {
    fontSize: 12,
    marginTop: "40px"
  }
};

export default SelectDepartment;
