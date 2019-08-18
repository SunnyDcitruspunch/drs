import { observable, decorate, action, computed, runInAction } from "mobx";

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
  updateCommonRecord: () => void;
  getEditRecord: (record: ICommonRecord) => void;
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
    console.log("fetching common records");
    await fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.commonRecords = json));
  }

  //record waiting to be edited
  getEditRecord(record: ICommonRecord) {
    this.record = record;
    console.log("yo");
  }

  //change (edit) common record
  handleChange = (e: any) => {
    const { id, value, name } = e.target;
    this.record[id] = value;
    this.record[name] = value;
  };

  //update common records: PATCH
  async updateCommonRecord() {
    console.log(this.record.id);
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
        classification: this.record.classification
      })
    });

    fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.commonRecords = json))
      .then(() => console.log("updated"));
  }
}

decorate(_CommonStore, {
  commonRecords: observable,
  fetchCommonRecords: action,
  updateCommonRecord: action,
  getEditRecord: action,
  handleChange: action
});

export const CommonStore = new _CommonStore();
