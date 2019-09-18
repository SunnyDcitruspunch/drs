import React, { Component } from "react";
import {
  FormGroup,
  Grid,
  MenuItem,
  Select
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import {
  IDepartmentStore,
  IDepartment,
  ICommonStore,
  IUniqueStore,
  IRecordStore
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

const SelectDepartment = inject(
  "UniqueStore",
  "DepartmentStore",
  "RecordStore",
  "CommonStore",
  "AuthStore"
)(
  observer(
    class SelectDepartment extends Component<IProps, IState> {

      onSelect: any = (e: MouseEvent) => {
        const { value }: any = e.target;
        const deptIndex: number = this.props.DepartmentStore.allDepartments.findIndex(
          (x: IDepartment) => x.department === value
        )
        const dept = this.props.DepartmentStore.allDepartments[deptIndex]
        this.setState({ selecteddept: value });
        this.props.DepartmentStore.handleSelected(dept);
      };

      onChange = (e: MouseEvent) => {
        this.props.history.push(`/DeptRetention`);
      };

      render() {
        const { DepartmentStore } = this.props;

        return (
          <Grid
            container
            justify="center"
            alignItems="center"
            style={{ marginBottom: 50 }}
          >
            <FormGroup>
              <Select
                id="selectdept"
                style={{ fontSize: 12, marginTop: "40px" }}
                onChange={this.onSelect}
                value={this.state.selecteddept}
              >
                {DepartmentStore.allDepartments
                  .slice()
                  .sort((a: IDepartment, b: IDepartment) =>
                    a.department < b.department ? -1 : 1
                  )
                  .map((dept: any) => (
                    <MenuItem key={dept.id} value={dept.department}>
                      {dept.department}
                    </MenuItem>
                  ))}
              </Select>
            </FormGroup>
          </Grid>
        );
      }
    }
  )
);

export default SelectDepartment;
