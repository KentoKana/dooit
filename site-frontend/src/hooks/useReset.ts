import { useQueryClient } from "react-query";
import { UseStores } from "../stores/StoreContexts";

/**
 * Hook to reset all data cached via React Query
 * @returns 
 */
export const useReset = () => {
    const queryClient = useQueryClient();
    const { userStore } = UseStores();
    const reset = () => {
        userStore.isSignedIn = false;
        localStorage.removeItem('user-jwt');
        queryClient.resetQueries()
    }
    return reset;
}