"use client";

import { useState } from "react";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Successful = () => {
  return (
    <div
      className="outer_card"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(14px)",
      }}
    >
      <Card className="card flex-col items-center justify-center p-12">
        <CardHeader className="flex-col items-center justify-center gap-3">
          <img
            src="/assets/images/checked.png"
            alt="menu"
            width={150}
            height={150}
          />
          <cardTitle className="head_text text-center pt-12 w-[409px]">
            Your registration for the Nyeusi Music Competition is completed.
          </cardTitle>
          <CardDescription className="text-sm font-inter text-center w-[370px]">
            We're thrilled to have you join us in the competition. Keep an eye
            for further updates and announcements.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Successful;
