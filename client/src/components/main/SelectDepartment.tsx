import React, { useState } from "react";
import { FormGroup, MenuItem, Select } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { IDepartment, DepartmentStore } from "../../stores";

const SelectDepartment = inject("DepartmentStore")(
  observer(() => {
    const [selecteddept, setDept] = useState<string>("");

    //admin select a department
    const onSelect: (event: any) => void = (event: any) => {
      const { value }: any = event.target;
      const deptIndex: number = DepartmentStore.allDepartments.findIndex(
        (x: IDepartment) => x.department === value
      );
      const dept = DepartmentStore.allDepartments[deptIndex];
      setDept(value);
      DepartmentStore.handleSelected(dept);
    };

    return (
      <FormGroup>
        <Select
          id="selectdept"
          style={{
            fontSize: 20,
            marginTop: "40px",
            width: 300
          }}
          onChange={onSelect}
          value={selecteddept}
        >
          {DepartmentStore.allDepartments
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
    );
  })
);

export default SelectDepartment;
