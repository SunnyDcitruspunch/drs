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
  editRecordid: string;
  editDepartment: string;
  editrecord: Object;
  handleSelected: (edpt: string) => void;
  handleChange: (e: any) => void;
  changeArchival: (e: any) => void;
}

export type IPostDetail = {
  id: string;
  department: string;
  recordtype: string;
  function: string;
  recordcategoryid: string;
  description: string;
  notes: string;
  archival: string;
  status: string
};

class _DepartmentStore implements IDepartmentStore {
  selectedDepartment = "";
  allDepartments = [];
  allRecords = [];
  isLoading = false;
  deleteID = "";
  editRecordid = "";
  editDepartment = "";

  editrecord = {
    editfunction: "",
    editrecordtype: "",
    editdescription: "",
    editrecordcategoryid: "",
    editnotes: "",
    editarchival: ""
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
    const { id, value } = e.target;
    this.editrecord[id] = value;
  };

  updateEditID(postDetail: IPostDetail) {
    this.editRecordid = postDetail.id;
    this.editDepartment = postDetail.department;
    this.editrecord.editrecordtype = postDetail.recordtype;
    this.editrecord.editfunction = postDetail.function;
    this.editrecord.editdescription = postDetail.description;
    this.editrecord.editrecordcategoryid = postDetail.recordcategoryid;
    this.editrecord.editnotes = postDetail.notes;
    this.editrecord.editarchival = postDetail.archival;
  }

  changeArchival = (e: any) => {
    const { value } = e.target;
    this.editrecord.editarchival = value;
  };

  //PATCH request
  async updateRecord() {
    const baseUrl = "http://localhost:3004/records";
    await fetch(`${baseUrl}/${this.editRecordid}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recordtype: this.editrecord.editrecordtype,
        function: this.editrecord.editfunction,
        recordcategoryid: this.editrecord.editrecordcategoryid,
        description: this.editrecord.editdescription,
        notes: this.editrecord.editnotes,
        archival: this.editrecord.editarchival
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
  fetchAllRecords: action,
  changeArchival: action
});

export const DepartmentStore = new _DepartmentStore();
