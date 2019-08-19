import { action, decorate } from "mobx";

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
  approveSelectedRecords: (e: any, dept: string) => void;
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
  //records: array of id
  async approveSelectedRecords(records: string[], dept: string) {
    const baseUrl = "http://localhost:3004/records";

    for (let i = 0; i < records.length; i++) {
      await fetch(`${baseUrl}/${records[i]}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          department: dept,
          status: "Approved"
        })
      });
    }

    await fetch("http://localhost:3004/records")
      .then(response => {
        return response.json();
      })
      // .then(json => (this._allRecords = json));
  }
}

decorate(_RecordStore, {
  approveSelectedRecords: action
});

export const RecordStore = new _RecordStore();
