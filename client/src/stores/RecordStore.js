import { observable, action, decorate } from "mobx";
import { thisExpression } from "@babel/types";

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
      console.log(
        ...this.allRecords.filter(x => x.id === record),
        ...this.allrecordsforSelections.filter(x => x.id === record)
      );
      fetch("http://localhost:3004/records", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...this.allrecordsforSelections.filter(x => x.id === record)
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

  handleChange = e => {
    const { id, value } = e.target;
    this.editcommonrecords[id] = value;
  };

  updateRecord() {
    console.log("record updated");
  }
}

decorate(RecordStore, {
  fetchRecords: action,
  fetchPendings: action,
  handleChange: action,
  updateRecord: action,
  getEditRecord: action,
  addCommonRecord: action,
  allRecords: observable,
  pendingRecords: observable,
  editID: observable,
  editCode: observable,
  editFunction: observable,
  editType: observable,
  editDescription: observable,
  editArchival: observable
});

export default new RecordStore();
