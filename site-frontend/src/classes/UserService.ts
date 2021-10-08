import { UserEditDto } from "../Dtos/UserEditDto.dto";
import { UserRoute } from "../enums/ApiRoutes";
import { UiStore } from "../stores/UiStore";
import { UserStore } from "../stores/UserStore";

export class UserService {
    constructor(userStore: UserStore, uiStore: UiStore) {
        this._uiStore = uiStore;
        this._userStore = userStore;
    }

    private _uiStore: UiStore;
    private _userStore: UserStore;

    updateUser = async (userEditDto: UserEditDto) => {
        await this._uiStore.apiRequest<UserEditDto, { token: string }>(UserRoute.UpdateUser, {
            method: "PATCH",
            bodyData: userEditDto
        }).then(({ token }) => {
            const { firstName, lastName, email } = userEditDto;
            this._userStore.userToken = token;
            localStorage.setItem("user-jwt", token);
            this._userStore.user = {
                ...this._userStore.user,
                firstName,
                lastName,
                email
            }
        })
    }
}