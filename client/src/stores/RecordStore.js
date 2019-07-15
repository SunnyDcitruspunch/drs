import { observable, action, decorate } from "mobx";

class RecordStore {
  allRecords = [];
  pendingRecords = []

  async fetchRecords() {
    await fetch("http://localhost:3004/commonrecords")
      .then(response => {
        return response.json();
      })
      .then(json => (this.allRecords = json));
  }

  async fetchPendings(){
    await fetch("http://localhost:3004/records")
    .then(response => {
      return response.json()
    })
    .then(json => (this.pendingRecords = json))
  }
}

decorate(RecordStore, {
  fetchRecords: action,
  fetchPendings: action,
  allRecords: observable,
  pendingRecords: observable
});

export default new RecordStore();
