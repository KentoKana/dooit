import { UserStore } from "./UserStore";
import React from "react";
import { UiStore } from "./UiStore";

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
    }
}

export const StoresContext = React.createContext<IRootStore>(new RootStore());

export const UseStores = () => React.useContext(StoresContext);