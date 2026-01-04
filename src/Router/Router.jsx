// import React from "react";
// import { createBrowserRouter } from "react-router-dom";

// import RootLayout from "../Layout/RootLayout";
// import Register from "../Authentication/Register";
// import Login from "../Authentication/Login";
// import VerifyOtp from "../Authentication/VerifyOtp"; // ✅ ADD THIS
// import WelcomePage from "../Pages/WelcomePage";
// import EmergencyBloodSearch from "../Pages/EmergencyBloodSearch";
// import CustomBloodSearch from "../Pages/CustomBloodSearch";
// import Dashboard from "../Pages/Dashboard";
// import ChangePassword from "../Authentication/ChangePassword";
// import ForgotPassword from "../Authentication/ForgotPassword";
// import VerifyForgotOTP from "../Authentication/VerifyForgotOTP";
// import ResetPassword from "../Authentication/ResetPassword";
// import ChatList from "../Pages/ChatList";
// import ChatRoomPage from "../Pages/ChatRoomPage";
// import ChatRoom from "../Pages/ChatRoom";
// import EditProfile from "../Authentication/EditProfile";
// import ActivateAccount from "../Authentication/ActivateAccount";
// import DashboardLayout from "../Layout/Dashboard Layout/DashboardLayout";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     Component: RootLayout,
//     children: [

//       {
//         index: true,
//         element: <WelcomePage></WelcomePage>
//       },
//       {
//         path: "register",
//         element: <Register />,
//       },
//       {
//         path: "verify-otp", // ✅ OTP PAGE
//         element: <VerifyOtp />,
//       },
//       {
//         path: "login",
//         element: <Login />,
//       },

//       {
//         path: "/customSearch",
//         Component: CustomBloodSearch,
//       },
//       {
//         path: "/dashboard",
//         Component: Dashboard
//       },
//       {
//         path: "/change-password",
//         Component: ChangePassword
//       },
//       {
//         path : "/forgot-password",
//         Component: ForgotPassword
//       },
//       {
//         path: "/verify-forgot-otp",
//         Component: VerifyForgotOTP
//       },
//       {
//         path: "/reset-password",
//         Component: ResetPassword
//       },
//       {
//         path: "/activate-account",
//         Component: ActivateAccount
//       },
//       {
//         path: "/my-chats",
//         Component: ChatList
//       },
//       {
//         path: "chat/:roomId",
//         Component: ChatRoomPage // Use ChatRoomPage component
//       },
//       {
//         path: "profile-edit",
//         Component: EditProfile // Use ChatRoomPage component
//       },

//     ],
//   },
//   {
//     path: "/dashboardLayout",
//     Component: DashboardLayout,
//     children: [
//       {
//         index: true,
//         element: <Dashboard></Dashboard>
//       },
//        {
//         path: "/emergencyBlood",
//         Component: EmergencyBloodSearch
//       },
//     ]
//   }
// ]);

// export default router;

import React from "react";
import { createBrowserRouter } from "react-router-dom";

/* Layouts */
import RootLayout from "../Layout/RootLayout";
import DashboardLayout from "../Layout/Dashboard Layout/DashboardLayout";

/* Authentication */
import Register from "../Authentication/Register";
import Login from "../Authentication/Login";
import VerifyOtp from "../Authentication/VerifyOtp";
import ChangePassword from "../Authentication/ChangePassword";
import ForgotPassword from "../Authentication/ForgotPassword";
import VerifyForgotOTP from "../Authentication/VerifyForgotOTP";
import ResetPassword from "../Authentication/ResetPassword";
import ActivateAccount from "../Authentication/ActivateAccount";
import EditProfile from "../Authentication/EditProfile";

/* Pages */
import WelcomePage from "../Pages/WelcomePage";
import Dashboard from "../Pages/Dashboard";
import EmergencyBloodSearch from "../Pages/EmergencyBloodSearch";
import CustomBloodSearch from "../Pages/CustomBloodSearch";
import ChatList from "../Pages/ChatList";
import ChatRoomPage from "../Pages/ChatRoomPage";
import LiveMap from "../Pages/LiveMap";
import AboutUs from "../Pages/AboutUs";

const router = createBrowserRouter([
  /* ================= ROOT LAYOUT ================= */
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, element: <WelcomePage /> },

      /* Auth */
      { path: "register", element: <Register /> },
      { path: "verify-otp", element: <VerifyOtp /> },
      { path: "login", element: <Login /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-forgot-otp", element: <VerifyForgotOTP /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "activate-account", element: <ActivateAccount /> },
      {
        path: "emergencyBlood",
        element: <EmergencyBloodSearch />,
      },

      /* Chats (outside dashboard layout) */

      { path: "chat/:roomId", element: <ChatRoomPage /> },
      { path: "my-chats", element: <ChatList /> },
      {
        path: "live-map", element: <LiveMap></LiveMap>
      }
    ],
  },

  /* ================= DASHBOARD LAYOUT ================= */
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      /* Dashboard Home */
      {
        index: true,
        element: <Dashboard />,
      },

      /* Dashboard Pages */
      {
        path: "emergencyBlood",
        element: <EmergencyBloodSearch />,
      },
      {
        path: "customSearch",
        element: <CustomBloodSearch />,
      },
      {
        path: "profile",
        element: <EditProfile />,
      },
      { path: "my-chats", element: <ChatList /> },
      {
        path: "live-map", element: <LiveMap></LiveMap>
      },
      { path: "chat/:roomId", element: <ChatRoomPage /> },
      { path: "about-us", element: <AboutUs></AboutUs> },
      { path: "chat/:roomId", element: <ChatRoomPage /> },
    ],
  },
]);

export default router;
