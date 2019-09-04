import { observable, decorate, action } from "mobx";
import { IDepartment, IRecord, DepartmentStore } from '.'

export interface ICommonRecord {
  id: string;
  code: string;
  function: string;
  recordcategoryid: string;
  recordtype: string;
  description: string;
  classification: string[];
  comments?: string;
}

export interface ICommonStore {
  record: ICommonRecord;
  commonRecords: ICommonRecord[];
  fetchCommonRecords: () => void;
  updateCommonRecord: (c: string[]) => void;
  getEditRecord: (record: ICommonRecord) => void;
  addCommonRecords: (selects: string[], dept: IDepartment) => void
  handleChange: (e: any) => void;
}

class _CommonStore implements ICommonStore {
  commonRecords = [];
  record: ICommonRecord = {
    id: "",
    code: "",
    recordtype: "",
    function: "",
    recordcategoryid: "",
    description: "",
    comments: "",
    classification: [""]
  };

  async fetchCommonRecords() {
    await fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.commonRecords = json));
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
      .then(json => (this.commonRecords = json))
  }

  //add selected common records
  addCommonRecords(selects: string[], dept: IDepartment) {
    let commoncodes: string[] = [];

    selects.forEach(async (s: string) => {
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
      this.commonRecords.filter((x: ICommonRecord) => x.id === s).forEach(
        (postDetail: IRecord) => {
          commoncodes = dept.commoncodes;

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
    })

    DepartmentStore.fetchAllRecords();
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
