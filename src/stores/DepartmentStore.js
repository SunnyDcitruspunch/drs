import { observable, decorate, action } from 'mobx'

class DepartmentStore {
    selectedDepartment = ""

    handleSelected = e => {
        const {id, value} = e.target
        this.selectedDepartment = value
        console.log(this.selectedDepartment)
    }
}

decorate(DepartmentStore, {
    selectedDepartment: observable,
    handleSelected: action
})

export default new DepartmentStore()