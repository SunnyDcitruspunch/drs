import { observable, decorate, action } from "mobx";
import { IDepartment, IRecord, DepartmentStore } from "./index";

export interface ICommonRecord {
  id: string;
  code: string;
  function: string;
  recordcategoryid: string;
  recordtype: string;
  description: string;
  classification: string[];
  comments?: string;
  useddepartment: number;
}

export interface ICommonStore {
  record: ICommonRecord;
  commonRecords: ICommonRecord[];
  fetchCommonRecords: () => void;
  updateCommonRecord: (c: string[]) => void;
  getEditRecord: (record: ICommonRecord) => void;
  addCommonRecords: (selects: string[], dept: IDepartment) => void;
  handleChange: (e: any) => void;
}

class _CommonStore implements ICommonStore {
  commonRecords: ICommonRecord[] = [];
  record: ICommonRecord = {
    id: "",
    code: "",
    recordtype: "",
    function: "",
    recordcategoryid: "",
    description: "",
    comments: "",
    classification: [""],
    useddepartment: 0
  };

  async fetchCommonRecords() {
    await fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.commonRecords = json));

    this.commonRecords.forEach((crecord: ICommonRecord) => {
      DepartmentStore.allDepartments.forEach((d: IDepartment) => {
        if (!!d.commoncodes.find((x: string) => x === crecord.code)) {
          crecord.useddepartment++;
        }
      });
    });
  }

  //record waiting to be edited
  getEditRecord(record: ICommonRecord) {
    this.record = record;
  }

  //change (edit) common record
  handleChange = (e: any) => {
    const { id, value, name } = e.target;
    this.record[id] = value;
    this.record[name] = value;
  };

  //update common records: PATCH
  async updateCommonRecord(c: string[]) {
    const baseUrl = "http://localhost:3004/commonrecords";

    await fetch(`${baseUrl}/${this.record.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        function: this.record.function,
        recordcategoryid: this.record.recordcategoryid,
        recordtype: this.record.recordtype,
        description: this.record.description,
        classification: c
      })
    });

    fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.commonRecords = json));
  }

  //add selected common records
  async addCommonRecords(selects: string[], dept: IDepartment) {
    //initial value should not be empty... should have pre selected data.
    let commoncodes: string[] = [];

    // for (let i = 0; i < selects.length; i++) {
    selects.forEach(async (select: string) => {
      let test: IRecord = {
        department: "",
        recordtype: "",
        function: "",
        recordcategoryid: "",
        description: "",
        comments: "",
        classification: [],
        status: "Approved",
        code: ""
      };
      this.commonRecords
        .filter((x: ICommonRecord) => x.id === select)
        .map((postDetail: ICommonRecord) => {
          commoncodes = dept.commoncodes;
          console.log(commoncodes);

          //post common records to records list
          test = {
            department: dept.department,
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
        });

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
      await fetch(`${baseUrl}/${dept.id}`, {
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
      DepartmentStore.fetchAllRecords();
      this.fetchCommonRecords();
      console.log("id" + dept.id);
    });
  }
}

decorate(_CommonStore, {
  commonRecords: observable,
  fetchCommonRecords: action,
  updateCommonRecord: action,
  getEditRecord: action,
  handleChange: action,
  addCommonRecords: action
});

export const CommonStore = new _CommonStore();
