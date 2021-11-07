import { getStorage, StorageError, uploadBytesResumable } from "@firebase/storage";
import { getDownloadURL, ref } from "firebase/storage";
import { ProjectCreateDto } from "../Dtos/ProjectCreateDto.dto";
import { ProjectRoute } from "../enums/ApiRoutes";
import { UiStore } from "../stores/UiStore";
import { UserStore } from "../stores/UserStore";

export class ProjectCreationService {
    constructor(userStore: UserStore, uiStore: UiStore) {
        this._userStore = userStore;
        this._uiStore = uiStore;
    }
    private readonly storage = getStorage();
    private _userStore: UserStore;
    private _uiStore: UiStore;

    /**
     * Uploads image to Firebase storage.
     * @param image 
     * @param progress 
     * @param onSuccess 
     * @param onError 
     */
    uploadImage = async (image: File, progress?: (progress: number) => void, onSuccess?: (downloadUrl: string) => void, onError?: (error: StorageError) => void) => {
        if (this._userStore.user) {
            const storageRef = ref(this.storage, `projects/${this._userStore.user.id}/${Date.now() + image.name}`);
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
        let data = new FormData();
        projectDto.files?.forEach((file) => {
            if (file) {
                data.append("files", file as Blob, file.name);
            }
        })

        data.append("name", projectDto.name);
        data.append("projectItems", JSON.stringify(projectDto.projectItems));
        if (projectDto.flairId) {
            data.append("flairId", projectDto.flairId.toString());
        }

        return await fetch(ProjectRoute.CreateProject, { // Your POST endpoint
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("user-jwt")}`
            },
            body: data // This is your file object
        }).then(async (res) => {
            if (!res.ok) {
                const reader = res.body?.getReader();
                // Read the data
                let decoder = new TextDecoder("utf-8"); //Text decoder
                let chunks: string[] = []; // array of strings that make up the chunks sent
                while (true) {
                    const r = await reader?.read();
                    //If we're done the request, exit the loop
                    if (r?.done) {
                        break;
                    }
                    //We need this check for typescript
                    if (r?.value !== undefined) {
                        //Decode the chunks as we go and save as strings in the chunks array
                        chunks.push(decoder.decode(r.value, { stream: true }));
                    }
                }

                // Concatenate to string and parse for JSON
                const resultJson = JSON.parse(chunks.join(""));
                if (res.status === 401) {
                    this._userStore.isSignedIn = false;
                    localStorage.removeItem("user-jwt");
                    return Promise.reject({ status: resultJson.status, message: resultJson.message, httpCodeStatus: res.status })
                }

                return Promise.reject(
                    { status: resultJson.status, message: resultJson.message, httpCodeStatus: res.status }
                );
            }
            return res.json();
        })
    }
}