"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

const VerifyEmail = ({ email }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state added
  const [errorMessage, setErrorMessage] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleResendVerification = async () => {
    if (!email) {
      setErrorMessage("No email address available to resend verification.");
      return;
    }

    setLoading(true); // Set loading to true when resend starts

    try {
      const response = await axios.post(`${baseUrl}/resend-verification-token`, { email });

      if (response.status === 200) {
        setEmailSent(true);
        setErrorMessage(""); // Clear any previous errors
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to resend verification email."
      );
      setEmailSent(false); // Reset if failed
    } finally {
      setLoading(false); // Set loading to false when request completes
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
      <Card className="card flex-col items-center justify-center">
        <CardContent className="flex-col items-center justify-center gap-3">
          <CardHeader className="flex-col items-center justify-center gap-3">
            <img
              src="/assets/images/checked.png"
              alt="menu"
              width={140}
              height={140}
            />
          </CardHeader>
          <CardDescription className="text-lg font-medium font-mont text-center w-[380px] mb-1">
          We've sent an email to the address you provided. Please check your inbox, and remember to check your spam folder if you don't see it.
          </CardDescription>
          <CardDescription className="text-sm font-mont text-center w-[370px]">
            {emailSent ? (
              <span className="text-green-500 font-semibold">
                Verification email resent successfully!
              </span>
            ) : (
              <>
                Didn't get the mail?{" "}
                <span
                  onClick={handleResendVerification}
                  className="text-yellow-500 font-semibold cursor-pointer"
                >
                  {loading ? "Resending link..." : "Click to resend Link"}
                </span>
              </>
            )}
          </CardDescription>
          {errorMessage && (
            <CardDescription className="text-sm font-mont text-center w-[370px] text-red-500 mt-2">
              {errorMessage}
            </CardDescription>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
