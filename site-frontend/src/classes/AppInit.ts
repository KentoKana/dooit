import { auth } from "../firebase";
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
        this._userStore.userToken = localStorage.getItem("user-jwt");
        auth.onAuthStateChanged((user) => {
            user?.getIdToken().then((token) => {
                this._userStore.userToken = token;
                localStorage.setItem("user-jwt", token);
            })
        });
    }
}