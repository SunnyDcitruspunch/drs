import * as React from "react";
import { observer } from "mobx-react";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import DeleteForeverSharpIcon from "@material-ui/icons/DeleteForeverSharp";
import { TableCell, TableRow } from "@material-ui/core";

interface IProps {
  tablekey: number;
  onedit: () => void;
  ondelete: () => void;
  pfunction: string;
  recordtype: string;
  description: string;
  classification: string[];
  comments: string;
  status: string;
}

const DepartmentTable = observer((props: IProps) => {
  const {
    tablekey,
    onedit,
    ondelete,
    pfunction,
    recordtype,
    description,
    classification,
    comments,
    status
  } = props;

  return (
    <TableRow hover key={tablekey}>
      <TableCell style={{ width: 100 }}>
        <CreateOutlinedIcon
          name="edit"
          onClick={onedit}
          style={styles.buttonStyle}
        />
        &nbsp;
        <DeleteForeverSharpIcon
          name="delete"
          onClick={ondelete}
          style={styles.buttonStyle}
        />
      </TableCell>
      <TableCell style={{ fontSize: 10 }}>{pfunction}</TableCell>
      <TableCell style={{ fontSize: 10 }}>{recordtype}</TableCell>
      <TableCell style={{ fontSize: 10 }}>{description}</TableCell>
      <TableCell style={{ fontSize: 10 }}>{classification}</TableCell>
      <TableCell style={{ fontSize: 10 }}>{comments}</TableCell>
      <TableCell style={{ fontSize: 10 }}>{status}</TableCell>
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
