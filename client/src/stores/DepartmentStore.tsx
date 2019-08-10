import { observable, decorate, action, computed } from "mobx";


export interface IDepartmentStore {
  fetchAllRecords: () => void;
  fetchAll: () => void;
  updateEditID: any;
  selectedDepartment: string;
  selectedCommonRecords: Array<IRecord>
  deleteID: string;
  deleteRecord: () => void;
  updateRecord: () => void;
  _allRecords: Array<IRecord>;
  allRecords: Array<any>
  allDepartments: Array<any>;
  isLoading: boolean;
  editrecord: IRecord;
  handleSelected: (edpt: string) => void;
  handleChange: (e: any) => void;
  handleSelectedCommonRecords: (dept: string) => void
  CommonRecords: IRecord[]
}

export type IRecord = {
  id?: string;
  code?: string;
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
  selectedDepartment = "";
  selectedCommonRecords = []
  allDepartments = [];
  _allRecords = [];
  isLoading = false;
  deleteID = "";
  CommonRecords = []

  editrecord: IRecord = {
    id: "",
    department: "",
    recordtype: "",
    function: "",
    recordcategoryid: "",
    description: "",
    comments: "",
    classification: "",
    status: ""
  };

  handleSelected(dept: string) {
    this.selectedDepartment = dept;
  }

  async fetchCommonRecords() {
    await fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.CommonRecords = json))
  }

  handleSelectedCommonRecords(dept: string) {
    this.selectedCommonRecords = this._allRecords.filter((r:IRecord) => r.department === dept && r.recordcategoryid === 'common')
    // console.log(this.selectedCommonRecords)
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
  }

  get allRecords ():Array<any> {
    return this._allRecords
  }

  handleChange = (e: any) => {
    const { value, name } = e.target;
    this.editrecord[name] = value
  };

  updateEditID(postDetail: IRecord) {
    this.editrecord.id = postDetail.id
    this.editrecord.recordtype = postDetail.recordtype
    this.editrecord.function = postDetail.function
    this.editrecord.recordcategoryid = postDetail.recordcategoryid
    this.editrecord.description = postDetail.description
    this.editrecord.comments = postDetail.comments
    this.editrecord.classification = postDetail.classification
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
    this.allRecords.find((r) => r.id === this.editrecord.id).comments = this.editrecord.comments
    this.allRecords.find((r) => r.id === this.editrecord.id).classification = this.editrecord.classification

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
        comments: this.allRecords.find((r) => r.id === this.editrecord.id).comments,
        classification: this.allRecords.find((r) => r.id === this.editrecord.id).classification
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
