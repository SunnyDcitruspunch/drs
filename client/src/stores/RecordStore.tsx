import { action, decorate } from "mobx";
import { IDepartment } from "./DepartmentStore";

export type IRecord = {
  id?: string;
  code: string;
  department: string;
  recordtype: string;
  function: string;
  recordcategoryid: string;
  description: string;
  comments: string;
  classification: string;
  status: string;
};

export interface IRecordStore {
  CommonRecords: Array<IRecord>;
  selectedDepartment: IDepartment;
  // selectedCommonRecords: Array<String>;
  record: IRecord;
  // addCommonRecord: (select: string[], dept: IDepartment) => void;
  handleCheckbox: (e: any) => void;
  approveSelectedRecords: (e: any, dept: string) => void;
  adddepts: string[];
}

class _RecordStore implements IRecordStore {
  CommonRecords = [];
  selectedDepartment: IDepartment = {
    id: "",
    department: "",
    departmentnumber: "",
    commoncodes: []
  };
  // selectedCommonRecords = [];
  adddepts = [];

  record: IRecord = {
    id: "",
    code: "",
    department: "",
    recordtype: "",
    function: "",
    recordcategoryid: "",
    description: "",
    comments: "",
    classification: "",
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

  //handle multiple classification select
  handleCheckbox = (e: any) => {
    console.log("what is up???");
  };
}

decorate(_RecordStore, {
  handleCheckbox: action,
  // addCommonRecord: action,
  approveSelectedRecords: action
});

export const RecordStore = new _RecordStore();
