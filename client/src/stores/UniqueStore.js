import { observable, action, decorate } from "mobx";

/*
  ! TODO: pass data to mobx store using handleChange method
  TODO: pass data from mobx sore to json server using submitRecords method
*/

class UniqueStore {
  uniquerecords = {
    recordType: "",
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
    // const id = e.target.id
    // const value = e.target.value
    //console.log(value)
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

  handleChange = e => {
    const { id, value } = e.target;
    this.uniquerecords[id] = value;
  };

  async submitRecords() {

    console.log('successfully posted');

    fetch("http://localhost:3004/pendingrecords", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recordtype: this.uniquerecords.recordType,
        proposedfunction: this.uniquerecords.proposedFunction,
        proposedcategory: this.uniquerecords.proposedCategory,
        proposedretention: this.uniquerecords.proposedRetention,
        notes: this.uniquerecords.Comment
      })
    });
  }
}

decorate(UniqueStore, {
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
