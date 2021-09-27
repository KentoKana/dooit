import { auth } from "../firebase";
import { UserStore } from "../stores/UserStore";

export class AppConfig {
    constructor(userStore: UserStore) {
        this.userStore = userStore;
    }
    userStore: UserStore;

    init() {
        this.getPersistedUser();
    }

    private getPersistedUser() {
        this.userStore.userToken = localStorage.getItem("user-jwt");
        auth.onAuthStateChanged((user) => {
            user?.getIdToken().then((token) => {
                this.userStore.userToken = token;
                localStorage.setItem("user-jwt", token);
            })
        });
    }
}