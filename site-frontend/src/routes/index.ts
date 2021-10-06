import { ComponentType, ReactNode } from "react";
import { LocalRoutes } from "../enums/LocalRoutes";
import { Dashboard } from "../pages/Dashboard";
import { ForgotPassword } from "../pages/ForgotPassword";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";

interface IRoutes {
    isPrivate: boolean;
    component: ComponentType<any>;
    path: string;
    authenticationPath?: string;
}
export const routes: IRoutes[] = [
    {
        isPrivate: true,
        component: Dashboard,
        path: LocalRoutes.Dashboard,
        authenticationPath: LocalRoutes.Login
    },
    {
        isPrivate: false,
        component: Home,
        path: LocalRoutes.Home
    },
    {
        isPrivate: false,
        component: Login,
        path: LocalRoutes.Login
    },
    {
        isPrivate: false,
        component: SignUp,
        path: LocalRoutes.SignUp
    },
    {
        isPrivate: false,
        component: ForgotPassword,
        path: LocalRoutes.ForgotPassword
    },
];