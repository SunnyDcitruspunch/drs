import React from "react";
import { Grid, MenuItem, Select, InputLabel } from "@material-ui/core";
import { observer } from "mobx-react";

interface IProps {
  value: string;
  change: (e: any) => void;
  id: string;
  name: string;
  dropdown: Array<Object>;
  title: string;
  disabled: boolean;
}

export const CategoryDropdown = observer((props: IProps) => {
  const { value, change, id, name, dropdown, title, disabled } = props;

  return (
    <Grid item style={{ marginBottom: 10 }}>
      <InputLabel shrink>
        {title}
      </InputLabel>
      <Select
        id={id}
        name={name}
        style={{ width: 500 }}
        value={value}
        onChange={change}
        disabled={disabled}
      >
        <MenuItem value={""}>Choose...</MenuItem>
        {dropdown.map((item: any) => (
          <MenuItem key={item.id} value={item.recordcategoryid}>
            {item.recordcategoryid}
          </MenuItem>
        ))}
      </Select>
    </Grid>
  );
})

