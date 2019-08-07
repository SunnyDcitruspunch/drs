import { observable, decorate, action, computed } from "mobx";


export interface IDepartmentStore {
  fetchAllRecords: () => void;
  fetchAll: () => void;
  updateEditID: any;
  selectedDepartment: string;
  deleteID: string;
  deleteRecord: () => void;
  updateRecord: () => void;
  _allRecords: Array<IPostDetail>;
  allRecords: Array<any>
  allDepartments: Array<any>;
  isLoading: boolean;
  editrecord: IPostDetail;
  handleSelected: (edpt: string) => void;
  handleChange: (e: any) => void;
  filterRecords: (e: any) => void
  _filteredRecords: Array<any>
}

export type IPostDetail = {
  id: string;
  code?:string | any
  department: string;
  recordtype: string;
  function: string;
  recordcategoryid: string;
  description: string;
  notes: string;
  archival: string;
  status: string;
};

class _DepartmentStore implements IDepartmentStore {
  selectedDepartment = "";
  allDepartments = [];
  _allRecords = [];
  isLoading = false;
  deleteID = "";
  _filteredRecords =[]

  editrecord = {
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

  handleSelected(dept: string) {
    this.selectedDepartment = dept;
  }

  fetchAll = () => {
    this.isLoading = false;
    fetch("http://localhost:3004/departments")
      .then(response => {
        return response.json();
      })
      .then(json => (this.allDepartments = json));
  };

  async fetchAllRecords () {
    this.isLoading = false;
    await fetch("http://localhost:3004/records")
      .then(response => {
        return response.json();
      })
      .then(json => (this._allRecords = json))
      .then(json => (this._filteredRecords = json))
  }

  filterRecords = (e: any) => {
    const { value } = e.target
    const filterfunction = value
    // console.log(this._filteredRecords)
    // if(filterfunction !== ""){
    //   for (let i = 0; i < this._allRecords.length; i++){
    //      if(this._allRecords[i] !== filterfunction)
    //   }
      // this._filteredRecords = this.allRecords.find((r) => r.function === filterfunction)
      // console.log(this._filteredRecords)
    //}
  }

  get allRecords ():Array<any> {
    return this._allRecords
  }

  handleChange = (e: any) => {
    const { id, value, name } = e.target;
    this.editrecord[name] = value
  };

  updateEditID(postDetail: IPostDetail) {
    this.editrecord.id = postDetail.id
    this.editrecord.recordtype = postDetail.recordtype
    this.editrecord.function = postDetail.function
    this.editrecord.recordcategoryid = postDetail.recordcategoryid
    this.editrecord.description = postDetail.description
    this.editrecord.notes = postDetail.notes
    this.editrecord.archival = postDetail.archival
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
    this.allRecords.find((r) => r.id === this.editrecord.id).recordtype = this.editrecord.recordtype
    this.allRecords.find((r) => r.id === this.editrecord.id).function = this.editrecord.function
    this.allRecords.find((r) => r.id === this.editrecord.id).recordcategoryid = this.editrecord.recordcategoryid
    this.allRecords.find((r) => r.id === this.editrecord.id).description = this.editrecord.description
    this.allRecords.find((r) => r.id === this.editrecord.id).notes = this.editrecord.notes
    this.allRecords.find((r) => r.id === this.editrecord.id).archival = this.editrecord.archival

    const baseUrl = "http://localhost:3004/records";
    await fetch(`${baseUrl}/${this.editrecord.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recordtype: this.allRecords.find((r) => r.id === this.editrecord.id).recordtype,
        function: this.allRecords.find((r) => r.id === this.editrecord.id).function,
        recordcategoryid: this.allRecords.find((r) => r.id === this.editrecord.id).recordcategoryid,
        description: this.allRecords.find((r) => r.id === this.editrecord.id).description,
        notes: this.allRecords.find((r) => r.id === this.editrecord.id).notes,
        archival: this.allRecords.find((r) => r.id === this.editrecord.id).archival
      })
    })
  }
}

decorate(_DepartmentStore, {
  selectedDepartment: observable,
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
  allRecords: computed,
  filterRecords: action,
  _filteredRecords: observable
});

export const DepartmentStore = new _DepartmentStore();
