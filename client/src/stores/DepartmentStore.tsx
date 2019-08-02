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
  allRecords: any;
  allDepartments: Array<Object>;
  isLoading: boolean;
  editRecordid: string;
  editDepartment: string;
  editrecord: Object;
  handleSelected: (edpt: string) => void;
  handleChange: (e: any) => void;
  changeArchival: (e: any) => void;
}

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

  updateEditID(
    id: string,
    rdept: string,
    rtype: string,
    rfunction: string,
    rcategory: string,
    rdesc: string,
    rnotes: string
  ) {
    this.editRecordid = id;
    this.editDepartment = rdept;
    this.editrecord.editrecordtype = rtype;
    this.editrecord.editfunction = rfunction;
    this.editrecord.editdescription = rdesc;
    this.editrecord.editrecordcategoryid = rcategory;
    this.editrecord.editnotes = rnotes;
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
