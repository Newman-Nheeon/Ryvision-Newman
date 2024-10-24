"use client";

import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import Dashboard from "./Home";

const Login = () => {
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [responseLog, setResponseLog] = useState("");
  const [captchaValue, setCapchaValue] = useState(null);
  const recaptchaRef = useRef();
  const [errorLog, setErrorLog] = useState(""); // State to hold error messages

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      setErrorLog("Please verify that you are not a robot");
      return;
    }

    const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const apiURL = `${apiBaseURL}/admin/login`;

    try {
      const response = await axios.post(apiURL, { login, password, captcha: captchaValue });
      setResponseLog(`Response received: ${JSON.stringify(response.data)}`);
      console.log("Login Successful");

      // Store the token in localStorage
      const token = response.data.token;
      console.log("Token received:", token);
      localStorage.setItem("token", token);

      // Redirect to the dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login request failed with error:", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Login failed due to an unknown error.";
      setErrorLog(errorMessage); // Set error log to display below reCAPTCHA
    }
  };

  const handleForgetPassword = async (e) => {
    e.preventDefault();

    const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const apiURL = `${apiBaseURL}/admin/forget-password`;

    try {
      const response = await axios.post(apiURL, { login });
      setResponseLog(`Response received: ${JSON.stringify(response.data)}`);
      console.log("Forget Password Request Sent");
    } catch (error) {
      console.log("Forget Password Request Failed");
    }
  };

  const handleCaptchaChange = (value) => {
    setCapchaValue(value);
    if (value) {
      setErrorLog(""); // Clear error log if reCAPTCHA is completed
    }
  };

  return loggedIn ? (
    <Dashboard />
  ) : (
    <div
      className="p-[12px] rounded-xl shadow-2xl"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(14px)",
      }}
    >
      <Card className="card">
        <CardHeader>
          <CardTitle className="head_text w-auto sm:w-[484px]">Login</CardTitle>
          <CardDescription className="head_para">
            Enter password to login into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="label">
                  Email/Username
                </Label>
                <Input
                  name="email"
                  placeholder="Enter email"
                  className="input "
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="label">
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  className="input "
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="w-auto" style={{ width: "100%" }}>
                <ReCAPTCHA
                  className="w-full"
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                  size="normal"
                  inline={true}
                />
              </div>

              {errorLog && (
                <div className="log error_log text-red-500 mt-2">
                  {errorLog}
                </div>
              )}

              <p
                className="text-sm text-slate-500"
                onClick={handleForgetPassword}
              >
                Forget password?
              </p>
            </div>

            <Button type="submit" className="yellow_btn w-full mt-4">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
