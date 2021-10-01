import { useQueryClient } from "react-query";
import { UseStores } from "../stores/StoreContexts";

export const useResetQuery = () => {
    const queryClient = useQueryClient();
    const { userStore } = UseStores();
    const reset = () => {
        userStore.userToken = null;
        localStorage.removeItem('user-jwt');
        queryClient.setQueryData("dashboard", () => null);
        queryClient.removeQueries("dashboard");
    }
    return reset;
}