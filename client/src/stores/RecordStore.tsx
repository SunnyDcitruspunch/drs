import { action, decorate } from "mobx";
import { DepartmentStore } from "../stores";

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

//TODO: sort all fetched data

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

  //records: array of record id
  async approveSelectedRecords(records: string[]) {
    const baseUrl = "http://localhost:3004/records";

      records.forEach(async (r: string) => {
        await fetch(`${baseUrl}/${r}`, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: "Approved"
          })
        });
      })
    DepartmentStore.fetchAllRecords();
  }
}

decorate(_RecordStore, {
  approveSelectedRecords: action
});

export const RecordStore = new _RecordStore();
