import { observable, decorate, action, computed } from "mobx";

/*
!TODO: DOUBLE CHECK PATCH METHOD
*/

export interface IDepartmentStore {
  fetchAllRecords: () => void;
  fetchAll: () => void;
  updateEditID: any;
  selectedDepartment: string;
  deleteID: string;
  deleteRecord: () => void;
  updateRecord: () => void;
  _allRecords: Array<any>;
  allRecords: Array<any>
  allDepartments: Array<any>;
  isLoading: boolean;
  editrecord: IPostDetail;
  handleSelected: (edpt: string) => void;
  handleChange: (e: any) => void;
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

  async fetchAllRecords() {
    this.isLoading = false;
    await fetch("http://localhost:3004/records")
      .then(response => {
        return response.json();
      })
      .then(json => (this._allRecords = json));
  }

  get allRecords():Array<any> {
    return this._allRecords
  }

  async deleteRecord() {
    const baseUrl = "http://localhost:3004/records";
    let options = { method: "DELETE" };
    return fetch(`${baseUrl}/${this.deleteID}`, options).then(response =>
      response.json()
    );
  }

  handleChange = (e: any) => {
    const { id, value, name } = e.target;
    // this.allRecords.find((r) => r.id === this.editrecord.id)[name] = value
    this.editrecord[name] = value
    // console.log(this.editrecord[name])
    // console.log(this.editrecord.id)
    // console.log(record[name])
    // console.log(this.allRecords.find((r) => r.id == this.editrecord.id))
  };

  updateEditID(id: string) {
    this.editrecord.id = id
  }

  //PATCH request
  async updateRecord() {
    this.allRecords.find((r) => r.id === this.editrecord.id).recordtype = this.editrecord.recordtype

    const baseUrl = "http://localhost:3004/records";
    await fetch(`${baseUrl}/${this.editrecord.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recordtype: this.allRecords.find((r) => r.id === this.editrecord.id).recordtype,
        // recordtype: this.allRecords[0].recordtype,
        function: this.editrecord.function,
        recordcategoryid: this.editrecord.recordcategoryid,
        description: this.editrecord.description,
        notes: this.editrecord.notes,
        archival: this.editrecord.archival
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
  allRecords: computed
});

export const DepartmentStore = new _DepartmentStore();
