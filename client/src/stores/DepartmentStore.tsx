import { observable, decorate, action } from "mobx";

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
  allRecords: Array<any>;
  allDepartments: Array<any>;
  isLoading: boolean;
  editrecord: IPostDetail;
  handleSelected: (edpt: string) => void;
  handleChange: (e: any) => void;
}

export type IPostDetail = {
  id: string;
  code?:string;
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
  allRecords = [];
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
      .then(json => (this.allRecords = json));
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
    this.editrecord[name] = value;
  };

  updateEditID(postDetail: IPostDetail) {
    this.editrecord.id = postDetail.id;
    this.editrecord.department = postDetail.department;
    this.editrecord.recordtype = postDetail.recordtype;
    this.editrecord.function = postDetail.function;
    this.editrecord.description = postDetail.description;
    this.editrecord.recordcategoryid = postDetail.recordcategoryid;
    this.editrecord.notes = postDetail.notes;
    this.editrecord.archival = postDetail.archival;
  }

  //PATCH request
  async updateRecord() {
    const baseUrl = "http://localhost:3004/records";
    await fetch(`${baseUrl}/${this.editrecord.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recordtype: this.editrecord.recordtype,
        function: this.editrecord.function,
        recordcategoryid: this.editrecord.recordcategoryid,
        description: this.editrecord.description,
        notes: this.editrecord.notes,
        archival: this.editrecord.archival
      })
    }).then(res => res.json());
  }
}

decorate(_DepartmentStore, {
  selectedDepartment: observable,
  editrecord: observable,
  allDepartments: observable,
  isLoading: observable,
  handleChange: action,
  handleSelected: action,
  fetchAll: action,
  deleteRecord: action,
  updateRecord: action,
  updateEditID: action,
  fetchAllRecords: action
});

export const DepartmentStore = new _DepartmentStore();
