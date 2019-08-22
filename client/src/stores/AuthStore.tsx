import { observable, action, decorate } from "mobx";
import { IUser, UserStore } from './index'

export interface IAuthStore {
  username: string;
  password: string;
  getUser: IUser 
  clearInputs: () => void;
  setUsername: (e: any) => void;
  setPassword: (e: any) => void;
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
    console.log(this.username)
  };

  setPassword(e: any) {
    const { value } = e.target
    this.password = value;
    console.log(this.password)
  }

  logIn(){
    const iusername = !!UserStore.allUsers.find((u: IUser) => u.username === this.username && u.password === this.password)

    if (iusername){
        this.user = true
        const userIndex = UserStore.allUsers.findIndex((num: IUser) => num.username === this.username)
        UserStore.currentUser = UserStore.allUsers[userIndex]
        if(UserStore.currentUser.admin === true) {
            this.admin = true
        } else {
            this.admin = false
        }
    } else {
        this.user = false
        this.admin = false
    }
  }
}

decorate(_AuthStore, {
  username: observable,
  password: observable,
  clearInputs: action,
  setUsername: action,
  setPassword: action,
  logIn: action,
  admin: observable,
  user: observable
});

export const AuthStore = new _AuthStore();
