import { makeAutoObservable, runInAction } from "mobx";
import { UserGetDto } from "../Dtos/UserGetDto.dto";

export class UserStore {
    constructor() {
        makeAutoObservable(this)
    }
    private _userToken: string | null = null;
    private _isSignedIn: boolean = false;
    private _user: UserGetDto | null = null;

    public reset() {
        runInAction(() => {
            this.userToken = null;
            this._isSignedIn = false;
            this._user = null;
        })
    }

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

    get user() {
        return this._user;
    }
    set user(newUser: UserGetDto | null) {
        runInAction(() => {
            this._user = newUser;
        })
    }
}