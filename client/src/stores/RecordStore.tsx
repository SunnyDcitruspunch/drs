import { observable, action, decorate, computed } from "mobx";
import { IPostDetail } from "./DepartmentStore";

export interface IRecordStore {
  allRecords: Array<any>;
  allrecordsforSelections: Array<Object>;
  pendingRecords: Array<any>;
  selectedDepartment: string;
  selectedCommonRecords: Array<String>;
  editcommonrecords: IPostDetail;
  fetchCommonRecords: () => void;
  getEditRecord: (record: IPostDetail) => void;
  updateCommonRecord: () => void;
  addCommonRecord: (select: string[]) => void;
  handleChange: (e: any) => void;
  fetchPendings: () => void;
  approvedRecords: Array<string>;
  approveSelectedRecords: (e: any) => void;
  showCommonRecords: any;
  changeArchival: (e: any) => void;
}

class _RecordStore implements IRecordStore {
  allRecords = []; //all common records
  allrecordsforSelections = []; //for selected common records
  pendingRecords = [];
  selectedDepartment = "";
  selectedCommonRecords: string[] = [];
  approvedRecords: string[] = [];

  editcommonrecords: IPostDetail = {
    id: "",
    department: "",
    recordtype: "",
    function: "",
    recordcategoryid: "",
    description: "",
    notes: "",
    archival: "",
    status: ""
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

  /*
  !TODO: something wrong with this.
  */
  //add selected common records
  async addCommonRecord(selects: string[]) {
    this.selectedCommonRecords = selects; //selected common record id

    for (let i = 0; i < selects.length; i++) {
      let test: any = "";
      this.allRecords
        .filter((x: IPostDetail) => x.id === selects[i])
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
      })
    }

    fetch("http://localhost:3004/records")
      .then(response => {
        return response.json();
      })
      .then(json => (this.pendingRecords = json));
  }

  getEditRecord(record: IPostDetail) {
    this.editcommonrecords.id = record.id;
    this.editcommonrecords.code = record.code;
    this.editcommonrecords.function = record.function;
    this.editcommonrecords.recordcategoryid = record.recordcategoryid;
    this.editcommonrecords.recordtype = record.recordtype;
    this.editcommonrecords.description = record.description;
    this.editcommonrecords.archival = record.archival;
    this.editcommonrecords.notes = record.notes;
    console.log(this.editcommonrecords.function);
  }

  //update common records: PATCH
  async updateCommonRecord() {
    const baseUrl = "http://localhost:3004/commonrecords";

    await fetch(`${baseUrl}/${this.editcommonrecords.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: this.editcommonrecords.code,
        function: this.editcommonrecords.function,
        recordcategoryid: this.editcommonrecords.recordcategoryid,
        recordtype: this.editcommonrecords.recordtype,
        description: this.editcommonrecords.description,
        archival: this.editcommonrecords.archival,
        notes: this.editcommonrecords.notes
      })
    });

    fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.allRecords = json))
      .then(json => (this.allrecordsforSelections = json))
      .then(() => console.log('updated'))
  }

  handleChange = (e: any) => {
    const { id, value, name } = e.target;
    this.editcommonrecords[id] = value;
    this.editcommonrecords[name] = value;
  };

  changeArchival = (e: any) => {
    const { value } = e.target;
    this.editcommonrecords.archival = value;
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
