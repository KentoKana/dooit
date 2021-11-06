import { UserStore } from "./UserStore";
import React from "react";
import { UiStore } from "./UiStore";
import { auth } from "../firebase";

export interface IRootStore {
    userStore: UserStore;
    uiStore: UiStore;
}

class RootStore implements IRootStore {

    userStore: UserStore;
    uiStore: UiStore;

    constructor() {
        this.userStore = new UserStore();
        this.uiStore = new UiStore(this.userStore);
        auth.onAuthStateChanged(async (user) => {
            const retrievedToken = await user?.getIdToken();
            if (retrievedToken) {
                localStorage.setItem("user-jwt", retrievedToken);
                this.userStore.isSignedIn = true
                console.log("token reset from rootstore");
            } else {
                this.userStore.isSignedIn = false;
                localStorage.removeItem("user-jwt");
            }
        });
    }
}

export const StoresContext = React.createContext<IRootStore>(new RootStore());

export const UseStores = () => React.useContext(StoresContext);