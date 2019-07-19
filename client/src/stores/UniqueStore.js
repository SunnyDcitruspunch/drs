import { observable, action, decorate } from "mobx";

class UniqueStore {
  uniquerecords = {
    recordType: "",
    department: "",
    proposedFunction: "",
    proposedCategory: "",
    proposedRetention: "",
    Comment: ""
  };
  functionsDropdown = [];
  categoryDropdown = [];
  //do we need repository options for users?

  handleChange = e => {
    const { id, value } = e.target;
    this.uniqueRecords[id] = value;
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

  async submitRecords(selecteddepartment) {
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
        description: this.uniquerecords.proposedRetention,
        notes: this.uniquerecords.Comment,
        status: "Pending"
      })
    });
  }
}

decorate(UniqueStore, {
  uniquerecords: observable,
  recordType: observable,
  proposedFunction: observable,
  proposedCategory: observable,
  proposedRetention: observable,
  Comment: observable,
  functionsDropdown: observable,
  categoryDropdown: observable,
  handleChange: action,
  fetchFunctions: action,
  submitRecords: action,
  fetchCategory: action
});

export default new UniqueStore();
