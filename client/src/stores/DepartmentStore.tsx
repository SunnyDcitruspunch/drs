import { observable, decorate, action, computed, runInAction } from "mobx";
import { IRecord } from "./index";

export interface IDepartmentStore {
  fetchAllRecords: () => void;
  fetchAll: () => void;
  updateEditID: (r: IRecord) => void;
  updateDeleteID: (r: IRecord) => void;
  selectedDepartment: IDepartment;
  selectedCommonRecords: Array<IRecord>;
  record: IRecord;
  deleteRecord: () => void;
  updateRecord: (c: string[]) => void;
  _allRecords: Array<IRecord>;
  allRecords: Array<IRecord>;
  allDepartments: Array<IDepartment>;
  handleSelected: (edpt: IDepartment) => void;
  handleChange: (e: any) => void;
  editcomment: string;
}

export interface IDepartment {
  id: string;
  department: string;
  departmentnumber?: string;
  commoncodes: string[];
}

class _DepartmentStore implements IDepartmentStore {
  selectedDepartment: IDepartment = {
    id: "",
    department: "",
    departmentnumber: "",
    commoncodes: []
  };
  selectedCommonRecords: IRecord[] = [];
  allDepartments: IDepartment[] = [];
  _allRecords: IRecord[] = [];
  record: IRecord = {
    id: "",
    department: "",
    recordtype: "",
    function: "",
    recordcategoryid: "",
    description: "",
    comments: "",
    classification: [],
    status: "",
    code: ""
  };
  editcomment = "";

  // select a department
  handleSelected(dept: IDepartment) {
    this.selectedDepartment = dept;
  }

  fetchAll = () => {
    fetch("http://localhost:3004/departments")
      .then(response => {
        return response.json();
      })
      .then(json => (this.allDepartments = json));
  };

  fetchAllRecords = () => {
    fetch("http://localhost:3004/records")
      .then(response => {
        return response.json();
      })
      .then(
        json =>
          (this._allRecords = json
            .slice()
            .sort((a: IRecord, b: IRecord) =>
              a.function < b.function ? -1 : 1
            ))
      );
  };

  get allRecords(): Array<any> {
    return this._allRecords;
  }

  setAllRecords(records: IRecord[]) {
    runInAction(() => (this._allRecords = records));
  }

  setRecord(record: IRecord) {
    const i = this._allRecords.findIndex(r => (r.id = record.id));
    runInAction(() => (this._allRecords[i] = record));
  }

  handleChange = (e: any) => {
    const { value, name } = e.target;
    this.record[name] = value;
    this.allRecords.find(
      r => r.id === this.record.id
    ).function = this.record.function;
    this.allRecords.find(
      r => r.id === this.record.id
    ).recordcategoryid = this.record.recordcategoryid;
  };

  updateEditID(postDetail: IRecord) {
    this.record = postDetail;
    this.editcomment = postDetail.comments;
  }

  updateDeleteID(r: IRecord) {
    this.record = r;
  }

  async deleteRecord() {
    const baseUrl = "http://localhost:3004/records";
    const options = { method: "DELETE" };
    await fetch(`${baseUrl}/${this.record.id}`, options);

    let deleteIndex: number = this.allDepartments.findIndex(
      (d: IDepartment) => d.department === this.record.department
    );
    //commoncodes array without the deleted one
    let updateCommoncodes: string[] = this.allDepartments[
      deleteIndex
    ].commoncodes.filter((c: string) => c !== this.record.code);

    let index = this.allDepartments.findIndex(
      (d: IDepartment) => d.department === this.record.department
    );
    let id: string = this.allDepartments[index].id;
    //patch commoncodes in departments array
    await fetch(`http://localhost:3004/departments/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        commoncodes: updateCommoncodes
      })
    }).then(res => {
      this.fetchAllRecords();
    });
  }

  //PATCH request
  async updateRecord(classification: string[]) {
    const i = this._allRecords.findIndex(r => r.id === this.record.id);
    this.allRecords[i] = this.record;

    if (this.record.recordtype === this.record.recordtype) {
      this.record.status = "Approved";
    } else {
      this.record.status = "Pending";
    }

    const baseUrl = "http://localhost:3004/records";
    await fetch(`${baseUrl}/${this.record.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recordtype: this._allRecords[i].recordtype,
        function: this._allRecords[i].function,
        recordcategoryid: this._allRecords[i].recordcategoryid,
        description: this.allRecords[i].description,
        comments: this.allRecords[i].comments,
        classification: classification,
        status: this.record.status
      })
    }).then(res => {
      DepartmentStore.fetchAllRecords();
    });

    //how to clear an object more effectively?
    this.record = {
      id: "",
      department: "",
      recordtype: "",
      function: "",
      recordcategoryid: "",
      description: "",
      comments: "",
      classification: [],
      status: "",
      code: ""
    };
  }
}

decorate(_DepartmentStore, {
  selectedDepartment: observable,
  record: observable,
  allDepartments: observable,
  _allRecords: observable,
  handleChange: action,
  handleSelected: action,
  fetchAll: action,
  deleteRecord: action,
  updateRecord: action,
  updateEditID: action,
  updateDeleteID: action,
  fetchAllRecords: action,
  allRecords: computed
});

export const DepartmentStore = new _DepartmentStore();
