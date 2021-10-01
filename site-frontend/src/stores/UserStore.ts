import { makeAutoObservable, runInAction } from "mobx";

export class UserStore {
    constructor() {
        makeAutoObservable(this)
    }
    private _userToken: string | null = null;
    private _isSignedIn: boolean = false;

    get userToken() {
        return this._userToken;
    }
    set userToken(newUserToken: string | null) {
        runInAction(() => {
            this._userToken = newUserToken;
        })
    }

    get isSignedIn() {
        return this._isSignedIn;
    }
    set isSignedIn(signInStatus: boolean) {
        runInAction(() => {
            this._isSignedIn = signInStatus;
        })
    }
}