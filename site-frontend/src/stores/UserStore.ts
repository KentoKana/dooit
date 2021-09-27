import { makeAutoObservable, runInAction } from "mobx";

export class UserStore {
    constructor() {
        makeAutoObservable(this)
    }
    private _userToken: string | null = null;

    get userToken() {
        return this._userToken;
    }
    set userToken(newUserToken: string | null) {
        runInAction(() => {
            this._userToken = newUserToken;
        })
    }
}