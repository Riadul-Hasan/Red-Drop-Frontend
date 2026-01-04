import React from "react";
import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "../Navbar/Navbar";

function RootLayout() {
  return (
    <div>
      {/* <div className=""><Navbar></Navbar></div> */}
      <ScrollRestoration></ScrollRestoration>
      <Outlet></Outlet>
    </div>
  );
}

export default RootLayout;
