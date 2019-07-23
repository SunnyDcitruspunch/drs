import { observable, action, decorate } from "mobx";

// interface IEditCommonRecords {
//   editID: string;
//   editCode: string;
//   editFunction: string;
//   editCategory: string;
//   editType: string;
//   editDescription: string;
//   editArchival: string;
// }

// interface IRecords {
//   allRecords: Array<any>;
//   allrecordsforSelections: string;
//   pendingRecords: Array<any>;
//   selectedDepartment: string;
//   selectedCommonRecords: Array<any>;
// }

class RecordStore {
  allRecords = [];
  allrecordsforSelections = "";
  pendingRecords = [];
  selectedDepartment = "";
  selectedCommonRecords = [];

  editcommonrecords = {
    editID: "",
    editCode: "",
    editFunction: "",
    editCategory: "",
    editType: "",
    editDescription: "",
    editArchival: ""
  };

  async fetchRecords() {
    await fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.allRecords = json));
    // .then(json => (this.allrecordsforSelections = json));
  }

  async fetchPendings() {
    await fetch("http://localhost:3004/records")
      .then(response => {
        return response.json();
      })
      .then(json => (this.pendingRecords = json));
  }

  async addCommonRecord(selects) {
    this.selectedCommonRecords = selects;
    console.log(this.selectedCommonRecords);

    await this.selectedCommonRecords.map(record => {
      // console.log(
      //   ...this.allRecords.filter((x: any) => x.id === record),
      //   ...this.allrecordsforSelections.filter((x: any) => x.id === record)
      // );
      fetch("http://localhost:3004/records", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          //...this.allrecordsforSelections.filter((x: any) => x.id === record)
        })
      });
    });
  }

  getEditRecord(
    cid,
    ccode,
    cfunction,
    ccategory,
    ctype,
    cdescription,
    carchival
  ) {
    this.editcommonrecords.editID = cid;
    this.editcommonrecords.editCode = ccode;
    this.editcommonrecords.editFunction = cfunction;
    this.editcommonrecords.editCategory = ccategory;
    this.editcommonrecords.editType = ctype;
    this.editcommonrecords.editDescription = cdescription;
    this.editcommonrecords.editArchival = carchival;
  }

  handleChange = (e) => {
    const id = e.target;
    const value = e.target;
    this.editcommonrecords[id] = value;
  };

  updateRecord() {
    console.log("record updated");
  }
}

decorate(RecordStore, {
  allRecords: observable,
  pendingRecords: observable,
  // editID: observable,
  // editCode: observable,
  // editFunction: observable,
  // editType: observable,
  // editDescription: observable,
  // editArchival: observable,
  fetchRecords: action,
  fetchPendings: action,
  handleChange: action,
  updateRecord: action,
  getEditRecord: action,
  addCommonRecord: action
});

export default new RecordStore();
