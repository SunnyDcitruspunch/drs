import { observable, action, decorate } from "mobx";
import { IUser, UserStore, DepartmentStore } from './index'
import { IDepartment } from "./DepartmentStore";

export interface IAuthStore {
  username: string;
  password: string;
  getUser: IUser 
  clearInputs: () => void;
  setUsername: (e: any) => void;
  setPassword: (e: any) => void;
  logout: () => void
  logIn: () => void
  admin: boolean
  user: boolean
}

class _AuthStore implements IAuthStore {
  username = "";
  password = "";
  admin = false;
  user = false;
  getUser = {username:"", password:"", department:"", admin:false, user: true}

  clearInputs = () => {
    this.username = "";
    this.password = "";
  };

  setUsername = (e: any) => {
    const { value } = e.target              
    this.username = value;
  };

  setPassword(e: any) {
    const { value } = e.target
    this.password = value;
  }

  logIn(){
    const iusername = !!UserStore.allUsers.find((u: IUser) => u.username === this.username && u.password === this.password)
    console.log(!!UserStore.allUsers.find((u: IUser) => u.username === this.username && u.password === this.password))


    if (iusername){
        this.user = true
        const userIndex = UserStore.allUsers.findIndex((num: IUser) => num.username === this.username)
        UserStore.currentUser = UserStore.allUsers[userIndex]
        if(UserStore.currentUser.admin) {
          console.log(UserStore.currentUser.admin)
            this.admin = true
        } else {          
            // console.log(DepartmentStore.allDepartments)
            this.admin = false
            DepartmentStore.selectedDepartment.department = UserStore.currentUser.department
            const deptIndex = DepartmentStore.allDepartments.findIndex((d: IDepartment) => d.department === DepartmentStore.selectedDepartment.department)
            const userDepartment: IDepartment = DepartmentStore.allDepartments[deptIndex]
            DepartmentStore.selectedDepartment = userDepartment
        }
    } else {
        this.user = false
        this.admin = false
    }
  }

  logout(){
    this.user = false
    this.admin = false
  }
}

decorate(_AuthStore, {
  username: observable,
  password: observable,
  clearInputs: action,
  setUsername: action,
  setPassword: action,
  logIn: action,
  logout: action,
  admin: observable,
  user: observable
});

export const AuthStore = new _AuthStore();
