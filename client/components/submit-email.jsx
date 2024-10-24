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
import VerifyEmail from "./VerifyEmail";

const submitEmail = () => {
  const [emailValid, setEmailValid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formValues, setFormValues] = useState({ email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state added
  const [requestLog, setRequestLog] = useState("");
  const [responseLog, setResponseLog] = useState("");
  const [errorLog, setErrorLog] = useState("");
  const [captchaValue, setCapchaValue] = useState(null);
  const recaptchaRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
  
    if (!emailValid || !formValues.email || !captchaValue) {
      let errorMessage = "";
      if (!captchaValue) {
        errorMessage = "Please verify that you are not a robot";
      }
      setErrorLog(errorMessage);
      return;
    }
  
    setLoading(true);
  
    const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const apiURL = `${apiBaseURL}/submit-email`;
  
    const emailData = { email: formValues.email, captcha: captchaValue };
  
    try {
      const response = await axios.post(apiURL, emailData);
      setShowConfirmation(true);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      setErrorLog(errorMessage);
  
      // Handle case when email is already verified
      if (error.response && error.response.data.message === "Email already verified") {
        setErrorLog(
          <>
            This email is already verified. Click{" "}
            <a href={`/complete-registration?email=${formValues.email}`} className="text-blue-500">
              here
            </a>{" "}
            to complete your registration.
          </>
        );
      }
    } finally {
      setLoading(false);
    }
  };
  

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    const isValid = validateEmail(emailValue);
    setEmailValid(isValid || emailValue === true);
    setFormValues({
      ...formValues,
      email: emailValue,
    });
  };

  const handleCaptchaChange = (value) => {
    setCapchaValue(value);

    if (value) {
      setErrorLog("");
    }
  };

  return (
    <div
      className="p-[12px] rounded-xl"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(14px)",
      }}
    >
      {!showConfirmation ? (
        <Card className="w-auto bg-white rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl-semibold tracking-wide mb-[8px]">
              Join Nyeusi Music Competition
            </CardTitle>
            <CardDescription className="text-base tracking-wide">
              Begin your journey by entering your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name" className="text-base font-inter">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    className="input"
                    value={formValues.email}
                    onChange={handleEmailChange}
                  />
                  {submitted && (!emailValid || !formValues.email) && (
                    <span className="error_log">
                      Please provide a valid email
                    </span>
                  )}
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
                  {errorLog && <div className="log error_log">{errorLog}</div>}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col justify-between">
            <Button
              className="yellow_btn w-full"
              onClick={handleSubmit}
              disabled={loading} // Disable button when loading
            >
              {loading ? "Submitting..." : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <VerifyEmail email={formValues.email} />
      )}
    </div>
  );
};

export default submitEmail;
