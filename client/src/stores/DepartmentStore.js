import { observable, decorate, action } from "mobx";

class DepartmentStore {
  selectedDepartment = "";
  allDepartments = [];
  allRecords = []
  isLoading = false;
  deleteID = "";
  editRecord = ""

  handleSelected = e => {
    const { value } = e.target;
    this.selectedDepartment = value;
    //console.log(this.selectedDepartment);
  };

  async fetchAll() {
    this.isLoading = false;
    await fetch("http://localhost:3004/departments")
      .then(response => {
        return response.json();
      })
      .then(json => (this.allDepartments = json));
  }

  async fetchAllRecords() {
    this.isLoading = false;
    await fetch("http://localhost:3004/records")
      .then(response => {
        return response.json();
      })
      .then(json => (this.allRecords = json));
  }

  //delete from departments array
  async deleteRecord() {
    const baseUrl = "http://localhost:3004/records";
    let options = { method: "DELETE" };
    return fetch(`${baseUrl}/${this.deleteID}`, options).then(response =>
      response.json()
    );
  }
}

decorate(DepartmentStore, {
  selectedDepartment: observable,
  allDepartments: observable,
  isLoading: observable,
  handleSelected: action,
  fetchAll: action,
  deleteRecord: action
});

export default new DepartmentStore();
