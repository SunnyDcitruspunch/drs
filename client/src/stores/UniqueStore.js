import { observable, action, decorate } from "mobx";

class UniqueStore {    
        recordType= ''
        proposedFunction= ''
        proposedCategory= ''
        proposedRetention= ''
        Comment= ''
        functionsDropdown = []
        //do we need repository options for users?  

    handleChange = e => {
        const {id, value} = e.target  
        // const id = e.target.id
        // const value = e.target.value       
        console.log(value)
        this.uniqueRecords[id] = value
    }

    async fetchFunctions(){
      const response = 
        await fetch('http://localhost:3004/functions')
          .then(response => {
            return response.json()
          }).then(json => this.functionsDropdown = json)

    }

  }

  decorate(UniqueStore, {
    recordType: observable,
    proposedFunction: observable,
    proposedCategory: observable,
    proposedRetention: observable,
    Comment: observable,
    functionsDropdown: observable,
    handleChange: action,
    fetchFunctions: action
})


  export default new UniqueStore()
