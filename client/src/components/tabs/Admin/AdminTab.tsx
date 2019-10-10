import React, { useState } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  Button,
  FormLabel,
  Grid
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import {
  IRecord,
  RecordStore,
  DepartmentStore,
  UniqueStore
} from "../../../stores";
import EnhancedTableHead, { IHeadRow } from "../../common/EnhancedTableHead";
import AdminTable from "./AdminTable";
import { EditModal } from "../../common";
import "./Admin.scss";

const headrows: IHeadRow[] = [
  {
    id: "department",
    label: "Department"
  },
  {
    id: "recordtype",
    label: "Record Type"
  },
  {
    id: "description",
    label: "Retention Description"
  },
  { id: "comments", label: "Comments" }
];

const AdminTab = inject("DepartmentStore", "RecordStore", "UniqueStore")(
  observer(() => {
    const [approvedrecord, setApprovedRecord] = useState<IRecord | any>([]);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [selectedclassification, setSelectedClassification] = useState<
      IRecord | any
    >([]);

    const onSelect = (e: any) => {
      const { value } = e.target;
      if (e.target.checked) {
        setApprovedRecord([...approvedrecord, value]);
      } else {
        let remove = approvedrecord.indexOf(value);
        approvedrecord.filter((_: IRecord, i: number) => i !== remove);
      }
    };

    const approveSelect = async (e: any) => {
      RecordStore.approveSelectedRecords(approvedrecord);
      setApprovedRecord([]);
    };

    const handleEdit = (record: IRecord) => {
      setSelectedClassification(record.classification);
      setOpenEdit(true);
      DepartmentStore.updateEditID(record);
    };

    const editRecord: any = async () => {
      await DepartmentStore.updateRecord(selectedclassification);
      setOpenEdit(false);
    };

    const handleCheck = (e: any) => {
      if (e.target.checked) {
        setSelectedClassification([...selectedclassification, e.target.value]);
      } else {
        let remove = selectedclassification.indexOf(e.target.value);
        selectedclassification([
          ...selectedclassification,
          selectedclassification.filter((_: string, i: number) => i !== remove)
        ]);
      }
    };

    return (
      <Container>
        <Paper id="paper">
          <Grid container justify="center" alignItems="center">
            <FormLabel style={{ marginTop: 5 }}>Pending Records</FormLabel>
          </Grid>
          <Table size="small">
            <EnhancedTableHead id="tablehead" headrows={headrows} />
            <TableBody style={{ fontSize: 11 }}>
              {DepartmentStore.allRecords
                .filter((x: IRecord) => x.status === "Pending")
                .map((pending: IRecord, index: number) => (
                  <AdminTable
                    key={index}
                    tablekey={index}
                    record={pending}
                    onedit={() => handleEdit(pending)}
                    onselect={onSelect}
                  />
                ))}
            </TableBody>
          </Table>
        </Paper>
        <Grid container justify="center" alignItems="center">
          <Button
            variant="outlined"
            color="primary"
            style={{ marginTop: 10, fontSize: 10 }}
            onClick={approveSelect}
          >
            Approve selected records
          </Button>
        </Grid>

        {/* edit record */}
        {DepartmentStore.allRecords
          .filter((x: IRecord) => x.id === DepartmentStore.record.id)
          .map((editDetail: IRecord, index) => {
            return (
              <EditModal
                title={"Edit Record"}
                disabled={false}
                key={index}
                record={editDetail}
                open={openEdit}
                close={() => setOpenEdit(false)}
                functionList={UniqueStore.functionsDropdown}
                categoryList={UniqueStore.categoryDropdown}
                change={DepartmentStore.handleChange}
                saveedit={editRecord}
                changecheckbox={handleCheck}
                disablecategory={
                  editDetail.recordcategoryid === "common" ? true : false
                }
                ifarchival={
                  !!selectedclassification.find(
                    (x: string) => x === " Archival "
                  )
                }
                ifvital={
                  !!selectedclassification.find((x: string) => x === " Vital ")
                }
                ifconfidential={
                  !!selectedclassification.find(
                    (x: string) => x === " Highly Confidential "
                  )
                }
              />
            );
          })}
      </Container>
    );
  })
);

export default AdminTab;
