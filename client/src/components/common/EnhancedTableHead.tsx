import * as React from "react";
import { TableCell, TableHead, TableRow } from "@material-ui/core";
import { observer } from "mobx-react";

export interface IData {
  deptnum: string;
  department?: string;
  recordtype: string;
  description: string;
  category?: string;
  function: string;
  classification: string;
  comments: string;
  status?: string;
}
export interface IEnhancedTableProps {
  rowCount?: number;
  id: string;
  headrows: any;
}

export interface IHeadRow {
  id: keyof IData;
  label: string;
}

const EnhancedTableHead = observer((props: IEnhancedTableProps) => {
  const { id, headrows } = props;

  return (
    <TableHead id={id}>
      <TableRow>
        <TableCell padding="checkbox" />
        {headrows.map((row: IHeadRow) => (
          <TableCell
            key={row.id}
          >
            {row.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
});

export default EnhancedTableHead;
