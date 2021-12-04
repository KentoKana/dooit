import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword } from "@firebase/auth";
import { UserEditDto } from "../Dtos/user/UserEditDto.dto";
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
        return updateEmail(auth.currentUser!, userEditDto.email).then(async () => {
            auth.onAuthStateChanged(async (user) => {
                user?.getIdToken().then(async (token) => {
                    if (token) {
                        localStorage.setItem("user-jwt", token);
                        return await this._uiStore.apiRequest<UserEditDto>(UserRoute.UpdateUserProfile, {
                            method: "PATCH",
                            bodyData: userEditDto
                        }).then((data) => {
                            const { displayName, email } = userEditDto;
                            this._userStore.user = {
                                ...this._userStore.user,
                                id: this._userStore.user?.id!,
                                displayName,
                                email
                            }
                            return data;
                        })
                    }
                })
            })
            return userEditDto;
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