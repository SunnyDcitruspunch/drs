import { observable, decorate, action } from "mobx";

export interface IUser {
    username: string
    password: string
    department: string
    admin: boolean
}

export interface IUserStore {
    allUsers: IUser[]
    fetchUsers: () => void
    currentUser: IUser
}

class _UserStore implements IUserStore {
    allUsers: IUser[] = [{username:"", password:"", department:"", admin:false}]
    currentUser: IUser = {username:"", password:"", department:"", admin:false};

  fetchUsers = () => {
    fetch("http://localhost:3004/users")
      .then(response => {
        return response.json();
      })
      .then(json => (this.allUsers = json));
  };
}

decorate(_UserStore, {
    allUsers: observable,
    fetchUsers: action,
    currentUser: observable
});

export const UserStore = new _UserStore()
