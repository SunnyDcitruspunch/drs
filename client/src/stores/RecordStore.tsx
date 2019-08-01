import { observable, action, decorate } from "mobx";

export interface IRecordStore {
  allRecords: Array<Object>;
  allrecordsforSelections: Array<Object>;
  pendingRecords: Array<Object>;
  selectedDepartment: string;
  selectedCommonRecords: Array<String>;
  editcommonrecords: Ieditcommonrecords;
  fetchRecords: () => void;
  getEditRecord: (
    cid: string,
    ccode: string,
    cfunction: string,
    ccategory: string,
    ctype: string,
    cdescription: string,
    carchival: string
  ) => void;
  updateRecord: () => void;
  addCommonRecord: (select: string[]) => void;
  handleChange: (e: any) => void;
  fetchPendings: () => void;
}

export interface Ieditcommonrecords {
  editID: string;
  editCode: string;
  editFunction: string;
  editCategory: string;
  editType: string;
  editDescription: string;
  editArchival: string;
}

class _RecordStore implements IRecordStore {
  allRecords = []; //all common records
  allrecordsforSelections = []; //for selected common records
  pendingRecords = [];
  selectedDepartment = "";
  selectedCommonRecords: string[] = [];

  editcommonrecords: Ieditcommonrecords = {
    editID: "",
    editCode: "",
    editFunction: "",
    editCategory: "",
    editType: "",
    editDescription: "",
    editArchival: ""
  };

  addcommonrecords = {};

  async fetchRecords() {
    await fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.allRecords = json))
      .then(json => (this.allrecordsforSelections = json));
  }

  async fetchPendings() {
    await fetch("http://localhost:3004/records")
      .then(response => {
        return response.json();
      })
      .then(json => (this.pendingRecords = json));
  }

  handleSelected(dept: string) {
    this.selectedDepartment = dept;
  }

  async addCommonRecord(selects: string[]) {
    console.log("approved");
    this.selectedCommonRecords = selects; //selected common record id
    console.log(this.selectedCommonRecords);

    for (let i = 0; i < selects.length; i++) {
      let test: any = "";
      this.allRecords
        .filter((x: any) => x.id === selects[i])
        .map(
          (postDetail: any): void => {
            test = {
              department: this.selectedDepartment,
              code: postDetail.code,
              function: postDetail.function,
              recordcategoryid: postDetail.recordcategoryid,
              recordtype: postDetail.recordtype,
              description: postDetail.description,
              archival: postDetail.archival,
              status: "Approved"
            };
          }
        );

      console.log(test);

      // await this.selectedCommonRecords.map(record => {
      fetch("http://localhost:3004/records", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(test)
      });
    }
    // });
  }

  getEditRecord(
    cid: string,
    ccode: string,
    cfunction: string,
    ccategory: string,
    ctype: string,
    cdescription: string,
    carchival: string
  ) {
    this.editcommonrecords.editID = cid;
    this.editcommonrecords.editCode = ccode;
    this.editcommonrecords.editFunction = cfunction;
    this.editcommonrecords.editCategory = ccategory;
    this.editcommonrecords.editType = ctype;
    this.editcommonrecords.editDescription = cdescription;
    this.editcommonrecords.editArchival = carchival;
  }

  handleChange = (e: any) => {
    const id = e.target;
    const value = e.target;
    this.editcommonrecords[id] = value;
  };

  updateRecord() {
    console.log("record updated");
  }
}

decorate(_RecordStore, {
  allRecords: observable,
  pendingRecords: observable,
  fetchRecords: action,
  fetchPendings: action,
  handleChange: action,
  updateRecord: action,
  getEditRecord: action,
  addCommonRecord: action
});

//export default new RecordStore();
export const RecordStore = new _RecordStore();
