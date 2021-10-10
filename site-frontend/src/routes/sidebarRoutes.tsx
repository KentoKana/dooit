import { LocalRoutes } from "../enums/LocalRoutes";
import {
  AiTwotoneSetting,
  AiFillAppstore,
  // AiOutlineEdit,
  AiOutlineFolderOpen,
} from "react-icons/ai";

export const sidebarRoutes = [
  {
    url: LocalRoutes.Dashboard,
    label: "Dashboard",
    icon: <AiFillAppstore />,
  },
  {
    url: LocalRoutes.Portfolio,
    label: "My Portfolio",
    icon: <AiOutlineFolderOpen />,
  },
  {
    url: LocalRoutes.UserSettings,
    label: "User Settings",
    icon: <AiTwotoneSetting />,
  },
];
