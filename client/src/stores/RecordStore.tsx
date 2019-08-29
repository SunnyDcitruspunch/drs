import { action, decorate } from "mobx";
import { DepartmentStore, IDepartment } from '../stores'

export type IRecord = {
  id?: string;
  code: string;
  department: string;
  recordtype: string;
  function: string;
  recordcategoryid: string;
  description: string;
  comments: string;
  classification: string[];
  status: string;
};

export interface IRecordStore {
  CommonRecords: Array<IRecord>;
  record: IRecord;
  approveSelectedRecords: (e: any) => void;
}

class _RecordStore implements IRecordStore {
  CommonRecords = [];
  record: IRecord = {
    id: "",
    code: "",
    department: "",
    recordtype: "",
    function: "",
    recordcategoryid: "",
    description: "",
    comments: "",
    classification: [],
    status: ""
  };

  //approve selected records: PATCH
  //records: array of record id
  async approveSelectedRecords(records: string[]) {
    const baseUrl = "http://localhost:3004/records";

    for (let i = 0; i < records.length; i++) {


      await fetch(`${baseUrl}/${records[i]}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "Approved"
        })
      });
    }

    DepartmentStore.fetchAllRecords()
  }
}

decorate(_RecordStore, {
  approveSelectedRecords: action
});

export const RecordStore = new _RecordStore();
