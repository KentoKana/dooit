import { User } from "@firebase/auth";
import { makeAutoObservable, runInAction } from "mobx";

export class UserStore {
    constructor() {
        makeAutoObservable(this)
    }
    private _user: User | null = null;

    get user() {
        return this._user;
    }
    set user(newUser: User | null) {
        runInAction(() => {
            this._user = newUser;
        })
    }
}