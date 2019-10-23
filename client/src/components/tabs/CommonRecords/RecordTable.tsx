import * as React from "react";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import DeleteForeverSharpIcon from "@material-ui/icons/DeleteForeverSharp";
import { TableCell, TableRow, Checkbox } from "@material-ui/core";
import { ICommonRecord, UserStore } from "../../../stores";
import { observer, inject } from "mobx-react";
import { MsgSnackbar } from '../../common'

interface IProps {
  record: ICommonRecord;
  click: () => void;
  showdelete: () => void;
<<<<<<< HEAD
  select: (e: any) => void;
  checked?: boolean;
=======
  change: (e: any) => void;
  checked: boolean;
>>>>>>> 1e9a4c815359eb704fb4698eaa37aa96bd213ebc
}

const RecordTable = inject("UserStore")(
  observer((props: IProps) => {
    const { record, click, change, checked, showdelete } = props;

    return (
      <TableRow key={record.id}>
        <TableCell style={{ width: 140 }}>
          <CreateOutlinedIcon
            style={styles.buttonStyle}
            name="edit"
            onClick={click}
          />
          &nbsp;
          {UserStore.currentUser.admin ? (
            <DeleteForeverSharpIcon name="delete" style={styles.buttonStyle} onClick={showdelete} />
          ) : (
            ""
          )}
          <Checkbox
            value={record.id}  
            id={record.id}
            name={record.id}
<<<<<<< HEAD
            onChange={select}
=======
            onClick={change}
>>>>>>> 1e9a4c815359eb704fb4698eaa37aa96bd213ebc
            color="primary"
            checked={checked}
            // onChange={console.log('remove this record')}
          />
          {/* <MsgSnackbar /> */}
        </TableCell>
        {/* <TableCell style={{ fontSize: 10 }}>{record.code}</TableCell> */}
        <TableCell style={{ fontSize: 10 }}>{record.useddepartment}</TableCell>
        <TableCell style={{ fontSize: 10 }}>{record.function}</TableCell>
        <TableCell style={{ fontSize: 10 }}>{record.recordtype}</TableCell>
        <TableCell style={{ fontSize: 10 }}>{record.description}</TableCell>
        <TableCell style={{ fontSize: 10 }}>{record.classification}</TableCell>
      </TableRow>
    );
  })
);

export default RecordTable;

const styles = {
  buttonStyle: {
    width: 20,
    height: 16,
    padding: 0,
    fontSize: 10
  }
};
