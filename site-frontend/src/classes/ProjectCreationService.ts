import { getStorage, StorageError, uploadBytesResumable } from "@firebase/storage";
import { getDownloadURL, ref } from "firebase/storage";
import { UiStore } from "../stores/UiStore";
import { UserStore } from "../stores/UserStore";

export class ProjectCreationService {
    constructor(userStore: UserStore, uiStore: UiStore) {
        this.userStore = userStore;
        this.uiStore = uiStore;
    }
    private readonly storage = getStorage();
    private userStore: UserStore;
    private uiStore: UiStore;

    /**
     * Uploads image to Firebase storage.
     * @param image 
     * @param progress 
     * @param onSuccess 
     * @param onError 
     */
    uploadImage = async (image: File, progress?: (progress: number) => void, onSuccess?: (downloadUrl: string) => void, onError?: (error: StorageError) => void) => {
        if (this.userStore.user) {
            const storageRef = ref(this.storage, `projects/${this.userStore.user.id}/${image.name}`);
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
}