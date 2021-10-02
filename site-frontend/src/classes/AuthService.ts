import { runInAction } from "mobx";
import { UserCreateDto } from "../Dtos/UserCreateDto.dto";
import { UserGetCreatedDto } from "../Dtos/UserGetCreatedDto.dto";
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
    async createUserWithEmailAndPassword(userToCreate: UserCreateDto) {
        return AuthByEmailPassword.createUser(this.userStore, this.uiStore, userToCreate)
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
    }

    static async createUser(userStore: UserStore, uiStore: UiStore, formData: UserCreateDto) {
        return uiStore
            .apiRequest<UserCreateDto, UserGetCreatedDto>(AuthRoute.Create, {
                method: "POST",
                bodyData: formData,
            })
            .then((data) => {
                userStore.userToken = data.token;
                localStorage.setItem("user-jwt", data.token);
                return data;
            })
        // .catch(() => {
        //     setLoadingState(LoadingState.Error);
        //     // Delete user from Firebase if API fails
        //     reset();
        //     auth.currentUser?.delete();
        // });
        // return createUserWithEmailAndPassword(auth, email, password)
        //     .then((userCred) => {
        //         userCred.user.getIdToken(true).then((token) => {
        //             userStore.userToken = token;
        //             localStorage.setItem("user-jwt", token);
        //         })
        //         return userCred;
        //     })
    }
}
