import React, { Component } from "react";
import {
  FormGroup,
  Container,
  Grid,
  MenuItem,
  Select
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import {
  IDepartmentStore,
  IDepartment,
  ICommonStore,
  IUniqueStore
} from "../../stores";

interface IProps {
  DepartmentStore: IDepartmentStore;
  CommonStore: ICommonStore;
  history: any;
  RecordStore: IRecordStore;
  UniqueStore: IUniqueStore;
  selecteddept: string;
}

interface IState {
  selecteddept: string;
}

export interface IRecordStore {
  handleSelected: (dept: IDepartment) => void;
}

const SelectDepartment = inject(
  "UniqueStore",
  "DepartmentStore",
  "RecordStore",
  "CommonStore"
)(
  observer(
    class SelectDepartment extends Component<IProps, IState> {
      componentWillMount = () => {
        this.props.DepartmentStore.fetchAll();
        this.props.CommonStore.fetchCommonRecords();
        this.props.DepartmentStore.fetchAllRecords();
        this.props.UniqueStore.fetchArchival();

        this.setState({ selecteddept: "" });
      };

      onSelect: any = (e: MouseEvent) => {
        const { value }: any = e.target;
        const dept: IDepartment = this.props.DepartmentStore.allDepartments.find(
          (x: IDepartment) => x.department === value
        );
        this.setState({ selecteddept: value });
        this.props.DepartmentStore.handleSelected(dept);
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
                  {DepartmentStore.allDepartments
                    .sort(
                      (a: IDepartment, b: IDepartment) =>
                        parseFloat(a.department) - parseFloat(b.department)
                    )
                    .map((dept: any) => (
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
