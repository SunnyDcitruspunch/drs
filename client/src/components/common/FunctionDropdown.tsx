import React from "react";
import {
  Grid,
  MenuItem,
  Select,
  InputLabel,
} from "@material-ui/core";

interface IProps {
  value: string,
  change: (e: any) => void,
  id: string,
  name: string,
  dropdown: Array<Object>
}

export default function FunctionDropdown(props: IProps) {
    const { value, change, id, name, dropdown } = props

  return (
    <Grid item style={{ marginBottom: 10 }}>
      <InputLabel shrink htmlFor="age-label-placeholder">
        Record Function
      </InputLabel>
      <Select
        id={id}
        name={name}
        style={{ width: 500 }}
        value={value}
        onChange={change}
      >
        <MenuItem>Choose...</MenuItem>
        {dropdown.slice().map((func: any) => (
          <MenuItem key={func.id} value={func.functiontype}>
            {func.functiontype}
          </MenuItem>
        ))}
      </Select>
    </Grid>
  );
}
