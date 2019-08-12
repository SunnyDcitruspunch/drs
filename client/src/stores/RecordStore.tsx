import { action, decorate } from "mobx";
import { IRecord } from "./DepartmentStore";

export interface IRecordStore {
  CommonRecords: Array<IRecord>;
  selectedDepartment: string;
  selectedCommonRecords: Array<String>;
  record: IRecord;
  fetchCommonRecords: () => void;
  getEditRecord: (record: IRecord) => void;
  updateCommonRecord: () => void;
  addCommonRecord: (select: string[]) => void;
  handleChange: (e: any) => void;
  approveSelectedRecords: (e: any) => void;
  changeArchival: (e: any) => void;
}

class _RecordStore implements IRecordStore {
  CommonRecords = []; 
  selectedDepartment = "";
  selectedCommonRecords: string[] = [];

  record: IRecord = {
    id: "",
    code:"",
    department: "",
    recordtype: "",
    function: "",
    recordcategoryid: "",
    description: "",
    comments: "",
    classification: "",
    status: ""
  };

  addcommonrecords = {};

  async fetchCommonRecords() {
    await fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.CommonRecords = json))
  }

  // get showCommonRecords() {
  //   return this.selectedDepartment;
  // }

  // async fetchPendings() {
  //   await fetch("http://localhost:3004/records")
  //     .then(response => {
  //       return response.json();
  //     })
  //     .then(json => (this.pendingRecords = json));
  // }

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
      this.CommonRecords
        .filter((x: IRecord) => x.id === selects[i])
        .map(
          (postDetail: IRecord): void => {
            test = {
              department: this.selectedDepartment,
              function: postDetail.function,
              recordcategoryid: postDetail.recordcategoryid,
              recordtype: postDetail.recordtype,
              description: postDetail.description,
              classification: postDetail.classification,
              comments: postDetail.comments,
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

    // fetch("http://localhost:3004/records")
    //   .then(response => {
    //     return response.json();
    //   })
    //   .then(json => (this.pendingRecords = json));
  }

  getEditRecord(record: IRecord) {
    this.record.id = record.id;
    this.record.function = record.function;
    this.record.recordcategoryid = record.recordcategoryid;
    this.record.recordtype = record.recordtype;
    this.record.description = record.description;
    this.record.classification = record.classification;
    this.record.comments = record.comments;
  }

  //update common records: PATCH
  async updateCommonRecord() {
    const baseUrl = "http://localhost:3004/commonrecords";

    await fetch(`${baseUrl}/${this.record.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        function: this.record.function,
        recordcategoryid: this.record.recordcategoryid,
        recordtype: this.record.recordtype,
        description: this.record.description,
        classification: this.record.classification,
        comments: this.record.comments
      })
    });

    fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.CommonRecords = json))
      .then(() => console.log('updated'))
  }

  handleChange = (e: any) => {
    const { id, value, name } = e.target;
    this.record[id] = value;
    this.record[name] = value;
  };

  changeArchival = (e: any) => {
    const { value } = e.target;
    this.record.classification = value;
  };
}

decorate(_RecordStore, {
  // pendingRecords: observable,
  // fetchCommonRecords: action,
  // showCommonRecords: computed,
  // fetchPendings: action,
  handleChange: action,
  getEditRecord: action,
  addCommonRecord: action,
  approveSelectedRecords: action,
  updateCommonRecord: action,
  changeArchival: action
});

export const RecordStore = new _RecordStore();
