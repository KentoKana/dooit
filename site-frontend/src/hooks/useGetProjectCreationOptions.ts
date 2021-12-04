import { useQuery } from "react-query";
import { ProjectCreateOptionsDto } from "../Dtos/project/ProjectCreateOptionsDto.dto";
import { ProjectRoute } from "../enums/ApiRoutes";
import { UseStores } from "../stores/StoreContexts";

export const useGetProjectCreationOptions = () => {
    const { uiStore, userStore } = UseStores();

    return useQuery("projectCreateOptions", async () => {
        return uiStore.apiRequest<ProjectCreateOptionsDto>(ProjectRoute.GetProjectCreateOptions)
            .then((data) => {
                return data
            })
    }, { enabled: userStore.isSignedIn });

}