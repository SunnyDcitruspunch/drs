import React, { Component } from "react";
import { TextField, FormGroup, Container, Grid } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { IDepartmentStore } from "../../stores/DepartmentStore";
import DeptRetention from "../tabs/DeptRetention";

/*
  !TODO: how to filter duplicate JSON objects?
*/

interface IProps {
  DepartmentStore: IDepartmentStore;
  history: any;
  RecordStore: IRecordStore;
}

export interface IRecordStore {
  handleSelected: (dept: string) => void;
}

const SelectDepartment = inject("DepartmentStore", "RecordStore")(
  observer(
    class SelectDepartment extends Component<IProps> {
      componentWillMount() {
        this.props.DepartmentStore.fetchAll();
      }

      onSelect: any = (e: MouseEvent) => {
        const { value }: any = e.target;
        // this.state.selecteddept = value;
        this.props.DepartmentStore.handleSelected(value);
        this.props.RecordStore.handleSelected(value);
      };

      onChange = (e: MouseEvent) => {
        this.props.history.push(`/DeptRetention`);
      };

      render() {
        const { DepartmentStore } = this.props;
        //this.props.DepartmentStore.fetchAll();

        //this.props.DepartmentStore.allDepartments.forEach(e=>console.log(e.id))
        return (
          <Container>
            <Grid item xs={12} style={styles.dropdownStyle}>
              <FormGroup>
                <TextField
                  select
                  margin="normal"
                  style={styles.optionStyle}
                  onChange={this.onSelect}
                  value={DeptRetention.department}
                >
                  <option>Please Select a Department...</option>
                  {DepartmentStore.allDepartments.slice().map((dept: any) => (
                    <option key={dept.id} value={dept.department}>
                      {dept.department}
                    </option>
                  ))}
                </TextField>
              </FormGroup>
            </Grid>
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
