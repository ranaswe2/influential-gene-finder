
import Dashboard from "views/Dashboard.js";
import UserPage from "views/UserPage.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import TableList from "views/TableList.js";
import Maps from "views/Maps.js";
import Logout from "account/Logout.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "design_app",
    component: <Dashboard />,
    layout: "/user",
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: "users_single-02",
    component: <UserPage />,
    layout: "/user",
  },
  {
    pro: true,
    path: "/logout",
    name: "Logout",
    icon: "arrows-1_minimal-right",
    component: <Logout />,
    layout: "/user",
  },
];
export default dashRoutes;
