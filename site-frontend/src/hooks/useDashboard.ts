import { useQuery } from "react-query";
import { AuthRoute } from "../enums/ApiRoutes";
import { UseStores } from "../stores/StoreContexts";

export const useDashboard = () => {
    const { uiStore, userStore } = UseStores();

    return useQuery("dashboard", async () => {
        return uiStore.apiRequest<any, any>(AuthRoute.GetUser)
            .then((data) => {
                return data
            })
    }, { enabled: !!userStore.userToken });
}