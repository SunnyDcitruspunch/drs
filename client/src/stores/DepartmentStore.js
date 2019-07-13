import { observable, decorate, action } from "mobx";

class DepartmentStore {
  selectedDepartment = "";
  allDepartments = [];
  isLoading = false;

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

  find(dept) {
    return this.allDepartments
      .slice()
      .filter(d => d.department === parseInt(dept, 10))[0];
  }

  // !TODO: pass parameter to delete a record
  deleteRecord() {
    console.log("deleted");
    /*
      function deleteData(item, url) {
  return fetch(url + '/' + item, {
    method: 'delete'
  })
  .then(response => response.json());
}
    */
  }
}

decorate(DepartmentStore, {
  selectedDepartment: observable,
  allDepartments: observable,
  isLoading: observable,
  handleSelected: action,
  fetchAll: action,
  find: action
});

export default new DepartmentStore();
