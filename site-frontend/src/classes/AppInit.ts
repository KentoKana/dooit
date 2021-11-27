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
        await this.getPersistedUser()?.then(() => {
            onLoad(true);
        });
    }

    private async getPersistedUser() {
        const token = localStorage.getItem("user-jwt")
        if (token) {
            this._userStore.isSignedIn = true;
            const data = await this._uiStore
                .apiRequest<UserGetDto>(AuthRoute.GetUser, {
                    method: "GET",
                });
            return this._userStore.user = data;
        }
        return Promise.resolve();
    }
}