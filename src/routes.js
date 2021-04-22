import Buttons from "views/Components/Buttons.js";
import Calendar from "views/Calendar/Calendar.js";
import Charts from "views/Charts/Charts.js";
import Dashboard from "views/Dashboard/Dashboard.js";
import Playing from "views/Playing/Playing.js";
import Envelops from "views/Envelops/Envelops.js";
import ErrorPage from "views/Pages/ErrorPage.js";
import ExtendedForms from "views/Forms/ExtendedForms.js";
import ExtendedTables from "views/Tables/ExtendedTables.js";
import FullScreenMap from "views/Maps/FullScreenMap.js";
import GoogleMaps from "views/Maps/GoogleMaps.js";
import GridSystem from "views/Components/GridSystem.js";
import Icons from "views/Components/Icons.js";
import LockScreenPage from "views/Pages/LockScreenPage.js";
import LoginPage from "views/Pages/LoginPage.js";
import Notifications from "views/Components/Notifications.js";
import Panels from "views/Components/Panels.js";
import PricingPage from "views/Pages/PricingPage.js";
import RTLSupport from "views/Pages/RTLSupport.js";
import ReactTables from "views/Tables/ReactTables.js";
import RegularForms from "views/Forms/RegularForms.js";
import RegularTables from "views/Tables/RegularTables.js";
import SweetAlert from "views/Components/SweetAlert.js";
import TimelinePage from "views/Pages/Timeline.js";
import Typography from "views/Components/Typography.js";
import UserProfile from "views/Pages/UserProfile.js";
import ValidationForms from "views/Forms/ValidationForms.js";
import VectorMap from "views/Maps/VectorMap.js";
import Widgets from "views/Widgets/Widgets.js";
import Wizard from "views/Forms/Wizard.js";
import Users from 'views/Users/Users.js';
import User from 'views/Users/User.js';
import Rewards from 'views/Rewards/Rewards.js';
import Recharges from 'views/Recharges/Recharges.js';
import Withdrawals from 'views/Withdrawals/Withdrawals.js';
import Complaints from 'views/Complaints/Complaints.js';

import Notification from "views/Notification/Notification.js";
import Employee from "views/Employee/Employee.js";
import Countries from "views/Region/Countries.js";
import Regions from "views/Region/Regions.js";
import Categories from "views/Category/Categories.js";
import Customer from "views/Customer/Customer.js";
import SubCategories from "views/Category/SubCategories.js";
import Support from "views/Support/Support.js";
// @material-ui/icons
import CardGiftcard from  "@material-ui/icons/CardGiftcard";
import LiveHelp from  "@material-ui/icons/LiveHelp";
import Apps from "@material-ui/icons/Apps";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DateRange from "@material-ui/icons/DateRange";
import GridOn from "@material-ui/icons/GridOn";
import Image from "@material-ui/icons/Image";
import Place from "@material-ui/icons/Place";
import Airplay from "@material-ui/icons/Airplay";
import People from "@material-ui/icons/People";
import AccountBalance from "@material-ui/icons/AccountBalance";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Timeline from "@material-ui/icons/Timeline";
import WidgetsIcon from "@material-ui/icons/Widgets";
import Group from "@material-ui/icons/Group";
import ContactSupport from "@material-ui/icons/ContactSupport";
import NotificationImportant from "@material-ui/icons/NotificationImportant";
var dashRoutes = [
  // {
  //   path: "/employee",
  //   name: "Employee",
  //   rtlName: "Employee",
  //   icon: Group,
  //   component: Employee,
  //   layout: "/admin"
  // },
  // {
  //   path: "/country",
  //   name: "Countries",
  //   rtlName: "Countries",
  //   icon: Public,
  //   component: Countries,
  //   layout: "/admin"
  // },
  // {
  //   path: "/regions",
  //   name: "Regions",
  //   rtlName: "Regions",
  //   icon: Map,
  //   component: Regions,
  //   layout: "/admin"
  // },
  // {
  //   path: "/category",
  //   name: "Categories",
  //   rtlName: "Categories",
  //   icon: Category,
  //   component: Categories,
  //   layout: "/admin"
  // },
  // {
  //   path: "/sub_category",
  //   name: "Sub Categories",
  //   rtlName: "Sub Categories",
  //   icon: Class,
  //   component: SubCategories,
  //   layout: "/admin"
  // },
  // {
  //   path: "/customer",
  //   name: "Customer",
  //   rtlName: "Customer",
  //   icon: Business,
  //   component: Customer,
  //   layout: "/admin"
  // },
  // {
  //   path: "/notification",
  //   name: "Notification",
  //   rtlName: "Notification",
  //   icon: NotificationImportant,
  //   component: Notification,
  //   layout: "/admin"
  // },
  // {
  //   path: "/support",
  //   name: "Support",
  //   rtlName: "Support",
  //   icon: ContactSupport,
  //   component: Support,
  //   layout: "/admin"
  // },


  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "Dashboard",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/playing",
    name: "Playing",
    rtlName: "Playing",
    icon: Airplay,
    component: Playing,
    layout: "/admin"
  },
  {
    path: "/users",
    name: "Users",
    rtlName: "Users",
    icon: People,
    component: Users,
    layout: "/admin"
  },
  {
    path: "/user/:id",
    name: "User",
    rtlName: "User",
    icon: AccountCircle,
    component: User,
    layout: "/admin"
  },
  {
    path: "/rewards",
    name: "Rewards",
    rtlName: "Rewards",
    icon: CardGiftcard,
    component: Rewards,
    layout: "/admin"
  },
  {
    path: "/envelopes",
    name: "Red Envelopes",
    rtlName: "Red Envelopes",
    icon: CardGiftcard,
    component: Envelops,
    layout: "/admin"
  },
  {
    path: "/complaints",
    name: "Complaints & Suggestions",
    rtlName: "Complaints & Suggestions",
    icon: LiveHelp,
    component: Complaints,
    layout: "/admin"
  },
  {
    path: "/recharges",
    name: "Recharges",
    rtlName: "Recharges",
    icon: AccountBalance,
    component: Recharges,
    layout: "/admin"
  },
  {
    path: "/withdrawals",
    name: "Withdrawals",
    rtlName: "Withdrawals",
    icon: AccountBalance,
    component: Withdrawals,
    layout: "/admin"
  },
  {
    collapse: true,
    name: "Pages",
    rtlName: "صفحات",
    icon: Image,
    state: "pageCollapse",
    views: [     
      {
        path: "/login-page",
        name: "Login",
        rtlName: "هعذاتسجيل الدخول",
        mini: "L",
        rtlMini: "هعذا",
        component: LoginPage,
        layout: "/auth"
      },
      // {
      //   path: "/register-page",
      //   name: "Register Page",
      //   rtlName: "تسجيل",
      //   mini: "R",
      //   rtlMini: "صع",
      //   component: RegisterPage,
      //   layout: "/auth"
      // },
      
    ]
  }
];
export default dashRoutes;
