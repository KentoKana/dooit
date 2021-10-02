import { createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword } from "@firebase/auth";
import { runInAction } from "mobx";
import { UserLoginByEmailDto } from "../Dtos/UserLoginByEmailDto.dto";
import { AuthRoute } from "../enums/ApiRoutes";
import { auth } from "../firebase";
import { UiStore } from "../stores/UiStore";
import { UserStore } from "../stores/UserStore";

export class AuthService {
    constructor(userStore: UserStore, uiStore: UiStore) {
        this.userStore = userStore;
        this.uiStore = uiStore;
    }
    private userStore: UserStore;
    private uiStore: UiStore;

    /**
     * Function to login with Email and Password. UserStore user is set once successfully logged in.
     * @param email 
     * @param password 
     * @returns 
     */
    async loginWithEmailAndPassword(loginCred: UserLoginByEmailDto) {
        return AuthByEmailPassword.login(this.userStore, this.uiStore, loginCred)
    }
    async createUserWithEmailAndPassword(email: string, password: string) {
        return AuthByEmailPassword.createUser(this.userStore, email, password)
    }

    /**
     * Signs out from user session. Removes "user" from local storage.
     */
    async signOut() {
        runInAction(() => {
            this.userStore.userToken = null;
            localStorage.removeItem("user-jwt");
            auth.signOut();
        })
    }
}

class AuthByEmailPassword {
    static async login(userStore: UserStore, uiStore: UiStore, loginCred: UserLoginByEmailDto) {
        return uiStore
            .apiRequest<UserLoginByEmailDto, { token: string }>(AuthRoute.Login, {
                method: "POST",
                bodyData: loginCred,
            })
            .then((data) => {
                localStorage.setItem("user-jwt", JSON.stringify(data.token));
                userStore.userToken = data.token;
                return data;
            })
        // setPersistence(auth, browserLocalPersistence).then(async () => {
        //     return signInWithEmailAndPassword(auth, email, password).then((userCred) => {
        //         auth.currentUser?.getIdToken(true).then((token) => {
        //             userStore.userToken = token;
        //             localStorage.setItem("user-jwt", JSON.stringify(token));
        //         })
        //     })
        // });
    }

    static async createUser(userStore: UserStore, email: string, password: string) {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCred) => {
                userCred.user.getIdToken(true).then((token) => {
                    userStore.userToken = token;
                    localStorage.setItem("user-jwt", token);
                })
                return userCred;
            })
    }
}
