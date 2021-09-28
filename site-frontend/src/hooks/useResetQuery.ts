import { useQueryClient } from "react-query";

export const useResetQuery = () => {
    const queryClient = useQueryClient();
    const reset = () => {
        queryClient.setQueryData("dashboard", () => null);
        queryClient.removeQueries("dashboard");
    }
    return reset;
}