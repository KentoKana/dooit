import { useQuery } from "react-query";
import { ProjectGetDto } from "../Dtos/ProjectGetDto.dto";
import { ProjectRoute } from "../enums/ApiRoutes";
import { UseStores } from "../stores/StoreContexts";
import { isNullOrUndefined } from "../utils";

export const useUserProjects = () => {
    const { uiStore, userStore } = UseStores();

    return useQuery("loggedInUserProjects", async () => {
        return await uiStore.apiRequest<ProjectGetDto[]>(ProjectRoute.GetLoggedInUserProject)
            .then((data) => {
                return data
            })
    }, { enabled: !isNullOrUndefined(userStore.userToken) });
}