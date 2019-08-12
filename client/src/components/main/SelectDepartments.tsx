import React, { Component } from "react";
import {
  TextField,
  FormGroup,
  Container,
  Grid,
  MenuItem
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { IDepartmentStore } from "../../stores/DepartmentStore";

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
  handleSelected: (dept: string) => void;
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
        this.setState({ selecteddept: value });
        this.props.DepartmentStore.handleSelected(value);
        this.props.RecordStore.handleSelected(value);
        this.props.DepartmentStore.handleSelectedCommonRecords(value)
      };

      onChange = (e: MouseEvent) => {
        this.props.history.push(`/DeptRetention`);
      };

      render() {
        const { DepartmentStore } = this.props;
        
        return (
          <Container >
            <Grid item style={{ marginBottom: 50 }}>
              <FormGroup>
                <TextField
                  select
                  margin="normal"
                  style={styles.optionStyle}
                  onChange={this.onSelect}
                  value={this.state.selecteddept}
                >
                  <MenuItem style={{ height: 30 }} value="">
                    Please Select a Department...
                  </MenuItem>
                  {DepartmentStore.allDepartments.slice().map((dept: any) => (
                    <MenuItem
                      style={{ height: 30 }}
                      key={dept.id}
                      value={dept.department}
                    >
                      {dept.department}
                    </MenuItem>
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
  optionStyle: {
    fontSize: 12
  }
};

export default SelectDepartment;
