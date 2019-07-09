import { observable, decorate, action } from 'mobx'

class DepartmentStore {
    selectedDepartment = ""
    allDepartments = []
    isLoading = false

    handleSelected = e => {
        const {value} = e.target
        this.selectedDepartment = value
        console.log(this.selectedDepartment)
    }

    async fetchAll() {
        this.isLoading = false;
        const response = 
            await fetch('http://localhost:3004/departments')
                .then(response => {
                    return response.json()
                }).then(json=>this.allDepartments=json)
    }    

    find(dept) {
        return (
            this.allDepartments.slice().filter(
                d => d.department === parseInt(dept, 10)
            )[0]
        )
    }
}

decorate(DepartmentStore, {
    selectedDepartment: observable,
    allDepartments: observable,
    isLoading: observable,
    handleSelected: action,
    fetchAll: action,
    find: action
})

export default new DepartmentStore()