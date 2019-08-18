import * as React from "react";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import { TableCell, TableRow, Checkbox } from "@material-ui/core";
import { IRecord, ICommonRecord } from "../../../stores";
import { observer } from "mobx-react";

interface IProps {
  record: ICommonRecord;
  click: () => void;
  select: (e: any) => void;
  disabled: boolean;
  // value: string
}

const RecordTable = observer((props: IProps) => {
  const { record, click, select, disabled } = props;

  return (
    <TableRow key={record.id}>
      <TableCell>
        <CreateOutlinedIcon
          // style={styles.buttonStyle}
          name="edit"
          onClick={click}
        />
        <Checkbox
          value={record.id}
          id={record.id}
          name={record.id}
          // value={record.id}
          onClick={select}
          color="primary"
          disabled={disabled}
        />
      </TableCell>
      <TableCell style={{ fontSize: 10 }}>{record.function}</TableCell>
      <TableCell style={{ fontSize: 10 }}>{record.recordtype}</TableCell>
      <TableCell style={{ fontSize: 10 }}>{record.description}</TableCell>
      <TableCell style={{ fontSize: 10 }}>{record.classification}</TableCell>
    </TableRow>
  );
});

export default RecordTable;
