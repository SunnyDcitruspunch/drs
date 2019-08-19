import * as React from "react";
import { TableCell, TableHead, TableRow } from "@material-ui/core";
import { observer } from "mobx-react";

export type IOrder = "asc" | "desc";
export interface IData {
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
  order: IOrder;
  orderBy: string;
  rowCount?: number;
  id: string;
  headrows: any;
}

export interface IHeadRow {
  id: keyof IData;
  label: string;
}

const EnhancedTableHead = observer((props: IEnhancedTableProps) => {
  const { order, orderBy, id, headrows } = props;

  return (
    <TableHead id={id}>
      <TableRow>
        <TableCell padding="checkbox" />
        {headrows.map((row: IHeadRow) => (
          <TableCell
            key={row.id}
            sortDirection={orderBy === row.id ? order : false}
          >
            {row.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
});

export default EnhancedTableHead;
