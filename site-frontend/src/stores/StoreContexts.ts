import { UserStore } from "./UserStore";
import React from "react";

export interface IRootStore {
    userStore: UserStore;
}

class RootStore implements IRootStore {

    userStore: UserStore;

    constructor() {
        this.userStore = new UserStore();
    }
}

export const StoresContext = React.createContext<IRootStore>(new RootStore());

export const UseStores = () => React.useContext(StoresContext);