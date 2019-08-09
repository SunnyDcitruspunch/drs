import * as React from "react";
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from "@material-ui/core";

export type IOrder = "asc" | "desc";

export interface IData {
  department?: string;
  recordtype: string;
  description: string;
  category?: string;
  function: string;
  archival: string;
  notes: string;
  status?: string;
}

export interface IEnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IData
  ) => void;
  order: IOrder;
  orderBy: string;
  rowCount?: number;
  id: string
}

export interface IHeadRow {
  id: keyof IData;
  label: string;
}

const headRows: IHeadRow[] = [
  {
    id: "recordtype",
    label: "Record Type"
  },
  {
    id: "description",
    label: "Description"
  },
  { id: "function", label: "Function" },
  { id: "category", label: "Category" },
  { id: "archival", label: "Archival" },
  { id: "notes", label: "Notes" },
  { id: "status", label: "Status" }
];

function EnhancedTableHead(props: IEnhancedTableProps) {
  const { order, orderBy, onRequestSort, id } = props;
  const createSortHandler = (property: keyof IData) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead id={id}>
      <TableRow>
        <TableCell padding="checkbox" />
        {headRows.map(row => (
          <TableCell
            key={row.id}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHead;
