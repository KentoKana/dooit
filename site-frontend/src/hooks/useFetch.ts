import { UseStores } from "../stores/StoreContexts";

export const useFetch = async <T>(url: string): Promise<T> => {
    const { userStore } = UseStores();
    return await fetch(url, {
        headers: new Headers({
            "content-type": "application/json",
            Authorization: `Bearer ${userStore?.userToken}`,
        }),
    }).then((res) => {
        if (res.status === 401) {
            localStorage.removeItem("user-jwt");
            userStore.userToken = null;
        }

        return res.json();
    })
}