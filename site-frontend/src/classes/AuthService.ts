import { AuthRoute, UserRoute } from "../enums/ApiRoutes";
import { auth } from "../firebase";
import { UiStore } from "../stores/UiStore";
import { UserStore } from "../stores/UserStore";
import { browserLocalPersistence, createUserWithEmailAndPassword, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword } from '@firebase/auth';
import { UserLoginByEmailDto } from "../Dtos/user/UserLoginByEmailDto.dto";
import { UserCreateDto } from "../Dtos/user/UserCreateDto.dto";
import { UserGetCreatedDto } from "../Dtos/user/UserGetCreatedDto.dto";
import { UserGetLoggedIn } from "../Dtos/user/UserGetLoggedInDto.dto";

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
        return auth.signOut()
            .then(() => {
                localStorage.removeItem("user-jwt");
                this.userStore.reset();
            })
    }

    async resetPassword(email: string) {
        return sendPasswordResetEmail(auth, email)
    }
}

class AuthByEmailPassword {
    static async login(userStore: UserStore, uiStore: UiStore, loginCred: UserLoginByEmailDto) {
        return setPersistence(auth, browserLocalPersistence).then(async () => {
            return signInWithEmailAndPassword(auth, loginCred.email, loginCred.password).then(async (userCred) => {
                return userCred?.user.getIdToken(true)
            })
        }).then(async (token) => {
            localStorage.setItem("user-jwt", token);
            return uiStore
                .apiRequest<UserLoginByEmailDto, UserGetLoggedIn>(AuthRoute.Login, {
                    method: "GET",
                })
                .then((data) => {
                    userStore.user = {
                        id: data.id,
                        username: data.username,
                        email: data.email,
                    };
                })
        })
    }

    static async createUser(userStore: UserStore, uiStore: UiStore, formData: UserCreateDto) {
        return await uiStore
            .apiRequest<{ username: string }, boolean>(UserRoute.CheckUsernameAvailability, {
                method: "POST",
                bodyData: {
                    username: formData.username
                },
            }).then(async (usernameIsAvailable) => {
                if (usernameIsAvailable) {
                    const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                    const token = await userCred.user.getIdToken();
                    localStorage.setItem("user-jwt", token);
                    formData.id = userCred.user.uid;
                    userStore.isSignedIn = true;
                    const data = await uiStore
                        .apiRequest<UserCreateDto, UserGetCreatedDto>(AuthRoute.Create, {
                            method: "POST",
                            bodyData: formData,
                        });
                    userStore.user = {
                        id: data.id,
                        username: data.username,
                        email: data.email,
                    };
                    return data;
                } else {
                    return Promise.reject({ status: 411, message: "This username is taken.", httpCodeStatus: 411 });
                }
            })
    }
}
