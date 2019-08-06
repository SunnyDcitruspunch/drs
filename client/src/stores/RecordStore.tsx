import { observable, action, decorate, computed } from "mobx";
import { IPostDetail } from "./DepartmentStore";

export interface IRecordStore {
  allRecords: Array<any>;
  allrecordsforSelections: Array<Object>;
  pendingRecords: Array<any>;
  selectedDepartment: string;
  selectedCommonRecords: Array<String>;
  editcommonrecords: ICommonRecord;
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

export interface ICommonRecord {
  commonID: string;
  commonCode: string;
  commonFunction: string;
  commonCategory: string;
  commonType: string;
  commonDescription: string;
  commonArchival: string;
  commonNotes: string;
}

class _RecordStore implements IRecordStore {
  allRecords = []; //all common records
  allrecordsforSelections = []; //for selected common records
  pendingRecords = [];
  selectedDepartment = "";
  selectedCommonRecords: string[] = [];
  approvedRecords: string[] = [];

  editcommonrecords: ICommonRecord = {
    commonID: "",
    commonCode: "",
    commonFunction: "",
    commonCategory: "",
    commonType: "",
    commonDescription: "",
    commonArchival: "",
    commonNotes: ""
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
          (postDetail: IPostDetail): void => {
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
    this.editcommonrecords.commonID = cid;
    this.editcommonrecords.commonCode = ccode;
    this.editcommonrecords.commonFunction = cfunction;
    this.editcommonrecords.commonCategory = ccategory;
    this.editcommonrecords.commonType = ctype;
    this.editcommonrecords.commonDescription = cdescription;
    this.editcommonrecords.commonArchival = carchival;
    this.editcommonrecords.commonNotes = cnotes;
  }

  //update common records: PATCH
  async updateCommonRecord() {
    const baseUrl = "http://localhost:3004/commonrecords";

    await fetch(`${baseUrl}/${this.editcommonrecords.commonID}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: this.editcommonrecords.commonCode,
        function: this.editcommonrecords.commonFunction,
        recordcategoryid: this.editcommonrecords.commonCategory,
        recordtype: this.editcommonrecords.commonType,
        description: this.editcommonrecords.commonDescription,
        archival: this.editcommonrecords.commonArchival,
        notes: this.editcommonrecords.commonNotes
      })
    }).then(res => res.json());
  }

  handleChange = (e: any) => {
    const { id, value } = e.target;
    this.editcommonrecords[id] = value;
  };

  changeArchival = (e: any) => {
    const { value } = e.target;
    this.editcommonrecords.commonArchival = value;
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
