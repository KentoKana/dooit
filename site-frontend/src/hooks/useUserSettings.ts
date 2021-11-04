import { useQuery } from "react-query";
import { UserProfileViewDto } from "../Dtos/UserProfileViewDto.dto";
import { UserRoute } from "../enums/ApiRoutes";
import { UseStores } from "../stores/StoreContexts";
import { isNullOrUndefined } from "../utils";

export const useUserSettingsData = () => {
    const { uiStore } = UseStores();

    return useQuery("userSettings", async () => {
        return await uiStore.apiRequest<UserProfileViewDto>(UserRoute.GetUserProfile)
            .then((data) => {
                return data
            })
    }, { enabled: !isNullOrUndefined(localStorage.getItem("user-jwt")) });
}