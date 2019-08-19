import { observable, action, decorate } from 'mobx'

interface IAuthStore {
    username: string
    password: string
    clearInputs: () => void
    // logIn: (u: string, p: string) => void
    // admin: boolean
    // user: boolean
}

class _AuthStore implements IAuthStore {
    username = ""
    password = ""

    clearInputs = () => {
        this.username = ""
        this.password = ""
    }
}

decorate(_AuthStore, {
    username: observable,
    password: observable,
    clearInputs: action,
    // logIn: action
})

export const AuthStore = new _AuthStore()