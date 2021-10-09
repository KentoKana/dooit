import { UserGetDto } from "../Dtos/UserGetDto.dto";
import { AuthRoute } from "../enums/ApiRoutes";
import { UiStore } from "../stores/UiStore";
import { UserStore } from "../stores/UserStore";

export class AppInit {
    constructor(userStore: UserStore, uiStore: UiStore) {
        this._userStore = userStore;
        this._uiStore = uiStore;
    }
    private _userStore: UserStore;
    private _uiStore: UiStore;

    async init(onLoad: (loaded: boolean) => void) {
        await this.getPersistedUser();
        onLoad(true);
    }

    private getPersistedUser() {
        const token = localStorage.getItem("user-jwt")

        if (token) {
            this._userStore.userToken = token?.replace(/['"]+/g, '') ?? null;
            this._userStore.isSignedIn = true;
            return this._uiStore
                .apiRequest<UserGetDto>(AuthRoute.GetUser, {
                    method: "GET",
                })
                .then((data) => {
                    this._userStore.user = data;
                })
        }
    }
}