import { observable, decorate, action } from "mobx";

class DepartmentStore {
  selectedDepartment = "";
  allDepartments = [];
  isLoading = false;
  deleteID = "";

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

  // !TODO: pass parameter to delete a record
  async deleteRecord() {
    const baseUrl = "http://localhost:3004/departments";
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
