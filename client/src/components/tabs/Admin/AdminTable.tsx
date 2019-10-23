import * as React from "react";
import { observer } from "mobx-react";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import { TableCell, TableRow, Checkbox } from "@material-ui/core";
import { IRecord } from "../../../stores/RecordStore";
import "./Admin.scss";

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
      <TableCell style={{ width: 140 }}>
        <CreateOutlinedIcon
          name="edit"
          onClick={onedit}
          style={styles.buttonStyle}
        />
          &nbsp;
        <Checkbox
          color="primary"
          className="ckbox"
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
    width: 30,
    height: 16,
    padding: 0,
    fontSize: 10
  }
};
