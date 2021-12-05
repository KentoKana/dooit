import { useQuery } from "react-query";
import { ProjectGetListForUserDto } from "../../Dtos/project/ProjectGetListForUserDto.dto";
import { ProjectRoute } from "../../enums/ApiRoutes";
import { UseStores } from "../../stores/StoreContexts";

export const useUserProjects = (userId: string) => {
    const { uiStore } = UseStores();

    return useQuery("allProjectsForUser", async () => {
        return await uiStore.apiRequest<ProjectGetListForUserDto>(`${ProjectRoute.GetAllProjectsForUser}/${userId}`)
            .then((data) => {
                return data
            })
    });
}