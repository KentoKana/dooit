import { UserStore } from "../stores/UserStore";

export class AppInit {
    constructor(userStore: UserStore) {
        this._userStore = userStore;
    }
    private _userStore: UserStore;

    init() {
        this.getPersistedUser();
    }

    private getPersistedUser() {
        const token = localStorage.getItem("user-jwt")
        if (token) {
            this._userStore.userToken = token?.replace(/['"]+/g, '') ?? null;
            this._userStore.isSignedIn = true;
        }
    }
}