import { observable, decorate, action, computed, runInAction } from "mobx";
import { IDepartment } from "./RecordStore";

export interface IDepartmentStore {
  fetchAllRecords: () => void;
  fetchCommonRecords: () => void;
  fetchAll: () => void;
  updateEditID: any;
  selectedDepartment: IDepartment;
  selectedCommonRecords: Array<IRecord>;
  deleteID: string;
  deleteRecord: () => void;
  updateRecord: () => void;
  _allRecords: Array<IRecord>;
  allRecords: Array<any>;
  allDepartments: Array<any>;
  isLoading: boolean;
  editrecord: IRecord;
  handleSelected: (edpt: IDepartment) => void;
  handleChange: (e: any) => void;
  CommonRecords: IRecord[];
}

export type IRecord = {
  id?: string;
  code: string;
  department: string;
  recordtype: string;
  function: string;
  recordcategoryid: string;
  description: string;
  comments: string;
  classification: string;
  status: string;
};

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
  isLoading = false;
  deleteID = "";
  CommonRecords = [];

  editrecord: IRecord = {
    id: "",
    department: "",
    recordtype: "",
    function: "",
    recordcategoryid: "",
    description: "",
    comments: "",
    classification: "",
    status: "",
    code: ""
  };

  //select a department
  handleSelected(dept: IDepartment) {
    this.selectedDepartment = dept
  }

  //fetch all common records
  async fetchCommonRecords() {
    await fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.CommonRecords = json));
  }

  fetchAll = () => {
    this.isLoading = false;
    fetch("http://localhost:3004/departments")
      .then(response => {
        return response.json();
      })
      .then(json => (this.allDepartments = json));
  };

  async fetchAllRecords() {
    this.isLoading = false;
    await fetch("http://localhost:3004/records")
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
    //  = records
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
  async updateRecord() {
    this.allRecords.find(
      r => r.id === this.editrecord.id
    ).recordtype = this.editrecord.recordtype;
    this.allRecords.find(
      r => r.id === this.editrecord.id
    ).function = this.editrecord.function;
    this.allRecords.find(
      r => r.id === this.editrecord.id
    ).recordcategoryid = this.editrecord.recordcategoryid;
    this.allRecords.find(
      r => r.id === this.editrecord.id
    ).description = this.editrecord.description;
    this.allRecords.find(
      r => r.id === this.editrecord.id
    ).comments = this.editrecord.comments;
    this.allRecords.find(
      r => r.id === this.editrecord.id
    ).classification = this.editrecord.classification;

    const baseUrl = "http://localhost:3004/records";
    const res = await fetch(`${baseUrl}/${this.editrecord.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recordtype: this.allRecords.find(r => r.id === this.editrecord.id)
          .recordtype,
        function: this.allRecords.find(r => r.id === this.editrecord.id)
          .function,
        recordcategoryid: this.allRecords.find(r => r.id === this.editrecord.id)
          .recordcategoryid,
        description: this.allRecords.find(r => r.id === this.editrecord.id)
          .description,
        comments: this.allRecords.find(r => r.id === this.editrecord.id)
          .comments,
        classification: this.allRecords.find(r => r.id === this.editrecord.id)
          .classification
      })
    });
    const newRecord = await res.json() 
    this.setRecord(newRecord)
  }
}

decorate(_DepartmentStore, {
  selectedDepartment: observable,
  fetchCommonRecords: action,
  CommonRecords: observable,
  editrecord: observable,
  allDepartments: observable,
  isLoading: observable,
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
