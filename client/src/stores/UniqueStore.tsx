import { observable, action, decorate } from "mobx";

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
  getFunction: (func: string) => void;
  getCategory: (category: string) => void;
  changeArchival: (e: any) => void;
}

export interface IUniquerecords {
  recordType: string;
  proposedFunction: string;
  proposedCategory: string;
  proposedRetention: string;
  Comment: string;
  archival: string;
}

class _UniqueStore {
  uniquerecords: IUniquerecords = {
    recordType: "",
    proposedFunction: "",
    proposedCategory: "",
    proposedRetention: "",
    Comment: "",
    archival: ""
  };
  functionsDropdown = [];
  categoryDropdown = [];

  handleChange = (e: any) => {
    const { id, value } = e.target;
    this.uniquerecords[id] = value;
    console.log(value)
  };

  changeArchival = (e: any) => {
    const { value } = e.target;
    this.uniquerecords.archival = value;
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
    this.uniquerecords.proposedFunction = func;
  }

  getCategory(category: string) {
    this.uniquerecords.proposedCategory = category;
  }

  async submitRecords(selecteddepartment: string) {
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
        archival: this.uniquerecords.archival,
        code: "N/A",
        status: "Pending"
      })
    });
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
  changeArchival: action
});

export const UniqueStore = new _UniqueStore();
