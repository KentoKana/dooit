import { getStorage, StorageError, uploadBytesResumable } from "@firebase/storage";
import { getDownloadURL, ref } from "firebase/storage";
import { ProjectCreateDto } from "../Dtos/ProjectCreateDto.dto";
import { ProjectGetDto } from "../Dtos/ProjectGetDto.dto";
import { ProjectRoute } from "../enums/ApiRoutes";
import { UiStore } from "../stores/UiStore";
import { UserStore } from "../stores/UserStore";

export class ProjectCreationService {
    constructor(userStore: UserStore, uiStore: UiStore) {
        this._userSTore = userStore;
        this._uiStore = uiStore;
    }
    private readonly storage = getStorage();
    private _userSTore: UserStore;
    private _uiStore: UiStore;

    /**
     * Uploads image to Firebase storage.
     * @param image 
     * @param progress 
     * @param onSuccess 
     * @param onError 
     */
    uploadImage = async (image: File, progress?: (progress: number) => void, onSuccess?: (downloadUrl: string) => void, onError?: (error: StorageError) => void) => {
        if (this._userSTore.user) {
            const storageRef = ref(this.storage, `projects/${this._userSTore.user.id}/${Date.now() + image.name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);
            return uploadTask.on(
                "state_changed",
                (snapshot) => {
                    progress && progress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                },
                onError,
                async () => {
                    await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        onSuccess && onSuccess(downloadURL)
                    });
                }
            );
        }
    }

    createProject = async (projectDto: ProjectCreateDto) => {
        return await this._uiStore.apiRequest<ProjectCreateDto, ProjectGetDto>(ProjectRoute.CreateProject, {
            method: "POST",
            bodyData: projectDto
        }).then((data) => {
            return data;
        })
    }
}