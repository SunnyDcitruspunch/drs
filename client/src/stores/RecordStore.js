import { observable, action, decorate } from "mobx";

class RecordStore {
  allRecords = [];

  async fetchRecords() {
    await fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.allRecords = json));
  }
}

decorate(RecordStore, {
  fetchRecords: action,
  allRecords: observable
});

export default new RecordStore();
