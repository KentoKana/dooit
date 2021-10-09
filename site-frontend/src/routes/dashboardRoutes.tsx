import { LocalRoutes } from "../enums/LocalRoutes";
import { AiTwotoneSetting, AiFillAppstore } from "react-icons/ai";

export const dashboardRoutes = [
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
