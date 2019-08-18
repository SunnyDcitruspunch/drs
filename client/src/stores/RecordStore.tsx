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
  selectedCommonRecords: Array<String>;
  record: IRecord;
  addCommonRecord: (select: string[]) => void;
  handleCheckbox: (e: any) => void;
  approveSelectedRecords: (e: any) => void;
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
  selectedCommonRecords = [];
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

  handleSelected(dept: IDepartment) {
    this.selectedDepartment = dept;
  }

  //add selected common records
  async addCommonRecord(selects: string[]) {
    //initial value should not be empty... should have pre selected data.
    let commoncodes: string[] = [];

    for (let i = 0; i < selects.length; i++) {
      let test: IRecord = {
        department: "",
        recordtype: "",
        function: "",
        recordcategoryid: "",
        description: "",
        comments: "",
        classification: "",
        status: "Approved",
        code: ""
      };
      this.CommonRecords.filter((x: IRecord) => x.id === selects[i]).map(
        (postDetail: IRecord) => {
          commoncodes = this.selectedDepartment.commoncodes;
          console.log(commoncodes);

          //post common records to records list
          test = {
            department: this.selectedDepartment.department,
            function: postDetail.function,
            recordcategoryid: postDetail.recordcategoryid,
            recordtype: postDetail.recordtype,
            description: postDetail.description,
            classification: postDetail.classification,
            comments: "",
            code: postDetail.code,
            status: "Approved"
          };
          commoncodes.push(postDetail.code);
        }
      );

      // add selected common records to records list
      await fetch("http://localhost:3004/records", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(test)
      });
      // https://stackoverflow.com/questions/48163744/expected-to-return-a-value-in-arrow-function-array-callback-return-why/48163905

      const baseUrl = "http://localhost:3004/departments";
      await fetch(`${baseUrl}/${this.selectedDepartment.id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          //post department name to selected common records
          commoncodes: commoncodes
        })
      });
      console.log("id" + this.selectedDepartment.id);
    }
  }

  //approve selected records: PATCH
  //records: array of id
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
          department: this.selectedDepartment,
          status: "Approved"
        })
      });
    }
  }

  //handle multiple classification select
  handleCheckbox = (e: any) => {
    console.log("what is up???");
  };
}

decorate(_RecordStore, {
  handleCheckbox: action,
  addCommonRecord: action,
  approveSelectedRecords: action
});

export const RecordStore = new _RecordStore();
