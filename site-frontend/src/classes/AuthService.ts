import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword } from "@firebase/auth";
import { runInAction } from "mobx";
import { auth } from "../firebase";
import { UserStore } from "../stores/UserStore";

export class AuthService {
    constructor(userStore: UserStore) {
        this.userStore = userStore;
    }
    private userStore: UserStore;

    /**
     * Function to login with Email and Password. UserStore user is set once successfully logged in.
     * @param email 
     * @param password 
     * @returns 
     */
    async loginWithEmailAndPassword(email: string, password: string) {
        return AuthByEmailPassword.login(this.userStore, email, password)
    }
    async createUserWithEmailAndPassword(email: string, password: string) {
        return AuthByEmailPassword.createUser(this.userStore, email, password)
    }


    /**
     * Signs out from user session. Removes "user" from local storage.
     */
    async signOut() {
        runInAction(() => {
            this.userStore.user = null;
            localStorage.removeItem("user");
            localStorage.removeItem("user-jwt");
            auth.signOut();
        })
    }
}

class AuthByEmailPassword {
    static async login(userStore: UserStore, email: string, password: string) {
        return setPersistence(auth, browserLocalPersistence).then(async () => {
            return signInWithEmailAndPassword(auth, email, password).then((userCred) => {
                localStorage.setItem("user", JSON.stringify(userCred.user));
                userStore.user = userCred.user;
                auth.currentUser?.getIdToken(true).then((token) => {
                    localStorage.setItem("user-jwt", JSON.stringify(token));
                })
            })
        });
    }

    static async createUser(userStore: UserStore, email: string, password: string) {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCred) => {
                localStorage.setItem("user", JSON.stringify(userCred.user));
                userStore.user = userCred.user;
            })
    }
}
