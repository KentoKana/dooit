import { useQuery } from "react-query";
import { AuthRoute } from "../enums/ApiRoutes";
import { UseStores } from "../stores/StoreContexts";
import { useGET } from "./useAPIRequest";

export const useDashboard = () => {
    const { userStore } = UseStores();
    const fetch = useGET<any>(AuthRoute.GetUser)
    return useQuery("dashboard", async () => {
        return fetch.then((data) => {
            return data;
        })
    }, { enabled: !!userStore.userToken });
}