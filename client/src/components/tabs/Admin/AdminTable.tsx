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
      <TableCell component="th" scope="row" className="tbcell">
        <CreateOutlinedIcon
          name="edit"
          onClick={onedit}
          style={styles.buttonStyle}
        />
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
    width: 20,
    height: 16,
    padding: 0,
    fontSize: 10
  }
};
