
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/now-ui-dashboard.scss?v1.5.0";
import "assets/css/demo.css";

import AdminLayout from "layouts/Admin.js";
import Login from "./account/Login";
import Register from "./account/Register";
import WelcomePage from "./account/WelcomePage";
import OTPVerify from "./account/OTPVerify";
import ForgetPasswordEmail from "./account/ForgetPasswordEmail";
import ForgetPasswordOTP from "./account/ForgetPasswordOTP";
import ForgetPasswordPass from "./account/ForgetPasswordPass";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<AdminLayout />} />
      <Route path="*" element={<WelcomePage to="/home" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<WelcomePage />} />
      <Route path="/otp-verify" element={<OTPVerify />} />
      <Route path="/email-pass" element={<ForgetPasswordEmail />} />
      <Route path="/otp-pass" element={<ForgetPasswordOTP />} />
      <Route path="/reset-pass" element={<ForgetPasswordPass />} />
    </Routes>
  </BrowserRouter>
);
