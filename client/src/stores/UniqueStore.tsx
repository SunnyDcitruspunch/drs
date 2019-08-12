import { observable, action, decorate } from "mobx";
import { IRecord } from "./DepartmentStore";

export interface IUniqueStore {
  uniquerecords: IRecord;
  functionsDropdown: Array<Object>;
  categoryDropdown: Array<Object>;
  archivalDropdown: Array<Object>;
  fetchArchival: () => void
  fetchFunctions: () => void
  fetchCategory: () => void
  submitRecords: () => void;
  handleChange: (e: any) => void;
  changeArchival: (e: any) => void;
  getDepartmentName: (dept: string) => void;
}

class _UniqueStore {
  uniquerecords: IRecord = {
    department: "",
    recordtype: "",
    function: "",
    recordcategoryid: "",
    description: "",
    comments: "",
    classification: "",
    status: "Pending",
    code:""
  };
  functionsDropdown = [];
  categoryDropdown = [];
  archivalDropdown = [];

  handleChange = (e: any) => {
    const { value, name } = e.target;
    this.uniquerecords[name] = value;
  };

  changeArchival = (e: any) => {
    const { value } = e.target;
    this.uniquerecords.classification = value;
  };

  async fetchFunctions() {
    await fetch("http://localhost:3004/functions")
      .then(response => {
        return response.json();
      })
      .then(json => (this.functionsDropdown = json))
      // .then(() => console.log(this.functionsDropdown))
  }

  async fetchCategory() {
    await fetch("http://localhost:3004/category")
      .then(response => {
        return response.json();
      })
      .then(json => (this.categoryDropdown = json))
  }

  async fetchArchival() {
    await fetch("http://localhost:3004/archival")
      .then(response => {
        return response.json();
      })
      .then(json => (this.archivalDropdown = json));
  }

  getDepartmentName = (dept: string) => {
    this.uniquerecords.department = dept;
  };

  async submitRecords() {
    fetch("http://localhost:3004/records", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.uniquerecords)
    });

    this.uniquerecords.recordtype = ""
    this.uniquerecords.function = ""
    this.uniquerecords.recordcategoryid = ""
    this.uniquerecords.description = ""
    this.uniquerecords.classification = ""
    this.uniquerecords.comments = ""
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
  changeArchival: action,
  fetchArchival: action,
  getDepartmentName: action
});

export const UniqueStore = new _UniqueStore();
