import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "@firebase/auth";
import { UserEditDto } from "../Dtos/UserEditDto.dto";
import { UserRoute } from "../enums/ApiRoutes";
import { auth } from "../firebase";
import { UiStore } from "../stores/UiStore";
import { UserStore } from "../stores/UserStore";

export class UserService {
    constructor(userStore: UserStore, uiStore: UiStore) {
        this._uiStore = uiStore;
        this._userStore = userStore;
    }

    private _uiStore: UiStore;
    private _userStore: UserStore;

    updateUserProfile = async (userEditDto: UserEditDto) => {
        return await this._uiStore.apiRequest<UserEditDto>(UserRoute.UpdateUserProfile, {
            method: "PATCH",
            bodyData: userEditDto
        }).then(() => {
            const { firstName, lastName, email } = userEditDto;
            this._userStore.user = {
                ...this._userStore.user,
                firstName,
                lastName,
                email
            }
        }).then(() => {
            auth.onAuthStateChanged(async (user) => {
                user?.getIdToken().then((token) => {
                    if (token) {
                        localStorage.setItem("user-jwt", token);
                        this._userStore.userToken = token;
                    }
                })
            })
        })
    }

    updateUserPassword = async (oldPassword: string, newPassword: string) => {

        if (auth.currentUser) {
            return await reauthenticateWithCredential(auth.currentUser, EmailAuthProvider.credential(auth.currentUser.email!, oldPassword))
                .then((userCred) => {
                    return updatePassword(userCred.user, newPassword)
                })
        }
    }
}