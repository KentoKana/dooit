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

        if (this.userStore.userToken) {
            headers.set("Authorization", `Bearer ${this.userStore.userToken}`)
        }
        return fetch(url, {
            method: options.method,
            headers: headers,
            body: (options.bodyData ? JSON.stringify(options.bodyData) : undefined)
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
                    localStorage.removeItem("user-jwt");
                    this.userStore.userToken = null;
                    this.userStore.isSignedIn = false;
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