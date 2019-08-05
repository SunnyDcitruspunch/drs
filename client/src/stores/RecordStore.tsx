import { observable, action, decorate, computed } from "mobx";

export interface IRecordStore {
  allRecords: Array<any>;
  allrecordsforSelections: Array<Object>;
  pendingRecords: Array<any>;
  selectedDepartment: string;
  selectedCommonRecords: Array<String>;
  editcommonrecords: Ieditcommonrecords;
  fetchCommonRecords: () => void;
  getEditRecord: (
    cid: string,
    ccode: string,
    cfunction: string,
    ccategory: string,
    ctype: string,
    cdescription: string,
    carchival: string,
    cnotes: string
  ) => void;
  updateCommonRecord: () => void;
  addCommonRecord: (select: string[]) => void;
  handleChange: (e: any) => void;
  fetchPendings: () => void;
  approvedRecords: Array<string>;
  approveSelectedRecords: (e: any) => void;
  showCommonRecords: any;
  changeArchival: (e: any) => void;
}

export interface Ieditcommonrecords {
  editID: string;
  editCode: string;
  editFunction: string;
  editCategory: string;
  editType: string;
  editDescription: string;
  editArchival: string;
  editNotes: string;
}

class _RecordStore implements IRecordStore {
  allRecords = []; //all common records
  allrecordsforSelections = []; //for selected common records
  pendingRecords = [];
  selectedDepartment = "";
  selectedCommonRecords: string[] = [];
  approvedRecords: string[] = [];

  editcommonrecords: Ieditcommonrecords = {
    editID: "",
    editCode: "",
    editFunction: "",
    editCategory: "",
    editType: "",
    editDescription: "",
    editArchival: "",
    editNotes: ""
  };

  addcommonrecords = {};

  async fetchCommonRecords() {
    await fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.allRecords = json))
      .then(json => (this.allrecordsforSelections = json));
  }

  get showCommonRecords() {
    return this.selectedDepartment;
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

  //add selected common records
  async addCommonRecord(selects: string[]) {
    this.selectedCommonRecords = selects; //selected common record id

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
              notes: postDetail.notes,
              status: "Approved"
            };
          }
        );

      fetch("http://localhost:3004/records", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(test)
      });
    }
  }

  //approve selected records: PATCH
  async approveSelectedRecords(records: string) {
    const baseUrl = "http://localhost:3004/records";

    for (let i = 0; i < records.length; i++) {
      await fetch(`${baseUrl}/${records[i]}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          department: this.selectedDepartment,
          status: "Approved"
        })
      }).then(res => res.json());
    }
  }

  getEditRecord(
    cid: string,
    ccode: string,
    cfunction: string,
    ccategory: string,
    ctype: string,
    cdescription: string,
    carchival: string,
    cnotes: string
  ) {
    this.editcommonrecords.editID = cid;
    this.editcommonrecords.editCode = ccode;
    this.editcommonrecords.editFunction = cfunction;
    this.editcommonrecords.editCategory = ccategory;
    this.editcommonrecords.editType = ctype;
    this.editcommonrecords.editDescription = cdescription;
    this.editcommonrecords.editArchival = carchival;
    this.editcommonrecords.editNotes = cnotes;
  }

  //update common records: PATCH
  async updateCommonRecord() {
    const baseUrl = "http://localhost:3004/commonrecords";

    await fetch(`${baseUrl}/${this.editcommonrecords.editID}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: this.editcommonrecords.editCode,
        function: this.editcommonrecords.editFunction,
        recordcategoryid: this.editcommonrecords.editCategory,
        recordtype: this.editcommonrecords.editType,
        description: this.editcommonrecords.editDescription,
        archival: this.editcommonrecords.editArchival,
        notes: this.editcommonrecords.editNotes
      })
    }).then(res => res.json());
  }

  handleChange = (e: any) => {
    const { id, value } = e.target;
    this.editcommonrecords[id] = value;
  };

  changeArchival = (e: any) => {
    const { value } = e.target;
    this.editcommonrecords.editArchival = value;
  };
}

decorate(_RecordStore, {
  allRecords: observable,
  pendingRecords: observable,
  fetchCommonRecords: action,
  showCommonRecords: computed,
  fetchPendings: action,
  handleChange: action,
  getEditRecord: action,
  addCommonRecord: action,
  approvedRecords: observable,
  approveSelectedRecords: action,
  updateCommonRecord: action,
  changeArchival: action
});

export const RecordStore = new _RecordStore();
