import * as React from "react";
import { observer } from "mobx-react";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import { TableCell, TableRow, Checkbox } from "@material-ui/core";
import { IRecord } from "../../../stores/RecordStore";


interface IProps {
  tablekey: number;
  onedit: () => void;
  onselect: (e: any) => void;
  record: IRecord;
}

const DepartmentTable = observer((props: IProps) => {
  const { tablekey, onedit, record, onselect } = props;

  return (
    <TableRow hover key={tablekey}>
      <TableCell component="th" scope="row" style={{ fontSize: 10, width: 120 }}>
        <CreateOutlinedIcon
          name="edit"
          onClick={onedit}
            style={styles.buttonStyle}
        />
        &nbsp;
        &nbsp;
        &nbsp;
        <Checkbox
          color="primary"
          style={{ height: 1, width: 1 }}
          onChange={onselect}
          value={record.id}
        />
      </TableCell>
      <TableCell style={{ fontSize: 10 }}>{record.department}</TableCell>
      <TableCell style={{ fontSize: 10 }}>{record.recordtype}</TableCell>
      <TableCell style={{ fontSize: 10 }}>{record.description}</TableCell>
      <TableCell style={{ fontSize: 10 }}>{record.comments}</TableCell>
    </TableRow>
  );
});

export default DepartmentTable;

const styles = {  
  buttonStyle: {
    width: 20,
    height: 16,
    padding: 0,
    fontSize: 10
  }
};
