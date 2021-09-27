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
        const currUser = localStorage.getItem("user");
        if (currUser) {
            this.userStore.user = JSON.parse(currUser);
            auth.onAuthStateChanged((user) => {
                if (user && JSON.stringify(user) === currUser) {
                    this.userStore.user = user;
                    localStorage.setItem("user", JSON.stringify(user));
                }
            });
        }

    }
}