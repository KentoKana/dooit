import { UserCreateDto } from "../Dtos/UserCreateDto.dto";
import { UserGetCreatedDto } from "../Dtos/UserGetCreatedDto.dto";
import { UserGetLoggedIn } from "../Dtos/UserGetLoggedInDto.dto";
import { UserLoginByEmailDto } from "../Dtos/UserLoginByEmailDto.dto";
import { AuthRoute } from "../enums/ApiRoutes";
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
        return this.uiStore
            .apiRequest(AuthRoute.SignOut, {
                method: "POST",
            })
            .then(() => {
                localStorage.removeItem("user-jwt");
                this.userStore.reset();
            })
    }
    async resetPassword(email: { email: string }) {
        return this.uiStore
            .apiRequest(AuthRoute.ResetPassword, {
                method: "POST",
                bodyData: email
            })
    }
}

class AuthByEmailPassword {
    static async login(userStore: UserStore, uiStore: UiStore, loginCred: UserLoginByEmailDto) {
        return uiStore
            .apiRequest<UserLoginByEmailDto, UserGetLoggedIn>(AuthRoute.Login, {
                method: "POST",
                bodyData: loginCred,
            })
            .then((data) => {
                localStorage.setItem("user-jwt", JSON.stringify(data.token));
                userStore.userToken = data.token;
                userStore.user = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                }
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
                userStore.user = {
                    firstName: data.firstName,
                    lastName: data.firstName,
                    email: data.firstName,
                }
                localStorage.setItem("user-jwt", data.token);
                return data;
            })
    }
}
