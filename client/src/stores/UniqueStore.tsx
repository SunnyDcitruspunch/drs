import { observable, action, decorate } from "mobx";
import { IRecord } from "./RecordStore";

export interface IUniqueStore {
  uniquerecords: IRecord;
  functionsDropdown: Array<Object>;
  categoryDropdown: Array<Object>;
  archivalDropdown: Array<Object>;
  fetchArchival: () => void;
  fetchFunctions: () => void;
  fetchCategory: () => void;
  submitRecords: (dept: string, c: string[]) => void;
  handleChange: (e: any) => void;
}

class _UniqueStore {
  uniquerecords: IRecord = {
    department: "",
    recordtype: "",
    function: "",
    recordcategoryid: "",
    description: "",
    comments: "",
    classification: [],
    status: "Pending",
    code: ""
  };
  functionsDropdown = [];
  categoryDropdown = [];
  archivalDropdown = [];

  handleChange = (e: any) => {
    const { value, name } = e.target;
    this.uniquerecords[name] = value;
  };

  async fetchFunctions() {
    await fetch("http://localhost:3004/functions")
      .then(response => {
        return response.json();
      })
      .then(json => (this.functionsDropdown = json));
    // .then(() => console.log(this.functionsDropdown))
  }

  async fetchCategory() {
    await fetch("http://localhost:3004/category")
      .then(response => {
        return response.json();
      })
      .then(json => (this.categoryDropdown = json));
  }

  async fetchArchival() {
    await fetch("http://localhost:3004/archival")
      .then(response => {
        return response.json();
      })
      .then(json => (this.archivalDropdown = json));
  }

  async submitRecords(dept: string, c: string[]) {
    this.uniquerecords.department = dept;
    this.uniquerecords.classification = c;

    fetch("http://localhost:3004/records", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.uniquerecords)
    });

    this.uniquerecords.recordtype = "";
    this.uniquerecords.function = "";
    this.uniquerecords.recordcategoryid = "";
    this.uniquerecords.description = "";
    // this.uniquerecords.classification = ""
    this.uniquerecords.comments = "";
  }
}

decorate(_UniqueStore, {
  uniquerecords: observable,
  functionsDropdown: observable,
  categoryDropdown: observable,
  handleChange: action,
  fetchFunctions: action,
  submitRecords: action,
  fetchCategory: action,
  fetchArchival: action
});

export const UniqueStore = new _UniqueStore();
