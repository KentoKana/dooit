import { UseStores } from "../stores/StoreContexts";

export const useGET = async <T>(url: string): Promise<T> => {
    const { userStore } = UseStores();
    return await fetch(url, {
        method: "GET",
        headers: new Headers({
            Accept: "application/json",
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

export const usePOST = async<B, D>(url: string, body: B): Promise<D> => {
    const { userStore } = UseStores();
    return await fetch(url, {
        method: "POST",
        headers: new Headers({
            Accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${userStore?.userToken}`,
        }),
        body: JSON.stringify(body)
    }).then((res) => {
        if (res.status === 401) {
            localStorage.removeItem("user-jwt");
            userStore.userToken = null;
        }
        return res.json();
    })
}