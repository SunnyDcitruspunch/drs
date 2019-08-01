import { observable, action, decorate } from "mobx";
// import { IUniqueStore } from "../components/tabs/AddUniqueRecords"

export interface IUniqueStore {
  recordType: string;
  department: string;
  proposedFunction: string;
  proposedCategory: string;
  proposedRetention: string;
  Comment: string;
  uniquerecords: IUniquerecords;
  functionsDropdown: Array<string>;
  categoryDropdown: Array<string>;
  fetchFunctions: () => void;
  fetchCategory: () => void;
  submitRecords: (dept: string) => void;
  handleChange: (e: any) => void;
  getFunction: (func: string) => void
  getCategory: (category: string) => void
}

export interface IUniquerecords {
  recordType: string;
  proposedFunction: string;
  proposedCategory: string;
  proposedRetention: string;
  Comment: string;
}

class _UniqueStore {
  uniquerecords: IUniquerecords = {
    recordType: "",
    proposedFunction: "",
    proposedCategory: "",
    proposedRetention: "",
    Comment: "test comment"
  };
  functionsDropdown = [];
  categoryDropdown = [];

  handleChange = (e: any) => {
    const { id, value } = e.target;
    // const value = e.target;
    console.log(value);
    this.uniquerecords[id] = value;
  };

  async fetchFunctions() {
    await fetch("http://localhost:3004/functions")
      .then(response => {
        return response.json();
      })
      .then(json => (this.functionsDropdown = json));
  }

  async fetchCategory() {
    await fetch("http://localhost:3004/category")
      .then(response => {
        return response.json();
      })
      .then(json => (this.categoryDropdown = json));
  }

  getFunction(func: string) {
    this.uniquerecords.proposedFunction = func
  }

  getCategory(category: string) {
    this.uniquerecords.proposedCategory = category
  }

  async submitRecords(selecteddepartment: string) {
    /*post to drs: record type, retention schedule, nots, actions, status
      can pending records be deleted or edit? */
    fetch("http://localhost:3004/records", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recordtype: this.uniquerecords.recordType,
        department: selecteddepartment,
        function: this.uniquerecords.proposedFunction,
        recordcategoryid: this.uniquerecords.proposedCategory,
        description: this.uniquerecords.proposedRetention,
        notes: this.uniquerecords.Comment,
        archival: "N/A",
        code: "N/A",
        status: "Pending"
      })
    });

    console.log("submitted");
    console.log(this.uniquerecords.proposedFunction);
    console.log(this.uniquerecords.proposedCategory);
  }
}

decorate(_UniqueStore, {
  uniquerecords: observable,
  functionsDropdown: observable,
  categoryDropdown: observable,
  handleChange: action,
  fetchFunctions: action,
  submitRecords: action,
  fetchCategory: action
});

//export default new UniqueStore();

export const UniqueStore = new _UniqueStore();
