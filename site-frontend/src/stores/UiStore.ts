import { makeAutoObservable } from "mobx";
import { UserStore } from "./UserStore"

export interface IApiRequestOptions<TData> {
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    bodyData?: TData;
}

export class UiStore {
    constructor(userStore: UserStore) {
        makeAutoObservable(this)
        this.userStore = userStore;
    }

    readonly userStore: UserStore;

    async apiRequest<TData, TResult = TData>(url: string, options: IApiRequestOptions<TData> = {}): Promise<TResult> {
        options = {
            method: "GET",
            ...options
        };
        let headers: Headers = new Headers();
        if (options.bodyData) {
            headers.set("Accept", "application/json")
        }
        headers.set("Content-Type", "application/json")
        headers.set("Authorization", `Bearer ${this.userStore.userToken}`)
        const res = await fetch(url, {
            method: options.method,
            headers: headers,
            body: (options.bodyData ? JSON.stringify(options.bodyData) : undefined)
        });
        if (res.status === 401) {
            localStorage.removeItem("user-jwt");
        }
        return await res.json();
    }
}