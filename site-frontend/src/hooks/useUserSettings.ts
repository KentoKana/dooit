import { useQuery } from "react-query";
import { UserProfileViewDto } from "../Dtos/UserProfileViewDto.dto";
import { UserRoute } from "../enums/ApiRoutes";
import { UseStores } from "../stores/StoreContexts";

export const useUserSettingsData = () => {
    const { uiStore, userStore } = UseStores();

    return useQuery("userSettings", async () => {
        return uiStore.apiRequest<UserProfileViewDto>(UserRoute.GetUserProfile)
            .then((data) => {
                return data
            })
    }, { enabled: !!userStore.userToken });
}