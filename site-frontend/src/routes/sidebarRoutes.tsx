import { LocalRoutes } from "../enums/LocalRoutes";
import { AiTwotoneSetting, AiFillAppstore } from "react-icons/ai";

export const sidebarRoutes = [
  {
    url: LocalRoutes.Dashboard,
    label: "Dashboard",
    icon: <AiFillAppstore />,
  },
  {
    url: LocalRoutes.UserSettings,
    label: "User Settings",
    icon: <AiTwotoneSetting />,
  },
];
