import { observable, action, decorate } from "mobx";

class UniqueStore {
    uniqueRecords = {
        recordType: '',
        proposedFunction: '', 
        proposedCategory: '', 
        proposedRetention: '',
        Comment: ''
        //do we need repository options for users?  
    }

    handleChange = e => {
        const {id, value} = e.target  
        // const id = e.target.id
        // const value = e.target.value       
        console.log(value)
        this.uniqueRecords[id] = value
    }
  }

  decorate(UniqueStore, {
    recordType: observable,
    proposedFunction: observable,
    proposedCategory: observable,
    proposedRetention: observable,
    Comment: observable,
    handleChange: action,
    reset: action,
    addRecord: action
})


  export default UniqueStore
