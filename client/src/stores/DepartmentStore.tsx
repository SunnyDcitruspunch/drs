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
    editnotes: ""
  };

  handleSelected(dept: string) {
    this.selectedDepartment = dept;
    console.log(this.selectedDepartment);
  }

    fetchAll = () => {
    this.isLoading = false;
    fetch("http://localhost:3004/departments")
      .then(response => {
        return response.json();
      })
      .then(json => (this.allDepartments = json))
  }

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
    // const { id, value } = e.target
    // const id: { [id: string]: string | number } = e.target;
    const id = e.target.id;
    const value = e.target.value;
    this.editrecord[id] = value;
    console.log(this.editrecord.editrecordtype);
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

  //PATCH request
  async updateRecord() {
    console.log(this.editRecordid);
    const baseUrl = "http://localhost:3004/records";
    await fetch(`${baseUrl}/${this.editRecordid}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recordtype: this.editrecord.editrecordtype,
        department: this.editDepartment,
        function: this.editrecord.editfunction,
        recordcategoryid: this.editrecord.editrecordcategoryid,
        description: this.editrecord.editdescription,
        notes: this.editrecord.editnotes
      })
    })
      .then(res => res.json())
      .then(res => console.log(res));
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

// const DepartmentStore = new _DepartmentStore()
export const DepartmentStore = new _DepartmentStore();
