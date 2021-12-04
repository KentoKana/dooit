import { makeAutoObservable, runInAction } from "mobx";
import { UserGetDto } from "../Dtos/user/UserGetDto.dto";
import { auth } from "../firebase";

export class UserStore {
    constructor() {
        makeAutoObservable(this)
        auth.onAuthStateChanged(async (user) => {
            const retrievedToken = await user?.getIdToken();
            if (retrievedToken) {
                localStorage.setItem("user-jwt", retrievedToken);
                this.isSignedIn = true
                console.log("token reset from rootstore");
            } else {
                this.isSignedIn = false;
                localStorage.removeItem("user-jwt");
            }
        });
    }
    private _isSignedIn: boolean = false;
    private _user: UserGetDto | null = null;

    public reset() {
        runInAction(() => {
            this._isSignedIn = false;
            this._user = null;
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