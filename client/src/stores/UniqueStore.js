import { observable, action, decorate } from "mobx";

class UniqueStore {    
        recordType= ''
        proposedFunction= ''
        proposedCategory= ''
        proposedRetention= ''
        Comment= ''
        functionsDropdown = []
        categoryDropdown = []
        //do we need repository options for users?  

    handleChange = e => {
        const {id, value} = e.target  
        // const id = e.target.id
        // const value = e.target.value       
        //console.log(value)
        this.uniqueRecords[id] = value
    }

    async fetchFunctions(){

        await fetch('http://localhost:3004/functions')
          .then(response => {
            return response.json()
          }).then(json => this.functionsDropdown = json)
    }

    async fetchCategory(){

      await fetch('http://localhost:3004/category')
        .then(response => {
          return response.json()
        }).then(json => this.categoryDropdown = json)
  }

    async submitRecords(data){
      console.log('submitted')
      const headers = new Headers()
      headers.append('Content-Type', 'application/json')

      const options = {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      }

      const request = new Request('http://localhost:3004/functions', options)
      //const response = await response.status

      console.log('hey')
      console.log(request)
      //console.log(response)
    }
  }

  decorate(UniqueStore, {
    recordType: observable,
    proposedFunction: observable,
    proposedCategory: observable,
    proposedRetention: observable,
    Comment: observable,
    functionsDropdown: observable,
    categoryDropdown: observable,
    handleChange: action,
    fetchFunctions: action,
    submitRecords: action
})


  export default new UniqueStore()
