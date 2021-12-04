import { useQuery } from "react-query";
import { ProjectGetOneDto } from "../../Dtos/project/ProjectGetOneDto";
import { ProjectRoute } from "../../enums/ApiRoutes";
import { UseStores } from "../../stores/StoreContexts";

export const useGetProjectById = (projectId: number) => {
    const { uiStore } = UseStores();

    return useQuery("project", async () => {
        return await uiStore.apiRequest<ProjectGetOneDto>(`${ProjectRoute.GetProjectById}/${projectId}`)
            .then((data) => {
                return data
            })
    });
}