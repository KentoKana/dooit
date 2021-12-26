import { ComponentType } from "react";
import { LocalRoutes } from "../enums/LocalRoutes";
import { Portfolio } from "../pages/Portfolio";
import { Dashboard } from "../pages/Dashboard";
import { ForgotPassword } from "../pages/ForgotPassword";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";
import { UserSettings } from "../pages/UserSettings";
import { ProjectSinglePage as ProjectSingle } from "../pages/ProjectSingle";
interface IRoutes {
  isPrivate: boolean;
  component: JSX.Element;
  path: string;
  authenticationPath?: string;
}
export const mainRoutes: IRoutes[] = [
  {
    isPrivate: true,
    component: <Dashboard showSidebar={true} />,
    path: LocalRoutes.Dashboard,
    authenticationPath: LocalRoutes.Login,
  },
  {
    isPrivate: false,
    component: <Home showSidebar={false} />,
    path: LocalRoutes.Home,
  },
  {
    isPrivate: false,
    component: <Login showSidebar={true} />,
    path: LocalRoutes.Login,
  },
  {
    isPrivate: false,
    component: <SignUp showSidebar={false} />,
    path: LocalRoutes.SignUp,
  },
  {
    isPrivate: false,
    component: <ForgotPassword showSidebar={false} />,
    path: LocalRoutes.ForgotPassword,
  },
  {
    isPrivate: true,
    component: <UserSettings showSidebar={true} />,
    path: LocalRoutes.UserSettings,
  },
  {
    isPrivate: false,
    component: <Portfolio showSidebar={true} />,
    path: LocalRoutes.Portfolio,
  },
  {
    isPrivate: false,
    component: <ProjectSingle showSidebar={false} />,
    path: LocalRoutes.ProjectSingle,
  },
];
