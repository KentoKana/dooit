import { makeAutoObservable } from "mobx";
import { auth } from "../firebase";
import { UserStore } from "./UserStore"
import jwt_decode from "jwt-decode";

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

    async apiRequest<TData, TResult = TData>(url: string, options: IApiRequestOptions<TData> = {}, isPublicRoute: boolean | undefined = false): Promise<TResult> {
        var decodedHeader = jwt_decode<{
            iss: string,
            aud: string,
            auth_time: number,
            user_id: string,
            sub: string,
            iat: number,
            exp: number,
            email: string,
            email_verified: boolean,
            firebase: {
                identities: {
                    email: string[]
                },
                sign_in_provider: string
            }
        }>(localStorage.getItem("user-jwt") ?? "");
        let headers: Headers = new Headers();
        headers.set("Content-Type", "application/json")
        if (options.bodyData) {
            headers.set("Accept", "*/*")
        }
        options = {
            method: "GET",
            ...options
        };

        const tryFetch = async () => {
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
                        console.log("fobidden");
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

        if (decodedHeader.exp * 1000 < Date.now()) {
            return auth.currentUser?.getIdToken().then((retrievedToken) => {
                localStorage.setItem("user-jwt", retrievedToken);
                this.userStore.isSignedIn = true;
                headers.set("Authorization", `Bearer ${retrievedToken}`)
            }).then(() => {
                return tryFetch();
            });
        } else {
            if (localStorage.getItem("user-jwt")) {
                headers.set("Authorization", `Bearer ${localStorage.getItem("user-jwt")}`)
            }
            return tryFetch();
        }
    }
}