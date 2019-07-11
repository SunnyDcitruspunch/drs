import { observable, action, decorate } from "mobx";

/*
  ? TODO: fix post request for add unique record.
*/

class UniqueStore {
  uniquerecords = [
    // recordType: "",
    // proposedFunction: "",
    // proposedCategory: "",
    // proposedRetention: "",
    // Comment: ""
  ];
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

  async submitRecords(record) {
    // const headers = new Headers();
    // headers.append("Content-Type", "application/json");

    // const getCircularReplacer = () => {
    //   const seen = new WeakSet();
    //   return (key, value) => {
    //     if (typeof value === "object" && value !== null) {
    //       if (seen.has(value)) {
    //         return;
    //       }
    //       seen.add(value);
    //     }
    //     return value;
    //   };
    // };

    console.log('submitted')

    fetch("http://localhost:3004/pendingrecords", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recordtype: "yourValue",
        proposedfunction: "yourOtherValue",
        proposedcategory: "category",
        proposedretention: "safdfd",
        notes: "asdfasdf"
      })
    });

    // const headers = new Headers()
    // headers.append('Content-Type', 'application/json')

    // const options = {
    //   method: "POST",
    //   headers,
    //   body: JSON.stringify({ x: 5, y: 6 })
    // };

    // const request = new Request(
    //   "http://localhost:3004/pendingrecords",
    //   options
    // );

    // console.log(record)
    // const response = await fetch(request);
    // const status = await response.status;
    // console.log(status);
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
