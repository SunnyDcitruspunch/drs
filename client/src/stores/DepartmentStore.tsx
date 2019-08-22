import { observable, decorate, action, computed, runInAction } from "mobx";
import { IRecord } from "./RecordStore";

export interface IDepartmentStore {
  fetchAllRecords: () => void;
  fetchAll: () => void;
  updateEditID: any;
  selectedDepartment: IDepartment;
  selectedCommonRecords: Array<IRecord>;
  deleteID: string;
  deleteRecord: () => void;
  updateRecord: (c: string[]) => void;
  _allRecords: Array<IRecord>;
  allRecords: Array<any>;
  allDepartments: Array<any>;
  editrecord: IRecord;
  handleSelected: (edpt: IDepartment) => void;
  handleChange: (e: any) => void;
  editcomment: string
}


export interface IDepartment {
  id: string;
  department: string;
  departmentnumber: string;
  commoncodes: string[];
}

class _DepartmentStore implements IDepartmentStore {
  selectedDepartment: IDepartment = {
    id: "",
    department: "",
    departmentnumber:"",
    commoncodes:[]
  };
  selectedCommonRecords: IRecord[] = [];
  allDepartments = [];
  _allRecords: IRecord[] = [];
  deleteID = "";
  editcomment = ""

  editrecord: IRecord = {
    id: "",
    department: "",
    recordtype: "",
    function: "",
    recordcategoryid: "",
    description: "",
    comments: "",
    classification: [],
    status: "",
    code: ""
  };

  // select a department
  handleSelected(dept: IDepartment) {
    this.selectedDepartment = dept
  }

  fetchAll = () => {
    fetch("http://localhost:3004/departments")
      .then(response => {
        return response.json();
      })
      .then(json => (this.allDepartments = json));
  };

 fetchAllRecords = () => {
  fetch("http://localhost:3004/records")
      .then(response => {
        return response.json();
      })
      .then(json => (this._allRecords = json));
  }

  get allRecords(): Array<any> {
    return this._allRecords;
  }

  setAllRecords(records: IRecord[]) {
    runInAction(() => 
    this._allRecords = records
    )
  }

  setRecord(record: IRecord) {
    const i = this._allRecords.findIndex((r)=> r.id = record.id)
    runInAction(() => 
    this._allRecords[i] = record
    )
  }

  handleChange = (e: any) => {
    const { value, name } = e.target;
    this.editrecord[name] = value;
    this.allRecords.find(
      r => r.id === this.editrecord.id
    ).function = this.editrecord.function;
    this.allRecords.find(
      r => r.id === this.editrecord.id
    ).recordcategoryid = this.editrecord.recordcategoryid;
  };

  updateEditID(postDetail: IRecord) {
    this.editrecord = postDetail;
    this.editcomment = postDetail.comments
  }

  async deleteRecord() {
    const baseUrl = "http://localhost:3004/records";
    let options = { method: "DELETE" };
    await fetch(`${baseUrl}/${this.deleteID}`, options);

    await fetch("http://localhost:3004/records")
      .then(response => {
        return response.json();
      })
      .then(json => (this._allRecords = json));
  }

  //PATCH request
  async updateRecord(classification: string[]) {
    let status = "Approved"
    const i = this._allRecords.findIndex((r)=> r.id === this.editrecord.id)
    this.allRecords[i] = this.editrecord

    if (this.editrecord.comments !== this.editcomment) {
      status = "Pending"
    }

    const baseUrl = "http://localhost:3004/records";
    await fetch(`${baseUrl}/${this.editrecord.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recordtype: this._allRecords[i].recordtype,
        function: this._allRecords[i].function,
        recordcategoryid: this._allRecords[i].recordcategoryid,
        description: this.allRecords[i].description,
        comments: this.allRecords[i].comments,
        classification: classification,
        status: status
      })     
    });
    //Tylor's code: made new record => cause double record after edit
    // const newRecord = await res.json() 
    // this.setRecord(newRecord)
    this.editrecord = {
      id: "",
      department: "", 
      recordtype: "",
      function: "",
      recordcategoryid: "",
      description: "",
      comments: "",
      classification: [],
      status: "",
      code: ""
    };
  }
}

decorate(_DepartmentStore, {
  selectedDepartment: observable,
  editrecord: observable,
  allDepartments: observable,
  _allRecords: observable,
  handleChange: action,
  handleSelected: action,
  fetchAll: action,
  deleteRecord: action,
  updateRecord: action,
  updateEditID: action,
  fetchAllRecords: action,
  allRecords: computed
});

export const DepartmentStore = new _DepartmentStore();