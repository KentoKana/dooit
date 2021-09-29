import { useQuery } from "react-query";
import { UseStores } from "../stores/StoreContexts";
import { useGET } from "./useAPIRequest";

export const useDashboard = () => {
    const { userStore } = UseStores();
    const fetch = useGET<any>("http://localhost:4000/")
    return useQuery("dashboard", async () => {
        return fetch.then((data) => {
            return data;
        })
    }, { enabled: !!userStore.userToken });
}